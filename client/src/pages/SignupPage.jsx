// src/pages/SignupPage.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, verifyEmail, resendOtp } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import {
  Check,
  Clock,
  FileText,
  Gauge,
  History,
  Home,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
    <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30.025 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
  </svg>
);

function getStrength(pwd) {
  if (!pwd) return { width: "0%", label: "", segments: [false, false, false, false] };
  if (pwd.length < 4) return { width: "25%", label: "Weak", color: "#ef4444", segments: [true, false, false, false] };
  if (pwd.length < 6) return { width: "50%", label: "Fair", color: "#f59e0b", segments: [true, true, false, false] };
  if (pwd.length < 8) return { width: "75%", label: "Good", color: "#6366f1", segments: [true, true, true, false] };
  return { width: "100%", label: "Strong", color: "#22c55e", segments: [true, true, true, true] };
}

const segmentColors = ["#ef4444", "#f59e0b", "#6366f1", "#22c55e"];

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

  const remaining = Math.max(0, 600 - elapsed);
  const mins      = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs      = String(remaining % 60).padStart(2, "0");
  const showNudge = elapsed >= OTP_NUDGE_AFTER;
  const strength  = getStrength(form.password);

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
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky z-50 top-0 w-full backdrop-blur-md bg-[#0a0a0f]/90 border-b border-white/10">
        <div className="flex px-8 justify-between items-center h-16">
          <div className="font-bold text-indigo-500 text-lg flex items-center gap-2">
            <Zap className="size-5 fill-[#6366f1]" />
            <span>ATS Resume Checker</span>
          </div>
          <div className="flex items-center gap-8">
            <a className="text-slate-200 text-sm flex items-center gap-2 border-b-2 border-indigo-500 pb-1">
              <Home className="size-4" /> Home
            </a>
            <a className="text-slate-200/70 text-sm flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
              <FileText className="size-4" /> Analyze
            </a>
            <a className="text-slate-200/70 text-sm flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
              <History className="size-4" /> History
            </a>
            <a className="text-slate-200/70 text-sm flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
              <Zap className="size-4" /> Pricing
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-slate-200 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">Login</Link>
            <Link to="/signup" className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-600 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Left */}
        <div className="relative bg-[#111118] flex flex-col items-center justify-center p-12 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[420px] blur-2xl rounded-full bg-indigo-500/35" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Resume mockup card */}
            <div className="relative">
              <div className="shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-2xl bg-[#1a1a24] border border-[#2a2a3a] flex p-6 flex-col gap-3 w-56 h-72">
                <div className="rounded-full bg-indigo-500/60 w-24 h-3" />
                <div className="rounded-full bg-[#2a2a3a] w-full h-2" />
                <div className="w-5/6 rounded-full bg-[#2a2a3a] h-2" />
                <div className="rounded-full bg-[#2a2a3a] w-full h-2" />
                <div className="w-2/3 rounded-full bg-[#2a2a3a] h-2" />
                <div className="rounded-full bg-indigo-500/40 mt-2 w-20 h-2" />
                <div className="rounded-full bg-[#2a2a3a] w-full h-2" />
                <div className="w-4/5 rounded-full bg-[#2a2a3a] h-2" />
              </div>
              <div className="backdrop-blur-md shadow-lg font-semibold rounded-full bg-white/5 text-slate-200 text-xs border border-white/10 flex absolute -right-10 -top-5 px-3 py-1.5 items-center gap-2">
                <Gauge className="size-3.5 text-indigo-500" /> ATS Score: 91
              </div>
              <div className="top-1/2 backdrop-blur-md shadow-lg font-semibold rounded-full bg-white/5 text-slate-200 text-xs border border-white/10 flex absolute -left-14 px-3 py-1.5 items-center gap-2">
                <Check className="size-3.5 text-emerald-400" /> Keywords Matched
              </div>
              <div className="backdrop-blur-md shadow-lg font-semibold rounded-full bg-white/5 text-slate-200 text-xs border border-white/10 flex absolute -right-8 -bottom-5 px-3 py-1.5 items-center gap-2">
                <Sparkles className="size-3.5 text-amber-400" /> Formatting: Excellent
              </div>
            </div>
            <p className="font-bold text-center text-slate-200 text-2xl mt-16">
              Almost there!
            </p>
            <p className="max-w-sm text-center text-slate-500 text-sm mt-3">
              Check your inbox at <span className="text-indigo-400 font-medium">{form.email}</span> for your 6-digit verification code.
            </p>
            <p className="text-slate-600 text-xs mt-3">// check spam if you don't see it</p>
          </div>
        </div>

        {/* Right: OTP form */}
        <div className="animate-in fade-in duration-700 bg-[#0a0a0f] flex px-12 py-8 flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Stepper */}
            <div className="flex mb-8 justify-between items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="size-9 rounded-full bg-[#1e1e2e] text-slate-500 flex justify-center items-center">
                  <Check className="size-4" />
                </div>
                <span className="font-medium text-slate-500 text-xs">Register</span>
              </div>
              <div className="bg-indigo-500/40 mx-2 flex-1 h-px" />
              <div className="flex flex-col items-center gap-2">
                <div className="size-9 shadow-[0_0_16px_rgba(99,102,241,0.5)] rounded-full bg-indigo-500 text-white flex justify-center items-center">
                  <ShieldCheck className="size-4" />
                </div>
                <span className="font-medium text-indigo-500 text-xs">Verify</span>
              </div>
              <div className="bg-[#1e1e2e] mx-2 flex-1 h-px" />
              <div className="flex flex-col items-center gap-2">
                <div className="size-9 rounded-full bg-[#1e1e2e] text-slate-500 flex justify-center items-center">
                  <Check className="size-4" />
                </div>
                <span className="font-medium text-slate-500 text-xs">Done</span>
              </div>
            </div>

            <h1 className="leading-tight font-bold text-slate-200 text-[32px]">Check your inbox</h1>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              6-digit code sent to <span className="text-slate-300">{form.email}</span>
            </p>

            {error  && <div className="bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm px-4 py-3 mb-4">⚠ {error}</div>}
            {resent && <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm px-4 py-3 mb-4">✓ New code sent!</div>}

            {/* Timer badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold"
              style={{ background: remaining < 60 ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)", color: remaining < 60 ? "#f87171" : "#818cf8" }}>
              <Clock className="size-3.5" />
              {mins}:{secs}
            </div>

            {/* OTP boxes */}
            <form onSubmit={handleVerify}>
              <div className="rounded-2xl bg-[#111118]/60 border border-[#1e1e2e] p-5 mb-5">
                <div className="flex mb-4 justify-between items-center">
                  <p className="font-medium text-slate-200 text-sm">Verify your email</p>
                  <div className="font-semibold rounded-full bg-indigo-500/15 text-indigo-500 text-xs flex px-3 py-1 items-center gap-1.5">
                    <Clock className="size-3.5" />{mins}:{secs}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`font-bold rounded-xl text-slate-200 text-lg border flex justify-center items-center w-12 h-14 transition-all ${
                        i < otp.length
                          ? "bg-[#111118] border-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.4)]"
                          : "bg-[#111118] border-[#1e1e2e] text-slate-500"
                      } ${otpError ? "border-red-500" : ""}`}
                    >
                      {otp[i] ?? ""}
                    </div>
                  ))}
                </div>
                {/* Hidden real input */}
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="sr-only"
                  autoFocus
                />
                <p className="text-center text-slate-500 text-xs mt-4">
                  Didn't receive a code?{" "}
                  <button type="button" onClick={handleResend} className="text-slate-400 underline cursor-pointer bg-transparent border-none hover:text-indigo-400 transition-colors">
                    Resend Code
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm shadow-[0_0_24px_rgba(99,102,241,0.5)] hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none mb-4"
              >
                {loading ? "Verifying…" : "Verify Email →"}
              </button>
            </form>

            {showNudge && (
              <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/15 p-4 mb-4">
                <p className="text-center text-slate-500 text-xs mb-3">
                  <span className="text-indigo-400 font-semibold">Still waiting?</span> Skip OTP and sign in with Google instead.
                </p>
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                  className="w-full bg-[#111118] border border-[#1e1e2e] rounded-xl text-slate-200 text-sm font-semibold py-3 flex items-center justify-center gap-2.5 hover:border-[#334155] hover:bg-[#111118] transition-colors"
                >
                  {GOOGLE_SVG} Continue with Google
                </a>
              </div>
            )}

            <p className="text-center text-slate-500 text-sm">
              Wrong email?{" "}
              <button
                onClick={() => { setStep("register"); setOtp(""); setError(""); }}
                className="text-indigo-500 font-semibold bg-transparent border-none cursor-pointer hover:text-indigo-400 transition-colors"
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Register Screen ──────────────────────────────────────────────────────────
  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen w-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky z-50 top-0 w-full backdrop-blur-md bg-[#0a0a0f]/90 border-b border-white/10">
        <div className="flex px-8 justify-between items-center h-16">
          <div className="font-bold text-indigo-500 text-lg flex items-center gap-2">
            <Zap className="size-5 fill-[#6366f1]" />
            <span>ATS Resume Checker</span>
          </div>
          <div className="flex items-center gap-8">
            <a className="text-slate-200 text-sm flex items-center gap-2 border-b-2 border-indigo-500 pb-1">
              <Home className="size-4" /> Home
            </a>
            <a className="text-slate-200/70 text-sm flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
              <FileText className="size-4" /> Analyze
            </a>
            <a className="text-slate-200/70 text-sm flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
              <History className="size-4" /> History
            </a>
            <a className="text-slate-200/70 text-sm flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer">
              <Zap className="size-4" /> Pricing
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-slate-200 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">Login</Link>
            <Link to="/signup" className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:bg-indigo-600 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Left panel */}
        <div className="relative bg-[#111118] flex flex-col p-12 justify-center items-center overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[420px] blur-2xl rounded-full bg-indigo-500/35" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Resume mockup */}
            <div className="relative">
              <div className="shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-2xl bg-[#1a1a24] border border-[#2a2a3a] flex p-6 flex-col gap-3 w-56 h-72">
                <div className="rounded-full bg-indigo-500/60 w-24 h-3" />
                <div className="rounded-full bg-[#2a2a3a] w-full h-2" />
                <div className="w-5/6 rounded-full bg-[#2a2a3a] h-2" />
                <div className="rounded-full bg-[#2a2a3a] w-full h-2" />
                <div className="w-2/3 rounded-full bg-[#2a2a3a] h-2" />
                <div className="rounded-full bg-indigo-500/40 mt-2 w-20 h-2" />
                <div className="rounded-full bg-[#2a2a3a] w-full h-2" />
                <div className="w-4/5 rounded-full bg-[#2a2a3a] h-2" />
              </div>
              <div className="backdrop-blur-md shadow-lg font-semibold rounded-full bg-white/5 text-slate-200 text-xs border border-white/10 flex absolute -right-10 -top-5 px-3 py-1.5 items-center gap-2">
                <Gauge className="size-3.5 text-indigo-500" /> ATS Score: 91
              </div>
              <div className="top-1/2 backdrop-blur-md shadow-lg font-semibold rounded-full bg-white/5 text-slate-200 text-xs border border-white/10 flex absolute -left-14 px-3 py-1.5 items-center gap-2">
                <Check className="size-3.5 text-emerald-400" /> Keywords Matched
              </div>
              <div className="backdrop-blur-md shadow-lg font-semibold rounded-full bg-white/5 text-slate-200 text-xs border border-white/10 flex absolute -right-8 -bottom-5 px-3 py-1.5 items-center gap-2">
                <Sparkles className="size-3.5 text-amber-400" /> Formatting: Excellent
              </div>
            </div>
            <p className="font-bold text-center text-slate-200 text-2xl leading-8 mt-16">
              Start for free. No credit card required.
            </p>
            <p className="max-w-sm text-center text-slate-500 text-sm mt-3">
              Join thousands of job seekers optimizing their resumes to beat applicant tracking systems and land more interviews.
            </p>
          </div>
        </div>

        {/* Right: Register form */}
        <div className="animate-in fade-in duration-700 bg-[#0a0a0f] flex px-12 py-8 flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Stepper */}
            <div className="flex mb-8 justify-between items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="size-9 shadow-[0_0_16px_rgba(99,102,241,0.5)] rounded-full bg-indigo-500 text-white flex justify-center items-center">
                  <UserPlus className="size-4" />
                </div>
                <span className="font-medium text-indigo-500 text-xs">Register</span>
              </div>
              <div className="bg-[#1e1e2e] mx-2 flex-1 h-px" />
              <div className="flex flex-col items-center gap-2">
                <div className="size-9 rounded-full bg-[#1e1e2e] text-slate-500 flex justify-center items-center">
                  <ShieldCheck className="size-4" />
                </div>
                <span className="font-medium text-slate-500 text-xs">Verify</span>
              </div>
              <div className="bg-[#1e1e2e] mx-2 flex-1 h-px" />
              <div className="flex flex-col items-center gap-2">
                <div className="size-9 rounded-full bg-[#1e1e2e] text-slate-500 flex justify-center items-center">
                  <Check className="size-4" />
                </div>
                <span className="font-medium text-slate-500 text-xs">Done</span>
              </div>
            </div>

            <h1 className="leading-tight font-bold text-slate-200 text-[32px]">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1 mb-6">Enter your details to get started in seconds.</p>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm px-4 py-3 mb-4">⚠ {error}</div>}

            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-200 text-sm">Full Name</label>
                  <div className="relative">
                    <User className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={form.name}
                      required
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[#111118] text-slate-200 border border-[#1e1e2e] rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-200 text-sm">Email</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      required
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#111118] text-slate-200 border border-[#1e1e2e] rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-200 text-sm">Password</label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-slate-500 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      required
                      minLength={6}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full bg-[#111118] text-slate-200 border border-[#1e1e2e] rounded-xl pl-9 pr-10 py-3 text-sm outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {/* Strength bars */}
                  <div className="flex mt-1 items-center gap-2">
                    <div className="flex flex-1 gap-1.5">
                      {strength.segments.map((active, i) => (
                        <div
                          key={i}
                          className="rounded-full flex-1 h-1 transition-all duration-300"
                          style={{ background: active ? segmentColors[i] : "#1e1e2e" }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <span className="font-medium text-xs" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm shadow-[0_0_24px_rgba(99,102,241,0.5)] hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none mt-5"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="flex my-4 items-center gap-3">
              <div className="bg-[#1e1e2e] flex-1 h-px" />
              <span className="text-slate-500 text-xs">or</span>
              <div className="bg-[#1e1e2e] flex-1 h-px" />
            </div>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded-xl text-slate-200 text-sm font-semibold py-3 flex items-center justify-center gap-2.5 hover:border-[#334155] hover:bg-[#0f0f18] transition-colors mb-6"
            >
              {GOOGLE_SVG} Sign up with Google
            </a>

            <p className="text-center text-slate-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}