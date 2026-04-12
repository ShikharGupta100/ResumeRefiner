// src/components/layout/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { pathname } = useLocation();
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();

  const link = (to, label) => (
    <Link to={to} style={{
      color:      pathname === to ? "var(--primary)" : "var(--text-muted)",
      fontWeight: pathname === to ? 600 : 400,
      fontSize:   "0.9rem",
      transition: "var(--transition)",
    }}>{label}</Link>
  );

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav style={{
      borderBottom: "1px solid var(--border)",
      background:   "var(--surface)",
      position:     "sticky", top: 0, zIndex: 100,
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "60px",
      }}>
        <Link to="/" style={{
          fontWeight: 700, fontSize: "1.1rem", color: "var(--text)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          ⚡ ATS Resume Checker
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {isAuth && <>
            {link("/", "Analyze")}
            {link("/history", "History")}
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              👤 {user?.name || "Account"}
            </span>
            <button onClick={handleLogout} style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: "8px", padding: "5px 14px",
              color: "var(--text-muted)", cursor: "pointer",
              fontSize: "0.85rem", transition: "var(--transition)",
            }}>
              Logout
            </button>
          </>}
          {!isAuth && <>
            {link("/login",  "Log In")}
            {link("/signup", "Sign Up")}
          </>}
        </div>
      </div>
    </nav>
  );
}