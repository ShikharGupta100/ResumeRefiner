// src/components/resume/ScoreBreakdown.jsx
import { SCORE_BREAKDOWN_META } from "../../constants";

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(SCORE_BREAKDOWN_META).map(([key, meta]) => {
        const value = breakdown[key] ?? 0;
        const pct   = Math.round((value / meta.max) * 100);
        return (
          <div key={key} className="rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] flex flex-nowrap items-center gap-3 px-4 py-3 overflow-hidden">
            <span className="text-slate-200 text-sm w-36 sm:w-44 shrink-0 truncate">{meta.label}</span>
            <div className="rounded-full bg-[#1e1e2e] flex-1 h-2 min-w-0 overflow-hidden">
              <div
                className="rounded-full h-2 transition-all duration-700"
                style={{ width: `${pct}%`, background: meta.color }}
              />
            </div>
            <span className="text-slate-200 text-sm font-semibold w-10 text-right shrink-0">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}