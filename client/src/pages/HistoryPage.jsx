// src/pages/HistoryPage.jsx
import { useResumeHistory } from "../hooks/useResumeHistory";
import ResumeHistory from "../components/resume/ResumeHistory";
import Loader        from "../components/ui/Loader";

export default function HistoryPage() {
  const { resumes, pagination, loading, error, page, nextPage, prevPage ,handleDelete} = useResumeHistory();

  return (
    <div className="container" style={{ paddingTop:"40px", paddingBottom:"60px" }}>
      <div style={{ marginBottom:"28px" }}>
        <h2 style={{ fontSize:"1.5rem", fontWeight:700 }}>📜 Resume History</h2>
        <p style={{ color:"var(--text-muted)", fontSize:"0.875rem", marginTop:"4px" }}>
          All past analyses — click any to view full report.
        </p>
      </div>
      {loading && <Loader message="Loading history..." />}
      {error   && <p style={{ color:"var(--danger)" }}>❌ {error}</p>}
      {!loading && (
        <ResumeHistory
          resumes={resumes} pagination={pagination}
          page={page} nextPage={nextPage} prevPage={prevPage}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}