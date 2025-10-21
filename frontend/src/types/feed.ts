export interface Article {
  title: string;
  url: string;
  source: string;
  type: string;
  categories?: string[];
  published?: string;
  description?: string;
  image_url?: string;
}

export interface FeedsResponse {
  articles: Article[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
  filters?: any;
  preferences?: {
    feed_sources: string[];
    feed_types: string[];
  };
}
