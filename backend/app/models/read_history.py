from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from app.core.database import Base

class ReadHistory(Base):
    __tablename__ = 'read_history'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    article_url = Column(String, nullable=False)
    article_title = Column(String)
    article_source = Column(String)
    article_category = Column(String)
    read_at = Column(DateTime, server_default=func.now())
    
    __table_args__ = (
        Index('idx_history_user_url', 'user_id', 'article_url'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'article_url': self.article_url,
            'article_title': self.article_title,
            'article_source': self.article_source,
            'article_category': self.article_category,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }
