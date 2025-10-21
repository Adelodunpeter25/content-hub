import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { useTrending } from '../hooks/useTrending';
import type { Article } from '../types/feed';

export default function TrendingPage() {
  const { getTrending } = useTrending();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    const data = await getTrending({ limit: 20 });
    if (data) setArticles(data.articles);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6 dark:text-white">🔥 Trending Articles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Most popular articles across all users</p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="No trending articles yet"
            description="Check back later to see what's popular."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <a
                key={article.link}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  {article.categories && article.categories.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300">
                      {article.categories[0]}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 dark:text-white">{article.title}</h3>
                {article.summary && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">{article.summary}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{article.published && new Date(article.published).toLocaleDateString()}</span>
                  <span className="text-blue-500">Read →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
