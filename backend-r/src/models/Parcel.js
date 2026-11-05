const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    parcelId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    villageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
    },
    khasraNumber: {
      type: String,
      required: true,
      trim: true,
    },
    recordedArea: {
      type: Number,
      required: true,
      min: 0,
    },
    areaUnit: {
      type: String,
      required: true,
      trim: true,
    },
    landUse: {
      type: String,
      required: true,
      trim: true,
    },
    revenueRecord: {
      type: String,
      required: true,
      trim: true,
    },
    verificationStatus: {
      type: String,
      required: true,
      trim: true,
    },
    ownershipRecord: {
      availability: { type: String, trim: true },
      reference: { type: String, trim: true },
    },
    cadastralMap: {
      availability: { type: String, trim: true },
      mapUrl: { type: String, trim: true },
    },
    registrationRecord: {
      availability: { type: String, trim: true },
      reference: { type: String, trim: true },
      documentUrl: { type: String, trim: true },
    },
  },
  { timestamps: true },
);

parcelSchema.index({ villageId: 1, khasraNumber: 1 }, { unique: true });

module.exports = mongoose.model("Parcel", parcelSchema);
