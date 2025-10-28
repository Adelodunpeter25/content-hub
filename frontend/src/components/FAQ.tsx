import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is Content Hub?',
      answer: 'Content Hub is a personal feed aggregator that collects content from RSS feeds, Reddit, YouTube, and web scraping. It uses AI to automatically categorize articles into topics like AI, Security, Cloud, and more.',
    },
    {
      question: 'How does the AI categorization work?',
      answer: 'Our AI analyzes article titles and content to automatically assign relevant categories. This helps you quickly find articles on topics you care about and filter your feed by category.',
    },
    {
      question: 'What content sources are supported?',
      answer: 'We support RSS feeds (TechCrunch, The Verge, Ars Technica), web scraping (Techmeme), Reddit , and YouTube channels.',
    },
    {
      question: 'Is Content Hub free to use?',
      answer: 'Yes! Content Hub is completely free with no credit card required. All features including AI categorization, bookmarks, and reading analytics are available at no cost.',
    },
    {
      question: 'How do I customize my feed?',
      answer: 'You can customize your feed by setting preferences for content sources and types. The system will filter articles based on your selections and show personalized content.',
    },
    {
      question: 'Can I access my bookmarks across devices?',
      answer: 'Yes, all your data including bookmarks, reading history, and preferences are synced to your account and accessible from any device.',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about Content Hub</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-cyan-400 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 bg-gray-50 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
