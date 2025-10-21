import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePreferences } from '../hooks/usePreferences';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const { showToast } = useToast();
  const { getPreferences, updatePreferences } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [feedSources, setFeedSources] = useState<string[]>([]);
  const [feedTypes, setFeedTypes] = useState<string[]>([]);

  const sources = ['TechCrunch', 'The Verge', 'Ars Technica', 'Techmeme', 'Reddit', 'YouTube'];
  const types = ['rss', 'scrape', 'social'];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setName(user?.name || '');
    const prefs = await getPreferences();
    if (prefs) {
      setFeedSources(prefs.feed_sources || []);
      setFeedTypes(prefs.feed_types || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updatePreferences({ feed_sources: feedSources, feed_types: feedTypes });
    setSaving(false);
    if (result) {
      showToast('Preferences saved successfully', 'success');
    } else {
      showToast('Failed to save preferences', 'error');
    }
  };

  const toggleSource = (source: string) => {
    setFeedSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const toggleType = (type: string) => {
    setFeedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-6">Settings</h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full border rounded-lg px-4 py-2 bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Feed Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sources</label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map(source => (
                      <button
                        key={source}
                        onClick={() => toggleSource(source)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          feedSources.includes(source)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content Types</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          feedTypes.includes(type)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h3>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
