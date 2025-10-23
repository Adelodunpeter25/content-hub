"""Stats service for user reading analytics"""
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.models.read_history import ReadHistory
from app.services.feed_service import get_all_feeds
from sqlalchemy import func
from datetime import datetime, timedelta
from collections import Counter

def get_reading_stats(user_id):
    """Get comprehensive reading statistics for user"""
    with get_db() as db:
        now = datetime.utcnow()
        
        # Articles read per period
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        month_start = now - timedelta(days=30)
        
        reads_today = db.query(func.count(ReadHistory.id)).filter(
            ReadHistory.user_id == user_id,
            ReadHistory.read_at >= today_start
        ).scalar() or 0
        
        reads_week = db.query(func.count(ReadHistory.id)).filter(
            ReadHistory.user_id == user_id,
            ReadHistory.read_at >= week_start
        ).scalar() or 0
        
        reads_month = db.query(func.count(ReadHistory.id)).filter(
            ReadHistory.user_id == user_id,
            ReadHistory.read_at >= month_start
        ).scalar() or 0
        
        reads_total = db.query(func.count(ReadHistory.id)).filter(
            ReadHistory.user_id == user_id
        ).scalar() or 0
        
        # Bookmarks count
        bookmarks_total = db.query(func.count(Bookmark.id)).filter(
            Bookmark.user_id == user_id
        ).scalar() or 0
        
        # Get all user's read articles and bookmarks
        read_history = db.query(ReadHistory).filter(
            ReadHistory.user_id == user_id
        ).all()
        
        bookmarks = db.query(Bookmark).filter(
            Bookmark.user_id == user_id
        ).all()
        
        # Extract URLs
        read_urls = {h.article_url for h in read_history}
        bookmark_urls = {b.article_url for b in bookmarks}
        
        # Get all articles to match categories and sources
        all_articles = get_all_feeds()
        
        # Count favorite categories and sources
        category_counts = Counter()
        source_counts = Counter()
        
        for article in all_articles:
            url = article.get('link')
            if url in read_urls or url in bookmark_urls:
                for cat in article.get('categories', []):
                    category_counts[cat] += 1
                source = article.get('source')
                if source:
                    source_counts[source] += 1
        
        # Calculate reading streak
        current_streak, longest_streak = calculate_reading_streak(read_history)
        
        return {
            'reads': {
                'today': reads_today,
                'week': reads_week,
                'month': reads_month,
                'total': reads_total
            },
            'bookmarks': {
                'total': bookmarks_total
            },
            'favorite_categories': dict(category_counts.most_common(5)),
            'favorite_sources': dict(source_counts.most_common(5)),
            'reading_streak': current_streak,
            'longest_streak': longest_streak
        }

def calculate_reading_streak(read_history):
    """Calculate consecutive days with reading activity"""
    if not read_history:
        return 0, 0
    
    # Get unique dates
    dates = sorted(set(h.read_at.date() for h in read_history), reverse=True)
    
    if not dates:
        return 0, 0
    
    # Check if read today
    today = datetime.utcnow().date()
    current_streak = 0
    if dates[0] == today or dates[0] == today - timedelta(days=1):
        # Count current consecutive days
        current_streak = 1
        for i in range(len(dates) - 1):
            diff = (dates[i] - dates[i + 1]).days
            if diff == 1:
                current_streak += 1
            else:
                break
    
    # Calculate longest streak
    longest_streak = 1
    temp_streak = 1
    for i in range(len(dates) - 1):
        diff = (dates[i] - dates[i + 1]).days
        if diff == 1:
            temp_streak += 1
            longest_streak = max(longest_streak, temp_streak)
        else:
            temp_streak = 1
    
    return current_streak, longest_streak
