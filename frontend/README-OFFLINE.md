# Offline Functionality Guide

Content Hub now has comprehensive offline support with IndexedDB storage and background sync!

## Features

### 1. **IndexedDB Storage**
All feeds and user data are stored locally in your browser's IndexedDB:

- **Feeds Cache**: All fetched articles stored locally
- **Bookmarks**: Offline bookmark management
- **Read History**: Track reading even when offline
- **Pending Actions**: Queue for actions that need to sync

### 2. **Offline-First Feed Loading**
- Loads cached feeds instantly (no waiting for network)
- Updates in background when online
- Shows cache age indicator
- Works completely offline with previously fetched data

### 3. **Background Sync**
- Actions performed offline are queued automatically
- Syncs when connection is restored
- Retries failed syncs (up to 3 attempts)
- Visual indicator shows pending actions

### 4. **Supported Offline Actions**
- ✅ Read articles (from cache)
- ✅ Bookmark articles (syncs later)
- ✅ Mark articles as read (syncs later)
- ✅ Browse previously loaded content
- ✅ Navigate between pages

## How It Works

### Feed Caching
```typescript
// Automatically caches feeds when fetched
const { feeds, isOffline, isCached, lastUpdate } = useOfflineFeeds();

// Shows cached data immediately
// Updates from network in background
// Falls back to cache if network fails
```

### Offline Bookmarking
```typescript
const { addBookmark, removeBookmark } = useOfflineBookmarks();

// Works offline - queues for sync
await addBookmark({
  article_url: 'https://...',
  title: 'Article Title',
  source: 'TechCrunch'
});

// Syncs automatically when back online
```

### Sync Status
The app shows a sync indicator when:
- There are pending actions to sync
- Sync is in progress
- All changes are synced

## Usage

### Using Offline Feeds Hook

```typescript
import { useOfflineFeeds } from '../hooks/useOfflineFeeds';

function FeedComponent() {
  const { 
    feeds,        // Array of articles
    loading,      // Loading state
    error,        // Error message
    isOffline,    // Offline status
    isCached,     // Using cached data
    lastUpdate,   // Last update timestamp
    refetch       // Manual refresh
  } = useOfflineFeeds();

  return (
    <div>
      {isCached && (
        <div>Showing cached data from {lastUpdate?.toLocaleString()}</div>
      )}
      {feeds.map(feed => <ArticleCard key={feed.link} {...feed} />)}
    </div>
  );
}
```

### Using Offline Bookmarks Hook

```typescript
import { useOfflineBookmarks } from '../hooks/useOfflineBookmarks';

function BookmarkButton({ article }) {
  const { addBookmark, removeBookmark, checkBookmarked } = useOfflineBookmarks();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    checkBookmarked(article.link).then(setIsBookmarked);
  }, [article.link]);

  const handleToggle = async () => {
    if (isBookmarked) {
      await removeBookmark(article.link);
    } else {
      await addBookmark({
        article_url: article.link,
        title: article.title,
        source: article.source
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  return <button onClick={handleToggle}>Bookmark</button>;
}
```

### Manual Sync

```typescript
import { triggerSync, hasPendingActions } from '../utils/syncManager';

// Check if sync needed
const pending = await hasPendingActions();

// Trigger manual sync
if (navigator.onLine && pending) {
  const result = await triggerSync();
  console.log(`Synced ${result.synced} actions`);
}
```

## Database Schema

### Stores

1. **feeds** (keyPath: 'link')
   - Stores all fetched articles
   - Indexed by: source, published, cachedAt

2. **bookmarks** (keyPath: 'article_url')
   - Offline bookmarks
   - Indexed by: saved_at

3. **readHistory** (keyPath: 'article_url')
   - Reading history
   - Indexed by: read_at

4. **pendingActions** (keyPath: 'id', autoIncrement)
   - Actions waiting to sync
   - Indexed by: type, timestamp

5. **metadata** (keyPath: 'key')
   - Cache timestamps and settings

## Sync Behavior

### Automatic Sync
- Triggers when connection is restored
- Runs every 5 minutes when online
- Processes pending actions in order

### Retry Logic
- Failed syncs retry up to 3 times
- Exponential backoff between retries
- Actions removed after max retries

### Sync Events
Listen for sync completion:
```typescript
window.addEventListener('sync-complete', (event) => {
  const { synced, failed, total } = event.detail;
  console.log(`Synced ${synced}/${total} actions`);
});
```

## Storage Management

### Check Cache Stats
```typescript
import { getCacheStats } from '../utils/offlineStorage';

const stats = await getCacheStats();
console.log({
  feedsCount: stats.feedsCount,
  bookmarksCount: stats.bookmarksCount,
  historyCount: stats.historyCount,
  pendingActionsCount: stats.pendingActionsCount,
  lastUpdate: stats.lastUpdate,
  cacheAge: stats.cacheAge
});
```

### Clear Cache
```typescript
import { clearStore } from '../utils/db';

// Clear specific store
await clearStore('feeds');

// Or clear all
await Promise.all([
  clearStore('feeds'),
  clearStore('bookmarks'),
  clearStore('readHistory'),
  clearStore('pendingActions')
]);
```

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (iOS 10+, full support)
- ✅ Samsung Internet (full support)

## Storage Limits

IndexedDB storage limits vary by browser:
- Chrome: ~60% of available disk space
- Firefox: ~50% of available disk space
- Safari: ~1GB (prompts for more)

The app uses minimal storage:
- ~1-2MB for 1000 articles
- ~100KB for bookmarks/history
- Automatically managed by browser

## Troubleshooting

### Data Not Persisting
- Check browser storage settings
- Ensure not in private/incognito mode
- Check available disk space

### Sync Not Working
- Verify online status
- Check browser console for errors
- Try manual sync from sync indicator

### Cache Too Old
- Pull to refresh or click refresh button
- Cache updates automatically when online
- Manual refetch available in UI

## Best Practices

1. **Always check online status** before critical operations
2. **Show cache age** to users for transparency
3. **Provide manual refresh** option
4. **Handle sync failures** gracefully
5. **Clear old cache** periodically (implement if needed)

## Future Enhancements

Potential improvements:
- [ ] Selective sync (choose what to sync)
- [ ] Cache size limits and cleanup
- [ ] Export/import offline data
- [ ] Conflict resolution for concurrent edits
- [ ] Push notifications for sync completion
