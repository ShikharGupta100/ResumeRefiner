// src/pages/ResultPage.jsx
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchResumeById } from "../api/resumeApi";
import ScoreRing        from "../components/resume/ScoreRing";
import ScoreBreakdown   from "../components/resume/ScoreBreakdown";
import FeedbackSection  from "../components/resume/FeedbackSection";
import SectionChecklist from "../components/resume/SectionChecklist";
import MissingKeywords  from "../components/resume/MissingKeywords";
import OverallFeedBack  from "../components/resume/OverallFeedBack";
import Loader           from "../components/ui/Loader";
import { FileText, History, Home, RefreshCw, Zap } from "lucide-react";

export default function ResultPage() {
  const { id }      = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const [data, setData]       = useState(state?.result || null);
  const [loading, setLoading] = useState(!state?.result && id !== "live");
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!data && id && id !== "live") {
      fetchResumeById(id)
        .then((res) => setData(res.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Loader message="Loading resume report..." />;

  if (error) return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-sm">❌ {error}</p>
      <button
        onClick={() => navigate("/")}
        className="bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
      >
        Go Home
      </button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="bg-[#0a0a0f] text-neutral-50 min-h-screen w-full">

      {/* ── Slim Navbar — no login/signup/pricing ── */}
      <nav className="sticky z-50 top-0 w-full backdrop-blur-md bg-[#0a0a0f]/90 border-b border-white/10">
        <div className="flex px-4 sm:px-6 lg:px-8 justify-between items-center h-14">
          <Link to="/" className="font-bold text-indigo-500 text-base flex items-center gap-2 shrink-0">
            <Zap className="size-4 fill-[#6366f1]" />
            <span className="hidden sm:inline">ATS Resume Checker</span>
            <span className="sm:hidden">ATS Checker</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="text-slate-200/70 text-sm flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/" className="text-slate-200/70 text-sm flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <FileText className="size-3.5" />
              <span className="hidden sm:inline">Analyze</span>
            </Link>
            <Link to="/history" className="text-slate-200/70 text-sm flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <History className="size-3.5" />
              <span className="hidden sm:inline">History</span>
            </Link>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm border border-[#1e1e2e] px-2.5 sm:px-3 py-1.5 rounded-lg hover:border-[#334155] hover:text-slate-200 transition-all shrink-0"
          >
            <RefreshCw className="size-3.5" />
            <span className="hidden sm:inline">New Analysis</span>
          </button>
        </div>
      </nav>

      {/* ── Page body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-bold text-slate-200 text-xl sm:text-2xl">Resume Analysis Results</h1>
          <p className="text-slate-500 text-sm mt-1">Detailed ATS compatibility breakdown for your resume</p>
        </div>

        {/* ── Responsive grid: single col mobile, two col desktop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── LEFT column ── */}
          <div className="flex flex-col gap-6 min-w-0">

            {/* Score + Overall Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ATS Score card */}
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6 shadow-[0_0_40px_-10px_rgba(99,102,241,0.35)] flex flex-col items-center gap-4">
                <div className="w-full flex justify-between items-start">
                  <div>
                    <h2 className="text-slate-200 font-semibold text-base">ATS Score</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Overall compatibility</p>
                  </div>
                  {data.grade && <GradeBadge grade={data.grade} />}
                </div>
                <ScoreRing score={data.score} grade={data.grade} />
              </div>

              {/* AI Summary card */}
              {data.OverallFeedback && (
                <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] border-l-[3px] border-l-indigo-500 p-5 sm:p-6 flex flex-col gap-3">
                  <h2 className="text-slate-200 font-semibold text-base flex items-center gap-2">
                    <span className="text-indigo-400 text-lg leading-none">✦</span> AI Summary
                  </h2>
                  <OverallFeedBack feedback={data.OverallFeedback} />
                </div>
              )}
            </div>

            {/* Score Breakdown */}
            {data.scoreBreakdown && (
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6">
                <h2 className="text-slate-200 font-semibold text-base mb-4">Score Breakdown</h2>
                <ScoreBreakdown breakdown={data.scoreBreakdown} />
              </div>
            )}

            {/* Missing Keywords */}
            {data.missingKeywords?.length > 0 && (
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6">
                <div className="mb-4">
                  <h2 className="text-slate-200 font-semibold text-base flex items-center gap-2">
                    <span className="text-red-400">⚠</span> Missing Keywords
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">Add these to improve your match rate</p>
                </div>
                <MissingKeywords keywords={data.missingKeywords} />
              </div>
            )}

            {/* Strengths + Weaknesses */}
            {(data.strengths?.length > 0 || data.weaknesses?.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.strengths?.length > 0 && (
                  <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6">
                    <FeedbackSection title="Strengths" items={data.strengths} type="strengths" />
                  </div>
                )}
                {data.weaknesses?.length > 0 && (
                  <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6">
                    <FeedbackSection title="Weaknesses" items={data.weaknesses} type="weaknesses" />
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            {data.suggestions?.length > 0 && (
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6">
                <FeedbackSection title="Suggestions" items={data.suggestions} type="suggestions" />
              </div>
            )}
          </div>

          {/* ── RIGHT column ── */}
          <div className="flex flex-col gap-6">

            {/* Section Checklist */}
            {data.detectedSections && (
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-5 sm:p-6">
                <h2 className="text-slate-200 font-semibold text-base mb-4">Section Checklist</h2>
                <SectionChecklist detectedSections={data.detectedSections} />
              </div>
            )}

            {/* Analyze another */}
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm shadow-[0_0_24px_-4px_rgba(99,102,241,0.5)] hover:bg-indigo-600 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="size-4" />
              Analyze Another Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GradeBadge({ grade }) {
  const g = grade?.charAt(0);
  const cls =
    g === "A" ? "bg-green-500/15 text-green-400 border-green-500/40"
    : g === "B" ? "bg-amber-500/15 text-amber-500 border-amber-500/40"
    : "bg-red-500/15 text-red-400 border-red-500/40";
  return (
    <span className={`font-bold rounded-full text-xs px-2.5 py-1 border ${cls} shrink-0`}>
      Grade {grade}
    </span>
  );
}