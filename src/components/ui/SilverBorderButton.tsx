'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  width?: string;
  height?: string;
}

type ButtonProps = BaseButtonProps & {
  as?: 'button';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

type LinkButtonProps = BaseButtonProps & {
  as: 'a';
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>;

type SilverBorderButtonProps = ButtonProps | LinkButtonProps;

const SilverBorderButton = ({
  children,
  className = '',
  disabled = false,
  width = '300px',
  height = '60px',
  as: Tag = 'button',
  ...props
}: SilverBorderButtonProps) => {
  const elementRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const isLink = Tag === 'a';

  // Animation effect
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let animationId: number;

    const animate = () => {
      if (element.matches(':hover')) {
        angleRef.current = (angleRef.current + 0.5) % 360;
        element.style.setProperty('--r', `${angleRef.current}deg`);
      }
      animationId = requestAnimationFrame(animate);
      animationFrameRef.current = animationId;
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Mouse move effect
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      element.style.setProperty('--x', `${x}px`);
      element.style.setProperty('--y', `${y}px`);
    };

    element.addEventListener('mousemove', handleMouseMove as EventListener);
    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
    };
  }, []);

  const baseStyles = {
    '--r': '0deg',
    '--color-background': '#111',
    '--color-text': '#eee',
    '--border-width': '4px',
    '--border-radius': '50px',
    width,
    height,
    background: 'transparent',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties;

  const commonProps = {
    ref: elementRef as React.RefObject<HTMLButtonElement> & React.RefObject<HTMLAnchorElement>,
    className: cn(
      'relative rounded-[50px] cursor-pointer',
      'flex items-center justify-center',
      'text-[#eee] text-center',
      'rotatingGradient',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    ),
    style: baseStyles,
    'aria-disabled': disabled,
  };

  if (isLink) {
    const { as: _, ...linkProps } = props as LinkButtonProps;
    return (
      <a
        {...commonProps}
        {...linkProps}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          linkProps.onClick?.(e);
        }}
      >
        <span className="relative z-10 text-[var(--color-text)] flex items-center justify-center">
          {children}
        </span>
      </a>
    );
  }

  const { as: _, ...buttonProps } = props as ButtonProps;
  return (
    <button
      {...commonProps}
      {...buttonProps}
      disabled={disabled}
    >
      <span className="relative z-10 text-[var(--color-text)] flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export { SilverBorderButton };

// Global styles for the rotating gradient effect
const globalStyles = `
  @keyframes rotate {
    from { --r: 0deg; }
    to { --r: 360deg; }
  }
  
  .rotatingGradient {
    position: relative;
    z-index: 1;
  }
  
  .rotatingGradient::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius, 50px);
    padding: var(--border-width, 4px);
    background: conic-gradient(
      from var(--r, 0deg),
      #e5e7eb 0deg,
      #9ca3af 90deg,
      #e5e7eb 180deg,
      #9ca3af 270deg,
      #e5e7eb 360deg
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    animation: rotate 2.5s linear infinite;
  }
  
  .rotatingGradient::after {
    content: '';
    position: absolute;
    inset: var(--border-width, 4px);
    background: var(--color-background);
    border-radius: calc(var(--border-radius, 50px) - var(--border-width, 4px));
    z-index: -1;
  }
  
  .rotatingGradient::before {
    content: '';
    position: absolute;
    background: radial-gradient(
      100px circle at var(--x, 0) var(--y, 0),
      rgba(255, 255, 255, 0.3),
      transparent 40%
    );
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  
  .rotatingGradient:hover::before {
    opacity: 1;
  }
`;

// Add global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}
