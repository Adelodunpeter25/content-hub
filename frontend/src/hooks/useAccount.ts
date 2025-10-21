import { request } from '../services/api';

export const useAccount = () => {
  const deleteAccount = async () => {
    try {
      await request('/users/account', { method: 'DELETE' });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { deleteAccount };
};
