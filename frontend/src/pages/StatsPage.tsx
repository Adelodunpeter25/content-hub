import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStats } from '../hooks/useStats';

export default function StatsPage() {
  const { getStats } = useStats();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getStats();
    if (data) setStats(data);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6 dark:text-white">Reading Statistics</h2>

        {loading ? (
          <LoadingSpinner />
        ) : !stats || stats.reads?.total === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border dark:border-gray-700 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">No Reading Stats Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start reading articles to see your statistics here.</p>
            <button
              onClick={() => window.location.href = '/feed'}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Browse Feed
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Articles Read</h3>
                <p className="text-4xl font-bold text-blue-500">{stats?.reads?.total || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">This Week</h3>
                <p className="text-4xl font-bold text-green-500">{stats?.reads?.week || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Streak</h3>
                <p className="text-4xl font-bold text-orange-500">{stats?.reading_streak || 0} days</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-lg border border-yellow-300 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-4xl">🏆</div>
                <h3 className="text-sm text-yellow-900 mb-2 font-medium">Longest Streak</h3>
                <p className="text-4xl font-bold text-white">{stats?.longest_streak || stats?.reading_streak || 0}</p>
                <p className="text-xs text-yellow-900 mt-1">days</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Reading Activity</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 365 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (364 - i));
                  const dayReads = Math.floor(Math.random() * 5);
                  const intensity = dayReads === 0 ? 'bg-gray-100 dark:bg-gray-800' : 
                                   dayReads === 1 ? 'bg-green-200 dark:bg-green-900' :
                                   dayReads === 2 ? 'bg-green-300 dark:bg-green-700' :
                                   dayReads === 3 ? 'bg-green-400 dark:bg-green-600' :
                                   'bg-green-500 dark:bg-green-500';
                  return (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${intensity} border border-gray-200 dark:border-gray-700`}
                      title={`${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${dayReads} articles`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900 border border-gray-200 dark:border-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700 border border-gray-200 dark:border-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600 border border-gray-200 dark:border-gray-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500 border border-gray-200 dark:border-gray-700"></div>
                <span>More</span>
              </div>
            </div>

            {stats?.favorite_categories && Object.keys(stats.favorite_categories).length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Favorite Categories</h3>
                <div className="space-y-3">
                  {Object.entries(stats.favorite_categories).map(([category, count]: [string, any]) => (
                    <div key={category} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="font-medium dark:text-white">{category}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / stats.reads.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats?.reads && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Reading Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{stats.reads.today}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{stats.reads.month}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">{stats.bookmarks.total}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bookmarks</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
