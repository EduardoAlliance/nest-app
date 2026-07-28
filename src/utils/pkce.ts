function base64UrlEncode(buffer: Uint8Array): string {
  const bytes = Array.from(new Uint8Array(buffer))
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(new Uint8Array(digest))
}

export function generateCodeVerifier(): string {
  const array = new Uint8Array(128)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}
