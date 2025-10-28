/**
 * IndexedDB wrapper for offline storage
 */

const DB_NAME = 'ContentHubDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  FEEDS: 'feeds',
  BOOKMARKS: 'bookmarks',
  READ_HISTORY: 'readHistory',
  PENDING_ACTIONS: 'pendingActions',
  METADATA: 'metadata'
};

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Feeds store - stores all fetched articles
      if (!db.objectStoreNames.contains(STORES.FEEDS)) {
        const feedStore = db.createObjectStore(STORES.FEEDS, { keyPath: 'link' });
        feedStore.createIndex('source', 'source', { unique: false });
        feedStore.createIndex('published', 'published', { unique: false });
        feedStore.createIndex('cachedAt', 'cachedAt', { unique: false });
      }

      // Bookmarks store - offline bookmarks
      if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
        const bookmarkStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'article_url' });
        bookmarkStore.createIndex('saved_at', 'saved_at', { unique: false });
      }

      // Read history store - offline read tracking
      if (!db.objectStoreNames.contains(STORES.READ_HISTORY)) {
        const historyStore = db.createObjectStore(STORES.READ_HISTORY, { keyPath: 'article_url' });
        historyStore.createIndex('read_at', 'read_at', { unique: false });
      }

      // Pending actions store - actions to sync when online
      if (!db.objectStoreNames.contains(STORES.PENDING_ACTIONS)) {
        const actionStore = db.createObjectStore(STORES.PENDING_ACTIONS, { 
          keyPath: 'id',
          autoIncrement: true 
        });
        actionStore.createIndex('type', 'type', { unique: false });
        actionStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      // Metadata store - cache timestamps and settings
      if (!db.objectStoreNames.contains(STORES.METADATA)) {
        db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Generic get operation
 */
export const getFromStore = async <T>(storeName: string, key: string): Promise<T | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Generic get all operation
 */
export const getAllFromStore = async <T>(storeName: string): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Generic put operation
 */
export const putInStore = async <T>(storeName: string, data: T): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Generic delete operation
 */
export const deleteFromStore = async (storeName: string, key: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Clear entire store
 */
export const clearStore = async (storeName: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Bulk put operation
 */
export const bulkPutInStore = async <T>(storeName: string, items: T[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    let completed = 0;
    const total = items.length;

    if (total === 0) {
      resolve();
      return;
    }

    items.forEach(item => {
      const request = store.put(item);
      request.onsuccess = () => {
        completed++;
        if (completed === total) resolve();
      };
      request.onerror = () => reject(request.error);
    });
  });
};

/**
 * Get items by index
 */
export const getByIndex = async <T>(
  storeName: string, 
  indexName: string, 
  value: string | number
): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};
