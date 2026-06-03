
// src/pages/HomePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeUpload } from "../hooks/useResumeUpload";
import { TABS } from "../constants";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@500;700;800&display=swap');

 .hp-wrap {
    min-height: 100vh;
    background: #09090f;
    color: #e2e8f0;
    font-family: 'Syne', sans-serif;
    width: 100%;
    box-sizing: border-box;
  }
  .hp-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 24px 80px;
    text-align: center;
  }
  .hp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.25);
    color: #818cf8;
    padding: 6px 16px;
    border-radius: 99px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 24px;
    letter-spacing: 0.02em;
  }
  .hp-h1 {
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 16px;
    background: linear-gradient(90deg, #6366f1, #a855f7, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hp-sub {
    color: #475569;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    max-width: 480px;
    line-height: 1.7;
    margin: 0 auto 40px;
  }
  .hp-card {
    width: 100%;
    max-width: 640px;
    background: #0f0f1a;
    border: 1px solid #1e1e2e;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 0 80px rgba(99,102,241,0.06);
  }
  .hp-tabs {
    display: flex;
    gap: 4px;
    background: #0a0a12;
    border: 1px solid #1e1e2e;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 24px;
  }
  .hp-tab {
    flex: 1;
    padding: 10px;
    border-radius: 9px;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .hp-tab-active {
    background: #6366f1;
    color: #fff;
    box-shadow: 0 0 20px rgba(99,102,241,0.3);
  }
  .hp-tab-inactive {
    background: transparent;
    color: #475569;
  }
  .hp-tab-inactive:hover {
    color: #94a3b8;
  }
  .hp-textarea {
    width: 100%;
    min-height: 200px;
    background: #0a0a12;
    border: 1px solid #1e1e2e;
    border-radius: 12px;
    color: #e2e8f0;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    padding: 16px;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    line-height: 1.6;
    transition: border-color 0.2s;
  }
  .hp-textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .hp-textarea::placeholder {
    color: #334155;
  }
  .hp-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .hp-char {
    color: #334155;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
  }
  .hp-actions { display: flex; gap: 8px; }
  .hp-btn-clear {
    background: transparent;
    border: 1px solid #1e1e2e;
    color: #475569;
    padding: 9px 18px;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .hp-btn-clear:hover { border-color: #334155; color: #94a3b8; }
  .hp-btn-analyze {
    background: #6366f1;
    border: none;
    color: #fff;
    padding: 9px 22px;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 0 24px rgba(99,102,241,0.35);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hp-btn-analyze:hover { background: #4f46e5; box-shadow: 0 0 32px rgba(99,102,241,0.5); }
  .hp-btn-analyze:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
  .hp-upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1.5px dashed #1e1e2e;
    border-radius: 14px;
    padding: 48px 24px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .hp-upload-label:hover { border-color: #6366f1; background: rgba(99,102,241,0.04); }
  .hp-upload-icon { font-size: 40px; color: #334155; }
  .hp-upload-name { font-weight: 700; font-size: 15px; color: #e2e8f0; }
  .hp-upload-hint { color: #475569; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
  .hp-error {
    margin-top: 16px;
    padding: 12px 16px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    color: #f87171;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
  }
  .hp-loading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
    color: #6366f1;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
  }
  .hp-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: hp-spin 0.7s linear infinite;
  }
  @keyframes hp-spin { to { transform: rotate(360deg); } }
  .hp-stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    padding: 32px 24px;
    border-top: 1px solid #1e1e2e;
    flex-wrap: wrap;
  }
  .hp-stat-num {
    font-size: 28px;
    font-weight: 800;
    color: #e2e8f0;
    line-height: 1;
  }
  .hp-stat-label {
    color: #334155;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 4px;
    letter-spacing: 0.05em;
  }
`;

export default function HomePage() {
  const [tab,     setTab]     = useState(TABS.TEXT);
  const [content, setContent] = useState("");
  const [file,    setFile]    = useState(null);
  const navigate = useNavigate();
  const { loading, error, result, uploadText, uploadPdf, reset } = useResumeUpload();

  if (result) {
    navigate("/result/live", { state: { result } });
  }

  return (
    <>
      <style>{css}</style>
      <div className="hp-wrap">
        <div className="hp-hero">

          {/* Badge */}
          <div className="hp-badge">
            ⚡ AI-Powered ATS Analysis
          </div>

          {/* Headline */}
          <h1 className="hp-h1">Beat the ATS.<br />Land the Interview.</h1>
          <p className="hp-sub">
            // get your ATS score, grade & actionable feedback in seconds
          </p>

          {/* Main card */}
          <div className="hp-card">

            {/* Tabs */}
            <div className="hp-tabs">
              <button
                className={`hp-tab ${tab === TABS.TEXT ? "hp-tab-active" : "hp-tab-inactive"}`}
                onClick={() => { setTab(TABS.TEXT); reset(); }}
              >
                📝 Paste Text
              </button>
              <button
                className={`hp-tab ${tab === TABS.PDF ? "hp-tab-active" : "hp-tab-inactive"}`}
                onClick={() => { setTab(TABS.PDF); reset(); }}
              >
                📄 Upload PDF
              </button>
            </div>

            {/* Text Tab */}
            {tab === TABS.TEXT && (
              <div>
                <textarea
                  className="hp-textarea"
                  rows={10}
                  placeholder="// paste your full resume here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="hp-row">
                  <span className="hp-char">{content.length} / 15000</span>
                  <div className="hp-actions">
                    <button className="hp-btn-clear" onClick={() => { setContent(""); reset(); }}>
                      Clear
                    </button>
                    <button
                      className="hp-btn-analyze"
                      onClick={() => uploadText(content)}
                      disabled={loading || !content.trim()}
                    >
                      {loading ? "Analyzing..." : "→ Analyze Resume"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PDF Tab */}
            {tab === TABS.PDF && (
              <div>
                <label className="hp-upload-label" style={{ borderColor: file ? "#6366f1" : undefined, background: file ? "rgba(99,102,241,0.04)" : undefined }}>
                  <span className="hp-upload-icon">📄</span>
                  <span className="hp-upload-name">{file ? file.name : "Click to select PDF"}</span>
                  <span className="hp-upload-hint">
                    {file ? `${(file.size / 1024).toFixed(1)} KB · PDF` : "max 5MB · PDF only"}
                  </span>
                  <input type="file" accept=".pdf" hidden onChange={(e) => { setFile(e.target.files[0]); reset(); }} />
                </label>
                <div className="hp-row" style={{ justifyContent: "flex-end" }}>
                  <div className="hp-actions">
                    <button className="hp-btn-clear" onClick={() => { setFile(null); reset(); }}>Clear</button>
                    <button
                      className="hp-btn-analyze"
                      onClick={() => uploadPdf(file)}
                      disabled={loading || !file}
                    >
                      {loading ? "Analyzing..." : "→ Analyze PDF"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="hp-loading">
                <div className="hp-spinner" />
                scanning resume...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="hp-error">⚠ {error}</div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="hp-stats">
          <div style={{ textAlign: "center" }}>
            <div className="hp-stat-num">10,000+</div>
            <div className="hp-stat-label">resumes_analyzed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="hp-stat-num">94%</div>
            <div className="hp-stat-label">interview_rate_boost</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="hp-stat-num">500+</div>
            <div className="hp-stat-label">job_roles_covered</div>
          </div>
        </div>
      </div>
    </>
  );
}