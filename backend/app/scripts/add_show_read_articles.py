"""Migration script to add show_read_articles column to user_feed_preferences table"""
from sqlalchemy import text
from app.core.database import get_db

def migrate():
    with get_db() as db:
        # Add show_read_articles column with default True
        db.execute(text("""
            ALTER TABLE user_feed_preferences 
            ADD COLUMN IF NOT EXISTS show_read_articles BOOLEAN DEFAULT TRUE
        """))
        db.commit()
        print("✓ Added show_read_articles column to user_feed_preferences")

if __name__ == '__main__':
    migrate()
