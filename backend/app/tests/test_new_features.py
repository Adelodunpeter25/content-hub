import unittest
import sys
import os
import time
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.core.auth import generate_access_token

class TestNewFeatures(unittest.TestCase):
    
    def setUp(self):
        """Setup before each test"""
        self.app = app
        self.client = self.app.test_client()
        
        # Create test user
        email = f"newfeatures_test_{int(time.time())}@example.com"
        with get_db() as db:
            user = User(email=email, name="New Features Test")
            user.set_password("password123")
            db.add(user)
            db.flush()
            self.user_id = user.id
        
        self.token = generate_access_token(self.user_id)
        self.headers = {'Authorization': f'Bearer {self.token}'}
    
    def test_get_recommendations_no_activity(self):
        """Test recommendations with no user activity"""
        response = self.client.get('/api/recommendations', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertEqual(len(data['articles']), 0)
    
    def test_get_recommendations_with_activity(self):
        """Test recommendations after user activity"""
        # Add a bookmark
        self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/test-article',
                'title': 'Test AI Article'
            },
            headers=self.headers
        )
        
        # Get recommendations
        response = self.client.get('/api/recommendations', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertIn('pagination', data)
    
    def test_get_trending_articles(self):
        """Test getting trending articles"""
        response = self.client.get('/api/trending')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('articles', data)
        self.assertIn('pagination', data)
        self.assertIn('period_days', data)
    
    def test_get_trending_with_custom_days(self):
        """Test trending with custom time period"""
        response = self.client.get('/api/trending?days=30')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['period_days'], 30)
    
    def test_get_stats_no_activity(self):
        """Test stats with no user activity"""
        response = self.client.get('/api/stats', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        
        self.assertIn('reads', data)
        self.assertIn('bookmarks', data)
        self.assertIn('favorite_categories', data)
        self.assertIn('favorite_sources', data)
        self.assertIn('reading_streak', data)
        
        self.assertEqual(data['reads']['total'], 0)
        self.assertEqual(data['bookmarks']['total'], 0)
        self.assertEqual(data['reading_streak'], 0)
    
    def test_get_stats_with_activity(self):
        """Test stats after user activity"""
        # Add bookmark
        self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/article1',
                'title': 'Article 1'
            },
            headers=self.headers
        )
        
        # Mark as read
        self.client.post('/api/read-history', 
            json={'article_url': 'https://example.com/article2'},
            headers=self.headers
        )
        
        # Get stats
        response = self.client.get('/api/stats', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        
        self.assertGreater(data['reads']['total'], 0)
        self.assertGreater(data['bookmarks']['total'], 0)
    
    def test_recommendations_pagination(self):
        """Test recommendations pagination"""
        response = self.client.get('/api/recommendations?page=1&per_page=5', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertLessEqual(len(data['articles']), 5)
    
    def test_trending_pagination(self):
        """Test trending pagination"""
        response = self.client.get('/api/trending?page=1&per_page=5')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertLessEqual(len(data['articles']), 5)
    
    def test_recommendations_requires_auth(self):
        """Test recommendations requires authentication"""
        response = self.client.get('/api/recommendations')
        self.assertIn(response.status_code, [400, 401])
    
    def test_stats_requires_auth(self):
        """Test stats requires authentication"""
        response = self.client.get('/api/stats')
        self.assertIn(response.status_code, [400, 401])
    
    def test_trending_no_auth_required(self):
        """Test trending doesn't require authentication"""
        response = self.client.get('/api/trending')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
