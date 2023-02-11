/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FRONTEND_URL: process.env.FRONTEND_URL
  }
}

module.exports = nextConfig
