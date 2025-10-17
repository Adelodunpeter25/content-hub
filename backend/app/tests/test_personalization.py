import unittest
from app.utils.personalization import filter_by_user_preferences

class TestPersonalization(unittest.TestCase):
    """Test personalization functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.articles = [
            {'title': 'Article 1', 'source': 'TechCrunch', 'type': 'rss'},
            {'title': 'Article 2', 'source': 'The Verge', 'type': 'rss'},
            {'title': 'Article 3', 'source': 'Techmeme', 'type': 'scrape'},
            {'title': 'Article 4', 'source': 'TechCrunch', 'type': 'rss'},
        ]
    
    def test_filter_by_feed_sources(self):
        """Test filtering by feed sources"""
        result = filter_by_user_preferences(
            self.articles,
            feed_sources=['TechCrunch']
        )
        
        self.assertEqual(len(result), 2)
        for article in result:
            self.assertEqual(article['source'], 'TechCrunch')
    
    def test_filter_by_feed_types(self):
        """Test filtering by feed types"""
        result = filter_by_user_preferences(
            self.articles,
            feed_types=['scrape']
        )
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['type'], 'scrape')
    
    def test_filter_by_both(self):
        """Test filtering by both sources and types"""
        result = filter_by_user_preferences(
            self.articles,
            feed_sources=['TechCrunch'],
            feed_types=['rss']
        )
        
        self.assertEqual(len(result), 2)
        for article in result:
            self.assertEqual(article['source'], 'TechCrunch')
            self.assertEqual(article['type'], 'rss')
    
    def test_no_filters(self):
        """Test with no filters returns all"""
        result = filter_by_user_preferences(self.articles)
        self.assertEqual(len(result), 4)
    
    def test_empty_filters(self):
        """Test with empty filter lists returns all"""
        result = filter_by_user_preferences(
            self.articles,
            feed_sources=[],
            feed_types=[]
        )
        self.assertEqual(len(result), 4)
    
    def test_case_insensitive_source_match(self):
        """Test source matching is case insensitive"""
        result = filter_by_user_preferences(
            self.articles,
            feed_sources=['techcrunch']
        )
        self.assertEqual(len(result), 2)

if __name__ == '__main__':
    unittest.main()
