// src/utils/validators.js

export function validateResumeText(text) {
  if (!text || !text.trim()) {
    return "Please paste your resume content.";
  }
  if (text.trim().length < 50) {
    return "Resume text is too short. Please paste the full resume.";
  }
  if (text.trim().length > 15000) {
    return "Resume text is too long. Maximum 15,000 characters allowed.";
  }
  return null; // null = valid
}

export function validateFile(file) {
  if (!file) return "Please select a PDF file.";
  if (file.type !== "application/pdf") {
    return "Only PDF files are supported.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "File size must be under 5MB.";
  }
  return null;
}