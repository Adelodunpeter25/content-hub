import feedparser
import html
import re
import concurrent.futures
from typing import List

def strip_html_tags(text):
    """Remove HTML tags and decode HTML entities"""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = html.unescape(text)
    # Clean up extra whitespace
    text = ' '.join(text.split())
    return text

def truncate_to_sentences(text, max_sentences=2):
    """Truncate text to first N sentences"""
    # Split by sentence endings
    sentences = re.split(r'(?<=[.!?])\s+', text)
    # Take first max_sentences
    truncated = ' '.join(sentences[:max_sentences])
    return truncated

def is_spam_content(title, summary):
    """Detect spam or low-quality content"""
    spam_patterns = [
        r'\d{10,}',  # Long phone numbers
        r'شماره',  # Non-English spam keywords
        r'خاله',
        r'تهران',
        r'اصفهان',
    ]
    text = f"{title} {summary}".lower()
    return any(re.search(pattern, text) for pattern in spam_patterns)

def fetch_single_feed(url: str) -> List[dict]:
    """
    Fetch and parse a single RSS feed
    
    Args:
        url: RSS feed URL
        
    Returns:
        List of normalized articles from this feed
    """
    articles = []
    
    try:
        # Parse the RSS feed
        feed = feedparser.parse(url)
        
        # Extract source name from feed title or URL
        source_title = feed.feed.get('title', url.split('/')[2])
        # Clean up source name (remove descriptions)
        if ':' in source_title:
            source = source_title.split(':')[0].strip()
        elif ' - ' in source_title:
            source = source_title.split(' - ')[0].strip()
        elif ' is ' in source_title.lower():
            source = source_title.split(' is ')[0].strip()
        else:
            source = source_title
        
        # Process each entry in the feed
        for entry in feed.entries:
            raw_title = entry.get('title', 'No Title')
            raw_summary = entry.get('summary', entry.get('description', ''))
            
            # Skip spam content
            if is_spam_content(raw_title, raw_summary):
                continue
            
            # Clean summary
            clean_summary = strip_html_tags(raw_summary)
            
            # Truncate to 2 sentences for cleaner display
            clean_summary = truncate_to_sentences(clean_summary, max_sentences=2)
            
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
            
            # Get published date with fallback
            published = entry.get('published', entry.get('updated', entry.get('pubDate', '')))
            if not published:
                from datetime import datetime
                published = datetime.utcnow().isoformat()
            
            article = {
                'title': strip_html_tags(raw_title),
                'link': entry.get('link', ''),
                'summary': clean_summary,
                'source': source,
                'published': published,
                'type': 'rss'
            }
            articles.append(article)
                
    except Exception as e:
        print(f"Error fetching {url}: {str(e)}")
    
    return articles


def fetch_rss_feeds(feed_urls: List[str]) -> List[dict]:
    """
    Fetch and parse multiple RSS feeds concurrently
    
    Args:
        feed_urls: List of RSS feed URLs
        
    Returns:
        List of normalized articles from all feeds
    """
    all_articles = []
    
    # Use ThreadPoolExecutor to fetch feeds concurrently
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        # Submit all feed fetching tasks
        future_to_url = {executor.submit(fetch_single_feed, url): url for url in feed_urls}
        
        # Collect results as they complete
        for future in concurrent.futures.as_completed(future_to_url):
            try:
                articles = future.result()
                all_articles.extend(articles)
            except Exception as e:
                url = future_to_url[future]
                print(f"Error processing {url}: {str(e)}")
    
    return all_articles
