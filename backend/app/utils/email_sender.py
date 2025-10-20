import resend
from app.core.config import Config

resend.api_key = Config.RESEND_API_KEY

def send_password_reset_email(email, reset_token):
    """
    Send password reset email
    
    Args:
        email: User email
        reset_token: Password reset token
    """
    reset_link = f"{Config.FRONTEND_URL}/reset-password?token={reset_token}"
    
    params = {
        "from": Config.RESEND_FROM_EMAIL,
        "to": [email],
        "subject": "Reset Your Password - Content Hub",
        "html": f"""
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        """
    }
    
    try:
        resend.Emails.send(params)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
