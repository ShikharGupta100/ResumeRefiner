// src/components/resume/SectionChecklist.jsx
import { CircleCheck, CircleX } from "lucide-react";

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
  const present = Object.keys(LABELS).filter(k => detectedSections[k]).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-500 text-xs">{present}/{total} sections found</span>
        <span className="text-xs font-semibold" style={{ color: present >= 5 ? "#22c55e" : present >= 3 ? "#f59e0b" : "#ef4444" }}>
          {Math.round((present / total) * 100)}%
        </span>
      </div>
      {Object.entries(LABELS).map(([key, label]) => {
        const found = detectedSections[key];
        return (
          <div
            key={key}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{
              background: found ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.04)",
              border: `1px solid ${found ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)"}`,
            }}
          >
            {found
              ? <CircleCheck className="size-4 text-green-500 shrink-0" />
              : <CircleX className="size-4 text-red-500 shrink-0" />
            }
            <span className={`text-sm ${found ? "text-slate-200" : "text-slate-500"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}