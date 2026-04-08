// const Resume = require("../models/resume.model");
// const analyzeResume = require("../services/ai.service");

// async function uploadResume(req,res) {
//     console.log("UPLOAD API HIT");

//     const {content} = req.body;
//     console.log("Before AI");

//     if(!content){
//         return res.status(400).json({
//             message:"Content is required"
//         })
//     }

//     try{
//         const analysisResult = await analyzeResume(content);        
//         console.log(analysisResult);

//         const resume = await Resume.create({
//             content,
//             score:analysisResult.score,
//             strengths:analysisResult.strengths,
//             weaknesses:analysisResult.weaknesses,
//             suggestions:analysisResult.suggestions
//         });

//         res.status(200).json({
//             message:"Resume analyzed and saved successfully",
//             resume,
//         })



//     }
//     catch(error){
//         res.status(500).json({
//             message:"Something went wrong",
//             error:error.message
//         })
//     }
    
// }

// async function getAllResumes(req,res) {
//     try{
//         const resumes = await Resume.find()
    
//             res.status(200).json({
//                 message:"ResumeList found",
//                 resumes
//             })    

//     }catch(error){
//         res.status(500).json({
//             message:error.message
//         })
//     }
// }


 
    


// module.exports = {getAllResumes,uploadResume}
// server/src/controllers/resume.controller.js

const Resume = require("../models/resume.model");
const { analyzeResume } = require("../services/ai.service"); // ← fix named import

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Classifies errors thrown by ai.service into proper HTTP status codes.
 * Never expose raw error internals to the client in production.
 */
function classifyError(error) {
  const msg = error.message || "";

  if (msg.startsWith("INVALID_INPUT")) {
    return {
      status: 400,
      code: "VALIDATION_ERROR",
      message: msg.replace("INVALID_INPUT: ", ""),
    };
  }

  if (msg.startsWith("INVALID_SCHEMA") || msg.startsWith("EMPTY_RESPONSE")) {
    return {
      status: 502,
      code: "AI_PARSE_ERROR",
      message: "AI returned an unexpected response. Please try again.",
    };
  }

  if (msg.includes("rate_limit") || msg.includes("429")) {
    return {
      status: 429,
      code: "RATE_LIMITED",
      message: "AI service is busy. Please wait a moment and retry.",
    };
  }

  if (msg.includes("GROQ_API_KEY") || msg.includes("401")) {
    return {
      status: 503,
      code: "SERVICE_UNAVAILABLE",
      message: "AI service is temporarily unavailable.",
    };
  }

  // Generic — never leak stack traces to client
  return {
    status: 500,
    code: "INTERNAL_ERROR",
    message: "Something went wrong. Please try again.",
  };
}

/**
 * Sanitize input — strip dangerous characters, normalize whitespace.
 */
function sanitizeContent(content) {
  if (typeof content !== "string") return "";
  return content
    .replace(/<[^>]*>/g, "")        // strip any HTML tags
    .replace(/[^\x20-\x7E\n\r\t]/g, "") // strip non-printable chars
    .replace(/\s{3,}/g, "\n")       // collapse excessive whitespace
    .trim();
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/resumes
 * Accepts resume text, analyzes it via AI, saves to DB, returns full report.
 */
async function uploadResume(req, res) {
  const rawContent = req.body?.content;

  // ── 1. Input presence check ──
  if (!rawContent || typeof rawContent !== "string" || !rawContent.trim()) {
    return res.status(400).json({
      success: false,
      code: "MISSING_CONTENT",
      message: "Resume content is required and must be a non-empty string.",
    });
  }

  const content = sanitizeContent(rawContent);

  try {
    // ── 2. Run AI analysis ──
    const analysis = await analyzeResume(content);

    // ── 3. Persist full result to DB ──
    const resume = await Resume.create({
      content,
      score:          analysis.score,
      grade:          analysis.grade,
      scoreBreakdown: analysis.scoreBreakdown,
      strengths:      analysis.strengths,
      weaknesses:     analysis.weaknesses,
      suggestions:    analysis.suggestions,
      missingKeywords:   analysis.missingKeywords,
      detectedSections:  analysis.detectedSections,
      overallFeedback:   analysis.overallFeedback,
    });

    // ── 4. Consistent success response ──
    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      data: {
        id:              resume._id,
        score:           resume.score,
        grade:           resume.grade,
        scoreBreakdown:  resume.scoreBreakdown,
        strengths:       resume.strengths,
        weaknesses:      resume.weaknesses,
        suggestions:     resume.suggestions,
        missingKeywords: resume.missingKeywords,
        detectedSections:resume.detectedSections,
        overallFeedback: resume.overallFeedback,
        createdAt:       resume.createdAt,
      },
    });

  } catch (error) {
    const { status, code, message } = classifyError(error);

    // Log full error server-side only
    console.error(`[uploadResume] ${code}:`, error.message);

    return res.status(status).json({
      success: false,
      code,
      message,
    });
  }
}

/**
 * GET /api/resumes
 * Returns paginated list — never dump entire collection.
 */
async function getAllResumes(req, res) {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // cap at 50
    const skip  = (page - 1) * limit;

    const [resumes, total] = await Promise.all([
      Resume.find()
        .select("-content")          // never send full resume text in list
        .sort({ createdAt: -1 })     // newest first
        .skip(skip)
        .limit(limit)
        .lean(),                     // plain JS object, faster than Mongoose doc
      Resume.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        resumes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
        },
      },
    });

  } catch (error) {
    console.error("[getAllResumes]:", error.message);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_ERROR",
      message: "Failed to retrieve resumes.",
    });
  }
}

/**
 * GET /api/resumes/:id
 * Fetch single resume with full analysis — used for detail/report page.
 */
async function getResumeById(req, res) {
  try {
    const resume = await Resume.findById(req.params.id).lean();

    if (!resume) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });

  } catch (error) {
    // Mongoose throws CastError for malformed IDs
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        code: "INVALID_ID",
        message: "Invalid resume ID format.",
      });
    }

    console.error("[getResumeById]:", error.message);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_ERROR",
      message: "Failed to retrieve resume.",
    });
  }
}

module.exports = { uploadResume, getAllResumes, getResumeById };