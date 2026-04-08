// src/utils/formatters.js
import { GRADE_META } from "../constants";

export function getGradeMeta(grade) {
  return GRADE_META[grade] || GRADE_META["F"];
}

export function getScoreColor(score) {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#3b82f6";
  if (score >= 55) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function getScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Average";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
    hour:  "2-digit",
    minute:"2-digit",
  });
}

export function getBreakdownPercent(value, max) {
  return Math.round((value / max) * 100);
}