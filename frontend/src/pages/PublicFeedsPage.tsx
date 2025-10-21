import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'

export default function FeedsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<any>(null);
  
  useEffect(() => {
    loadFeeds();
  }, [selectedCategory, page]);

  const loadFeeds = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedCategory) query.append('category', selectedCategory);
      query.append('page', page.toString());
      query.append('per_page', '20');
      
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/feeds?${query}`);
      const result = await response.json();
      if (response.ok) {
        setData(result);
        setError(null);
      } else {
        setError('Failed to load feeds');
      }
    } catch (err) {
      setError('Failed to load feeds');
    }
    setLoading(false);
  };

  const categories = ['AI', 'Security', 'Cloud', 'Mobile', 'Web', 'Hardware', 'Gaming', 'Startup', 'Programming'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">Explore Feeds</h1>
            <p className="text-xl text-gray-600">Discover the latest content from across the web</p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === '' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-400'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-600">Failed to load feeds. Please try again.</p>
            </div>
          )}

          {data && data.articles && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {data.articles.map((article: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-400 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setPreviewArticle(article)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                        {article.source}
                      </span>
                      {article.categories && article.categories[0] && (
                        <span className="text-xs text-gray-500">{article.categories[0]}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    {article.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewArticle(article);
                        }}
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        View Details <span>→</span>
                      </button>
                      {article.published_at && (
                        <span className="text-xs text-gray-400">
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination && data.pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg disabled:opacity-50 hover:border-cyan-400 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg">
                    Page {page} of {data.pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                    disabled={page === data.pagination.pages}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg disabled:opacity-50 hover:border-cyan-400 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* CTA */}
              <div className="mt-16 p-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl text-center border-2 border-cyan-200">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Want More Features?</h3>
                <p className="text-gray-600 mb-6">Sign up to bookmark articles, track your reading, and get AI-powered suggestions</p>
                <Link to="/signup" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all inline-block">
                  Sign Up Free →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      <Footer />

      {/* Article Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setPreviewArticle(null)}>
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {previewArticle.categories && previewArticle.categories.length > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {previewArticle.categories[0]}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{previewArticle.source}</span>
                </div>
                <h2 className="text-2xl font-bold">{previewArticle.title}</h2>
              </div>
              <button onClick={() => setPreviewArticle(null)} className="text-gray-500 hover:text-gray-700 text-2xl ml-4">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {previewArticle.summary && (
                <p className="text-gray-700 leading-relaxed mb-4">{previewArticle.summary}</p>
              )}
              {previewArticle.description && (
                <p className="text-gray-700 leading-relaxed mb-4">{previewArticle.description}</p>
              )}
              <div className="text-sm text-gray-500">
                Published: {previewArticle.published && new Date(previewArticle.published).toLocaleDateString()}
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-between">
              <Link
                to="/signup"
                className="text-blue-500 hover:underline text-sm"
              >
                Sign up to bookmark →
              </Link>
              <a
                href={previewArticle.link || previewArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
