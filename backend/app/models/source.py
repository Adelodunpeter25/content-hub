from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ARRAY
from sqlalchemy.sql import func
from app.core.database import Base

class Source(Base):
    """Content source model for dynamic source management"""
    __tablename__ = 'sources'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    url = Column(String(500), nullable=False)
    type = Column(String(20), nullable=False)  # rss, scrape, reddit, youtube
    category = Column(String(50))  # Frontend, Backend, AI/ML, etc.
    tags = Column(ARRAY(String), default=list)  # Associated tags
    quality_tier = Column(String(20), default='standard')  # premium, standard, community
    is_active = Column(Boolean, default=True, index=True)
    
    # Performance metrics
    last_fetched_at = Column(DateTime(timezone=True))
    fetch_frequency = Column(Integer, default=900)  # seconds
    error_count = Column(Integer, default=0)
    success_count = Column(Integer, default=0)
    success_rate = Column(Float, default=1.0)
    avg_fetch_time = Column(Float, default=0.0)  # seconds
    
    # Metadata
    description = Column(String(500))
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'type': self.type,
            'category': self.category,
            'tags': self.tags or [],
            'quality_tier': self.quality_tier,
            'is_active': self.is_active,
            'last_fetched_at': self.last_fetched_at.isoformat() if self.last_fetched_at else None,
            'fetch_frequency': self.fetch_frequency,
            'success_rate': self.success_rate,
            'avg_fetch_time': self.avg_fetch_time,
            'description': self.description,
            'added_at': self.added_at.isoformat() if self.added_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def record_success(self, fetch_time):
        """Record successful fetch"""
        self.success_count += 1
        self.error_count = max(0, self.error_count - 1)  # Decay errors
        self.last_fetched_at = func.now()
        
        # Update average fetch time
        total_fetches = self.success_count + self.error_count
        self.avg_fetch_time = ((self.avg_fetch_time * (total_fetches - 1)) + fetch_time) / total_fetches
        
        # Update success rate
        self.success_rate = self.success_count / total_fetches if total_fetches > 0 else 1.0
    
    def record_error(self):
        """Record failed fetch"""
        self.error_count += 1
        total_fetches = self.success_count + self.error_count
        self.success_rate = self.success_count / total_fetches if total_fetches > 0 else 0.0
        
        # Disable source if error rate is too high
        if self.error_count >= 10 and self.success_rate < 0.3:
            self.is_active = False
