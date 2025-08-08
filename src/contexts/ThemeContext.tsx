'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Set the mounted state to true once the component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update isDark when the theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkMode = root.classList.contains('dark');
    setIsDark(isDarkMode);
  }, [nextTheme]);

  // Set the theme and persist it in localStorage
  const setTheme = (theme: Theme) => {
    setNextTheme(theme);
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Don't render the provider until we've determined the theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: (nextTheme as Theme) || 'system',
        setTheme,
        isDark,
        toggleTheme,
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
