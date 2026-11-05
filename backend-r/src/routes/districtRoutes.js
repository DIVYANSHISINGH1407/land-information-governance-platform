const express = require("express");
const {
  getDistrictsByState,
  createDistrict,
} = require("../controllers/districtController");

const router = express.Router();

router.get("/:stateId", getDistrictsByState);
router.post("/", createDistrict);

module.exports = router;
