const express = require("express");
const {
  getVillagesByTehsil,
  getSourceVillages,
  createVillage,
} = require("../controllers/villageController");

const router = express.Router();

router.get("/source/:stateName/:districtName", getSourceVillages);
router.get("/:tehsilId", getVillagesByTehsil);
router.post("/", createVillage);

module.exports = router;
