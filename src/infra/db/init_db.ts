import { openDB } from 'idb';

const DB_NAME = 'br.dev.ssf.hc.sustainingvote';
const STORE_NAME = 'cacheStore';
const DB_VERSION = 1;

export async function initDB() {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // Use 'id' as the keyPath to store multiple, unique items.
                // The data will look like: { id: 'some-unique-id', data: {...}, timestamp: ... }
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
    return db;
}