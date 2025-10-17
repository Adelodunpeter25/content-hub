import unittest
from app.main import app

class TestSocialRoutes(unittest.TestCase):
    """Test social media API endpoints"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_social_endpoint(self):
        """Test /api/social endpoint"""
        response = self.client.get('/api/social?per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertIn('pagination', data)
        self.assertIn('filters', data)
        self.assertGreater(len(data['articles']), 0)
    
    def test_social_reddit_filter(self):
        """Test filtering by Reddit platform"""
        response = self.client.get('/api/social?platform=reddit&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['platform'], 'reddit')
        
        # All articles should be reddit type
        for article in data['articles']:
            self.assertEqual(article['type'], 'reddit')
    
    def test_social_youtube_filter(self):
        """Test filtering by YouTube platform"""
        response = self.client.get('/api/social?platform=youtube&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['platform'], 'youtube')
        
        # All articles should be youtube type
        for article in data['articles']:
            self.assertEqual(article['type'], 'youtube')
    
    def test_social_with_search(self):
        """Test social endpoint with search"""
        response = self.client.get('/api/social?search=python&per_page=5')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['filters']['search'], 'python')
    
    def test_social_pagination(self):
        """Test social endpoint pagination"""
        response = self.client.get('/api/social?page=1&per_page=10')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertLessEqual(len(data['articles']), 10)
        self.assertEqual(data['pagination']['page'], 1)
        self.assertEqual(data['pagination']['per_page'], 10)
    
    def test_social_article_structure(self):
        """Test social article has correct structure"""
        response = self.client.get('/api/social?per_page=1')
        
        data = response.get_json()
        
        if data['articles']:
            article = data['articles'][0]
            self.assertIn('title', article)
            self.assertIn('link', article)
            self.assertIn('source', article)
            self.assertIn('type', article)
            self.assertIn('metadata', article)
            self.assertIn(article['type'], ['reddit', 'youtube'])

if __name__ == '__main__':
    unittest.main()
