/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['s3.us-east-2.amazonaws.com', 'www.collective.gg', 'cdn.discordapp.com', 'files.collective.gg']
  }
}

module.exports = nextConfig