import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useFeeds } from '../hooks/useFeeds';
import DashboardLayout from '../components/DashboardLayout';

import LoadingSpinner from '../components/LoadingSpinner';
import type { Article } from '../types/feed';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { getPersonalizedFeed } = useFeeds();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [weather] = useState({ temp: 28, location: 'Lagos, Nigeria', condition: 'Mostly sunny', feels: 31 });

  useEffect(() => {
    loadFeed();
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
          <h1 className="text-3xl font-bold">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-lg mt-2">Here's what's happening today.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {articles.slice(0, 3).map((article, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{article.categories?.[0] || 'General'} • {article.source}</span>
                    <h3 className="font-semibold mt-1 dark:text-white">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{article.description}</p>
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
          <h3 className="font-semibold mb-4 dark:text-white">Quick Notes</h3>
          <textarea
            placeholder="Draft new idea..."
            className="w-full border dark:border-gray-700 rounded-lg p-3 mb-3 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
            rows={3}
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
            <button className="px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">Discard</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
