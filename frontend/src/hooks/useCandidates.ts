import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Candidate } from '@/types/candidate';

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/candidates');
      setCandidates(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los candidatos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates
  };
} 