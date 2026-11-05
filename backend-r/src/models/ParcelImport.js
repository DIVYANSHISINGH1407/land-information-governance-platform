const mongoose = require("mongoose");

// Keeps source rows that do not yet have verified links to the location hierarchy.
const parcelImportSchema = new mongoose.Schema(
  {
    parcelId: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    khasraNumber: { type: String, required: true, trim: true },
    recordedArea: { type: Number, required: true, min: 0 },
    areaUnit: { type: String, required: true, trim: true },
    landUse: { type: String, required: true, trim: true },
    revenueRecord: { type: String, required: true, trim: true },
    verificationStatus: { type: String, required: true, trim: true },
  },
  { collection: "parcel_imports", versionKey: false },
);

parcelImportSchema.index({ parcelId: 1 }, { unique: true });

module.exports = mongoose.model("ParcelImport", parcelImportSchema);
