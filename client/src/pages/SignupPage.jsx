// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { registerUser, verifyEmail, resendOtp } from "../api/authApi";
// import { useAuth } from "../context/AuthContext";

// const inputStyle = {
//   width: "100%", padding: "10px 14px",
//   borderRadius: "8px", border: "1px solid var(--border)",
//   background: "var(--surface)", color: "var(--text)",
//   fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
// };

// export default function SignupPage() {
//   const { login }   = useAuth();
//   const navigate    = useNavigate();

//   const [form, setForm]       = useState({ name: "", email: "", password: "" });
//   const [otp, setOtp]         = useState("");
//   const [step, setStep]       = useState("register"); // "register" | "otp"
//   const [error, setError]     = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resent, setResent]   = useState(false);

//   // ── Step 1 — Register ──────────────────────────────────────────────────────
//   async function handleRegister(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await registerUser(form);
//       setStep("otp"); // ✅ move to OTP screen
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ── Step 2 — Verify OTP ────────────────────────────────────────────────────
//   async function handleVerify(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const data = await verifyEmail(form.email, otp);
//       login(data.token, data.user); // ✅ auto-login
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ── Resend OTP ─────────────────────────────────────────────────────────────
//   async function handleResend() {
//     setError("");
//     setResent(false);
//     try {
//       await resendOtp(form.email);
//       setResent(true);
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   // ── OTP Screen ─────────────────────────────────────────────────────────────
//   if (step === "otp") return (
//     <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{
//         width: "100%", maxWidth: "400px", padding: "36px",
//         background: "var(--surface)", borderRadius: "16px",
//         border: "1px solid var(--border)", textAlign: "center",
//       }}>
//         <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📬</div>
//         <h2 style={{ fontWeight: 700, marginBottom: "8px" }}>Check your inbox</h2>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "24px" }}>
//           We sent a 6-digit code to <strong>{form.email}</strong>.
//           It expires in <strong>10 minutes</strong>.
//         </p>

//         {error && (
//           <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>❌ {error}</p>
//         )}
//         {resent && (
//           <p style={{ color: "green", fontSize: "0.875rem", marginBottom: "16px" }}>✅ New code sent!</p>
//         )}

//         <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//           <input
//             style={{ ...inputStyle, fontSize: "1.8rem", textAlign: "center", letterSpacing: "12px", fontWeight: 700 }}
//             type="text"
//             placeholder="000000"
//             maxLength={6}
//             value={otp}
//             required
//             onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} // numbers only
//           />
//           <button
//             type="submit" disabled={loading || otp.length !== 6}
//             style={{
//               padding: "11px", borderRadius: "8px", border: "none",
//               background: "var(--primary)", color: "#fff",
//               fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
//               opacity: (loading || otp.length !== 6) ? 0.7 : 1,
//             }}
//           >
//             {loading ? "Verifying..." : "Verify Email"}
//           </button>
//         </form>

//         <button
//           onClick={handleResend}
//           style={{
//             marginTop: "16px", background: "none", border: "none",
//             color: "var(--primary)", fontWeight: 600,
//             fontSize: "0.875rem", cursor: "pointer",
//           }}
//         >
//           Didn't get the code? Resend
//         </button>

//         <p style={{ marginTop: "12px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
//           Wrong email?{" "}
//           <button
//             onClick={() => { setStep("register"); setOtp(""); setError(""); }}
//             style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
//           >
//             Go back
//           </button>
//         </p>
//       </div>
//     </div>
//   );

//   // ── Register Screen ────────────────────────────────────────────────────────
//   return (
//     <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{
//         width: "100%", maxWidth: "400px", padding: "36px",
//         background: "var(--surface)", borderRadius: "16px",
//         border: "1px solid var(--border)",
//       }}>
//         <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "4px" }}>Create account</h2>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "24px" }}>
//           Start analyzing your resume for free
//         </p>

//         {error && (
//           <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>❌ {error}</p>
//         )}

//         <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//           <input
//             style={inputStyle} type="text" placeholder="Full name"
//             value={form.name} required
//             onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//           />
//           <input
//             style={inputStyle} type="email" placeholder="Email"
//             value={form.email} required
//             onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
//           />
//           <input
//             style={inputStyle} type="password" placeholder="Password (min 6 characters)"
//             value={form.password} required minLength={6}
//             onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
//           />
//           <button
//             type="submit" disabled={loading}
//             style={{
//               padding: "11px", borderRadius: "8px", border: "none",
//               background: "var(--primary)", color: "#fff",
//               fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
//               opacity: loading ? 0.7 : 1,
//             }}
//           >
//             {loading ? "Creating account..." : "Sign Up"}
//           </button>
//         </form>

        
//           <a
//           href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
//           style={{
//             display: "flex", alignItems: "center", justifyContent: "center",
//             gap: "10px", marginTop: "12px", padding: "11px",
//             borderRadius: "8px", border: "1px solid var(--border)",
//             color: "var(--text)", fontWeight: 600, fontSize: "0.95rem",
//             textDecoration: "none", background: "transparent",
//           }}
//         >
//           <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="" />
//           Continue with Google
//         </a>

//         <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
//           Already have an account?{" "}
//           <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Log in</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, verifyEmail, resendOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const css = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
    50%       { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  @keyframes blink {
    0%,100% { opacity:1 } 50% { opacity:0.4 }
  }
  .signup-card { animation: fadeSlideUp 0.45s cubic-bezier(.22,1,.36,1) both; }
  .otp-input:focus { animation: pulse 1.4s infinite; }
  .otp-input.error { animation: shake 0.4s ease; }
  .google-nudge { animation: fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .timer-dot { animation: blink 1s step-start infinite; }
`;

const card = {
  width: "100%", maxWidth: "420px",
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
  padding: "44px 40px",
  color: "#1a1a2e",
};

const inputBase = {
  width: "100%", padding: "12px 16px 12px 44px",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(245,245,250,0.9)",
  color: "#1a1a2e", fontSize: "0.95rem",
  outline: "none", boxSizing: "border-box",
  transition: "border-color .2s, box-shadow .2s",
};

const primaryBtn = (disabled) => ({
  width: "100%", padding: "13px",
  borderRadius: "12px", border: "none",
  background: disabled ? "#a5a5c0" : "#4f46e5",
  color: "#fff", fontWeight: 700,
  fontSize: "1rem", cursor: disabled ? "not-allowed" : "pointer",
  transition: "background .2s, transform .1s",
  marginTop: "4px",
});

const ghostBtn = {
  width: "100%", padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(245,245,250,0.9)",
  color: "#1a1a2e", fontWeight: 600,
  fontSize: "0.95rem", cursor: "pointer",
  display: "flex", alignItems: "center",
  justifyContent: "center", gap: "10px",
  textDecoration: "none", transition: "background .2s",
};

const ICONS = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
};

function InputField({ icon, right, ...props }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        {icon}
      </span>
      <input style={inputBase} {...props} />
      {right && (
        <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
          {right}
        </span>
      )}
    </div>
  );
}

const OTP_NUDGE_AFTER = 90; // seconds before showing Google nudge

export default function SignupPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [otp, setOtp]           = useState("");
  const [step, setStep]         = useState("register");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [resent, setResent]     = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // OTP countdown
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === "otp") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const remaining = Math.max(0, 600 - elapsed); // 10 min expiry
  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const showNudge = elapsed >= OTP_NUDGE_AFTER;

  async function handleRegister(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await registerUser(form);
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await verifyEmail(form.email, otp);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setOtpError(true);
      setTimeout(() => setOtpError(false), 500);
    } finally { setLoading(false); }
  }

  async function handleResend() {
    setError(""); setResent(false);
    try {
      await resendOtp(form.email);
      setResent(true);
      setElapsed(0);
    } catch (err) { setError(err.message); }
  }

  // ── OTP Screen ─────────────────────────────────────────────────────────────
  if (step === "otp") return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(160deg,#dbeafe 0%,#f0f4ff 50%,#e0e7ff 100%)" }}>
        <div className="signup-card" style={card}>

          {/* Icon */}
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h2 style={{ fontWeight: 700, fontSize: "1.4rem", textAlign: "center", marginBottom: 6 }}>Check your inbox</h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", textAlign: "center", marginBottom: 8 }}>
            A 6-digit code was sent to <strong style={{ color: "#1a1a2e" }}>{form.email}</strong>
          </p>

          {/* Timer pill */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: remaining < 60 ? "#fef2f2" : "#f0fdf4", color: remaining < 60 ? "#dc2626" : "#16a34a", fontSize: "0.8rem", fontWeight: 600, padding: "4px 12px", borderRadius: 999 }}>
              <span className="timer-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
              Expires in {mins}:{secs}
            </span>
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", textAlign: "center", marginBottom: 12 }}>✗ {error}</p>}
          {resent && <p style={{ color: "#16a34a", fontSize: "0.85rem", textAlign: "center", marginBottom: 12 }}>✓ New code sent!</p>}

          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              className={`otp-input${otpError ? " error" : ""}`}
              style={{ ...inputBase, padding: "14px", fontSize: "2rem", textAlign: "center", letterSpacing: "16px", fontWeight: 700, borderRadius: 14, background: "#f8f8fc" }}
              type="text" placeholder="——————"
              maxLength={6} value={otp} required
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            <button type="submit" disabled={loading || otp.length !== 6} style={primaryBtn(loading || otp.length !== 6)}>
              {loading ? "Verifying…" : "Verify email"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={handleResend} style={{ background: "none", border: "none", color: "#4f46e5", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
              Didn't get it? Resend code
            </button>
          </div>

          {/* ── Google Nudge (appears after OTP_NUDGE_AFTER seconds) ── */}
          {showNudge && (
            <div className="google-nudge" style={{ marginTop: 20, borderRadius: 14, border: "1px solid #e0e0f0", background: "#fafaff", padding: "16px 18px" }}>
              <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0 0 10px", textAlign: "center" }}>
                <strong style={{ color: "#4f46e5" }}>Still waiting?</strong> Skip the OTP and sign in instantly with Google.
              </p>
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                style={{ ...ghostBtn, background: "#fff", border: "1px solid #d1d5db", fontSize: "0.9rem", borderRadius: 10 }}
              >
                <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="" />
                Continue with Google instead
              </a>
            </div>
          )}

          <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.8rem", color: "#9ca3af" }}>
            Wrong email?{" "}
            <button onClick={() => { setStep("register"); setOtp(""); setError(""); }} style={{ background: "none", border: "none", color: "#4f46e5", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>
              Go back
            </button>
          </p>
        </div>
      </div>
    </>
  );

  // ── Register Screen ────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(160deg,#dbeafe 0%,#f0f4ff 50%,#e0e7ff 100%)" }}>
        <div className="signup-card" style={card}>

          {/* Logo mark */}
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round">
              <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="15 3 15 8 20 8"/>
              <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
            </svg>
          </div>

          <h2 style={{ fontWeight: 700, fontSize: "1.5rem", textAlign: "center", marginBottom: 4 }}>Create your account</h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", textAlign: "center", marginBottom: 28 }}>
            Start analyzing your resume for free
          </p>

          {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", textAlign: "center", background: "#fef2f2", padding: "10px", borderRadius: 10, marginBottom: 14 }}>✗ {error}</p>}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField
              icon={ICONS.user}
              type="text" placeholder="Full name"
              value={form.name} required
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <InputField
              icon={ICONS.mail}
              type="email" placeholder="Email"
              value={form.email} required
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <InputField
              icon={ICONS.lock}
              type={showPass ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={form.password} required minLength={6}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              right={
                <span onClick={() => setShowPass(s => !s)}>
                  {showPass ? ICONS.eye : ICONS.eyeOff}
                </span>
              }
            />
            <button type="submit" disabled={loading} style={primaryBtn(loading)}>
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: "0.78rem", color: "#9ca3af", whiteSpace: "nowrap" }}>or sign in with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} style={{ ...ghostBtn, flex: 1, fontSize: "0.875rem" }}>
              <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="" />
              Google
            </a>
          </div>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: "0.875rem", color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}