import { useEffect } from 'react';

declare global {
  interface Window {
    particlesJS: any;
  }
}

export const useParticles = () => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if particles.js is loaded
    if (!window.particlesJS) {
      console.warn('particlesJS is not loaded');
      return;
    }

    // Initialize particles.js
    window.particlesJS.load('particles-js', '/particles.json', function() {
      console.log('Particles.js config loaded');
    });

    // Cleanup function
    return () => {
      // You might want to destroy particles on unmount
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);
};
