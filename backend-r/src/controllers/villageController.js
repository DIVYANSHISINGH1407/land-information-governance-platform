const mongoose = require("mongoose");
const Tehsil = require("../models/Tehsil");
const Village = require("../models/Village");
const ParcelImport = require("../models/ParcelImport");

async function getSourceVillages(req, res) {
  const { stateName, districtName } = req.params;
  const villages = await ParcelImport.distinct("village", {
    state: stateName,
    district: districtName,
  });
  const data = villages
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second))
    .map((name) => ({
      _id: `source|${stateName}|${districtName}|${name}`,
      name,
      district: districtName,
      state: stateName,
    }));

  return res.json({
    success: true,
    count: data.length,
    data,
    message: "Villages loaded from imported parcel records.",
  });
}

async function getVillagesByTehsil(req, res) {
  const { tehsilId } = req.params;

  if (!mongoose.isValidObjectId(tehsilId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid tehsilId." });
  }

  const tehsil = await Tehsil.findById(tehsilId);
  if (!tehsil) {
    return res
      .status(404)
      .json({ success: false, message: "Tehsil not found." });
  }

  const villages = await Village.find({ tehsilId }).sort({ name: 1 });
  return res.json({ success: true, count: villages.length, data: villages });
}

async function createVillage(req, res) {
  const { name, tehsilId } = req.body;

  if (!mongoose.isValidObjectId(tehsilId)) {
    return res
      .status(400)
      .json({ success: false, message: "A valid tehsilId is required." });
  }

  const tehsil = await Tehsil.findById(tehsilId);
  if (!tehsil) {
    return res
      .status(404)
      .json({ success: false, message: "Tehsil not found." });
  }

  const village = await Village.create({ name, tehsilId });
  return res.status(201).json({ success: true, data: village });
}

module.exports = { getVillagesByTehsil, getSourceVillages, createVillage };
