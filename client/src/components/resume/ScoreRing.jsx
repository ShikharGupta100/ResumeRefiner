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
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="relative w-[140px] h-[140px] shrink-0">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none"
            stroke="#1e1e2e" strokeWidth="12" />
          <circle cx="70" cy="70" r={radius} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[2rem] font-extrabold leading-none" style={{ color }}>{score}</span>
          <span className="text-[0.7rem] text-slate-500 mt-0.5">/100</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge grade={grade} />
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
    </div>
  );
}