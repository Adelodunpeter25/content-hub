/**
 * Background sync manager for offline actions
 */

import { request } from '../services/api';
import {
  getPendingActions,
  removePendingAction,
  updatePendingActionRetries,
  type PendingAction
} from './offlineStorage';

const MAX_RETRIES = 3;

/**
 * Sync a single pending action
 */
const syncAction = async (action: PendingAction): Promise<boolean> => {
  try {
    switch (action.type) {
      case 'bookmark':
        await request('/bookmarks', {
          method: 'POST',
          body: JSON.stringify(action.data)
        });
        break;

      case 'unbookmark':
        await request(`/bookmarks/${action.data.id}`, {
          method: 'DELETE'
        });
        break;

      case 'read':
        await request('/read-history', {
          method: 'POST',
          body: JSON.stringify(action.data)
        });
        break;

      default:
        console.warn('Unknown action type:', action.type);
        return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to sync action:', action.type, error);
    return false;
  }
};

/**
 * Sync all pending actions
 */
export const syncPendingActions = async (): Promise<{
  synced: number;
  failed: number;
  total: number;
}> => {
  const actions = await getPendingActions();
  let synced = 0;
  let failed = 0;

  for (const action of actions) {
    if (!action.id) continue;

    const success = await syncAction(action);

    if (success) {
      await removePendingAction(action.id);
      synced++;
    } else {
      if (action.retries < MAX_RETRIES) {
        await updatePendingActionRetries(action);
      } else {
        // Max retries reached, remove action
        await removePendingAction(action.id);
        console.warn('Max retries reached for action:', action);
      }
      failed++;
    }
  }

  return {
    synced,
    failed,
    total: actions.length
  };
};

/**
 * Setup automatic sync when online
 */
export const setupAutoSync = () => {
  // Sync when coming back online
  window.addEventListener('online', async () => {
    console.log('Back online, syncing pending actions...');
    const result = await syncPendingActions();
    console.log('Sync complete:', result);
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('sync-complete', { detail: result }));
  });

  // Periodic sync when online (every 5 minutes)
  setInterval(async () => {
    if (navigator.onLine) {
      const result = await syncPendingActions();
      if (result.synced > 0) {
        console.log('Background sync complete:', result);
        window.dispatchEvent(new CustomEvent('sync-complete', { detail: result }));
      }
    }
  }, 5 * 60 * 1000);
};

/**
 * Manual sync trigger
 */
export const triggerSync = async (): Promise<{
  synced: number;
  failed: number;
  total: number;
}> => {
  if (!navigator.onLine) {
    throw new Error('Cannot sync while offline');
  }

  return syncPendingActions();
};

/**
 * Check if there are pending actions
 */
export const hasPendingActions = async (): Promise<boolean> => {
  const actions = await getPendingActions();
  return actions.length > 0;
};
