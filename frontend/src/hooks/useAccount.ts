import { request } from '../services/api';

export const useAccount = () => {
  const updateProfile = async (name: string) => {
    try {
      const response = await request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await request('/users/password', {
        method: 'PUT',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      await request('/users/account', { 
        method: 'DELETE',
        body: JSON.stringify({})
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { updateProfile, changePassword, deleteAccount };
};
