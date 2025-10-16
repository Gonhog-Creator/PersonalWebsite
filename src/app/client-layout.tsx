'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Create a wrapper component that uses the navigation hooks
function NavigationHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// Wrap the component that uses useSearchParams in Suspense
function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900"></div>}>
      <NavigationHandler>
        {children}
      </NavigationHandler>
    </Suspense>
  );
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Set dark theme on the root element
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return <ClientLayoutContent>{children}</ClientLayoutContent>;
}
