"""AI-powered article categorization using Gemini"""
import os
import time
import google.generativeai as genai
from app.core.cache import cache_get, cache_set

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash')

CATEGORIES = [
    'AI', 'Security', 'Cloud', 'Mobile', 'Web', 'Hardware', 
    'Gaming', 'Startup', 'Programming', 'Data Science', 
    'DevOps', 'Cybersecurity', 'General'
]

REQUEST_DELAY = 5  # seconds between requests

def categorize_with_gemini(title, summary=''):
    """
    Categorize article using Gemini API
    
    Args:
        title: Article title
        summary: Article summary
        
    Returns:
        List of categories (primary first)
    """
    cache_key = f"gemini_cat:{hash(title + summary)}"
    cached = cache_get(cache_key)
    if cached:
        return cached.split(',')
    
    prompt = f"""Categorize this tech article into 1-3 categories from this list: {', '.join(CATEGORIES)}

Title: {title}
Summary: {summary[:500]}

Return ONLY category names separated by commas, primary category first. No explanation."""

    try:
        response = model.generate_content(prompt)
        categories = [cat.strip() for cat in response.text.strip().split(',')]
        categories = [cat for cat in categories if cat in CATEGORIES]
        
        if not categories:
            categories = ['General']
        
        cache_set(cache_key, ','.join(categories), ttl=86400)  # 24h cache
        return categories
    except Exception as e:
        from app.utils.categorizer import categorize_article
        print(f"Gemini categorization failed: {e}")
        return categorize_article(title, summary)

def batch_categorize(articles, max_gemini=3):
    """
    Smart categorization: Gemini for new articles, keywords for cached
    
    Args:
        articles: List of articles with title and summary
        max_gemini: Maximum new articles to categorize with Gemini (default: 3)
        
    Returns:
        Articles with updated categories
    """
    from app.utils.categorizer import categorize_article
    
    gemini_count = 0
    
    for article in articles:
        title = article.get('title', '')
        summary = article.get('summary', '')
        cache_key = f"gemini_cat:{hash(title + summary)}"
        
        # Check if already categorized by Gemini
        cached = cache_get(cache_key)
        if cached:
            article['categories'] = cached.split(',')
        elif gemini_count < max_gemini:
            # Use Gemini for new articles (up to limit)
            article['categories'] = categorize_with_gemini(title, summary)
            gemini_count += 1
            if gemini_count < max_gemini:
                time.sleep(REQUEST_DELAY)
        else:
            # Use improved keyword categorization
            article['categories'] = categorize_article(title, summary)
    
    return articles
