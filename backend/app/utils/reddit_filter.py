"""Reddit-specific quality filtering"""
from datetime import datetime, timedelta

# Quality thresholds
DEFAULT_MIN_SCORE = 50
DEFAULT_MIN_COMMENTS = 10
DEFAULT_MAX_AGE_HOURS = 48

# Subreddit-specific thresholds (for high-quality subs)
SUBREDDIT_THRESHOLDS = {
    'programming': {'min_score': 100, 'min_comments': 20},
    'python': {'min_score': 75, 'min_comments': 15},
    'javascript': {'min_score': 75, 'min_comments': 15},
    'webdev': {'min_score': 60, 'min_comments': 12},
    'machinelearning': {'min_score': 80, 'min_comments': 15},
    'datascience': {'min_score': 60, 'min_comments': 12},
    'devops': {'min_score': 50, 'min_comments': 10},
    'cybersecurity': {'min_score': 50, 'min_comments': 10},
}

# Low-effort content patterns
LOW_EFFORT_PATTERNS = [
    r'^(TIL|DAE|ELI5)',  # Common low-effort prefixes
    r'(meme|shitpost)',
    r'^\[.*\]$',  # Just tags
]

def calculate_reddit_quality_score(post_data):
    """
    Calculate quality score for Reddit post
    
    Args:
        post_data: Reddit post metadata dict
        
    Returns:
        Quality score between 0.0 and 1.0
    """
    score = post_data.get('score', 0)
    comments = post_data.get('num_comments', 0)
    awards = post_data.get('total_awards_received', 0)
    
    # Calculate engagement rate
    engagement = comments + (awards * 5)
    
    # Normalize scores
    score_normalized = min(score / 1000.0, 1.0)  # Cap at 1000 upvotes
    comments_normalized = min(comments / 100.0, 1.0)  # Cap at 100 comments
    awards_normalized = min(awards / 10.0, 1.0)  # Cap at 10 awards
    engagement_normalized = min(engagement / 200.0, 1.0)
    
    # Weighted quality score
    quality = (
        score_normalized * 0.4 +
        comments_normalized * 0.3 +
        awards_normalized * 0.2 +
        engagement_normalized * 0.1
    )
    
    return round(quality, 3)

def should_filter_reddit_post(post_data, subreddit):
    """
    Determine if Reddit post should be filtered out
    
    Args:
        post_data: Reddit post metadata dict
        subreddit: Subreddit name
        
    Returns:
        Boolean indicating if post should be filtered
    """
    import re
    
    # Get thresholds for this subreddit
    thresholds = SUBREDDIT_THRESHOLDS.get(subreddit.lower(), {
        'min_score': DEFAULT_MIN_SCORE,
        'min_comments': DEFAULT_MIN_COMMENTS
    })
    
    # Check score threshold
    score = post_data.get('score', 0)
    if score < thresholds['min_score']:
        return True
    
    # Check comment threshold
    num_comments = post_data.get('num_comments', 0)
    if num_comments < thresholds['min_comments']:
        return True
    
    # Check age
    created_utc = post_data.get('created_utc', 0)
    if created_utc:
        post_age = datetime.utcnow() - datetime.fromtimestamp(created_utc)
        if post_age > timedelta(hours=DEFAULT_MAX_AGE_HOURS):
            return True
    
    # Filter stickied posts
    if post_data.get('stickied', False):
        return True
    
    # Filter NSFW
    if post_data.get('over_18', False):
        return True
    
    # Filter spoilers
    if post_data.get('spoiler', False):
        return True
    
    # Filter deleted/removed
    if post_data.get('author') in ['[deleted]', '[removed]']:
        return True
    
    # Check for low-effort content
    title = post_data.get('title', '')
    for pattern in LOW_EFFORT_PATTERNS:
        if re.search(pattern, title, re.IGNORECASE):
            return True
    
    # Filter self-promotion (high ratio of self-posts)
    is_self = post_data.get('is_self', False)
    if is_self and score < thresholds['min_score'] * 1.5:
        return True
    
    return False

def filter_reddit_articles(articles):
    """
    Filter Reddit articles based on quality criteria
    
    Args:
        articles: List of Reddit articles
        
    Returns:
        Filtered list of high-quality Reddit articles
    """
    filtered = []
    
    for article in articles:
        # Only process Reddit articles
        if article.get('type') != 'reddit':
            filtered.append(article)
            continue
        
        metadata = article.get('metadata', {})
        subreddit = metadata.get('subreddit', '')
        
        # Check if should filter
        if should_filter_reddit_post(metadata, subreddit):
            continue
        
        # Calculate and add quality score
        quality_score = calculate_reddit_quality_score(metadata)
        article['reddit_quality_score'] = quality_score
        
        # Add engagement metrics to article
        article['engagement'] = {
            'score': metadata.get('score', 0),
            'comments': metadata.get('num_comments', 0),
            'awards': metadata.get('total_awards_received', 0)
        }
        
        filtered.append(article)
    
    return filtered

def enhance_reddit_metadata(post_data):
    """
    Extract and enhance Reddit post metadata
    
    Args:
        post_data: Raw Reddit API post data
        
    Returns:
        Enhanced metadata dict
    """
    return {
        'score': post_data.get('score', 0),
        'num_comments': post_data.get('num_comments', 0),
        'total_awards_received': post_data.get('total_awards_received', 0),
        'created_utc': post_data.get('created_utc', 0),
        'subreddit': post_data.get('subreddit', ''),
        'author': post_data.get('author', ''),
        'is_self': post_data.get('is_self', False),
        'stickied': post_data.get('stickied', False),
        'over_18': post_data.get('over_18', False),
        'spoiler': post_data.get('spoiler', False),
        'upvote_ratio': post_data.get('upvote_ratio', 0.0),
        'permalink': post_data.get('permalink', ''),
    }
