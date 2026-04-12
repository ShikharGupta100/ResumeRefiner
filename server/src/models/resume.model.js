// server/src/models/resume.model.js
const mongoose = require("mongoose");

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const scoreBreakdownSchema = new mongoose.Schema(
  {
    keywordDensity:         { type: Number, min: 0, max: 25, default: 0 },
    workExperience:         { type: Number, min: 0, max: 20, default: 0 },
    quantifiedAchievements: { type: Number, min: 0, max: 20, default: 0 },
    formatting:             { type: Number, min: 0, max: 15, default: 0 },
    skillsSection:          { type: Number, min: 0, max: 10, default: 0 },
    education:              { type: Number, min: 0, max: 10, default: 0 },
  },
  { _id: false }
);

const detectedSectionsSchema = new mongoose.Schema(
  {
    hasContactInfo:    { type: Boolean, default: false },
    hasSummary:        { type: Boolean, default: false },
    hasExperience:     { type: Boolean, default: false },
    hasEducation:      { type: Boolean, default: false },
    hasSkills:         { type: Boolean, default: false },
    hasCertifications: { type: Boolean, default: false },
    hasProjects:       { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const resumeSchema = new mongoose.Schema(
  {
    // ── Owner ──
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "Resume must belong to a user."],
      index:    true,
    },

    // ── Raw Content ──
    content: {
      type:      String,
      required:  [true, "Resume content is required."],
      minlength: [50,    "Resume content is too short to analyze."],
      maxlength: [15000, "Resume content exceeds maximum allowed length."],
      trim:      true,
    },

    // ── ATS Score ──
    score: {
      type:     Number,
      required: true,
      min:      [0,   "Score cannot be negative."],
      max:      [100, "Score cannot exceed 100."],
    },

    // ── Letter Grade ──
    grade: {
      type:     String,
      enum:     {
        values:  ["A", "B", "C", "D", "F"],
        message: "Grade must be A, B, C, D, or F.",
      },
      required: true,
    },

    // ── Score Breakdown (embedded) ──
    scoreBreakdown: {
      type:    scoreBreakdownSchema,
      default: () => ({}),
    },

    // ── AI Feedback Arrays ──
    strengths: {
      type:    [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message:   "Strengths array exceeds 20 items.",
      },
    },
    weaknesses: {
      type:    [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message:   "Weaknesses array exceeds 20 items.",
      },
    },
    suggestions: {
      type:    [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message:   "Suggestions array exceeds 20 items.",
      },
    },
    missingKeywords: {
      type:    [String],
      default: [],
    },

    // ── Section Detection ──
    detectedSections: {
      type:    detectedSectionsSchema,
      default: () => ({}),
    },

    // ── Executive Summary ──
    overallFeedback: {
      type:      String,
      default:   "",
      maxlength: [1000, "Overall feedback too long."],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

resumeSchema.index({ userId: 1, createdAt: -1 }); // user's resumes newest first
resumeSchema.index({ score: -1 });
resumeSchema.index({ grade: 1 });

// ─── Virtuals ─────────────────────────────────────────────────────────────────

resumeSchema.virtual("scoreLabel").get(function () {
  if (this.score >= 85) return "Excellent";
  if (this.score >= 70) return "Good";
  if (this.score >= 55) return "Average";
  if (this.score >= 40) return "Needs Work";
  return "Poor";
});

resumeSchema.virtual("sectionCompleteness").get(function () {
  if (!this.detectedSections) return 0;
  const fields = Object.values(this.detectedSections.toObject?.() ?? this.detectedSections);
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / 7) * 100);
});

// ─── Model Export ─────────────────────────────────────────────────────────────

const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;