import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQ from '../components/FAQ';

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const features = [
    { icon: '✨', title: 'Personalized Feed', desc: 'Content filtered by your preferences and interests' },
    { icon: '📰', title: 'Multi-Source Aggregation', desc: 'Collect from RSS feeds, Reddit, YouTube, and web scraping' },
    { icon: '🎯', title: 'AI Recommendations', desc: 'Smart content suggestions based on your reading habits' },
    { icon: '📚', title: 'Bookmarks & History', desc: 'Save your favorite articles and track everything you read' },
    { icon: '📊', title: 'Reading Analytics', desc: 'Track your reading streaks, stats, and favorite categories' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const getVisibleFeatures = () => {
    const visible = [];
    const width = window.innerWidth;
    const count = width < 768 ? 1 : width < 1024 ? 2 : 3;
    for (let i = 0; i < count; i++) {
      visible.push(features[(currentIndex + i) % features.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
            🚀 All Your Content in One Place
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
            Your Personal<br />
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Feed Aggregator</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Aggregate content from RSS feeds, Reddit, YouTube, and web scraping.
            Get AI-powered recommendations tailored just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center">
              Get Started Free →
            </Link>
            <Link to="/feeds" className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-700 text-xl font-bold rounded-xl hover:border-gray-400 hover:shadow-lg transition-all text-center">
              Explore Feeds
            </Link>
          </div>
          <div className="mt-32 hidden sm:grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">10+</div>
              <div className="text-gray-700 font-medium">Content Sources</div>
            </div>
            <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">10x</div>
              <div className="text-gray-700 font-medium">Faster Browsing</div>
            </div>
            <div className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">AI</div>
              <div className="text-gray-700 font-medium">Recommendations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Powerful Features Built for You</h2>
            <p className="text-lg text-gray-600">Everything you need to stay informed and organized</p>
          </div>
          
          {/* Desktop/Tablet Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            <div className="group bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Personalized Feed</h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">Your feed adapts to your interests. Choose sources and topics, and we'll prioritize content that matters to you.</p>
              <div className="text-sm text-purple-600 font-semibold mt-auto">Save 2+ hours weekly</div>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">17+ Content Sources</h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">Aggregate from TechCrunch, Hacker News, Reddit, DEV, Medium, and more. All in one unified platform.</p>
              <div className="text-sm text-blue-600 font-semibold mt-auto">100+ articles daily</div>
            </div>

            <div className="group bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Categorization</h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">Every article automatically sorted into 12+ topics: AI, Security, Cloud, Mobile, Web, and more.</p>
              <div className="text-sm text-cyan-600 font-semibold mt-auto">Smart & accurate</div>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Bookmarks & History</h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">Save articles for later with one click. Automatic read tracking so you never lose your place.</p>
              <div className="text-sm text-green-600 font-semibold mt-auto">Never miss a thing</div>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Reading Analytics</h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">Track your reading streaks, favorite topics, and daily activity. Build better reading habits.</p>
              <div className="text-sm text-orange-600 font-semibold mt-auto">Insights & trends</div>
            </div>

            <div className="group bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border-2 border-pink-100 hover:border-pink-300 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col h-full">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Advanced Search</h3>
              <p className="text-gray-600 mb-4 leading-relaxed flex-1">Filter by source, category, date range, and keywords. Find exactly what you're looking for instantly.</p>
              <div className="text-sm text-pink-600 font-semibold mt-auto">Lightning fast</div>
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                <div className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border-2 border-purple-100 shadow-xl h-80 flex flex-col">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Personalized Feed</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">Your feed adapts to your interests. Choose sources and topics, and we'll prioritize content that matters to you.</p>
                    <div className="text-sm text-purple-600 font-semibold mt-auto">Save 2+ hours weekly</div>
                  </div>
                </div>
                <div className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 shadow-xl h-80 flex flex-col">
                    <div className="text-5xl mb-4">📰</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">17+ Content Sources</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">Aggregate from TechCrunch, Hacker News, Reddit, DEV, Medium, and more. All in one unified platform.</p>
                    <div className="text-sm text-blue-600 font-semibold mt-auto">100+ articles daily</div>
                  </div>
                </div>
                <div className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border-2 border-cyan-100 shadow-xl h-80 flex flex-col">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Categorization</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">Every article automatically sorted into 12+ topics: AI, Security, Cloud, Mobile, Web, and more.</p>
                    <div className="text-sm text-cyan-600 font-semibold mt-auto">Smart & accurate</div>
                  </div>
                </div>
                <div className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-100 shadow-xl h-80 flex flex-col">
                    <div className="text-5xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Bookmarks & History</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">Save articles for later with one click. Automatic read tracking so you never lose your place.</p>
                    <div className="text-sm text-green-600 font-semibold mt-auto">Never miss a thing</div>
                  </div>
                </div>
                <div className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-100 shadow-xl h-80 flex flex-col">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Reading Analytics</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">Track your reading streaks, favorite topics, and daily activity. Build better reading habits.</p>
                    <div className="text-sm text-orange-600 font-semibold mt-auto">Insights & trends</div>
                  </div>
                </div>
                <div className="min-w-full px-4">
                  <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border-2 border-pink-100 shadow-xl h-80 flex flex-col">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Advanced Search</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed flex-1">Filter by source, category, date range, and keywords. Find exactly what you're looking for instantly.</p>
                    <div className="text-sm text-pink-600 font-semibold mt-auto">Lightning fast</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + 6) % 6)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-cyan-500 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % 6)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      {/* CTA */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Content Experience?</span>
          </h2>
          <Link to="/signup" className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all mt-2 inline-block">
            Start Free Today →
          </Link>
          <p className="text-gray-500 text-sm mt-6">No credit card required • Free forever</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
