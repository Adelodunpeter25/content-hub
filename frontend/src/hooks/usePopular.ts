import { request } from '../services/api';

export function usePopular() {
  const getPopular = async (params?: { days?: number; limit?: number; page?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.days) queryParams.append('days', params.days.toString());
      if (params?.limit) queryParams.append('per_page', params.limit.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      
      const query = queryParams.toString();
      const response = await request(`/popular${query ? `?${query}` : ''}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch popular articles:', error);
      throw error;
    }
  };

  return { getPopular };
}
