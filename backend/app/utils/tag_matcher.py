"""Keyword-based tag matching for articles"""
import re

# Tag keyword mappings (more granular than categories)
TAG_KEYWORDS = {
    # Languages
    'Python': ['python', 'py', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'pytest'],
    'JavaScript': ['javascript', 'js', 'ecmascript', 'es6', 'es2015', 'node.js', 'nodejs'],
    'TypeScript': ['typescript', 'ts', 'type safety', 'typed javascript'],
    'Go': ['golang', ' go ', 'go lang'],
    'Rust': ['rust', 'cargo', 'rustc'],
    'Java': ['java', 'jvm', 'spring', 'maven', 'gradle'],
    'C++': ['c++', 'cpp', 'cplusplus'],
    'PHP': ['php', 'laravel', 'symfony', 'composer'],
    'Ruby': ['ruby', 'rails', 'ruby on rails', 'gem'],
    'Swift': ['swift', 'swiftui', 'ios development'],
    'Kotlin': ['kotlin', 'android development', 'jetpack'],
    'C#': ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
    
    # Frontend Frameworks
    'React': ['react', 'reactjs', 'react.js', 'jsx', 'react hooks', 'react native'],
    'Vue': ['vue', 'vuejs', 'vue.js', 'nuxt'],
    'Angular': ['angular', 'angularjs', 'ng'],
    'Svelte': ['svelte', 'sveltekit'],
    'Next.js': ['next.js', 'nextjs', 'next'],
    'Remix': ['remix', 'remix.run'],
    'Solid': ['solidjs', 'solid.js'],
    'Astro': ['astro', 'astro.build'],
    
    # Backend Frameworks
    'Django': ['django', 'django rest'],
    'Flask': ['flask', 'flask-restful'],
    'FastAPI': ['fastapi', 'fast api'],
    'Express': ['express', 'express.js', 'expressjs'],
    'NestJS': ['nestjs', 'nest.js'],
    'Spring': ['spring', 'spring boot', 'springboot'],
    'Laravel': ['laravel', 'eloquent'],
    'Rails': ['rails', 'ruby on rails', 'activerecord'],
    
    # Cloud Platforms
    'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'],
    'Azure': ['azure', 'microsoft azure', 'azure devops'],
    'GCP': ['gcp', 'google cloud', 'google cloud platform'],
    'Vercel': ['vercel', 'zeit'],
    'Netlify': ['netlify'],
    'Heroku': ['heroku'],
    'DigitalOcean': ['digitalocean', 'digital ocean'],
    
    # DevOps & Tools
    'Docker': ['docker', 'dockerfile', 'container'],
    'Kubernetes': ['kubernetes', 'k8s', 'kubectl', 'helm'],
    'CI/CD': ['ci/cd', 'continuous integration', 'continuous deployment', 'continuous delivery'],
    'Jenkins': ['jenkins'],
    'GitHub Actions': ['github actions', 'gh actions'],
    'GitLab CI': ['gitlab ci', 'gitlab-ci'],
    'Terraform': ['terraform', 'tf', 'infrastructure as code'],
    'Ansible': ['ansible', 'playbook'],
    
    # Databases
    'PostgreSQL': ['postgresql', 'postgres', 'psql'],
    'MySQL': ['mysql', 'mariadb'],
    'MongoDB': ['mongodb', 'mongo', 'nosql'],
    'Redis': ['redis', 'cache'],
    'Elasticsearch': ['elasticsearch', 'elastic', 'elk'],
    'SQLite': ['sqlite'],
    'Supabase': ['supabase'],
    'Firebase': ['firebase', 'firestore'],
    
    # AI/ML
    'TensorFlow': ['tensorflow', 'tf'],
    'PyTorch': ['pytorch', 'torch'],
    'Hugging Face': ['hugging face', 'transformers', 'hf'],
    'OpenAI': ['openai', 'gpt', 'chatgpt', 'dall-e'],
    'LLM': ['llm', 'large language model', 'language model'],
    'Neural Networks': ['neural network', 'deep learning', 'cnn', 'rnn', 'lstm'],
    'NLP': ['nlp', 'natural language processing', 'text processing'],
    'Computer Vision': ['computer vision', 'image recognition', 'object detection'],
    
    # Web Technologies
    'HTML': ['html', 'html5', 'markup'],
    'CSS': ['css', 'css3', 'stylesheet'],
    'Tailwind CSS': ['tailwind', 'tailwindcss'],
    'Sass': ['sass', 'scss'],
    'Webpack': ['webpack', 'bundler'],
    'Vite': ['vite', 'vitejs'],
    'GraphQL': ['graphql', 'gql', 'apollo'],
    'REST': ['rest', 'restful', 'rest api'],
    'WebAssembly': ['webassembly', 'wasm'],
    
    # Mobile
    'React Native': ['react native', 'rn'],
    'Flutter': ['flutter', 'dart'],
    'Ionic': ['ionic'],
    'SwiftUI': ['swiftui'],
    'Jetpack Compose': ['jetpack compose', 'compose'],
    
    # Testing
    'Jest': ['jest', 'testing'],
    'Pytest': ['pytest', 'python testing'],
    'Cypress': ['cypress', 'e2e testing'],
    'Selenium': ['selenium', 'webdriver'],
    
    # Other
    'Git': ['git', 'github', 'gitlab', 'version control'],
    'VS Code': ['vscode', 'visual studio code'],
    'Linux': ['linux', 'ubuntu', 'debian', 'centos'],
    'Security': ['security', 'vulnerability', 'encryption', 'authentication'],
    'Performance': ['performance', 'optimization', 'speed', 'latency'],
    'Accessibility': ['accessibility', 'a11y', 'wcag'],
}

def match_tags(title, summary='', max_tags=5):
    """
    Match article to tags based on keywords
    
    Args:
        title: Article title
        summary: Article summary
        max_tags: Maximum number of tags to return
        
    Returns:
        List of tuples (tag_name, confidence_score)
    """
    title_lower = title.lower()
    summary_lower = summary.lower()
    
    tag_scores = {}
    
    for tag_name, keywords in TAG_KEYWORDS.items():
        score = 0.0
        
        for keyword in keywords:
            keyword_lower = keyword.lower()
            
            # Title matches worth more
            if keyword_lower in title_lower:
                # Exact word boundary match worth more
                if f' {keyword_lower} ' in f' {title_lower} ':
                    score += 1.0
                else:
                    score += 0.7
            
            # Summary matches
            if keyword_lower in summary_lower:
                if f' {keyword_lower} ' in f' {summary_lower} ':
                    score += 0.4
                else:
                    score += 0.2
        
        if score > 0:
            # Normalize score to 0-1 range
            confidence = min(score / 2.0, 1.0)
            tag_scores[tag_name] = confidence
    
    # Sort by score and return top tags
    sorted_tags = sorted(tag_scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_tags[:max_tags]

def add_tags_to_articles(articles, db):
    """
    Add tags to list of articles
    
    Args:
        articles: List of articles
        db: Database session
        
    Returns:
        Articles with tags added
    """
    from app.models.tag import Tag
    
    # Get all tags from database
    all_tags_dict = {tag.name: tag.id for tag in db.query(Tag).all()}
    
    # Filter TAG_KEYWORDS to only include tags that exist in database
    available_keywords = {name: keywords for name, keywords in TAG_KEYWORDS.items() if name in all_tags_dict}
    
    for article in articles:
        # Match tags using only available tags
        matched_tags = match_tags_from_dict(
            article.get('title', ''),
            article.get('summary', ''),
            available_keywords
        )
        
        # Convert to tag objects with IDs
        article_tags = []
        for tag_name, confidence in matched_tags:
            if tag_name in all_tags_dict:
                article_tags.append({
                    'id': all_tags_dict[tag_name],
                    'name': tag_name,
                    'confidence': round(confidence, 2)
                })
        
        article['tags'] = article_tags
    
    return articles

def match_tags_from_dict(title, summary='', keywords_dict=None, max_tags=3, min_confidence=0.5):
    """
    Match article to tags based on provided keywords dictionary
    
    Args:
        title: Article title
        summary: Article summary
        keywords_dict: Dictionary of tag names to keywords
        max_tags: Maximum number of tags to return
        min_confidence: Minimum confidence threshold (increased to 0.5)
        
    Returns:
        List of tuples (tag_name, confidence_score)
    """
    if keywords_dict is None:
        keywords_dict = TAG_KEYWORDS
    
    title_lower = title.lower()
    summary_lower = summary.lower()
    
    tag_scores = {}
    
    for tag_name, keywords in keywords_dict.items():
        score = 0.0
        has_match = False
        
        for keyword in keywords:
            keyword_lower = keyword.lower()
            
            # Title matches worth more (ONLY exact word boundary matches)
            if keyword_lower in title_lower:
                if re.search(rf'\b{re.escape(keyword_lower)}\b', title_lower):
                    has_match = True
                    score += 2.0  # Increased weight for title matches
            
            # Summary matches (ONLY exact word boundary matches)
            if keyword_lower in summary_lower:
                if re.search(rf'\b{re.escape(keyword_lower)}\b', summary_lower):
                    has_match = True
                    score += 0.5
        
        if has_match and score > 0:
            # Stricter normalization
            confidence = min(score / 3.0, 1.0)
            if confidence >= min_confidence:
                tag_scores[tag_name] = confidence
    
    sorted_tags = sorted(tag_scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_tags[:max_tags]

def get_tag_names_from_ids(tag_ids, db):
    """
    Get tag names from tag IDs
    
    Args:
        tag_ids: List of tag IDs
        db: Database session
        
    Returns:
        List of tag names
    """
    from app.models.tag import Tag
    
    if not tag_ids:
        return []
    
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    return [tag.name for tag in tags]
