'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Back to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}
    </div>
  );
}
