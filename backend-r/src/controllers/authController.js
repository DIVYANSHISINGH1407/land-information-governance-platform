const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/User");

const scrypt = promisify(crypto.scrypt);
const sessionCookieName = "bhumisetu_session";
const sessionLengthSeconds = 7 * 24 * 60 * 60;

function getSessionSecret() {
  if (!process.env.AUTH_SECRET) {
    const error = new Error("AUTH_SECRET is missing from the backend .env file.");
    error.status = 500;
    throw error;
  }

  return process.env.AUTH_SECRET;
}

function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    governmentId: user.governmentId || null,
  };
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

async function passwordMatches(password, savedHash) {
  const [salt, savedValue] = savedHash.split(":");
  const savedBuffer = Buffer.from(savedValue, "hex");
  const enteredBuffer = await scrypt(password, salt, savedBuffer.length);

  return crypto.timingSafeEqual(savedBuffer, enteredBuffer);
}

function createSessionToken(userId) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLengthSeconds;
  const payload = `${userId}.${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

function readSessionUserId(req) {
  const cookies = (req.headers.cookie || "").split(";");
  const sessionCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${sessionCookieName}=`),
  );

  if (!sessionCookie) return null;

  const token = sessionCookie.trim().slice(sessionCookieName.length + 1);
  const [userId, expiresAt, signature] = token.split(".");
  if (!userId || !expiresAt || !signature || Number(expiresAt) < Date.now() / 1000) {
    return null;
  }

  const payload = `${userId}.${expiresAt}`;
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  return userId;
}

function setSessionCookie(res, userId) {
  res.cookie(sessionCookieName, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionLengthSeconds * 1000,
    path: "/",
  });
}

async function register(req, res, next) {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const role = String(req.body.role || "");

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Fill in all required fields." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }
    if (!["public", "government"].includes(role)) {
      return res.status(400).json({ success: false, message: "Choose a supported account type." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const userData = {
      fullName,
      email,
      passwordHash: await hashPassword(password),
      role,
    };

    if (role === "government") {
      userData.governmentId = `GOV-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    }

    const user = await User.create(userData);
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const governmentId = String(req.body.governmentId || "").trim().toUpperCase();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Enter your email and password." });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !(await passwordMatches(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Email or password is incorrect." });
    }
    if (user.role === "government" && governmentId !== user.governmentId) {
      return res.status(401).json({ success: false, message: "Government ID is incorrect." });
    }
    if (user.role === "public" && governmentId) {
      return res.status(400).json({ success: false, message: "Public accounts do not use a Government ID." });
    }

    setSessionCookie(res, user._id);
    return res.json({ success: true, message: "Logged in successfully.", user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function currentUser(req, res, next) {
  try {
    const userId = readSessionUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "You are not logged in." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Your session is no longer valid." });
    }

    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  res.clearCookie(sessionCookieName, { httpOnly: true, sameSite: "lax", path: "/" });
  return res.json({ success: true, message: "Logged out successfully." });
}

module.exports = { currentUser, login, logout, register };
