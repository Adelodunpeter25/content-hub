import { request } from '../services/api';
import type { PreferencesUpdate } from '../types';

export const usePreferences = () => {
  const getPreferences = async () => {
    try {
      return await request('/users/preferences');
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updatePreferences = async (preferences: PreferencesUpdate) => {
    try {
      return await request('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { getPreferences, updatePreferences };
};
