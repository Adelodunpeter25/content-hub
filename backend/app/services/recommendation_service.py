"""Recommendation service for personalized article suggestions"""
from app.services.feed_service import get_all_feeds
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.models.read_history import ReadHistory
from collections import Counter

def get_user_preferences_from_activity(user_id):
    """Extract user preferences from bookmarks and read history"""
    with get_db() as db:
        # Get bookmarked articles
        bookmarks = db.query(Bookmark).filter(Bookmark.user_id == user_id).all()
        bookmark_urls = {b.article_url for b in bookmarks}
        
        # Get read articles
        history = db.query(ReadHistory).filter(ReadHistory.user_id == user_id).all()
        read_urls = {h.article_url for h in history}
        
        return bookmark_urls, read_urls

def score_article(article, user_categories, user_sources, bookmarked_urls, read_urls):
    """Score article based on user preferences"""
    score = 0
    
    # Skip already bookmarked or read
    if article.get('link') in bookmarked_urls or article.get('link') in read_urls:
        return -1
    
    # Category match (high weight)
    article_categories = article.get('categories', [])
    for cat in article_categories:
        if cat in user_categories:
            score += user_categories[cat] * 3
    
    # Source match (medium weight)
    source = article.get('source', '')
    if source in user_sources:
        score += user_sources[source] * 2
    
    # Recency bonus (newer articles get slight boost)
    if article.get('published'):
        score += 1
    
    return score

def get_recommendations(user_id, limit=20):
    """Get personalized article recommendations"""
    # Get user activity
    bookmarked_urls, read_urls = get_user_preferences_from_activity(user_id)
    
    # If no activity, return empty
    if not bookmarked_urls and not read_urls:
        return []
    
    # Get all available articles
    articles = get_all_feeds()
    
    # Extract user preferences from activity
    user_categories = Counter()
    user_sources = Counter()
    
    # Count categories and sources from user's bookmarked/read articles
    for article in articles:
        if article.get('link') in bookmarked_urls or article.get('link') in read_urls:
            for cat in article.get('categories', []):
                user_categories[cat] += 1
            source = article.get('source', '')
            if source:
                user_sources[source] += 1
    
    # Score all articles
    scored_articles = []
    for article in articles:
        score = score_article(article, user_categories, user_sources, bookmarked_urls, read_urls)
        if score > 0:
            scored_articles.append((score, article))
    
    # Sort by score and return top N
    scored_articles.sort(reverse=True, key=lambda x: x[0])
    return [article for score, article in scored_articles[:limit]]
