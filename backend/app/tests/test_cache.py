import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.cache import cache_get, cache_set, cache_delete, cached, init_cache

class TestCache(unittest.TestCase):
    
    def setUp(self):
        """Setup before each test"""
        init_cache()
        cache_delete('test_key')
    
    def tearDown(self):
        """Cleanup after each test"""
        cache_delete('test_key')
    
    def test_cache_set_and_get(self):
        """Test basic cache set and get"""
        cache_set('test_key', {'data': 'test_value'})
        result = cache_get('test_key')
        
        self.assertIsNotNone(result)
        self.assertEqual(result['data'], 'test_value')
    
    def test_cache_get_nonexistent(self):
        """Test getting non-existent key returns None"""
        result = cache_get('nonexistent_key')
        self.assertIsNone(result)
    
    def test_cache_delete(self):
        """Test cache deletion"""
        cache_set('test_key', {'data': 'test'})
        cache_delete('test_key')
        result = cache_get('test_key')
        
        self.assertIsNone(result)
    
    def test_cache_set_with_ttl(self):
        """Test cache with TTL"""
        import time
        
        # Set with 2 second TTL
        cache_set('test_key', {'data': 'test'}, ttl=2)
        
        # Should exist immediately
        result = cache_get('test_key')
        self.assertIsNotNone(result)
        
        # Wait for expiration
        time.sleep(3)
        
        # Should be expired
        result = cache_get('test_key')
        self.assertIsNone(result)
    
    def test_cache_set_complex_data(self):
        """Test caching complex data structures"""
        data = {
            'articles': [
                {'title': 'Article 1', 'url': 'http://example.com/1'},
                {'title': 'Article 2', 'url': 'http://example.com/2'}
            ],
            'count': 2,
            'nested': {'key': 'value'}
        }
        
        cache_set('test_key', data)
        result = cache_get('test_key')
        
        self.assertEqual(result, data)
        self.assertEqual(len(result['articles']), 2)
    
    def test_cached_decorator(self):
        """Test @cached decorator"""
        call_count = [0]
        
        @cached(ttl=60, key_prefix='test')
        def expensive_function(x):
            call_count[0] += 1
            return x * 2
        
        # First call - should execute function
        result1 = expensive_function(5)
        self.assertEqual(result1, 10)
        self.assertEqual(call_count[0], 1)
        
        # Second call - should use cache
        result2 = expensive_function(5)
        self.assertEqual(result2, 10)
        self.assertEqual(call_count[0], 1)  # Not incremented
    
    def test_cached_decorator_different_args(self):
        """Test @cached decorator with different arguments"""
        @cached(ttl=60, key_prefix='test')
        def add(a, b):
            return a + b
        
        result1 = add(1, 2)
        result2 = add(3, 4)
        
        self.assertEqual(result1, 3)
        self.assertEqual(result2, 7)
    
    def test_cache_handles_connection_failure(self):
        """Test cache gracefully handles connection failures"""
        # Should not raise exceptions even if Redis is down
        try:
            cache_set('test_key', {'data': 'test'})
            cache_get('test_key')
            cache_delete('test_key')
            success = True
        except Exception:
            success = False
        
        self.assertTrue(success)

if __name__ == '__main__':
    unittest.main()
