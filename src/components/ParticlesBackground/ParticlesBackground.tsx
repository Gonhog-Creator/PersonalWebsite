'use client';

import { useEffect, useCallback } from 'react';

interface ParticleConfig {
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
    particlesJS: (id: string, config: ParticleConfig) => void;
  }
}

interface ParticlesBackgroundProps {
  particleCount?: number;
  className?: string;
}

export function ParticlesBackground({ particleCount = 60, className = '' }: ParticlesBackgroundProps) {
  const initParticles = useCallback(() => {
    window.particlesJS('particles-js', {
      particles: {
        number: { 
          value: 60,
          density: { 
            enable: true, 
            value_area: 800 
          } 
        },
        color: { 
          value: '#ffffff' 
        },
        shape: { 
          type: 'circle' 
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
          push: {
            particles_nb: 4
          },
          repulse: {
            distance: 100,
            duration: 0.4
          }
        }
      },
      retina_detect: true
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.particlesJS) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.async = true;
      script.onload = initParticles;
      document.body.appendChild(script);
    } else {
      initParticles();
    }

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
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`} 
    />
  );
};

export default ParticlesBackground;
