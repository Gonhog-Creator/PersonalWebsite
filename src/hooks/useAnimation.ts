'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to handle page transition animations
 */
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip the first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    // Set transitioning to true when route changes
    setIsTransitioning(true);
    
    // Reset after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with your CSS transition duration

    return () => clearTimeout(timer);
  }, [pathname]);

  return isTransitioning;
}

/**
 * Hook to animate elements when they enter the viewport
 */
export function useAnimateOnScroll() {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Unobserve after animation
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { isVisible, elementRef };
}

/**
 * Hook to create staggered animations for a list of items
 */
export function useStaggeredAnimation(
  itemCount: number,
  options: {
    delayPerItem?: number;
    initialDelay?: number;
    startImmediately?: boolean;
  } = {}
) {
  const {
    delayPerItem = 100,
    initialDelay = 0,
    startImmediately = true,
  } = options;

  const [animations, setAnimations] = useState<boolean[]>([]);

  useEffect(() => {
    if (!startImmediately) return;

    const timers: NodeJS.Timeout[] = [];

    // Initialize all animations as false
    setAnimations(Array(itemCount).fill(false));

    // Create staggered timeouts for each item
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setAnimations((prev) => {
          const newAnimations = [...prev];
          newAnimations[i] = true;
          return newAnimations;
        });
      }, initialDelay + i * delayPerItem);

      timers.push(timer);
    }

    // Clear all timeouts on unmount
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [itemCount, delayPerItem, initialDelay, startImmediately]);

  // Manually trigger the animations
  const startAnimations = useCallback(() => {
    const timers: NodeJS.Timeout[] = [];

    setAnimations(Array(itemCount).fill(false));

    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setAnimations((prev) => {
          const newAnimations = [...prev];
          newAnimations[i] = true;
          return newAnimations;
        });
      }, initialDelay + i * delayPerItem);

      timers.push(timer);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [itemCount, delayPerItem, initialDelay]);

  return { animations, startAnimations };
}

/**
 * Hook to create a typing effect
 */
export function useTypewriter(
  text: string,
  options: {
    speed?: number;
    delay?: number;
    onComplete?: () => void;
  } = {}
) {
  const { speed = 50, delay = 0, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (text.length === 0) return;

    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else {
          clearInterval(interval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete, currentIndex]);

  return { displayedText, isComplete };
}

/**
 * Hook to create a count-up animation
 */
export function useCountUp(
  end: number,
  options: {
    start?: number;
    duration?: number;
    delay?: number;
    onComplete?: () => void;
  } = {}
) {
  const { start = 0, duration = 2000, delay = 0, onComplete } = options;
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (end === start) {
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    const startAnimation = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out function
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentCount = Math.floor(easeOutCubic(progress) * (end - start) + start);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(startAnimation);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    };

    const timer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(startAnimation);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, start, duration, delay, onComplete]);

  return { count, isComplete };
}
