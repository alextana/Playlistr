/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['mosaic.scdn.co', 'lineup-images.scdn.co']
  },
  experimental: {
    images: {
      allowFutureImage: true
    }
  },
}

module.exports = nextConfig
