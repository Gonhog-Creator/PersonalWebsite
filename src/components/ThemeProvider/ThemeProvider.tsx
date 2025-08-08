'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage or default
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
    setIsMounted(true);
  }, [storageKey]);

  // Apply theme to the HTML element
  useEffect(() => {
    if (!isMounted) return;
    
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update the data-theme attribute for other libraries if needed
    root.setAttribute('data-theme', theme);
    
    // Store the theme preference
    localStorage.setItem(storageKey, theme);
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update data-theme attribute for other libraries
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, isMounted, storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Don't render until we've determined the theme to prevent flash of unstyled content
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
