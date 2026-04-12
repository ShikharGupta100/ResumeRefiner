// src/api/resumeApi.js
import { API_BASE_URL } from "../constants";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { "Authorization": `Bearer ${token}` }
    : {};
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong.");
  return data;
}

export async function analyzeText(content) {
  const res = await fetch(`${API_BASE_URL}/resumes`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body:    JSON.stringify({ content }),
  });
  return handleResponse(res);
}

export async function analyzePdf(file) {
  const formData = new FormData();
  formData.append("resume", file);
  const res = await fetch(`${API_BASE_URL}/resumes/upload-pdf`, {
    method:  "POST",
    headers: { ...authHeaders() },  // no Content-Type — browser sets multipart boundary
    body:    formData,
  });
  return handleResponse(res);
}

export async function fetchResumes(page = 1, limit = 10) {
  const res = await fetch(`${API_BASE_URL}/resumes?page=${page}&limit=${limit}`, {
    headers: { ...authHeaders() },
  });
  return handleResponse(res);
}

export async function fetchResumeById(id) {
  const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    headers: { ...authHeaders() },
  });
  return handleResponse(res);
}

export async function deleteResume(id) {
  const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    method:  "DELETE",
    headers: { ...authHeaders() },
  });
  return handleResponse(res);
}