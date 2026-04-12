// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authApi";
import { useAuth    } from "../context/AuthContext";

export default function VerifyEmailPage() {
  const [searchParams]   = useSearchParams();
  const { login }        = useAuth();
  const navigate         = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); setMessage("No token found in URL."); return; }

    verifyEmail(token)
      .then(data => {
        login(data.token, data.user);  // auto-login after verify
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      })
      .catch(err => {
        setStatus("error");
        setMessage(err.message);
      });
  }, []);

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "36px" }}>
        {status === "verifying" && <>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⏳</div>
          <h2>Verifying your email...</h2>
        </>}
        {status === "success" && <>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontWeight: 700 }}>Email verified!</h2>
          <p style={{ color: "var(--text-muted)" }}>Redirecting you to the app...</p>
        </>}
        {status === "error" && <>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>❌</div>
          <h2 style={{ fontWeight: 700 }}>Verification failed</h2>
          <p style={{ color: "var(--text-muted)" }}>{message}</p>
        </>}
      </div>
    </div>
  );
}