# Content Hub

A full-stack personal feed aggregator that collects content from RSS feeds, web scraping, and social media with intelligent recommendations and user personalization.

## Features

### 🔐 Authentication
- Email/password signup and login
- JWT access tokens
- Google OAuth integration
- Password reset via email

### 📰 Content Aggregation
- **RSS Feeds**: TechCrunch, The Verge, Ars Technica
- **Web Scraping**: Techmeme
- **Social Media**: Reddit (r/technology, r/programming) and YouTube
- **Auto-categorization**: AI, Security, Cloud, Mobile, Web, Hardware, Gaming, Startup, Programming
- **Background Jobs**: Automatic feed refresh every 15 minutes
- **Redis Caching**

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

### Backend
- **Framework**: Flask 3.1
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis/Valkey
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT, OAuth (Authlib)
- **Validation**: Pydantic
- **Scheduler**: APScheduler

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Context API

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (Supabase account)
- Redis/Valkey instance
- Resend API key (for emails)
- Google OAuth credentials (optional)

### Backend Setup

1. **Navigate to backend**
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

5. **Run the backend**
```bash
uv run python run.py
```

API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd content-hub/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit VITE_API_URL if needed (default: http://localhost:5000/api)
```

4. **Run the frontend**
```bash
npm run dev
```

App will be available at `http://localhost:5173`

## Architecture

```
content-hub/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, auth, cache, scheduler
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers (RSS, scraping, etc.)
│   │   ├── scripts/        # DB scripts
│   │   ├── tests/          # Unit tests
│   │   ├── main.py         # Flask app
│   │   └── swagger.json    # API docs
│   ├── logs/               # Application logs
│   ├── .env                # Environment config
│   └── run.py              # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── context/        # Global state handlers
    │   ├── hooks/          # Custom hooks (API calls)
    │   ├── pages/          # Page components
    │   ├── services/       # API service
    │   ├── types/          # TypeScript types
    │   ├── App.tsx         # Main app
    │   └── main.tsx        # Entry point
    ├── .env                # Environment config
    └── package.json        # Dependencies
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
