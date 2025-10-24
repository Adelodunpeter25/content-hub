import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { usePreferences } from '../hooks/usePreferences';
import { useAccount } from '../hooks/useAccount';
import ConfirmDialog from '../components/ConfirmDialog';
import { User, Lock, Calendar, Palette, Eye, EyeOff, Check, AlertTriangle, X } from 'lucide-react';

export default function SettingsPage() {

  const { user, logout } = useAuthContext();
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();
  const { getPreferences, updatePreferences } = usePreferences();
  const { updateProfile, changePassword, deleteAccount } = useAccount();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');
  const [nameEditing, setNameEditing] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReadArticles, setShowReadArticles] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable'>('comfortable');
  const [feedSources, setFeedSources] = useState<string[]>([]);
  const [feedTypes, setFeedTypes] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sources = ['TechCrunch', 'The Verge', 'Ars Technica', 'Hacker News', 'MIT Technology Review', 'WIRED', 'Engadget', 'VentureBeat', 'ZDNet', 'TNW', 'Mashable', 'DEV Community', 'Stack Overflow Blog', 'Medium', 'Techmeme', 'reddit', 'YouTube'];
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
      setShowReadArticles(prefs.show_read_articles !== false);
      setFontSize(prefs.font_size || 'medium');
      setViewMode(prefs.view_mode || 'comfortable');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const result = await updatePreferences({ 
      feed_sources: feedSources, 
      feed_types: feedTypes,
      show_read_articles: showReadArticles,
      font_size: fontSize,
      view_mode: viewMode
    });
    setSaving(false);
    if (result) {
      setSaved(true);
      showToast('Preferences saved successfully', 'success');
      setTimeout(() => setSaved(false), 3000);
      // Reload page to refresh feed with new preference
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Failed to save preferences', 'error');
    }
  };

  const handleNameSave = async () => {
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    setNameSaving(true);
    try {
      await updateProfile(name);
      setNameEditing(false);
      showToast('Name updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update name', 'error');
      setName(user?.name || '');
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      showToast('Password changed successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordSaving(false);
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

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    const result = await updatePreferences({ 
      feed_sources: feedSources, 
      feed_types: feedTypes,
      show_read_articles: showReadArticles,
      font_size: fontSize,
      view_mode: viewMode
    });
    setSaving(false);
    if (result) {
      setSaved(true);
      showToast('All settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 3000);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Failed to save settings', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold dark:text-white">Settings</h2>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="md:hidden bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {saved && <Check size={16} />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-blue-500" />
                <h3 className="text-xl font-semibold dark:text-white">Profile</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Name</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 border dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-900 dark:text-white"
                      disabled={!nameEditing}
                    />
                    {!nameEditing ? (
                      <button
                        onClick={() => setNameEditing(true)}
                        className="px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleNameSave}
                          disabled={nameSaving}
                          className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          {nameSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => { setNameEditing(false); setName(user?.name || ''); }}
                          className="flex-1 sm:flex-none px-4 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full border dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-900 dark:text-white"
                    disabled
                  />
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
                  </div>
                  {user?.last_login_at && (
                    <div className="flex items-center gap-2">
                      <Lock size={16} />
                      <span>Last login: {new Date(user.last_login_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {user?.last_login_ip && <span className="text-xs">({user.last_login_ip})</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock size={20} className="text-blue-500" />
                  <h3 className="text-xl font-semibold dark:text-white">Change Password</h3>
                </div>
                {showPasswordForm && (
                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border dark:border-gray-700 rounded-lg px-4 py-2 pr-10 dark:bg-gray-900 dark:text-white"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border dark:border-gray-700 rounded-lg px-4 py-2 pr-10 dark:bg-gray-900 dark:text-white"
                        placeholder="Enter new password (min 8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border dark:border-gray-700 rounded-lg px-4 py-2 pr-10 dark:bg-gray-900 dark:text-white"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={passwordSaving}
                      className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {passwordSaving && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {passwordSaving ? 'Changing...' : 'Save Password'}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-6 py-2 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={20} className="text-blue-500" />
                <h3 className="text-xl font-semibold dark:text-white">Display Preferences</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Theme</label>
                  <div className="flex gap-2">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t as 'light' | 'dark' | 'system')}
                        className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                          theme === t
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Font Size</label>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size as 'small' | 'medium' | 'large')}
                        className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                          fontSize === size
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">View Mode</label>
                  <div className="flex gap-2">
                    {['compact', 'comfortable'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode as 'compact' | 'comfortable')}
                        className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                          viewMode === mode
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showReadArticles ? <Eye size={20} className="text-gray-500" /> : <EyeOff size={20} className="text-gray-500" />}
                    <div>
                      <label className="text-sm font-medium dark:text-white">Show Read Articles</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Display articles you've already read in your feed</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReadArticles(!showReadArticles)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showReadArticles ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      showReadArticles ? 'transform translate-x-6' : ''
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-blue-500" />
                <h3 className="text-xl font-semibold dark:text-white">Feed Preferences</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Sources</label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map(source => (
                      <button
                        key={source}
                        onClick={() => toggleSource(source)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          feedSources.includes(source)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-300">Content Types</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          feedTypes.includes(type)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
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
                  {saved && <Check size={16} />}
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border dark:border-gray-700 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="hidden md:flex w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 items-center justify-center gap-2 mt-6"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {saved && <Check size={16} />}
              {saving ? 'Saving All Settings...' : saved ? 'All Settings Saved!' : 'Save All Settings'}
            </button>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
          confirmText="Delete Account"
          cancelText="Cancel"
          danger
          loading={deleting}
          onConfirm={async () => {
            setShowDeleteConfirm(false);
            setDeleting(true);
            const success = await deleteAccount();
            setDeleting(false);
            if (success) {
              showToast('Account deleted successfully', 'success');
              logout();
            } else {
              showToast('Failed to delete account', 'error');
            }
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </DashboardLayout>
  );
}
