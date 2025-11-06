import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Helper to get the base URL
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

const baseUrl = getBaseUrl();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow sign in for admin users
      if (user.email === process.env.ADMIN_EMAIL) {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
      // Add admin role to the token
      if (user?.email === process.env.ADMIN_EMAIL) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to the session
      if (session?.user) {
        session.user.role = token.role || 'user';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after sign in
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
