import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { hasPendingActions, triggerSync } from '../utils/syncManager';
import { getCacheStats } from '../utils/offlineStorage';

export default function SyncIndicator() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cacheAge, setCacheAge] = useState<number | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    const installed = window.matchMedia('(display-mode: standalone)').matches ||
                     (window.navigator as any).standalone === true;
    setIsInstalled(installed);
  }, []);

  const checkPending = async () => {
    const hasPending = await hasPendingActions();
    if (hasPending) {
      const stats = await getCacheStats();
      setPendingCount(stats.pendingActionsCount);
      setCacheAge(stats.cacheAge);
    } else {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    checkPending();

    // Listen for sync completion
    const handleSyncComplete = () => {
      setLastSync(new Date());
      checkPending();
    };

    window.addEventListener('sync-complete', handleSyncComplete);
    
    // Check periodically
    const interval = setInterval(checkPending, 10000); // Every 10 seconds

    return () => {
      window.removeEventListener('sync-complete', handleSyncComplete);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (!navigator.onLine) {
      return;
    }

    setIsSyncing(true);
    try {
      const result = await triggerSync();
      setLastSync(new Date());
      console.log('Manual sync complete:', result);
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
      checkPending();
    }
  };

  const formatCacheAge = (ms: number | null) => {
    if (!ms) return 'Unknown';
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Only show sync indicator if app is installed
  if (!isInstalled || (pendingCount === 0 && !showDetails)) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-40">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-colors ${
          pendingCount > 0
            ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100'
            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
        }`}
      >
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : pendingCount > 0 ? (
          <Clock className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isSyncing ? 'Syncing...' : pendingCount > 0 ? `${pendingCount} pending` : 'Synced'}
        </span>
      </button>

      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Sync Status
              </h3>
              
              {pendingCount > 0 ? (
                <div className="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{pendingCount} actions pending</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Will sync when back online
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>All changes synced</p>
                </div>
              )}
            </div>

            {cacheAge !== null && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p>Cache age: {formatCacheAge(cacheAge)}</p>
              </div>
            )}

            {lastSync && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p>Last sync: {lastSync.toLocaleTimeString()}</p>
              </div>
            )}

            {navigator.onLine && pendingCount > 0 && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium rounded-md transition-colors"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
