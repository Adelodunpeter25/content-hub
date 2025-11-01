export interface FeedTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  tag_count: number;
  source_count: number;
}

export interface OnboardingData {
  template?: string;
  tag_ids: number[];
  source_names?: string[];
  content_preference?: 'tech' | 'general' | 'both';
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
}
