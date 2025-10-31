import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useFeeds } from '../hooks/useFeeds';
import { useStats } from '../hooks/useStats';
import { useBookmarks } from '../hooks/useBookmarks';
import { useReadHistory } from '../hooks/useReadHistory';
import { useTags } from '../hooks/useTags';
import { useToast } from '../context/ToastContext';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ArticlePreviewModal from '../components/ArticlePreviewModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Flame, BookOpen, TrendingUp, Settings } from 'lucide-react';
import type { Article } from '../types/feed';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { getPersonalizedFeed } = useFeeds();
  const { getReadingStats } = useStats();
  const { addBookmark, getBookmarks } = useBookmarks();
  const { markAsRead } = useReadHistory();
  const { getUserTags, updateUserTags } = useTags();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, streak: 0, total: 0 });
  const [weather] = useState({ temp: 28, location: 'Lagos, Nigeria', condition: 'Mostly sunny', feels: 31 });
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; tags: any[] }>({ isOpen: false, tags: [] });

  const handleNotInterested = async (tags: any[]) => {
    if (!tags || tags.length === 0) return;
    setConfirmDialog({ isOpen: true, tags });
  };

  const confirmRemoveTags = async () => {
    const tags = confirmDialog.tags;
    const tagNames = tags.map(t => t.name).join(', ');
    
    try {
      const { tag_ids } = await getUserTags();
      const tagIdsToRemove = tags.map(t => t.id);
      const newTagIds = tag_ids.filter(id => !tagIdsToRemove.includes(id));
      await updateUserTags(newTagIds);
      showToast(`Removed ${tagNames} from your interests`, 'success');
      loadFeed();
    } catch (err: any) {
      showToast(err.message || 'Failed to update interests', 'error');
    } finally {
      setConfirmDialog({ isOpen: false, tags: [] });
    }
  };

  useEffect(() => {
    loadFeed();
    loadStats();
    loadBookmarks();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await getPersonalizedFeed({ page: 1, limit: 5 });
      if (data) setArticles(data.articles);
    } catch (err) {
      console.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getReadingStats();
      if (data) {
        setStats({
          today: data.reads?.today || 0,
          streak: data.reading_streak || 0,
          total: data.reads?.total || 0
        });
      }
    } catch (err) {
      console.error('Failed to load stats');
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
    try {
      await markAsRead(url, title, source, category);
    } catch (err) {
      // Silent fail
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="text-lg mt-2">Here's what's happening today.</p>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Edit Interests</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {articles.slice(0, 3).map((article, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setPreviewArticle(article)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">{article.categories?.[0] || 'General'} • {article.source}</span>
                    <h3 className="font-semibold mt-1 dark:text-white">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{article.summary}</p>
                  </div>
                ))}
                <a href="/feed" className="text-blue-500 hover:underline text-sm">View all articles →</a>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 h-fit">
            <h3 className="font-semibold mb-4 dark:text-white">Weather</h3>
            <div className="text-center">
              <div className="text-5xl mb-2">🌤️</div>
              <div className="text-3xl font-bold dark:text-white">{weather.temp}°C</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">{weather.location}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">☀️ {weather.condition}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">💨 Feels like {weather.feels}°C</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
          <h3 className="font-semibold mb-4 dark:text-white">Reading Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="mx-auto mb-2 text-blue-500" size={32} />
              <div className="text-2xl font-bold dark:text-white">{stats.today}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Read Today</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Flame className="mx-auto mb-2 text-orange-500" size={32} />
              <div className="text-2xl font-bold dark:text-white">{stats.streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="mx-auto mb-2 text-green-500" size={32} />
              <div className="text-2xl font-bold dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Reads</div>
            </div>
          </div>
        </div>

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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Hide These Topics?"
        message={`Remove ${confirmDialog.tags.map(t => t.name).join(', ')} from your interests? You'll see fewer articles about these topics.`}
        confirmText="Remove"
        cancelText="Cancel"
        danger={true}
        onConfirm={confirmRemoveTags}
        onCancel={() => setConfirmDialog({ isOpen: false, tags: [] })}
      />
    </DashboardLayout>
  );
}
