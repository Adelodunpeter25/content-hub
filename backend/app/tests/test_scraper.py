import unittest
from app.main import app
from app.utils.scraper import scrape_techmeme, scrape_websites

class TestScraper(unittest.TestCase):
    """Test web scraping functionality"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_scrape_techmeme(self):
        """Test scraping Techmeme"""
        articles = scrape_techmeme('https://www.techmeme.com')
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # Check article structure
        article = articles[0]
        self.assertIn('title', article)
        self.assertIn('link', article)
        self.assertIn('source', article)
        self.assertIn('type', article)
        self.assertEqual(article['type'], 'scrape')
        self.assertEqual(article['source'], 'Techmeme')
    
    def test_scrape_websites(self):
        """Test scraping multiple websites"""
        urls = ['https://www.techmeme.com']
        articles = scrape_websites(urls)
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
    
    def test_scrape_endpoint(self):
        """Test /api/scrape endpoint"""
        response = self.client.get('/api/scrape')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('count', data)
        self.assertIn('articles', data)
        self.assertGreater(data['count'], 0)

if __name__ == '__main__':
    unittest.main()
