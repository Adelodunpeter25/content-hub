import { useState, useEffect } from 'react';
import { useFeeds } from '../hooks/useFeeds';
import type { Article } from '../types/feed';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const { getPersonalizedFeed } = useFeeds();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        searchArticles();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const searchArticles = async () => {
    setLoading(true);
    const data = await getPersonalizedFeed({ page: 1, limit: 20 });
    if (data) {
      const filtered = data.articles.filter((article: Article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
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
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                  onClick={onClose}
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
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-900"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
