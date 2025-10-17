import unittest
from app.main import app

class TestApp(unittest.TestCase):
    """Test Flask application basics"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_home_endpoint(self):
        """Test home endpoint"""
        response = self.client.get('/')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('message', data)
        self.assertIn('endpoints', data)
        self.assertEqual(data['message'], 'Content Hub API')
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = self.client.get('/health')
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['status'], 'healthy')

if __name__ == '__main__':
    unittest.main()
