/** @type {import('next').NextConfig} */
const path = require('path');

// Environment variables
const isProd = process.env.NODE_ENV === 'production';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const useCustomDomain = process.env.USE_CUSTOM_DOMAIN === 'true';

// Base configuration
let basePath = '';
let assetPrefix = '';

// For GitHub Pages with custom domain
if (isGithubActions && useCustomDomain) {
  basePath = '';
  assetPrefix = '';
} 
// For GitHub Pages without custom domain
else if (isGithubActions) {
  const repo = 'PersonalWebsite';
  basePath = `/${repo}`;
  assetPrefix = `/${repo}/`;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  basePath = '';
  assetPrefix = '';
}

const nextConfig = {
  // Static export configuration
  output: 'export',
  distDir: 'out',
  basePath: basePath,
  assetPrefix: assetPrefix,
  trailingSlash: true,
  
  // Image optimization for static export
  images: {
    unoptimized: true,
    loader: 'default',
    path: basePath ? `${basePath}/_next/image` : '/_next/image',
  },
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: useCustomDomain 
      ? 'https://www.josebarbeito.com' 
      : basePath 
        ? `https://gonhog-creator.github.io${basePath}` 
        : 'http://localhost:3000',
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that might be problematic in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Handle canvas module if needed
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    return config;
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  
  // Disable ETag generation
  generateEtags: false,
  
  // Disable powered by header
  poweredByHeader: false,
  
  // Output file tracing configuration
  outputFileTracingRoot: path.join(__dirname, '../../'),
  
  // Enable static optimization
  experimental: {
    optimizeCss: true,
  },
};

// For local development, ensure base paths are empty
if (!isGHPages && !isGithubActions) {
  nextConfig.basePath = '';
  nextConfig.assetPrefix = '';
  nextConfig.env.NEXT_PUBLIC_BASE_PATH = '';
}

module.exports = nextConfig;
