"""
Migration: Add performance indexes for read_history and bookmarks

Run this script to add the following indexes:
- idx_history_user_date: Composite index on (user_id, read_at) for read_history
- idx_bookmark_user_date: Composite index on (user_id, saved_at) for bookmarks

Usage:
    uv run python -m app.scripts.migrate_add_indexes
"""

from app.core.database import get_engine
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_migration():
    """Add performance indexes to database"""
    engine = get_engine()
    
    migrations = [
        {
            'name': 'idx_history_user_date',
            'sql': 'CREATE INDEX IF NOT EXISTS idx_history_user_date ON read_history(user_id, read_at DESC);',
            'description': 'Add composite index on read_history(user_id, read_at)'
        },
        {
            'name': 'idx_bookmark_user_date',
            'sql': 'CREATE INDEX IF NOT EXISTS idx_bookmark_user_date ON bookmarks(user_id, saved_at DESC);',
            'description': 'Add composite index on bookmarks(user_id, saved_at)'
        }
    ]
    
    with engine.connect() as conn:
        for migration in migrations:
            try:
                logger.info(f"Running: {migration['description']}")
                conn.execute(text(migration['sql']))
                conn.commit()
                logger.info(f"✓ Successfully created index: {migration['name']}")
            except Exception as e:
                logger.error(f"✗ Error creating index {migration['name']}: {str(e)}")
                raise
    
    logger.info("\n✓ All migrations completed successfully!")


if __name__ == '__main__':
    logger.info("Starting database migration: Add performance indexes")
    run_migration()
