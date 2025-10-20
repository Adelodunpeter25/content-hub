"""Feed service layer for centralized feed fetching logic"""
from app.utils.rss_parser import fetch_rss_feeds
from app.utils.scraper import scrape_websites
from app.utils.feed_aggregator import aggregate_feeds
from app.utils.categorizer import add_categories_to_articles
from app.utils.personalization import filter_by_user_preferences
from app.core.cache import cache_get, cache_set
from app.core.config import Config

def get_all_feeds(source_filter=None, limit=None):
    """
    Get all feeds from cache or fetch from sources
    
    Args:
        source_filter: Filter by 'rss' or 'scrape'
        limit: Maximum number of articles
        
    Returns:
        List of articles with categories
    """
    cache_key = 'feeds:all'
    articles = cache_get(cache_key)
    
    if articles is None:
        rss_articles = fetch_rss_feeds(Config.RSS_FEEDS) if Config.RSS_FEEDS else []
        scraped_articles = scrape_websites(Config.SCRAPE_URLS) if Config.SCRAPE_URLS else []
        articles = aggregate_feeds(rss_articles, scraped_articles, source_filter, limit)
        articles = add_categories_to_articles(articles)
        cache_set(cache_key, articles)
    
    return articles

def get_personalized_feeds(user_preferences):
    """
    Get personalized feeds based on user preferences
    
    Args:
        user_preferences: UserFeedPreferences object
        
    Returns:
        List of filtered articles
    """
    articles = get_all_feeds()
    return filter_by_user_preferences(
        articles,
        user_preferences.feed_sources,
        user_preferences.feed_types
    )
