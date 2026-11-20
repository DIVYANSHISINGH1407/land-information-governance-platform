const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");
const stateRoutes = require("./routes/stateRoutes");
const districtRoutes = require("./routes/districtRoutes");
const tehsilRoutes = require("./routes/tehsilRoutes");
const villageRoutes = require("./routes/villageRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const authRoutes = require("./routes/authRoutes");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const port = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.CLIENT_ORIGIN ||
  "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  if (
    req.method === "POST" &&
    (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
  ) {
    return res.status(400).json({
      success: false,
      message: "Send the request body as a JSON object.",
    });
  }

  return next();
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "BhoomiSetu backend is running" });
});

app.use("/api/states", stateRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/tehsils", tehsilRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/auth", authRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

async function startServer() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is missing from backend-r/.env.");
  }

  await connectDatabase();

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(port, () => resolve(listener));
    listener.once("error", reject);
  });

  console.log(`Backend listening on port ${port}.`);
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
