/** @type {import('next').NextConfig} */
const path = require('path');
const webpack = require('webpack');

// Environment variables
const isProd = process.env.NODE_ENV === 'production';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const useCustomDomain = process.env.USE_CUSTOM_DOMAIN === 'true';
const isVercel = process.env.VERCEL === '1';
const isGhPages = process.env.GH_PAGES === 'true';
const isStaticExport = process.env.NEXT_PHASE === 'phase-export';

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
console.log('- isStaticExport:', isStaticExport);
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
  
  // Skip API routes during export
  skipTrailingSlashRedirect: true,
  
  // Disable React strict mode for static export
  reactStrictMode: false,
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: useCustomDomain ? 'https://www.josebarbeito.com' : basePath,
  },
  
  // Webpack configuration
  webpack: (config, { isServer, dev, isServerRuntimeConfig }) => {
    // Add a rule to handle static files
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
    });

    // Handle environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.IS_SERVER': JSON.stringify(isServer),
        'process.env.IS_STATIC_EXPORT': JSON.stringify(isStaticExport),
      })
    );

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
  
  // Export path map for static generation
  exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    if (isStaticExport) {
      // For static export, exclude API routes
      Object.keys(defaultPathMap).forEach(route => {
        if (route.startsWith('/api/')) {
          delete defaultPathMap[route];
        }
      });
    }
    
    // Add custom redirects for auth routes
    defaultPathMap['/api/auth/[...nextauth]'] = {
      page: '/404',
      query: { from: 'auth' }
    };
    
    // Add redirect for ingredients API
    defaultPathMap['/api/ingredients'] = {
      page: '/404',
      query: { from: 'api-ingredients' }
    };
    
    return defaultPathMap;
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
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
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
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  
  // Experimental features
  experimental: {
    // Enable server components (if needed)
    serverComponents: false,
    // Enable concurrent features (if needed)
    concurrentFeatures: false,
  },
  
  // Custom error pages
  customError: {
    404: '/404',
    500: '/500',
  },
  
  // Production browser source maps (disabled for better performance)
  productionBrowserSourceMaps: false,
  
  // Disable compression in development
  compress: isProd,
  
  // Enable React's Strict Mode
  reactStrictMode: true,
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Enable SWC minification
  swcMinify: true,
  
  // Configure static export behavior
  distDir: isStaticExport ? 'out' : '.next',
  
  // Configure static page generation timeout (in seconds)
  staticPageGenerationTimeout: 60,
  
  // Configure webpack5
  webpack5: true,
  
  // Configure output file tracing
  outputFileTracing: true,
  
  // Configure output directory for static export
  output: 'export',
  
  // Configure images
  images: {
    unoptimized: true,
    domains: [
      'm.media-amazon.com',
      'image.tmdb.org',
      'via.placeholder.com',
      'www.josebarbeito.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configure redirects
  async redirects() {
    return [
      // Add any custom redirects here
      // Example:
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },
  
  // Configure rewrites (not used in static export)
  async rewrites() {
    if (isStaticExport) {
      return [];
    }
    
    return [
      // Add any API rewrites here
    ];
  },
  
  // Configure server runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
  },
  
  // Configure public runtime configuration
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    basePath,
    assetPrefix,
    isStaticExport,
  },
  
  // Configure TypeScript
  typescript: {
    // Enable TypeScript type checking during build
    ignoreBuildErrors: false,
    // Enable TypeScript's strict mode
    strict: true,
    // Enable TypeScript's noEmitOnError
    noEmitOnError: true,
  },
  
  // Configure ESLint
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Configure webpack bundle analyzer
  webpack: (config, { isServer, dev, isServerRuntimeConfig }) => {
    // Add a rule to handle static files
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/i,
      type: 'asset/resource',
    });

    // Handle environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        'process.env.IS_SERVER': JSON.stringify(isServer),
        'process.env.IS_STATIC_EXPORT': JSON.stringify(isStaticExport),
      })
    );

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

    // Add bundle analyzer in development
    if (process.env.ANALYZE) {
      const withBundleAnalyzer = require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
      });
      config = withBundleAnalyzer(config);
    }

    return config;
  },
};

// Export the configuration
module.exports = nextConfig;
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