/** @type {import('next').NextConfig} */
const path = require('path');

// Environment variables
const isProd = process.env.NODE_ENV === 'production';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const useCustomDomain = process.env.USE_CUSTOM_DOMAIN === 'true';
const isVercel = process.env.VERCEL === '1';
const isGhPages = process.env.GH_PAGES === 'true';

// Base configuration
let basePath = '';
let assetPrefix = '';

// For Vercel deployment
if (isVercel) {
  // Use Vercel's automatic URL detection
  basePath = '';
  assetPrefix = '';
} 
// For GitHub Pages with custom domain
else if (isGhPages && useCustomDomain) {
  basePath = '';
  assetPrefix = '';
}
// For GitHub Pages without custom domain
else if (isGhPages) {
  const repo = 'PersonalWebsite';
  basePath = `/${repo}`;
  assetPrefix = `/${repo}/`;
}

// For local development
if (!isProd && !isGhPages && !isVercel) {
  basePath = '';
  assetPrefix = '';
}

// Log the configuration for debugging
console.log('Next.js Config:');
console.log('- isProd:', isProd);
console.log('- isGithubActions:', isGithubActions);
console.log('- useCustomDomain:', useCustomDomain);
console.log('- isVercel:', isVercel);
console.log('- isGhPages:', isGhPages);
console.log('- basePath:', basePath);
console.log('- assetPrefix:', assetPrefix);

const nextConfig = {
  // Base configuration
  basePath,
  assetPrefix,
  trailingSlash: true,
  
  // Enable static export
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure headers for CORS and security
  async headers() {
    return [
      // CORS headers for API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },

  // Image configuration
  images: {
    unoptimized: true,
    loader: 'default',
    domains: [
      'm.media-amazon.com',
      'image.tmdb.org',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
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

    return config;
  },

  // TypeScript configuration
  typescript: {
    // Enable TypeScript type checking during build
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Configure TypeScript
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
  // Configure webpack module resolution
  experimental: {
    serverComponentsExternalPackages: ['canvas'],
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,

  // Disable ETag generation
  generateEtags: false,
};

module.exports = nextConfig;