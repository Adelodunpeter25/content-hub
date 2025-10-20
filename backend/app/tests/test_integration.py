import unittest
import sys
import os
import time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app
from app.core.cache import cache_get, cache_delete
from app.core.scheduler import init_scheduler, shutdown_scheduler

class TestIntegration(unittest.TestCase):
    """Integration tests for cache + scheduler + API"""
    
    def setUp(self):
        """Setup before each test"""
        self.app = app
        self.client = self.app.test_client()
        cache_delete('feeds:all')
        shutdown_scheduler()
    
    def tearDown(self):
        """Cleanup after each test"""
        shutdown_scheduler()
    
    def test_scheduler_populates_cache_for_api(self):
        """Test that scheduler populates cache used by API"""
        # Start scheduler
        init_scheduler()
        
        # Wait for startup job
        time.sleep(10)
        
        # Make API request
        response = self.client.get('/api/feeds')
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertGreater(len(data['articles']), 0)
        
        shutdown_scheduler()
    
    def test_api_works_without_scheduler(self):
        """Test that API still works if scheduler is not running"""
        cache_delete('feeds:all')
        
        # Make API request without scheduler
        response = self.client.get('/api/feeds')
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('articles', data)
    
    def test_cache_shared_between_endpoints(self):
        """Test that cache is shared between different endpoints"""
        # Populate cache via scheduler
        init_scheduler()
        time.sleep(10)
        
        # Request from different endpoints
        response1 = self.client.get('/api/feeds')
        response2 = self.client.get('/api/feeds?category=AI')
        
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        
        # Both should have data
        data1 = response1.get_json()
        data2 = response2.get_json()
        
        self.assertGreater(len(data1['articles']), 0)
        self.assertGreaterEqual(len(data1['articles']), len(data2['articles']))
        
        shutdown_scheduler()
    
    def test_pagination_with_cached_data(self):
        """Test pagination works correctly with cached data"""
        init_scheduler()
        time.sleep(10)
        
        # Get first page
        response1 = self.client.get('/api/feeds?page=1&per_page=10')
        data1 = response1.get_json()
        
        # Get second page
        response2 = self.client.get('/api/feeds?page=2&per_page=10')
        data2 = response2.get_json()
        
        self.assertEqual(len(data1['articles']), 10)
        self.assertLessEqual(len(data2['articles']), 10)
        
        # Articles should be different
        if len(data2['articles']) > 0:
            self.assertNotEqual(
                data1['articles'][0]['title'],
                data2['articles'][0]['title']
            )
        
        shutdown_scheduler()
    
    def test_search_with_cached_data(self):
        """Test search works correctly with cached data"""
        init_scheduler()
        time.sleep(10)
        
        # Search for articles
        response = self.client.get('/api/feeds?search=tech')
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('articles', data)
        
        # Verify search worked
        if len(data['articles']) > 0:
            article = data['articles'][0]
            text = f"{article.get('title', '')} {article.get('summary', '')}".lower()
            self.assertIn('tech', text)
        
        shutdown_scheduler()
    
    def test_category_filter_with_cached_data(self):
        """Test category filtering works with cached data"""
        init_scheduler()
        time.sleep(10)
        
        # Filter by AI category
        response = self.client.get('/api/feeds?category=AI')
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        
        # Verify all articles have AI category
        for article in data['articles']:
            self.assertIn('categories', article)
            self.assertIn('AI', article['categories'])
        
        shutdown_scheduler()
    
    def test_per_page_limit_enforced(self):
        """Test that per_page limit is enforced"""
        init_scheduler()
        time.sleep(10)
        
        # Request more than max
        response = self.client.get('/api/feeds?per_page=999')
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertLessEqual(len(data['articles']), 100)
        
        shutdown_scheduler()

if __name__ == '__main__':
    unittest.main()
