# Content Hub API

A personal feed aggregator that collects content from RSS feeds, web scraping, and social media with intelligent recommendations and user personalization.

## Features

### 🔐 Authentication
- Email/password signup and login
- JWT access tokens (60 min) + refresh tokens (30 days)
- Google OAuth integration
- Password reset via email (Resend)

### 📰 Content Aggregation
- **RSS Feeds**: TechCrunch, The Verge, Ars Technica
- **Web Scraping**: Techmeme
- **Social Media**: Reddit (r/technology, r/programming) and YouTube
- **Auto-categorization**: AI, Security, Cloud, Mobile, Web, Hardware, Gaming, Startup, Programming
- **Background Jobs**: Automatic feed refresh every 15 minutes
- **Redis Caching**: 100x faster response times (~50ms vs 5000ms)

### 🎯 Personalization
- User feed preferences (sources and types)
- Personalized feed based on preferences
- **Trending Articles**: Most popular content across all users
- **Reading Stats**: Daily/weekly/monthly reads, favorite categories, reading streaks

### 📚 User Features
- **Bookmarks**: Save favorite articles
- **Read History**: Track read articles
- **Search & Filters**: Keyword search, category filter, source filter, date range
- **Pagination**: Configurable page size (max 100)

### 🔒 Security
- Bcrypt password hashing
- JWT token validation
- Rate limiting

## Tech Stack

- **Framework**: Flask 3.1
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis/Valkey
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT, OAuth (Authlib)
- **Validation**: Pydantic
- **Scheduler**: APScheduler

## Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL (Supabase account)
- Redis/Valkey instance
- Resend API key (for emails)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
cd content-hub/backend
```

2. **Install dependencies**
```bash
pip install uv
uv sync
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Initialize database**
```bash
uv run python -m app.scripts.init_db
```

5. **Run the application**
```bash
uv run python run.py
```

API will be available at `http://localhost:5000`

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis Cache
REDIS_URL=redis://localhost:6379
CACHE_TTL=900  # 15 minutes

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ACCESS_TOKEN_MINUTES=60
JWT_REFRESH_TOKEN_DAYS=30

# Email (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Content Sources
RSS_FEEDS=https://techcrunch.com/feed/,https://www.theverge.com/rss/index.xml
SCRAPE_URLS=https://www.techmeme.com
REDDIT_SUBREDDITS=technology,programming,python
YOUTUBE_CHANNELS=channel_id_1,channel_id_2
```

## API Documentation

Interactive API documentation available at: `http://localhost:5000/docs`

## Architecture

```
content-hub/backend/
├── app/
│   ├── core/           # Config, auth, cache, scheduler
│   ├── models/         # SQLAlchemy models
│   ├── routes/         # API endpoints
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── utils/          # Helpers (RSS, scraping, etc.)
│   ├── scripts/        # DB scripts
│   ├── tests/          # Unit tests
│   ├── main.py         # Flask app
│   └── swagger.json    # API docs
├── logs/               # Application logs
├── .env                # Environment config
└── run.py              # Entry point
```

## Database Management

```bash
# Initialize tables
uv run python -m app.scripts.init_db

# Clean all data
uv run python -m app.scripts.clean_db
```
## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

---
