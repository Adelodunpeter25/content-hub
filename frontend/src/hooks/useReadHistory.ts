import { request } from '../services/api';

export const useReadHistory = () => {
  const getReadHistory = async (page: number = 1, limit: number = 20) => {
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('per_page', limit.toString());
      return await request(`/read-history?${query}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const markAsRead = async (url: string, title?: string, source?: string, category?: string) => {
    try {
      await request('/read-history', {
        method: 'POST',
        body: JSON.stringify({ 
          article_url: url,
          article_title: title,
          article_source: source,
          article_category: category
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { getReadHistory, markAsRead };
};
