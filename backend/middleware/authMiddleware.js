
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");
            return res.status(500).json({
                message: "Server configuration error."
            });
        }

        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized. Please log in."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        if (!decoded.userId || !decoded.role) {
            return res.status(401).json({
                message: "Invalid authentication token."
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists."
            });
        }

        // Use the current database role, not just the JWT role.
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again."
        });
    }
};

module.exports = protect;
