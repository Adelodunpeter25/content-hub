import unittest
from app.utils.search_filter import search_articles, filter_by_source, filter_by_date_range

class TestSearchFilter(unittest.TestCase):
    """Test search and filter functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.articles = [
            {
                'title': 'AI Revolution in Tech',
                'summary': 'Artificial intelligence is changing everything',
                'source': 'TechCrunch',
                'published': '2024-01-15T10:00:00'
            },
            {
                'title': 'New Python Release',
                'summary': 'Python 3.12 brings new features',
                'source': 'The Verge',
                'published': '2024-01-10T10:00:00'
            },
            {
                'title': 'Machine Learning Advances',
                'summary': 'AI and ML are transforming industries',
                'source': 'TechCrunch',
                'published': '2024-01-20T10:00:00'
            }
        ]
    
    def test_search_articles_in_title(self):
        """Test searching in article titles"""
        result = search_articles(self.articles, 'AI')
        self.assertEqual(len(result), 2)
        self.assertIn('AI', result[0]['title'])
    
    def test_search_articles_in_summary(self):
        """Test searching in article summaries"""
        result = search_articles(self.articles, 'Python')
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['title'], 'New Python Release')
    
    def test_search_case_insensitive(self):
        """Test search is case insensitive"""
        result = search_articles(self.articles, 'python')
        self.assertEqual(len(result), 1)
    
    def test_search_no_keyword(self):
        """Test search with no keyword returns all"""
        result = search_articles(self.articles, None)
        self.assertEqual(len(result), 3)
    
    def test_filter_by_source(self):
        """Test filtering by source name"""
        result = filter_by_source(self.articles, 'TechCrunch')
        self.assertEqual(len(result), 2)
        for article in result:
            self.assertEqual(article['source'], 'TechCrunch')
    
    def test_filter_by_source_case_insensitive(self):
        """Test source filter is case insensitive"""
        result = filter_by_source(self.articles, 'techcrunch')
        self.assertEqual(len(result), 2)
    
    def test_filter_by_source_partial_match(self):
        """Test source filter with partial match"""
        result = filter_by_source(self.articles, 'Tech')
        self.assertEqual(len(result), 2)
    
    def test_filter_by_date_range_start(self):
        """Test filtering by start date"""
        result = filter_by_date_range(self.articles, start_date='2024-01-12')
        self.assertEqual(len(result), 2)
    
    def test_filter_by_date_range_end(self):
        """Test filtering by end date"""
        result = filter_by_date_range(self.articles, end_date='2024-01-12')
        self.assertEqual(len(result), 1)
    
    def test_filter_by_date_range_both(self):
        """Test filtering by start and end date"""
        result = filter_by_date_range(
            self.articles, 
            start_date='2024-01-10', 
            end_date='2024-01-16'
        )
        self.assertEqual(len(result), 2)

if __name__ == '__main__':
    unittest.main()
