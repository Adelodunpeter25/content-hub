"""Migration script to add last_login_at and last_login_ip columns to users table"""
from sqlalchemy import text
from app.core.database import get_db

def migrate():
    with get_db() as db:
        db.execute(text("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45)
        """))
        db.commit()
        print("✓ Added last_login_at and last_login_ip columns to users")

if __name__ == '__main__':
    migrate()
