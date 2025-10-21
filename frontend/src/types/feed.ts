export interface Feed {
  id?: number;
  title: string;
  url: string;
  source: string;
  type: string;
  category?: string;
  published_at?: string;
  description?: string;
  image_url?: string;
}

export interface FeedResponse {
  feeds: Feed[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
