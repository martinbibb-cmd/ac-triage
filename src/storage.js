import { createEmptyOutsideUnit, sampleCase } from "./domain.js";

const DB_NAME = "air-con-triage";
const DB_VERSION = 1;
const CASE_STORE = "cases";
const SETTINGS_STORE = "settings";

export async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CASE_STORE)) {
        db.createObjectStore(CASE_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadCases() {
  const db = await openDatabase();
  const seeded = await getSetting(db, "sampleDataSeeded");
  if (!seeded) {
    await saveCase(sampleCase());
    await setSetting(db, "sampleDataSeeded", true);
  }

  return transactionRequest(db, CASE_STORE, "readonly", (store) => store.getAll())
    .then((cases) => cases.map(normalizeCase).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
}

export async function saveCase(caseData) {
  const db = await openDatabase();
  const next = { ...caseData, updatedAt: new Date().toISOString() };
  await transactionRequest(db, CASE_STORE, "readwrite", (store) => store.put(next));
  return next;
}

function normalizeCase(caseData) {
  const outsideUnit = { ...createEmptyOutsideUnit(), ...(caseData.outsideUnit ?? {}) };
  if (!outsideUnit.location) {
    const oldRoomLocation = caseData.rooms?.find((room) => room.externalLocation)?.externalLocation;
    outsideUnit.location = oldRoomLocation ?? "";
  }
  return { ...caseData, outsideUnit };
}

export async function deleteCase(id) {
  const db = await openDatabase();
  await transactionRequest(db, CASE_STORE, "readwrite", (store) => store.delete(id));
}

function getSetting(db, key) {
  return transactionRequest(db, SETTINGS_STORE, "readonly", (store) => store.get(key))
    .then((result) => result?.value);
}

function setSetting(db, key, value) {
  return transactionRequest(db, SETTINGS_STORE, "readwrite", (store) => store.put({ key, value }));
}

function transactionRequest(db, storeName, mode, action) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}
