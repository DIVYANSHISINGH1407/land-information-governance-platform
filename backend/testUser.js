
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const User = require("./models/user");

const testUser = async () => {
    try {
        await connectDB();

        // Ensure indexes are ready before testing
        await User.init();

        // Create a public user
        const publicUser = await User.create({
            fullName: "Test Public User",
            email: "testpublic@example.com",
            password: "public123",
            role: "public"
        });

        // Create a government user
        const governmentUser = await User.create({
            fullName: "Test Government User",
            email: "testgov@example.com",
            password: "government123",
            role: "government"
        });

        console.log("\n--- Public User ---");
        console.log("Name:", publicUser.fullName);
        console.log("Role:", publicUser.role);
        console.log("Government ID:", publicUser.governmentId);

        console.log("\n--- Government User ---");
        console.log("Name:", governmentUser.fullName);
        console.log("Role:", governmentUser.role);
        console.log("Government ID:", governmentUser.governmentId);

        // Check whether the password was hashed
        const isHashed = publicUser.password !== "public123";
        console.log("\nPassword hashed:", isHashed);

        // Verify the password
        const passwordMatches = await bcrypt.compare(
            "public123",
            publicUser.password
        );

        console.log("Password verification:", passwordMatches);

        // Delete the temporary test users
        await User.deleteMany({
            email: {
                $in: [
                    "testpublic@example.com",
                    "testgov@example.com"
                ]
            }
        });

console.log("\nTest users deleted successfully!");

    } catch (error) {
        console.error("Test failed:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("\nDatabase disconnected.");
    }
};

testUser();
