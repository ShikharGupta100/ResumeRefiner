const crypto = require("crypto");
const User   = require("../models/user.model");
const { generateJWT, generateOTP }      = require("../utils/generateToken");
const { sendVerificationEmail }         = require("../services/email.service");

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
        if (exists && exists.isVerified) {
            return res.status(409).json({
                success: false, code: "EMAIL_IN_USE",
                message: "An account with this email already exists.",
            });
        }

        const { otp, hash, expiry } = generateOTP();

        if (exists && !exists.isVerified) {
            // ✅ User registered before but never verified — resend OTP
            exists.otpHash   = hash;
            exists.otpExpiry = expiry;
            await exists.save();
        } else {
            // ✅ Brand new user
            await User.create({
                name, email, password,
                otpHash:   hash,
                otpExpiry: expiry,
            });
        }

        sendVerificationEmail(email, name, otp).catch(err =>
            console.error("[email failed]:", err.message)
        );

        return res.status(201).json({
            success: true,
            message: "Account created. Please check your email for the OTP.",
        });

    } catch (err) {
        console.error("[register]:", err.message);
        return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Registration failed." });
    }
}

// ── Verify Email ──────────────────────────────────────────────────────────────
async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body; // ✅ reads from body, not query

        if (!email || !otp) {
            return res.status(400).json({
                success: false, code: "MISSING_FIELDS",
                message: "Email and OTP are required.",
            });
        }

        const hash = crypto.createHash("sha256").update(otp).digest("hex");

        const user = await User.findOne({
            email,
            otpHash:   hash,
            otpExpiry: { $gt: new Date() }, // ✅ not expired
        });

        if (!user) {
            return res.status(400).json({
                success: false, code: "INVALID_OTP",
                message: "OTP is invalid or has expired.",
            });
        }

        // ✅ Clear OTP fields after successful verification
        user.isVerified = true;
        user.otpHash    = undefined;
        user.otpExpiry  = undefined;
        await user.save();

        const token = generateJWT(user._id);

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (err) {
        console.error("[verifyEmail]:", err.message);
        return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Verification failed." });
    }
}

// ── Resend OTP ────────────────────────────────────────────────────────────────
async function resendOtp(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false, code: "MISSING_FIELDS",
                message: "Email is required.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false, code: "USER_NOT_FOUND",
                message: "No account found with this email.",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false, code: "ALREADY_VERIFIED",
                message: "This email is already verified.",
            });
        }

        const { otp, hash, expiry } = generateOTP();
        user.otpHash   = hash;
        user.otpExpiry = expiry;
        await user.save();

        sendVerificationEmail(email, user.name, otp).catch(err =>
            console.error("[email failed]:", err.message)
        );

        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email.",
        });

    } catch (err) {
        console.error("[resendOtp]:", err.message);
        return res.status(500).json({ success: false, code: "INTERNAL_ERROR", message: "Failed to resend OTP." });
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

module.exports = { register, verifyEmail, resendOtp, login, googleCallback, getMe };