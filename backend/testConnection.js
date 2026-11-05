
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");

const testConnection = async () => {
    try {
        await connectDB();

        console.log("Connection test successful!");

        await mongoose.disconnect();
        console.log("Database disconnected.");

    } catch (error) {
        process.exitCode = 1;
    }
};

testConnection();
