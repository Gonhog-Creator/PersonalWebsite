'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { FaCamera, FaMapMarkedAlt, FaUser, FaBookOpen } from 'react-icons/fa';

const navItems = [
  { 
    name: 'Galleries', 
    href: '/galleries',
    icon: <FaCamera className="mr-2" />,
    subItems: [
      'United States', 
      'Argentina', 
      'Switzerland', 
      'Germany', 
      'France', 
      'UK', 
      'Costa Rica', 
      'Slovenia', 
      'Austria', 
      'Australia', 
      'Belgium', 
      'Greece'
    ] 
  },
  { 
    name: 'Map View', 
    href: '/map',
    icon: <FaMapMarkedAlt className="mr-2" />
  },
  { 
    name: 'About', 
    href: '/about',
    icon: <FaUser className="mr-2" />,
    subItems: ['My Story', 'Gear', 'Testimonials']
  },
  { 
    name: 'Blog', 
    href: '/blog',
    icon: <FaBookOpen className="mr-2" />
  },
  { 
    name: 'Contact', 
    href: '/contact',
    subItems: ['Booking', 'Workshops', 'Print Inquiries']
  },
];

export default function GalleryNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const getHref = (baseHref: string, item?: string) => {
    if (!item) return baseHref;
    return `${baseHref}/${item.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg' : 'bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-white text-xl font-medium tracking-tight hover:opacity-80 transition-opacity flex items-center"
            >
              <span className="font-alfa-slab">Jose Barbeito</span>
              <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-0.5 rounded-full">Photo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium flex items-center ${
                      pathname.startsWith(item.href)
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white transition-colors duration-200'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <button 
                      onClick={() => toggleDropdown(item.name)}
                      className="text-gray-400 hover:text-white focus:outline-none p-1 -ml-1"
                      aria-expanded={activeDropdown === item.name}
                    >
                      <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'transform rotate-180' : ''
                      }`} />
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {item.subItems && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-gray-800 z-50"
                      >
                        <div className="py-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem}
                              href={getHref(item.href, subItem)}
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {item.icon}
                              {subItem}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book a Session
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mobile' ? null : 'mobile')}
              className="text-gray-300 hover:text-white focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {activeDropdown === 'mobile' ? (
                <FiX size={24} />
              ) : (
                <FiMenu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {activeDropdown === 'mobile' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-gray-900/95 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-gray-800"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <div className="pl-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem}
                          href={getHref(item.href, subItem)}
                          className="flex items-center px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.icon}
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 px-2">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-full text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setActiveDropdown(null)}
                >
                  Book a Session
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
