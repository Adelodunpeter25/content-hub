import type { Article } from '../types/feed';

interface ArticlePreviewModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark?: () => void;
  onRead?: () => void;
  isBookmarked?: boolean;
}

export default function ArticlePreviewModal({
  article,
  isOpen,
  onClose,
  onBookmark,
  onRead,
  isBookmarked,
}: ArticlePreviewModalProps) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {article.categories && article.categories.length > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {article.categories[0]}
                </span>
              )}
              <span className="text-xs text-gray-500">{article.source}</span>
            </div>
            <h2 className="text-2xl font-bold">{article.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl ml-4">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {article.summary && (
            <p className="text-gray-700 leading-relaxed mb-4">{article.summary}</p>
          )}
          <div className="text-sm text-gray-500">
            Published: {article.published && new Date(article.published).toLocaleDateString()}
          </div>
        </div>

        <div className="p-6 border-t flex items-center justify-between">
          <div className="flex gap-3">
            {onBookmark && (
              <button
                onClick={onBookmark}
                className={`px-4 py-2 rounded-lg border ${
                  isBookmarked
                    ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
            )}
          </div>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onRead}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Read Full Article →
          </a>
        </div>
      </div>
    </div>
  );
}
