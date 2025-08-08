'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import { useParticles } from '@/hooks/useParticles';
import { ThemeProvider } from '@/contexts/ThemeContext';

type ProvidersProps = {
  children: ReactNode;
  themeProps?: {
    defaultTheme?: string;
    storageKey?: string;
  };
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  
  // Initialize particles effect
  useParticles();
  
  // Prevent hydration mismatch by only rendering children when mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme={themeProps?.defaultTheme || 'system'} 
      enableSystem 
      disableTransitionOnChange
      storageKey={themeProps?.storageKey || 'theme'}
    >
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </NextThemeProvider>
  );
}
