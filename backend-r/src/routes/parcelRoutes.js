const express = require("express");
const {
  createParcel,
  getParcelById,
  getStateLandUseSummary,
  searchParcels,
} = require("../controllers/parcelController");

const router = express.Router();

// Keep the fixed /search path before /:parcelId so "search" is not treated as an ID.
router.get("/search", searchParcels);
router.get("/summary", getStateLandUseSummary);
router.get("/", searchParcels);
router.post("/", createParcel);
router.get("/:parcelId", getParcelById);

module.exports = router;
