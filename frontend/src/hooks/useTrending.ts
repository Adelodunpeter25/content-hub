import { useState, useEffect } from 'react';
import { request } from '../services/api';
import type { FeedsResponse } from '../types';

export const useTrending = (days = 7, page = 1, per_page = 20) => {
  const [data, setData] = useState<FeedsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request(`/trending?days=${days}&page=${page}&per_page=${per_page}`);
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [days, page, per_page]);

  return { data, loading, error, refetch: fetchTrending };
};
