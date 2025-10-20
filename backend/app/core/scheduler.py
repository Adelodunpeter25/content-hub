"""Background task scheduler for periodic feed fetching"""
from apscheduler.schedulers.background import BackgroundScheduler
from app.services.feed_service import get_all_feeds
from app.core.config import Config
import logging

logger = logging.getLogger(__name__)
scheduler = None

def fetch_feeds_job():
    """Background job to fetch and cache feeds"""
    try:
        logger.info('Background job: Fetching feeds...')
        articles = get_all_feeds()
        logger.info(f'Background job: Cached {len(articles)} articles')
    except Exception as e:
        logger.error(f'Background job failed: {str(e)}')

def init_scheduler():
    """Initialize and start the background scheduler"""
    global scheduler
    
    if scheduler is not None:
        return scheduler
    
    scheduler = BackgroundScheduler()
    
    # Schedule feed fetching based on CACHE_TTL
    interval_seconds = Config.CACHE_TTL
    scheduler.add_job(
        fetch_feeds_job,
        'interval',
        seconds=interval_seconds,
        id='fetch_feeds',
        replace_existing=True
    )
    
    # Run immediately on startup
    scheduler.add_job(
        fetch_feeds_job,
        'date',
        id='fetch_feeds_startup',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info(f'Scheduler started: fetching feeds every {interval_seconds} seconds')
    
    return scheduler

def shutdown_scheduler():
    """Shutdown the scheduler gracefully"""
    global scheduler
    if scheduler and scheduler.running:
        scheduler.shutdown()
        logger.info('Scheduler stopped')
