const mongoose = require("mongoose");
const District = require("../models/District");
const Tehsil = require("../models/Tehsil");

async function getTehsilsByDistrict(req, res) {
  const { districtId } = req.params;

  if (districtId.startsWith("source|")) {
    return res.json({
      success: true,
      count: 0,
      data: [],
      message: "Tehsil information is not included in the imported parcel records.",
    });
  }

  if (!mongoose.isValidObjectId(districtId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid districtId." });
  }

  const district = await District.findById(districtId);
  if (!district) {
    return res
      .status(404)
      .json({ success: false, message: "District not found." });
  }

  const tehsils = await Tehsil.find({ districtId }).sort({ name: 1 });
  return res.json({ success: true, count: tehsils.length, data: tehsils });
}

async function createTehsil(req, res) {
  const { name, districtId } = req.body;

  if (!mongoose.isValidObjectId(districtId)) {
    return res
      .status(400)
      .json({ success: false, message: "A valid districtId is required." });
  }

  const district = await District.findById(districtId);
  if (!district) {
    return res
      .status(404)
      .json({ success: false, message: "District not found." });
  }

  const tehsil = await Tehsil.create({ name, districtId });
  return res.status(201).json({ success: true, data: tehsil });
}

module.exports = { getTehsilsByDistrict, createTehsil };
