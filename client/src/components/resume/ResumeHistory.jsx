// src/components/resume/ResumeHistory.jsx
import { useNavigate } from "react-router-dom";
import { formatDate, getScoreColor, getGradeMeta } from "../../utils/formatters";
import { FileText, FolderOpen, Upload, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

/* ─── tiny style helpers ─────────────────────────────────── */
const scoreStyle = (score) => {
  if (score >= 80) return { bg: "rgba(34,197,94,0.12)", color: "#22c55e" };
  if (score >= 60) return { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" };
  return { bg: "rgba(239,68,68,0.12)", color: "#ef4444" };
};

const gradeStyle = (grade = "") => {
  const g = grade.toUpperCase();
  if (g.startsWith("A")) return { bg: "rgba(34,197,94,0.12)", color: "#22c55e" };
  if (g.startsWith("B")) return { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" };
  return { bg: "rgba(239,68,68,0.12)", color: "#ef4444" };
};

const Badge = ({ text, style: extra = {} }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minWidth: "36px", padding: "3px 10px", borderRadius: "999px",
    fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.4,
    ...extra,
  }}>{text}</span>
);

/* ─── empty state ────────────────────────────────────────── */
const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      background: "#111118", border: "1px solid #1e1e2e", borderRadius: "16px",
      padding: "64px 24px", textAlign: "center",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
    }}>
      <div style={{
        width: "72px", height: "72px", borderRadius: "16px",
        border: "2px dashed #1e1e2e",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FolderOpen size={36} color="#6366f1" />
      </div>
      <div>
        <h3 style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "1.125rem", margin: "0 0 4px" }}>
          No analyses yet
        </h3>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>
          Upload your first resume to get started
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#6366f1", color: "#fff", border: "none",
          borderRadius: "12px", padding: "10px 20px", fontSize: "0.875rem",
          fontWeight: 600, cursor: "pointer",
          boxShadow: "0 0 24px rgba(99,102,241,0.45)",
        }}
      >
        <Upload size={16} />
        Analyze My Resume
      </button>
    </div>
  );
};

/* ─── pagination button ──────────────────────────────────── */
const PageBtn = ({ onClick, disabled, active, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "36px", height: "36px", borderRadius: "8px", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: active ? 700 : 400,
      fontSize: "0.875rem",
      background: active ? "#6366f1" : "transparent",
      color: disabled ? "#475569" : active ? "#fff" : "#6366f1",
      opacity: disabled ? 0.5 : 1,
      transition: "background 0.15s",
    }}
  >{children}</button>
);

/* ─── main component ─────────────────────────────────────── */
export default function ResumeHistory({ resumes, pagination, page, nextPage, prevPage, onDelete }) {
  const navigate = useNavigate();

  if (!resumes?.length) return <EmptyState />;

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Table card */}
      <div style={{
        background: "#111118", border: "1px solid #1e1e2e",
        borderRadius: "16px", overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1e1e2e", borderBottom: "1px solid #1e1e2e" }}>
              {["File Name", "Date Analyzed", "ATS Score", "Grade", "Actions"].map((h) => (
                <th key={h} style={{
                  padding: "14px 20px", textAlign: h === "Actions" ? "right" : "left",
                  fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase",
                  letterSpacing: "0.06em", color: "#64748b",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resumes.map((r, i) => {
              const sc = scoreStyle(r.score);
              const gc = gradeStyle(r.grade);
              const isLast = i === resumes.length - 1;
              return (
                <tr
                  key={r._id}
                  onClick={() => navigate(`/result/${r._id}`)}
                  style={{
                    background: "#111118",
                    borderBottom: isLast ? "none" : "1px solid #1e1e2e",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#16161f"}
                  onMouseLeave={e => e.currentTarget.style.background = "#111118"}
                >
                  {/* File Name */}
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 500, color: "#e2e8f0" }}>
                      <FileText size={16} color="#6366f1" />
                      {r.fileName || `Resume #${i + 1}`}
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ padding: "16px 20px", color: "#64748b", fontSize: "0.875rem" }}>
                    {formatDate(r.createdAt)}
                  </td>

                  {/* Score */}
                  <td style={{ padding: "16px 20px" }}>
                    <Badge text={r.score} style={{ background: sc.bg, color: sc.color }} />
                  </td>

                  {/* Grade */}
                  <td style={{ padding: "16px 20px" }}>
                    <Badge text={r.grade} style={{ background: gc.bg, color: gc.color }} />
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/result/${r._id}`);
                        }}
                        style={{
                          background: "transparent", border: "1px solid rgba(99,102,241,0.45)",
                          borderRadius: "10px", color: "#6366f1", fontSize: "0.75rem",
                          padding: "5px 12px", cursor: "pointer", fontWeight: 500,
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)"}
                      >
                        View Report
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete this resume analysis?")) onDelete(r._id);
                        }}
                        title="Delete"
                        style={{
                          background: "transparent", border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: "10px", color: "#ef4444", padding: "5px 8px",
                          cursor: "pointer", display: "flex", alignItems: "center",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "#ef4444"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>
          <PageBtn onClick={prevPage} disabled={page === 1}>
            <ChevronLeft size={16} />
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageBtn key={p} onClick={() => p < page ? prevPage() : nextPage()} active={p === page}>
              {p}
            </PageBtn>
          ))}
          <PageBtn onClick={nextPage} disabled={!pagination.hasNextPage}>
            <ChevronRight size={16} />
          </PageBtn>
        </div>
      )}
    </div>
  );
}