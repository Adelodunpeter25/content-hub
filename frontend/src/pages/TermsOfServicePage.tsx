import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">&larr; Back to Home</Link>
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <p className="text-sm text-gray-500">Last updated: October 2025</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Content Hub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>Content Hub is a personal feed aggregator that collects content from RSS feeds, web scraping, and social media platforms. We provide AI-powered categorization and user personalization features to enhance your reading experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>You must create an account to access certain features. You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Content Ownership</h2>
              <p>Content Hub aggregates content from third-party sources. We do not claim ownership of the aggregated content. All content belongs to its respective owners and is subject to their terms and copyright.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p>The Content Hub service, including its original content, features, and functionality, is owned by Content Hub and is protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
              <p>The service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p>Content Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p>We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p>Email: adelodunpeter24@gmail.com</p>
              <p>Phone: +2347039201122</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
