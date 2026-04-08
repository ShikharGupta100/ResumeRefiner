// src/components/resume/SectionChecklist.jsx
import Card from "../ui/Card";

const LABELS = {
  hasContactInfo:    "Contact Information",
  hasSummary:        "Professional Summary",
  hasExperience:     "Work Experience",
  hasEducation:      "Education",
  hasSkills:         "Skills Section",
  hasCertifications: "Certifications",
  hasProjects:       "Projects",
};

export default function SectionChecklist({ detectedSections }) {
  if (!detectedSections) return null;
  const total   = Object.keys(LABELS).length;
  const present = Object.values(detectedSections).filter(Boolean).length;

  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"14px" }}>
        <h3 style={{ fontSize:"1rem", fontWeight:600 }}>📋 Section Detection</h3>
        <span style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>
          {present}/{total} found
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
        {Object.entries(LABELS).map(([key, label]) => {
          const found = detectedSections[key];
          return (
            <div key={key} style={{
              display:"flex", alignItems:"center", gap:"8px",
              padding:"8px 10px", borderRadius:"var(--radius-sm)",
              background: found ? "#22c55e12" : "#ef444412",
              border:`1px solid ${found ? "#22c55e30" : "#ef444430"}`,
              fontSize:"0.82rem",
            }}>
              <span>{found ? "✅" : "❌"}</span>
              <span style={{ color: found ? "var(--text)" : "var(--text-muted)" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}