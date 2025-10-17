import unittest
from app.utils.social_scrapers import scrape_reddit, scrape_youtube, scrape_social_media

class TestSocialScrapers(unittest.TestCase):
    """Test social media scraping functionality"""
    
    def test_scrape_reddit(self):
        """Test scraping Reddit"""
        articles = scrape_reddit(['python'])
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # Check article structure
        article = articles[0]
        self.assertIn('title', article)
        self.assertIn('link', article)
        self.assertIn('source', article)
        self.assertIn('type', article)
        self.assertEqual(article['type'], 'reddit')
        self.assertIn('metadata', article)
        self.assertIn('score', article['metadata'])
        self.assertIn('subreddit', article['metadata'])
    
    def test_scrape_youtube(self):
        """Test scraping YouTube"""
        # Fireship channel
        articles = scrape_youtube(['UCsBjURrPoezykLs9EqgamOA'])
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # Check article structure
        article = articles[0]
        self.assertIn('title', article)
        self.assertIn('link', article)
        self.assertIn('source', article)
        self.assertIn('type', article)
        self.assertEqual(article['type'], 'youtube')
        self.assertIn('metadata', article)
        self.assertIn('channel_id', article['metadata'])
    
    def test_scrape_social_media_reddit_only(self):
        """Test scraping only Reddit"""
        articles = scrape_social_media(reddit_subs=['python'])
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # All should be reddit
        for article in articles:
            self.assertEqual(article['type'], 'reddit')
    
    def test_scrape_social_media_youtube_only(self):
        """Test scraping only YouTube"""
        articles = scrape_social_media(youtube_channels=['UCsBjURrPoezykLs9EqgamOA'])
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # All should be youtube
        for article in articles:
            self.assertEqual(article['type'], 'youtube')
    
    def test_scrape_social_media_both(self):
        """Test scraping both Reddit and YouTube"""
        articles = scrape_social_media(
            reddit_subs=['python'],
            youtube_channels=['UCsBjURrPoezykLs9EqgamOA']
        )
        
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        
        # Should have both types
        types = set(article['type'] for article in articles)
        self.assertIn('reddit', types)
        self.assertIn('youtube', types)
    
    def test_scrape_invalid_subreddit(self):
        """Test scraping invalid subreddit doesn't crash"""
        articles = scrape_reddit(['thissubredditdoesnotexist12345'])
        
        # Should return empty list, not crash
        self.assertIsInstance(articles, list)

if __name__ == '__main__':
    unittest.main()
