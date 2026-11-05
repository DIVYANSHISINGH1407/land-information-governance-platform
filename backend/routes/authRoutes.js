
const express = require("express");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe,
    logoutUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);  // Get logged-in user
router.post("/logout", logoutUser);
router.get(
    "/government-dashboard",
    protect,
    authorizeRoles("government"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the Government Dashboard!",
            user: {
                name: req.user.fullName,
                role: req.user.role
            }
        });
    }
);

module.exports = router;
