import { memo } from 'react';
import type { Article } from '../types/feed';

interface ArticleCardProps {
  article: Article;
  onBookmark?: (url: string, title: string, source: string) => void;
  onRead?: (url: string, title?: string, source?: string, category?: string) => void;
  onNotInterested?: (tags: any[]) => void;
  onPreview?: () => void;
  isBookmarked?: boolean;
  isRead?: boolean;
}

const ArticleCard = memo(function ArticleCard({ article, onBookmark, onRead, onNotInterested, onPreview, isBookmarked, isRead }: ArticleCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AI: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      Security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      Cloud: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      Mobile: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      Web: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      Hardware: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300',
      Gaming: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      Startup: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      Programming: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Data Science': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      DevOps: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      Cybersecurity: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300';
  };

  return (
    <div className={`group relative border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 ${isRead ? 'opacity-60' : 'shadow-md hover:border-blue-300 dark:hover:border-blue-600'}`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 dark:from-blue-900/0 dark:to-purple-900/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 dark:group-hover:from-blue-900/10 dark:group-hover:to-purple-900/10 rounded-xl transition-all duration-300 pointer-events-none"></div>

      <div onClick={onPreview} className="cursor-pointer flex-1 flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-3">
          {article.categories && article.categories.length > 0 && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCategoryColor(article.categories[0])} transition-transform duration-200 group-hover:scale-105`}>
              {article.categories[0]}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-auto">{article.source}</span>
        </div>
        <h3 className="font-bold text-lg mb-3 line-clamp-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{article.title}</h3>
        
        {article.summary && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">{article.summary}</p>
        )}
        <div className="mt-auto"></div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 relative z-10">
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {article.published && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.published).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {onBookmark && (
            <button
              onClick={() => onBookmark(article.link, article.title, article.source)}
              className={`p-2 rounded-lg transition-all duration-200 ${isBookmarked ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-yellow-500'}`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
          {onRead && (
            <button
              onClick={() => onRead(article.link, article.title, article.source, article.categories?.join(','))}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-1.5"
            >
              Read
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ArticleCard;
