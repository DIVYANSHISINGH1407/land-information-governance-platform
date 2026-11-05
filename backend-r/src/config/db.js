const mongoose = require("mongoose");

async function connectDatabase() {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error(
      "MONGODB_URI is missing",
    );
  }

  try {
    await mongoose.connect(connectionString, {
      dbName: process.env.MONGODB_DB || "new_database",
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = connectDatabase;
