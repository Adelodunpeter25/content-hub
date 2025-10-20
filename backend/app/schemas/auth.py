from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class SignupRequest(BaseModel):
    """Schema for signup request"""
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    name: Optional[str] = None

class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    """Schema for forgot password request"""
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    """Schema for reset password request"""
    token: str
    new_password: str = Field(..., min_length=6, description="New password must be at least 6 characters")

class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str

class AuthResponse(BaseModel):
    """Schema for authentication response"""
    access_token: str
    refresh_token: str
    user: dict
    needs_onboarding: bool
