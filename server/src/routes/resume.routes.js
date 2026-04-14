

const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const pdfParse = require("pdf-parse");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/auth.middleware");

const {
  uploadResume,
  getAllResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resume.controller");

// ─── Rate Limiters ────────────────────────────────────────────────────────────

/**
 * Strict limiter for AI-heavy endpoints.
 * 10 analyses per IP per 15 minutes — prevents abuse & API cost blowout.
 */
const analyzeLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              10,
  standardHeaders:  true,           // sends RateLimit-* headers to client
  legacyHeaders:    false,
  message: {
    success: false,
    code:    "RATE_LIMITED",
    message: "Too many requests. Please wait 15 minutes before trying again.",
  },
});

/**
 * Relaxed limiter for read-only endpoints.
 */
const readLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max:      60,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    code:    "RATE_LIMITED",
    message: "Too many requests. Slow down.",
  },
});

// ─── Multer Config ────────────────────────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB hard cap
  fileFilter: (_req, file, cb) => {
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(Object.assign(new Error("Only PDF files are allowed."), { code: "INVALID_FILE_TYPE" }));
  },
});

// ─── PDF → Text Middleware ────────────────────────────────────────────────────

/**
 * Parses uploaded PDF buffer → plain text, attaches to req.body.content.
 * Controller stays completely unaware of whether input was PDF or raw text.
 */
async function parsePdf(req, res, next) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      code:    "MISSING_FILE",
      message: "No PDF file uploaded.",
    });
  }

  try {
    const pdfData = await pdfParse(req.file.buffer);
    const text    = pdfData.text?.trim();

    if (!text || text.length < 50) {
      return res.status(422).json({
        success: false,
        code:    "UNPARSEABLE_PDF",
        message: "Could not extract readable text from the PDF. Ensure it is not scanned/image-based.",
      });
    }

    // Inject extracted text so uploadResume controller handles it uniformly
    req.body.content = text;
    next();

  } catch (err) {
    next(err);
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/resumes
 * Raw text submission (copy-paste flow).
 */
router.post(
  "/",
  analyzeLimiter,
  uploadResume         // controller handles validation + AI + DB save
);

/**
 * POST /api/resumes/upload-pdf
 * PDF file upload flow — parsed to text then handed to same controller.
 */
router.post(
  "/upload-pdf",
  analyzeLimiter,
  upload.single("resume"),  // multer runs first
  parsePdf,                 // extract text from buffer
  uploadResume              // same controller — no duplication
);

/**
 * GET /api/resumes
 * Paginated resume history list.
 */
router.get(
  "/",
  readLimiter,
  getAllResumes
);

/**
 * GET /api/resumes/:id
 * Single resume full report.
 */
router.get(
  "/:id",
  readLimiter,
  getResumeById
);


/**
 * DELETE /api/resumes/:id
 * Delete a single resume by ID.
 */
router.delete("/:id",
  readLimiter,
  deleteResume
);


// ─── Multer Error Handler ─────────────────────────────────────────────────────
// Must be defined AFTER routes, takes 4 args so Express treats it as error middleware

router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      code:    "FILE_TOO_LARGE",
      message: "File too large. Maximum allowed size is 5MB.",
    });
  }

  if (err.code === "INVALID_FILE_TYPE") {
    return res.status(415).json({
      success: false,
      code:    "INVALID_FILE_TYPE",
      message: err.message,
    });
  }

  next(err); // pass unknown errors to global error handler in app.js
});

module.exports = router;