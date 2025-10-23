import feedparser
import html
import re

def strip_html_tags(text):
    """Remove HTML tags and decode HTML entities"""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = html.unescape(text)
    # Clean up extra whitespace
    text = ' '.join(text.split())
    return text

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
                raw_title = entry.get('title', 'No Title')
                raw_summary = entry.get('summary', entry.get('description', ''))
                
                # Clean summary
                clean_summary = strip_html_tags(raw_summary)
                
                # Hacker News specific: extract only meaningful text before metadata
                if 'hnrss.org' in url or 'Hacker News' in source:
                    # Remove metadata lines (Article URL, Comments URL, Points, # Comments)
                    lines = clean_summary.split('\n')
                    meaningful_lines = []
                    for line in lines:
                        line = line.strip()
                        if line and not any(x in line for x in ['Article URL:', 'Comments URL:', 'Points:', '# Comments:']):
                            meaningful_lines.append(line)
                    clean_summary = ' '.join(meaningful_lines) if meaningful_lines else 'Discussion on Hacker News'
                
                article = {
                    'title': strip_html_tags(raw_title),
                    'link': entry.get('link', ''),
                    'summary': clean_summary,
                    'source': source,
                    'published': entry.get('published', entry.get('updated', '')),
                    'type': 'rss'
                }
                articles.append(article)
                
        except Exception as e:
            print(f"Error fetching {url}: {str(e)}")
            continue
    
    return articles
