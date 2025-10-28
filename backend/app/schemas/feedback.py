"""Pydantic schemas for article feedback"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional

class ArticleFeedbackRequest(BaseModel):
    """Request schema for article feedback"""
    article_url: str = Field(..., description="Article URL")
    feedback_type: str = Field(..., description="Feedback type: helpful, not_helpful, spam, low_quality")
    reason: Optional[str] = Field(None, max_length=200, description="Optional reason")
    
    @field_validator('feedback_type')
    @classmethod
    def validate_feedback_type(cls, v):
        if v not in ['helpful', 'not_helpful', 'spam', 'low_quality']:
            raise ValueError('Invalid feedback type')
        return v

class ArticleFeedbackResponse(BaseModel):
    """Response schema for article feedback"""
    id: int
    article_url: str
    feedback_type: str
    reason: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True
