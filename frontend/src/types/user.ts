export interface User {
  id: number;
  email: string;
  name?: string;
  onboarding_completed?: boolean;
  created_at?: string;
  last_login_at?: string;
  last_login_ip?: string;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  feed_sources: string[];
  feed_types: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PreferencesUpdate {
  feed_sources?: string[];
  feed_types?: string[];
  show_read_articles?: boolean;
  font_size?: string;
  view_mode?: string;
}
