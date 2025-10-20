"""Clean up database by removing all data from tables."""
from app.core.database import get_engine
from sqlalchemy import text

def clean_database():
    """Remove all data from all tables."""
    engine = get_engine()
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM read_history"))
        conn.execute(text("DELETE FROM bookmarks"))
        conn.execute(text("DELETE FROM refresh_tokens"))
        conn.execute(text("DELETE FROM user_feed_preferences"))
        conn.execute(text("DELETE FROM users"))
        conn.commit()
    print("✓ Database cleaned successfully")

if __name__ == "__main__":
    clean_database()
