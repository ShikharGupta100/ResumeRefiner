// src/components/ui/Badge.jsx
import { getGradeMeta } from "../../utils/formatters";

export default function Badge({ grade }) {
  const meta = getGradeMeta(grade);
  return (
    <span style={{
      display:      "inline-flex",
      alignItems:   "center",
      justifyContent:"center",
      width:        "48px",
      height:       "48px",
      borderRadius: "50%",
      background:   meta.bg,
      color:        meta.color,
      fontWeight:   700,
      fontSize:     "1.25rem",
      border:       `2px solid ${meta.color}`,
    }}>
      {grade}
    </span>
  );
}