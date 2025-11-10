// This is a dynamic route that will be replaced during build time for static export

// In development or server-side rendering, use the real auth handler
if (process.env.NEXT_PHASE !== 'phase-export') {
  import('@/lib/auth-options').then(({ authOptions }) => {
    const NextAuth = require('next-auth').default;
    const handler = NextAuth(authOptions);
    
    module.exports = { 
      GET: handler, 
      POST: handler,
      // Explicitly mark as dynamic for development
      dynamic: 'force-dynamic'
    };
  });
} else {
  // In static export, use the static version
  const { GET, POST } = require('./static-route');
  
  module.exports = { 
    GET, 
    POST,
    // For static export
    dynamic: 'auto'
  };
}
