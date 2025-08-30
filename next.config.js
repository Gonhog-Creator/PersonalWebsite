/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGHPages = process.env.GH_PAGES === 'true';
const repo = 'PersonalWebsite';

// Only use basePath when deploying to GitHub Pages
const basePath = isGHPages ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  
  // For static export
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
  reactStrictMode: true,
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
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
