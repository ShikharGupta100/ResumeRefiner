// const mongoose = require("mongoose");

// const resumeSchema = new mongoose.Schema({
//     content:{
//         type:String,
//         required:true,
//         maxLength:50000
//     },
//     score:{
//         type:Number,
//         min:0,
//         max:100
//     },
//     strengths:{
//         type:[String],
//         default:[]
//     },
//     weaknesses:{
//         type:[String],
//         default:[]
//     },
//     suggestions:{
//         type:[String],
//         default:[]
//     }
// },{
//     timestamps:true
// })

// const Resume = mongoose.model("Resume",resumeSchema)

// module.exports = Resume
// server/src/models/resume.model.js

const mongoose = require("mongoose");

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * Breakdown of score across 6 ATS rubric categories.
 * Mirrors exactly what ai.service.js returns.
 */
const scoreBreakdownSchema = new mongoose.Schema(
  {
    keywordDensity:        { type: Number, min: 0, max: 25,  default: 0 },
    workExperience:        { type: Number, min: 0, max: 20,  default: 0 },
    quantifiedAchievements:{ type: Number, min: 0, max: 20,  default: 0 },
    formatting:            { type: Number, min: 0, max: 15,  default: 0 },
    skillsSection:         { type: Number, min: 0, max: 10,  default: 0 },
    education:             { type: Number, min: 0, max: 10,  default: 0 },
  },
  { _id: false } // no separate _id for embedded sub-docs
);

/**
 * Which standard resume sections were detected.
 */
const detectedSectionsSchema = new mongoose.Schema(
  {
    hasContactInfo:   { type: Boolean, default: false },
    hasSummary:       { type: Boolean, default: false },
    hasExperience:    { type: Boolean, default: false },
    hasEducation:     { type: Boolean, default: false },
    hasSkills:        { type: Boolean, default: false },
    hasCertifications:{ type: Boolean, default: false },
    hasProjects:      { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Main Schema ──────────────────────────────────────────────────────────────

const resumeSchema = new mongoose.Schema(
  {
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
      type:    String,
      enum:    {
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
    timestamps: true, // createdAt + updatedAt auto-managed

    // ── Clean up response — strip __v from every API response ──
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret.id;   // remove duplicate of _id
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Speeds up common queries: sort by score, filter by grade, list by date

resumeSchema.index({ score: -1 });        // leaderboard / sort by score
resumeSchema.index({ grade: 1 });         // filter by grade
resumeSchema.index({ createdAt: -1 });    // newest first (default list view)

// ─── Virtuals ─────────────────────────────────────────────────────────────────

/**
 * Human-readable label derived from score.
 * e.g. score 82 → "Good"
 * Used in frontend badge rendering.
 */
resumeSchema.virtual("scoreLabel").get(function () {
  if (this.score >= 85) return "Excellent";
  if (this.score >= 70) return "Good";
  if (this.score >= 55) return "Average";
  if (this.score >= 40) return "Needs Work";
  return "Poor";
});

/**
 * Percentage of resume sections detected vs total expected (7).
 * e.g. 5/7 sections → 71
 */
resumeSchema.virtual("sectionCompleteness").get(function () {
  if (!this.detectedSections) return 0;
  const fields = Object.values(this.detectedSections.toObject?.() ?? this.detectedSections);
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / 7) * 100);
});

// ─── Model Export ─────────────────────────────────────────────────────────────

const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;