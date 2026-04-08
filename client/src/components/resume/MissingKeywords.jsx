// src/components/resume/MissingKeywords.jsx
import Card from "../ui/Card";

export default function MissingKeywords({ keywords }) {
  if (!keywords?.length) return null;
  return (
    <Card>
      <h3 style={{ marginBottom:"14px", fontSize:"1rem", fontWeight:600 }}>
        🔍 Missing Keywords
      </h3>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
        {keywords.map((kw, i) => (
          <span key={i} style={{
            padding:"4px 12px", borderRadius:"999px", fontSize:"0.8rem",
            background:"#ef444415", color:"#ef4444",
            border:"1px solid #ef444430", fontWeight:500,
          }}>
            {kw}
          </span>
        ))}
      </div>
    </Card>
  );
}