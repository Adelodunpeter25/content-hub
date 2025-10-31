from flask import Blueprint, jsonify, request, current_app, g
from app.services.feed_service import get_all_feeds
from app.utils.pagination import paginate
from app.utils.search_filter import search_articles, filter_by_source, filter_by_date_range
from app.core.errors import InternalServerError
from app.core.auth import require_auth
from app.core.database import get_db
from app.models.preferences import UserFeedPreferences
from app.models.read_history import ReadHistory

# Create blueprint for unified feeds
bp = Blueprint('feeds', __name__, url_prefix='/api')

@bp.route('/feeds', methods=['GET'])
def get_unified_feeds():
    """
    Endpoint to get unified feed from all sources
    
    Query Parameters:
        source: Filter by 'rss' or 'scrape' (optional)
        limit: Maximum number of articles (optional, deprecated - use pagination)
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
        search: Search keyword in title/summary (optional)
        source_name: Filter by source name (e.g., 'TechCrunch') (optional)
        start_date: Filter by start date (ISO format) (optional)
        end_date: Filter by end date (ISO format) (optional)
        
    Returns:
        JSON array of aggregated articles with pagination and filters
    """
    try:
        # Get query parameters
        source_filter = request.args.get('source')
        limit = request.args.get('limit', type=int)
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # Search and filter parameters
        search_keyword = request.args.get('search')
        source_name = request.args.get('source_name')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        category = request.args.get('category')
        
        current_app.logger.info(f'Fetching unified feeds (source={source_filter}, search={search_keyword}, page={page})')
        
        # Get feeds from service layer with quality scoring
        articles = get_all_feeds(source_filter, limit, apply_quality_filter=True, min_quality_score=0.4)
        
        # Apply search
        if search_keyword:
            articles = search_articles(articles, search_keyword)
        
        # Apply source name filter
        if source_name:
            articles = filter_by_source(articles, source_name)
        
        # Apply date range filter
        if start_date or end_date:
            articles = filter_by_date_range(articles, start_date, end_date)
        
        # Apply category filter
        if category:
            articles = [a for a in articles if category in a.get('categories', [])]
        
        # Filter read articles based on user preference (only if authenticated)
        user_id = g.get('user_id')
        if user_id:
            with get_db() as db:
                preferences = db.query(UserFeedPreferences).filter(
                    UserFeedPreferences.user_id == user_id
                ).first()
                
                if preferences and not preferences.show_read_articles:
                    read_urls = {h.article_url for h in db.query(ReadHistory).filter(
                        ReadHistory.user_id == user_id
                    ).all()}
                    articles = [a for a in articles if a.get('link') not in read_urls]
        
        # Apply pagination
        paginated_data = paginate(articles, page, per_page)
        
        current_app.logger.info(f'Successfully aggregated {len(articles)} articles, returning page {page}')
        
        return jsonify({
            'articles': paginated_data['items'],
            'pagination': paginated_data['pagination'],
            'filters': {
                'source': source_filter,
                'search': search_keyword,
                'source_name': source_name,
                'start_date': start_date,
                'end_date': end_date,
                'category': category
            }
        })
        
    except Exception as e:
        current_app.logger.error(f'Error fetching unified feeds: {str(e)}')
        raise InternalServerError('Failed to fetch unified feeds')
