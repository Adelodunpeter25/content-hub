import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app
from app.core.database import get_db
from app.models.user import User
from app.core.auth import generate_access_token
import time

class TestReadHistory(unittest.TestCase):
    
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        
        # Create test user
        email = f"history_test_{int(time.time())}@example.com"
        with get_db() as db:
            user = User(email=email, name="History Test")
            user.set_password("password123")
            db.add(user)
            db.flush()
            self.user_id = user.id
        
        self.token = generate_access_token(self.user_id)
        self.headers = {'Authorization': f'Bearer {self.token}'}
    
    def test_mark_as_read(self):
        """Test marking article as read"""
        response = self.client.post('/api/read-history', 
            json={'article_url': 'https://example.com/article1'},
            headers=self.headers
        )
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data['article_url'], 'https://example.com/article1')
    
    def test_mark_duplicate_as_read(self):
        """Test marking same article as read twice returns existing"""
        self.client.post('/api/read-history', 
            json={'article_url': 'https://example.com/article2'},
            headers=self.headers
        )
        
        response = self.client.post('/api/read-history', 
            json={'article_url': 'https://example.com/article2'},
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
    
    def test_get_read_history(self):
        """Test getting read history"""
        self.client.post('/api/read-history', 
            json={'article_url': 'https://example.com/article3'},
            headers=self.headers
        )
        
        response = self.client.get('/api/read-history', headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('history', data)
        self.assertIn('pagination', data)
    
    def test_unauthorized_access(self):
        """Test read history endpoints require authentication"""
        response = self.client.get('/api/read-history')
        self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
