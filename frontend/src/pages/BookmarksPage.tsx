import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReadHistory } from '../hooks/useReadHistory';

import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { Bookmark } from '../types/bookmark';

import DashboardLayout from '../components/DashboardLayout';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const { getBookmarks, removeBookmark } = useBookmarks();
  const { markAsRead, getReadHistory } = useReadHistory();

  useEffect(() => {
    loadBookmarks();
    loadReadHistory();
  }, [page]);

  const loadBookmarks = async () => {
    setLoading(true);
    const data = await getBookmarks({ page, limit: 20 });
    if (data) setBookmarks(data.bookmarks);
    setLoading(false);
  };

  const loadReadHistory = async () => {
    const data = await getReadHistory({ page: 1, limit: 100 });
    if (data) setReadIds(new Set(data.history.map(h => h.article_url)));
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6">Your Bookmarks</h2>

        {loading ? (
          <LoadingSpinner />
        ) : bookmarks.length === 0 ? (
          <EmptyState
            title="No bookmarks yet"
            description="Start bookmarking articles from your feed to save them for later."
            action={{ label: 'Go to Feed', onClick: () => navigate('/feed') }}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="bg-white border rounded-lg p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{bookmark.source}</span>
                    <button
                      onClick={async () => {
                        if (confirm('Remove this bookmark?')) {
                          setRemovingId(bookmark.id);
                          await removeBookmark(bookmark.id);
                          setBookmarks(prev => prev.filter(b => b.id !== bookmark.id));
                          setRemovingId(null);
                        }
                      }}
                      disabled={removingId === bookmark.id}
                      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                      title="Remove bookmark"
                    >
                      {removingId === bookmark.id && (
                        <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                      Remove
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 line-clamp-3">{bookmark.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>
                    <a
                      href={bookmark.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline font-medium"
                    >
                      Read →
                    </a>
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
                disabled={bookmarks.length < 20}
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
