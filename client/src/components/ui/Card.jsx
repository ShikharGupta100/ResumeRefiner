// src/components/ui/Card.jsx

export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background:   "var(--surface)",
      border:       "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding:      "24px",
      boxShadow:    "var(--shadow)",
      ...style,
    }}>
      {children}
    </div>
  );
}