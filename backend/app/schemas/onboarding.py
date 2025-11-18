"""Pydantic schemas for onboarding"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class OnboardingCompleteRequest(BaseModel):
    """Request schema for completing onboarding"""
    template: Optional[str] = Field(None, description="Selected template (frontend, backend, ai_ml, devops, mobile, fullstack, custom)")
    tag_ids: List[int] = Field(default_factory=list, max_length=20, description="Selected tag IDs (0-20 tags)")
    source_names: Optional[List[str]] = Field(None, description="Optional custom source names")
    content_preference: Optional[str] = Field('tech', description="Content preference: tech, general, both")
    
    @field_validator('template')
    @classmethod
    def validate_template(cls, v):
        if v and v not in ['frontend', 'backend', 'ai_ml', 'devops', 'mobile', 'fullstack', 'custom']:
            raise ValueError('Invalid template')
        return v
    
    @field_validator('content_preference')
    @classmethod
    def validate_content_preference(cls, v):
        if v and v not in ['tech', 'general', 'both']:
            raise ValueError('Invalid content preference')
        return v

class UpdateTagsRequest(BaseModel):
    """Request schema for updating user tags"""
    tag_ids: List[int] = Field(..., min_length=1, max_length=20, description="Tag IDs (1-20 tags)")

class TagResponse(BaseModel):
    """Response schema for tag"""
    id: int
    name: str
    slug: str
    description: Optional[str]
    category: str
    color: str
    
    class Config:
        from_attributes = True

class TagCategoryResponse(BaseModel):
    """Response schema for tags grouped by category"""
    category: str
    tags: List[TagResponse]

class TemplateResponse(BaseModel):
    """Response schema for feed template"""
    id: str
    name: str
    description: str
    icon: str
    tag_count: int
    source_count: int
