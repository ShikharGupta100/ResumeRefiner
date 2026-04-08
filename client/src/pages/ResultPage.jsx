// src/pages/ResultPage.jsx
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchResumeById } from "../api/resumeApi";
import ScoreRing         from "../components/resume/ScoreRing";
import ScoreBreakdown    from "../components/resume/ScoreBreakdown";
import FeedbackSection   from "../components/resume/FeedbackSection";
import SectionChecklist  from "../components/resume/SectionChecklist";
import MissingKeywords   from "../components/resume/MissingKeywords";
import OverallFeedBack   from "../components/resume/OverallFeedBack";
import Loader            from "../components/ui/Loader";
import Button            from "../components/ui/Button";
import Card              from "../components/ui/Card";

export default function ResultPage() {
  const { id }       = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const [data,  setData]  = useState(state?.result || null);
  const [loading, setLoading] = useState(!state?.result && id !== "live");
  const [error, setError]   = useState(null);

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
    <div className="container" style={{ paddingTop:"60px", textAlign:"center" }}>
      <p style={{ color:"var(--danger)" }}>❌ {error}</p>
      <Button onClick={() => navigate("/")} style={{ marginTop:"16px" }}>
        Go Home
      </Button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="container" style={{ paddingTop:"40px", paddingBottom:"60px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px" }}>
        <h2 style={{ fontSize:"1.5rem", fontWeight:700 }}>📋 ATS Report</h2>
        <Button variant="secondary" onClick={() => navigate("/")}>
          ← Analyze Another
        </Button>
      </div>

      {/* Score Hero */}
      <Card style={{ textAlign:"center", marginBottom:"24px" }}>
        <ScoreRing score={data.score} grade={data.grade} />
        // This line should already be there — if not, add it:
<div style={{ gridColumn:"1 / -1" }}>
  <OverallFeedback feedback={data.overallFeedback} />
</div>
      </Card>

      {/* Grid layout */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        <div style={{ gridColumn:"1 / -1" }}>
          <ScoreBreakdown breakdown={data.scoreBreakdown} />
        </div>
        <FeedbackSection title="Strengths"   items={data.strengths}   type="strengths"   />
        <FeedbackSection title="Weaknesses"  items={data.weaknesses}  type="weaknesses"  />
        <div style={{ gridColumn:"1 / -1" }}>
          <FeedbackSection title="Suggestions" items={data.suggestions} type="suggestions" />
        </div>
        <SectionChecklist detectedSections={data.detectedSections} />
        <MissingKeywords  keywords={data.missingKeywords} />
      </div>
    </div>
  );
}