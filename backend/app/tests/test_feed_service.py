import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.services.feed_service import get_all_feeds, get_personalized_feeds
from app.core.cache import cache_delete

class MockPreferences:
    def __init__(self, feed_sources, feed_types):
        self.feed_sources = feed_sources
        self.feed_types = feed_types

class TestFeedService(unittest.TestCase):
    
    def setUp(self):
        # Clear cache before each test
        cache_delete('feeds:all')
    
    def test_get_all_feeds(self):
        """Test getting all feeds"""
        articles = get_all_feeds()
        self.assertIsInstance(articles, list)
        if articles:
            self.assertIn('title', articles[0])
            self.assertIn('categories', articles[0])
    
    def test_get_all_feeds_caching(self):
        """Test that feeds are cached"""
        # First call - should fetch and cache
        articles1 = get_all_feeds()
        self.assertIsInstance(articles1, list)
        
        # Second call - should use cache (same result)
        articles2 = get_all_feeds()
        self.assertIsInstance(articles2, list)
        
        # Results should be identical
        if articles1 and articles2:
            self.assertEqual(len(articles1), len(articles2))
            self.assertEqual(articles1[0]['title'], articles2[0]['title'])
    
    def test_get_all_feeds_with_filter(self):
        """Test getting feeds with source filter"""
        articles = get_all_feeds(source_filter='rss')
        self.assertIsInstance(articles, list)
    
    def test_get_personalized_feeds(self):
        """Test getting personalized feeds"""
        preferences = MockPreferences(
            feed_sources=['TechCrunch'],
            feed_types=['rss']
        )
        
        articles = get_personalized_feeds(preferences)
        self.assertIsInstance(articles, list)
    
    def test_get_personalized_feeds_empty_preferences(self):
        """Test personalized feeds with empty preferences"""
        preferences = MockPreferences(
            feed_sources=[],
            feed_types=[]
        )
        
        articles = get_personalized_feeds(preferences)
        self.assertIsInstance(articles, list)

if __name__ == '__main__':
    unittest.main()
