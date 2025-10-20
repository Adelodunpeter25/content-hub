"""Auto-categorize articles based on keywords"""

CATEGORIES = {
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'gpt', 'llm', 'chatgpt', 'openai'],
    'Security': ['security', 'hack', 'breach', 'vulnerability', 'cyber', 'malware', 'ransomware', 'encryption', 'privacy'],
    'Cloud': ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'serverless'],
    'Mobile': ['mobile', 'ios', 'android', 'iphone', 'smartphone', 'app store'],
    'Web': ['web', 'browser', 'javascript', 'react', 'vue', 'angular', 'frontend'],
    'Hardware': ['hardware', 'chip', 'processor', 'gpu', 'cpu', 'semiconductor', 'apple silicon'],
    'Gaming': ['gaming', 'game', 'playstation', 'xbox', 'nintendo', 'steam'],
    'Startup': ['startup', 'funding', 'venture capital', 'vc', 'investment', 'acquisition'],
    'Programming': ['programming', 'code', 'developer', 'python', 'java', 'rust', 'go', 'typescript']
}

def categorize_article(title, summary=''):
    """
    Categorize article based on title and summary
    
    Args:
        title: Article title
        summary: Article summary
        
    Returns:
        List of matching categories
    """
    text = f"{title} {summary}".lower()
    categories = []
    
    for category, keywords in CATEGORIES.items():
        if any(keyword in text for keyword in keywords):
            categories.append(category)
    
    return categories if categories else ['General']

def add_categories_to_articles(articles):
    """
    Add categories to list of articles
    
    Args:
        articles: List of articles
        
    Returns:
        Articles with categories added
    """
    for article in articles:
        article['categories'] = categorize_article(
            article.get('title', ''),
            article.get('summary', '')
        )
    return articles
