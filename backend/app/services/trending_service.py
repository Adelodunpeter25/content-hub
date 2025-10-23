"""Trending service for recent articles"""
from app.services.feed_service import get_all_feeds
from datetime import datetime, timedelta
from dateutil import parser

def get_trending_articles(days=1, limit=20):
    """Get articles published within the last N days"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Get all articles
    articles = get_all_feeds()
    
    # Filter articles by published date
    recent_articles = []
    for article in articles:
        published = article.get('published', '')
        if published:
            try:
                pub_date = parser.parse(published)
                if pub_date.replace(tzinfo=None) >= cutoff_date:
                    recent_articles.append(article)
            except Exception:
                # If date parsing fails, include the article
                recent_articles.append(article)
        else:
            # If no published date, include the article
            recent_articles.append(article)
    
    # Sort by published date (newest first)
    recent_articles.sort(key=lambda x: x.get('published', ''), reverse=True)
    return recent_articles[:limit]
