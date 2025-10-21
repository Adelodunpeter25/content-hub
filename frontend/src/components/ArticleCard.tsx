import type { Article } from '../types/feed';

interface ArticleCardProps {
  article: Article;
  onBookmark?: (url: string, title: string, source: string) => void;
  onRead?: (url: string) => void;
  onPreview?: () => void;
  isBookmarked?: boolean;
  isRead?: boolean;
}

export default function ArticleCard({ article, onBookmark, onRead, onPreview, isBookmarked, isRead }: ArticleCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      AI: 'bg-purple-100 text-purple-700',
      Security: 'bg-red-100 text-red-700',
      Cloud: 'bg-blue-100 text-blue-700',
      Mobile: 'bg-green-100 text-green-700',
      Web: 'bg-cyan-100 text-cyan-700',
      Hardware: 'bg-gray-100 text-gray-700',
      Gaming: 'bg-pink-100 text-pink-700',
      Startup: 'bg-orange-100 text-orange-700',
      Programming: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-lg transition-shadow ${isRead ? 'opacity-60' : ''}`}>
      <div onClick={onPreview} className="cursor-pointer">
      <div className="flex items-center gap-2 mb-2">
        {article.categories && article.categories.length > 0 && (
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(article.categories[0])}`}>
            {article.categories[0]}
          </span>
        )}
        <span className="text-xs text-gray-500">{article.source}</span>
      </div>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
      {article.summary && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
      )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(article.published).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          {onBookmark && (
            <button
              onClick={() => onBookmark(article.link, article.title, article.source)}
              className={`p-2 rounded hover:bg-gray-100 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          )}
          {onRead && (
            <button
              onClick={() => onRead(article.link)}
              className="text-sm text-blue-500 hover:underline"
            >
              Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
