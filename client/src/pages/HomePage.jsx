// src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeUpload } from "../hooks/useResumeUpload";
import { TABS } from "../constants";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Card from "../components/ui/Card";

export default function HomePage() {
  const [tab,     setTab]     = useState(TABS.TEXT);
  const [content, setContent] = useState("");
  const [file,    setFile]    = useState(null);
  const navigate = useNavigate();
  const { loading, error, result, uploadText, uploadPdf, reset } = useResumeUpload();

  // Redirect to result page once analysis is done
  if (result) {
    navigate("/result/live", { state: { result } });
  }

  const tabStyle = (t) => ({
    padding:      "10px 24px",
    borderRadius: "var(--radius-sm)",
    border:       "none",
    cursor:       "pointer",
    fontWeight:   600,
    fontSize:     "0.9rem",
    background:   tab === t ? "var(--primary)" : "transparent",
    color:        tab === t ? "#fff" : "var(--text-muted)",
    transition:   "var(--transition)",
  });

  return (
    <div className="container" style={{ paddingTop:"48px", paddingBottom:"48px" }}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"40px" }}>
        <h1 style={{ fontSize:"2.2rem", fontWeight:800, marginBottom:"12px" }}>
          ⚡ AI Resume ATS Checker
        </h1>
        <p style={{ color:"var(--text-muted)", fontSize:"1rem", maxWidth:"520px", margin:"0 auto" }}>
          Powered by LLaMA 3.3 70B · Get your ATS score, grade, and actionable feedback in seconds.
        </p>
      </div>

      <Card style={{ maxWidth:"680px", margin:"0 auto" }}>
        {/* Tabs */}
        <div style={{
          display:"flex", gap:"4px",
          background:"var(--surface-2)", borderRadius:"var(--radius-sm)",
          padding:"4px", marginBottom:"24px",
        }}>
          <button style={tabStyle(TABS.TEXT)} onClick={() => { setTab(TABS.TEXT); reset(); }}>
            📝 Paste Text
          </button>
          <button style={tabStyle(TABS.PDF)} onClick={() => { setTab(TABS.PDF); reset(); }}>
            📄 Upload PDF
          </button>
        </div>

        {/* Text Tab */}
        {tab === TABS.TEXT && (
          <div>
            <textarea
              rows={12}
              placeholder="Paste your full resume here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width:"100%", padding:"14px",
                background:"var(--surface-2)", border:"1px solid var(--border)",
                borderRadius:"var(--radius-sm)", color:"var(--text)",
                fontSize:"0.875rem", resize:"vertical", fontFamily:"inherit",
                outline:"none",
              }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"8px" }}>
              <span style={{ color:"var(--text-muted)", fontSize:"0.8rem" }}>
                {content.length}/15000 characters
              </span>
              <div style={{ display:"flex", gap:"8px" }}>
                <Button variant="secondary" onClick={() => { setContent(""); reset(); }}>
                  Clear
                </Button>
                <Button onClick={() => uploadText(content)} disabled={loading || !content.trim()}>
                  {loading ? "Analyzing..." : "Analyze Resume →"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* PDF Tab */}
        {tab === TABS.PDF && (
          <div>
            <label style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", gap:"12px",
              border:`2px dashed ${file ? "var(--primary)" : "var(--border)"}`,
              borderRadius:"var(--radius)", padding:"40px 20px",
              cursor:"pointer", transition:"var(--transition)",
              background: file ? "var(--primary)10" : "transparent",
            }}>
              <span style={{ fontSize:"2.5rem" }}>📄</span>
              <span style={{ fontWeight:600 }}>
                {file ? file.name : "Click to select PDF"}
              </span>
              <span style={{ color:"var(--text-muted)", fontSize:"0.8rem" }}>
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB · PDF`
                  : "Max 5MB · PDF only"}
              </span>
              <input type="file" accept=".pdf" hidden
                onChange={(e) => { setFile(e.target.files[0]); reset(); }}
              />
            </label>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:"8px", marginTop:"16px" }}>
              <Button variant="secondary" onClick={() => { setFile(null); reset(); }}>
                Clear
              </Button>
              <Button onClick={() => uploadPdf(file)} disabled={loading || !file}>
                {loading ? "Analyzing..." : "Analyze PDF →"}
              </Button>
            </div>
          </div>
        )}

        {/* States */}
        {loading && <Loader />}
        {error && (
          <div style={{
            marginTop:"16px", padding:"12px 16px",
            background:"#ef444415", border:"1px solid #ef444430",
            borderRadius:"var(--radius-sm)", color:"#ef4444",
            fontSize:"0.875rem",
          }}>
            ⚠️ {error}
          </div>
        )}
      </Card>
    </div>
  );
}