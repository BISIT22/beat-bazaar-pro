// Lightweight IndexedDB helper for storing audio blobs locally.
const DB_NAME = 'beatmarket-audio';
const STORE_NAME = 'audio';
const WAV_STORE_NAME = 'audio-wav';

type StoreName = typeof STORE_NAME | typeof WAV_STORE_NAME;

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(WAV_STORE_NAME)) {
        db.createObjectStore(WAV_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const putBlob = async (store: StoreName, key: string, blob: Blob) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const getBlob = async (store: StoreName, key: string) => {
  const db = await openDB();
  return new Promise<Blob | undefined>((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
};

const deleteBlob = async (store: StoreName, key: string) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const saveAudioBlob = (beatId: string, file: File) => putBlob(STORE_NAME, beatId, file);
export const saveWavBlob = (beatId: string, file: File) => putBlob(WAV_STORE_NAME, beatId, file);

export const getAudioObjectUrl = async (beatId: string) => {
  const blob = await getBlob(STORE_NAME, beatId);
  return blob ? URL.createObjectURL(blob) : undefined;
};

export const getWavObjectUrl = async (beatId: string) => {
  const blob = await getBlob(WAV_STORE_NAME, beatId);
  return blob ? URL.createObjectURL(blob) : undefined;
};

export const deleteAudioBlobs = async (beatId: string) => {
  await Promise.all([deleteBlob(STORE_NAME, beatId), deleteBlob(WAV_STORE_NAME, beatId)]);
};

