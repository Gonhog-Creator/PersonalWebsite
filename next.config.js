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
  // Disable Turbopack and configure webpack
  experimental: {
    webpackBuildWorker: true,
    turbopack: false
  },
  // Basic configuration
  trailingSlash: true,
  generateEtags: true,
  compress: true,
  
  // URL rewrites
  async rewrites() {
    return [
      {
        source: '/foodtree',
        destination: '/side-quests/foodtree',
      },
      {
        source: '/foodtree/:path*',
        destination: '/side-quests/foodtree/:path*',
      },
      {
        source: '/foodtreesubmissions',
        destination: '/api/foodtree/submissions',
      },
    ];
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'josebarbeito.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
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
  
  // Webpack configuration
  webpack(config, { isServer, dev }) {
    // Add chart.js alias if needed
    config.resolve.alias = {
      ...config.resolve.alias,
      'chart.js': 'chart.js/auto',
    };
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
