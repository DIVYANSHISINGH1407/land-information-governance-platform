const mongoose = require("mongoose");
const District = require("../models/District");
const Parcel = require("../models/Parcel");
const ParcelImport = require("../models/ParcelImport");
const State = require("../models/State");
const Tehsil = require("../models/Tehsil");
const Village = require("../models/Village");

const locationDetails = {
  path: "villageId",
  populate: {
    path: "tehsilId",
    populate: {
      path: "districtId",
      populate: { path: "stateId" },
    },
  },
};

function invalidRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function cleanText(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw invalidRequest(`${name} must be a non-empty text value.`);
  }
  return value.trim();
}

function exactName(value) {
  return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}

function validateId(value, name) {
  if (!mongoose.isValidObjectId(value)) {
    throw invalidRequest(`${name} must be a valid MongoDB id.`);
  }
}

function toProfile(parcel, imported = false) {
  if (imported) {
    return {
      ...parcel,
      _id: parcel._id,
      source: "parcel_imports",
      villageId: null,
      location: {
        village: parcel.village,
        tehsil: null,
        district: parcel.district,
        state: parcel.state || null,
      },
      ownershipRecord: null,
      cadastralMap: null,
      registrationRecord: null,
    };
  }

  const village = parcel.villageId;
  const tehsil = village && village.tehsilId;
  const district = tehsil && tehsil.districtId;
  const state = district && district.stateId;

  return {
    ...parcel,
    source: "parcels",
    location: {
      village: village && village.name,
      tehsil: tehsil && tehsil.name,
      district: district && district.name,
      state: state && state.name,
    },
    ownershipRecord: parcel.ownershipRecord || null,
    cadastralMap: parcel.cadastralMap || null,
    registrationRecord: parcel.registrationRecord || null,
  };
}

async function locationFilters(query, parcelFilter, importedFilter) {
  if (query.stateId !== undefined) {
    if (query.stateId.startsWith("source|")) {
      importedFilter.state = query.stateId.slice("source|".length);
    } else {
      validateId(query.stateId, "stateId");
      const state = await State.findById(query.stateId);
      if (!state) throw invalidRequest("State was not found.");
      const districts = await District.find({ stateId: state._id }).select("_id");
      const tehsils = await Tehsil.find({ districtId: { $in: districts.map((item) => item._id) } }).select("_id");
      const villages = await Village.find({ tehsilId: { $in: tehsils.map((item) => item._id) } }).select("_id");
      parcelFilter.villageId = { $in: villages.map((item) => item._id) };
      importedFilter.state = state.name;
    }
  }

  if (query.districtId !== undefined) {
    if (query.districtId.startsWith("source|")) {
      const [, stateName, districtName] = query.districtId.split("|");
      importedFilter.state = stateName;
      importedFilter.district = districtName;
    } else {
      validateId(query.districtId, "districtId");
      const district = await District.findById(query.districtId);
      if (!district) throw invalidRequest("District was not found.");
      const tehsils = await Tehsil.find({ districtId: district._id }).select("_id");
      const villages = await Village.find({
        tehsilId: { $in: tehsils.map((item) => item._id) },
      }).select("_id");
      parcelFilter.villageId = { $in: villages.map((item) => item._id) };
      importedFilter.district = district.name;
    }
  }

  if (query.tehsilId !== undefined) {
    validateId(query.tehsilId, "tehsilId");
    const tehsil = await Tehsil.findById(query.tehsilId);
    if (!tehsil) throw invalidRequest("Tehsil was not found.");
    const villages = await Village.find({ tehsilId: tehsil._id }).select("_id name");
    parcelFilter.villageId = { $in: villages.map((item) => item._id) };
    importedFilter.village = { $in: villages.map((item) => item.name) };
  }

  if (query.villageId !== undefined) {
    if (query.villageId.startsWith("source|")) {
      const [, stateName, districtName, villageName] = query.villageId.split("|");
      importedFilter.state = stateName;
      importedFilter.district = districtName;
      importedFilter.village = villageName;
    } else {
      validateId(query.villageId, "villageId");
      const village = await Village.findById(query.villageId).populate({
        path: "tehsilId",
        populate: { path: "districtId" },
      });
      if (!village) throw invalidRequest("Village was not found.");
      parcelFilter.villageId = village._id;
      importedFilter.village = village.name;
      if (village.tehsilId && village.tehsilId.districtId) {
        importedFilter.district = village.tehsilId.districtId.name;
        importedFilter.state = await State.findById(village.tehsilId.districtId.stateId).then((item) => item?.name);
      }
    }
  }
}

async function searchParcels(req, res) {
  const allowedKeys = new Set([
    "stateId",
    "districtId",
    "tehsilId",
    "villageId",
    "district",
    "village",
    "khasraNumber",
    "parcelId",
    "page",
    "limit",
  ]);
  const unknownKey = Object.keys(req.query).find((key) => !allowedKeys.has(key));
  if (unknownKey) throw invalidRequest(`Unsupported search parameter: ${unknownKey}.`);

  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
  if (!Number.isSafeInteger(page) || page < 1) throw invalidRequest("page must be a positive whole number.");
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw invalidRequest("limit must be a whole number from 1 to 100.");
  }

  const parcelFilter = {};
  const importedFilter = {};
  await locationFilters(req.query, parcelFilter, importedFilter);
  const canSearchImportedRows = req.query.tehsilId === undefined;

  if (req.query.district !== undefined) {
    const district = cleanText(req.query.district, "district");
    const districtPattern = exactName(district);
    const districts = await District.find({ name: districtPattern }).select("_id");
    const tehsils = await Tehsil.find({ districtId: { $in: districts.map((item) => item._id) } }).select("_id");
    const villages = await Village.find({ tehsilId: { $in: tehsils.map((item) => item._id) } }).select("_id");
    parcelFilter.villageId = { $in: villages.map((item) => item._id) };
    importedFilter.district = districtPattern;
  }

  if (req.query.village !== undefined) {
    const village = cleanText(req.query.village, "village");
    const villagePattern = exactName(village);
    parcelFilter.villageId = { $in: await Village.distinct("_id", { name: villagePattern }) };
    importedFilter.village = villagePattern;
  }
  if (req.query.parcelId !== undefined) {
    const parcelId = cleanText(req.query.parcelId, "parcelId");
    parcelFilter.parcelId = parcelId;
    importedFilter.parcelId = parcelId;
  }
  if (req.query.khasraNumber !== undefined) {
    const khasraNumber = cleanText(req.query.khasraNumber, "khasraNumber");
    parcelFilter.khasraNumber = khasraNumber;
    importedFilter.khasraNumber = khasraNumber;
  }

  const [records, sourceRecords, total, importedTotal] = await Promise.all([
    Parcel.find(parcelFilter).populate(locationDetails).lean().sort({ parcelId: 1 }),
    canSearchImportedRows
      ? ParcelImport.find(importedFilter).lean().sort({ parcelId: 1 })
      : Promise.resolve([]),
    Parcel.countDocuments(parcelFilter),
    canSearchImportedRows ? ParcelImport.countDocuments(importedFilter) : Promise.resolve(0),
  ]);

  const combined = records.map((parcel) => toProfile(parcel));
  for (const parcel of sourceRecords) combined.push(toProfile(parcel, true));
  combined.sort((first, second) => first.parcelId.localeCompare(second.parcelId));

  const totalRecords = total + importedTotal;
  const start = (page - 1) * limit;
  const data = combined.slice(start, start + limit);

  return res.json({
    success: true,
    message: "Parcel search completed.",
    data,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
  });
}

async function getStateLandUseSummary(req, res) {
  const stateId = cleanText(req.query.stateId, "stateId");
  let stateName;
  let villageIds = [];

  if (stateId.startsWith("source|")) {
    stateName = stateId.slice("source|".length);
  } else {
    validateId(stateId, "stateId");
    const state = await State.findById(stateId);
    if (!state) throw invalidRequest("State was not found.");
    stateName = state.name;

    const districts = await District.find({ stateId: state._id }).select("_id");
    const tehsils = await Tehsil.find({ districtId: { $in: districts.map((item) => item._id) } }).select("_id");
    const villages = await Village.find({
      tehsilId: { $in: tehsils.map((item) => item._id) },
    }).select("_id");
    villageIds = villages.map((item) => item._id);
  }

  const [sourceGroups, linkedGroups] = await Promise.all([
    ParcelImport.aggregate([
      { $match: { state: stateName } },
      {
        $group: {
          _id: "$landUse",
          recordCount: { $sum: 1 },
          totalArea: { $sum: "$recordedArea" },
          areaUnits: { $addToSet: "$areaUnit" },
        },
      },
    ]),
    villageIds.length
      ? Parcel.aggregate([
          { $match: { villageId: { $in: villageIds } } },
          {
            $group: {
              _id: "$landUse",
              recordCount: { $sum: 1 },
              totalArea: { $sum: "$recordedArea" },
              areaUnits: { $addToSet: "$areaUnit" },
            },
          },
        ])
      : Promise.resolve([]),
  ]);

  const categoriesByName = new Map();
  for (const group of [...sourceGroups, ...linkedGroups]) {
    const name = group._id || "Not specified";
    const current = categoriesByName.get(name) || {
      landUse: name,
      recordCount: 0,
      recordedArea: [],
    };
    current.recordCount += group.recordCount;
    const units = group.areaUnits.filter(Boolean);
    if (units.length === 1) {
      current.recordedArea.push({ area: group.totalArea, unit: units[0] });
    }
    categoriesByName.set(name, current);
  }

  const categories = [...categoriesByName.values()].sort((first, second) =>
    first.landUse.localeCompare(second.landUse),
  );
  const totalRecords = categories.reduce((sum, category) => sum + category.recordCount, 0);
  const data = categories.map((category) => ({
    ...category,
    share: totalRecords ? Number(((category.recordCount / totalRecords) * 100).toFixed(1)) : 0,
  }));

  return res.json({
    success: true,
    message: "State land-use summary loaded from parcel records.",
    data,
    totalRecords,
    state: stateName,
    basis: "record_count",
  });
}

async function getParcelById(req, res) {
  const parcelId = cleanText(req.params.parcelId, "parcelId");
  const parcel = await Parcel.findOne({ parcelId }).populate(locationDetails).lean();
  if (parcel) {
    return res.json({ success: true, message: "Parcel profile loaded.", data: toProfile(parcel) });
  }

  const imported = await ParcelImport.findOne({ parcelId }).lean();
  if (!imported) {
    return res.status(404).json({ success: false, message: "Parcel not found." });
  }
  return res.json({
    success: true,
    message: "Parcel profile loaded.",
    data: toProfile(imported, true),
  });
}

async function createParcel(req, res) {
  const { villageId } = req.body;
  if (!mongoose.isValidObjectId(villageId)) {
    throw invalidRequest("A valid villageId is required.");
  }
  const village = await Village.findById(villageId);
  if (!village) return res.status(404).json({ success: false, message: "Village not found." });

  const parcel = await Parcel.create({
    parcelId: req.body.parcelId,
    villageId,
    khasraNumber: req.body.khasraNumber,
    recordedArea: req.body.recordedArea,
    areaUnit: req.body.areaUnit,
    landUse: req.body.landUse,
    revenueRecord: req.body.revenueRecord,
    verificationStatus: req.body.verificationStatus,
    ownershipRecord: req.body.ownershipRecord,
    cadastralMap: req.body.cadastralMap,
    registrationRecord: req.body.registrationRecord,
  });

  return res.status(201).json({ success: true, message: "Parcel created.", data: parcel });
}

module.exports = { searchParcels, getStateLandUseSummary, getParcelById, createParcel };
