// src/components/resume/ScoreBreakdown.jsx
import { SCORE_BREAKDOWN_META } from "../../constants";
import ProgressBar from "../ui/ProgressBar";
import Card from "../ui/Card";

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;
  return (
    <Card>
      <h3 style={{ marginBottom:"16px", fontSize:"1rem", fontWeight:600 }}>
        📊 Score Breakdown
      </h3>
      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        {Object.entries(SCORE_BREAKDOWN_META).map(([key, meta]) => {
          const value = breakdown[key] ?? 0;
          const pct   = Math.round((value / meta.max) * 100);
          return (
            <div key={key}>
              <div style={{
                display:"flex", justifyContent:"space-between",
                marginBottom:"6px", fontSize:"0.85rem",
              }}>
                <span>{meta.label}</span>
                <span style={{ color:"var(--text-muted)" }}>
                  {value}/{meta.max}
                  <span style={{
                    marginLeft:"6px", color: meta.color, fontWeight:600,
                  }}>({pct}%)</span>
                </span>
              </div>
              <ProgressBar value={value} max={meta.max} color={meta.color} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}