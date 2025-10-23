"""Add metadata columns to read_history table"""
from app.core.database import get_engine
from sqlalchemy import text

def migrate():
    engine = get_engine()
    with engine.connect() as conn:
        # Add new columns
        conn.execute(text("""
            ALTER TABLE read_history 
            ADD COLUMN IF NOT EXISTS article_title VARCHAR,
            ADD COLUMN IF NOT EXISTS article_source VARCHAR,
            ADD COLUMN IF NOT EXISTS article_category VARCHAR
        """))
        conn.commit()
        print("Migration completed: Added metadata columns to read_history")

if __name__ == '__main__':
    migrate()
