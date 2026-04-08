// src/hooks/useResumeUpload.js
import { useState } from "react";
import { analyzeText, analyzePdf } from "../api/resumeApi";
import { validateResumeText, validateFile } from "../utils/validators";

export function useResumeUpload() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [result,  setResult]  = useState(null);

  async function uploadText(content) {
    const validationError = validateResumeText(content);
    if (validationError) { setError(validationError); return; }

    try {
      setLoading(true);
      setError(null);
      const data = await analyzeText(content);
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadPdf(file) {
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    try {
      setLoading(true);
      setError(null);
      const data = await analyzePdf(file);
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return { loading, error, result, uploadText, uploadPdf, reset };
}