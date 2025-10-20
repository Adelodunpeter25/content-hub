"""
Initialize database tables

Run this script to create all tables in Supabase:
    python init_db.py
"""

from app.core.database import create_tables
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.models.refresh_token import RefreshToken
from app.models.bookmark import Bookmark
from app.models.read_history import ReadHistory

def main():
    print("Creating database tables...")
    
    try:
        create_tables()
        print("✓ Tables created successfully!")
        print("\nCreated tables:")
        print("  - users")
        print("  - user_feed_preferences")
        print("  - refresh_tokens")
        print("  - bookmarks")
        print("  - read_history")
    except Exception as e:
        print(f"✗ Error creating tables: {str(e)}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main())
