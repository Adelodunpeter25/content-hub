export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  color: string;
  created_at?: string;
}

export interface TagCategory {
  category: string;
  tags: Tag[];
}

export interface UserTag {
  id: number;
  user_id: number;
  tag_id: number;
  created_at: string;
}

export interface ArticleTag {
  id: number;
  name: string;
  confidence: number;
}
