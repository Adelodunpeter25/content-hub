from flask import Blueprint, jsonify, current_app
from app.utils.rss_parser import fetch_rss_feeds
from app.core.errors import BadRequestError, InternalServerError

# Create blueprint for RSS routes
bp = Blueprint('rss', __name__, url_prefix='/api')

@bp.route('/rss', methods=['GET'])
def get_rss_feeds():
    """
    Endpoint to fetch all RSS feeds
    
    Returns:
        JSON array of articles from RSS feeds
    """
    try:
        # Get RSS feed URLs from config
        feed_urls = current_app.config['RSS_FEEDS']
        
        if not feed_urls:
            current_app.logger.warning('No RSS feeds configured')
            raise BadRequestError('No RSS feeds configured')
        
        current_app.logger.info(f'Fetching {len(feed_urls)} RSS feeds')
        
        # Fetch and parse feeds
        articles = fetch_rss_feeds(feed_urls)
        
        current_app.logger.info(f'Successfully fetched {len(articles)} articles from RSS feeds')
        
        return jsonify({
            'count': len(articles),
            'articles': articles
        })
        
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error fetching RSS feeds: {str(e)}')
        raise InternalServerError('Failed to fetch RSS feeds')
