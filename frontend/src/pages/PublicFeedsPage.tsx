import { useState} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useFeeds } from '../hooks/useFeeds';

export default function FeedsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  
  const { data, loading, error } = useFeeds({ 
    category: selectedCategory, 
    page, 
    per_page: 20 
  });

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
                {data.articles.map((article, index) => (
                  <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-400 hover:shadow-lg transition-all">
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
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                        onClick={(e) => {
                          if (!article.url) {
                            e.preventDefault();
                            alert('Article URL not available');
                          }
                        }}
                      >
                        Read More <span>→</span>
                      </a>
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
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Want personalized recommendations?</h3>
                <p className="text-gray-600 mb-6">Sign up to bookmark articles, track your reading, and get AI-powered suggestions</p>
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all">
                  Sign Up Free →
                </button>
              </div>
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
