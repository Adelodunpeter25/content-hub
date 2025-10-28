"""Content quality scoring system"""
import re
from datetime import datetime, timedelta

# Quality tier scores
QUALITY_TIER_SCORES = {
    'premium': 1.0,
    'standard': 0.7,
    'community': 0.5
}

# Spam/clickbait patterns
SPAM_PATTERNS = [
    r'\d{10,}',  # Long phone numbers
    r'(buy now|click here|limited time|act now)',
    r'(!!!+|\?\?\?+)',  # Excessive punctuation
    r'(FREE|URGENT|BREAKING)(?=.*[A-Z]{5,})',  # All caps spam
]

CLICKBAIT_PATTERNS = [
    r'you won\'t believe',
    r'what happens next',
    r'doctors hate',
    r'one weird trick',
    r'this is why',
    r'the reason why',
    r'number \d+ will shock you',
]

def calculate_source_score(source_name, source_tier='standard'):
    """
    Calculate score based on source reputation
    
    Args:
        source_name: Name of the source
        source_tier: Quality tier (premium, standard, community)
        
    Returns:
        Score between 0.0 and 1.0
    """
    return QUALITY_TIER_SCORES.get(source_tier, 0.5)

def calculate_content_score(title, summary):
    """
    Calculate score based on content quality
    
    Args:
        title: Article title
        summary: Article summary
        
    Returns:
        Score between 0.0 and 1.0
    """
    score = 1.0
    
    # Check title length
    if len(title) < 10:
        score -= 0.3
    elif len(title) > 200:
        score -= 0.2
    
    # Check summary length
    if len(summary) < 50:
        score -= 0.2
    
    # Check for spam patterns
    text = f"{title} {summary}".lower()
    for pattern in SPAM_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            score -= 0.4
            break
    
    # Check for clickbait
    for pattern in CLICKBAIT_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            score -= 0.3
            break
    
    # Check for excessive capitalization
    if title.isupper() and len(title) > 10:
        score -= 0.3
    elif sum(1 for c in title if c.isupper()) / max(len(title), 1) > 0.5:
        score -= 0.2
    
    # Check for meaningful content
    if title and summary:
        score += 0.1
    
    return max(score, 0.0)

def calculate_freshness_score(published_date):
    """
    Calculate score based on article freshness
    
    Args:
        published_date: ISO format date string
        
    Returns:
        Score between 0.0 and 1.0
    """
    if not published_date:
        return 0.5
    
    try:
        pub_date = datetime.fromisoformat(published_date.replace('Z', '+00:00'))
        pub_date = pub_date.replace(tzinfo=None)
        now = datetime.utcnow()
        age = now - pub_date
        
        # Future dates get low score
        if age.total_seconds() < 0:
            return 0.1
        
        # Score based on age
        if age < timedelta(hours=6):
            return 1.0
        elif age < timedelta(hours=24):
            return 0.9
        elif age < timedelta(days=3):
            return 0.7
        elif age < timedelta(days=7):
            return 0.5
        elif age < timedelta(days=30):
            return 0.3
        else:
            return 0.1
    except Exception:
        return 0.5

def calculate_engagement_score(article_url, db):
    """
    Calculate score based on user engagement
    
    Args:
        article_url: Article URL
        db: Database session
        
    Returns:
        Score between 0.0 and 1.0
    """
    from app.models.read_history import ReadHistory
    from app.models.bookmark import Bookmark
    from app.models.article_feedback import ArticleFeedback
    
    # Count reads
    read_count = db.query(ReadHistory).filter(
        ReadHistory.article_url == article_url
    ).count()
    
    # Count bookmarks
    bookmark_count = db.query(Bookmark).filter(
        Bookmark.article_url == article_url
    ).count()
    
    # Count positive feedback
    positive_feedback = db.query(ArticleFeedback).filter(
        ArticleFeedback.article_url == article_url,
        ArticleFeedback.feedback_type == 'helpful'
    ).count()
    
    # Count negative feedback
    negative_feedback = db.query(ArticleFeedback).filter(
        ArticleFeedback.article_url == article_url,
        ArticleFeedback.feedback_type.in_(['not_helpful', 'spam', 'low_quality'])
    ).count()
    
    # Calculate engagement score
    engagement = (read_count * 0.3) + (bookmark_count * 0.5) + (positive_feedback * 0.8) - (negative_feedback * 1.0)
    
    # Normalize to 0-1 range (assuming max engagement of 100)
    score = min(max(engagement / 100.0, 0.0), 1.0)
    
    return score

def calculate_relevance_score(article_tags, user_tag_ids):
    """
    Calculate score based on tag relevance to user interests
    
    Args:
        article_tags: List of article tag dicts with 'id' and 'confidence'
        user_tag_ids: List of user's selected tag IDs
        
    Returns:
        Score between 0.0 and 1.0
    """
    if not user_tag_ids or not article_tags:
        return 0.5  # Neutral score if no tags
    
    # Calculate overlap
    article_tag_ids = {tag['id'] for tag in article_tags}
    user_tag_set = set(user_tag_ids)
    
    overlap = article_tag_ids.intersection(user_tag_set)
    
    if not overlap:
        return 0.3  # Low score for no overlap
    
    # Weight by confidence scores
    relevance = 0.0
    for tag in article_tags:
        if tag['id'] in user_tag_set:
            relevance += tag.get('confidence', 0.5)
    
    # Normalize
    score = min(relevance / len(user_tag_ids), 1.0)
    
    return score

def calculate_quality_score(article, source_tier='standard', user_tag_ids=None, db=None):
    """
    Calculate overall quality score for an article
    
    Args:
        article: Article dict
        source_tier: Source quality tier
        user_tag_ids: User's selected tag IDs (optional)
        db: Database session (optional, for engagement)
        
    Returns:
        Score between 0.0 and 1.0
    """
    # Component scores
    source_score = calculate_source_score(article.get('source', ''), source_tier)
    content_score = calculate_content_score(article.get('title', ''), article.get('summary', ''))
    freshness_score = calculate_freshness_score(article.get('published', ''))
    
    # Optional scores
    engagement_score = 0.5
    if db:
        engagement_score = calculate_engagement_score(article.get('link', ''), db)
    
    relevance_score = 0.5
    if user_tag_ids and article.get('tags'):
        relevance_score = calculate_relevance_score(article.get('tags', []), user_tag_ids)
    
    # Weighted final score
    final_score = (
        source_score * 0.25 +
        content_score * 0.25 +
        freshness_score * 0.20 +
        engagement_score * 0.15 +
        relevance_score * 0.15
    )
    
    return round(final_score, 3)

def filter_by_quality(articles, min_score=0.4, source_tier='standard', user_tag_ids=None, db=None):
    """
    Filter articles by minimum quality score
    
    Args:
        articles: List of articles
        min_score: Minimum quality score threshold
        source_tier: Source quality tier
        user_tag_ids: User's selected tag IDs
        db: Database session
        
    Returns:
        Filtered and scored articles
    """
    scored_articles = []
    
    for article in articles:
        score = calculate_quality_score(article, source_tier, user_tag_ids, db)
        
        if score >= min_score:
            article['quality_score'] = score
            scored_articles.append(article)
    
    # Sort by quality score (highest first)
    scored_articles.sort(key=lambda x: x['quality_score'], reverse=True)
    
    return scored_articles

def is_spam(title, summary):
    """
    Check if content is spam
    
    Args:
        title: Article title
        summary: Article summary
        
    Returns:
        Boolean indicating if content is spam
    """
    text = f"{title} {summary}".lower()
    
    # Check spam patterns
    for pattern in SPAM_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    
    # Check for excessive caps
    if title.isupper() and len(title) > 10:
        return True
    
    return False
