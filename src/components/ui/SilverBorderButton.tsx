'use client';

import { useEffect, useRef, MouseEvent, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface BaseButtonProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  disabled?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
}

interface ButtonProps extends BaseButtonProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
  href?: never;
}

interface LinkButtonProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  as: 'a';
  href: string;
}

type SilverBorderButtonProps = ButtonProps | LinkButtonProps;

const SilverBorderButton = ({
  children,
  width = '300px',
  height = '60px',
  className = '',
  disabled = false,
  as: Tag = 'div',
  href,
  ...props
}: SilverBorderButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const angleRef = useRef(0);

  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    let animationId: number;
    
    const animate = () => {
      if (button.matches(':hover')) {
        angleRef.current = (angleRef.current + 0.5) % 360;
        button.style.setProperty('--r', `${angleRef.current}deg`);
      }
      animationId = requestAnimationFrame(animate);
      animationFrameRef.current = animationId;
    };
    
    animationId = requestAnimationFrame(animate);
    animationFrameRef.current = animationId;
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      button.style.setProperty('--x', `${x}px`);
      button.style.setProperty('--y', `${y}px`);
    };

    button.addEventListener('mousemove', handleMouseMove);
    return () => button.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (props.onClick) {
        props.onClick(e);
      }
    }
  };

  const buttonContent = (
    <div className="text-[#eee] text-center">
      <div
        ref={buttonRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'relative rounded-[50px] cursor-pointer',
          'flex items-center justify-center',
          'rotatingGradient',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={{
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
        } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className="relative z-10 text-[var(--color-text)] flex items-center justify-center">
          {children}
        </span>
        <style jsx global>{`
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
        `}</style>
        <style jsx>{`
          div::before {
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
          div:hover::before {
            opacity: 1;
          }
        `}</style>
      </div>
    </div>
  );

  if (Tag === 'a' && href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

export { SilverBorderButton };
