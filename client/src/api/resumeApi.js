// src/api/resumeApi.js
import { API_BASE_URL } from "../constants";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.message || "Something went wrong.";
    throw new Error(msg);
  }
  return data;
}

// POST /api/resumes — raw text
export async function analyzeText(content) {
  const res = await fetch(`${API_BASE_URL}/resumes`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ content }),
  });
  return handleResponse(res);
}

// POST /api/resumes/upload-pdf — PDF file
export async function analyzePdf(file) {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await fetch(`${API_BASE_URL}/resumes/upload-pdf`, {
    method: "POST",
    body:   formData,
  });
  return handleResponse(res);
}

// GET /api/resumes?page=1&limit=10
export async function fetchResumes(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE_URL}/resumes?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

// GET /api/resumes/:id
export async function fetchResumeById(id) {
  const res = await fetch(`${API_BASE_URL}/resumes/${id}`);
  return handleResponse(res);
}