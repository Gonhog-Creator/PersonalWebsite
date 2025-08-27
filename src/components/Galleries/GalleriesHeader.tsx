'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import { Icon } from '@iconify/react';

// Navigation links for the header
const navLinks = [
  { name: 'Home', href: '/#home', icon: 'mdi:home' },
  { name: 'About', href: '/#about', icon: 'mdi:account' },
  { name: 'Experience', href: '/#experience', icon: 'mdi:coffee' },
  { name: 'Photography', href: '/#photography', icon: 'mdi:camera' },
  { name: 'Contact', href: '/#contact', icon: 'mdi:email' },
];

export function GalleriesHeader() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out font-sans ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent dark:bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="relative w-[22.4rem] h-28 -ml-2">
            <Image 
              src="/img/logo.png" 
              alt="JB Logo" 
              fill 
              className="object-contain"
              priority
            />
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="relative group flex items-center py-8"
              >
                <Icon icon={link.icon} className="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition-transform duration-200" />
                <span className="text-gray-800 dark:text-white text-base font-medium tracking-wide ml-4">{link.name}</span>
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
              </Link>
            ))}
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Icon icon="mdi:lightbulb" className="w-6 h-6 text-yellow-300" />
              ) : (
                <Icon icon="mdi:lightbulb-outline" className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
