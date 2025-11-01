"""Onboarding routes"""
from flask import Blueprint, jsonify, request, current_app, g
from app.core.database import get_db
from app.core.auth import require_auth
from app.core.errors import BadRequestError, InternalServerError
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.models.user_tag import UserTag
from app.schemas.onboarding import OnboardingCompleteRequest
from app.utils.feed_templates import get_all_templates, map_template_to_tag_ids
from pydantic import ValidationError

bp = Blueprint('onboarding', __name__, url_prefix='/api/onboarding')

@bp.route('/templates', methods=['GET'])
def get_templates():
    """Get all available feed templates"""
    try:
        templates = get_all_templates()
        return jsonify({'templates': templates})
    except Exception as e:
        current_app.logger.error(f'Error fetching templates: {str(e)}')
        raise InternalServerError('Failed to fetch templates')

@bp.route('/complete', methods=['POST'])
@require_auth
def complete_onboarding():
    """Complete onboarding process"""
    try:
        data = request.get_json()
        user_id = g.user_id
        
        # Validate request
        try:
            onboarding_data = OnboardingCompleteRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise BadRequestError('User not found')
            
            # Get or create preferences
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if not preferences:
                preferences = UserFeedPreferences(user_id=user_id)
                db.add(preferences)
                db.flush()
            
            # If template selected, add template tags
            tag_ids = onboarding_data.tag_ids
            if onboarding_data.template and onboarding_data.template != 'custom':
                template_tag_ids = map_template_to_tag_ids(onboarding_data.template, db)
                # Merge with user-selected tags
                tag_ids = list(set(tag_ids + template_tag_ids))
            
            # Update preferences
            preferences.selected_tags = tag_ids
            preferences.feed_template = onboarding_data.template or 'custom'
            preferences.content_preference = onboarding_data.content_preference or 'tech'
            
            # If custom sources provided, update feed_sources
            if onboarding_data.source_names:
                preferences.feed_sources = onboarding_data.source_names
            
            # Create user_tag relationships
            # First, remove existing tags
            db.query(UserTag).filter(UserTag.user_id == user_id).delete()
            
            # Add new tags
            for tag_id in tag_ids:
                user_tag = UserTag(user_id=user_id, tag_id=tag_id)
                db.add(user_tag)
            
            # Mark onboarding as completed
            user.onboarding_completed = True
            
            db.flush()
            
            current_app.logger.info(f'User {user_id} completed onboarding with {len(tag_ids)} tags')
            
            return jsonify({
                'message': 'Onboarding completed successfully',
                'preferences': preferences.to_dict(),
                'tag_count': len(tag_ids)
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error completing onboarding: {str(e)}')
        raise InternalServerError('Failed to complete onboarding')

@bp.route('/skip', methods=['POST'])
@require_auth
def skip_onboarding():
    """Skip onboarding and set minimal defaults"""
    try:
        user_id = g.user_id
        
        with get_db() as db:
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise BadRequestError('User not found')
            
            # Mark onboarding as completed
            user.onboarding_completed = True
            
            # Ensure preferences exist
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if not preferences:
                preferences = UserFeedPreferences(user_id=user_id)
                db.add(preferences)
            
            db.flush()
            
            current_app.logger.info(f'User {user_id} skipped onboarding')
            
            return jsonify({
                'message': 'Onboarding skipped',
                'preferences': preferences.to_dict()
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error skipping onboarding: {str(e)}')
        raise InternalServerError('Failed to skip onboarding')
