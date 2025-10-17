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
        except:
            return datetime.min.replace(tzinfo=None)
    
    return sorted(articles, key=get_date, reverse=True)

def aggregate_feeds(rss_articles, scraped_articles, source_filter=None, limit=None):
    """
    Combine, deduplicate, and sort articles from multiple sources
    
    Args:
        rss_articles: Articles from RSS feeds
        scraped_articles: Articles from web scraping
        source_filter: Filter by type ('rss' or 'scrape')
        limit: Maximum number of articles to return
        
    Returns:
        Aggregated and processed articles
    """
    # Combine all articles
    all_articles = []
    
    if source_filter == 'rss':
        all_articles = rss_articles
    elif source_filter == 'scrape':
        all_articles = scraped_articles
    else:
        all_articles = rss_articles + scraped_articles
    
    # Deduplicate
    all_articles = deduplicate_articles(all_articles)
    
    # Sort by date
    all_articles = sort_by_date(all_articles)
    
    # Apply limit
    if limit:
        all_articles = all_articles[:limit]
    
    return all_articles
