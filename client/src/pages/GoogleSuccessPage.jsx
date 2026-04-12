// src/pages/GoogleSuccessPage.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleSuccessPage() {
  const [searchParams] = useSearchParams();
  const { login }      = useAuth();
  const navigate       = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { navigate("/login"); return; }

    // Decode user info from JWT payload (public data only)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      login(token, { id: payload.id });
      navigate("/");
    } catch {
      navigate("/login?error=google_failed");
    }
  }, []);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Signing you in with Google...</p>
    </div>
  );
}