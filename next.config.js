/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'PersonalWebsite';

const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  
  // For static export
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
  reactStrictMode: true,
  
  // Webpack configuration for handling specific modules
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that might be problematic in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    // Handle canvas module if needed
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    return config;
  },
};

module.exports = nextConfig;
