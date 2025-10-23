import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import ScrollToTopButton from './ScrollToTop';
import CommandPalette from './CommandPalette';
import { Home, Newspaper, TrendingUp, Star, Bookmark, History, BarChart3, Settings, LogOut, Menu, Search, Moon, Sun } from 'lucide-react';
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
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Newspaper, label: 'Feed', path: '/feed' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Star, label: 'Most Read', path: '/popular' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: History, label: 'History', path: '/history' },
    { icon: BarChart3, label: 'Stats', path: '/stats' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-700 dark:text-gray-300 mr-2"
            >
              <Menu size={24} />
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
              <span className="md:hidden"><Search size={20} /></span>
              <span className="hidden md:inline">Search articles...</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
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
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-[calc(100vh-73px)] sticky top-[73px] overflow-hidden">
          <div className="p-4 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}>
            <aside className="w-64 bg-white dark:bg-gray-800 h-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b dark:border-gray-700 mb-2 flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <span className="text-lg font-bold text-white">CH</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Content Hub
                </span>
              </div>
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
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <LogOut size={20} />
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

      {!location.pathname.includes('/bookmarks') && !location.pathname.includes('/stats') && !location.pathname.includes('/trending') && !location.pathname.includes('/history') && !location.pathname.includes('/settings') && (
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Content Hub © 2025 | Built by Peter Adelodun
        </footer>
      )}

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-30">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 4).map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                location.pathname === item.path ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <item.icon size={24} />
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
