import { useState, useEffect } from 'react';
import { request } from '../services/api';
import { ReadHistory, ReadHistoryCreate } from '../types';

export const useReadHistory = (page = 1, per_page = 20) => {
  const [data, setData] = useState<{ history: ReadHistory[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request(`/read-history?page=${page}&per_page=${per_page}`);
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (readData: ReadHistoryCreate) => {
    try {
      await request('/read-history', {
        method: 'POST',
        body: JSON.stringify(readData),
      });
      fetchHistory();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, per_page]);

  return { data, loading, error, markAsRead, refetch: fetchHistory };
};
