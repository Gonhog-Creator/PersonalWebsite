/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

// Security headers
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, must-revalidate',
  },
];

module.exports = {
  // Basic configuration
  trailingSlash: true,
  generateEtags: true,
  compress: true,
  
  // Image optimization
  images: {
    domains: ['josebarbeito.com', 'm.media-amazon.com', 'image.tmdb.org', 'via.placeholder.com'],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  },
  
  // Build optimizations
  reactStrictMode: true,
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Configure ESLint
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Enable webpack's filesystem cache in production
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        },
        name: isServer ? 'server' : 'client'
      };
    }
    
    // Add asset handling
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name].[hash][ext]'
      }
    });
    
    return config;
  }
};
