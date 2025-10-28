from sqlalchemy import Column, Integer, ForeignKey, DateTime, Index, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class UserTag(Base):
    """Many-to-many relationship between users and tags"""
    __tablename__ = 'user_tags'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    tag_id = Column(Integer, ForeignKey('tags.id', ondelete='CASCADE'), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        UniqueConstraint('user_id', 'tag_id', name='uq_user_tag'),
        Index('idx_user_tags_user', 'user_id'),
        Index('idx_user_tags_tag', 'tag_id'),
    )
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'tag_id': self.tag_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
