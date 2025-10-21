export interface ReadHistory {
  id: number;
  user_id: number;
  article_url: string;
  title?: string;
  source?: string;
  category?: string;
  read_at: string;
}

export interface ReadHistoryCreate {
  article_url: string;
  title?: string;
  source?: string;
  category?: string;
}
