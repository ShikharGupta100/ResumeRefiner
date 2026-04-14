// src/pages/GoogleSuccessPage.jsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../constants";

export default function GoogleSuccessPage() {
  const [searchParams] = useSearchParams();
  const { login }      = useAuth();
  const navigate       = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { navigate("/login"); return; }

     // Fetch full user info instead of decoding JWT (JWT only has id)
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          login(token, data.user); // ✅ has id, name, email
          navigate("/");
        } else {
          navigate("/login?error=google_failed");
        }
      })
      .catch(() => navigate("/login?error=google_failed"));
  }, []);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Signing you in with Google...</p>
    </div>
  );
}