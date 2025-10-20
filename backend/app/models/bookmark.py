from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.core.database import Base

class Bookmark(Base):
    __tablename__ = 'bookmarks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    article_url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    source = Column(String)
    saved_at = Column(DateTime, server_default=func.now())
    
    __table_args__ = (
        Index('idx_bookmark_user_url', 'user_id', 'article_url'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'article_url': self.article_url,
            'title': self.title,
            'source': self.source,
            'saved_at': self.saved_at.isoformat() if self.saved_at else None
        }
