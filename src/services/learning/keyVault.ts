const STORAGE_KEY = 'novasanctum.byo_api_key.v1';

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(input: string): Uint8Array {
  const binary = atob(input);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: asArrayBuffer(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function saveEncryptedByoKey(apiKey: string, passphrase: string): Promise<void> {
  if (!apiKey.trim() || !passphrase.trim()) return;

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: asArrayBuffer(iv) },
    key,
    new TextEncoder().encode(apiKey)
  );

  const payload = {
    iv: toBase64(iv),
    salt: toBase64(salt),
    data: toBase64(new Uint8Array(encrypted)),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function loadEncryptedByoKey(passphrase: string): Promise<string> {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    throw new Error('No saved key found on this device.');
  }
  const payload = JSON.parse(raw) as { iv: string; salt: string; data: string };
  const key = await deriveKey(passphrase, fromBase64(payload.salt));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: asArrayBuffer(fromBase64(payload.iv)) },
    key,
    asArrayBuffer(fromBase64(payload.data))
  );
  return new TextDecoder().decode(decrypted);
}

export function clearSavedByoKey(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedByoKey(): boolean {
  return Boolean(window.localStorage.getItem(STORAGE_KEY));
}
