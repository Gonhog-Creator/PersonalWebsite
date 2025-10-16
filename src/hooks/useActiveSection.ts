'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface UseActiveSectionOptions {
  rootMargin?: string;
  threshold?: number | number[];
  offset?: number;
}

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Custom hook to track which section is currently in view
 * @param sectionIds Array of section IDs to observe
 * @param options Configuration options
 * @returns The ID of the currently active section
 */
export function useActiveSection(
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();
  const { rootMargin = '0px 0px -80% 0px', threshold = 0.1 } = options;

  // Reset active section when route changes
  useEffect(() => {
    setActiveId(null);
  }, [pathname]);

  // Memoize the section IDs to prevent unnecessary effect re-runs
  const memoizedSectionIds = useMemo(() => sectionIds, [sectionIds]);

  // Create intersection observer callback with proper cleanup
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    let activeId: string | null = null;
    let maxRatio = -1;

    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
        const target = entry.target as HTMLElement;
        if (target.id) {
          activeId = target.id;
          maxRatio = entry.intersectionRatio;
        }
      }
    });

    if (activeId) {
      setActiveId(activeId);
    }
  }, []);

  // Set up intersection observer with proper cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const elements = memoizedSectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const currentObserver = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold,
    });

    elements.forEach((el) => currentObserver.observe(el));
    observer.current = currentObserver;

    return () => {
      elements.forEach((el) => currentObserver.unobserve(el));
      currentObserver.disconnect();
    };
  }, [memoizedSectionIds, handleObserver, rootMargin, threshold]);

  return activeId;
}

/**
 * Hook to get the current scroll position
 * @returns The current scroll position (in pixels)
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId.current = requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return scrollPosition;
}

/**
 * Hook to check if an element is in the viewport
 * @param ref Reference to the element to observe
 * @param options IntersectionObserver options
 * @returns Boolean indicating if the element is in the viewport
 */
export function useInViewport(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isInViewport, setIsInViewport] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  // Store the current ref value to use in cleanup
  const currentRef = useRef(ref.current);
  
  useEffect(() => {
    currentRef.current = ref.current;
  }, [ref]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry.isIntersecting);
    }, options);

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return isInViewport;
}

/**
 * Hook to get the dimensions of an element
 * @param ref Reference to the element to measure
 * @returns The dimensions of the element (width, height)
 */
export function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  ElementSize
] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });
  const rafId = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      if (!ref.current) return;
      
      rafId.current = requestAnimationFrame(() => {
        if (ref.current) {
          const { width, height } = ref.current.getBoundingClientRect();
          setSize({ width, height });
        }
      });
    };

    // Initial measurement
    updateSize();

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserverRef.current = resizeObserver;
    
    // Observe the current ref
    const currentElement = ref.current;
    if (currentElement) {
      resizeObserver.observe(currentElement);
    }
    
    // Cleanup function
    return () => {
      if (currentElement) {
        resizeObserver.unobserve(currentElement);
      }
      resizeObserver.disconnect();
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [ref, resizeObserverRef, rafId]);

  return [ref, size];
}
