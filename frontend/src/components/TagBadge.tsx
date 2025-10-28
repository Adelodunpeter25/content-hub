import type { Tag } from '../types/tag';

interface TagBadgeProps {
  tag: Tag;
  selected?: boolean;
  onClick?: () => void;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-200 dark:border-gray-700',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2',
};

export default function TagBadge({ tag, selected, onClick, showDescription, size = 'md' }: TagBadgeProps) {
  const colorClass = colorClasses[tag.color] || colorClasses.gray;
  const sizeClass = sizeClasses[size];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        ${sizeClass}
        ${colorClass}
        rounded-full font-medium border transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-md' : 'cursor-default'}
        ${selected ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900 scale-105' : ''}
        ${!onClick ? 'opacity-90' : ''}
      `}
      title={showDescription ? tag.description : undefined}
    >
      {tag.name}
    </button>
  );
}
