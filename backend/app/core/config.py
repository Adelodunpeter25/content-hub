import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration loaded from environment variables"""
    
    # Flask settings
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', 'False') == 'True'
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    
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
    
    # Redis/Valkey settings
    REDIS_URL = os.getenv('REDIS_URL', '')
    CACHE_TTL = int(os.getenv('CACHE_TTL' ''))  # Default 15 minutes
    
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
    
    # Authentication settings (JWT uses same secret as Flask sessions)
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    JWT_ACCESS_TOKEN_MINUTES = int(os.getenv('JWT_ACCESS_TOKEN_MINUTES', '60'))
    JWT_REFRESH_TOKEN_DAYS = int(os.getenv('JWT_REFRESH_TOKEN_DAYS', '30'))
    
    # Email settings (Resend)
    RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
    RESEND_FROM_EMAIL = os.getenv('RESEND_FROM_EMAIL', 'noreply@yourdomain.com')
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    # Google OAuth settings
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5000/api/auth/google/callback')
