/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@inkprint/tokens', '@inkprint/ui', '@inkprint/db'],
}

export default nextConfig
