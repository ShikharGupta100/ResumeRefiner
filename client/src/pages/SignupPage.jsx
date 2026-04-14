import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, verifyEmail, resendOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const inputStyle = {
  width: "100%", padding: "10px 14px",
  borderRadius: "8px", border: "1px solid var(--border)",
  background: "var(--surface)", color: "var(--text)",
  fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
};

export default function SignupPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [otp, setOtp]         = useState("");
  const [step, setStep]       = useState("register"); // "register" | "otp"
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent]   = useState(false);

  // ── Step 1 — Register ──────────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      setStep("otp"); // ✅ move to OTP screen
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2 — Verify OTP ────────────────────────────────────────────────────
  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyEmail(form.email, otp);
      login(data.token, data.user); // ✅ auto-login
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  async function handleResend() {
    setError("");
    setResent(false);
    try {
      await resendOtp(form.email);
      setResent(true);
    } catch (err) {
      setError(err.message);
    }
  }

  // ── OTP Screen ─────────────────────────────────────────────────────────────
  if (step === "otp") return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: "100%", maxWidth: "400px", padding: "36px",
        background: "var(--surface)", borderRadius: "16px",
        border: "1px solid var(--border)", textAlign: "center",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📬</div>
        <h2 style={{ fontWeight: 700, marginBottom: "8px" }}>Check your inbox</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "24px" }}>
          We sent a 6-digit code to <strong>{form.email}</strong>.
          It expires in <strong>10 minutes</strong>.
        </p>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>❌ {error}</p>
        )}
        {resent && (
          <p style={{ color: "green", fontSize: "0.875rem", marginBottom: "16px" }}>✅ New code sent!</p>
        )}

        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            style={{ ...inputStyle, fontSize: "1.8rem", textAlign: "center", letterSpacing: "12px", fontWeight: 700 }}
            type="text"
            placeholder="000000"
            maxLength={6}
            value={otp}
            required
            onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} // numbers only
          />
          <button
            type="submit" disabled={loading || otp.length !== 6}
            style={{
              padding: "11px", borderRadius: "8px", border: "none",
              background: "var(--primary)", color: "#fff",
              fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
              opacity: (loading || otp.length !== 6) ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          onClick={handleResend}
          style={{
            marginTop: "16px", background: "none", border: "none",
            color: "var(--primary)", fontWeight: 600,
            fontSize: "0.875rem", cursor: "pointer",
          }}
        >
          Didn't get the code? Resend
        </button>

        <p style={{ marginTop: "12px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Wrong email?{" "}
          <button
            onClick={() => { setStep("register"); setOtp(""); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  );

  // ── Register Screen ────────────────────────────────────────────────────────
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

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
          href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
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