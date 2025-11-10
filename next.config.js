/** @type {import('next').NextConfig} */
const path = require('path');
const webpack = require('webpack');

// Environment variables
const isProd = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Base configuration
const basePath = '';
const assetPrefix = '';

const nextConfig = {
  // Base configuration
  basePath,
  assetPrefix,
  trailingSlash: true,
  
  // Image configuration
  images: {
    unoptimized: true,
    domains: ['www.josebarbeito.com', 'josebarbeito.com'],
    remotePatterns: [
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
      {
        protocol: 'https',
        hostname: 'www.josebarbeito.com',
      },
    ],
  },
  
  // Disable React strict mode for static export
  reactStrictMode: false,
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  // Webpack configuration
  webpack: (config, { isServer, isServerRuntimeConfig }) => {
    // Webpack configuration for both server and client
    // Note: Removed static export specific code since we're not using it anymore
    // Add a rule to handle static files
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
    });

    // Handle Node.js modules that might be problematic in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        url: false,
        buffer: false,
        util: false,
        assert: false,
        events: false,
        string_decoder: false,
        timers: false,
      };
    }

    // Handle canvas module if needed
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];

    // Handle environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.IS_SERVER': JSON.stringify(isServer)
      })
    );

    return config;
  },
  
  // Configure static page generation timeout (in seconds)
  staticPageGenerationTimeout: 60,
  
  // Server components external packages
  serverExternalPackages: ['canvas'],
  
  // Production browser source maps (disabled for better performance)
  productionBrowserSourceMaps: false,
  
  // Disable compression in development
  compress: isProd,
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;