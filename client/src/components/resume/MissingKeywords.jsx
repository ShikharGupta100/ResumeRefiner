// src/components/resume/MissingKeywords.jsx
export default function MissingKeywords({ keywords }) {
  if (!keywords?.length) return null;

  // Split into high (red) and medium (orange) priority — first half red, rest orange
  const mid = Math.ceil(keywords.length / 2);

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw, i) => {
        const high = i < mid;
        return (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full text-xs font-medium border"
            style={
              high
                ? { background: "rgba(239,68,68,0.1)", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }
                : { background: "rgba(249,115,22,0.1)", color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }
            }
          >
            {kw}
          </span>
        );
      })}
    </div>
  );
}