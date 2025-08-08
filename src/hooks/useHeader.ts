'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollPosition } from './useActiveSection';

type UseHeaderProps = {
  scrollThreshold?: number;
  mobileBreakpoint?: number;
};

export function useHeader({
  scrollThreshold = 10,
  mobileBreakpoint = 768,
}: UseHeaderProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollPosition = useScrollPosition();
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [mobileBreakpoint]);

  // Update scrolled state based on scroll position
  useEffect(() => {
    setIsScrolled(scrollPosition > scrollThreshold);
  }, [scrollPosition, scrollThreshold]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return {
    isScrolled,
    isMobileMenuOpen,
    isMobile,
    toggleMobileMenu,
    closeMobileMenu,
  };
}

/**
 * Hook to handle smooth scrolling to a section
 * @param options Configuration options
 * @returns Scroll function and scroll state
 */
export function useSmoothScroll(options: {
  offset?: number;
  behavior?: ScrollBehavior;
} = {}) {
  const { offset = 0, behavior = 'smooth' } = options;
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollTo = useCallback(
    (id: string) => {
      if (typeof window === 'undefined') return;

      const element = document.getElementById(id);
      if (!element) return;

      setIsScrolling(true);

      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior,
      });

      // Reset scrolling state after animation completes
      const onScroll = () => {
        if (
          Math.abs(window.scrollY - offsetPosition) < 5 ||
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
        ) {
          window.removeEventListener('scroll', onScroll);
          setIsScrolling(false);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      // Clean up event listener if component unmounts
      return () => {
        window.removeEventListener('scroll', onScroll);
      };
    },
    [offset, behavior]
  );

  return { scrollTo, isScrolling };
}

/**
 * Hook to handle click outside of an element
 * @param ref Reference to the element
 * @param callback Callback function to execute when clicking outside
 */
export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
}
