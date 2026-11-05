const express = require("express");
const {
  currentUser,
  login,
  logout,
  register,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", currentUser);
router.post("/logout", logout);

module.exports = router;
