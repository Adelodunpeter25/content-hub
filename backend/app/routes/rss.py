from flask import Blueprint, jsonify, current_app
from app.utils.rss_parser import fetch_rss_feeds

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
            return jsonify({'error': 'No RSS feeds configured'}), 400
        
        # Fetch and parse feeds
        articles = fetch_rss_feeds(feed_urls)
        
        return jsonify({
            'count': len(articles),
            'articles': articles
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
