from flask import Blueprint, jsonify, request, current_app
from app.core.database import get_db
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.schemas.user import UserCreate, UserResponse, PreferencesUpdate, PreferencesResponse
from app.core.errors import BadRequestError, NotFoundError, InternalServerError
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('', methods=['POST'])
def create_user():
    """
    Create a new user
    
    Body:
        email: User email (required)
        name: User name (optional)
    """
    try:
        data = request.get_json()
        
        # Validate with schema
        try:
            user_data = UserCreate(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        email = user_data.email
        name = user_data.name
        
        with get_db() as db:
            # Check if user exists
            existing_user = db.query(User).filter(User.email == email).first()
            if existing_user:
                raise BadRequestError('User with this email already exists')
            
            # Create user
            user = User(email=email, name=name)
            db.add(user)
            db.flush()
            
            # Create default preferences
            preferences = UserFeedPreferences(user_id=user.id)
            db.add(preferences)
            
            current_app.logger.info(f'Created user: {email}')
            
            return jsonify(user.to_dict()), 201
    
    except BadRequestError:
        raise
    except IntegrityError:
        raise BadRequestError('User with this email already exists')
    except Exception as e:
        current_app.logger.error(f'Error creating user: {str(e)}')
        raise InternalServerError('Failed to create user')

@bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    try:
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                raise NotFoundError('User not found')
            
            return jsonify(user.to_dict())
    
    except NotFoundError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error getting user: {str(e)}')
        raise InternalServerError('Failed to get user')

@bp.route('/<user_id>/preferences', methods=['GET'])
def get_user_preferences(user_id):
    """Get user feed preferences"""
    try:
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError('User not found')
            
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

@bp.route('/<user_id>/preferences', methods=['PUT'])
def update_user_preferences(user_id):
    """
    Update user feed preferences
    
    Body:
        feed_sources: List of source names (e.g., ['TechCrunch', 'The Verge'])
        feed_types: List of feed types (e.g., ['rss', 'scrape'])
    """
    try:
        data = request.get_json()
        
        # Validate with schema
        try:
            pref_data = PreferencesUpdate(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        feed_sources = pref_data.feed_sources
        feed_types = pref_data.feed_types
        
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError('User not found')
            
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
            
            db.flush()
            
            current_app.logger.info(f'Updated preferences for user: {user_id}')
            
            return jsonify(preferences.to_dict())
    
    except (BadRequestError, NotFoundError):
        raise
    except Exception as e:
        current_app.logger.error(f'Error updating preferences: {str(e)}')
        raise InternalServerError('Failed to update preferences')
