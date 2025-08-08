'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
