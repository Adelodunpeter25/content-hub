/**
 * Hook for offline-capable bookmarks
 */

import { useState, useCallback } from 'react';
import { request } from '../services/api';
import {
  cacheBookmark,
  removeCachedBookmark,
  addPendingAction,
  isArticleBookmarked
} from '../utils/offlineStorage';

interface UseOfflineBookmarksResult {
  addBookmark: (article: {
    article_url: string;
    title: string;
    source: string;
  }) => Promise<void>;
  removeBookmark: (articleUrl: string, bookmarkId?: number) => Promise<void>;
  checkBookmarked: (articleUrl: string) => Promise<boolean>;
  isProcessing: boolean;
}

export const useOfflineBookmarks = (): UseOfflineBookmarksResult => {
  const [isProcessing, setIsProcessing] = useState(false);

  const addBookmark = useCallback(async (article: {
    article_url: string;
    title: string;
    source: string;
  }) => {
    setIsProcessing(true);
    try {
      // Cache locally first
      await cacheBookmark({
        article_url: article.article_url,
        title: article.title,
        source: article.source,
        saved_at: new Date().toISOString()
      });

      // Try to sync immediately if online
      if (navigator.onLine) {
        try {
          await request('/bookmarks', {
            method: 'POST',
            body: JSON.stringify(article)
          });
        } catch (error) {
          // Failed to sync, add to pending actions
          console.warn('Failed to sync bookmark, adding to queue:', error);
          await addPendingAction('bookmark', article);
        }
      } else {
        // Offline, add to pending actions
        await addPendingAction('bookmark', article);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const removeBookmark = useCallback(async (articleUrl: string, bookmarkId?: number) => {
    setIsProcessing(true);
    try {
      // Remove from local cache
      await removeCachedBookmark(articleUrl);

      // Try to sync immediately if online
      if (navigator.onLine && bookmarkId) {
        try {
          await request(`/bookmarks/${bookmarkId}`, {
            method: 'DELETE'
          });
        } catch (error) {
          // Failed to sync, add to pending actions
          console.warn('Failed to sync bookmark removal, adding to queue:', error);
          await addPendingAction('unbookmark', { id: bookmarkId });
        }
      } else if (bookmarkId) {
        // Offline, add to pending actions
        await addPendingAction('unbookmark', { id: bookmarkId });
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const checkBookmarked = useCallback(async (articleUrl: string): Promise<boolean> => {
    return isArticleBookmarked(articleUrl);
  }, []);

  return {
    addBookmark,
    removeBookmark,
    checkBookmarked,
    isProcessing
  };
};
