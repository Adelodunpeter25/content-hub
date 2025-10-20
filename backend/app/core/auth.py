import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, current_app, g
from app.core.config import Config
from app.core.errors import BadRequestError, NotFoundError

def generate_access_token(user_id):
    """
    Generate JWT access token for user
    
    Args:
        user_id: User ID
        
    Returns:
        JWT access token string
    """
    payload = {
        'user_id': user_id,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=Config.JWT_ACCESS_TOKEN_MINUTES),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    return token

def generate_refresh_token_jwt(user_id):
    """
    Generate JWT refresh token for user
    
    Args:
        user_id: User ID
        
    Returns:
        JWT refresh token string
    """
    payload = {
        'user_id': user_id,
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=Config.JWT_REFRESH_TOKEN_DAYS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    return token

def generate_reset_token(user_id):
    """
    Generate password reset token
    
    Args:
        user_id: User ID
        
    Returns:
        Reset token string
    """
    payload = {
        'user_id': user_id,
        'type': 'reset',
        'exp': datetime.utcnow() + timedelta(hours=1),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    return token

def decode_token(token, token_type=None):
    """
    Decode and verify JWT token
    
    Args:
        token: JWT token string
        token_type: Expected token type ('access', 'refresh', 'reset')
        
    Returns:
        Decoded payload dict
    """
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        
        # Verify token type if specified
        if token_type and payload.get('type') != token_type:
            raise BadRequestError(f'Invalid token type. Expected {token_type}')
        
        return payload
    except jwt.ExpiredSignatureError:
        raise BadRequestError('Token has expired')
    except jwt.InvalidTokenError:
        raise BadRequestError('Invalid token')

def check_needs_onboarding(user_id, db):
    """
    Check if user needs onboarding
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        Boolean indicating if user needs onboarding
    """
    from app.models.preferences import UserFeedPreferences
    
    preferences = db.query(UserFeedPreferences).filter(
        UserFeedPreferences.user_id == user_id
    ).first()
    
    if not preferences:
        return True
    
    # Check if preferences are empty
    if not preferences.feed_sources and not preferences.feed_types:
        return True
    
    return False

def require_auth(f):
    """
    Decorator to require authentication for routes
    
    Usage:
        @bp.route('/protected')
        @require_auth
        def protected_route():
            user_id = g.user_id
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            raise BadRequestError('Authorization header is required')
        
        # Extract token from "Bearer <token>"
        parts = auth_header.split()
        
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            raise BadRequestError('Invalid authorization header format. Use: Bearer <token>')
        
        token = parts[1]
        
        # Decode and verify token
        payload = decode_token(token)
        
        # Attach user_id to request context
        g.user_id = payload['user_id']
        
        return f(*args, **kwargs)
    
    return decorated_function
