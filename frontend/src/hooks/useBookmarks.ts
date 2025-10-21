import { useState, useEffect } from 'react';
import { request } from '../services/api';
import type { Bookmark, BookmarkCreate } from '../types';

export const useBookmarks = (page = 1, per_page = 20) => {
  const [data, setData] = useState<{ bookmarks: Bookmark[]; pagination: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request(`/bookmarks?page=${page}&per_page=${per_page}`);
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (bookmark: BookmarkCreate) => {
    try {
      await request('/bookmarks', {
        method: 'POST',
        body: JSON.stringify(bookmark),
      });
      fetchBookmarks();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBookmark = async (id: number) => {
    try {
      await request(`/bookmarks/${id}`, { method: 'DELETE' });
      fetchBookmarks();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [page, per_page]);

  return { data, loading, error, addBookmark, deleteBookmark, refetch: fetchBookmarks };
};
