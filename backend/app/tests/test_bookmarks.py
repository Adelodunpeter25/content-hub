import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.models.bookmark import Bookmark
from app.core.auth import generate_access_token
import time

class TestBookmarks(unittest.TestCase):
    
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        
        # Create test user
        email = f"bookmark_test_{int(time.time())}@example.com"
        with get_db() as db:
            user = User(email=email, name="Bookmark Test")
            user.set_password("password123")
            db.add(user)
            db.flush()
            self.user_id = user.id
        
        self.token = generate_access_token(self.user_id)
        self.headers = {'Authorization': f'Bearer {self.token}'}
    
    def test_create_bookmark(self):
        """Test creating a bookmark"""
        response = self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/article1',
                'title': 'Test Article',
                'source': 'Test Source'
            },
            headers=self.headers
        )
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data['article_url'], 'https://example.com/article1')
        self.assertEqual(data['title'], 'Test Article')
    
    def test_create_duplicate_bookmark(self):
        """Test creating duplicate bookmark fails"""
        self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/article2',
                'title': 'Test Article'
            },
            headers=self.headers
        )
        
        response = self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/article2',
                'title': 'Test Article'
            },
            headers=self.headers
        )
        self.assertEqual(response.status_code, 400)
    
    def test_get_bookmarks(self):
        """Test getting user bookmarks"""
        self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/article3',
                'title': 'Test Article 3'
            },
            headers=self.headers
        )
        
        response = self.client.get('/api/bookmarks', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('bookmarks', data)
        self.assertIn('pagination', data)
    
    def test_delete_bookmark(self):
        """Test deleting a bookmark"""
        create_response = self.client.post('/api/bookmarks', 
            json={
                'article_url': 'https://example.com/article4',
                'title': 'Test Article 4'
            },
            headers=self.headers
        )
        bookmark_id = create_response.get_json()['id']
        
        response = self.client.delete(f'/api/bookmarks/{bookmark_id}', headers=self.headers)
        self.assertEqual(response.status_code, 200)
    
    def test_unauthorized_access(self):
        """Test bookmark endpoints require authentication"""
        response = self.client.get('/api/bookmarks')
        self.assertIn(response.status_code, [400, 401])

if __name__ == '__main__':
    unittest.main()
