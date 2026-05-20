import 'server-only'
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'node:crypto'

/**
 * AES-256-GCM encryption for BYOK API keys.
 *
 * Local dev: 32-byte master key in INKPRINT_MASTER_KEY (base64).
 * Production: replace with AWS KMS envelope encryption — same Encrypted output
 * shape, different key source. Keep the rest of the codebase unchanged.
 */

const ALGO = 'aes-256-gcm'
const IV_LEN = 12

export type Encrypted = {
  ciphertext: Buffer
  iv: Buffer
  authTag: Buffer
}

function getMasterKey(): Buffer {
  const raw = process.env.INKPRINT_MASTER_KEY
  if (!raw) throw new Error('INKPRINT_MASTER_KEY is not set')
  const key = Buffer.from(raw, 'base64')
  if (key.length !== 32) {
    throw new Error('INKPRINT_MASTER_KEY must decode to 32 bytes')
  }
  return key
}

export function encrypt(plaintext: string): Encrypted {
  const key = getMasterKey()
  const iv = randomBytes(IV_LEN)
  const cipher = createCipheriv(ALGO, key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return { ciphertext, iv, authTag }
}

export function decrypt(enc: Encrypted): string {
  const key = getMasterKey()
  const decipher = createDecipheriv(ALGO, key, enc.iv)
  decipher.setAuthTag(enc.authTag)
  const plain = Buffer.concat([decipher.update(enc.ciphertext), decipher.final()])
  return plain.toString('utf8')
}

export function fingerprint(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex')
}

export function lastFour(plaintext: string): string {
  const cleaned = plaintext.replace(/\s+/g, '')
  return `••••${cleaned.slice(-4)}`
}
