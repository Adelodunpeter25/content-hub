import unittest
from app.main import app
from app.utils.rss_parser import fetch_rss_feeds

class TestRSSParser(unittest.TestCase):
    """Test RSS parsing functionality"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_fetch_rss_feeds(self):
        """Test fetching RSS feeds"""
        feeds = ['https://techcrunch.com/feed/']
        articles = fetch_rss_feeds(feeds)
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # Check article structure
        article = articles[0]
        self.assertIn('title', article)
        self.assertIn('link', article)
        self.assertIn('summary', article)
        self.assertIn('source', article)
        self.assertIn('type', article)
        self.assertEqual(article['type'], 'rss')
    
    def test_rss_endpoint(self):
        """Test /api/rss endpoint"""
        response = self.client.get('/api/rss')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('count', data)
        self.assertIn('articles', data)
        self.assertGreater(data['count'], 0)

if __name__ == '__main__':
    unittest.main()
