import feedparser
from datetime import datetime

def fetch_rss_feeds(feed_urls):
    """
    Fetch and parse multiple RSS feeds
    
    Args:
        feed_urls: List of RSS feed URLs
        
    Returns:
        List of normalized articles
    """
    articles = []
    
    for url in feed_urls:
        try:
            # Parse the RSS feed
            feed = feedparser.parse(url)
            
            # Extract source name from feed title or URL
            source = feed.feed.get('title', url.split('/')[2])
            
            # Process each entry in the feed
            for entry in feed.entries:
                article = {
                    'title': entry.get('title', 'No Title'),
                    'link': entry.get('link', ''),
                    'summary': entry.get('summary', entry.get('description', 'No summary available')),
                    'source': source,
                    'published': entry.get('published', entry.get('updated', '')),
                    'type': 'rss'
                }
                articles.append(article)
                
        except Exception as e:
            print(f"Error fetching {url}: {str(e)}")
            continue
    
    return articles
