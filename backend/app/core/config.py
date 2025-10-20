import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration loaded from environment variables"""
    
    # Flask settings
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', 'False') == 'True'
    
    # RSS feed URLs as a list
    RSS_FEEDS = [
        url.strip() 
        for url in os.getenv('RSS_FEEDS', '').split(',') 
        if url.strip()
    ]
    
    # Scraping target URLs as a list
    SCRAPE_URLS = [
        url.strip() 
        for url in os.getenv('SCRAPE_URLS', '').split(',') 
        if url.strip()
    ]
    
    # Database settings
    DATABASE_URL = os.getenv('DATABASE_URL', '')
    
    # Social media sources
    REDDIT_SUBREDDITS = [
        sub.strip() 
        for sub in os.getenv('REDDIT_SUBREDDITS', '').split(',') 
        if sub.strip()
    ]
    
    YOUTUBE_CHANNELS = [
        channel.strip() 
        for channel in os.getenv('YOUTUBE_CHANNELS', '').split(',') 
        if channel.strip()
    ]
    
    # Authentication settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', '24'))
    
    # Google OAuth settings
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5000/api/auth/google/callback')
