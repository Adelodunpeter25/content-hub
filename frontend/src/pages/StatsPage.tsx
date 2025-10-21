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
        <h2 className="text-3xl font-bold mb-6">Reading Statistics</h2>

        {loading ? (
          <LoadingSpinner />
        ) : !stats || stats.total_reads === 0 ? (
          <div className="bg-white p-12 rounded-lg border text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No Reading Stats Yet</h3>
            <p className="text-gray-600 mb-6">Start reading articles to see your statistics here.</p>
            <button
              onClick={() => window.location.href = '/feed'}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Browse Feed
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-sm text-gray-600 mb-2">Total Articles Read</h3>
                <p className="text-4xl font-bold text-blue-500">{stats?.total_reads || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-sm text-gray-600 mb-2">This Week</h3>
                <p className="text-4xl font-bold text-green-500">{stats?.weekly_reads || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-sm text-gray-600 mb-2">Current Streak</h3>
                <p className="text-4xl font-bold text-orange-500">{stats?.reading_streak || 0} days</p>
              </div>
            </div>

            {stats?.favorite_categories && Array.isArray(stats.favorite_categories) && stats.favorite_categories.length > 0 && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Favorite Categories</h3>
                <div className="space-y-3">
                  {stats.favorite_categories.map((cat: any) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <span className="font-medium">{cat.category}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(cat.count / stats.total_reads) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats?.daily_reads && Array.isArray(stats.daily_reads) && stats.daily_reads.length > 0 && (
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Reading Activity</h3>
                <div className="grid grid-cols-7 gap-2">
                  {stats.daily_reads.map((day: any, idx: number) => (
                    <div key={idx} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                      <div className="bg-blue-100 rounded p-2">
                        <span className="text-sm font-semibold">{day.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
