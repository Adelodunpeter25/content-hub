from flask import Blueprint, jsonify, request, current_app, g, url_for, redirect
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.models.refresh_token import RefreshToken
from app.schemas.auth import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest, RefreshTokenRequest
from app.core.auth import generate_access_token, generate_reset_token, require_auth, check_needs_onboarding, decode_token
from app.core.oauth import oauth
from app.core.errors import BadRequestError, NotFoundError, InternalServerError
from app.utils.email_sender import send_password_reset_email
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from app.core.config import Config

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def create_refresh_token(user_id, db):
    """Create and store refresh token"""
    refresh_token = RefreshToken.generate_token()
    expires_at = datetime.utcnow() + timedelta(days=Config.JWT_REFRESH_TOKEN_DAYS)
    
    token_record = RefreshToken(
        user_id=user_id,
        token=refresh_token,
        expires_at=expires_at
    )
    db.add(token_record)
    db.flush()
    
    return refresh_token

@bp.route('/signup', methods=['POST'])
def signup():
    """Create a new user account"""
    try:
        data = request.get_json()
        
        try:
            signup_data = SignupRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            existing_user = db.query(User).filter(User.email == signup_data.email).first()
            if existing_user:
                raise BadRequestError('User with this email already exists')
            
            user = User(email=signup_data.email, name=signup_data.name)
            user.set_password(signup_data.password)
            db.add(user)
            db.flush()
            
            preferences = UserFeedPreferences(user_id=user.id)
            db.add(preferences)
            db.flush()
            
            access_token = generate_access_token(user.id)
            refresh_token = create_refresh_token(user.id, db)
            needs_onboarding = check_needs_onboarding(user.id, db)
            
            current_app.logger.info(f'User signed up: {signup_data.email}')
            
            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
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
    """Login with email and password"""
    try:
        data = request.get_json()
        
        try:
            login_data = LoginRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            user = db.query(User).filter(User.email == login_data.email).first()
            
            if not user or not user.password_hash:
                raise BadRequestError('Invalid email or password')
            
            if not user.check_password(login_data.password):
                raise BadRequestError('Invalid email or password')
            
            # Update last login
            user.last_login_at = datetime.utcnow()
            user.last_login_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            db.flush()
            
            access_token = generate_access_token(user.id)
            refresh_token = create_refresh_token(user.id, db)
            needs_onboarding = check_needs_onboarding(user.id, db)
            
            current_app.logger.info(f'User logged in: {login_data.email}')
            
            return jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': user.to_dict(),
                'needs_onboarding': needs_onboarding
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error during login: {str(e)}')
        raise InternalServerError('Failed to login')

@bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh access token using refresh token"""
    try:
        data = request.get_json()
        
        try:
            refresh_data = RefreshTokenRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            token_record = db.query(RefreshToken).filter(
                RefreshToken.token == refresh_data.refresh_token,
                not RefreshToken.revoked
            ).first()
            
            if not token_record:
                raise BadRequestError('Invalid refresh token')
            
            if token_record.expires_at.replace(tzinfo=None) < datetime.utcnow():
                raise BadRequestError('Refresh token has expired')
            
            access_token = generate_access_token(token_record.user_id)
            
            return jsonify({
                'access_token': access_token
            })
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error refreshing token: {str(e)}')
        raise InternalServerError('Failed to refresh token')

@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset email"""
    try:
        data = request.get_json()
        
        try:
            forgot_data = ForgotPasswordRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            user = db.query(User).filter(User.email == forgot_data.email).first()
            
            if not user or not user.password_hash:
                return jsonify({'message': 'If the email exists, a reset link has been sent'})
            
            reset_token = generate_reset_token(user.id)
            
            send_password_reset_email(user.email, reset_token)
            
            current_app.logger.info(f'Password reset requested for: {forgot_data.email}')
            
            return jsonify({'message': 'If the email exists, a reset link has been sent'})
    
    except Exception as e:
        current_app.logger.error(f'Error in forgot password: {str(e)}')
        raise InternalServerError('Failed to process request')

@bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        
        try:
            reset_data = ResetPasswordRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        payload = decode_token(reset_data.token, token_type='reset')
        user_id = payload['user_id']
        
        with get_db() as db:
            user = db.query(User).filter(User.id == user_id).first()
            
            if not user:
                raise NotFoundError('User not found')
            
            user.set_password(reset_data.new_password)
            db.flush()
            
            current_app.logger.info(f'Password reset for user: {user.email}')
            
            return jsonify({'message': 'Password reset successfully'})
    
    except (BadRequestError, NotFoundError):
        raise
    except Exception as e:
        current_app.logger.error(f'Error resetting password: {str(e)}')
        raise InternalServerError('Failed to reset password')

@bp.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user"""
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
    """Redirect to Google OAuth login"""
    try:
        redirect_uri = url_for('auth.google_callback', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        current_app.logger.error(f'Error initiating Google OAuth: {str(e)}')
        raise InternalServerError('Failed to initiate Google login')

@bp.route('/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            raise BadRequestError('Failed to get user info from Google')
        
        google_id = user_info.get('sub')
        email = user_info.get('email')
        name = user_info.get('name')
        
        with get_db() as db:
            user = db.query(User).filter(User.google_id == google_id).first()
            
            if not user:
                user = db.query(User).filter(User.email == email).first()
                
                if user:
                    user.google_id = google_id
                else:
                    user = User(email=email, name=name, google_id=google_id)
                    db.add(user)
                    db.flush()
                    
                    preferences = UserFeedPreferences(user_id=user.id)
                    db.add(preferences)
                    db.flush()
            
            # Update last login
            user.last_login_at = datetime.utcnow()
            user.last_login_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            db.flush()
            
            access_token = generate_access_token(user.id)
            refresh_token = create_refresh_token(user.id, db)
            needs_onboarding = check_needs_onboarding(user.id, db)
            
            current_app.logger.info(f'User logged in via Google: {email}')
            
            # Redirect to frontend with tokens
            frontend_url = Config.FRONTEND_URL
            redirect_url = f"{frontend_url}/auth/google/callback?access_token={access_token}&refresh_token={refresh_token}"
            return redirect(redirect_url)
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error in Google callback: {str(e)}')
        current_app.logger.error(f'Request args: {request.args}')
        current_app.logger.error(f'Config - Client ID exists: {bool(Config.GOOGLE_CLIENT_ID)}')
        raise InternalServerError('Failed to complete Google login')
