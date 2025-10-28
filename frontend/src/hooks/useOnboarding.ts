import { request } from '../services/api';
import type { FeedTemplate, OnboardingData } from '../types/onboarding';

export const useOnboarding = () => {
  const getTemplates = async (): Promise<{ templates: FeedTemplate[] }> => {
    try {
      return await request('/onboarding/templates');
    } catch (err: any) {
      console.error('Failed to fetch templates:', err.message);
      throw err;
    }
  };

  const completeOnboarding = async (data: OnboardingData): Promise<any> => {
    try {
      return await request('/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err.message);
      throw err;
    }
  };

  const skipOnboarding = async (): Promise<any> => {
    try {
      return await request('/onboarding/skip', {
        method: 'POST',
      });
    } catch (err: any) {
      console.error('Failed to skip onboarding:', err.message);
      throw err;
    }
  };

  return {
    getTemplates,
    completeOnboarding,
    skipOnboarding,
  };
};
