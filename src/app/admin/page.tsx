'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the callback URL and error from query parameters
  const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard';
  const errorParam = searchParams?.get('error');
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [status, session, router]);

  // Handle redirects and errors
  useEffect(() => {
    console.log('Admin login status:', { status, role: session?.user?.role });
    
    if (status === 'authenticated') {
      console.log('User is authenticated, checking role...');
      if (session?.user?.role === 'admin') {
        console.log('User is admin, redirecting to:', callbackUrl);
        // Use replace instead of push to prevent back button issues
        router.replace(callbackUrl);
      } else {
        console.log('User is not an admin');
        setError('You do not have permission to access the admin dashboard');
      }
    } else if (status === 'unauthenticated' && errorParam) {
      console.log('Authentication error:', errorParam);
      setError(
        errorParam === 'Unauthorized' 
          ? 'This email is not authorized to access the admin dashboard.'
          : 'An error occurred during sign in.'
      );
    }
  }, [status, session, router, callbackUrl, errorParam]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signIn('google', { 
        callbackUrl,
        redirect: true 
      });
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your admin account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
