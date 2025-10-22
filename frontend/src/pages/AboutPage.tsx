import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">About Content Hub</h1>
            <p className="text-xl text-gray-600">Your personal gateway to the best tech content</p>
          </div>
          
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-lg border">
              <h2 className="text-2xl font-semibold mb-4">What is Content Hub?</h2>
              <p className="leading-relaxed text-gray-700">Content Hub is a personal feed aggregator that brings together the best tech content from across the web into one unified platform. We collect, organize, and personalize content so you can stay informed without the noise.</p>
            </section>

            <section className="bg-white p-8 rounded-xl shadow-lg border">
              <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="text-xl font-medium mb-2">1. Content Aggregation</h3>
                  <p className="leading-relaxed text-gray-700">We collect content from multiple sources every 15 minutes:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                    <li><strong>RSS Feeds:</strong> TechCrunch, The Verge, Ars Technica, and more</li>
                    <li><strong>Web Scraping:</strong> Techmeme for trending tech news</li>
                    <li><strong>Social Media:</strong> Reddit and YouTube</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-medium mb-2">2. AI Categorization</h3>
                  <p className="leading-relaxed text-gray-700">Every article is automatically categorized into topics including AI, Security, Cloud, Mobile, Web, Hardware, Gaming, Startup, and Programming. This helps you quickly find content that matches your interests.</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-medium mb-2">3. Personalization</h3>
                  <p className="leading-relaxed text-gray-700">Your feed adapts to your preferences. Choose your favorite sources and content types, and we'll prioritize content that matches your interests. The more you use Content Hub, the better your recommendations become.</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-xl font-medium mb-2">4. Smart Features</h3>
                  <p className="leading-relaxed text-gray-700">Bookmark articles to read later, track your reading history, discover trending content across all users, and get insights into your reading habits with detailed statistics.</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-xl shadow-lg border">
              <h2 className="text-2xl font-semibold mb-6">Why Content Hub?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="font-semibold">Save Time</p>
                    <p className="text-sm text-gray-600">Everything in one place</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <p className="font-semibold">Stay Focused</p>
                    <p className="text-sm text-gray-600">Cut through the noise</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">📊</div>
                  <div>
                    <p className="font-semibold">Track Progress</p>
                    <p className="text-sm text-gray-600">Build reading streaks</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <p className="font-semibold">Discover More</p>
                    <p className="text-sm text-gray-600">Trending & recommended</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-10 rounded-xl shadow-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 opacity-90">Join Content Hub today and transform how you consume tech content.</p>
              <a href="/signup" className="inline-block bg-white text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
                Sign Up Free →
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
