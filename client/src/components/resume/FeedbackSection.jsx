// src/components/resume/FeedbackSection.jsx
import Card from "../ui/Card";

const ICONS = { strengths:"✅", weaknesses:"❌", suggestions:"💡" };
const COLORS = { strengths:"#22c55e", weaknesses:"#ef4444", suggestions:"#f59e0b" };

export default function FeedbackSection({ title, items, type }) {
  if (!items?.length) return null;
  return (
    <Card>
      <h3 style={{ marginBottom:"14px", fontSize:"1rem", fontWeight:600 }}>
        {ICONS[type]} {title}
      </h3>
      <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"8px" }}>
        {items.map((item, i) => (
          <li key={i} style={{
            display:"flex", gap:"10px", alignItems:"flex-start",
            padding:"10px 12px", background:"var(--surface-2)",
            borderRadius:"var(--radius-sm)", fontSize:"0.875rem",
            borderLeft:`3px solid ${COLORS[type]}`,
          }}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}