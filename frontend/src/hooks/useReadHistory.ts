import { request } from '../services/api';

export const useReadHistory = () => {
  const getReadHistory = async (params: { page?: number; limit?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('per_page', params.limit.toString());
      return await request(`/read-history?${query}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const markAsRead = async (url: string) => {
    try {
      await request('/read-history', {
        method: 'POST',
        body: JSON.stringify({ article_url: url }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { getReadHistory, markAsRead };
};
