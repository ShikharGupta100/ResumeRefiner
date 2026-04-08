// src/components/resume/ResumeHistory.jsx
import { useNavigate } from "react-router-dom";
import { formatDate, getScoreColor, getGradeMeta } from "../../utils/formatters";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ResumeHistory({ resumes, pagination, page, nextPage, prevPage }) {
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
            <span style={{ color:"var(--text-muted)", fontSize:"1.2rem" }}>→</span>
          </Card>
        );
      })}

      {/* Pagination */}
      {pagination && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px" }}>
          <Button onClick={prevPage} disabled={page === 1} variant="secondary">
            ← Prev
          </Button>
          <span style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button onClick={nextPage} disabled={!pagination.hasNextPage} variant="secondary">
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}