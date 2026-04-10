// src/components/ui/Card.jsx

export default function Card({ children, style = {},onClick}) {
  return (
    <div style={{
      background:   "var(--surface)",
      border:       "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding:      "24px",
      boxShadow:    "var(--shadow)",
      ...style,
    }}
     onClick={onClick}
    >
      {children}
    </div>
  );
}