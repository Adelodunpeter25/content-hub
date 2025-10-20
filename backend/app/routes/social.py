from flask import Blueprint, jsonify, request, current_app
from app.utils.social_scrapers import scrape_social_media
from app.utils.pagination import paginate
from app.utils.search_filter import search_articles
from app.core.errors import BadRequestError, InternalServerError

bp = Blueprint('social', __name__, url_prefix='/api')

@bp.route('/social', methods=['GET'])
def get_social_content():
    """
    Endpoint to get social media content
    
    Query Parameters:
        platform: Filter by platform ('reddit', 'youtube') (optional)
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
        search: Search keyword (optional)
    
    Returns:
        JSON array of social media posts with pagination
    """
    try:
        # Get query parameters
        platform = request.args.get('platform')
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search_keyword = request.args.get('search')
        
        current_app.logger.info(f'Fetching social media content (platform={platform})')
        
        # Get configured sources
        reddit_subs = current_app.config['REDDIT_SUBREDDITS']
        youtube_channels = current_app.config['YOUTUBE_CHANNELS']
        
        # Filter by platform
        if platform == 'reddit':
            youtube_channels = None
        elif platform == 'youtube':
            reddit_subs = None
        
        if not reddit_subs and not youtube_channels:
            raise BadRequestError('No social media sources configured')
        
        # Scrape social media
        articles = scrape_social_media(reddit_subs, youtube_channels)
        
        # Apply search
        if search_keyword:
            articles = search_articles(articles, search_keyword)
        
        # Apply pagination
        paginated_data = paginate(articles, page, per_page)
        
        current_app.logger.info(f'Successfully fetched {len(articles)} social media posts')
        
        return jsonify({
            'articles': paginated_data['items'],
            'pagination': paginated_data['pagination'],
            'filters': {
                'platform': platform,
                'search': search_keyword
            }
        })
        
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error fetching social media content: {str(e)}')
        raise InternalServerError('Failed to fetch social media content')
