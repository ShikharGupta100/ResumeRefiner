

const express  = require("express");
const cors     = require("cors");
const helmet   = require("helmet");
const morgan   = require("morgan");
const passport = require("./config/passport")
const authRoutes = require("./routes/auth.routes")


const resumeRoutes = require("./routes/resume.routes");

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
/**
 * helmet sets 11 HTTP headers in one call:
 * X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, etc.
 */
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
/**
 * Whitelist only your actual frontend origins.
 * Never use cors() with no config in production.
 */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no origin) and whitelisted origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' not allowed.`));
      }
    },
    methods:          ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders:   ["Content-Type", "Authorization"],
    credentials:      true,
  })
);

// ─── Request Parsing ──────────────────────────────────────────────────────────
/**
 * Cap JSON body at 50kb — resume text is plain string, never needs more.
 * PDF uploads bypass this (handled by multer in routes).
 */
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// ─── Request Logging ──────────────────────────────────────────────────────────
/**
 * 'dev'  → colourful one-liner per request (local)
 * 'combined' → Apache-style full log (set via ENV for production)
 */
const LOG_FORMAT = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(LOG_FORMAT));
app.use(passport.initialize());

// ─── Health Check ─────────────────────────────────────────────────────────────
/**
 * Used by Docker, Railway, Render, AWS ELB health probes.
 * Returns DB + uptime status.
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status:  "ok",
    uptime:  `${Math.floor(process.uptime())}s`,
    env:     process.env.NODE_ENV || "development",
    ts:      new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/resumes", resumeRoutes);
app.use("/api/auth",authRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
/**
 * Catches any request that didn't match a route above.
 * Returns JSON — never the default Express HTML error page.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code:    "NOT_FOUND",
    message: `Route '${req.method} ${req.originalUrl}' does not exist.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
/**
 * Catches anything passed via next(err) from any middleware or route.
 * 4 arguments = Express treats this as error middleware.
 * MUST be last app.use() call.
 */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // CORS errors
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({
      success: false,
      code:    "CORS_ERROR",
      message: err.message,
    });
  }

  // JSON parse errors (malformed request body)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      code:    "INVALID_JSON",
      message: "Request body contains invalid JSON.",
    });
  }

  // Payload too large
  if (err.status === 413 || err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      code:    "PAYLOAD_TOO_LARGE",
      message: "Request body exceeds 50kb limit.",
    });
  }

  // Log full error server-side — never send stack to client
  console.error(`[GlobalError] ${err.status || 500} — ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  return res.status(err.status || 500).json({
    success: false,
    code:    "INTERNAL_ERROR",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : err.message,
  });
});

module.exports = app;