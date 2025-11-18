"""Feed service layer for centralized feed fetching logic"""
from app.utils.rss_parser import fetch_rss_feeds
from app.utils.scraper import scrape_websites
from app.utils.social_scrapers import scrape_social_media
from app.utils.feed_aggregator import aggregate_feeds
from app.utils.categorizer import add_categories_to_articles
from app.utils.gemini_categorizer import batch_categorize
from app.utils.personalization import filter_by_user_preferences
from app.utils.content_filter import filter_articles
from app.utils.quality_scorer import filter_by_quality
from app.core.cache import cache_get, cache_set
from app.core.config import Config
from app.core.database import get_db
from app.models.read_history import ReadHistory
import os

def get_all_feeds(source_filter=None, limit=None, apply_quality_filter=True, min_quality_score=0.4, content_preference='both'):
    """
    Get all feeds from cache or fetch from sources with quality scoring
    
    Args:
        source_filter: Filter by 'rss' or 'scrape'
        limit: Maximum number of articles
        apply_quality_filter: Whether to apply quality filtering
        min_quality_score: Minimum quality score threshold (0.0-1.0)
        content_preference: 'tech', 'general', or 'both'
        
    Returns:
        List of articles with categories and quality scores
    """
    cache_key = f'feeds:all:{source_filter}:{apply_quality_filter}:{content_preference}'
    articles = cache_get(cache_key)
    
    if articles is None:
        # Select RSS feeds based on content preference
        rss_feeds = []
        if content_preference in ['tech', 'both']:
            rss_feeds.extend(Config.RSS_FEEDS_TECH)
        if content_preference in ['general', 'both']:
            rss_feeds.extend(Config.RSS_FEEDS_GENERAL)
        
        # Fetch from sources
        rss_articles = fetch_rss_feeds(rss_feeds) if rss_feeds else []
        scraped_articles = scrape_websites(Config.SCRAPE_URLS) if Config.SCRAPE_URLS else []
        social_articles = scrape_social_media(Config.REDDIT_SUBREDDITS, Config.YOUTUBE_CHANNELS) if (Config.REDDIT_SUBREDDITS or Config.YOUTUBE_CHANNELS) else []
        
        # Combine all sources
        all_articles = rss_articles + scraped_articles + social_articles
        articles = aggregate_feeds(all_articles, [], source_filter, limit)
        
        # Filter out explicit and non-English content
        articles = filter_articles(articles)
        
        # Add categories (use Gemini if available, fallback to keyword)
        if os.getenv('GEMINI_API_KEY'):
            articles = batch_categorize(articles)
        else:
            articles = add_categories_to_articles(articles)
        
        # Apply quality scoring WITHOUT database connection
        if apply_quality_filter:
            articles = filter_by_quality(
                articles,
                min_score=min_quality_score,
                source_tier='standard',
                user_tag_ids=None,
                db=None  # Don't pass db to avoid connection timeout
            )
        
        cache_set(cache_key, articles)
    
    return articles

def get_personalized_feeds(user_preferences, user_id=None):
    """
    Get personalized feeds based on user preferences with category-based filtering
    
    Args:
        user_preferences: UserFeedPreferences object
        user_id: User ID for engagement scoring
        
    Returns:
        List of filtered and scored articles
    """
    # Get content preference, default to 'tech' for backward compatibility
    content_preference = getattr(user_preferences, 'content_preference', 'tech') or 'tech'
    
    # Get all feeds with quality filtering and content preference
    articles = get_all_feeds(
        apply_quality_filter=True, 
        min_quality_score=0.4,
        content_preference=content_preference
    )
    
    # Apply traditional preference filtering (sources and types)
    articles = filter_by_user_preferences(
        articles,
        user_preferences.feed_sources,
        user_preferences.feed_types
    )
    
    # Apply category-based filtering
    if user_preferences.selected_categories:
        articles = filter_by_categories(articles, user_preferences.selected_categories)
    
    # Filter out read articles if preference is disabled
    if not user_preferences.show_read_articles and user_id:
        # Try to get from cache first
        cache_key = f'read_urls:{user_id}'
        read_url_set = cache_get(cache_key)
        
        if read_url_set is None:
            with get_db() as db:
                # Limit to last 1000 read articles for performance
                read_urls = db.query(ReadHistory.article_url).filter(
                    ReadHistory.user_id == user_id
                ).order_by(ReadHistory.read_at.desc()).limit(1000).all()
                read_url_set = {url[0] for url in read_urls}
                # Cache for 5 minutes
                cache_set(cache_key, list(read_url_set), ttl=300)
        else:
            read_url_set = set(read_url_set)
        
        articles = [a for a in articles if a.get('link') not in read_url_set]
    
    return articles

def filter_by_categories(articles, user_categories):
    """
    Filter articles by user's selected categories
    
    Args:
        articles: List of articles with categories
        user_categories: List of user's selected categories
        
    Returns:
        Filtered articles that match user's categories
    """
    if not user_categories:
        return articles
    
    user_category_set = set(user_categories)
    # Optimized list comprehension with set intersection
    return [
        article for article in articles
        if article.get('categories') and user_category_set & set(article['categories'])
    ]
