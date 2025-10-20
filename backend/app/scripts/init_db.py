"""
Initialize database tables

Run this script to create all tables in Supabase:
    python init_db.py
"""

from app.core.database import create_tables

def main():
    print("Creating database tables...")
    
    try:
        create_tables()
        print("✓ Tables created successfully!")
        print("\nCreated tables:")
        print("  - users")
        print("  - user_feed_preferences")
    except Exception as e:
        print(f"✗ Error creating tables: {str(e)}")
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main())
