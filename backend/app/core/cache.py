import redis
import json
from functools import wraps

# Initialize Redis/Valkey client
redis_client = None

def init_cache():
    """Initialize Redis/Valkey connection"""
    global redis_client
    
    if not Config.REDIS_URL:
        return None
    
    try:
        redis_client = redis.from_url(
            Config.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=5
        )
        redis_client.ping()
        return redis_client
    except Exception:
        redis_client = None
        return None

def get_cache():
    """Get Redis/Valkey client"""
    global redis_client
    
    if redis_client is None:
        init_cache()
    
    return redis_client

def cache_get(key):
    """Get value from cache"""
    try:
        client = get_cache()
        if not client:
            return None
        
        value = client.get(key)
        return json.loads(value) if value else None
    except Exception:
        return None

def cache_set(key, value, ttl=None):
    """Set value in cache with TTL (uses CACHE_TTL from config if not specified)"""
    if ttl is None:
        from app.core.config import Config
        ttl = Config.CACHE_TTL
    try:
        client = get_cache()
        if not client:
            return False
        
        client.setex(key, ttl, json.dumps(value))
        return True
    except Exception:
        return False

def cache_delete(key):
    """Delete key from cache"""
    try:
        client = get_cache()
        if not client:
            return False
        
        client.delete(key)
        return True
    except Exception:
        return False

def cached(ttl=None, key_prefix=''):
    """Decorator to cache function results"""
    if ttl is None:
        from app.core.config import Config
        ttl = Config.CACHE_TTL
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}"
            if args:
                cache_key += f":{':'.join(str(a) for a in args)}"
            if kwargs:
                cache_key += f":{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}"
            
            # Try to get from cache
            cached_value = cache_get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache_set(cache_key, result, ttl)
            return result
        
        return wrapper
    return decorator
