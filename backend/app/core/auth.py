import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, current_app, g
from app.core.config import Config
from app.core.errors import BadRequestError, NotFoundError

def generate_token(user_id):
    """
    Generate JWT token for user
    
    Args:
        user_id: User ID
        
    Returns:
        JWT token string
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    return token

def decode_token(token):
    """
    Decode and verify JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload dict
    """
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
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
