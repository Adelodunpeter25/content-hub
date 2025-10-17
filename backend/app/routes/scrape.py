from flask import Blueprint, jsonify, current_app
from app.utils.scraper import scrape_websites
from app.core.errors import BadRequestError, InternalServerError

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
            current_app.logger.warning('No scraping URLs configured')
            raise BadRequestError('No scraping URLs configured')
        
        current_app.logger.info(f'Scraping {len(scrape_urls)} websites')
        
        # Scrape websites
        articles = scrape_websites(scrape_urls)
        
        current_app.logger.info(f'Successfully scraped {len(articles)} articles')
        
        return jsonify({
            'count': len(articles),
            'articles': articles
        })
        
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error scraping websites: {str(e)}')
        raise InternalServerError('Failed to scrape websites')
