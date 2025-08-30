/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const isGHPages = process.env.GH_PAGES === 'true';
const repo = 'PersonalWebsite';

// For GitHub Pages deployment
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// Use empty basePath for custom domain, otherwise use repo name for GitHub Pages
const basePath = isGithubActions && process.env.USE_CUSTOM_DOMAIN !== 'true' ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '/',
  
  // For static export with images
  images: {
    unoptimized: true,
    // Disable image optimization since we're using static export
    loader: 'default',
    // Ensure paths are relative for static export
    path: basePath ? `${basePath}/_next/image` : '/_next/image',
  },
  
  // Configure output file tracing
  outputFileTracingRoot: path.join(__dirname, '../../'),
  
  trailingSlash: true,
  reactStrictMode: true,
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: isGithubActions && process.env.USE_CUSTOM_DOMAIN === 'true' 
      ? 'https://www.josebarbeito.com' 
      : basePath ? `https://gonhog-creator.github.io${basePath}` : 'http://localhost:3000',
  },
  
  // Webpack configuration for handling specific modules
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
};

// For local development, we need to handle the base path differently
if (!isGHPages && isProd) {
  nextConfig.basePath = '';
  nextConfig.assetPrefix = '';
}

module.exports = nextConfig;
