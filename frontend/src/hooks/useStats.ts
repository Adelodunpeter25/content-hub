import { request } from '../services/api';

export const useStats = () => {
  const getStats = async () => {
    try {
      return await request('/stats');
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { getStats };
};
