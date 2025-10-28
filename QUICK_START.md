# Quick Start Guide: Onboarding & Quality Features

## 🚀 Getting Started

### Step 1: Run Database Migration

```bash
cd backend
python -m app.scripts.migrate_onboarding
```

This will:
- Add `onboarding_completed` to users table
- Add `selected_tags` and `feed_template` to preferences table
- Create `tags` table
- Create `user_tags` table
- Create `sources` table
- Create `article_feedback` table

### Step 2: Seed Tags

```bash
python -m app.scripts.seed_tags
```

This will populate the database with 87 tags across 11 categories.

### Step 3: Start the Backend

```bash
python run.py
```

### Step 4: Test the New Endpoints

#### Get All Tags
```bash
curl http://localhost:5000/api/tags
```

#### Get Feed Templates
```bash
curl http://localhost:5000/api/onboarding/templates
```

#### Complete Onboarding (requires auth)
```bash
# First, signup or login to get a token
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Use the access_token from response
export TOKEN="your_access_token_here"

# Complete onboarding
curl -X POST http://localhost:5000/api/onboarding/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "frontend",
    "tag_ids": [1, 2, 3, 4, 5, 6, 7]
  }'
```

#### Get User's Tags
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/tags/user
```

#### Submit Article Feedback
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "article_url": "https://techcrunch.com/example",
    "feedback_type": "helpful",
    "reason": "Great article!"
  }'
```

## 📊 What's Available Now

### Feed Templates
1. **Frontend Developer** - React, Vue, Angular, JavaScript, TypeScript, CSS
2. **Backend Developer** - Python, Go, Java, APIs, Databases
3. **AI/ML Engineer** - AI, Machine Learning, TensorFlow, PyTorch
4. **DevOps Engineer** - Kubernetes, Docker, AWS, CI/CD
5. **Mobile Developer** - iOS, Android, React Native, Flutter
6. **Full Stack Developer** - JavaScript, React, Node.js, Python

### Tag Categories (87 total tags)
- Languages (12)
- Frontend (11)
- Backend (9)
- Cloud (7)
- DevOps (8)
- Databases (8)
- AI/ML (8)
- Mobile (7)
- Web (5)
- Tools (7)
- Topics (5)

### Quality Scoring
- Source reputation scoring
- Content quality analysis
- Freshness scoring
- Engagement tracking
- Relevance matching

### Reddit Filtering
- Minimum upvote threshold (50)
- Minimum comment threshold (10)
- Age filtering (< 48 hours)
- NSFW/spoiler filtering
- Low-effort content detection

## 🔧 Configuration

No new environment variables required! Everything works with existing config.

Optional additions to `.env`:
```bash
# Minimum quality score (0.0 - 1.0)
MIN_QUALITY_SCORE=0.4

# Reddit thresholds
REDDIT_MIN_SCORE=50
REDDIT_MIN_COMMENTS=10
REDDIT_MAX_AGE_HOURS=48
```

## 📝 API Response Examples

### Get Tags Response
```json
{
  "categories": [
    {
      "category": "Languages",
      "tags": [
        {
          "id": 1,
          "name": "Python",
          "slug": "python",
          "description": "Python programming language",
          "category": "Languages",
          "color": "blue"
        }
      ]
    }
  ],
  "total": 87
}
```

### Complete Onboarding Response
```json
{
  "message": "Onboarding completed successfully",
  "preferences": {
    "id": 1,
    "user_id": 1,
    "selected_tags": [1, 2, 3, 4, 5],
    "feed_template": "frontend",
    "feed_sources": [],
    "feed_types": []
  },
  "tag_count": 5
}
```

### Get Templates Response
```json
{
  "templates": [
    {
      "id": "frontend",
      "name": "Frontend Developer",
      "description": "Perfect for frontend developers working with modern web technologies",
      "icon": "🎨",
      "tag_count": 14,
      "source_count": 8
    }
  ]
}
```

## 🧪 Testing the Quality Scorer

```python
# Test quality scoring
from app.utils.quality_scorer import calculate_quality_score

article = {
    'title': 'Building Modern Web Apps with React and TypeScript',
    'summary': 'Learn how to build scalable web applications...',
    'source': 'TechCrunch',
    'published': '2024-01-15T10:00:00Z',
    'link': 'https://example.com/article',
    'tags': [
        {'id': 1, 'name': 'React', 'confidence': 0.9},
        {'id': 2, 'name': 'TypeScript', 'confidence': 0.8}
    ]
}

score = calculate_quality_score(
    article,
    source_tier='premium',
    user_tag_ids=[1, 2, 3]
)

print(f"Quality Score: {score}")  # e.g., 0.785
```

## 🧪 Testing Reddit Filter

```python
# Test Reddit filtering
from app.utils.reddit_filter import should_filter_reddit_post

post_data = {
    'score': 150,
    'num_comments': 45,
    'created_utc': 1705320000,
    'stickied': False,
    'over_18': False,
    'author': 'user123'
}

should_filter = should_filter_reddit_post(post_data, 'programming')
print(f"Should filter: {should_filter}")  # False (high quality)
```

## 🎯 Next Steps

### Immediate
1. ✅ Run migrations
2. ✅ Seed tags
3. ✅ Test API endpoints
4. ⏳ Build frontend onboarding UI

### Short Term
1. Integrate quality scoring into feed service
2. Apply Reddit filter to social scrapers
3. Add tag matching to article processing
4. Update personalized feeds to use tags

### Medium Term
1. Create source management system
2. Add 50-100 new quality sources
3. Build admin dashboard
4. Implement A/B testing for quality thresholds

## 🐛 Troubleshooting

### Migration Fails
```bash
# Check if tables already exist
psql $DATABASE_URL -c "\dt"

# Drop tables if needed (CAUTION: loses data)
psql $DATABASE_URL -c "DROP TABLE IF EXISTS tags, user_tags, sources, article_feedback CASCADE;"

# Re-run migration
python -m app.scripts.migrate_onboarding
```

### Tags Not Seeding
```bash
# Check if tags already exist
psql $DATABASE_URL -c "SELECT COUNT(*) FROM tags;"

# Clear tags if needed
psql $DATABASE_URL -c "DELETE FROM tags;"

# Re-seed
python -m app.scripts.seed_tags
```

### Import Errors
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
uv sync

# Or with pip
pip install -r requirements.txt
```

## 📚 Documentation

- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Full feature specification
- [Implementation Status](IMPLEMENTATION_STATUS.md) - Current progress
- [API Documentation](http://localhost:5000/docs) - Swagger UI (after starting server)

## 🎉 Success!

If you've completed all steps, you now have:
- ✅ 87 tags across 11 categories
- ✅ 6 feed templates
- ✅ Quality scoring system
- ✅ Reddit filtering
- ✅ Onboarding API
- ✅ Tag management API
- ✅ Feedback system

Ready to build the frontend! 🚀
