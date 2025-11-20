'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

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
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '0.75rem 1.25rem',
            fontSize: '0.875rem',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
