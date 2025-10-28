/**
 * Offline storage utilities for feeds and user data
 */

import { 
  STORES, 
  getAllFromStore, 
  putInStore, 
  bulkPutInStore, 
  deleteFromStore,
  getFromStore 
} from './db';

export interface CachedFeed {
  link: string;
  title: string;
  summary: string;
  source: string;
  published: string;
  type: string;
  categories?: string[];
  cachedAt: number;
}

export interface CachedBookmark {
  article_url: string;
  title: string;
  source: string;
  saved_at: string;
  synced: boolean;
}

export interface CachedReadHistory {
  article_url: string;
  article_title: string;
  article_source: string;
  article_category?: string;
  read_at: string;
  synced: boolean;
}

export interface PendingAction {
  id?: number;
  type: 'bookmark' | 'unbookmark' | 'read' | 'unread';
  data: any;
  timestamp: number;
  retries: number;
}

/**
 * Cache feeds to IndexedDB
 */
export const cacheFeeds = async (feeds: any[]): Promise<void> => {
  const cachedFeeds: CachedFeed[] = feeds.map(feed => ({
    ...feed,
    cachedAt: Date.now()
  }));
  
  await bulkPutInStore(STORES.FEEDS, cachedFeeds);
  
  // Update metadata
  await putInStore(STORES.METADATA, {
    key: 'lastFeedUpdate',
    value: Date.now()
  });
};

/**
 * Get cached feeds from IndexedDB
 */
export const getCachedFeeds = async (): Promise<CachedFeed[]> => {
  return getAllFromStore<CachedFeed>(STORES.FEEDS);
};

/**
 * Get last feed update timestamp
 */
export const getLastFeedUpdate = async (): Promise<number | null> => {
  const metadata = await getFromStore<{ key: string; value: number }>(
    STORES.METADATA, 
    'lastFeedUpdate'
  );
  return metadata?.value || null;
};

/**
 * Cache bookmark locally
 */
export const cacheBookmark = async (bookmark: Omit<CachedBookmark, 'synced'>): Promise<void> => {
  await putInStore(STORES.BOOKMARKS, {
    ...bookmark,
    synced: false
  });
};

/**
 * Get cached bookmarks
 */
export const getCachedBookmarks = async (): Promise<CachedBookmark[]> => {
  return getAllFromStore<CachedBookmark>(STORES.BOOKMARKS);
};

/**
 * Remove cached bookmark
 */
export const removeCachedBookmark = async (articleUrl: string): Promise<void> => {
  await deleteFromStore(STORES.BOOKMARKS, articleUrl);
};

/**
 * Cache read history locally
 */
export const cacheReadHistory = async (
  history: Omit<CachedReadHistory, 'synced'>
): Promise<void> => {
  await putInStore(STORES.READ_HISTORY, {
    ...history,
    synced: false
  });
};

/**
 * Get cached read history
 */
export const getCachedReadHistory = async (): Promise<CachedReadHistory[]> => {
  return getAllFromStore<CachedReadHistory>(STORES.READ_HISTORY);
};

/**
 * Add pending action to sync queue
 */
export const addPendingAction = async (
  type: PendingAction['type'],
  data: any
): Promise<void> => {
  const action: PendingAction = {
    type,
    data,
    timestamp: Date.now(),
    retries: 0
  };
  
  await putInStore(STORES.PENDING_ACTIONS, action);
};

/**
 * Get all pending actions
 */
export const getPendingActions = async (): Promise<PendingAction[]> => {
  return getAllFromStore<PendingAction>(STORES.PENDING_ACTIONS);
};

/**
 * Remove pending action after successful sync
 */
export const removePendingAction = async (actionId: number): Promise<void> => {
  await deleteFromStore(STORES.PENDING_ACTIONS, actionId.toString());
};

/**
 * Update pending action retry count
 */
export const updatePendingActionRetries = async (action: PendingAction): Promise<void> => {
  await putInStore(STORES.PENDING_ACTIONS, {
    ...action,
    retries: action.retries + 1
  });
};

/**
 * Check if article is bookmarked (from cache)
 */
export const isArticleBookmarked = async (articleUrl: string): Promise<boolean> => {
  const bookmark = await getFromStore<CachedBookmark>(STORES.BOOKMARKS, articleUrl);
  return bookmark !== null;
};

/**
 * Check if article is read (from cache)
 */
export const isArticleRead = async (articleUrl: string): Promise<boolean> => {
  const history = await getFromStore<CachedReadHistory>(STORES.READ_HISTORY, articleUrl);
  return history !== null;
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  const feeds = await getCachedFeeds();
  const bookmarks = await getCachedBookmarks();
  const history = await getCachedReadHistory();
  const pendingActions = await getPendingActions();
  const lastUpdate = await getLastFeedUpdate();

  return {
    feedsCount: feeds.length,
    bookmarksCount: bookmarks.length,
    historyCount: history.length,
    pendingActionsCount: pendingActions.length,
    lastUpdate: lastUpdate ? new Date(lastUpdate) : null,
    cacheAge: lastUpdate ? Date.now() - lastUpdate : null
  };
};
