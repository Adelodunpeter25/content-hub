import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useFeeds } from '../hooks/useFeeds';
import type { Article } from '../types/feed';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const { getPersonalizedFeed } = useFeeds();

  useEffect(() => {
    if (query.length > 2) {
      searchArticles();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchArticles = async () => {
    setLoading(true);
    const data = await getPersonalizedFeed({ page: 1, limit: 50 });
    if (data) {
      const filtered = data.articles.filter((article: Article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline mb-4">
            ← Back
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Searching...</div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((article) => (
              <a
                key={article.link}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white border rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {article.source}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{article.title}</h3>
                {article.summary && (
                  <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                )}
              </a>
            ))}
          </div>
        ) : query.length > 2 ? (
          <div className="text-center py-8 text-gray-500">No results found</div>
        ) : (
          <div className="text-center py-8 text-gray-500">Type to search articles...</div>
        )}
      </div>
    </DashboardLayout>
  );
}
