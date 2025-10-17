from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class User(Base):
    """User model"""
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': str(self.id),
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
