"""Migration script for onboarding and quality features"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from sqlalchemy import text
from app.core.database import get_db

def run_migration():
    """Run database migration for new features"""
    print("Starting migration for onboarding and quality features...")
    
    with get_db() as db:
        try:
            # Add onboarding_completed column to users table
            print("  Adding onboarding_completed to users...")
            try:
                db.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL
                """))
                db.commit()
                print("  ✓ Added onboarding_completed column")
            except Exception as e:
                print(f"  ⚠ onboarding_completed column may already exist: {e}")
                db.rollback()
            
            # Add selected_tags and feed_template to user_feed_preferences
            print("  Adding selected_tags and feed_template to preferences...")
            try:
                db.execute(text("""
                    ALTER TABLE user_feed_preferences 
                    ADD COLUMN IF NOT EXISTS selected_tags INTEGER[] DEFAULT ARRAY[]::INTEGER[]
                """))
                db.execute(text("""
                    ALTER TABLE user_feed_preferences 
                    ADD COLUMN IF NOT EXISTS feed_template VARCHAR(20) DEFAULT 'custom'
                """))
                db.commit()
                print("  ✓ Added preference columns")
            except Exception as e:
                print(f"  ⚠ Preference columns may already exist: {e}")
                db.rollback()
            
            # Create tags table
            print("  Creating tags table...")
            try:
                db.execute(text("""
                    CREATE TABLE IF NOT EXISTS tags (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(50) UNIQUE NOT NULL,
                        slug VARCHAR(50) UNIQUE NOT NULL,
                        description VARCHAR(200),
                        category VARCHAR(50) NOT NULL,
                        color VARCHAR(20) DEFAULT 'gray',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_tag_category ON tags(category)"))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_tag_name ON tags(name)"))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_tag_slug ON tags(slug)"))
                db.commit()
                print("  ✓ Created tags table")
            except Exception as e:
                print(f"  ⚠ Tags table may already exist: {e}")
                db.rollback()
            
            # Create user_tags table
            print("  Creating user_tags table...")
            try:
                db.execute(text("""
                    CREATE TABLE IF NOT EXISTS user_tags (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT uq_user_tag UNIQUE (user_id, tag_id)
                    )
                """))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_user_tags_user ON user_tags(user_id)"))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_user_tags_tag ON user_tags(tag_id)"))
                db.commit()
                print("  ✓ Created user_tags table")
            except Exception as e:
                print(f"  ⚠ User_tags table may already exist: {e}")
                db.rollback()
            
            # Create sources table
            print("  Creating sources table...")
            try:
                db.execute(text("""
                    CREATE TABLE IF NOT EXISTS sources (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) UNIQUE NOT NULL,
                        url VARCHAR(500) NOT NULL,
                        type VARCHAR(20) NOT NULL,
                        category VARCHAR(50),
                        tags VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
                        quality_tier VARCHAR(20) DEFAULT 'standard',
                        is_active BOOLEAN DEFAULT TRUE,
                        last_fetched_at TIMESTAMP WITH TIME ZONE,
                        fetch_frequency INTEGER DEFAULT 900,
                        error_count INTEGER DEFAULT 0,
                        success_count INTEGER DEFAULT 0,
                        success_rate FLOAT DEFAULT 1.0,
                        avg_fetch_time FLOAT DEFAULT 0.0,
                        description VARCHAR(500),
                        added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_source_name ON sources(name)"))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_source_active ON sources(is_active)"))
                db.commit()
                print("  ✓ Created sources table")
            except Exception as e:
                print(f"  ⚠ Sources table may already exist: {e}")
                db.rollback()
            
            # Create article_feedback table
            print("  Creating article_feedback table...")
            try:
                db.execute(text("""
                    CREATE TABLE IF NOT EXISTS article_feedback (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        article_url VARCHAR NOT NULL,
                        feedback_type VARCHAR(20) NOT NULL,
                        reason VARCHAR(200),
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_feedback_user_article ON article_feedback(user_id, article_url)"))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_feedback_user ON article_feedback(user_id)"))
                db.execute(text("CREATE INDEX IF NOT EXISTS idx_feedback_article ON article_feedback(article_url)"))
                db.commit()
                print("  ✓ Created article_feedback table")
            except Exception as e:
                print(f"  ⚠ Article_feedback table may already exist: {e}")
                db.rollback()
            
            print("\n✓ Migration completed successfully!")
            print("\nNext steps:")
            print("  1. Run: python -m app.scripts.seed_tags")
            print("  2. Run: python -m app.scripts.seed_sources")
            
        except Exception as e:
            print(f"\n✗ Migration failed: {e}")
            db.rollback()
            raise

if __name__ == '__main__':
    run_migration()
