from datetime import datetime

def deduplicate_articles(articles):
    """
    Remove duplicate articles based on URL
    
    Args:
        articles: List of articles
        
    Returns:
        Deduplicated list of articles
    """
    seen_links = set()
    unique_articles = []
    
    for article in articles:
        link = article.get('link', '')
        if link and link not in seen_links:
            seen_links.add(link)
            unique_articles.append(article)
    
    return unique_articles

def sort_by_date(articles):
    """
    Sort articles by published date (newest first)
    
    Args:
        articles: List of articles
        
    Returns:
        Sorted list of articles
    """
    def get_date(article):
        published = article.get('published', '')
        if not published:
            return datetime.min.replace(tzinfo=None)
        try:
            dt = datetime.fromisoformat(published.replace('Z', '+00:00'))
            return dt.replace(tzinfo=None)
        except Exception:
            return datetime.min.replace(tzinfo=None)
    
    return sorted(articles, key=get_date, reverse=True)

def aggregate_feeds(all_articles, unused_param=None, source_filter=None, limit=None):
    """
    Combine, deduplicate, and sort articles from multiple sources
    
    Args:
        all_articles: Combined list of articles from all sources
        unused_param: Deprecated parameter (kept for compatibility)
        source_filter: Filter by type ('rss', 'scrape', 'reddit', 'youtube')
        limit: Maximum number of articles to return
        
    Returns:
        Aggregated and processed articles
    """
    # Apply source filter if specified
    if source_filter:
        all_articles = [a for a in all_articles if a.get('type') == source_filter]
    
    # Deduplicate
    all_articles = deduplicate_articles(all_articles)
    
    # Sort by date
    all_articles = sort_by_date(all_articles)
    
    # Apply limit
    if limit:
        all_articles = all_articles[:limit]
    
    return all_articles
