from flask import Blueprint, jsonify, current_app, g
from app.services.stats_service import get_reading_stats
from app.core.auth import require_auth
from app.core.errors import InternalServerError

bp = Blueprint('stats', __name__, url_prefix='/api')

@bp.route('/stats', methods=['GET'])
@require_auth
def get_user_stats():
    """
    Get user reading statistics
    
    Returns:
        - Articles read (today, week, month, total)
        - Total bookmarks
        - Favorite categories (top 5)
        - Favorite sources (top 5)
        - Reading streak (consecutive days)
    """
    try:
        user_id = g.user_id
        
        current_app.logger.info(f'Getting stats for user: {user_id}')
        
        stats = get_reading_stats(user_id)
        
        return jsonify(stats)
    
    except Exception as e:
        current_app.logger.error(f'Error getting stats: {str(e)}')
        raise InternalServerError('Failed to get stats')
