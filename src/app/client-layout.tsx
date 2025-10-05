'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';

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

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure we're in the browser before rendering navigation-dependent components
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  return (
    <ThemeProvider>
      <NavigationHandler>
        {children}
      </NavigationHandler>
    </ThemeProvider>
  );
}
