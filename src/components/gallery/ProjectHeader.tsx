'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface NavLink {
  name: string;
  href: string;
  icon: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/', icon: 'mdi:home' },
  { name: 'About', href: '/#about', icon: 'mdi:account' },
  { name: 'Experience', href: '/#experience', icon: 'mdi:coffee' },
  { name: 'Photography', href: '/#photography', icon: 'mdi:camera' },
  { name: 'Contact', href: '/#contact', icon: 'mdi:email' },
];

export function ProjectHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed w-full z-50">
      <div className="relative">
        <header 
          className={`w-full transition-all duration-300 ease-in-out font-sans ${
            isScrolled 
              ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 shadow-sm' 
              : 'bg-transparent dark:bg-transparent py-6'
          }`}
        >
          <div className="container mx-auto px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="relative w-[22.4rem] h-28 -ml-2">
                <Image 
                  src="/img/logo.png" 
                  alt="JB Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center justify-center w-full gap-16">
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
              </nav>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-800 dark:text-white focus:outline-none p-2 -mr-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <Icon icon="mdi:close" className="w-8 h-8" />
                ) : (
                  <Icon icon="mdi:menu" className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="md:hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="pt-4 pb-6 space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-4 py-3 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon icon={link.icon} className="w-6 h-6 text-blue-400" />
                        <span className="ml-4 text-lg font-medium">{link.name}</span>
                        <span className="ml-auto w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-8"></span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
      </div>
    </div>
  );
}
