import unittest
from app.main import app

class TestFeedsSearch(unittest.TestCase):
    """Test feeds endpoint with search and filters"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_feeds_with_search(self):
        """Test /api/feeds with search parameter"""
        response = self.client.get('/api/feeds?search=AI&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertIn('filters', data)
        self.assertEqual(data['filters']['search'], 'AI')
    
    def test_feeds_with_source_name_filter(self):
        """Test /api/feeds with source_name filter"""
        response = self.client.get('/api/feeds?source_name=TechCrunch&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['source_name'], 'TechCrunch')
    
    def test_feeds_with_date_range(self):
        """Test /api/feeds with date range"""
        response = self.client.get('/api/feeds?start_date=2024-01-01&end_date=2025-12-31&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['start_date'], '2024-01-01')
        self.assertEqual(data['filters']['end_date'], '2025-12-31')
    
    def test_feeds_with_combined_filters(self):
        """Test /api/feeds with multiple filters"""
        response = self.client.get('/api/feeds?search=tech&source=rss&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['search'], 'tech')
        self.assertEqual(data['filters']['source'], 'rss')
    
    def test_feeds_filters_in_response(self):
        """Test that filters are included in response"""
        response = self.client.get('/api/feeds?search=python&source_name=Verge')
        
        data = response.get_json()
        self.assertIn('filters', data)
        self.assertIn('search', data['filters'])
        self.assertIn('source_name', data['filters'])
        self.assertIn('start_date', data['filters'])
        self.assertIn('end_date', data['filters'])

if __name__ == '__main__':
    unittest.main()
