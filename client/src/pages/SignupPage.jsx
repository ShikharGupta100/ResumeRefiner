// src/pages/SignupPage.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, verifyEmail, resendOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@500;700;800&display=swap');

  .sp-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    font-family: 'Syne', sans-serif;
  }

  /* Left panel */
  .sp-left {
    background: #6366f1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .sp-left::before {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    top: -100px; left: -100px;
  }
  .sp-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
    bottom: -80px; right: -80px;
  }
  .sp-feature-card {
    background: #0f0f1a;
    border: 1px solid #1e1e2e;
    border-radius: 20px;
    padding: 28px;
    width: 280px;
    position: relative;
    z-index: 1;
    box-shadow: 0 0 60px rgba(0,0,0,0.4);
  }
  .sp-feature-title {
    color: #94a3b8;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 20px;
  }
  .sp-feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #1e1e2e;
  }
  .sp-feature-item:last-child { border-bottom: none; }
  .sp-feature-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #818cf8;
    flex-shrink: 0;
  }
  .sp-feature-label {
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0;
  }
  .sp-feature-sub {
    font-size: 11px;
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }
  .sp-left-caption {
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 20px;
    position: relative;
    z-index: 1;
    text-align: center;
  }

  /* Right panel */
  .sp-right {
    background: #111118;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }
  .sp-form-wrap {
    width: 100%;
    max-width: 380px;
  }
  .sp-heading {
    font-size: 36px;
    font-weight: 800;
    color: #e2e8f0;
    margin-bottom: 6px;
    line-height: 1.1;
  }
  .sp-subheading {
    color: #475569;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 32px;
  }
  .sp-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 8px;
  }
  .sp-input-wrap {
    position: relative;
    margin-bottom: 16px;
  }
  .sp-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
    pointer-events: none;
    display: flex;
  }
  .sp-input {
    width: 100%;
    background: #0a0a12;
    border: 1px solid #1e1e2e;
    border-radius: 12px;
    color: #e2e8f0;
    font-size: 14px;
    font-family: 'Syne', sans-serif;
    padding: 12px 16px 12px 42px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .sp-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .sp-input::placeholder { color: #334155; }
  .sp-input.error {
    border-color: #ef4444;
    animation: sp-shake 0.4s ease;
  }
  @keyframes sp-shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .sp-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #475569;
    display: flex;
  }
  .sp-strength {
    height: 4px;
    border-radius: 99px;
    background: #1e1e2e;
    margin-top: 8px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .sp-strength-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.3s, background 0.3s;
  }
  .sp-btn-primary {
    width: 100%;
    background: #6366f1;
    border: none;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    padding: 13px;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 0 28px rgba(99,102,241,0.35);
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    margin-bottom: 20px;
  }
  .sp-btn-primary:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 0 36px rgba(99,102,241,0.5); }
  .sp-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .sp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .sp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .sp-divider-line { flex: 1; height: 1px; background: #1e1e2e; }
  .sp-divider-text {
    font-size: 12px;
    color: #334155;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }
  .sp-btn-google {
    width: 100%;
    background: #0a0a12;
    border: 1px solid #1e1e2e;
    border-radius: 12px;
    color: #94a3b8;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 24px;
  }
  .sp-btn-google:hover { border-color: #334155; background: #111118; }
  .sp-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    color: #f87171;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .sp-success {
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 10px;
    color: #4ade80;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .sp-footer-text {
    text-align: center;
    font-size: 13px;
    color: #475569;
  }
  .sp-footer-text a {
    color: #6366f1;
    font-weight: 600;
    text-decoration: none;
  }

  /* OTP screen */
  .sp-otp-wrap {
    width: 100%;
    max-width: 380px;
  }
  .sp-otp-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: #818cf8;
  }
  .sp-otp-input {
    width: 100%;
    background: #0a0a12;
    border: 1px solid #1e1e2e;
    border-radius: 14px;
    color: #e2e8f0;
    font-size: 2rem;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    padding: 16px;
    text-align: center;
    letter-spacing: 16px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 16px;
  }
  .sp-otp-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .sp-otp-input.error {
    border-color: #ef4444;
    animation: sp-shake 0.4s ease;
  }
  .sp-timer {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 24px;
  }
  .sp-timer-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: sp-blink 1s step-start infinite;
  }
  @keyframes sp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .sp-nudge {
    background: rgba(99,102,241,0.06);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 14px;
    padding: 16px;
    margin-top: 20px;
  }
  .sp-nudge p {
    font-size: 12px;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    margin: 0 0 12px;
  }
  .sp-nudge strong { color: #818cf8; }

  @media (max-width: 768px) {
    .sp-wrap { grid-template-columns: 1fr; }
    .sp-left { display: none; }
  }
`;

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30.025 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
);

function getStrength(pwd) {
  if (!pwd) return { width: "0%", color: "#1e1e2e" };
  if (pwd.length < 4) return { width: "25%", color: "#ef4444" };
  if (pwd.length < 6) return { width: "50%", color: "#f59e0b" };
  if (pwd.length < 8) return { width: "75%", color: "#6366f1" };
  return { width: "100%", color: "#22c55e" };
}

const OTP_NUDGE_AFTER = 90;

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
  const [elapsed, setElapsed]   = useState(0);
  const timerRef                = useRef(null);

  useEffect(() => {
    if (step === "otp") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const remaining  = Math.max(0, 600 - elapsed);
  const mins       = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs       = String(remaining % 60).padStart(2, "0");
  const showNudge  = elapsed >= OTP_NUDGE_AFTER;
  const strength   = getStrength(form.password);

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

  // ── OTP Screen ──────────────────────────────────────────────────────────────
  if (step === "otp") return (
    <>
      <style>{css}</style>
      <div className="sp-wrap">
        {/* Left panel */}
        <div className="sp-left">
          <div className="sp-feature-card">
            <div className="sp-feature-title">// almost_there</div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">Check your inbox</div>
                <div className="sp-feature-sub">{form.email}</div>
              </div>
            </div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">6-digit code</div>
                <div className="sp-feature-sub">expires in {mins}:{secs}</div>
              </div>
            </div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">One step away</div>
                <div className="sp-feature-sub">from your account</div>
              </div>
            </div>
          </div>
          <p className="sp-left-caption">// check spam if you don't see it</p>
        </div>

        {/* Right: OTP form */}
        <div className="sp-right">
          <div className="sp-otp-wrap">
            <div className="sp-otp-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>

            <h1 className="sp-heading">Check inbox</h1>
            <p className="sp-subheading">// 6-digit code sent to {form.email}</p>

            <span className="sp-timer" style={{ background: remaining < 60 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: remaining < 60 ? "#f87171" : "#4ade80" }}>
              <span className="sp-timer-dot" />
              {mins}:{secs}
            </span>

            {error  && <div className="sp-error">⚠ {error}</div>}
            {resent && <div className="sp-success">✓ New code sent!</div>}

            <form onSubmit={handleVerify}>
              <input
                className={`sp-otp-input${otpError ? " error" : ""}`}
                type="text" placeholder="——————"
                maxLength={6} value={otp} required
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              <button type="submit" disabled={loading || otp.length !== 6} className="sp-btn-primary">
                {loading ? "Verifying…" : "Verify Email →"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <button onClick={handleResend} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>
                Didn't get it? Resend code
              </button>
            </div>

            {showNudge && (
              <div className="sp-nudge">
                <p><strong>Still waiting?</strong> Skip OTP and sign in with Google instead.</p>
                <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} className="sp-btn-google" style={{ marginBottom: 0 }}>
                  {GOOGLE_SVG} Continue with Google
                </a>
              </div>
            )}

            <p className="sp-footer-text" style={{ marginTop: 20 }}>
              Wrong email?{" "}
              <button onClick={() => { setStep("register"); setOtp(""); setError(""); }} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "'Syne', sans-serif" }}>
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );

  // ── Register Screen ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="sp-wrap">

        {/* Left panel */}
        <div className="sp-left">
          <div className="sp-feature-card">
            <div className="sp-feature-title">// what_you_get</div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">Keyword Analysis</div>
                <div className="sp-feature-sub">match job description</div>
              </div>
            </div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">ATS Score</div>
                <div className="sp-feature-sub">instant compatibility</div>
              </div>
            </div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">AI Suggestions</div>
                <div className="sp-feature-sub">tailored improvements</div>
              </div>
            </div>
            <div className="sp-feature-item">
              <div className="sp-feature-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="14" y="2" width="4" height="20"/><rect x="6" y="12" width="4" height="10"/><rect x="2" y="17" width="4" height="5"/>
                </svg>
              </div>
              <div>
                <div className="sp-feature-label">Score Breakdown</div>
                <div className="sp-feature-sub">detailed analytics</div>
              </div>
            </div>
          </div>
          <p className="sp-left-caption">// free forever · no credit card needed</p>
        </div>

        {/* Right: Register form */}
        <div className="sp-right">
          <div className="sp-form-wrap">
            <h1 className="sp-heading">Create Account</h1>
            <p className="sp-subheading">// start analyzing your resume for free</p>

            {error && <div className="sp-error">⚠ {error}</div>}

            <form onSubmit={handleRegister}>
              {/* Name */}
              <label className="sp-label">Full Name</label>
              <div className="sp-input-wrap">
                <span className="sp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <input
                  className="sp-input"
                  type="text" placeholder="John Doe"
                  value={form.name} required
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Email */}
              <label className="sp-label">Email</label>
              <div className="sp-input-wrap">
                <span className="sp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <input
                  className="sp-input"
                  type="email" placeholder="you@example.com"
                  value={form.email} required
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              {/* Password */}
              <label className="sp-label">Password</label>
              <div className="sp-input-wrap" style={{ marginBottom: 8 }}>
                <span className="sp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                  </svg>
                </span>
                <input
                  className="sp-input"
                  type={showPass ? "text" : "password"}
                  placeholder="min 6 characters"
                  value={form.password} required minLength={6}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: "42px" }}
                />
                <span className="sp-eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </span>
              </div>
              {/* Password strength bar */}
              <div className="sp-strength">
                <div className="sp-strength-fill" style={{ width: strength.width, background: strength.color }} />
              </div>

              <button type="submit" disabled={loading} className="sp-btn-primary">
                {loading ? "Creating account…" : "Sign Up →"}
              </button>
            </form>

            <div className="sp-divider">
              <div className="sp-divider-line" />
              <span className="sp-divider-text">or continue with</span>
              <div className="sp-divider-line" />
            </div>

            <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} className="sp-btn-google">
              {GOOGLE_SVG}
              Continue with Google
            </a>

            <p className="sp-footer-text">
              Already have an account?{" "}
              <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}