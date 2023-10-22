/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost:80']
  },
  output: 'standalone',
}

module.exports = nextConfig
