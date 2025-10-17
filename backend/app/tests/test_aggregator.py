import unittest
from app.utils.feed_aggregator import deduplicate_articles, sort_by_date, aggregate_feeds

class TestFeedAggregator(unittest.TestCase):
    """Test feed aggregation functionality"""
    
    def test_deduplicate_articles(self):
        """Test deduplication by URL"""
        articles = [
            {'title': 'Article 1', 'link': 'https://example.com/1'},
            {'title': 'Article 2', 'link': 'https://example.com/2'},
            {'title': 'Article 1 Duplicate', 'link': 'https://example.com/1'},
        ]
        
        result = deduplicate_articles(articles)
        
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]['link'], 'https://example.com/1')
        self.assertEqual(result[1]['link'], 'https://example.com/2')
    
    def test_sort_by_date(self):
        """Test sorting by published date"""
        articles = [
            {'title': 'Old', 'published': '2024-01-01T10:00:00'},
            {'title': 'New', 'published': '2024-01-15T10:00:00'},
            {'title': 'Middle', 'published': '2024-01-10T10:00:00'},
        ]
        
        result = sort_by_date(articles)
        
        self.assertEqual(result[0]['title'], 'New')
        self.assertEqual(result[1]['title'], 'Middle')
        self.assertEqual(result[2]['title'], 'Old')
    
    def test_aggregate_feeds(self):
        """Test aggregating multiple feeds"""
        rss = [
            {'title': 'RSS 1', 'link': 'https://example.com/rss1', 'type': 'rss', 'published': '2024-01-15T10:00:00'}
        ]
        scrape = [
            {'title': 'Scrape 1', 'link': 'https://example.com/scrape1', 'type': 'scrape', 'published': '2024-01-14T10:00:00'}
        ]
        
        result = aggregate_feeds(rss, scrape)
        
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]['type'], 'rss')
    
    def test_aggregate_with_filter(self):
        """Test aggregating with source filter"""
        rss = [{'title': 'RSS', 'link': 'https://example.com/1', 'type': 'rss', 'published': ''}]
        scrape = [{'title': 'Scrape', 'link': 'https://example.com/2', 'type': 'scrape', 'published': ''}]
        
        result = aggregate_feeds(rss, scrape, source_filter='rss')
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['type'], 'rss')
    
    def test_aggregate_with_limit(self):
        """Test aggregating with limit"""
        rss = [
            {'title': f'Article {i}', 'link': f'https://example.com/{i}', 'published': ''}
            for i in range(10)
        ]
        
        result = aggregate_feeds(rss, [], limit=5)
        self.assertEqual(len(result), 5)

if __name__ == '__main__':
    unittest.main()
