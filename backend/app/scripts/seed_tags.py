"""Seed tags into database"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.database import get_db
from app.models.tag import Tag

# Tag definitions grouped by category
TAG_DEFINITIONS = {
    'Languages': [
        {'name': 'Python', 'slug': 'python', 'description': 'Python programming language', 'color': 'blue'},
        {'name': 'JavaScript', 'slug': 'javascript', 'description': 'JavaScript programming language', 'color': 'yellow'},
        {'name': 'TypeScript', 'slug': 'typescript', 'description': 'TypeScript - typed JavaScript', 'color': 'blue'},
        {'name': 'Go', 'slug': 'go', 'description': 'Go programming language', 'color': 'cyan'},
        {'name': 'Rust', 'slug': 'rust', 'description': 'Rust programming language', 'color': 'orange'},
        {'name': 'Java', 'slug': 'java', 'description': 'Java programming language', 'color': 'red'},
        {'name': 'C++', 'slug': 'cpp', 'description': 'C++ programming language', 'color': 'blue'},
        {'name': 'PHP', 'slug': 'php', 'description': 'PHP programming language', 'color': 'purple'},
        {'name': 'Ruby', 'slug': 'ruby', 'description': 'Ruby programming language', 'color': 'red'},
        {'name': 'Swift', 'slug': 'swift', 'description': 'Swift programming language', 'color': 'orange'},
        {'name': 'Kotlin', 'slug': 'kotlin', 'description': 'Kotlin programming language', 'color': 'purple'},
        {'name': 'C#', 'slug': 'csharp', 'description': 'C# programming language', 'color': 'purple'},
    ],
    'Frontend': [
        {'name': 'React', 'slug': 'react', 'description': 'React JavaScript library', 'color': 'cyan'},
        {'name': 'Vue', 'slug': 'vue', 'description': 'Vue.js framework', 'color': 'green'},
        {'name': 'Angular', 'slug': 'angular', 'description': 'Angular framework', 'color': 'red'},
        {'name': 'Svelte', 'slug': 'svelte', 'description': 'Svelte framework', 'color': 'orange'},
        {'name': 'Next.js', 'slug': 'nextjs', 'description': 'Next.js React framework', 'color': 'gray'},
        {'name': 'HTML', 'slug': 'html', 'description': 'HTML markup language', 'color': 'orange'},
        {'name': 'CSS', 'slug': 'css', 'description': 'CSS styling', 'color': 'blue'},
        {'name': 'Tailwind CSS', 'slug': 'tailwind', 'description': 'Tailwind CSS framework', 'color': 'cyan'},
        {'name': 'Sass', 'slug': 'sass', 'description': 'Sass CSS preprocessor', 'color': 'pink'},
        {'name': 'Webpack', 'slug': 'webpack', 'description': 'Webpack bundler', 'color': 'blue'},
        {'name': 'Vite', 'slug': 'vite', 'description': 'Vite build tool', 'color': 'purple'},
    ],
    'Backend': [
        {'name': 'Node.js', 'slug': 'nodejs', 'description': 'Node.js runtime', 'color': 'green'},
        {'name': 'Django', 'slug': 'django', 'description': 'Django Python framework', 'color': 'green'},
        {'name': 'Flask', 'slug': 'flask', 'description': 'Flask Python framework', 'color': 'gray'},
        {'name': 'FastAPI', 'slug': 'fastapi', 'description': 'FastAPI Python framework', 'color': 'teal'},
        {'name': 'Express', 'slug': 'express', 'description': 'Express.js framework', 'color': 'gray'},
        {'name': 'NestJS', 'slug': 'nestjs', 'description': 'NestJS framework', 'color': 'red'},
        {'name': 'Spring', 'slug': 'spring', 'description': 'Spring Java framework', 'color': 'green'},
        {'name': 'Laravel', 'slug': 'laravel', 'description': 'Laravel PHP framework', 'color': 'red'},
        {'name': 'Rails', 'slug': 'rails', 'description': 'Ruby on Rails framework', 'color': 'red'},
    ],
    'Cloud': [
        {'name': 'AWS', 'slug': 'aws', 'description': 'Amazon Web Services', 'color': 'orange'},
        {'name': 'Azure', 'slug': 'azure', 'description': 'Microsoft Azure', 'color': 'blue'},
        {'name': 'GCP', 'slug': 'gcp', 'description': 'Google Cloud Platform', 'color': 'blue'},
        {'name': 'Vercel', 'slug': 'vercel', 'description': 'Vercel hosting', 'color': 'gray'},
        {'name': 'Netlify', 'slug': 'netlify', 'description': 'Netlify hosting', 'color': 'teal'},
        {'name': 'Heroku', 'slug': 'heroku', 'description': 'Heroku platform', 'color': 'purple'},
        {'name': 'DigitalOcean', 'slug': 'digitalocean', 'description': 'DigitalOcean cloud', 'color': 'blue'},
    ],
    'DevOps': [
        {'name': 'Docker', 'slug': 'docker', 'description': 'Docker containers', 'color': 'blue'},
        {'name': 'Kubernetes', 'slug': 'kubernetes', 'description': 'Kubernetes orchestration', 'color': 'blue'},
        {'name': 'CI/CD', 'slug': 'cicd', 'description': 'Continuous Integration/Deployment', 'color': 'green'},
        {'name': 'Jenkins', 'slug': 'jenkins', 'description': 'Jenkins automation', 'color': 'red'},
        {'name': 'GitHub Actions', 'slug': 'github-actions', 'description': 'GitHub Actions CI/CD', 'color': 'gray'},
        {'name': 'GitLab CI', 'slug': 'gitlab-ci', 'description': 'GitLab CI/CD', 'color': 'orange'},
        {'name': 'Terraform', 'slug': 'terraform', 'description': 'Terraform IaC', 'color': 'purple'},
        {'name': 'Ansible', 'slug': 'ansible', 'description': 'Ansible automation', 'color': 'red'},
    ],
    'Databases': [
        {'name': 'PostgreSQL', 'slug': 'postgresql', 'description': 'PostgreSQL database', 'color': 'blue'},
        {'name': 'MySQL', 'slug': 'mysql', 'description': 'MySQL database', 'color': 'blue'},
        {'name': 'MongoDB', 'slug': 'mongodb', 'description': 'MongoDB NoSQL database', 'color': 'green'},
        {'name': 'Redis', 'slug': 'redis', 'description': 'Redis cache', 'color': 'red'},
        {'name': 'Elasticsearch', 'slug': 'elasticsearch', 'description': 'Elasticsearch search engine', 'color': 'yellow'},
        {'name': 'SQLite', 'slug': 'sqlite', 'description': 'SQLite database', 'color': 'blue'},
        {'name': 'Supabase', 'slug': 'supabase', 'description': 'Supabase backend', 'color': 'green'},
        {'name': 'Firebase', 'slug': 'firebase', 'description': 'Firebase platform', 'color': 'yellow'},
    ],
    'AI/ML': [
        {'name': 'TensorFlow', 'slug': 'tensorflow', 'description': 'TensorFlow ML framework', 'color': 'orange'},
        {'name': 'PyTorch', 'slug': 'pytorch', 'description': 'PyTorch ML framework', 'color': 'red'},
        {'name': 'Hugging Face', 'slug': 'huggingface', 'description': 'Hugging Face transformers', 'color': 'yellow'},
        {'name': 'OpenAI', 'slug': 'openai', 'description': 'OpenAI and GPT', 'color': 'green'},
        {'name': 'LLM', 'slug': 'llm', 'description': 'Large Language Models', 'color': 'purple'},
        {'name': 'Neural Networks', 'slug': 'neural-networks', 'description': 'Neural networks and deep learning', 'color': 'blue'},
        {'name': 'NLP', 'slug': 'nlp', 'description': 'Natural Language Processing', 'color': 'teal'},
        {'name': 'Computer Vision', 'slug': 'computer-vision', 'description': 'Computer vision and image processing', 'color': 'indigo'},
    ],
    'Mobile': [
        {'name': 'React Native', 'slug': 'react-native', 'description': 'React Native framework', 'color': 'cyan'},
        {'name': 'Flutter', 'slug': 'flutter', 'description': 'Flutter framework', 'color': 'blue'},
        {'name': 'iOS', 'slug': 'ios', 'description': 'iOS development', 'color': 'gray'},
        {'name': 'Android', 'slug': 'android', 'description': 'Android development', 'color': 'green'},
        {'name': 'SwiftUI', 'slug': 'swiftui', 'description': 'SwiftUI framework', 'color': 'blue'},
        {'name': 'Jetpack Compose', 'slug': 'jetpack-compose', 'description': 'Jetpack Compose UI', 'color': 'green'},
        {'name': 'Ionic', 'slug': 'ionic', 'description': 'Ionic framework', 'color': 'blue'},
    ],
    'Web': [
        {'name': 'GraphQL', 'slug': 'graphql', 'description': 'GraphQL query language', 'color': 'pink'},
        {'name': 'REST', 'slug': 'rest', 'description': 'REST APIs', 'color': 'blue'},
        {'name': 'WebAssembly', 'slug': 'webassembly', 'description': 'WebAssembly', 'color': 'purple'},
        {'name': 'Web', 'slug': 'web', 'description': 'Web development', 'color': 'blue'},
        {'name': 'APIs', 'slug': 'apis', 'description': 'API development', 'color': 'green'},
    ],
    'Tools': [
        {'name': 'Git', 'slug': 'git', 'description': 'Git version control', 'color': 'orange'},
        {'name': 'VS Code', 'slug': 'vscode', 'description': 'Visual Studio Code', 'color': 'blue'},
        {'name': 'Linux', 'slug': 'linux', 'description': 'Linux operating system', 'color': 'yellow'},
        {'name': 'Testing', 'slug': 'testing', 'description': 'Software testing', 'color': 'green'},
        {'name': 'Security', 'slug': 'security', 'description': 'Security and cybersecurity', 'color': 'red'},
        {'name': 'Performance', 'slug': 'performance', 'description': 'Performance optimization', 'color': 'yellow'},
        {'name': 'Accessibility', 'slug': 'accessibility', 'description': 'Web accessibility', 'color': 'blue'},
    ],
    'Topics': [
        {'name': 'Full Stack', 'slug': 'fullstack', 'description': 'Full stack development', 'color': 'purple'},
        {'name': 'Microservices', 'slug': 'microservices', 'description': 'Microservices architecture', 'color': 'blue'},
        {'name': 'Serverless', 'slug': 'serverless', 'description': 'Serverless computing', 'color': 'orange'},
        {'name': 'UI/UX', 'slug': 'uiux', 'description': 'User interface and experience', 'color': 'pink'},
        {'name': 'Data Science', 'slug': 'data-science', 'description': 'Data science and analytics', 'color': 'blue'},
    ],
}

def seed_tags():
    """Seed tags into database"""
    print("Seeding tags...")
    
    with get_db() as db:
        # Check if tags already exist
        existing_count = db.query(Tag).count()
        if existing_count > 0:
            print(f"Tags already exist ({existing_count} tags). Skipping seed.")
            return
        
        # Insert tags
        total_tags = 0
        for category, tags in TAG_DEFINITIONS.items():
            print(f"  Adding {category} tags...")
            for tag_data in tags:
                tag = Tag(
                    name=tag_data['name'],
                    slug=tag_data['slug'],
                    description=tag_data['description'],
                    category=category,
                    color=tag_data['color']
                )
                db.add(tag)
                total_tags += 1
        
        db.commit()
        print(f"✓ Successfully seeded {total_tags} tags across {len(TAG_DEFINITIONS)} categories")

if __name__ == '__main__':
    seed_tags()
