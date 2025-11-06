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
  // Set dark theme on the root element
  useEffect(() => {
    addDarkClass();
  }, []);

  // Also run on mount to handle cases where the effect doesn't trigger
  if (typeof document !== 'undefined') {
    addDarkClass();
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
