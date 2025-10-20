from flask import Blueprint, jsonify, request, current_app, g
from app.core.database import get_db
from app.models.read_history import ReadHistory
from app.schemas.read_history import ReadHistoryCreate
from app.core.auth import require_auth
from app.core.errors import BadRequestError, InternalServerError
from pydantic import ValidationError

bp = Blueprint('read_history', __name__, url_prefix='/api/read-history')

@bp.route('', methods=['POST'])
@require_auth
def mark_as_read():
    """Mark an article as read"""
    try:
        data = request.get_json()
        
        try:
            read_data = ReadHistoryCreate(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            existing = db.query(ReadHistory).filter(
                ReadHistory.user_id == g.user_id,
                ReadHistory.article_url == read_data.article_url
            ).first()
            
            if existing:
                return jsonify(existing.to_dict())
            
            history = ReadHistory(
                user_id=g.user_id,
                article_url=read_data.article_url
            )
            db.add(history)
            db.flush()
            
            return jsonify(history.to_dict()), 201
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error marking as read: {str(e)}')
        raise InternalServerError('Failed to mark as read')

@bp.route('', methods=['GET'])
@require_auth
def get_read_history():
    """Get user's read history"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        with get_db() as db:
            query = db.query(ReadHistory).filter(ReadHistory.user_id == g.user_id)
            query = query.order_by(ReadHistory.read_at.desc())
            
            total = query.count()
            history = query.offset((page - 1) * per_page).limit(per_page).all()
            
            return jsonify({
                'history': [h.to_dict() for h in history],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'pages': (total + per_page - 1) // per_page
                }
            })
    
    except Exception as e:
        current_app.logger.error(f'Error getting read history: {str(e)}')
        raise InternalServerError('Failed to get read history')
