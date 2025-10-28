# Implementation Plan: Onboarding & Content Quality

## Overview
This document outlines the implementation plan for two major features:
1. **Interactive Onboarding Experience** - Interest selection and feed templates
2. **Content Quality Improvements** - Expanded sources and quality scoring

---

## Feature 1: Onboarding Experience ⭐⭐⭐

### Phase 1A: Backend - Tag System & Feed Templates

#### 1.1 Database Schema Changes
**Files to modify:**
- `backend/app/models/tag.py` (NEW)
- `backend/app/models/preferences.py` (MODIFY)
- `backend/app/models/article_tag.py` (NEW)
- `backend/app/scripts/init_db.py` (MODIFY)

**Tasks:**
- [ ] Create `Tag` model with fields: id, name, slug, description, category, color
- [ ] Create `UserTag` model for many-to-many relationship: user_id, tag_id
- [ ] Create `ArticleTag` model for article tagging: article_url, tag_id, confidence_score
- [ ] Add `onboarding_completed` boolean field to User model
- [ ] Add `selected_tags` ARRAY field to UserFeedPreferences
- [ ] Add `feed_template` field to UserFeedPreferences (enum: custom, frontend, backend, ai_ml, devops, mobile, fullstack)
- [ ] Create migration script to add new tables and fields

**Tag Categories to Implement:**
```
Languages: Python, JavaScript, TypeScript, Go, Rust, Java, C++, PHP, Ruby, Swift, Kotlin
Frameworks: React, Vue, Angular, Next.js, Django, Flask, FastAPI, Spring, Laravel, Rails
Cloud: AWS, Azure, GCP, Kubernetes, Docker, Serverless, Terraform
Databases: PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch
Topics: AI/ML, Security, DevOps, Mobile, Web, Backend, Frontend, Data Science
Tools: Git, VS Code, Linux, CI/CD, Testing, Monitoring
```

#### 1.2 Feed Template System
**Files to create:**
- `backend/app/utils/feed_templates.py` (NEW)
- `backend/app/schemas/onboarding.py` (NEW)

**Tasks:**
- [ ] Define 6 preset feed templates with tag combinations:
  - Frontend Developer (React, Vue, Angular, JavaScript, TypeScript, CSS, Web)
  - Backend Developer (Python, Go, Java, APIs, Databases, Microservices)
  - AI/ML Engineer (AI, Machine Learning, Python, TensorFlow, PyTorch, Data Science)
  - DevOps Engineer (Kubernetes, Docker, AWS, CI/CD, Terraform, Monitoring)
  - Mobile Developer (iOS, Android, Swift, Kotlin, React Native, Flutter)
  - Full Stack (combination of Frontend + Backend)
- [ ] Create function to map template to tag IDs
- [ ] Create function to generate recommended sources based on tags

#### 1.3 Enhanced Tagging System
**Files to create/modify:**
- `backend/app/utils/tag_matcher.py` (NEW)
- `backend/app/utils/gemini_tagger.py` (NEW)
- `backend/app/utils/categorizer.py` (MODIFY)

**Tasks:**
- [ ] Create keyword-based tag matching (similar to categorizer but more granular)
- [ ] Create Gemini AI-based tag extraction (extract 3-5 relevant tags per article)
- [ ] Add tag confidence scoring (0.0 - 1.0)
- [ ] Modify feed aggregator to include tags in article objects
- [ ] Create batch tagging function for existing articles

#### 1.4 API Endpoints for Onboarding
**Files to create/modify:**
- `backend/app/routes/onboarding.py` (NEW)
- `backend/app/routes/tags.py` (NEW)
- `backend/app/routes/users.py` (MODIFY)

**Tasks:**
- [ ] `GET /api/tags` - Get all available tags grouped by category
- [ ] `GET /api/onboarding/templates` - Get preset feed templates
- [ ] `POST /api/onboarding/complete` - Save user selections (tags + template)
- [ ] `PUT /api/users/tags` - Update user's selected tags
- [ ] `GET /api/users/tags` - Get user's selected tags
- [ ] Modify `GET /api/users/feeds` to filter by user's selected tags
- [ ] Add `needs_onboarding` flag to auth responses

#### 1.5 Enhanced Feed Filtering
**Files to modify:**
- `backend/app/services/feed_service.py` (MODIFY)
- `backend/app/utils/personalization.py` (MODIFY)

**Tasks:**
- [ ] Add tag-based filtering to personalized feeds
- [ ] Implement tag scoring algorithm (match user tags with article tags)
- [ ] Sort articles by relevance score (tag matches + recency)
- [ ] Add "Recommended for you" section based on tags
- [ ] Cache tag-filtered feeds per user

---

### Phase 1B: Frontend - Onboarding UI

#### 1.6 Onboarding Flow Components
**Files to create:**
- `frontend/src/pages/OnboardingPage.tsx` (NEW)
- `frontend/src/components/onboarding/WelcomeStep.tsx` (NEW)
- `frontend/src/components/onboarding/TemplateStep.tsx` (NEW)
- `frontend/src/components/onboarding/InterestsStep.tsx` (NEW)
- `frontend/src/components/onboarding/SourcesStep.tsx` (NEW)
- `frontend/src/components/onboarding/CompletionStep.tsx` (NEW)
- `frontend/src/components/onboarding/ProgressBar.tsx` (NEW)

**Tasks:**
- [ ] **Step 1: Welcome** - Brief intro with animated illustration
- [ ] **Step 2: Choose Template** - 6 cards with template options (or skip to custom)
- [ ] **Step 3: Select Interests** - Tag selection UI with search and categories
  - Group tags by category (Languages, Frameworks, Cloud, etc.)
  - Multi-select with visual feedback
  - Minimum 3 tags required
  - Show tag count badges
- [ ] **Step 4: Customize Sources** - Optional source selection (pre-filled from template)
- [ ] **Step 5: Completion** - Success message + "Go to Dashboard" button
- [ ] Progress bar showing current step (1/5, 2/5, etc.)
- [ ] Back/Next navigation buttons
- [ ] Skip option for advanced users

#### 1.7 Tag Selection UI
**Files to create:**
- `frontend/src/components/TagSelector.tsx` (NEW)
- `frontend/src/components/TagBadge.tsx` (NEW)
- `frontend/src/components/TagCategoryGroup.tsx` (NEW)

**Tasks:**
- [ ] Create searchable tag selector component
- [ ] Implement tag filtering by category
- [ ] Add visual states (selected, hover, disabled)
- [ ] Show tag descriptions on hover
- [ ] Implement tag limit (max 20 tags)
- [ ] Add "Popular tags" section
- [ ] Create animated tag selection feedback

#### 1.8 Onboarding Hooks & State
**Files to create:**
- `frontend/src/hooks/useOnboarding.ts` (NEW)
- `frontend/src/hooks/useTags.ts` (NEW)
- `frontend/src/types/onboarding.ts` (NEW)
- `frontend/src/types/tag.ts` (NEW)

**Tasks:**
- [ ] Create `useOnboarding` hook for API calls
- [ ] Create `useTags` hook for tag management
- [ ] Add TypeScript types for tags, templates, onboarding state
- [ ] Implement local state management for multi-step form
- [ ] Add validation logic for each step

#### 1.9 Routing & Auth Flow
**Files to modify:**
- `frontend/src/App.tsx` (MODIFY)
- `frontend/src/context/AuthContext.tsx` (MODIFY)
- `frontend/src/pages/LoginPage.tsx` (MODIFY)
- `frontend/src/pages/SignupPage.tsx` (MODIFY)

**Tasks:**
- [ ] Add `/onboarding` route
- [ ] Redirect to onboarding after signup if `needs_onboarding: true`
- [ ] Redirect to onboarding after login if not completed
- [ ] Prevent access to dashboard until onboarding complete
- [ ] Add "Skip for now" option that sets minimal defaults

#### 1.10 Settings Page Enhancement
**Files to modify:**
- `frontend/src/pages/SettingsPage.tsx` (MODIFY)

**Tasks:**
- [ ] Add "Interests & Tags" section
- [ ] Allow users to modify selected tags anytime
- [ ] Add "Change Template" option
- [ ] Show current template and tags
- [ ] Add "Reset to defaults" button

---

## Feature 2: Content Quality Improvements ⭐⭐

### Phase 2A: Expanded Content Sources

#### 2.1 Research & Curate Quality Sources
**Files to create:**
- `backend/docs/content_sources.md` (NEW)

**Tasks:**
- [ ] Research and compile 50-100 quality tech blogs/sources
- [ ] Categorize sources by topic (Frontend, Backend, AI/ML, DevOps, etc.)
- [ ] Verify RSS feed availability for each source
- [ ] Document source metadata (name, URL, category, quality tier)

**Suggested Sources to Add:**
```
High-Quality Tech Blogs:
- Martin Fowler's Blog
- Joel on Software
- CSS-Tricks
- Smashing Magazine
- A List Apart
- Overreacted (Dan Abramov)
- Kent C. Dodds Blog
- web.dev (Google)
- Mozilla Hacks
- GitHub Blog
- GitLab Blog
- Netlify Blog
- Vercel Blog
- Cloudflare Blog
- Stripe Blog
- Shopify Engineering
- Netflix Tech Blog
- Uber Engineering
- Airbnb Engineering
- Spotify Engineering
- Meta Engineering
- Google Developers Blog
- Microsoft Developer Blogs
- AWS Blog
- Azure Blog
- DigitalOcean Blog
- Heroku Blog
- Railway Blog
- Supabase Blog
- PlanetScale Blog
- Prisma Blog
- Hasura Blog
- Apollo GraphQL Blog
- RedwoodJS Blog
- Remix Blog
- SolidJS Blog
- Svelte Blog
- Astro Blog
- Qwik Blog
- Deno Blog
- Bun Blog
- Tauri Blog
- Electron Blog
- React Native Blog
- Flutter Blog
- Ionic Blog
- Capacitor Blog
- Expo Blog
- NativeScript Blog
- Kotlin Blog
- Swift.org Blog
- Go Blog
- Rust Blog
- Python Insider
- Ruby Blog
- PHP.net News
- Java Magazine
- Scala Blog
- Elixir Blog
- Clojure Blog
- Haskell Weekly
- OCaml Blog
- F# Blog
- Zig News
- V Language Blog
- Crystal Lang Blog
- Nim Blog
- Red Programming Blog
- Julia Blog
- R Bloggers
- MATLAB Blog
- Wolfram Blog
- TensorFlow Blog
- PyTorch Blog
- Hugging Face Blog
- OpenAI Blog
- Anthropic Blog
- Cohere Blog
- LangChain Blog
- LlamaIndex Blog
- Pinecone Blog
- Weaviate Blog
- Milvus Blog
- Chroma Blog
- PostgreSQL News
- MySQL Blog
- MongoDB Blog
- Redis Blog
- Elasticsearch Blog
- Neo4j Blog
- CockroachDB Blog
- TimescaleDB Blog
- InfluxDB Blog
- Grafana Blog
- Prometheus Blog
- Datadog Blog
- New Relic Blog
- Sentry Blog
- LogRocket Blog
- Honeycomb Blog
```

#### 2.2 Source Management System
**Files to create:**
- `backend/app/models/source.py` (NEW)
- `backend/app/routes/sources.py` (NEW)
- `backend/app/utils/source_manager.py` (NEW)

**Tasks:**
- [ ] Create `Source` model with fields:
  - id, name, url, type (rss/scrape/reddit/youtube)
  - category, tags, quality_tier (premium/standard/community)
  - is_active, added_at, last_fetched_at
  - fetch_frequency, error_count, success_rate
- [ ] Create admin endpoints to manage sources:
  - `GET /api/admin/sources` - List all sources
  - `POST /api/admin/sources` - Add new source
  - `PUT /api/admin/sources/:id` - Update source
  - `DELETE /api/admin/sources/:id` - Remove source
  - `POST /api/admin/sources/:id/test` - Test source fetch
- [ ] Migrate existing hardcoded sources to database
- [ ] Create source health monitoring system

#### 2.3 Dynamic Source Loading
**Files to modify:**
- `backend/app/core/config.py` (MODIFY)
- `backend/app/services/feed_service.py` (MODIFY)
- `backend/app/utils/rss_parser.py` (MODIFY)

**Tasks:**
- [ ] Modify feed fetching to load sources from database instead of env vars
- [ ] Add source filtering by quality tier
- [ ] Implement source rotation (prioritize high-quality sources)
- [ ] Add source-specific fetch intervals
- [ ] Track source performance metrics (fetch time, error rate)

---

### Phase 2B: Quality Scoring System

#### 2.4 Reddit Quality Filter
**Files to create:**
- `backend/app/utils/quality_scorer.py` (NEW)
- `backend/app/utils/reddit_filter.py` (NEW)

**Tasks:**
- [ ] Create Reddit-specific quality scoring algorithm:
  - **Score threshold**: Minimum 50 upvotes
  - **Comment threshold**: Minimum 10 comments
  - **Age filter**: Posts < 48 hours old
  - **Subreddit reputation**: Whitelist high-quality subs
  - **Author reputation**: Filter deleted/suspended accounts
  - **Content quality**: Filter memes, low-effort posts
  - **Title quality**: Filter clickbait, all-caps, excessive emojis
- [ ] Implement scoring formula:
  ```
  quality_score = (upvotes * 0.4) + (comments * 0.3) + (awards * 0.2) + (engagement_rate * 0.1)
  ```
- [ ] Add configurable thresholds per subreddit
- [ ] Filter out NSFW, spoiler, and stickied posts

#### 2.5 General Content Quality Scoring
**Files to modify:**
- `backend/app/utils/quality_scorer.py` (MODIFY)
- `backend/app/services/feed_service.py` (MODIFY)

**Tasks:**
- [ ] Create universal quality scoring system for all content:
  - **Source reputation**: Premium (1.0), Standard (0.7), Community (0.5)
  - **Content length**: Penalize very short articles (< 100 chars)
  - **Title quality**: Detect clickbait patterns
  - **Freshness**: Boost recent content (< 24h)
  - **Engagement**: Track user interactions (reads, bookmarks)
  - **Tag relevance**: Match with user interests
- [ ] Implement scoring formula:
  ```
  final_score = (source_score * 0.3) + (content_score * 0.2) + (freshness * 0.2) + (engagement * 0.2) + (relevance * 0.1)
  ```
- [ ] Add minimum quality threshold (0.4 out of 1.0)
- [ ] Filter articles below threshold

#### 2.6 Content Deduplication Enhancement
**Files to modify:**
- `backend/app/utils/feed_aggregator.py` (MODIFY)

**Tasks:**
- [ ] Improve deduplication beyond URL matching:
  - **Title similarity**: Use fuzzy matching (Levenshtein distance)
  - **Content similarity**: Compare first 200 chars of summary
  - **Cross-posting detection**: Same article from multiple sources
- [ ] Keep highest quality version when duplicates found
- [ ] Add "Also available on" metadata for duplicates

#### 2.7 Spam & Low-Quality Detection
**Files to modify:**
- `backend/app/utils/content_filter.py` (MODIFY)
- `backend/app/utils/quality_scorer.py` (MODIFY)

**Tasks:**
- [ ] Enhance spam detection patterns:
  - Excessive capitalization (> 50% caps)
  - Excessive punctuation (!!!, ???)
  - Promotional keywords (buy now, limited time, click here)
  - Suspicious URLs (bit.ly, shortened links)
  - Non-English content (if English-only mode)
- [ ] Add machine learning-based spam detection (optional):
  - Train simple classifier on spam/not-spam dataset
  - Use scikit-learn or similar
- [ ] Create content quality checklist:
  - Has meaningful title (> 10 chars)
  - Has summary (> 50 chars)
  - Has valid URL
  - Published date is reasonable (not future, not > 30 days old)
  - Source is recognized

#### 2.8 Quality Metrics Dashboard
**Files to create:**
- `backend/app/routes/admin.py` (NEW)
- `frontend/src/pages/admin/QualityDashboard.tsx` (NEW)

**Tasks:**
- [ ] Create admin dashboard showing:
  - Source performance metrics
  - Quality score distribution
  - Filtered content statistics
  - User engagement by source
  - Top performing articles
- [ ] Add quality alerts for degraded sources
- [ ] Implement A/B testing for quality thresholds

---

### Phase 2C: User-Facing Quality Features

#### 2.9 Quality Indicators in UI
**Files to modify:**
- `frontend/src/components/ArticleCard.tsx` (MODIFY)
- `frontend/src/types/feed.ts` (MODIFY)

**Tasks:**
- [ ] Add quality badge to articles (Premium, Verified, Community)
- [ ] Show source reputation indicator
- [ ] Add "Trending" badge for high-engagement articles
- [ ] Show engagement metrics (reads, bookmarks)
- [ ] Add "Similar articles" section

#### 2.10 User Feedback System
**Files to create:**
- `backend/app/models/article_feedback.py` (NEW)
- `backend/app/routes/feedback.py` (NEW)
- `frontend/src/components/ArticleFeedback.tsx` (NEW)

**Tasks:**
- [ ] Create feedback model: user_id, article_url, feedback_type (helpful/not_helpful/spam), reason
- [ ] Add feedback buttons to articles
- [ ] Use feedback to adjust quality scores
- [ ] Allow users to report spam/low-quality content
- [ ] Create feedback aggregation system

---

## Implementation Timeline

### Week 1-2: Backend Foundation
- [ ] Database schema changes (tags, sources, quality scoring)
- [ ] Migration scripts
- [ ] Tag matching system
- [ ] Feed template definitions
- [ ] Basic API endpoints for tags and onboarding

### Week 3-4: Onboarding Frontend
- [ ] Onboarding page components
- [ ] Tag selection UI
- [ ] Template selection UI
- [ ] Routing and auth flow integration
- [ ] Settings page enhancements

### Week 5-6: Content Quality - Sources
- [ ] Research and curate 50-100 sources
- [ ] Source management system
- [ ] Database migration for sources
- [ ] Dynamic source loading
- [ ] Source health monitoring

### Week 7-8: Content Quality - Scoring
- [ ] Reddit quality filter
- [ ] General quality scoring system
- [ ] Enhanced deduplication
- [ ] Spam detection improvements
- [ ] Quality metrics dashboard

### Week 9-10: Polish & Testing
- [ ] UI/UX refinements
- [ ] Quality indicators in UI
- [ ] User feedback system
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Documentation updates

---

## Testing Checklist

### Onboarding Tests
- [ ] New user signup → onboarding flow
- [ ] Template selection → correct tags applied
- [ ] Custom tag selection → saved correctly
- [ ] Skip onboarding → minimal defaults set
- [ ] Onboarding completion → redirect to dashboard
- [ ] Edit tags in settings → feed updates

### Quality Tests
- [ ] Low-quality Reddit posts filtered
- [ ] High-quality articles prioritized
- [ ] Spam content blocked
- [ ] Duplicate articles removed
- [ ] Quality scores calculated correctly
- [ ] Source performance tracked

### Integration Tests
- [ ] Tag-based feed filtering works
- [ ] Template feeds show relevant content
- [ ] Quality scoring affects feed order
- [ ] User feedback updates scores
- [ ] Source management affects feeds

---

## Success Metrics

### Onboarding
- [ ] 80%+ completion rate
- [ ] Average 5+ tags selected per user
- [ ] 60%+ users choose a template
- [ ] Time to complete < 2 minutes

### Content Quality
- [ ] 50%+ reduction in low-quality Reddit posts
- [ ] 100+ new quality sources added
- [ ] Average quality score > 0.6
- [ ] User engagement (reads/bookmarks) increases 30%+
- [ ] Spam reports decrease 70%+

---

## Dependencies & Requirements

### Backend
- No new major dependencies needed
- Existing: SQLAlchemy, Pydantic, feedparser, requests
- Optional: scikit-learn (for ML-based spam detection)

### Frontend
- No new major dependencies needed
- Existing: React, TypeScript, Tailwind CSS
- Optional: framer-motion (for onboarding animations)

### Infrastructure
- Database migration required
- Cache invalidation strategy needed
- Increased storage for source metadata

---

## Rollout Strategy

### Phase 1: Beta Testing (Week 1-2)
- Deploy to staging environment
- Test with 10-20 beta users
- Gather feedback on onboarding flow
- Monitor quality score performance

### Phase 2: Gradual Rollout (Week 3-4)
- Deploy to production
- Enable for 25% of new signups
- Monitor metrics and errors
- Adjust thresholds based on data

### Phase 3: Full Rollout (Week 5+)
- Enable for all new signups
- Prompt existing users to complete onboarding
- Monitor engagement and quality metrics
- Iterate based on feedback

---

## Risk Mitigation

### Risks
1. **Onboarding friction** → Users abandon signup
   - Mitigation: Keep it under 2 minutes, allow skip
2. **Over-filtering** → Too much content removed
   - Mitigation: Start with lenient thresholds, adjust gradually
3. **Performance impact** → Quality scoring slows feeds
   - Mitigation: Cache scores, batch processing, optimize queries
4. **Source overload** → Too many sources to maintain
   - Mitigation: Automated health checks, disable failing sources

---

## Documentation Updates Needed

- [ ] API documentation (Swagger) - new endpoints
- [ ] User guide - onboarding process
- [ ] Admin guide - source management
- [ ] Developer guide - quality scoring algorithm
- [ ] README - updated feature list
- [ ] Environment variables - new config options

---

## Post-Launch Monitoring

### Metrics to Track
- Onboarding completion rate
- Average tags per user
- Feed engagement (clicks, reads, bookmarks)
- Quality score distribution
- Source performance
- User feedback submissions
- Error rates and performance

### Alerts to Set Up
- Onboarding completion rate drops below 70%
- Quality score average drops below 0.5
- Source error rate exceeds 20%
- Feed load time exceeds 2 seconds
- Spam reports spike

---

## Future Enhancements (Post-Launch)

- [ ] AI-powered tag suggestions based on reading history
- [ ] Collaborative filtering (users like you also read...)
- [ ] Custom feed creation (save tag combinations)
- [ ] Source recommendations based on interests
- [ ] Quality score transparency (show why article scored high/low)
- [ ] Community-driven source suggestions
- [ ] Advanced spam detection with ML
- [ ] Content summarization for long articles
- [ ] Multi-language support with quality scoring per language
