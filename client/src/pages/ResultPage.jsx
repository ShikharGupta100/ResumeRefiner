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
import {
  Download,
  FileText,
  History,
  Home,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";

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
        className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
      >
        Go Home
      </button>
    </div>
  );

  if (!data) return null;

  // Derive grade badge color
  const gradeColor = data.grade?.startsWith("A")
    ? { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/40" }
    : data.grade?.startsWith("B")
    ? { bg: "bg-amber-500/15", text: "text-amber-500", border: "border-amber-500/40" }
    : { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40" };

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-screen overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky z-50 top-0 w-full backdrop-blur-md bg-neutral-900/80 border-b border-white/10">
        <div className="flex px-8 justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-indigo-500" />
            <span className="font-bold text-indigo-500 text-lg">ATS Resume Checker</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/" className="font-medium text-slate-200 text-sm flex items-center gap-1.5 border-b-2 border-indigo-500 pb-1">
              <Home className="size-4" /> Home
            </Link>
            <Link to="/" className="font-medium text-slate-200/70 text-sm flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <FileText className="size-4" /> Analyze
            </Link>
            <Link to="/history" className="font-medium text-slate-200/70 text-sm flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <History className="size-4" /> History
            </Link>
            <a className="font-medium text-slate-200/70 text-sm flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer">
              <Zap className="size-4" /> Pricing
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-slate-200 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">Login</Link>
            <Link to="/signup" className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-600 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="bg-[#0a0a0f] p-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-bold text-slate-200 text-2xl">Resume Analysis Results</h1>
          <p className="text-slate-500 text-sm mt-1">Detailed ATS compatibility breakdown for your resume</p>
        </div>

        <div className="flex gap-6">

          {/* ── Left column (65%) ── */}
          <div className="w-[65%] flex flex-col gap-6">

            {/* ATS Score card */}
            <div className="shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)] rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-slate-200 text-lg font-semibold">ATS Score</h2>
                  <p className="text-slate-500 text-sm">Overall resume compatibility</p>
                </div>
                {data.grade && (
                  <span className={`font-bold rounded-full text-sm px-3 py-1 border ${gradeColor.bg} ${gradeColor.text} ${gradeColor.border}`}>
                    Grade {data.grade}
                  </span>
                )}
              </div>
              {/* ScoreRing component — passes score + grade as before */}
              <div className="flex justify-center items-center">
                <ScoreRing score={data.score} grade={data.grade} />
              </div>
            </div>

            {/* Overall Feedback */}
            {data.OverallFeedback && (
              <div className="rounded-2xl bg-[#111118] border-l-4 border-l-indigo-500 border-t border-r border-b border-[#1e1e2e] p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-indigo-500" />
                  <h2 className="text-slate-200 text-lg font-semibold">AI Feedback</h2>
                </div>
                <OverallFeedBack feedback={data.OverallFeedback} />
              </div>
            )}

            {/* Score Breakdown */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-4">
              <h2 className="text-slate-200 text-lg font-semibold">Score Breakdown</h2>
              <ScoreBreakdown breakdown={data.scoreBreakdown} />
            </div>

            {/* Missing Keywords */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-slate-200 text-lg font-semibold flex items-center gap-2">
                  <TriangleAlert className="size-4 text-red-500" />
                  Missing Keywords
                </h2>
                <p className="text-slate-500 text-sm mt-1">Add these to improve your match rate</p>
              </div>
              <MissingKeywords keywords={data.missingKeywords} />
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-4">
                <FeedbackSection title="Strengths" items={data.strengths} type="strengths" />
              </div>
              <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-4">
                <FeedbackSection title="Weaknesses" items={data.weaknesses} type="weaknesses" />
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-4">
              <FeedbackSection title="Suggestions" items={data.suggestions} type="suggestions" />
            </div>
          </div>

          {/* ── Right column (35%) ── */}
          <div className="w-[35%] flex flex-col gap-6">

            {/* Section Checklist */}
            <div className="rounded-2xl bg-[#111118] border border-[#1e1e2e] p-6 flex flex-col gap-4">
              <h2 className="text-slate-200 text-lg font-semibold">Section Checklist</h2>
              <SectionChecklist detectedSections={data.detectedSections} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm shadow-[0_0_24px_-4px_rgba(99,102,241,0.6)] hover:bg-indigo-600 transition-all"
              >
                <Download className="size-4" />
                Download Report
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 bg-transparent text-slate-200 font-semibold py-3 rounded-xl text-sm border border-[#1e1e2e] hover:border-[#334155] hover:bg-[#111118] transition-all"
              >
                <RefreshCw className="size-4" />
                Analyze Another Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}