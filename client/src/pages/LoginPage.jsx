// // src/pages/LoginPage.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { loginUser } from "../api/authApi";
// import { useAuth  } from "../context/AuthContext";

// export default function LoginPage() {
//   const { login }    = useAuth();
//   const navigate     = useNavigate();
//   const [form, setForm]       = useState({ email: "", password: "" });
//   const [error, setError]     = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const data = await loginUser(form);
//       login(data.token, data.user);
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const inputStyle = {
//     width: "100%", padding: "10px 14px",
//     borderRadius: "8px", border: "1px solid var(--border)",
//     background: "var(--surface)", color: "var(--text)",
//     fontSize: "0.95rem", outline: "none",
//     boxSizing: "border-box",
//   };

//   return (
//     <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{
//         width: "100%", maxWidth: "400px", padding: "36px",
//         background: "var(--surface)", borderRadius: "16px",
//         border: "1px solid var(--border)",
//       }}>
//         <h2 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "4px" }}>Welcome back</h2>
//         <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "24px" }}>
//           Log in to your account
//         </p>

//         {error && (
//           <p style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>❌ {error}</p>
//         )}

//         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//           <input
//             style={inputStyle} type="email" placeholder="Email"
//             value={form.email} required
//             onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
//           />
//           <input
//             style={inputStyle} type="password" placeholder="Password"
//             value={form.password} required
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
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </form>

//         {/* Google OAuth */}
//         <a
//           href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/auth/google`}
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
//           Don't have an account?{" "}
//           <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
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
  .login-card { animation: fadeSlideUp 0.45s cubic-bezier(.22,1,.36,1) both; }
  .login-input:focus { outline: none; border-color: #818cf8 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
  .login-input.error { animation: shake 0.4s ease; border-color: #dc2626 !important; }
  .primary-btn:hover:not(:disabled) { background: #4338ca !important; }
  .primary-btn:active:not(:disabled) { transform: scale(0.98); }
  .ghost-btn:hover { background: #f3f4f6 !important; }
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  loginArrow: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  ),
};

function InputField({ icon, right, className = "", ...props }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        {icon}
      </span>
      <input className={`login-input ${className}`} style={inputBase} {...props} />
      {right && (
        <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
          {right}
        </span>
      )}
    </div>
  );
}

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
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(160deg,#dbeafe 0%,#f0f4ff 50%,#e0e7ff 100%)",
      }}>
        <div className="login-card" style={card}>

          {/* Logo mark */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "#eef2ff", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            {ICONS.loginArrow}
          </div>

          <h2 style={{ fontWeight: 700, fontSize: "1.5rem", textAlign: "center", marginBottom: 4 }}>
            Sign in with email
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", textAlign: "center", marginBottom: 28 }}>
            Welcome back — let's pick up where you left off
          </p>

          {error && (
            <p style={{
              color: "#dc2626", fontSize: "0.85rem", textAlign: "center",
              background: "#fef2f2", padding: "10px", borderRadius: 10, marginBottom: 14,
            }}>
              ✗ {error}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField
              icon={ICONS.mail}
              type="email" placeholder="Email"
              value={form.email} required
              className={inputErr ? "error" : ""}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <div>
              <InputField
                icon={ICONS.lock}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password} required
                className={inputErr ? "error" : ""}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                right={
                  <span onClick={() => setShowPass(s => !s)}>
                    {showPass ? ICONS.eye : ICONS.eyeOff}
                  </span>
                }
              />
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="primary-btn"
              style={primaryBtn(loading)}
            >
              {loading ? "Signing in…" : "Get Started"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: "0.78rem", color: "#9ca3af", whiteSpace: "nowrap" }}>or sign in with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Google OAuth */}
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
            className="ghost-btn"
            style={ghostBtn}
          >
            <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="" />
            Continue with Google
          </a>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: "0.875rem", color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}