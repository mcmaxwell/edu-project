import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Anchor file-trace at the monorepo root so Vercel doesn't pick the wrong lockfile.
  outputFileTracingRoot: resolve(__dirname, '../..'),
  transpilePackages: ['@inkprint/tokens', '@inkprint/ui', '@inkprint/db', '@inkprint/providers'],
}

export default nextConfig
