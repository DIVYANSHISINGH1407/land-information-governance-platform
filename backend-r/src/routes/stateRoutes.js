const express = require("express");
const { getStates, createState } = require("../controllers/stateController");

const router = express.Router();

router.get("/", getStates);
router.post("/", createState);

module.exports = router;
