import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const menuItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '📰', label: 'Feed', path: '/feed' },
    { icon: '📑', label: 'Bookmarks', path: '/bookmarks' },
    { icon: '📊', label: 'Stats', path: '/stats' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
              <span className="text-lg font-bold text-white">CH</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Content Hub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search articles..."
              className="border rounded-lg px-4 py-2 w-64"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen sticky top-[73px]">
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

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">
        Content Hub © 2025 | Built by Peter Adelodun
      </footer>
    </div>
  );
}
