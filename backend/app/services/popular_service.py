"""Popular service for most read articles across all users"""
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.models.read_history import ReadHistory
from app.services.feed_service import get_all_feeds
from sqlalchemy import func
from datetime import datetime, timedelta
from collections import Counter

def get_popular_articles(days=7, limit=20):
    """Get most read articles based on bookmarks and reads"""
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    with get_db() as db:
        # Count bookmarks per article
        bookmark_counts = db.query(
            Bookmark.article_url,
            func.count(Bookmark.id).label('count')
        ).filter(
            Bookmark.saved_at >= cutoff_date
        ).group_by(Bookmark.article_url).all()
        
        # Count reads per article
        read_counts = db.query(
            ReadHistory.article_url,
            func.count(ReadHistory.id).label('count')
        ).filter(
            ReadHistory.read_at >= cutoff_date
        ).group_by(ReadHistory.article_url).all()
        
        # Combine counts (bookmarks weighted 2x)
        url_scores = Counter()
        for url, count in bookmark_counts:
            url_scores[url] += count * 2
        for url, count in read_counts:
            url_scores[url] += count
        
        # Get all articles
        articles = get_all_feeds()
        
        # Match articles with scores
        popular = []
        for article in articles:
            url = article.get('link')
            if url in url_scores:
                popular.append({
                    **article,
                    'read_count': url_scores[url]
                })
        
        # Sort by score
        popular.sort(key=lambda x: x['read_count'], reverse=True)
        return popular[:limit]
