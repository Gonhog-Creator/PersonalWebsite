import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  
  // Handle static export for auth routes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/api/auth/')) {
      router.push('/404');
    }
  }, [router]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
