// src/pages/VerifyEmailPage.jsx
import { Link } from "react-router-dom";

export default function VerifyEmailPage() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "36px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontWeight: 700, marginBottom: "8px" }}>Already verified?</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "20px" }}>
          If you haven't verified your email yet, please sign up and enter the OTP code sent to your inbox.
        </p>
        <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600, display: "block", marginBottom: "10px" }}>
          Go to Sign Up
        </Link>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, display: "block" }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}