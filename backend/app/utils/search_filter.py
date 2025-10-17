from datetime import datetime

def search_articles(articles, keyword):
    """
    Search articles by keyword in title or summary
    
    Args:
        articles: List of articles
        keyword: Search keyword
        
    Returns:
        Filtered list of articles
    """
    if not keyword:
        return articles
    
    keyword_lower = keyword.lower()
    filtered = []
    
    for article in articles:
        title = article.get('title', '').lower()
        summary = article.get('summary', '').lower()
        
        if keyword_lower in title or keyword_lower in summary:
            filtered.append(article)
    
    return filtered

def filter_by_source(articles, source_name):
    """
    Filter articles by source name
    
    Args:
        articles: List of articles
        source_name: Source name to filter by
        
    Returns:
        Filtered list of articles
    """
    if not source_name:
        return articles
    
    source_lower = source_name.lower()
    return [
        article for article in articles 
        if source_lower in article.get('source', '').lower()
    ]

def filter_by_date_range(articles, start_date=None, end_date=None):
    """
    Filter articles by date range
    
    Args:
        articles: List of articles
        start_date: Start date (ISO format string)
        end_date: End date (ISO format string)
        
    Returns:
        Filtered list of articles
    """
    if not start_date and not end_date:
        return articles
    
    filtered = []
    
    for article in articles:
        published = article.get('published', '')
        if not published:
            continue
        
        try:
            article_date = datetime.fromisoformat(published.replace('Z', '+00:00'))
            article_date = article_date.replace(tzinfo=None)
            
            # Check start date
            if start_date:
                start = datetime.fromisoformat(start_date)
                if article_date < start:
                    continue
            
            # Check end date
            if end_date:
                end = datetime.fromisoformat(end_date)
                if article_date > end:
                    continue
            
            filtered.append(article)
        except:
            continue
    
    return filtered
