/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/PersonalWebsite' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/PersonalWebsite/' : '',
  images: {
    unoptimized: true,
  },
  // Optional: Add this if you're using environment variables
  env: {
    // Add any environment variables here
  },
};

module.exports = nextConfig;
