// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth  } from "../context/AuthContext";

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      login(data.token, data.user);
      navigate("/");
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

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: "100%", maxWidth: "400px", padding: "36px",
        background: "var(--surface)", borderRadius: "16px",
        border: "1px solid var(--border)",
      }}>
        <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "4px" }}>Welcome back</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "24px" }}>
          Log in to your account
        </p>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>❌ {error}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            style={inputStyle} type="email" placeholder="Email"
            value={form.email} required
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            style={inputStyle} type="password" placeholder="Password"
            value={form.password} required
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Google OAuth */}
        <a
          href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/google`}
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
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}