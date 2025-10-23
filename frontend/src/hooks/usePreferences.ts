import { request } from '../services/api';
import type { PreferencesUpdate } from '../types';

export const usePreferences = () => {
  const getPreferences = async () => {
    try {
      const result = await request('/users/preferences');
      // Store in localStorage for PreferencesContext
      if (result) {
        localStorage.setItem('userPreferences', JSON.stringify(result));
      }
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updatePreferences = async (preferences: PreferencesUpdate) => {
    try {
      const result = await request('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      // Store in localStorage for PreferencesContext
      localStorage.setItem('userPreferences', JSON.stringify(result));
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { getPreferences, updatePreferences };
};
