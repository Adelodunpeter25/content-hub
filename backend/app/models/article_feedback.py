from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.core.database import Base

class ArticleFeedback(Base):
    """User feedback on article quality"""
    __tablename__ = 'article_feedback'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    article_url = Column(String, nullable=False, index=True)
    feedback_type = Column(String(20), nullable=False)  # helpful, not_helpful, spam, low_quality
    reason = Column(String(200))  # Optional reason
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('idx_feedback_user_article', 'user_id', 'article_url'),
    )
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'article_url': self.article_url,
            'feedback_type': self.feedback_type,
            'reason': self.reason,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
