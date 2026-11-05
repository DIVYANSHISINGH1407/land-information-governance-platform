
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword,
            role
        } = req.body;

        // 1. Check required fields
        if (!fullName || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({
                message: "Please provide all required fields."
            });
        }

        // 2. Check input types
        if (
            typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof confirmPassword !== "string" ||
            typeof role !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input types."
            });
        }

        // 3. Normalize inputs
        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName) {
            return res.status(400).json({
                message: "Name cannot be empty."
            });
        }

        // 4. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        // 5. Validate password
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters."
            });
        }

        // 6. Check password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match."
            });
        }

        // 7. Validate role
        if (!["public", "government"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role."
            });
        }

        // 8. Check duplicate email
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        // 9. Create user
        const user = await User.create({
            fullName: cleanName,
            email: cleanEmail,
            password,
            role
        });

        // 10. Send response
        return res.status(201).json({
            message: "Registration successful!",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                governmentId: user.governmentId
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        // Handle duplicate-key database errors
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        return res.status(500).json({
            message: "Server error during registration."
        });
    }
};






const loginUser = async (req, res) => {
    try {
        const { email, password, governmentId } = req.body;

        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // 2. Validate input types
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            (governmentId !== undefined &&
                typeof governmentId !== "string")
        ) {
            return res.status(400).json({
                message: "Invalid input types."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            return res.status(400).json({
                message: "Email cannot be empty."
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password cannot be empty."
            });
        }

        // 3. Determine account type and validate Government ID
        const isGovernmentLogin = governmentId !== undefined;

        if (isGovernmentLogin && !governmentId.trim()) {
            return res.status(400).json({
                message: "Government ID cannot be empty."
            });
        }

        // 4. Find user based on account type
        let user;

        if (isGovernmentLogin) {
            user = await User.findOne({
                email: cleanEmail,
                governmentId: governmentId.trim(),
                role: "government"
            }).select("+password");
        } else {
            user = await User.findOne({
                email: cleanEmail,
                role: "public"
            }).select("+password");
        }

        if (!user) {
            return res.status(401).json({
                message: "Invalid login credentials."
            });
        }

        // 5. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid login credentials."
            });
        }

        // 6. Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // 7. Store JWT in HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // 8. Send response
        return res.status(200).json({
            message: "Login successful!",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                governmentId: user.governmentId
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error during login."
        });
    }
};




const getMe = async (req, res) => {
    return res.status(200).json({
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            role: req.user.role,
            governmentId: req.user.governmentId
        }
    });
};



const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json({
        message: "Logout successful!"
    });
};



module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser
};