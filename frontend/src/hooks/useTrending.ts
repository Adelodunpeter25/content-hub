import { request } from '../services/api';

export const useTrending = () => {
  const getTrending = async (params: { days?: number; page?: number; limit?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.days) query.append('days', params.days.toString());
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('per_page', params.limit.toString());
      return await request(`/trending?${query}`);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { getTrending };
};
