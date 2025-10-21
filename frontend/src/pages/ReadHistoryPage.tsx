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
        <h2 className="text-3xl font-bold mb-6">Reading History</h2>

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
                <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={item.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-lg hover:text-blue-500"
                      >
                        {item.article_url}
                      </a>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
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
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">Page {page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={history.length < 20}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
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
