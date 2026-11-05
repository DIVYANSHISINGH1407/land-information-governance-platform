const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["public", "government"],
      required: true,
    },
    governmentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
