"""Tag management routes"""
from flask import Blueprint, jsonify, request, current_app, g
from app.core.database import get_db
from app.core.auth import require_auth
from app.core.errors import BadRequestError, InternalServerError
from app.models.tag import Tag
from app.models.user_tag import UserTag
from app.models.preferences import UserFeedPreferences
from app.schemas.onboarding import UpdateTagsRequest
from pydantic import ValidationError
from collections import defaultdict

bp = Blueprint('tags', __name__, url_prefix='/api/tags')

@bp.route('', methods=['GET'])
def get_all_tags():
    """Get all available tags grouped by category"""
    try:
        with get_db() as db:
            tags = db.query(Tag).order_by(Tag.category, Tag.name).all()
            
            # Group by category
            tags_by_category = defaultdict(list)
            for tag in tags:
                tags_by_category[tag.category].append(tag.to_dict())
            
            # Convert to list format
            result = [
                {
                    'category': category,
                    'tags': tag_list
                }
                for category, tag_list in tags_by_category.items()
            ]
            
            return jsonify({'categories': result, 'total': len(tags)})
    
    except Exception as e:
        current_app.logger.error(f'Error fetching tags: {str(e)}')
        raise InternalServerError('Failed to fetch tags')

@bp.route('/popular', methods=['GET'])
def get_popular_tags():
    """Get most popular tags (most selected by users)"""
    try:
        limit = request.args.get('limit', 20, type=int)
        
        with get_db() as db:
            # Count tag usage
            from sqlalchemy import func
            popular = db.query(
                Tag,
                func.count(UserTag.id).label('user_count')
            ).join(
                UserTag, Tag.id == UserTag.tag_id
            ).group_by(
                Tag.id
            ).order_by(
                func.count(UserTag.id).desc()
            ).limit(limit).all()
            
            result = [
                {
                    **tag.to_dict(),
                    'user_count': count
                }
                for tag, count in popular
            ]
            
            return jsonify({'tags': result})
    
    except Exception as e:
        current_app.logger.error(f'Error fetching popular tags: {str(e)}')
        raise InternalServerError('Failed to fetch popular tags')

@bp.route('/user', methods=['GET'])
@require_auth
def get_user_tags():
    """Get current user's selected tags"""
    try:
        user_id = g.user_id
        
        with get_db() as db:
            # Get user tags
            user_tags = db.query(Tag).join(
                UserTag, Tag.id == UserTag.tag_id
            ).filter(
                UserTag.user_id == user_id
            ).order_by(Tag.category, Tag.name).all()
            
            # Group by category
            tags_by_category = defaultdict(list)
            for tag in user_tags:
                tags_by_category[tag.category].append(tag.to_dict())
            
            result = [
                {
                    'category': category,
                    'tags': tag_list
                }
                for category, tag_list in tags_by_category.items()
            ]
            
            return jsonify({
                'categories': result,
                'total': len(user_tags),
                'tag_ids': [tag.id for tag in user_tags]
            })
    
    except Exception as e:
        current_app.logger.error(f'Error fetching user tags: {str(e)}')
        raise InternalServerError('Failed to fetch user tags')

@bp.route('/user', methods=['PUT'])
@require_auth
def update_user_tags():
    """Update user's selected tags"""
    try:
        data = request.get_json()
        user_id = g.user_id
        
        # Validate request
        try:
            update_data = UpdateTagsRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            # Verify all tag IDs exist
            existing_tags = db.query(Tag).filter(Tag.id.in_(update_data.tag_ids)).all()
            if len(existing_tags) != len(update_data.tag_ids):
                raise BadRequestError('One or more invalid tag IDs')
            
            # Update preferences
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if preferences:
                preferences.selected_tags = update_data.tag_ids
            
            # Remove existing user_tag relationships
            db.query(UserTag).filter(UserTag.user_id == user_id).delete()
            
            # Add new relationships
            for tag_id in update_data.tag_ids:
                user_tag = UserTag(user_id=user_id, tag_id=tag_id)
                db.add(user_tag)
            
            db.flush()
            
            current_app.logger.info(f'User {user_id} updated tags: {len(update_data.tag_ids)} tags')
            
            return jsonify({
                'message': 'Tags updated successfully',
                'tag_ids': update_data.tag_ids,
                'count': len(update_data.tag_ids)
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error updating user tags: {str(e)}')
        raise InternalServerError('Failed to update tags')

@bp.route('/search', methods=['GET'])
def search_tags():
    """Search tags by name or description"""
    try:
        query = request.args.get('q', '').strip()
        if not query or len(query) < 2:
            raise BadRequestError('Search query must be at least 2 characters')
        
        with get_db() as db:
            tags = db.query(Tag).filter(
                (Tag.name.ilike(f'%{query}%')) |
                (Tag.description.ilike(f'%{query}%'))
            ).order_by(Tag.name).limit(20).all()
            
            return jsonify({
                'tags': [tag.to_dict() for tag in tags],
                'count': len(tags)
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error searching tags: {str(e)}')
        raise InternalServerError('Failed to search tags')
