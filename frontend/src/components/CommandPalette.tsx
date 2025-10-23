import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import type { Command } from '../types/command';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const commands: Command[] = [
    { id: 'dashboard', label: 'Go to Dashboard', action: () => navigate('/dashboard'), icon: '🏠', category: 'Navigation' },
    { id: 'feed', label: 'Go to Feed', action: () => navigate('/feed'), icon: '📰', category: 'Navigation' },
    { id: 'trending', label: 'Go to Trending', action: () => navigate('/trending'), icon: '🔥', category: 'Navigation' },
    { id: 'bookmarks', label: 'Go to Bookmarks', action: () => navigate('/bookmarks'), icon: '📑', category: 'Navigation' },
    { id: 'history', label: 'Go to History', action: () => navigate('/history'), icon: '📅', category: 'Navigation' },
    { id: 'stats', label: 'Go to Stats', action: () => navigate('/stats'), icon: '📊', category: 'Navigation' },
    { id: 'settings', label: 'Go to Settings', action: () => navigate('/settings'), icon: '⚙️', category: 'Navigation' },
    { id: 'search', label: 'Search Articles', action: () => navigate('/search'), icon: '🔍', category: 'Actions' },
    { id: 'logout', label: 'Logout', action: logout, icon: '↩️', category: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-32" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b dark:border-gray-700">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="w-full px-4 py-3 text-lg focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
            autoFocus
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No commands found</div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <span className="text-2xl">{cmd.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{cmd.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{cmd.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
