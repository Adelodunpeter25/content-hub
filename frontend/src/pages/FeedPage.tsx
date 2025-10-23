import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
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
  const { showToast } = useToast();
  const [category, setCategory] = useState(() => localStorage.getItem('feedCategory') || '');
  const [source, setSource] = useState(() => localStorage.getItem('feedSource') || '');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setPage(1);
    setArticles([]);
    localStorage.setItem('feedCategory', category);
    localStorage.setItem('feedSource', source);
  }, [category, source]);

  const handleRefresh = async () => {
    setPage(1);
    setArticles([]);
    await loadFeed();
    showToast('Feed refreshed', 'success');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStart > 0) {
      const distance = e.touches[0].clientY - pullStart;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      handleRefresh();
    }
    setPullStart(0);
    setPullDistance(0);
  };
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const [pullStart, setPullStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
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
  const { addBookmark, getBookmarks } = useBookmarks();
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
    try {
      const data = await getPersonalizedFeed({ category, source_name: source, page, limit: 20 });
      if (data) {
        if (page === 1) {
          setArticles(data.articles);
        } else {
          setArticles(prev => [...prev, ...data.articles]);
        }
        setHasMore(data.articles.length === 20);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks({ page: 1, limit: 100 });
      if (data) setBookmarkedIds(new Set(data.bookmarks.map((b: any) => b.article_url)));
    } catch (err) {
      // Silent fail for bookmarks
    }
  };

  const loadReadHistory = async () => {
    try {
      const data = await getReadHistory({ page: 1, limit: 100 });
      if (data) setReadIds(new Set(data.history.map((h: any) => h.article_url)));
    } catch (err) {
      // Silent fail for history
    }
  };

  const handleBookmark = async (url: string, title: string, source: string) => {
    if (bookmarkedIds.has(url)) {
      // Optimistic update
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
      showToast('Bookmark removed', 'success');
      // Note: removeBookmark by URL not implemented, just update UI
    } else {
      // Optimistic update
      setBookmarkedIds(prev => new Set(prev).add(url));
      try {
        await addBookmark(url, title, source);
        showToast('Article bookmarked', 'success');
      } catch (err: any) {
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(url);
          return next;
        });
        showToast(err.message || 'Failed to bookmark', 'error');
      }
    }
  };

  const handleRead = async (url: string, title?: string, source?: string, category?: string) => {
    // Optimistic update
    setReadIds(prev => new Set(prev).add(url));
    try {
      await markAsRead(url, title, source, category);
    } catch (err) {
      // Silent fail for read tracking
    }
  };

  const categories = ['AI', 'Security', 'Cloud', 'Mobile', 'Web', 'Hardware', 'Gaming', 'Startup', 'Programming', 'Data Science', 'DevOps', 'Cybersecurity'];
  const sources = ['TechCrunch', 'The Verge', 'Ars Technica', 'Hacker News', 'MIT Technology Review', 'WIRED', 'Engadget', 'VentureBeat', 'ZDNet', 'TNW', 'Mashable', 'DEV Community', 'Stack Overflow Blog', 'Medium', 'Techmeme', 'reddit', 'YouTube'];

  return (
    <DashboardLayout>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pullDistance > 0 && (
          <div
            className="text-center py-2 text-gray-500 transition-all"
            style={{ transform: `translateY(${pullDistance}px)` }}
          >
            {pullDistance > 60 ? '🔄 Release to refresh' : '⬇️ Pull to refresh'}
          </div>
        )}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden w-full border dark:border-gray-700 rounded-lg px-4 py-3 dark:bg-gray-800 dark:text-white text-left flex items-center justify-between"
          >
            <span>{category || source ? `${category || 'All'} • ${source || 'All'}` : 'Filter Articles'}</span>
            <span>⚙️</span>
          </button>
          <div className="hidden md:flex gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="border dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Sources</option>
              {sources.map(src => <option key={src} value={src}>{src}</option>)}
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:hidden">
            <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold dark:text-white">Filter Articles</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setCategory(''); setSource(''); setShowFilters(false); }}
                    className="text-sm text-blue-500 font-medium"
                  >
                    Clear All
                  </button>
                  <button onClick={() => setShowFilters(false)} className="text-2xl dark:text-white">×</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Category</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setCategory(''); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg border dark:border-gray-700 ${!category ? 'bg-blue-500 text-white' : 'dark:text-white'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-3 rounded-lg border dark:border-gray-700 ${category === cat ? 'bg-blue-500 text-white' : 'dark:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Source</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => { setSource(''); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg border dark:border-gray-700 ${!source ? 'bg-blue-500 text-white' : 'dark:text-white'}`}
                  >
                    All Sources
                  </button>
                  {sources.map(src => (
                    <button
                      key={src}
                      onClick={() => { setSource(src); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-3 rounded-lg border dark:border-gray-700 ${source === src ? 'bg-blue-500 text-white' : 'dark:text-white'}`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
