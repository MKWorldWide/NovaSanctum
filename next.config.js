/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['localhost', '*.amplifyapp.com'],
    unoptimized: true
  },
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig 