import unittest
from app.main import app

class TestAuthFeatures(unittest.TestCase):
    """Test authentication features"""
    
    def setUp(self):
        """Set up test client"""
        self.app = app
        self.client = self.app.test_client()
    
    def test_signup_with_tokens(self):
        """Test signup returns access and refresh tokens"""
        import time
        email = f'newuser{int(time.time())}@example.com'
        response = self.client.post('/api/auth/signup', json={
            'email': email,
            'password': 'password123',
            'name': 'New User'
        })
        
        self.assertEqual(response.status_code, 201)
        
        data = response.get_json()
        self.assertIn('access_token', data)
        self.assertIn('refresh_token', data)
        self.assertIn('user', data)
        self.assertIn('needs_onboarding', data)
        self.assertTrue(data['needs_onboarding'])
    
    def test_login_with_tokens(self):
        """Test login returns access and refresh tokens"""
        import time
        email = f'loginuser{int(time.time())}@example.com'
        # First create user
        self.client.post('/api/auth/signup', json={
            'email': email,
            'password': 'password123'
        })
        
        # Then login
        response = self.client.post('/api/auth/login', json={
            'email': email,
            'password': 'password123'
        })
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('access_token', data)
        self.assertIn('refresh_token', data)
    
    def test_refresh_token(self):
        """Test refreshing access token"""
        import time
        email = f'refreshuser{int(time.time())}@example.com'
        # Signup to get tokens
        response = self.client.post('/api/auth/signup', json={
            'email': email,
            'password': 'password123'
        })
        
        refresh_token = response.get_json()['refresh_token']
        
        # Refresh token
        response = self.client.post('/api/auth/refresh', json={
            'refresh_token': refresh_token
        })
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertIn('access_token', data)
    
    def test_refresh_token_invalid(self):
        """Test refresh with invalid token"""
        response = self.client.post('/api/auth/refresh', json={
            'refresh_token': 'invalid_token'
        })
        
        self.assertEqual(response.status_code, 400)
    
    def test_forgot_password(self):
        """Test forgot password request"""
        import time
        email = f'forgot{int(time.time())}@example.com'
        # Create user first
        self.client.post('/api/auth/signup', json={
            'email': email,
            'password': 'password123'
        })
        
        # Request password reset
        response = self.client.post('/api/auth/forgot-password', json={
            'email': email
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.get_json())
    
    def test_forgot_password_nonexistent_email(self):
        """Test forgot password with non-existent email"""
        response = self.client.post('/api/auth/forgot-password', json={
            'email': 'nonexistent@example.com'
        })
        
        # Should still return 200 for security
        self.assertEqual(response.status_code, 200)

class TestUserProfile(unittest.TestCase):
    """Test user profile features"""
    
    def setUp(self):
        """Set up test client and create user"""
        import time
        self.app = app
        self.client = self.app.test_client()
        
        # Create user and get token
        email = f'profileuser{int(time.time())}@example.com'
        response = self.client.post('/api/auth/signup', json={
            'email': email,
            'password': 'password123',
            'name': 'Profile User'
        })
        
        self.access_token = response.get_json()['access_token']
    
    def test_update_profile_name(self):
        """Test updating user profile name"""
        response = self.client.put('/api/users/profile',
            headers={'Authorization': f'Bearer {self.access_token}'},
            json={'name': 'Updated Name'}
        )
        
        self.assertEqual(response.status_code, 200)
        
        data = response.get_json()
        self.assertEqual(data['name'], 'Updated Name')
    
    def test_update_profile_unauthorized(self):
        """Test updating profile without auth"""
        response = self.client.put('/api/users/profile',
            json={'name': 'Updated Name'}
        )
        
        self.assertEqual(response.status_code, 400)
    
    def test_delete_account(self):
        """Test deleting user account"""
        response = self.client.delete('/api/users/account',
            headers={'Authorization': f'Bearer {self.access_token}'},
            json={'password': 'password123'}
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.get_json())
    
    def test_delete_account_wrong_password(self):
        """Test deleting account with wrong password"""
        response = self.client.delete('/api/users/account',
            headers={'Authorization': f'Bearer {self.access_token}'},
            json={'password': 'wrongpassword'}
        )
        
        self.assertEqual(response.status_code, 400)
    
    def test_delete_account_unauthorized(self):
        """Test deleting account without auth"""
        response = self.client.delete('/api/users/account',
            json={'password': 'password123'}
        )
        
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
