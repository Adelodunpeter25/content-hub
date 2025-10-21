import { request } from '../services/api';

export const useFeeds = () => {
  const getPersonalizedFeed = async (params: { category?: string; source?: string; page?: number; limit?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.source) query.append('source', params.source);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('per_page', params.limit.toString());
      return await request(`/users/feeds?${query}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { getPersonalizedFeed };
};
