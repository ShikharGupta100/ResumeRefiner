// src/components/resume/FeedbackSection.jsx
const ICONS  = { strengths: "✅", weaknesses: "❌", suggestions: "💡" };
const COLORS = { strengths: "#22c55e", weaknesses: "#ef4444", suggestions: "#f59e0b" };
const BG     = { strengths: "rgba(34,197,94,0.06)", weaknesses: "rgba(239,68,68,0.06)", suggestions: "rgba(245,158,11,0.06)" };

export default function FeedbackSection({ title, items, type }) {
  if (!items?.length) return null;
  const color = COLORS[type];
  const bg    = BG[type];
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-slate-200 font-semibold text-base flex items-center gap-2">
        <span>{ICONS[type]}</span> {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 items-start px-3 py-2.5 rounded-xl text-sm text-slate-300 leading-relaxed"
            style={{ background: bg, borderLeft: `3px solid ${color}` }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}