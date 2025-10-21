import { useState } from 'react';
import { request } from '../services/api';
import type { AuthResponse, LoginRequest, SignupRequest } from '../types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token');

    const response: AuthResponse = await request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refresh }),
    });
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    return response;
  };

  return { signup, login, logout, refreshToken, loading, error };
};
