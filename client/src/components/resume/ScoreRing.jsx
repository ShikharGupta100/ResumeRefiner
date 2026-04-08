// src/components/resume/ScoreRing.jsx
import { getScoreColor, getScoreLabel } from "../../utils/formatters";
import Badge from "../ui/Badge";

export default function ScoreRing({ score, grade }) {
  const color  = getScoreColor(score);
  const label  = getScoreLabel(score);
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
      <div style={{ position:"relative", width:"140px", height:"140px" }}>
        <svg width="140" height="140" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={radius} fill="none"
            stroke="var(--surface-2)" strokeWidth="12" />
          <circle cx="70" cy="70" r={radius} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition:"stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div style={{
          position:"absolute", inset:0,
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
        }}>
          <span style={{ fontSize:"2rem", fontWeight:800, color }}>{score}</span>
          <span style={{ fontSize:"0.7rem", color:"var(--text-muted)" }}>/100</span>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <Badge grade={grade} />
        <span style={{ color:"var(--text-muted)", fontSize:"0.9rem" }}>{label}</span>
      </div>
    </div>
  );
}