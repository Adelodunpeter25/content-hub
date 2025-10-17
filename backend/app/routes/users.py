from flask import Blueprint, jsonify, request, current_app
from app.core.database import get_db
from app.models.user import User
from app.models.preferences import UserFeedPreferences
from app.schemas.user import UserCreate, UserResponse, PreferencesUpdate, PreferencesResponse
from app.core.errors import BadRequestError, NotFoundError, InternalServerError
from app.utils.rss_parser import fetch_rss_feeds
from app.utils.scraper import scrape_websites
from app.utils.feed_aggregator import aggregate_feeds
from app.utils.personalization import filter_by_user_preferences
from app.utils.pagination import paginate
from app.utils.search_filter import search_articles, filter_by_source, filter_by_date_range
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

@bp.route('/<user_id>/feeds', methods=['GET'])
def get_personalized_feeds(user_id):
    """
    Get personalized feed based on user preferences
    
    Query Parameters:
        page: Page number (default: 1)
        per_page: Items per page (default: 20, max: 100)
        search: Search keyword (optional)
        source_name: Filter by source name (optional)
        start_date: Filter by start date (optional)
        end_date: Filter by end date (optional)
    """
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search_keyword = request.args.get('search')
        source_name = request.args.get('source_name')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        with get_db() as db:
            # Get user
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise NotFoundError('User not found')
            
            # Get user preferences
            preferences = db.query(UserFeedPreferences).filter(
                UserFeedPreferences.user_id == user_id
            ).first()
            
            if not preferences:
                raise NotFoundError('User preferences not found')
            
            current_app.logger.info(f'Fetching personalized feeds for user: {user_id}')
            
            # Fetch RSS feeds
            rss_urls = current_app.config['RSS_FEEDS']
            rss_articles = fetch_rss_feeds(rss_urls) if rss_urls else []
            
            # Scrape websites
            scrape_urls = current_app.config['SCRAPE_URLS']
            scraped_articles = scrape_websites(scrape_urls) if scrape_urls else []
            
            # Aggregate all feeds
            articles = aggregate_feeds(rss_articles, scraped_articles)
            
            # Apply user preferences
            articles = filter_by_user_preferences(
                articles,
                preferences.feed_sources,
                preferences.feed_types
            )
            
            # Apply search
            if search_keyword:
                articles = search_articles(articles, search_keyword)
            
            # Apply source name filter
            if source_name:
                articles = filter_by_source(articles, source_name)
            
            # Apply date range filter
            if start_date or end_date:
                articles = filter_by_date_range(articles, start_date, end_date)
            
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
                    'end_date': end_date
                }
            })
    
    except (NotFoundError):
        raise
    except Exception as e:
        current_app.logger.error(f'Error fetching personalized feeds: {str(e)}')
        raise InternalServerError('Failed to fetch personalized feeds')
