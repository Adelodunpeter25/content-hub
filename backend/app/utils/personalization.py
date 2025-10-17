def filter_by_user_preferences(articles, feed_sources=None, feed_types=None):
    """
    Filter articles based on user preferences
    
    Args:
        articles: List of articles
        feed_sources: List of preferred source names (e.g., ['TechCrunch', 'The Verge'])
        feed_types: List of preferred feed types (e.g., ['rss', 'scrape'])
        
    Returns:
        Filtered list of articles
    """
    filtered = articles
    
    # Filter by source names
    if feed_sources and len(feed_sources) > 0:
        filtered = [
            article for article in filtered
            if any(source.lower() in article.get('source', '').lower() for source in feed_sources)
        ]
    
    # Filter by feed types
    if feed_types and len(feed_types) > 0:
        filtered = [
            article for article in filtered
            if article.get('type') in feed_types
        ]
    
    return filtered
