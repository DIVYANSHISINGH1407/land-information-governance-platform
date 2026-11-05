const express = require("express");
const {
  getTehsilsByDistrict,
  createTehsil,
} = require("../controllers/tehsilController");

const router = express.Router();

router.get("/:districtId", getTehsilsByDistrict);
router.post("/", createTehsil);

module.exports = router;
