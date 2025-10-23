import { useState, useEffect } from 'react';
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
  const { showToast } = useToast();
  const { getPopular } = usePopular();
  const { addBookmark, getBookmarks } = useBookmarks();
  const { markAsRead, getReadHistory } = useReadHistory();
  const [articles, setArticles] = useState<Article[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadPopular();
    loadBookmarks();
    loadReadHistory();
  }, []);

  const loadPopular = async () => {
    try {
      const data = await getPopular({ limit: 20 });
      if (data) setArticles(data.articles);
    } catch (error) {
      console.error('Failed to load popular articles:', error);
    } finally {
      setLoading(false);
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
      const data = await getReadHistory({ page: 1, limit: 100 });
      if (data) setReadIds(new Set(data.history.map((h: any) => h.article_url)));
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

  const handleRead = async (url: string) => {
    setReadIds(prev => new Set(prev).add(url));
    try {
      await markAsRead(url);
    } catch (err) {
      // Silent fail
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
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.link}
                article={article}
                onBookmark={handleBookmark}
                onRead={handleRead}
                onPreview={() => setPreviewArticle(article)}
                isBookmarked={bookmarkedIds.has(article.link)}
                isRead={readIds.has(article.link)}
              />
            ))}
          </div>
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
