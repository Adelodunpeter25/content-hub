<div align="center">

# Content Hub

**A modern, full-stack personal feed aggregator with AI-powered categorization.**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-green.svg)](https://flask.palletsprojects.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-yellow.svg)](https://www.python.org/)

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Architecture](#architecture)

</div>

---

## Overview

Content Hub is a personal feed aggregator that brings together the best tech content from across the web into one unified platform. We collect, organize, and personalize content so you can stay informed without the noise.

### Key Highlights

- **17+ Content Sources**: Aggregates from TechCrunch, Hacker News, DEV Community, Reddit, and more
- **AI Categorization**: Automatically categorizes articles into 12+ topics
- **Dark Mode**: Full dark mode support with system preference detection
- **Mobile Responsive**: Optimized mobile experience with bottom navigation
- **Real-time Updates**: Background jobs refresh feeds every 15 minutes
- **Advanced Search**: Filter by source and categories
- **Reading Analytics**: Track reading habits, streaks, and favorite topics

---

## Features

### Authentication & Security

- **Email/Password Authentication**: Secure signup and login with bcrypt hashing
- **JWT Tokens**: Access and refresh token management
- **Google OAuth**: One-click social login
- **Password Reset**: Email-based password recovery via Resend
- **Protected Routes**: Frontend route guards and backend middleware
- **Session Management**: Persistent authentication with token refresh

### Content Aggregation

#### RSS Feeds (14 sources)
- TechCrunch, The Verge, Ars Technica
- Hacker News, MIT Technology Review, WIRED
- Engadget, VentureBeat, ZDNet
- The Next Web, Mashable
- DEV Community, Stack Overflow Blog, Medium

#### Web Scraping
- Techmeme (real-time tech news)

#### Social Media
- **Reddit**: r/technology, r/programming, r/python, r/webdev, r/machinelearning, r/datascience, r/cybersecurity, r/devops
- **YouTube**: Configurable channel feeds

#### Smart Features
- **Auto-categorization**: AI, Security, Cloud, Mobile, Web, Hardware, Gaming, Startup, Programming, Data Science, DevOps, Cybersecurity
- **HTML Cleaning**: Strips HTML tags and decodes entities from feed content
- **Background Jobs**: APScheduler for automatic feed refresh

### Personalization

- **Feed Preferences**: Select preferred sources and content types (RSS, scrape, social)
- **Personalized Feed**: AI-filtered content based on user preferences
- **Trending Articles**: Discover most popular content across all users
- **Reading Stats**: 
  - Total articles read
  - Weekly/monthly reading counts
  - Reading streaks
  - Favorite categories with visual charts
  - Daily reading activity

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|----------|
| **Flask 3.1** | Web framework |
| **PostgreSQL** | Primary database (Supabase) |
| **Redis/Valkey** | Caching layer |
| **SQLAlchemy 2.0** | ORM for database operations |
| **Pydantic** | Request/response validation |
| **JWT** | Token-based authentication |
| **Authlib** | Google OAuth integration |
| **APScheduler** | Background job scheduling |
| **Feedparser** | RSS feed parsing |
| **BeautifulSoup4** | Web scraping |
| **Bcrypt** | Password hashing |
| **Resend** | Email delivery |

### Frontend

| Technology | Purpose |
|------------|----------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **React Router** | Client-side routing |
| **Context API** | State management |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL** (or [Supabase](https://supabase.com/) account)
- **Redis/Valkey** instance ([Aiven](https://aiven.io/) or local)
- **Resend API Key** ([Get one](https://resend.com/))
- **Google OAuth Credentials** (optional, [Setup Guide](https://console.cloud.google.com/))

---

## Quick Start

### Option 1: Docker (Recommended)

1. **Configure environment**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

2. **Run with Docker Compose**
```bash
docker-compose up --build
```

3. **Initialize database** (first time only)
```bash
docker-compose exec backend uv run python -m app.scripts.init_db
```

4. **Run database migrations** (first time only)
```bash
docker-compose exec backend uv run python -m app.scripts.migrate_add_indexes
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Option 2: Local Development

#### Backend Setup

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

5. **Run database migrations**
```bash
uv run python -m app.scripts.migrate_add_indexes
```

6. **Run the backend**
```bash
uv run python run.py
```

API will be available at `http://localhost:5000`

#### Frontend Setup

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

---

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
---

## Deployment

### Backend (Production)

1. Set `FLASK_ENV=production` in environment variables
2. Use a production WSGI server (Gunicorn recommended)
3. Configure PostgreSQL and Redis instances
5. Enable CORS for your frontend domain

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set `VITE_API_URL` environment variable
3. Deploy with automatic builds on push

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

<div align="center">

**Built with ❤️ using Flask and React**

</div>
