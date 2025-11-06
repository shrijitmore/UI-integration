const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

async function getKey() {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("static-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const encoded = encoder.encode(JSON.stringify(data));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  });
}

export async function decryptData(encryptedJson) {
  try {
    const { iv, data } = JSON.parse(encryptedJson);
    const key = await getKey();
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      new Uint8Array(data)
    );

    return JSON.parse(decoder.decode(decrypted));
  } catch (err) {
    console.error("Failed to decrypt:", err);
    return null;
  }
}
