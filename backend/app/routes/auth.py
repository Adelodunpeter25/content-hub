from flask import Blueprint, jsonify, request, current_app, g, redirect, url_for
from app.core.database import get_db
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.schemas.auth import SignupRequest, LoginRequest
from app.core.auth import generate_token, require_auth, check_needs_onboarding
from app.core.oauth import oauth
from app.core.errors import BadRequestError, NotFoundError, InternalServerError
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/signup', methods=['POST'])
def signup():
    """
    Create a new user account
    
    Body:
        email: User email (required)
        password: Password (required, min 6 characters)
        name: User name (optional)
    """
    try:
        data = request.get_json()
        
        # Validate with schema
        try:
            signup_data = SignupRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            # Check if user exists
            existing_user = db.query(User).filter(User.email == signup_data.email).first()
            if existing_user:
                raise BadRequestError('User with this email already exists')
            
            # Create user
            user = User(email=signup_data.email, name=signup_data.name)
            user.set_password(signup_data.password)
            db.add(user)
            db.flush()
            
            # Create default preferences
            preferences = UserFeedPreferences(user_id=user.id)
            db.add(preferences)
            db.flush()
            
            # Generate token
            token = generate_token(user.id)
            
            # Check if needs onboarding
            needs_onboarding = check_needs_onboarding(user.id, db)
            
            current_app.logger.info(f'User signed up: {signup_data.email}')
            
            return jsonify({
                'token': token,
                'user': user.to_dict(),
                'needs_onboarding': needs_onboarding
            }), 201
    
    except BadRequestError:
        raise
    except IntegrityError:
        raise BadRequestError('User with this email already exists')
    except Exception as e:
        current_app.logger.error(f'Error during signup: {str(e)}')
        raise InternalServerError('Failed to create account')

@bp.route('/login', methods=['POST'])
def login():
    """
    Login with email and password
    
    Body:
        email: User email (required)
        password: Password (required)
    """
    try:
        data = request.get_json()
        
        # Validate with schema
        try:
            login_data = LoginRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            # Find user
            user = db.query(User).filter(User.email == login_data.email).first()
            
            if not user:
                raise BadRequestError('Invalid email or password')
            
            # Verify password
            if not user.check_password(login_data.password):
                raise BadRequestError('Invalid email or password')
            
            # Generate token
            token = generate_token(user.id)
            
            # Check if needs onboarding
            needs_onboarding = check_needs_onboarding(user.id, db)
            
            current_app.logger.info(f'User logged in: {login_data.email}')
            
            return jsonify({
                'token': token,
                'user': user.to_dict(),
                'needs_onboarding': needs_onboarding
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error during login: {str(e)}')
        raise InternalServerError('Failed to login')

@bp.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    """
    Get current authenticated user
    
    Requires: Authorization header with Bearer token
    """
    try:
        user_id = g.user_id
        
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                raise NotFoundError('User not found')
            
            return jsonify(user.to_dict())
    
    except NotFoundError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error getting current user: {str(e)}')
        raise InternalServerError('Failed to get user')

@bp.route('/google', methods=['GET'])
def google_login():
    """
    Redirect to Google OAuth login
    """
    try:
        redirect_uri = url_for('auth.google_callback', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        current_app.logger.error(f'Error initiating Google OAuth: {str(e)}')
        raise InternalServerError('Failed to initiate Google login')

@bp.route('/google/callback', methods=['GET'])
def google_callback():
    """
    Handle Google OAuth callback
    """
    try:
        # Get token from Google
        token = oauth.google.authorize_access_token()
        
        # Get user info from Google
        user_info = token.get('userinfo')
        
        if not user_info:
            raise BadRequestError('Failed to get user info from Google')
        
        google_id = user_info.get('sub')
        email = user_info.get('email')
        name = user_info.get('name')
        
        with get_db() as db:
            # Check if user exists by Google ID
            user = db.query(User).filter(User.google_id == google_id).first()
            
            if not user:
                # Check if user exists by email
                user = db.query(User).filter(User.email == email).first()
                
                if user:
                    # Link Google account to existing user
                    user.google_id = google_id
                else:
                    # Create new user
                    user = User(email=email, name=name, google_id=google_id)
                    db.add(user)
                    db.flush()
                    
                    # Create default preferences
                    preferences = UserFeedPreferences(user_id=user.id)
                    db.add(preferences)
                    db.flush()
            
            # Generate JWT token
            jwt_token = generate_token(user.id)
            
            # Check if needs onboarding
            needs_onboarding = check_needs_onboarding(user.id, db)
            
            current_app.logger.info(f'User logged in via Google: {email}')
            
            # Return JSON response (frontend should handle this)
            return jsonify({
                'token': jwt_token,
                'user': user.to_dict(),
                'needs_onboarding': needs_onboarding
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error in Google callback: {str(e)}')
        raise InternalServerError('Failed to complete Google login')
