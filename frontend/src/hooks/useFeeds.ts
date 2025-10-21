import { request } from '../services/api';

export const useFeeds = () => {
  const getPersonalizedFeed = async (params: { category?: string; source_name?: string; page?: number; limit?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.source_name) query.append('source_name', params.source_name);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('per_page', params.limit.toString());
      return await request(`/users/feeds?${query}`);
    } catch (err: any) {
      console.error('Failed to fetch feed:', err.message);
      throw err;
    }
  };

  return { getPersonalizedFeed };
};
