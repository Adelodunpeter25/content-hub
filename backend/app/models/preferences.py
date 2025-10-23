from sqlalchemy import Column, DateTime, ForeignKey, ARRAY, String, Integer, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserFeedPreferences(Base):
    """User feed preferences model"""
    __tablename__ = 'user_feed_preferences'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    feed_sources = Column(ARRAY(String), default=list)
    feed_types = Column(ARRAY(String), default=list)
    show_read_articles = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship
    user = relationship("User", backref="preferences")
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'feed_sources': self.feed_sources or [],
            'feed_types': self.feed_types or [],
            'show_read_articles': self.show_read_articles if self.show_read_articles is not None else True,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
