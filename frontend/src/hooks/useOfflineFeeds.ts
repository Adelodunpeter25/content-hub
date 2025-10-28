/**
 * Hook for offline-first feed fetching
 */

import { useState, useEffect } from 'react';
import { request } from '../services/api';
import {
  getCachedFeeds,
  cacheFeeds,
  getLastFeedUpdate,
  type CachedFeed
} from '../utils/offlineStorage';

interface UseOfflineFeedsResult {
  feeds: CachedFeed[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  isCached: boolean;
  lastUpdate: Date | null;
  refetch: () => Promise<void>;
}

export const useOfflineFeeds = (): UseOfflineFeedsResult => {
  const [feeds, setFeeds] = useState<CachedFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCached, setIsCached] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchFeeds = async (forceNetwork = false) => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from cache first (offline-first approach)
      if (!forceNetwork) {
        const cachedData = await getCachedFeeds();
        const lastUpdateTime = await getLastFeedUpdate();
        
        if (cachedData.length > 0) {
          setFeeds(cachedData);
          setIsCached(true);
          setLastUpdate(lastUpdateTime ? new Date(lastUpdateTime) : null);
          setLoading(false);
        }
      }

      // Try to fetch fresh data if online
      if (navigator.onLine) {
        try {
          const response = await request('/feeds');
          const freshFeeds = response.articles || [];
          
          // Cache the fresh data
          await cacheFeeds(freshFeeds);
          
          setFeeds(freshFeeds);
          setIsCached(false);
          setIsOffline(false);
          setLastUpdate(new Date());
        } catch (networkError) {
          // Network request failed, use cached data
          console.warn('Network request failed, using cached data:', networkError);
          setIsOffline(true);
          
          if (feeds.length === 0) {
            // No cached data available
            const cachedData = await getCachedFeeds();
            if (cachedData.length > 0) {
              setFeeds(cachedData);
              setIsCached(true);
            } else {
              throw new Error('No cached data available');
            }
          }
        }
      } else {
        // Offline, use cached data
        setIsOffline(true);
        const cachedData = await getCachedFeeds();
        
        if (cachedData.length > 0) {
          setFeeds(cachedData);
          setIsCached(true);
        } else {
          setError('No cached data available. Please connect to the internet.');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feeds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      fetchFeeds(true); // Force network fetch when coming back online
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    feeds,
    loading,
    error,
    isOffline,
    isCached,
    lastUpdate,
    refetch: () => fetchFeeds(true)
  };
};
