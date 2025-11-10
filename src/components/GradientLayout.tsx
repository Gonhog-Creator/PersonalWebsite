'use client';

import { useEffect } from 'react';

export default function GradientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This will be executed only on the client side
    const style = document.createElement('style');
    style.textContent = `
      @property --pos-x { syntax: '<percentage>'; initial-value: 11.14%; inherits: false; }
      @property --pos-y { syntax: '<percentage>'; initial-value: 140%; inherits: false; }
      @property --spread-x { syntax: '<percentage>'; initial-value: 150%; inherits: false; }
      @property --spread-y { syntax: '<percentage>'; initial-value: 180.06%; inherits: false; }
      @property --color-1 { syntax: '<color>'; initial-value: #000; inherits: false; }
      @property --color-2 { syntax: '<color>'; initial-value: #08012c; inherits: false; }
      @property --color-3 { syntax: '<color>'; initial-value: #4e1e40; inherits: false; }
      @property --color-4 { syntax: '<color>'; initial-value: #70464e; inherits: false; }
      @property --color-5 { syntax: '<color>'; initial-value: #88394c; inherits: false; }
      @property --border-angle { syntax: '<angle>'; initial-value: 20deg; inherits: true; }
      @property --border-color-1 { syntax: '<color>'; initial-value: hsla(340, 75%, 60%, 0.2); inherits: true; }
      @property --border-color-2 { syntax: '<color>'; initial-value: hsla(340, 75%, 40%, 0.75); inherits: true; }
      @property --stop-1 { syntax: '<percentage>'; initial-value: 37.35%; inherits: false; }
      @property --stop-2 { syntax: '<percentage>'; initial-value: 61.36%; inherits: false; }
      @property --stop-3 { syntax: '<percentage>'; initial-value: 78.42%; inherits: false; }
      @property --stop-4 { syntax: '<percentage>'; initial-value: 89.52%; inherits: false; }
      @property --stop-5 { syntax: '<percentage>'; initial-value: 100%; inherits: false; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <div className="gradient-animated">{children}</div>;
}
