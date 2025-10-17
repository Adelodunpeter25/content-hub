from flask import Blueprint, jsonify, request, current_app
from app.utils.scraper import scrape_websites
from app.utils.pagination import paginate
from app.core.errors import BadRequestError, InternalServerError

# Create blueprint for scraping routes
bp = Blueprint('scrape', __name__, url_prefix='/api')

@bp.route('/scrape', methods=['GET'])
def get_scraped_content():
    """
    Endpoint to scrape websites
    
    Query Parameters:
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
    
    Returns:
        JSON array of scraped articles with pagination
    """
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Get scraping URLs from config
        scrape_urls = current_app.config['SCRAPE_URLS']
        
        if not scrape_urls:
            current_app.logger.warning('No scraping URLs configured')
            raise BadRequestError('No scraping URLs configured')
        
        current_app.logger.info(f'Scraping {len(scrape_urls)} websites')
        
        # Scrape websites
        articles = scrape_websites(scrape_urls)
        
        # Apply pagination
        paginated_data = paginate(articles, page, per_page)
        
        current_app.logger.info(f'Successfully scraped {len(articles)} articles, returning page {page}')
        
        return jsonify({
            'articles': paginated_data['items'],
            'pagination': paginated_data['pagination']
        })
        
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error scraping websites: {str(e)}')
        raise InternalServerError('Failed to scrape websites')
