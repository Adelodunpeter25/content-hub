from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class ReadHistory(Base):
    __tablename__ = 'read_history'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    article_url = Column(String, nullable=False)
    read_at = Column(DateTime, server_default=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'article_url': self.article_url,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }
