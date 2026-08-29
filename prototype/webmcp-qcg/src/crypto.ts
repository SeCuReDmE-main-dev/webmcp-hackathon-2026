export async function digestBytes(bytes: Uint8Array): Promise<string> {
  const copy = new Uint8Array(bytes)
  const hashed = await crypto.subtle.digest('SHA-256', copy.buffer)
  return [...new Uint8Array(hashed)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function digest(value: unknown): Promise<string> {
  return digestBytes(new TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value)))
}

export function id(prefix: string, entropy: string): string {
  return `${prefix}-${entropy.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 24)}`
}
