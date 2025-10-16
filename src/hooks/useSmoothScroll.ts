import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type ScrollDirection = 'up' | 'down' | null;

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

interface ScrollToElementOptions extends ScrollOptions {
  /** Time in milliseconds to wait before scrolling (useful for dynamic content) */
  delay?: number;
  /** Additional callback after scroll completes */
  onScrollComplete?: () => void;
}


/**
 * Custom hook for handling smooth scrolling and scroll-based effects
 * @returns Object containing scroll utilities
 */
export function useSmoothScroll() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Smoothly scroll to an element with optional offset
   * @param id - The ID of the element to scroll to
   * @param options - Scroll options including offset and behavior
   */
  const scrollTo = useCallback((id: string, options: ScrollToElementOptions = {}) => {
    if (typeof window === 'undefined' || !id) return;

    const {
      offset = 80,
      behavior = 'smooth',
      delay = 0,
      onScrollComplete
    } = options;

    const scrollToElement = () => {
      const element = document.getElementById(id);
      if (!element) return;

      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - offset);

      const onScrollEnd = () => {
        window.removeEventListener('scroll', onScrollEnd);
        onScrollComplete?.();
      };

      if (behavior === 'smooth') {
        window.addEventListener('scroll', onScrollEnd, { once: true });
      }

      window.scrollTo({
        top: offsetPosition,
        behavior,
      });

      // Fallback in case scroll events don't fire
      if (onScrollComplete) {
        setTimeout(onScrollEnd, 1000);
      }
    };

    if (delay > 0) {
      scrollTimeoutRef.current = setTimeout(scrollToElement, delay);
    } else {
      scrollToElement();
    }
  }, []);

  // Handle anchor links on page load and route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        scrollTo(hash, { delay: 100 });
      }
    };

    // Initial check for hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      scrollTo(initialHash, { delay: 300 });
    }

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange, { passive: true });

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pathname, searchParams, scrollTo]);

  // Add scroll-based animations with throttling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const animationFrameId = { current: 0 };

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = window.requestAnimationFrame(() => {
          // Add scroll-based animations here
          // For example, adding/removing classes based on scroll position
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    scrollTo
  }), [scrollTo]);
}

/**
 * Hook to detect if an element is in the viewport
 */
/**
 * Hook to detect if an element is in the viewport
 * @param ref - React ref to the element to observe
 * @param options - IntersectionObserver options
 * @returns Boolean indicating if the element is in the viewport
 */
export function useInViewport(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
): boolean {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Store the current ref value to use in cleanup
  const currentRef = useRef(ref.current);
  
  useEffect(() => {
    currentRef.current = ref.current;
  }, [ref]);

  useEffect(() => {
    const element = currentRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: options?.root || null,
      rootMargin: options?.rootMargin || '0px',
      threshold: options?.threshold ?? 0,
    });

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return isInView;
}

/**
 * Hook to handle scroll direction
 */
/**
 * Hook to detect scroll direction
 * @returns The current scroll direction ('up' or 'down')
 */
export function useScrollDirection(): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      
      tickingRef.current = true;
      
      const updateScrollDirection = () => {
        const scrollY = window.scrollY;
        
        // Only update if scrolled more than 5 pixels
        if (Math.abs(scrollY - lastScrollYRef.current) > 5) {
          const direction = scrollY > lastScrollYRef.current ? 'down' : 'up';
          
          // Only update state if direction changed
          if (direction !== scrollDirection) {
            setScrollDirection(direction);
          }
          
          lastScrollYRef.current = scrollY > 0 ? scrollY : 0;
        }
        
        tickingRef.current = false;
      };
      
      // Debounce the scroll event
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(updateScrollDirection, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollDirection]);

  return scrollDirection;
}
