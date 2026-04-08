// src/components/ui/Button.jsx

export default function Button({
  children, onClick, disabled = false,
  variant = "primary", fullWidth = false, type = "button",
}) {
  const styles = {
    primary:   { background: "var(--primary)", color: "#fff", border: "none" },
    secondary: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)" },
    danger:    { background: "var(--danger)", color: "#fff", border: "none" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding:      "10px 20px",
        borderRadius: "var(--radius-sm)",
        fontWeight:   600,
        fontSize:     "0.9rem",
        cursor:       disabled ? "not-allowed" : "pointer",
        opacity:      disabled ? 0.5 : 1,
        width:        fullWidth ? "100%" : "auto",
        transition:   "var(--transition)",
      }}
    >
      {children}
    </button>
  );
}