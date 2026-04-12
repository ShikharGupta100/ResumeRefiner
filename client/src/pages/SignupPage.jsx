// src/pages/SignupPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function SignupPage() {
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    borderRadius: "8px", border: "1px solid var(--border)",
    background: "var(--surface)", color: "var(--text)",
    fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box",
  };

  if (success) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "36px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📬</div>
        <h2 style={{ fontWeight: 700, marginBottom: "8px" }}>Check your inbox</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          We sent a verification link to <strong>{form.email}</strong>.
          Click it to activate your account.
        </p>
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, display: "block", marginTop: "20px" }}>
          Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: "100%", maxWidth: "400px", padding: "36px",
        background: "var(--surface)", borderRadius: "16px",
        border: "1px solid var(--border)",
      }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "4px" }}>Create account</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "24px" }}>
          Start analyzing your resume for free
        </p>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>❌ {error}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            style={inputStyle} type="text" placeholder="Full name"
            value={form.name} required
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            style={inputStyle} type="email" placeholder="Email"
            value={form.email} required
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            style={inputStyle} type="password" placeholder="Password (min 6 characters)"
            value={form.password} required minLength={6}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <button
            type="submit" disabled={loading}
            style={{
              padding: "11px", borderRadius: "8px", border: "none",
              background: "var(--primary)", color: "#fff",
              fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <a
          href="http://localhost:3000/api/auth/google"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "10px", marginTop: "12px", padding: "11px",
            borderRadius: "8px", border: "1px solid var(--border)",
            color: "var(--text)", fontWeight: 600, fontSize: "0.95rem",
            textDecoration: "none", background: "transparent",
          }}
        >
          <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="" />
          Continue with Google
        </a>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}