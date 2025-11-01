from flask import Blueprint, jsonify, request, current_app, g
from app.core.database import get_db
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.schemas.user import PreferencesUpdate, UserProfileUpdate, DeleteAccountRequest, PasswordChangeRequest
from app.core.auth import require_auth
from app.core.errors import BadRequestError, NotFoundError, InternalServerError
from app.services.feed_service import get_personalized_feeds
from app.utils.pagination import paginate
from app.utils.search_filter import search_articles, filter_by_source, filter_by_date_range
from pydantic import ValidationError

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/preferences', methods=['GET'])
@require_auth
def get_user_preferences():
    """Get current user's feed preferences"""
    try:
        user_id = g.user_id
        
        with get_db() as db:
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if not preferences:
                raise NotFoundError('Preferences not found')
            
            return jsonify(preferences.to_dict())
    
    except NotFoundError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error getting preferences: {str(e)}')
        raise InternalServerError('Failed to get preferences')

@bp.route('/preferences', methods=['PUT'])
@require_auth
def update_user_preferences():
    """
    Update current user's feed preferences
    
    Body:
        feed_sources: List of source names (e.g., ['TechCrunch', 'The Verge'])
        feed_types: List of feed types (e.g., ['rss', 'scrape'])
    """
    try:
        user_id = g.user_id
        data = request.get_json()
        
        # Validate with schema
        try:
            pref_data = PreferencesUpdate(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        feed_sources = pref_data.feed_sources
        feed_types = pref_data.feed_types
        
        with get_db() as db:
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if not preferences:
                # Create if doesn't exist
                preferences = UserFeedPreferences(
                    user_id=user_id,
                    feed_sources=feed_sources or [],
                    feed_types=feed_types or []
                )
                db.add(preferences)
            else:
                # Update existing
                if feed_sources is not None:
                    preferences.feed_sources = feed_sources
                if feed_types is not None:
                    preferences.feed_types = feed_types
                if pref_data.show_read_articles is not None:
                    preferences.show_read_articles = pref_data.show_read_articles
                if pref_data.font_size is not None:
                    preferences.font_size = pref_data.font_size
                if pref_data.view_mode is not None:
                    preferences.view_mode = pref_data.view_mode
                if pref_data.content_preference is not None:
                    preferences.content_preference = pref_data.content_preference
            
            db.flush()
            
            current_app.logger.info(f'Updated preferences for user: {user_id}')
            
            return jsonify(preferences.to_dict())
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error updating preferences: {str(e)}')
        raise InternalServerError('Failed to update preferences')

@bp.route('/feeds', methods=['GET'])
@require_auth
def get_user_personalized_feeds():
    """
    Get personalized feed based on current user's preferences
    
    Query Parameters:
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
        search: Search keyword (optional)
        source_name: Filter by source name (optional)
        start_date: Filter by start date (optional)
        end_date: Filter by end date (optional)
    """
    try:
        user_id = g.user_id
        
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search_keyword = request.args.get('search')
        source_name = request.args.get('source_name')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        category = request.args.get('category')
        
        with get_db() as db:
            # Get user preferences
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if not preferences:
                raise NotFoundError('User preferences not found')
            
            current_app.logger.info(f'Fetching personalized feeds for user: {user_id}')
            
            # Get personalized feeds from service layer with tag-based filtering
            articles = get_personalized_feeds(preferences, user_id=user_id)
            
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
            
            # Apply pagination
            paginated_data = paginate(articles, page, per_page)
            
            current_app.logger.info(f'Returning {len(paginated_data["items"])} personalized articles for user: {user_id}')
            
            return jsonify({
                'articles': paginated_data['items'],
                'pagination': paginated_data['pagination'],
                'preferences': {
                    'feed_sources': preferences.feed_sources,
                    'feed_types': preferences.feed_types
                },
                'filters': {
                    'search': search_keyword,
                    'source_name': source_name,
                    'start_date': start_date,
                    'end_date': end_date,
                    'category': category
                }
            })
    
    except NotFoundError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error fetching personalized feeds: {str(e)}')
        raise InternalServerError('Failed to fetch personalized feeds')

@bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    """
    Update current user's profile (name only)
    
    Body:
        name: User's name
    """
    try:
        user_id = g.user_id
        data = request.get_json()
        
        try:
            profile_data = UserProfileUpdate(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                raise NotFoundError('User not found')
            
            if profile_data.name is not None:
                user.name = profile_data.name
            
            db.flush()
            
            current_app.logger.info(f'Profile updated for user: {user_id}')
            
            return jsonify(user.to_dict())
    
    except (BadRequestError, NotFoundError):
        raise
    except Exception as e:
        current_app.logger.error(f'Error updating profile: {str(e)}')
        raise InternalServerError('Failed to update profile')

@bp.route('/password', methods=['PUT'])
@require_auth
def change_password():
    """
    Change current user's password
    
    Body:
        current_password: Current password
        new_password: New password (min 8 characters)
    """
    try:
        user_id = g.user_id
        data = request.get_json()
        
        try:
            password_data = PasswordChangeRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                raise NotFoundError('User not found')
            
            if not user.password_hash:
                raise BadRequestError('Cannot change password for Google OAuth users')
            
            if not user.check_password(password_data.current_password):
                raise BadRequestError('Current password is incorrect')
            
            user.set_password(password_data.new_password)
            db.flush()
            
            current_app.logger.info(f'Password changed for user: {user_id}')
            
            return jsonify({'message': 'Password changed successfully'})
    
    except (BadRequestError, NotFoundError):
        raise
    except Exception as e:
        current_app.logger.error(f'Error changing password: {str(e)}')
        raise InternalServerError('Failed to change password')

@bp.route('/account', methods=['DELETE'])
@require_auth
def delete_account():
    """
    Delete current user's account
    
    Body:
        password: User password for confirmation (required for non-Google users)
    """
    try:
        user_id = g.user_id
        data = request.get_json() or {}
        
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                raise NotFoundError('User not found')
            
            # Verify password if user has one (not Google OAuth)
            if user.password_hash:
                if not data.get('password'):
                    raise BadRequestError('Password required for account deletion')
                
                try:
                    delete_data = DeleteAccountRequest(**data)
                except ValidationError as e:
                    raise BadRequestError(str(e))
                
                if not user.check_password(delete_data.password):
                    raise BadRequestError('Invalid password')
            
            # Delete preferences first
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            if preferences:
                db.delete(preferences)
            
            # Delete user (cascade will delete refresh tokens)
            db.delete(user)
            db.flush()
            
            current_app.logger.info(f'Account deleted for user: {user.email}')
            
            return jsonify({'message': 'Account deleted successfully'})
    
    except (BadRequestError, NotFoundError):
        raise
    except Exception as e:
        current_app.logger.error(f'Error deleting account: {str(e)}')
        raise InternalServerError('Failed to delete account')
