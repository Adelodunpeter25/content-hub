import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import ArticleCard from '../components/ArticleCard';
import ArticlePreviewModal from '../components/ArticlePreviewModal';
import { usePopular } from '../hooks/usePopular';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReadHistory } from '../hooks/useReadHistory';
import { useToast } from '../context/ToastContext';
import type { Article } from '../types/feed';

export default function PopularPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getPopular } = usePopular();
  const { addBookmark, getBookmarks } = useBookmarks();
  const { markAsRead, getReadHistory } = useReadHistory();
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(p => p + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    loadBookmarks();
    loadReadHistory();
  }, []);

  useEffect(() => {
    loadPopular();
  }, [page]);

  const loadPopular = async () => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const data = await getPopular({ limit: 20, page });
      if (data) {
        if (page === 1) {
          setArticles(data.articles);
        } else {
          setArticles(prev => [...prev, ...data.articles]);
        }
        setHasMore(data.articles.length === 20);
      }
    } catch (error) {
      console.error('Failed to load popular articles:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks({ page: 1, limit: 100 });
      if (data) setBookmarkedIds(new Set(data.bookmarks.map((b: any) => b.article_url)));
    } catch (err) {
      // Silent fail
    }
  };

  const loadReadHistory = async () => {
    try {
      const data = await getReadHistory(1, 100);
      if (data?.items) setReadIds(new Set(data.items.map((h: any) => h.article_url)));
    } catch (err) {
      // Silent fail
    }
  };

  const handleBookmark = async (url: string, title: string, source: string) => {
    if (bookmarkedIds.has(url)) {
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
      showToast('Bookmark removed', 'success');
    } else {
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
    setReadIds(prev => new Set(prev).add(url));
    try {
      await markAsRead(url, title, source, category);
      showToast('Marked as read', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to mark as read', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6 dark:text-white">⭐ Most Read Articles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Most read articles across all users in the last 7 days</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="No popular articles yet"
            description="Check back later to see what's popular."
            action={{ label: 'Browse Feed', onClick: () => navigate('/feed') }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            {loadingMore && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading more...</div>
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
