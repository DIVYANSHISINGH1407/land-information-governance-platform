
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5175",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("BhumiSetu Backend is running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
