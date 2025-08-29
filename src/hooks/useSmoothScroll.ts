import { useState, useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Custom hook for handling smooth scrolling and scroll-based effects
 */
export function useSmoothScroll() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Smooth scroll to an element with offset for fixed header
  const scrollTo = useCallback((id: string, offset = 80) => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  // Handle anchor links on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Small delay to ensure the page has rendered
        setTimeout(() => scrollTo(hash), 100);
      }
    };

    // Initial check for hash
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange, false);

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [pathname, searchParams, scrollTo]);

  // Add scroll-based animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      // You can add scroll-based animations here
      // For example, adding/removing classes based on scroll position
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Expose the scrollTo function for programmatic use
  return { scrollTo };
}

/**
 * Hook to detect if an element is in the viewport
 */
export function useInViewport(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInView;
}

/**
 * Hook to handle scroll direction
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection]);

  return scrollDirection;
}
