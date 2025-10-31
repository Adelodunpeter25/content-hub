"""
Initialize database tables

Run this script to create all tables in the database:
    python -m app.scripts.init_db
"""

from app.core.database import create_tables, get_db
from app.models import Tag
import sys

def seed_tags():
    """Seed initial tags if they don't exist"""
    print("\nSeeding tags...")
    
    tags_data = [
        # Programming Languages
        {'name': 'Python', 'slug': 'python', 'category': 'Languages', 'color': 'blue'},
        {'name': 'JavaScript', 'slug': 'javascript', 'category': 'Languages', 'color': 'yellow'},
        {'name': 'TypeScript', 'slug': 'typescript', 'category': 'Languages', 'color': 'blue'},
        {'name': 'Go', 'slug': 'go', 'category': 'Languages', 'color': 'cyan'},
        {'name': 'Rust', 'slug': 'rust', 'category': 'Languages', 'color': 'orange'},
        {'name': 'Java', 'slug': 'java', 'category': 'Languages', 'color': 'red'},
        
        # Frameworks
        {'name': 'React', 'slug': 'react', 'category': 'Frameworks', 'color': 'blue'},
        {'name': 'Vue', 'slug': 'vue', 'category': 'Frameworks', 'color': 'green'},
        {'name': 'Angular', 'slug': 'angular', 'category': 'Frameworks', 'color': 'red'},
        {'name': 'Django', 'slug': 'django', 'category': 'Frameworks', 'color': 'green'},
        {'name': 'Flask', 'slug': 'flask', 'category': 'Frameworks', 'color': 'gray'},
        {'name': 'Node.js', 'slug': 'nodejs', 'category': 'Frameworks', 'color': 'green'},
        
        # Cloud & DevOps
        {'name': 'AWS', 'slug': 'aws', 'category': 'Cloud', 'color': 'orange'},
        {'name': 'Azure', 'slug': 'azure', 'category': 'Cloud', 'color': 'blue'},
        {'name': 'GCP', 'slug': 'gcp', 'category': 'Cloud', 'color': 'blue'},
        {'name': 'Docker', 'slug': 'docker', 'category': 'DevOps', 'color': 'blue'},
        {'name': 'Kubernetes', 'slug': 'kubernetes', 'category': 'DevOps', 'color': 'blue'},
        
        # AI/ML
        {'name': 'Machine Learning', 'slug': 'machine-learning', 'category': 'AI/ML', 'color': 'purple'},
        {'name': 'Deep Learning', 'slug': 'deep-learning', 'category': 'AI/ML', 'color': 'purple'},
        {'name': 'NLP', 'slug': 'nlp', 'category': 'AI/ML', 'color': 'purple'},
        
        # Topics
        {'name': 'Web Development', 'slug': 'web-dev', 'category': 'Topics', 'color': 'blue'},
        {'name': 'Mobile Development', 'slug': 'mobile-dev', 'category': 'Topics', 'color': 'green'},
        {'name': 'Cybersecurity', 'slug': 'cybersecurity', 'category': 'Topics', 'color': 'red'},
        {'name': 'Data Science', 'slug': 'data-science', 'category': 'Topics', 'color': 'purple'},
    ]
    
    try:
        with get_db() as db:
            existing_count = db.query(Tag).count()
            if existing_count > 0:
                print(f"  ✓ Tags already exist ({existing_count} tags)")
                return
            
            for tag_data in tags_data:
                tag = Tag(**tag_data)
                db.add(tag)
            
            db.commit()
            print(f"  ✓ Seeded {len(tags_data)} tags")
    except Exception as e:
        print(f"  ✗ Error seeding tags: {str(e)}")

def main():
    print("Initializing database...")
    print("=" * 50)
    
    try:
        # Create all tables
        print("\n1. Creating database tables...")
        create_tables()
        print("  ✓ Tables created successfully!")
        print("\n  Created tables:")
        print("    - users")
        print("    - user_feed_preferences")
        print("    - refresh_tokens")
        print("    - bookmarks")
        print("    - read_history")
        print("    - tags")
        print("    - user_tags")
        print("    - sources")
        print("    - article_feedback")
        
        # Seed tags
        print("\n2. Seeding initial data...")
        seed_tags()
        
        print("\n" + "=" * 50)
        print("✓ Database initialization complete!")
        print("\nYou can now start the application.")
        
    except Exception as e:
        print(f"\n✗ Error initializing database: {str(e)}")
        print("\nPlease check your DATABASE_URL in .env file")
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
