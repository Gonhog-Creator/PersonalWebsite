'use client';

import { useEffect, useCallback } from 'react';

// Type for the particles.js function
type ParticlesJS = {
  (tagId: string, params: unknown, callback?: () => void): void;
  load: (tagId: string, path: string | unknown, callback?: () => void) => void;
};

// Type definitions for particles.js
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
      stroke?: {
        width: number;
        color: string;
      };
      polygon?: {
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
};

// Import the Window type from particles.d.ts

interface ParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
}

export function ParticlesBackground({ 
  className = '', 
  particleCount = 60 
}: ParticlesBackgroundProps) {
  const initParticles = useCallback(() => {
    if (typeof window === 'undefined') return;

    const particlesJS = (window as unknown as { particlesJS?: ParticlesJS }).particlesJS;
    if (!particlesJS) return;

    const config: ParticlesConfig = {
      particles: {
        number: { 
          value: particleCount,
          density: { 
            enable: true, 
            value_area: 800 
          } 
        },
        color: { 
          value: '#ffffff' 
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 100,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    };

    (window as unknown as { particlesJS: ParticlesJS }).particlesJS('particles-js', config, function() {
      console.log('callback - particles.js config loaded');
    });
  }, [particleCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if particlesJS is already loaded
    const particlesJS = (window as unknown as { particlesJS?: ParticlesJS }).particlesJS;
    if (particlesJS) {
      initParticles();
      return;
    }

    // Load particles.js if not already loaded
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    script.onload = () => {
      const particlesJS = (window as unknown as { particlesJS?: ParticlesJS }).particlesJS;
      if (particlesJS) {
        initParticles();
      }
    };
    document.body.appendChild(script);

    return () => {
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, [initParticles]);

  return (
    <div 
      id="particles-js" 
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}

export default ParticlesBackground;
