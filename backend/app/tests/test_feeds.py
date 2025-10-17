import unittest
from app.main import app

class TestFeedsEndpoint(unittest.TestCase):
    """Test unified feeds endpoint"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_feeds_endpoint(self):
        """Test /api/feeds endpoint"""
        response = self.client.get('/api/feeds')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('count', data)
        self.assertIn('articles', data)
        self.assertIn('filters', data)
        self.assertGreater(data['count'], 0)
    
    def test_feeds_with_limit(self):
        """Test /api/feeds with limit parameter"""
        response = self.client.get('/api/feeds?limit=10')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertLessEqual(data['count'], 10)
        self.assertEqual(data['filters']['limit'], 10)
    
    def test_feeds_with_source_filter(self):
        """Test /api/feeds with source filter"""
        response = self.client.get('/api/feeds?source=rss')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['source'], 'rss')
        
        # Check all articles are RSS type
        for article in data['articles']:
            self.assertEqual(article['type'], 'rss')
    
    def test_feeds_with_scrape_filter(self):
        """Test /api/feeds with scrape filter"""
        response = self.client.get('/api/feeds?source=scrape')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['source'], 'scrape')
        
        # Check all articles are scrape type
        for article in data['articles']:
            self.assertEqual(article['type'], 'scrape')

if __name__ == '__main__':
    unittest.main()
