
// src/components/resume/ResumeHistory.jsx
import { useNavigate } from "react-router-dom";
import { formatDate, getScoreColor, getGradeMeta } from "../../utils/formatters";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ResumeHistory({ resumes, pagination, page, nextPage, prevPage, onDelete }) {  // ← add onDelete
  const navigate = useNavigate();
  if (!resumes?.length) return (
    <p style={{ color:"var(--text-muted)", textAlign:"center", padding:"40px" }}>
      No resumes analyzed yet.
    </p>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
      {resumes.map((r) => {
        const gradeMeta = getGradeMeta(r.grade);
        return (
          <Card key={r._id} style={{
            cursor:"pointer", transition:"var(--transition)",
            display:"flex", alignItems:"center",
            justifyContent:"space-between", gap:"16px",
          }}
            onClick={() => navigate(`/result/${r._id}`)}
          >
            <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <div style={{
                width:"48px", height:"48px", borderRadius:"50%",
                background: gradeMeta.bg, color: gradeMeta.color,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:"1.1rem",
                border:`2px solid ${gradeMeta.color}`,
              }}>{r.grade}</div>
              <div>
                <p style={{ fontWeight:600, color: getScoreColor(r.score) }}>
                  Score: {r.score}/100
                </p>
                <p style={{ fontSize:"0.8rem", color:"var(--text-muted)" }}>
                  {formatDate(r.createdAt)}
                </p>
              </div>
            </div>

            {/* ← REPLACE the lone → span with this */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigating to result
                  if (window.confirm("Delete this resume analysis?")) onDelete(r._id);
                }}
                title="Delete"
                style={{
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:"1.1rem", padding:"4px 6px", borderRadius:"6px",
                  color:"var(--danger)", lineHeight:1,
                  transition:"opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                🗑️
              </button>
              <span style={{ color:"var(--text-muted)", fontSize:"1.2rem" }}>→</span>
            </div>

          </Card>
        );
      })}

      {/* Pagination */}
      {pagination && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px" }}>
          <Button id="prev-btn" name="prevPage" onClick={prevPage} disabled={page === 1} variant="secondary">
            ← Prev
          </Button>
          <span style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button id="next-btn" name="nextPage" onClick={nextPage} disabled={!pagination.hasNextPage} variant="secondary">
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}