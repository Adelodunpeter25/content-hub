from flask import Blueprint, jsonify, request, current_app, g
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.schemas.bookmark import BookmarkCreate
from app.core.auth import require_auth
from app.core.errors import BadRequestError, NotFoundError, InternalServerError
from pydantic import ValidationError

bp = Blueprint('bookmarks', __name__, url_prefix='/api/bookmarks')

@bp.route('', methods=['POST'])
@require_auth
def create_bookmark():
    """Save an article as bookmark"""
    try:
        data = request.get_json()
        
        try:
            bookmark_data = BookmarkCreate(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            existing = db.query(Bookmark).filter(
                Bookmark.user_id == g.user_id,
                Bookmark.article_url == bookmark_data.article_url
            ).first()
            
            if existing:
                raise BadRequestError('Article already bookmarked')
            
            bookmark = Bookmark(
                user_id=g.user_id,
                article_url=bookmark_data.article_url,
                title=bookmark_data.title,
                source=bookmark_data.source
            )
            db.add(bookmark)
            db.flush()
            
            return jsonify(bookmark.to_dict()), 201
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error creating bookmark: {str(e)}')
        raise InternalServerError('Failed to create bookmark')

@bp.route('', methods=['GET'])
@require_auth
def get_bookmarks():
    """Get user's bookmarks"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        with get_db() as db:
            query = db.query(Bookmark).filter(Bookmark.user_id == g.user_id)
            query = query.order_by(Bookmark.saved_at.desc())
            
            total = query.count()
            bookmarks = query.offset((page - 1) * per_page).limit(per_page).all()
            
            return jsonify({
                'bookmarks': [b.to_dict() for b in bookmarks],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'pages': (total + per_page - 1) // per_page
                }
            })
    
    except Exception as e:
        current_app.logger.error(f'Error getting bookmarks: {str(e)}')
        raise InternalServerError('Failed to get bookmarks')

@bp.route('/<int:bookmark_id>', methods=['DELETE'])
@require_auth
def delete_bookmark(bookmark_id):
    """Delete a bookmark"""
    try:
        with get_db() as db:
            bookmark = db.query(Bookmark).filter(
                Bookmark.id == bookmark_id,
                Bookmark.user_id == g.user_id
            ).first()
            
            if not bookmark:
                raise NotFoundError('Bookmark not found')
            
            db.delete(bookmark)
            db.flush()
            
            return jsonify({'message': 'Bookmark deleted'})
    
    except NotFoundError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error deleting bookmark: {str(e)}')
        raise InternalServerError('Failed to delete bookmark')
