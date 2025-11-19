'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Sidebar } from '../Sidebar/Sidebar';

interface NavLink {
  name: string;
  href: string;
  icon: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: 'home', icon: 'mdi:home' },
  { name: 'About', href: 'about', icon: 'mdi:account' },
  { name: 'Experience', href: 'experience', icon: 'mdi:coffee' },
  { name: 'Photography', href: 'photography', icon: 'mdi:camera' },
  { name: 'Contact', href: 'contact', icon: 'mdi:email' },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    // Update URL first
    window.history.pushState({}, '', `#${href}`);
    
    // Use requestAnimationFrame to ensure the DOM is updated
    requestAnimationFrame(() => {
      const element = document.getElementById(href);
      if (element) {
        // Calculate the position to scroll to, accounting for any fixed headers
        const headerOffset = 100; // Adjust this value based on your header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  };
  
  if (!mounted) {
    return null;
  }
  return (
    <div className="fixed w-full z-50">
      <div className="relative">
        <Sidebar />
        <header 
          className={`w-full transition-all duration-300 ease-in-out font-sans py-3 shadow-sm fixed top-0 left-0 right-0 ${
            isScrolled 
              ? 'bg-gray-900/80 backdrop-blur-md' 
              : 'bg-transparent'
          }`}
          style={{ paddingLeft: '72px' }}
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
                  <a 
                    key={link.href}
                    href={`#${link.href}`}
                    onClick={(e) => handleNavigation(e, link.href)}
                    className="relative group flex items-center py-8 cursor-pointer"
                  >
                    <Icon icon={link.icon} className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-white text-base font-medium tracking-wide ml-4">{link.name}</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
                  </a>
                ))}
              </nav>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-300 hover:text-white focus:outline-none p-2 -mr-2"
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
                      <a
                        key={`mobile-${link.href}`}
                        href={`#${link.href}`}
                        onClick={(e) => handleNavigation(e, link.href)}
                        className="flex items-center px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 group cursor-pointer"
                      >
                        <Icon icon={link.icon} className="w-6 h-6 text-blue-400" />
                        <span className="ml-4 text-lg font-medium">{link.name}</span>
                        <span className="ml-auto w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-8"></span>
                      </a>
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
