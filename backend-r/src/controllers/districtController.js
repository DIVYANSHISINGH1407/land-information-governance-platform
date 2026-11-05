const mongoose = require("mongoose");
const District = require("../models/District");
const State = require("../models/State");
const ParcelImport = require("../models/ParcelImport");

async function getDistrictsByState(req, res) {
  const { stateId } = req.params;

  if (stateId.startsWith("source|")) {
    const stateName = stateId.slice("source|".length);
    const districts = await ParcelImport.distinct("district", { state: stateName });
    const data = districts
      .filter(Boolean)
      .sort((first, second) => first.localeCompare(second))
      .map((name) => ({ _id: `source|${stateName}|${name}`, name, state: stateName }));
    return res.json({
      success: true,
      count: data.length,
      data,
      message: "Districts loaded from imported parcel records.",
    });
  }

  if (!mongoose.isValidObjectId(stateId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid stateId." });
  }

  const state = await State.findById(stateId);
  if (!state) {
    return res
      .status(404)
      .json({ success: false, message: "State not found." });
  }

  const districts = await District.find({ stateId }).sort({ name: 1 });
  return res.json({ success: true, count: districts.length, data: districts });
}

async function createDistrict(req, res) {
  const { name, stateId } = req.body;

  if (!mongoose.isValidObjectId(stateId)) {
    return res
      .status(400)
      .json({ success: false, message: "A valid stateId is required." });
  }

  const state = await State.findById(stateId);
  if (!state) {
    return res
      .status(404)
      .json({ success: false, message: "State not found." });
  }

  const district = await District.create({ name, stateId });
  return res.status(201).json({ success: true, data: district });
}

module.exports = { getDistrictsByState, createDistrict };
