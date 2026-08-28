export interface HistoryNote {
  id: string;
  midi: number;
  name: string;
  inKey: boolean;
  keyName: string;
  playedAt: string;
}

export interface SavedState {
  keyName: string;
  mode: 'major' | 'minor';
  bpm: number;
  history: HistoryNote[];
}

const DB_NAME = 'theory-sidecar-v1';
const STORE = 'practice';

function openDb(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadState(): Promise<SavedState | null> {
  const db = await openDb();
  return new Promise<SavedState | null>((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get('current');
    request.onsuccess = () => resolve((request.result as SavedState | undefined) ?? null);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

export async function saveState(state: SavedState): Promise<void> {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(state, 'current');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }).finally(() => db.close());
}

export async function clearState(): Promise<void> {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }).finally(() => db.close());
}
