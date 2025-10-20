from flask import Blueprint, jsonify, request, current_app
from app.services.trending_service import get_trending_articles
from app.core.errors import InternalServerError
from app.utils.pagination import paginate

bp = Blueprint('trending', __name__, url_prefix='/api')

@bp.route('/trending', methods=['GET'])
def get_trending():
    """
    Get trending articles
    
    Query Parameters:
        days: Number of days to look back (default: 7)
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
    """
    try:
        days = request.args.get('days', 7, type=int)
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        current_app.logger.info(f'Getting trending articles (last {days} days)')
        
        # Get trending articles
        articles = get_trending_articles(days=days, limit=100)
        
        # Apply pagination
        paginated_data = paginate(articles, page, per_page)
        
        return jsonify({
            'articles': paginated_data['items'],
            'pagination': paginated_data['pagination'],
            'period_days': days
        })
    
    except Exception as e:
        current_app.logger.error(f'Error getting trending articles: {str(e)}')
        raise InternalServerError('Failed to get trending articles')
