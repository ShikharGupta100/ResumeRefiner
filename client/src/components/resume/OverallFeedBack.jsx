// src/components/resume/OverallFeedback.jsx
import Card from "../ui/Card";

export default function OverallFeedBack({ feedback }) {
  if (!feedback) return null;
  return (
    <Card style={{ borderLeft: "4px solid var(--primary)" }}>
      <h3 style={{ marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
        🧠 AI Executive Summary
      </h3>
      <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.9rem" }}>
        {feedback}
      </p>
    </Card>
  );
}
