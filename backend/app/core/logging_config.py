import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging(app):
    """Configure logging for the application"""
    
    # Set logging level
    if app.config['DEBUG']:
        log_level = logging.DEBUG
    else:
        log_level = logging.INFO
    
    app.logger.setLevel(log_level)
    
    # Skip file logging in production (read-only filesystem)
    if os.environ.get('FLASK_ENV') == 'production':
        app.logger.info('Content Hub API started (production mode)')
        return
    
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.mkdir('logs')
    
    # File handler - rotating log files
    file_handler = RotatingFileHandler(
        'logs/content_hub.log',
        maxBytes=10240000,  # 10MB
        backupCount=10
    )
    file_handler.setLevel(log_level)
    
    # Log format
    formatter = logging.Formatter(
        '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
    )
    file_handler.setFormatter(formatter)
    
    # Add handler to app logger
    app.logger.addHandler(file_handler)
    
    app.logger.info('Content Hub API started')
