// Camada de armazenamento com fallback.
// Tenta usar o armazenamento persistente do artifact (window.storage).
// Se não estiver disponível (ex.: rodando fora do ambiente do Claude),
// cai para memória local do módulo, para que a aplicação nunca quebre —
// apenas não persiste entre recarregamentos de página nesse caso.

const memoryStore = new Map();
export let persistentStorageOK = true;

export async function storeGet(key) {
  try {
    if (window.storage && typeof window.storage.get === 'function') {
      return await window.storage.get(key, true);
    }
  } catch (e) {
    // cai para o fallback abaixo
  }
  if (memoryStore.has(key)) {
    return { key, value: memoryStore.get(key), shared: true };
  }
  throw new Error('not-found');
}

export async function storeSet(key, value) {
  try {
    if (window.storage && typeof window.storage.set === 'function') {
      const r = await window.storage.set(key, value, true);
      if (r) return r;
    }
  } catch (e) {
    persistentStorageOK = false;
  }
  memoryStore.set(key, value);
  return { key, value, shared: true };
}

export async function storeList(prefix) {
  try {
    if (window.storage && typeof window.storage.list === 'function') {
      return await window.storage.list(prefix, true);
    }
  } catch (e) {
    // cai para o fallback abaixo
  }
  const keys = Array.from(memoryStore.keys()).filter((k) => k.indexOf(prefix) === 0);
  return { keys };
}
