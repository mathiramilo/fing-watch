/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', '127.0.0.1', 'nginx']
  },
  output: 'standalone',
}

module.exports = nextConfig
