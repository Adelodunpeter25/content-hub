from flask import Blueprint, jsonify, current_app
from app.utils.scraper import scrape_websites

# Create blueprint for scraping routes
bp = Blueprint('scrape', __name__, url_prefix='/api')

@bp.route('/scrape', methods=['GET'])
def get_scraped_content():
    """
    Endpoint to scrape websites
    
    Returns:
        JSON array of scraped articles
    """
    try:
        # Get scraping URLs from config
        scrape_urls = current_app.config['SCRAPE_URLS']
        
        if not scrape_urls:
            return jsonify({'error': 'No scraping URLs configured'}), 400
        
        # Scrape websites
        articles = scrape_websites(scrape_urls)
        
        return jsonify({
            'count': len(articles),
            'articles': articles
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
