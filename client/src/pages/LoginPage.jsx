// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@500;700;800&display=swap');

  .lp-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    font-family: 'Syne', sans-serif;
  }

  /* Left panel */
  .lp-left {
    background: #6366f1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .lp-left::before {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    top: -100px; left: -100px;
  }
  .lp-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
    bottom: -80px; right: -80px;
  }
  .lp-score-card {
    background: #0f0f1a;
    border: 1px solid #1e1e2e;
    border-radius: 20px;
    padding: 28px;
    width: 280px;
    position: relative;
    z-index: 1;
    box-shadow: 0 0 60px rgba(0,0,0,0.4);
  }
  .lp-score-title {
    color: #94a3b8;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    margin-bottom: 20px;
  }
  .lp-score-ring {
    width: 120px; height: 120px;
    border-radius: 50%;
    border: 3px solid #1e1e2e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    position: relative;
    background: #0a0a12;
  }
  .lp-score-num {
    font-size: 36px;
    font-weight: 800;
    color: #e2e8f0;
    line-height: 1;
  }
  .lp-score-denom {
    font-size: 12px;
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
  }
  .lp-grade {
    position: absolute;
    top: -4px; right: -4px;
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 16px rgba(34,197,94,0.5);
    color: #0a0a0f;
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lp-bar-row { margin-bottom: 14px; }
  .lp-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 6px;
    color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
  }
  .lp-bar-track {
    height: 6px;
    background: #1e1e2e;
    border-radius: 99px;
    overflow: hidden;
  }
  .lp-bar-fill {
    height: 100%;
    background: #6366f1;
    border-radius: 99px;
  }
  .lp-left-caption {
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    margin-top: 20px;
    position: relative;
    z-index: 1;
    text-align: center;
  }

  /* Right panel */
  .lp-right {
    background: #111118;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }
  .lp-form-wrap {
    width: 100%;
    max-width: 380px;
  }
  .lp-heading {
    font-size: 36px;
    font-weight: 800;
    color: #e2e8f0;
    margin-bottom: 6px;
    line-height: 1.1;
  }
  .lp-subheading {
    color: #475569;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 32px;
  }
  .lp-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 8px;
  }
  .lp-input-wrap {
    position: relative;
    margin-bottom: 16px;
  }
  .lp-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
    pointer-events: none;
    display: flex;
  }
  .lp-input {
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
  .lp-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .lp-input::placeholder { color: #334155; }
  .lp-input.error {
    border-color: #ef4444;
    animation: lp-shake 0.4s ease;
  }
  @keyframes lp-shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .lp-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #475569;
    display: flex;
  }
  .lp-forgot {
    display: block;
    text-align: right;
    font-size: 12px;
    color: #6366f1;
    font-weight: 600;
    text-decoration: none;
    margin-top: -8px;
    margin-bottom: 24px;
  }
  .lp-btn-primary {
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
  .lp-btn-primary:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 0 36px rgba(99,102,241,0.5); }
  .lp-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .lp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .lp-divider-line { flex: 1; height: 1px; background: #1e1e2e; }
  .lp-divider-text {
    font-size: 12px;
    color: #334155;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }
  .lp-btn-google {
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
  .lp-btn-google:hover { border-color: #334155; background: #111118; }
  .lp-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px;
    color: #f87171;
    font-size: 13px;
    font-family: 'JetBrains Mono', monospace;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .lp-footer-text {
    text-align: center;
    font-size: 13px;
    color: #475569;
  }
  .lp-footer-text a {
    color: #6366f1;
    font-weight: 600;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    .lp-wrap { grid-template-columns: 1fr; }
    .lp-left { display: none; }
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

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]         = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [inputErr, setInputErr] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await loginUser(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setInputErr(true);
      setTimeout(() => setInputErr(false), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="lp-wrap">

        {/* ── Left: Score preview ── */}
        <div className="lp-left">
          <div className="lp-score-card">
            <div className="lp-score-title">// your_resume_score</div>
            <div className="lp-score-ring">
              <span className="lp-score-num">82</span>
              <span className="lp-score-denom">/ 100</span>
              <span className="lp-grade">A</span>
            </div>
            <div className="lp-bar-row">
              <div className="lp-bar-label"><span>keyword_density</span><span>88%</span></div>
              <div className="lp-bar-track"><div className="lp-bar-fill" style={{ width: "88%" }} /></div>
            </div>
            <div className="lp-bar-row">
              <div className="lp-bar-label"><span>formatting</span><span>76%</span></div>
              <div className="lp-bar-track"><div className="lp-bar-fill" style={{ width: "76%" }} /></div>
            </div>
            <div className="lp-bar-row">
              <div className="lp-bar-label"><span>skills_match</span><span>82%</span></div>
              <div className="lp-bar-track"><div className="lp-bar-fill" style={{ width: "82%" }} /></div>
            </div>
          </div>
          <p className="lp-left-caption">// join 10,000+ professionals who beat the ATS</p>
        </div>

        {/* ── Right: Login form ── */}
        <div className="lp-right">
          <div className="lp-form-wrap">
            <h1 className="lp-heading">Welcome Back</h1>
            <p className="lp-subheading">// sign in to your account</p>

            {error && <div className="lp-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <label className="lp-label">Email</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <input
                  className={`lp-input${inputErr ? " error" : ""}`}
                  type="email" placeholder="you@example.com"
                  value={form.email} required
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              {/* Password */}
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                  </svg>
                </span>
                <input
                  className={`lp-input${inputErr ? " error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password} required
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingRight: "42px" }}
                />
                <span className="lp-eye" onClick={() => setShowPass(s => !s)}>
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

              <Link to="/forgot-password" className="lp-forgot">Forgot password?</Link>

              <button type="submit" disabled={loading} className="lp-btn-primary">
                {loading ? "Signing in…" : "Get Started →"}
              </button>
            </form>

            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or continue with</span>
              <div className="lp-divider-line" />
            </div>

            <a href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`} className="lp-btn-google">
              {GOOGLE_SVG}
              Continue with Google
            </a>

            <p className="lp-footer-text">
              Don't have an account?{" "}
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}