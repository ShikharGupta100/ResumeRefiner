const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const passport   = require("./config/passport");
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");

const app = express();
app.set("trust proxy", 1);

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed.`));
    }
  },
  methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ added PUT/PATCH
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:    true,
}));

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Passport ────────────────────────────────────────────────────────────────
app.use(passport.initialize()); // ✅ before routes

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true, status: "ok",
    uptime: `${Math.floor(process.uptime())}s`,
    env: process.env.NODE_ENV || "development",
    ts: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/resumes", resumeRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false, code: "NOT_FOUND",
    message: `Route '${req.method} ${req.originalUrl}' does not exist.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ success: false, code: "CORS_ERROR", message: err.message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, code: "INVALID_JSON", message: "Request body contains invalid JSON." });
  }
  if (err.status === 413 || err.type === "entity.too.large") {
    return res.status(413).json({ success: false, code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds 50kb limit." });
  }
  console.error(`[GlobalError] ${err.status || 500} — ${err.message}`);
  if (process.env.NODE_ENV !== "production") console.error(err.stack);
  return res.status(err.status || 500).json({
    success: false, code: "INTERNAL_ERROR",
    message: process.env.NODE_ENV === "production" ? "An unexpected error occurred." : err.message,
  });
});

module.exports = app;