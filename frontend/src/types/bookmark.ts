export interface Bookmark {
  id: number;
  user_id?: number;
  article_url: string;
  title: string;
  source?: string;
  saved_at: string;
}

export interface BookmarkCreate {
  article_url: string;
  title: string;
  source?: string;
}
