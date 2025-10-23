"""Auto-categorize articles based on keywords"""

CATEGORIES = {
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'gpt', 'llm', 'chatgpt', 'openai', 'generative ai', 'transformer', 'nlp', 'computer vision', 'anthropic', 'claude', 'gemini', 'copilot', 'midjourney', 'stable diffusion'],
    'Security': ['security', 'hack', 'breach', 'vulnerability', 'cyber', 'malware', 'ransomware', 'encryption', 'privacy', 'phishing', 'exploit', 'zero-day', 'firewall', 'penetration test', 'infosec', 'threat', 'attack', 'password', 'authentication', 'authorization'],
    'Cybersecurity': ['cybersecurity', 'cyber security', 'cyber attack', 'data breach', 'security breach', 'hacker', 'hacking', 'ddos', 'botnet', 'trojan', 'spyware', 'adware'],
    'Cloud': ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'serverless', 'lambda', 'ec2', 's3', 'cloud computing', 'iaas', 'paas', 'saas', 'microservices', 'container', 'orchestration', 'cloud native'],
    'Mobile': ['mobile', 'ios', 'android', 'iphone', 'smartphone', 'app store', 'play store', 'mobile app', 'swift', 'kotlin', 'react native', 'flutter', 'tablet', 'ipad'],
    'Web': ['web', 'browser', 'javascript', 'react', 'vue', 'angular', 'frontend', 'backend', 'html', 'css', 'node.js', 'next.js', 'svelte', 'tailwind', 'webpack', 'vite', 'web development', 'full stack'],
    'Hardware': ['hardware', 'chip', 'processor', 'gpu', 'cpu', 'semiconductor', 'apple silicon', 'nvidia', 'amd', 'intel', 'arm', 'transistor', 'fabrication', 'tsmc', 'memory', 'storage', 'ssd', 'ram'],
    'Gaming': ['gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'esports', 'video game', 'console', 'pc gaming', 'game developer', 'unity', 'unreal engine', 'twitch', 'streamer'],
    'Startup': ['startup', 'funding', 'venture capital', 'vc', 'investment', 'acquisition', 'series a', 'series b', 'seed round', 'ipo', 'unicorn', 'valuation', 'pitch', 'entrepreneur', 'founder', 'y combinator', 'techstars'],
    'Programming': ['programming', 'code', 'developer', 'python', 'java', 'rust', 'go', 'typescript', 'c++', 'c#', 'ruby', 'php', 'scala', 'kotlin', 'software', 'coding', 'algorithm', 'data structure', 'api', 'framework', 'library'],
    'Data Science': ['data science', 'data scientist', 'big data', 'analytics', 'data analysis', 'pandas', 'numpy', 'jupyter', 'visualization', 'tableau', 'power bi', 'sql', 'database', 'etl', 'data engineering', 'data pipeline'],
    'DevOps': ['devops', 'ci/cd', 'continuous integration', 'continuous deployment', 'jenkins', 'github actions', 'gitlab', 'terraform', 'ansible', 'infrastructure', 'monitoring', 'observability', 'prometheus', 'grafana', 'deployment', 'automation']
}

def categorize_article(title, summary=''):
    """
    Categorize article based on title and summary with weighted scoring
    
    Args:
        title: Article title
        summary: Article summary
        
    Returns:
        List of matching categories (primary first)
    """
    title_lower = title.lower()
    summary_lower = summary.lower()
    
    category_scores = {}
    
    for category, keywords in CATEGORIES.items():
        score = 0
        for keyword in keywords:
            # Title matches worth more
            if keyword in title_lower:
                score += 3
            # Summary matches
            elif keyword in summary_lower:
                score += 1
        
        if score > 0:
            category_scores[category] = score
    
    # Sort by score, return top categories
    if category_scores:
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        # Return top 3 categories or all if less than 3
        return [cat for cat, score in sorted_categories[:3]]
    
    return ['General']

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
