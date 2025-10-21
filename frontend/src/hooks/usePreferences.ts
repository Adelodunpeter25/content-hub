import { useState, useEffect } from 'react';
import { request } from '../services/api';
import type { UserPreferences, PreferencesUpdate } from '../types';

export const usePreferences = () => {
  const [data, setData] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request('/users/preferences');
      setData(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences: PreferencesUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      setData(response);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return { data, loading, error, updatePreferences, refetch: fetchPreferences };
};
