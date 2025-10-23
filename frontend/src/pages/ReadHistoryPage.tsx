import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useReadHistory } from '../hooks/useReadHistory';
import type { ReadHistory } from '../types/readHistory';

export default function ReadHistoryPage() {
  const navigate = useNavigate();
  const { getReadHistory } = useReadHistory();
  const [history, setHistory] = useState<ReadHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getReadHistory({ page, limit: 20 });
    if (data) setHistory(data.history);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6 dark:text-white">Reading History</h2>

        {loading ? (
          <LoadingSpinner />
        ) : history.length === 0 ? (
          <EmptyState
            title="No reading history yet"
            description="Articles you read will appear here."
            action={{ label: 'Browse Feed', onClick: () => navigate('/feed') }}
          />
        ) : (
          <>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.article_category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {item.article_category}
                          </span>
                        )}
                        {item.article_source && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">{item.article_source}</span>
                        )}
                      </div>
                      <a
                        href={item.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-lg hover:text-blue-500 dark:text-white dark:hover:text-blue-400"
                      >
                        {item.article_title || item.article_url}
                      </a>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Read on {new Date(item.read_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(item.read_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border dark:border-gray-700 rounded-lg disabled:opacity-50 dark:text-white dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <span className="px-4 py-2 dark:text-white">Page {page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={history.length < 20}
                className="px-4 py-2 border dark:border-gray-700 rounded-lg disabled:opacity-50 dark:text-white dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
