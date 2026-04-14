const express  = require("express");
const passport = require("passport");
const router   = express.Router();
const {
    register, verifyEmail, resendOtp,
    login, googleCallback, getMe
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// Email/password
router.post("/register",     register);
router.post("/verify-email", verifyEmail);  // ✅ POST + req.body (was GET + req.query)
router.post("/resend-otp",   resendOtp);    // ✅ New route
router.post("/login",        login);

// Google OAuth
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
        session: false
    }),
    googleCallback
);

// Protected
router.get("/me", protect, getMe);

module.exports = router;