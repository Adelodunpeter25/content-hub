import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import ScrollToTopButton from './ScrollToTop';
import CommandPalette from './CommandPalette';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = () => {
    if (isMobile) {
      navigate('/search');
    } else {
      setIsSearchOpen(true);
    }
  };

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '📰', label: 'Feed', path: '/feed' },
    { icon: '🔥', label: 'Trending', path: '/trending' },
    { icon: '📑', label: 'Bookmarks', path: '/bookmarks' },
    { icon: '📅', label: 'History', path: '/history' },
    { icon: '📊', label: 'Stats', path: '/stats' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-2xl text-gray-700 mr-2"
            >
              ☰
            </button>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <span className="text-lg font-bold text-white">CH</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent hidden md:block">
              Content Hub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSearch}
              className="border rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50 md:w-64 md:text-left dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <span className="md:hidden text-xl">🔍</span>
              <span className="hidden md:inline">Search articles...</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">{user?.name}</span>
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen sticky top-[73px]">
          <div className="p-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="text-xl">↩️</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
            <aside className="w-64 bg-white dark:bg-gray-800 h-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span className="text-xl">↩️</span>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-6 pb-20 md:pb-6 page-transition">
          {children}
        </main>
      </div>

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Content Hub © 2025 | Built by Peter Adelodun
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-30">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 4).map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                location.pathname === item.path ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <ScrollToTopButton />
    </div>
  );
}
