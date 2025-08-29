/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'PersonalWebsite';

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Optional: Add this if you're using environment variables
  env: {
    // Add any environment variables here
  },
  // Optional: Add this if you're using dynamic routes
  // This will ensure all routes are properly exported
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      // Add other static pages here
      // '/about': { page: '/about' },
    };
  },
};

module.exports = nextConfig;
