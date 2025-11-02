import requests
import feedparser
from datetime import datetime
from app.utils.reddit_filter import should_filter_reddit_post, enhance_reddit_metadata, calculate_reddit_quality_score

def scrape_reddit(subreddits):
    """
    Scrape posts from Reddit subreddits with quality filtering
    
    Args:
        subreddits: List of subreddit names
        
    Returns:
        List of normalized high-quality articles
    """
    articles = []
    
    for subreddit in subreddits:
        try:
            url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit=25"
            headers = {'User-Agent': 'ContentHub/1.0'}
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            posts = data.get('data', {}).get('children', [])
            
            for post in posts:
                post_data = post.get('data', {})
                
                # Apply quality filter
                if should_filter_reddit_post(post_data, subreddit):
                    continue
                
                # Enhance metadata
                metadata = enhance_reddit_metadata(post_data)
                
                # Calculate quality score
                quality_score = calculate_reddit_quality_score(metadata)
                
                article = {
                    'title': post_data.get('title', 'No Title'),
                    'link': f"https://www.reddit.com{post_data.get('permalink', '')}",
                    'summary': post_data.get('selftext', '')[:200] if post_data.get('selftext') else '',
                    'source': f"r/{subreddit}",
                    'published': datetime.fromtimestamp(post_data.get('created_utc', 0)).isoformat(),
                    'type': 'reddit',
                    'metadata': metadata,
                    'reddit_quality_score': quality_score,
                    'engagement': {
                        'score': metadata.get('score', 0),
                        'comments': metadata.get('num_comments', 0),
                        'awards': metadata.get('total_awards_received', 0)
                    }
                }
                articles.append(article)
                
        except Exception as e:
            print(f"Error scraping r/{subreddit}: {str(e)}")
            continue
    
    return articles

def truncate_at_third_fullstop(text):
    """Truncate text at the third full stop"""
    if not text:
        return text
    
    fullstops = 0
    for i, char in enumerate(text):
        if char == '.':
            fullstops += 1
            if fullstops == 3:
                return text[:i+1]
    return text

def scrape_youtube(channel_ids):
    """
    Scrape videos from YouTube channels via RSS
    
    Args:
        channel_ids: List of YouTube channel IDs
        
    Returns:
        List of normalized articles
    """
    articles = []
    
    for channel_id in channel_ids:
        try:
            url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
            
            feed = feedparser.parse(url)
            channel_name = feed.feed.get('title', channel_id)
            
            for entry in feed.entries:
                summary = entry.get('summary', '')
                # Truncate YouTube descriptions at third full stop
                if summary:
                    summary = truncate_at_third_fullstop(summary)
                
                article = {
                    'title': entry.get('title', 'No Title'),
                    'link': entry.get('link', ''),
                    'summary': summary,
                    'source': channel_name,
                    'published': entry.get('published', ''),
                    'type': 'youtube',
                    'metadata': {
                        'channel_id': channel_id,
                        'video_id': entry.get('yt_videoid', '')
                    }
                }
                articles.append(article)
                
        except Exception as e:
            print(f"Error scraping YouTube channel {channel_id}: {str(e)}")
            continue
    
    return articles

def scrape_social_media(reddit_subs=None, youtube_channels=None):
    """
    Scrape all social media sources
    
    Args:
        reddit_subs: List of subreddit names
        youtube_channels: List of YouTube channel IDs
        
    Returns:
        List of normalized articles from all sources
    """
    all_articles = []
    
    # Scrape Reddit with quality filtering
    if reddit_subs:
        reddit_articles = scrape_reddit(reddit_subs)
        all_articles.extend(reddit_articles)
    
    # Scrape YouTube
    if youtube_channels:
        youtube_articles = scrape_youtube(youtube_channels)
        all_articles.extend(youtube_articles)
    
    return all_articles
