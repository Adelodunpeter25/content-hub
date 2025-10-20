import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app
from app.core.cache import cache_delete

class TestFeedsEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        cache_delete('feeds:all')
    
    def test_get_feeds(self):
        """Test GET /api/feeds"""
        response = self.client.get('/api/feeds')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertIn('pagination', data)
    
    def test_get_feeds_with_pagination(self):
        """Test feeds with pagination"""
        response = self.client.get('/api/feeds?page=1&per_page=10')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertLessEqual(len(data['articles']), 10)
    
    def test_get_feeds_with_search(self):
        """Test feeds with search"""
        response = self.client.get('/api/feeds?search=tech')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('articles', data)
    
    def test_get_feeds_with_category(self):
        """Test feeds with category filter"""
        response = self.client.get('/api/feeds?category=AI')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('articles', data)
    
    def test_get_feeds_max_per_page(self):
        """Test that per_page is capped at 100"""
        response = self.client.get('/api/feeds?per_page=999')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertLessEqual(len(data['articles']), 100)
    
    def test_get_feeds_caching(self):
        """Test that feeds are cached between requests"""
        # First request
        response1 = self.client.get('/api/feeds')
        data1 = response1.get_json()
        
        # Second request - should be faster due to cache
        response2 = self.client.get('/api/feeds')
        data2 = response2.get_json()
        
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(len(data1['articles']), len(data2['articles']))

if __name__ == '__main__':
    unittest.main()
