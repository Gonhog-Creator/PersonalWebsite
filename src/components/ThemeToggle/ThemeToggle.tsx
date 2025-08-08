'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const themes = [
    { name: 'light', icon: faSun, label: 'Light' },
    { name: 'dark', icon: faMoon, label: 'Dark' },
    { name: 'system', icon: faDesktop, label: 'System' },
  ];

  const currentTheme = themes.find((t) => t.name === theme) || themes[2];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={currentTheme.icon} className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-50 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">
            <div className="py-1">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setTheme(t.name);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    theme === t.name
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <FontAwesomeIcon icon={t.icon} className="w-4 h-4 mr-3" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
