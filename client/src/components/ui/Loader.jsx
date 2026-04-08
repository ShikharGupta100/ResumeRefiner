// src/components/ui/Loader.jsx

export default function Loader({ message = "Analyzing your resume with AI..." }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{
        width:  "52px", height: "52px",
        border: "4px solid var(--border)",
        borderTop: "4px solid var(--primary)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto 20px",
      }} />
      <p style={{ color:"var(--text-muted)", fontSize:"0.95rem" }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}