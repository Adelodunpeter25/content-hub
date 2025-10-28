"""Feed template definitions and utilities"""

# Feed template definitions with associated tags
FEED_TEMPLATES = {
    'frontend': {
        'name': 'Frontend Developer',
        'description': 'Perfect for frontend developers working with modern web technologies',
        'icon': '🎨',
        'tags': [
            'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'CSS', 'HTML',
            'Next.js', 'Svelte', 'Tailwind CSS', 'Web', 'UI/UX', 'Webpack', 'Vite'
        ],
        'sources': [
            'CSS-Tricks', 'Smashing Magazine', 'web.dev', 'React', 'Vue.js', 
            'A List Apart', 'Frontend Focus', 'JavaScript Weekly'
        ]
    },
    'backend': {
        'name': 'Backend Developer',
        'description': 'For backend engineers building scalable server-side applications',
        'icon': '⚙️',
        'tags': [
            'Python', 'Go', 'Java', 'Node.js', 'APIs', 'Databases', 'PostgreSQL',
            'Redis', 'Microservices', 'REST', 'GraphQL', 'Django', 'Flask', 'FastAPI'
        ],
        'sources': [
            'Python Insider', 'Go Blog', 'PostgreSQL News', 'Redis Blog',
            'Backend Weekly', 'API Design', 'Microservices'
        ]
    },
    'ai_ml': {
        'name': 'AI/ML Engineer',
        'description': 'Stay updated on artificial intelligence and machine learning',
        'icon': '🤖',
        'tags': [
            'AI', 'Machine Learning', 'Deep Learning', 'Python', 'TensorFlow',
            'PyTorch', 'NLP', 'Computer Vision', 'Data Science', 'Neural Networks',
            'LLM', 'GPT', 'Transformers'
        ],
        'sources': [
            'OpenAI Blog', 'TensorFlow Blog', 'PyTorch Blog', 'Hugging Face',
            'Papers with Code', 'AI Weekly', 'ML News'
        ]
    },
    'devops': {
        'name': 'DevOps Engineer',
        'description': 'Infrastructure, automation, and deployment best practices',
        'icon': '🚀',
        'tags': [
            'DevOps', 'Kubernetes', 'Docker', 'AWS', 'Azure', 'GCP', 'CI/CD',
            'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Monitoring',
            'Infrastructure', 'Cloud'
        ],
        'sources': [
            'Kubernetes Blog', 'Docker Blog', 'AWS Blog', 'Azure Blog',
            'DevOps Weekly', 'SRE Weekly', 'Infrastructure'
        ]
    },
    'mobile': {
        'name': 'Mobile Developer',
        'description': 'iOS, Android, and cross-platform mobile development',
        'icon': '📱',
        'tags': [
            'iOS', 'Android', 'Swift', 'Kotlin', 'React Native', 'Flutter',
            'Mobile', 'SwiftUI', 'Jetpack Compose', 'Xcode', 'Android Studio'
        ],
        'sources': [
            'Swift.org', 'Kotlin Blog', 'React Native Blog', 'Flutter Blog',
            'iOS Dev Weekly', 'Android Weekly', 'Mobile Dev'
        ]
    },
    'fullstack': {
        'name': 'Full Stack Developer',
        'description': 'Complete coverage of frontend, backend, and everything in between',
        'icon': '🌐',
        'tags': [
            'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'APIs',
            'Databases', 'Web', 'Full Stack', 'Next.js', 'PostgreSQL', 'MongoDB',
            'REST', 'GraphQL', 'Docker'
        ],
        'sources': [
            'Full Stack Weekly', 'JavaScript Weekly', 'Node Weekly', 'Web Dev',
            'Stack Overflow Blog', 'DEV Community', 'Hacker News'
        ]
    }
}

def get_template(template_name):
    """
    Get template configuration by name
    
    Args:
        template_name: Template identifier (frontend, backend, ai_ml, etc.)
        
    Returns:
        Template configuration dict or None
    """
    return FEED_TEMPLATES.get(template_name)

def get_all_templates():
    """
    Get all available templates
    
    Returns:
        List of template configurations
    """
    return [
        {
            'id': key,
            'name': value['name'],
            'description': value['description'],
            'icon': value['icon'],
            'tag_count': len(value['tags']),
            'source_count': len(value['sources'])
        }
        for key, value in FEED_TEMPLATES.items()
    ]

def get_template_tags(template_name):
    """
    Get tag names for a template
    
    Args:
        template_name: Template identifier
        
    Returns:
        List of tag names
    """
    template = FEED_TEMPLATES.get(template_name)
    return template['tags'] if template else []

def get_template_sources(template_name):
    """
    Get source names for a template
    
    Args:
        template_name: Template identifier
        
    Returns:
        List of source names
    """
    template = FEED_TEMPLATES.get(template_name)
    return template['sources'] if template else []

def map_template_to_tag_ids(template_name, db):
    """
    Map template tag names to tag IDs from database
    
    Args:
        template_name: Template identifier
        db: Database session
        
    Returns:
        List of tag IDs
    """
    from app.models.tag import Tag
    
    tag_names = get_template_tags(template_name)
    if not tag_names:
        return []
    
    tags = db.query(Tag).filter(Tag.name.in_(tag_names)).all()
    return [tag.id for tag in tags]

def get_recommended_sources_for_tags(tag_ids, db):
    """
    Get recommended sources based on selected tags
    
    Args:
        tag_ids: List of tag IDs
        db: Database session
        
    Returns:
        List of source names
    """
    from app.models.source import Source
    from sqlalchemy import func
    
    if not tag_ids:
        return []
    
    # Find sources that have overlapping tags
    sources = db.query(Source).filter(
        Source.is_active == True,
        Source.tags.overlap(tag_ids)
    ).order_by(
        Source.quality_tier.desc(),
        Source.success_rate.desc()
    ).limit(20).all()
    
    return [source.name for source in sources]
