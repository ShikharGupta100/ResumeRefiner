// src/constants/index.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://resumerefiner-cesx.onrender.com/api" ;

export const GRADE_META = {
  A: { color: "#22c55e", bg: "#dcfce7", label: "Excellent" },
  B: { color: "#3b82f6", bg: "#dbeafe", label: "Good" },
  C: { color: "#f59e0b", bg: "#fef3c7", label: "Average" },
  D: { color: "#f97316", bg: "#ffedd5", label: "Needs Work" },
  F: { color: "#ef4444", bg: "#fee2e2", label: "Poor" },
};

export const SCORE_BREAKDOWN_META = {
  keywordDensity:         { label: "Keyword Density",          max: 25, color: "#6366f1" },
  workExperience:         { label: "Work Experience",          max: 20, color: "#3b82f6" },
  quantifiedAchievements: { label: "Quantified Achievements",  max: 20, color: "#22c55e" },
  formatting:             { label: "Formatting & Parseability",max: 15, color: "#f59e0b" },
  skillsSection:          { label: "Skills Section",           max: 10, color: "#ec4899" },
  education:              { label: "Education & Certs",        max: 10, color: "#8b5cf6" },
};

export const TABS = { TEXT: "text", PDF: "pdf" };