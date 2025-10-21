import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuthContext } from '../context/AuthContext';
import { useFeeds } from '../hooks/useFeeds';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReadHistory } from '../hooks/useReadHistory';
import ArticleCard from '../components/ArticleCard';

import EmptyState from '../components/EmptyState';
import type { Article } from '../types/feed';

import DashboardLayout from '../components/DashboardLayout';
import ArticlePreviewModal from '../components/ArticlePreviewModal';
import SkeletonCard from '../components/SkeletonCard';

export default function FeedPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    setArticles([]);
  }, [category, source]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const observer = useRef<IntersectionObserver>();
  const lastArticleRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const { getPersonalizedFeed } = useFeeds();
  const { addBookmark, removeBookmark, getBookmarks } = useBookmarks();
  const { markAsRead, getReadHistory } = useReadHistory();

  useEffect(() => {
    loadBookmarks();
    loadReadHistory();
  }, []);

  useEffect(() => {
    loadFeed();
  }, [category, source, page]);

  const loadFeed = async () => {
    setLoading(true);
    const data = await getPersonalizedFeed({ category, source, page, limit: 20 });
    if (data) {
      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }
      setHasMore(data.articles.length === 20);
    }
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
      showToast('Bookmark removed', 'success');
    } else {
      await addBookmark(url, title, source);
      setBookmarkedIds(prev => new Set(prev).add(url));
      showToast('Article bookmarked', 'success');
    }
  };

  const handleRead = async (url: string) => {
    await markAsRead(url);
    setReadIds(prev => new Set(prev).add(url));
    window.open(url, '_blank');
    showToast('Marked as read', 'info');
  };

  const categories = ['AI', 'Security', 'Cloud', 'Mobile', 'Web', 'Hardware', 'Gaming', 'Startup', 'Programming'];
  const sources = ['TechCrunch', 'The Verge', 'Ars Technica', 'Techmeme', 'Reddit', 'YouTube'];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6 flex gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Sources</option>
            {sources.map(src => <option key={src} value={src}>{src}</option>)}
          </select>
        </div>

        {loading && page === 1 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="No articles found"
            description="Try adjusting your filters or check back later for new content."
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div key={article.link} ref={index === articles.length - 1 ? lastArticleRef : null}>
                  <ArticleCard
                    article={article}
                    onBookmark={handleBookmark}
                    onRead={handleRead}
                    onPreview={() => setPreviewArticle(article)}
                    isBookmarked={bookmarkedIds.has(article.link)}
                    isRead={readIds.has(article.link)}
                  />
                </div>
              ))}
            </div>
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}
          </>
        )}

        <ArticlePreviewModal
          article={previewArticle}
          isOpen={!!previewArticle}
          onClose={() => setPreviewArticle(null)}
          onBookmark={() => {
            if (previewArticle) {
              handleBookmark(previewArticle.link, previewArticle.title, previewArticle.source);
            }
          }}
          onRead={() => {
            if (previewArticle) {
              handleRead(previewArticle.link);
            }
          }}
          isBookmarked={previewArticle ? bookmarkedIds.has(previewArticle.link) : false}
        />
      </div>
    </DashboardLayout>
  );
}
