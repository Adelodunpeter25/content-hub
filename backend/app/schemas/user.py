from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    """Schema for creating a user"""
    email: EmailStr
    name: Optional[str] = None

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    name: Optional[str] = None
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    """Schema for updating user profile"""
    name: Optional[str] = Field(None, description="User's name")

class PreferencesUpdate(BaseModel):
    """Schema for updating user preferences"""
    feed_sources: Optional[list[str]] = Field(None, description="List of source names like ['TechCrunch', 'The Verge']")
    feed_types: Optional[list[str]] = Field(None, description="List of feed types like ['rss', 'scrape']")
    content_preference: Optional[str] = Field(None, description="Content preference: tech, general, both")
    show_read_articles: Optional[bool] = Field(None, description="Show read articles in feed")
    font_size: Optional[str] = Field(None, description="Font size: small, medium, large")
    view_mode: Optional[str] = Field(None, description="View mode: compact, comfortable")

class PasswordChangeRequest(BaseModel):
    """Schema for password change request"""
    current_password: str = Field(..., min_length=1, description="Current password")
    new_password: str = Field(..., min_length=8, description="New password (min 8 characters)")

class PreferencesResponse(BaseModel):
    """Schema for preferences response"""
    id: int
    user_id: int
    feed_sources: list[str] = []
    feed_types: list[str] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        from_attributes = True

class DeleteAccountRequest(BaseModel):
    """Schema for delete account request"""
    password: str = Field(..., description="User password for confirmation")
