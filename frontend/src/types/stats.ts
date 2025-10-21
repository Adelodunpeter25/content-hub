export interface ReadingStats {
  total_reads: number;
  daily_reads: number;
  weekly_reads: number;
  monthly_reads: number;
  favorite_categories: { category: string; count: number }[];
  reading_streak: number;
}
