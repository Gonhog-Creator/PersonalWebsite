'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type Theme = 'dark'; // Only dark theme is supported now

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme: setNextTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = true; // Always dark theme

  // Set the mounted state and force dark theme on mount
  useEffect(() => {
    setMounted(true);
    setNextTheme('dark');
    
    // Ensure dark theme is applied to the root element
    document.documentElement.classList.add('dark');
  }, [setNextTheme]);

  // Don't render the provider until we've mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: 'dark',
        isDark: true
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
