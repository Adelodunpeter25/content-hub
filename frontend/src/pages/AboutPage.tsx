import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Content Hub</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What is Content Hub?</h2>
              <p className="leading-relaxed">Content Hub is a personal feed aggregator that brings together the best tech content from across the web into one unified platform. We collect, organize, and personalize content so you can stay informed without the noise.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">1. Content Aggregation</h3>
                  <p className="leading-relaxed">We collect content from multiple sources every 15 minutes:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>RSS Feeds:</strong> TechCrunch, The Verge, Ars Technica</li>
                    <li><strong>Web Scraping:</strong> Techmeme for trending tech news</li>
                    <li><strong>Social Media:</strong> Reddit (r/technology, r/programming) and YouTube</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">2. AI Categorization</h3>
                  <p className="leading-relaxed">Every article is automatically categorized into topics including AI, Security, Cloud, Mobile, Web, Hardware, Gaming, Startup, and Programming. This helps you quickly find content that matches your interests.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">3. Personalization</h3>
                  <p className="leading-relaxed">Your feed adapts to your preferences. Choose your favorite sources and content types, and we'll prioritize content that matches your interests. The more you use Content Hub, the better your recommendations become.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">4. Smart Features</h3>
                  <p className="leading-relaxed">Bookmark articles to read later, track your reading history, discover trending content across all users, and get insights into your reading habits with detailed statistics.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-2">Backend</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Flask 3.1 (Python)</li>
                    <li>PostgreSQL (Supabase)</li>
                    <li>Redis/Valkey for caching</li>
                    <li>APScheduler for background jobs</li>
                    <li>JWT & OAuth authentication</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Frontend</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>React 19 + TypeScript</li>
                    <li>Vite build tool</li>
                    <li>Tailwind CSS</li>
                    <li>React Router</li>
                    <li>Context API for state</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Why Content Hub?</h2>
              <div className="space-y-3">
                <p className="leading-relaxed"><strong>Save Time:</strong> No more jumping between multiple sites and apps. Everything you need is in one place.</p>
                <p className="leading-relaxed"><strong>Stay Focused:</strong> Our AI categorization and personalization help you cut through the noise and focus on what matters to you.</p>
                <p className="leading-relaxed"><strong>Track Progress:</strong> See your reading stats, discover patterns in your interests, and build reading streaks.</p>
                <p className="leading-relaxed"><strong>Discover More:</strong> Find trending content and explore new topics recommended based on your reading habits.</p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
              <p className="mb-6">Join Content Hub today and transform how you consume tech content.</p>
              <a href="/signup" className="inline-block bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Sign Up Free
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
