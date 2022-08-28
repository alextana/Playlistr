/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['mosaic.scdn.co', 'lineup-images.scdn.co']
  },
  experimental: {
    images: {
      allowFutureImage: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.scdn.co',
        },
      ],
    }
  },
}

module.exports = nextConfig
