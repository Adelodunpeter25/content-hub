from flask import Blueprint, jsonify, request, current_app, g
from app.services.recommendation_service import get_recommendations
from app.core.auth import require_auth
from app.core.errors import InternalServerError
from app.utils.pagination import paginate

bp = Blueprint('recommendations', __name__, url_prefix='/api')

@bp.route('/recommendations', methods=['GET'])
@require_auth
def get_user_recommendations():
    """
    Get personalized article recommendations
    
    Query Parameters:
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
    """
    try:
        user_id = g.user_id
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        current_app.logger.info(f'Getting recommendations for user: {user_id}')
        
        # Get recommendations
        articles = get_recommendations(user_id, limit=100)
        
        # Apply pagination
        paginated_data = paginate(articles, page, per_page)
        
        return jsonify({
            'articles': paginated_data['items'],
            'pagination': paginated_data['pagination']
        })
    
    except Exception as e:
        current_app.logger.error(f'Error getting recommendations: {str(e)}')
        raise InternalServerError('Failed to get recommendations')
