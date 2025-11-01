#!/usr/bin/env python3
"""
Migration script to add content_preference column to user_feed_preferences table
"""
import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, backend_dir)

from sqlalchemy import text
from app.core.database import get_db

def add_content_preference_column():
    """Add content_preference column with default value 'tech'"""
    try:
        with get_db() as db:
            # Check if column already exists
            result = db.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'user_feed_preferences' 
                AND column_name = 'content_preference'
            """)).fetchone()
            
            if result:
                print("Column 'content_preference' already exists")
                return
            
            # Add the column
            db.execute(text("""
                ALTER TABLE user_feed_preferences 
                ADD COLUMN content_preference VARCHAR(10) DEFAULT 'tech'
            """))
            
            # Update existing records to have 'tech' as default
            db.execute(text("""
                UPDATE user_feed_preferences 
                SET content_preference = 'tech' 
                WHERE content_preference IS NULL
            """))
            
            db.commit()
            print("Successfully added content_preference column")
            
    except Exception as e:
        print(f"Error adding content_preference column: {e}")
        raise

if __name__ == "__main__":
    add_content_preference_column()
