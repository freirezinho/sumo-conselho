import { initDB } from '../infra/db/init_db';
import { printDebug } from '../utils/print_debug';

const STORE_NAME = 'cacheStore';

export function useCache() {

  /**
   * Caches data with a specific ID.
   * @param {string} id - The unique identifier for the data.
   * @param {unknown} data - The data to be cached.
   */
  const cacheData = async (id: string, data: unknown) => {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      await store.put({ id, data, timestamp: new Date().getTime() });
      
      await tx.done;
      printDebug(`Data cached with ID: ${id}`);
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  /**
   * Retrieves cached data by its ID.
   * @param {string} id - The unique identifier for the data.
   * @returns {Promise<unknown|null>} The cached data or null if not found.
   */
  const getCachedData = async (id: string) => {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      
      const cacheEntry = await store.get(id);
      
      await tx.done;
      
      return cacheEntry ? cacheEntry.data : null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  };

  /**
   * Clears cached items older than a specified age.
   * @param {number} maxAgeInMinutes - The maximum age in minutes.
   */
  const clearExpiredCache = async (maxAgeInMinutes: number) => {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const cutoffTime = new Date().getTime() - maxAgeInMinutes * 60 * 1000;
      
      let cursor = await store.openCursor();
      
      while (cursor) {
        if (cursor.value.timestamp < cutoffTime) {
          await cursor.delete();
          printDebug(`Deleted expired cache item with ID: ${cursor.key}`);
        }
        cursor = await cursor.continue();
      }
      
      await tx.done;
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  };

  return { cacheData, getCachedData, clearExpiredCache };
}