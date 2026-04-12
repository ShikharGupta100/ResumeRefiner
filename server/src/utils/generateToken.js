// server/src/utils/generateToken.js
const jwt    = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Signs a JWT for the given user ID.
 * Expires in 7 days by default.
 */
function generateJWT(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Generates a secure random token for email verification.
 * Returns { token (plain), hash (to store in DB), expiry }
 */
function generateVerificationToken() {
  const token  = crypto.randomBytes(32).toString("hex");
  const hash   = crypto.createHash("sha256").update(token).digest("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, hash, expiry };
}

module.exports = { generateJWT, generateVerificationToken };