'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@/contexts/AuthContext';

// Helper function to safely add class to document element
function addDarkClass() {
  // Only run on client-side
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
}

// Navigation handler component
function NavigationHandler({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Wrap the component that uses useSearchParams in Suspense
function ClientLayoutContent({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900"></div>}>
      <NavigationHandler>
        {children}
      </NavigationHandler>
    </Suspense>
  );
}

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Enforce dark theme
  useEffect(() => {
    addDarkClass();
    // Force dark mode on html element
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
    
    // Prevent theme switching
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (!document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark');
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <ClientLayoutContent>
          <main className="min-h-screen">
            {children}
          </main>
          <SpeedInsights />
          <Analytics />
        </ClientLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  );
}
