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
