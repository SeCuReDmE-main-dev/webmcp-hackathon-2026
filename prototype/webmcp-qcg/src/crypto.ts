export async function digest(value: unknown): Promise<string> {
  const content = new TextEncoder().encode(JSON.stringify(value))
  const bytes = await crypto.subtle.digest('SHA-256', content)
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function id(prefix: string, entropy: string): string {
  return `${prefix}-${entropy.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 20)}`
}
