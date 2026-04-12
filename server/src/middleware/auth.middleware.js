// server/src/middleware/auth.middleware.js
const jwt  = require("jsonwebtoken");
const User = require("../models/user.model");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      code:    "UNAUTHORIZED",
      message: "No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        code:    "UNAUTHORIZED",
        message: "User no longer exists.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        code:    "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before continuing.",
      });
    }

    req.user = user; // attach user to every protected request
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      code:    "INVALID_TOKEN",
      message: "Token is invalid or expired.",
    });
  }
}

module.exports = { protect };