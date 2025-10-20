# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `content-hub`
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click and enable it

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `Content Hub`
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue** through all steps

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Content Hub Web Client`
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
     - (Add production URL later)
   - Click **Create**

5. Copy your credentials:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `xxxxx`

## Step 4: Update .env File

Open `backend/.env` and update:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

## Step 5: Test OAuth Flow

### Option 1: Browser
1. Start your app: `uv run python run.py`
2. Visit: `http://localhost:5000/api/auth/google`
3. Sign in with Google
4. You'll be redirected back with a JWT token

### Option 2: Frontend Integration
```javascript
// Redirect user to Google OAuth
window.location.href = 'http://localhost:5000/api/auth/google';

// Handle callback (you'll receive token in response)
```

## API Endpoints

### Sign in with Google
```
GET /api/auth/google
```
Redirects to Google OAuth consent screen

### Google Callback (automatic)
```
GET /api/auth/google/callback
```
Returns:
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "name": "User Name"
  },
  "needs_onboarding": true
}
```

## Production Setup

For production, add your production URL to:
1. Google Cloud Console → Credentials → Authorized redirect URIs
2. Update `.env` with production `GOOGLE_REDIRECT_URI`

Example:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

## Troubleshooting

**Error: redirect_uri_mismatch**
- Make sure redirect URI in Google Console matches exactly
- Include `http://` or `https://`
- No trailing slash

**Error: invalid_client**
- Check Client ID and Secret are correct
- Make sure they're in `.env` file

**Error: access_denied**
- User cancelled the OAuth flow
- Normal behavior, handle in frontend
