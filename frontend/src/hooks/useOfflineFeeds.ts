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

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if app is installed (PWA mode)
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;

      // If online, always fetch from network (even if installed)
      if (navigator.onLine) {
        try {
          const response = await request('/feeds');
          const freshFeeds = response.articles || [];
          
          // Cache the fresh data only if installed
          if (isInstalled) {
            await cacheFeeds(freshFeeds);
          }
          
          setFeeds(freshFeeds);
          setIsCached(false);
          setIsOffline(false);
          setLastUpdate(new Date());
        } catch (networkError) {
          // Network request failed
          console.warn('Network request failed:', networkError);
          setIsOffline(true);
          
          // Only fallback to cache if app is installed
          if (isInstalled) {
            // Try to load from cache
            const cachedData = await getCachedFeeds();
            if (cachedData.length > 0) {
              setFeeds(cachedData);
              setIsCached(true);
              const lastUpdateTime = await getLastFeedUpdate();
              setLastUpdate(lastUpdateTime ? new Date(lastUpdateTime) : null);
            } else {
              throw new Error('No cached data available');
            }
          } else {
            // Not installed, show error instead of using cache
            throw networkError;
          }
        }
      } else {
        // Offline
        setIsOffline(true);
        
        // Only use cached data if app is installed
        if (isInstalled) {
          const cachedData = await getCachedFeeds();
          const lastUpdateTime = await getLastFeedUpdate();
          
          if (cachedData.length > 0) {
            setFeeds(cachedData);
            setIsCached(true);
            setLastUpdate(lastUpdateTime ? new Date(lastUpdateTime) : null);
          } else {
            setError('No cached data available. Please connect to the internet.');
          }
        } else {
          // Not installed, require internet connection
          setError('Please connect to the internet to view feeds.');
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
      fetchFeeds(); // Fetch when coming back online
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
    refetch: () => fetchFeeds()
  };
};
