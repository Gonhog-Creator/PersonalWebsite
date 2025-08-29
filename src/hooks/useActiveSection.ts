'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to track which section is currently in view
 * @param sectionIds Array of section IDs to observe
 * @param options Configuration options
 * @returns The ID of the currently active section
 */
export function useActiveSection(
  sectionIds: string[],
  options: {
    rootMargin?: string;
    threshold?: number | number[];
    offset?: number;
  } = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();
  const { rootMargin = '0px 0px -80% 0px', threshold = 0.1, offset = 0 } = options;

  // Reset active section when route changes
  useEffect(() => {
    setActiveId(null);
  }, [pathname]);

  // Create intersection observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    []
  );

  // Set up intersection observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold,
    });

    elements.forEach((el) => {
      observer.current?.observe(el);
    });

    return () => {
      if (observer.current) {
        elements.forEach((el) => {
          observer.current?.unobserve(el);
        });
        observer.current.disconnect();
      }
    };
  }, [sectionIds, handleObserver, rootMargin, threshold]);

  return activeId;
}

/**
 * Hook to get the current scroll position
 * @returns The current scroll position (in pixels)
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  useEffect(() => {
    if (!ref.current) return;

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry.isIntersecting);
    }, options);

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current && ref.current) {
        observerRef.current.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInViewport;
}

/**
 * Hook to get the dimensions of an element
 * @param ref Reference to the element to measure
 * @returns The dimensions of the element (width, height)
 */
export function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  { width: number; height: number }
] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    // Initial measurement
    updateSize();

    // Set up ResizeObserver to track size changes
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(ref.current);

    // Also listen to window resize for cases where the element size changes due to viewport changes
    window.addEventListener('resize', updateSize);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return [ref, size];
}
