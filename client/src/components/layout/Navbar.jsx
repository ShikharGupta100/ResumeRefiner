// src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const link = (to, label) => (
    <Link to={to} style={{
      color: pathname === to ? "var(--primary)" : "var(--text-muted)",
      fontWeight: pathname === to ? 600 : 400,
      fontSize: "0.9rem",
      transition: "var(--transition)",
    }}>{label}</Link>
  );

  return (
    <nav style={{
      borderBottom: "1px solid var(--border)",
      background:   "var(--surface)",
      position:     "sticky", top: 0, zIndex: 100,
    }}>
      <div className="container" style={{
        display:"flex", alignItems:"center",
        justifyContent:"space-between", height:"60px",
      }}>
        <Link to="/" style={{
          fontWeight:700, fontSize:"1.1rem", color:"var(--text)",
          display:"flex", alignItems:"center", gap:"8px",
        }}>
          ⚡ ATS Resume Checker
        </Link>
        <div style={{ display:"flex", gap:"24px" }}>
          {link("/", "Analyze")}
          {link("/history", "History")}
        </div>
      </div>
    </nav>
  );
}