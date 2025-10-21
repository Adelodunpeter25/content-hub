import { request } from '../services/api';
import type { BookmarkCreate } from '../types';

export const useBookmarks = () => {
  const getBookmarks = async (params: { page?: number; limit?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('per_page', params.limit.toString());
      return await request(`/bookmarks?${query}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addBookmark = async (url: string, title: string, source: string) => {
    try {
      await request('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ article_url: url, title, source }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeBookmark = async (bookmarkId: number) => {
    try {
      await request(`/bookmarks/${bookmarkId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  return { getBookmarks, addBookmark, removeBookmark };
};
