export interface ReadHistory {
  id: number;
  user_id: number;
  article_url: string;
  article_title?: string;
  article_source?: string;
  article_category?: string;
  read_at: string;
}

export interface ReadHistoryCreate {
  article_url: string;
  article_title?: string;
  article_source?: string;
  article_category?: string;
}
