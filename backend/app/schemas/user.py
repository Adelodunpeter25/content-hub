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
