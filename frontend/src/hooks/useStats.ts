import { request } from '../services/api';

export const useStats = () => {
  const getReadingStats = async () => {
    try {
      return await request('/stats');
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getStats = async () => {
    try {
      return await request('/stats');
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { getStats, getReadingStats };
};
