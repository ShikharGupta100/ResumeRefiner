// src/hooks/useResumeHistory.js
import { useState, useEffect, useCallback } from "react";
import { fetchResumes } from "../api/resumeApi";

export function useResumeHistory() {
  const [resumes,    setResumes]    = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(1);

  const load = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResumes(p, 10);
      setResumes(data.data.resumes);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  return {
    resumes, pagination, loading, error,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    page, reload: () => load(page),
  };
}