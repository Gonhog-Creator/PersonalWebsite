'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParticles } from '@/hooks/useParticles';
import { ThemeProvider } from '@/contexts/ThemeContext';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
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
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
