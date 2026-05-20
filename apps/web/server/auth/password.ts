import 'server-only'
import { hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2'
import { createHash } from 'node:crypto'

const ARGON_OPTS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const

export function hashPassword(plain: string): Promise<string> {
  return argon2Hash(plain, ARGON_OPTS)
}

export function verifyPassword(stored: string, plain: string): Promise<boolean> {
  return argon2Verify(stored, plain, ARGON_OPTS)
}

/**
 * Check the password against HaveIBeenPwned using k-anonymity. We only send
 * the first 5 chars of the SHA-1 hash; the API returns suffixes + counts.
 * Returns the breach count (0 = safe).
 */
export async function checkHIBP(plain: string): Promise<number> {
  const sha1 = createHash('sha1').update(plain).digest('hex').toUpperCase()
  const prefix = sha1.slice(0, 5)
  const suffix = sha1.slice(5)

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      // Don't block signup on HIBP outage.
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) return 0
    const body = await res.text()
    for (const line of body.split('\n')) {
      const [hashSuffix, count] = line.trim().split(':')
      if (hashSuffix === suffix) return Number(count ?? 0)
    }
    return 0
  } catch {
    // Fail-open on network issues. The minimum-length and strength rules still apply.
    return 0
  }
}
