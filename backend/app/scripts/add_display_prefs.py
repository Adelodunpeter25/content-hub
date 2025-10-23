"""Migration script to add display preferences to user_feed_preferences table"""
from sqlalchemy import text
from app.core.database import get_db

def migrate():
    with get_db() as db:
        db.execute(text("""
            ALTER TABLE user_feed_preferences 
            ADD COLUMN IF NOT EXISTS font_size VARCHAR(10) DEFAULT 'medium',
            ADD COLUMN IF NOT EXISTS view_mode VARCHAR(15) DEFAULT 'comfortable'
        """))
        db.commit()
        print("✓ Added font_size and view_mode columns to user_feed_preferences")

if __name__ == '__main__':
    migrate()
