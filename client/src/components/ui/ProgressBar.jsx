
export default function ProgressBar({ value, max = 100, color = "var(--primary)", height = 8 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{
      background: "var(--surface-2)", borderRadius: "999px",
      height, overflow: "hidden", width: "100%",
    }}>
      <div style={{
        width: `${pct}%`, height: "100%",
        background: color, borderRadius: "999px",
        transition: "width 0.8s ease",
      }} />
    </div>
  );
}