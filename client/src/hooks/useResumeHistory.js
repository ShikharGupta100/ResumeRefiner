// src/hooks/useResumeHistory.js
import { useState, useEffect, useCallback } from "react";
import { fetchResumes , deleteResume} from "../api/resumeApi";

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

  const handleDelete = useCallback(async (id)=>{
    try{
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    }catch(error){
      setError(error.message);
    }
  },[]);

  

  return {
    resumes, pagination, loading, error,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    page, reload: () => load(page),
    handleDelete,
    
  };
}