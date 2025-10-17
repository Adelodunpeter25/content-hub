from flask import Blueprint, jsonify, request, current_app
from app.utils.rss_parser import fetch_rss_feeds
from app.utils.scraper import scrape_websites
from app.utils.feed_aggregator import aggregate_feeds
from app.core.errors import InternalServerError

# Create blueprint for unified feeds
bp = Blueprint('feeds', __name__, url_prefix='/api')

@bp.route('/feeds', methods=['GET'])
def get_unified_feeds():
    """
    Endpoint to get unified feed from all sources
    
    Query Parameters:
        source: Filter by 'rss' or 'scrape' (optional)
        limit: Maximum number of articles (optional)
        
    Returns:
        JSON array of aggregated articles
    """
    try:
        # Get query parameters
        source_filter = request.args.get('source')
        limit = request.args.get('limit', type=int)
        
        current_app.logger.info(f'Fetching unified feeds (source={source_filter}, limit={limit})')
        
        # Fetch RSS feeds
        rss_urls = current_app.config['RSS_FEEDS']
        rss_articles = fetch_rss_feeds(rss_urls) if rss_urls else []
        
        # Scrape websites
        scrape_urls = current_app.config['SCRAPE_URLS']
        scraped_articles = scrape_websites(scrape_urls) if scrape_urls else []
        
        # Aggregate all feeds
        articles = aggregate_feeds(rss_articles, scraped_articles, source_filter, limit)
        
        current_app.logger.info(f'Successfully aggregated {len(articles)} articles')
        
        return jsonify({
            'count': len(articles),
            'filters': {
                'source': source_filter,
                'limit': limit
            },
            'articles': articles
        })
        
    except Exception as e:
        current_app.logger.error(f'Error fetching unified feeds: {str(e)}')
        raise InternalServerError('Failed to fetch unified feeds')
