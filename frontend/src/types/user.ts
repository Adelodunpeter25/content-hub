export interface User {
  id: number;
  email: string;
  name?: string;
  created_at?: string;
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
}
