'use client';

import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    particlesJS: (id: string, config: any) => void;
  }
}

export function ParticlesBackground() {
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
      className="absolute inset-0 w-full h-full z-0"
      style={{ 
        background: 'transparent',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
};

export default ParticlesBackground;
