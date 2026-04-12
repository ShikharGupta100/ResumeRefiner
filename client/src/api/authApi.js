// src/api/authApi.js
import { API_BASE_URL } from "../constants";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong.");
  return data;
}

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function verifyEmail(token) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);
  return handleResponse(res);
}