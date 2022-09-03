/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
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

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
