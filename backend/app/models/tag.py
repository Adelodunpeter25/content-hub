from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.sql import func
from app.core.database import Base

class Tag(Base):
    """Tag model for granular content categorization"""
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(200))
    category = Column(String(50), nullable=False, index=True)  # Languages, Frameworks, Cloud, etc.
    color = Column(String(20), default='gray')  # For UI display
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('idx_tag_category', 'category'),
    )
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'category': self.category,
            'color': self.color,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
