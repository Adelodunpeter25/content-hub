"""Article feedback routes"""
from flask import Blueprint, jsonify, request, current_app, g
from app.core.database import get_db
from app.core.auth import require_auth
from app.core.errors import BadRequestError, InternalServerError
from app.models.article_feedback import ArticleFeedback
from app.schemas.feedback import ArticleFeedbackRequest
from pydantic import ValidationError

bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')

@bp.route('', methods=['POST'])
@require_auth
def submit_feedback():
    """Submit feedback for an article"""
    try:
        data = request.get_json()
        user_id = g.user_id
        
        # Validate request
        try:
            feedback_data = ArticleFeedbackRequest(**data)
        except ValidationError as e:
            raise BadRequestError(str(e))
        
        with get_db() as db:
            # Check if user already gave feedback for this article
            existing = db.query(ArticleFeedback).filter(
                ArticleFeedback.user_id == user_id,
                ArticleFeedback.article_url == feedback_data.article_url
            ).first()
            
            if existing:
                # Update existing feedback
                existing.feedback_type = feedback_data.feedback_type
                existing.reason = feedback_data.reason
                feedback = existing
            else:
                # Create new feedback
                feedback = ArticleFeedback(
                    user_id=user_id,
                    article_url=feedback_data.article_url,
                    feedback_type=feedback_data.feedback_type,
                    reason=feedback_data.reason
                )
                db.add(feedback)
            
            db.flush()
            
            current_app.logger.info(f'User {user_id} submitted {feedback_data.feedback_type} feedback')
            
            return jsonify({
                'message': 'Feedback submitted successfully',
                'feedback': feedback.to_dict()
            }), 201
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error submitting feedback: {str(e)}')
        raise InternalServerError('Failed to submit feedback')

@bp.route('/article', methods=['GET'])
@require_auth
def get_article_feedback():
    """Get user's feedback for a specific article"""
    try:
        article_url = request.args.get('url')
        if not article_url:
            raise BadRequestError('Article URL is required')
        
        user_id = g.user_id
        
        with get_db() as db:
            feedback = db.query(ArticleFeedback).filter(
                ArticleFeedback.user_id == user_id,
                ArticleFeedback.article_url == article_url
            ).first()
            
            if not feedback:
                return jsonify({'feedback': None})
            
            return jsonify({'feedback': feedback.to_dict()})
    
    except BadRequestError:
        raise
    except Exception as e:
        current_app.logger.error(f'Error fetching feedback: {str(e)}')
        raise InternalServerError('Failed to fetch feedback')

@bp.route('/stats', methods=['GET'])
@require_auth
def get_feedback_stats():
    """Get feedback statistics for current user"""
    try:
        user_id = g.user_id
        
        with get_db() as db:
            from sqlalchemy import func
            
            stats = db.query(
                ArticleFeedback.feedback_type,
                func.count(ArticleFeedback.id).label('count')
            ).filter(
                ArticleFeedback.user_id == user_id
            ).group_by(
                ArticleFeedback.feedback_type
            ).all()
            
            result = {
                feedback_type: count
                for feedback_type, count in stats
            }
            
            return jsonify({
                'stats': result,
                'total': sum(result.values())
            })
    
    except Exception as e:
        current_app.logger.error(f'Error fetching feedback stats: {str(e)}')
        raise InternalServerError('Failed to fetch feedback stats')
