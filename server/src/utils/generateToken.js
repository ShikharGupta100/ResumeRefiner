// server/src/utils/generateToken.js
const jwt    = require("jsonwebtoken");
const crypto = require("crypto");

function generateJWT(userId) {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// ✅ Replaces generateVerificationToken
function generateOTP() {
    const otp    = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const hash   = crypto.createHash("sha256").update(otp).digest("hex");
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return { otp, hash, expiry };
}

module.exports = { generateJWT, generateOTP };