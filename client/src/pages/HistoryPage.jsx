// src/pages/HistoryPage.jsx
import { useResumeHistory } from "../hooks/useResumeHistory";
import ResumeHistory from "../components/resume/ResumeHistory";
import Loader from "../components/ui/Loader";
import { History } from "lucide-react";

export default function HistoryPage() {
  const { resumes, pagination, loading, error, page, nextPage, prevPage, handleDelete } = useResumeHistory();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#e2e8f0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <History size={28} color="#6366f1" />
              Resume History
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "6px" }}>
              Track your progress over time
            </p>
          </div>
        </div>

        {/* Content */}
        {loading && <Loader message="Loading history..." />}
        {error && (
          <p style={{ color: "#ef4444", textAlign: "center", padding: "20px" }}>❌ {error}</p>
        )}
        {!loading && (
          <ResumeHistory
            resumes={resumes}
            pagination={pagination}
            page={page}
            nextPage={nextPage}
            prevPage={prevPage}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}