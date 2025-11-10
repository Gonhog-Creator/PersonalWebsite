import { authOptions } from '@/lib/auth-options';
import NextAuth from 'next-auth';

// Create the auth handler
const handler = NextAuth(authOptions);

export const dynamic = 'force-dynamic'; // This ensures the route is not statically generated

export { 
  handler as GET, 
  handler as POST
};

// Note: The static-route.ts file is no longer needed and can be removed
