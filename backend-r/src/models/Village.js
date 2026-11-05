const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  tehsilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tehsil",
    required: true,
  },
});

villageSchema.index({ name: 1, tehsilId: 1 }, { unique: true });

module.exports = mongoose.model("Village", villageSchema);
