import { request } from '../services/api';


export const useBookmarks = () => {
  const getBookmarks = async (params: { page?: number; limit?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('per_page', params.limit.toString());
      return await request(`/bookmarks?${query}`);
    } catch (err: any) {
      console.error('Failed to fetch bookmarks:', err.message);
      throw err;
    }
  };

  const addBookmark = async (url: string, title: string, source: string) => {
    try {
      await request('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ article_url: url, title, source }),
      });
    } catch (err: any) {
      console.error('Failed to add bookmark:', err.message);
      throw err;
    }
  };

  const removeBookmark = async (bookmarkId: number) => {
    try {
      await request(`/bookmarks/${bookmarkId}`, { method: 'DELETE' });
    } catch (err: any) {
      console.error('Failed to remove bookmark:', err.message);
      throw err;
    }
  };

  return { getBookmarks, addBookmark, removeBookmark };
};
