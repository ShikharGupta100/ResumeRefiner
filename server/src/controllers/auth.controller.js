// server/src/controllers/auth.controller.js
const crypto = require("crypto");
const User   = require("../models/user.model");
const { generateJWT, generateVerificationToken } = require("../utils/generateToken");
const { sendVerificationEmail }                  = require("../services/email.service");

// ── Register ──────────────────────────────────────────────────────────────────
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false, code: "MISSING_FIELDS",
        message: "Name, email and password are required.",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false, code: "EMAIL_IN_USE",
        message: "An account with this email already exists.",
      });
    }

    const { token, hash, expiry } = generateVerificationToken();

    const user = await User.create({
      name, email, password,
      verificationToken:       hash,
      verificationTokenExpiry: expiry,
    });

    await sendVerificationEmail(email, name, token);

    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email to verify your account.",
    });

  } catch (err) {
    console.error("[register]:", err.message);
    return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Registration failed." });
  }
}

// ── Verify Email ──────────────────────────────────────────────────────────────
async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, code: "MISSING_TOKEN", message: "Verification token missing." });
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken:       hash,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false, code: "INVALID_TOKEN",
        message: "Token is invalid or has expired.",
      });
    }

    user.isVerified              = true;
    user.verificationToken       = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    const jwt = generateJWT(user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      token:   jwt,
      user:    { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("[verifyEmail]:", err.message);
    return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Verification failed." });
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false, code: "MISSING_FIELDS",
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false, code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        success: false, code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false, code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before logging in.",
      });
    }

    const token = generateJWT(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("[login]:", err.message);
    return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Login failed." });
  }
}

// ── Google OAuth callback ─────────────────────────────────────────────────────
async function googleCallback(req, res) {
  try {
    const token = generateJWT(req.user._id);
    // Redirect to frontend with token in query param
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
}

// ── Get current user ──────────────────────────────────────────────────────────
async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
}

module.exports = { register, verifyEmail, login, googleCallback, getMe };