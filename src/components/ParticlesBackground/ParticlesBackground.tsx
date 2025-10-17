'use client';

import { useEffect, useCallback } from 'react';

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
      push: {
        particles_nb: number;
      };
      repulse: {
        distance: number;
        duration: number;
      };
    };
  };
  retina_detect: boolean;
}

interface ParticlesJSInstance {
  canvas: {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
  };
  particles: {
    array: unknown[];
    checkOverlap: (p1: unknown, p2: unknown) => boolean;
    create: (p: unknown, id: number) => void;
    empty: () => void;
    move: () => void;
    push: (n: number, pos?: { x: number; y: number }) => void;
    set: (tag: string, value: unknown) => void;
  };
  fn: {
    vendors: {
      check: () => void;
      listeners: () => void;
    };
  };
  interactivity: {
    el: HTMLElement | string;
    detect_on: string;
    events: {
      onhover: {
        enable: boolean;
        mode: string | string[];
      };
      onclick: {
        enable: boolean;
        mode: string | string[];
      };
      resize: boolean;
    };
  };
  retina: boolean;
  update: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    particlesJS: (id: string, config: ParticlesConfig) => void;
    pJSDom: Array<{
      pJS: ParticlesJSInstance;
      pJS_id: string;
      pJS_interactivity: {
        status: string;
        mode: string;
        mouse: {
          pos_x: number | null;
          pos_y: number | null;
          click_pos_x: number | null;
          click_pos_y: number | null;
          click_time: number | null;
        };
      };
      pJS_retina: boolean;
    }>;
  }
}

interface ParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
}

export function ParticlesBackground({ className = '' }: ParticlesBackgroundProps) {
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

    let script: HTMLScriptElement | null = null;
    const containerId = 'particles-js';
    
    const initialize = () => {
      if (!window.particlesJS) {
        script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.async = true;
        script.onload = initParticles;
        document.body.appendChild(script);
      } else {
        initParticles();
      }
    };

    initialize();

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      
      const particlesContainer = document.getElementById(containerId);
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
      
      // Clean up any global event listeners or resources
      if ('particlesJS' in window) {
        window.pJSDom = [];
      }
    };
  }, [initParticles]);

  return (
    <div
      id="particles-js" 
      className={`fixed top-0 left-0 w-full h-full ${className}`}
      style={{ 
        background: 'transparent',
        pointerEvents: 'none',
        zIndex: 0,
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
}

export default ParticlesBackground;
