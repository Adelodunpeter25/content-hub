import { useState, useEffect } from 'react';
import { request } from '../services/api';
import type { FeedsResponse } from '../types';

export const useFeeds = (params?: { category?: string; source?: string; source_name?: string; page?: number; per_page?: number }) => {
  const [data, setData] = useState<FeedsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const response = await request(`/feeds?${queryParams}`);
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [params?.category, params?.source, params?.source_name, params?.page, params?.per_page]);

  return { data, loading, error, refetch: fetchFeeds };
};

export const usePersonalizedFeeds = (page = 1, per_page = 20) => {
  const [data, setData] = useState<FeedsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request(`/users/feeds?page=${page}&per_page=${per_page}`);
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [page, per_page]);

  return { data, loading, error, refetch: fetchFeeds };
};
