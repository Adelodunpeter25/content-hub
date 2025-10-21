import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useFeeds } from '../hooks/useFeeds';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReadHistory } from '../hooks/useReadHistory';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { Article } from '../types/feed';

import DashboardLayout from '../components/DashboardLayout';

export default function FeedPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const { getPersonalizedFeed } = useFeeds();
  const { addBookmark, removeBookmark, getBookmarks } = useBookmarks();
  const { markAsRead, getReadHistory } = useReadHistory();

  useEffect(() => {
    loadFeed();
    loadBookmarks();
    loadReadHistory();
  }, [category, source, page]);

  const loadFeed = async () => {
    setLoading(true);
    const data = await getPersonalizedFeed({ category, source, page, limit: 20 });
    if (data) setArticles(data.articles);
    setLoading(false);
  };

  const loadBookmarks = async () => {
    const data = await getBookmarks({ page: 1, limit: 100 });
    if (data) setBookmarkedIds(new Set(data.bookmarks.map(b => b.article_url)));
  };

  const loadReadHistory = async () => {
    const data = await getReadHistory({ page: 1, limit: 100 });
    if (data) setReadIds(new Set(data.history.map(h => h.article_url)));
  };

  const handleBookmark = async (url: string, title: string, source: string) => {
    if (bookmarkedIds.has(url)) {
      await removeBookmark(url);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    } else {
      await addBookmark(url, title, source);
      setBookmarkedIds(prev => new Set(prev).add(url));
    }
  };

  const handleRead = async (url: string) => {
    await markAsRead(url);
    setReadIds(prev => new Set(prev).add(url));
    window.open(url, '_blank');
  };

  const categories = ['AI', 'Security', 'Cloud', 'Mobile', 'Web', 'Hardware', 'Gaming', 'Startup', 'Programming'];
  const sources = ['TechCrunch', 'The Verge', 'Ars Technica', 'Techmeme', 'Reddit', 'YouTube'];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6 flex gap-4">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={source}
            onChange={(e) => { setSource(e.target.value); setPage(1); }}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Sources</option>
            {sources.map(src => <option key={src} value={src}>{src}</option>)}
          </select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="Try adjusting your filters or check back later for new content."
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard
                  key={article.link}
                  article={article}
                  onBookmark={handleBookmark}
                  onRead={handleRead}
                  isBookmarked={bookmarkedIds.has(article.link)}
                  isRead={readIds.has(article.link)}
                />
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
                disabled={articles.length < 20}
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
