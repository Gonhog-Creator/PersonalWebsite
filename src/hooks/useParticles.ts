import { useEffect } from 'react';

// Define types for particles.js
interface ParticlesConfig {
  particles: {
    number: {
      value: number;
      density: {
        enable: boolean;
        value_area: number;
      };
    };
    color: {
      value: string;
    };
    shape: {
      type: string;
      stroke: {
        width: number;
        color: string;
      };
      polygon: {
        nb_sides: number;
      };
    };
    opacity: {
      value: number;
      random: boolean;
      anim: {
        enable: boolean;
        speed: number;
        opacity_min: number;
        sync: boolean;
      };
    };
    size: {
      value: number;
      random: boolean;
      anim: {
        enable: boolean;
        speed: number;
        size_min: number;
        sync: boolean;
      };
    };
    line_linked: {
      enable: boolean;
      distance: number;
      color: string;
      opacity: number;
      width: number;
    };
    move: {
      enable: boolean;
      speed: number;
      direction: string;
      random: boolean;
      straight: boolean;
      out_mode: string;
      bounce: boolean;
      attract: {
        enable: boolean;
        rotateX: number;
        rotateY: number;
      };
    };
  };
  interactivity: {
    detect_on: string;
    events: {
      onhover: {
        enable: boolean;
        mode: string;
      };
      onclick: {
        enable: boolean;
        mode: string;
      };
      resize: boolean;
    };
    modes: {
      grab: {
        distance: number;
        line_linked: {
          opacity: number;
        };
      };
      bubble: {
        distance: number;
        size: number;
        duration: number;
        opacity: number;
        speed: number;
      };
      repulse: {
        distance: number;
        duration: number;
      };
      push: {
        particles_nb: number;
      };
      remove: {
        particles_nb: number;
      };
    };
  };
  retina_detect: boolean;
}

declare global {
  interface Window {
    particlesJS: {
      load: (
        id: string,
        path: string | ParticlesConfig,
        callback?: () => void
      ) => void;
    };
  }
}

export const useParticles = (): void => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if particles.js is loaded
    if (!window.particlesJS) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('particlesJS is not loaded');
      }
      return;
    }

    // Initialize particles.js
    const configPath = '/particles.json';
    const callback = (): void => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Particles.js config loaded');
      }
    };

    try {
      window.particlesJS.load('particles-js', configPath, callback);
    } catch (error) {
      console.error('Error initializing particles:', error);
    }

    // Cleanup function
    return (): void => {
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);
};
