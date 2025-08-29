'use client';

import { forwardRef, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import Link, { LinkProps as NextLinkProps } from 'next/link';
import { cn } from '@/lib/utils';

interface BaseButtonProps {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface ButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  as?: 'button';
  href?: never;
}

interface LinkProps extends BaseButtonProps, Omit<NextLinkProps, 'href' | 'onClick' | 'className'> {
  as: 'a';
  href: string;
  className?: string;
}

type GradientButtonProps = ButtonProps | LinkProps;

const GradientButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, GradientButtonProps>(
  ({ children, className, size = 'default', variant = 'default', as: Tag = 'button', ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    // Combine refs
    const setRefs = (node: HTMLButtonElement | HTMLAnchorElement | null) => {
      if (node) {
        // Update the forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>).current = node;
        }
        // Update our local ref
        (buttonRef as React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | null>).current = node;
      }
    };

    useEffect(() => {
      if (!buttonRef.current || !spanRef.current) return;

      const button = buttonRef.current;
      const span = spanRef.current;

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate angle for gradient rotation
        const centerX = x - rect.width / 2;
        const centerY = y - rect.height / 2;
        const angle = Math.atan2(centerY, centerX) * (180 / Math.PI) + 180;
        
        // Update CSS variables
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
        span.style.setProperty('--gradient-angle', `${angle}deg`);
      };

      const mouseMoveHandler = handleMouseMove as EventListener;
      button.addEventListener('mousemove', mouseMoveHandler);
      return () => button.removeEventListener('mousemove', mouseMoveHandler);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (props.disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (props.onClick) props.onClick(e as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    const baseStyles = 'relative inline-flex items-center justify-center rounded-full p-[2px] overflow-hidden';
    const variantStyles = {
      default: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
      outline: 'bg-transparent border-2 border-transparent',
      ghost: 'bg-transparent',
    };

    const sizeStyles = {
      sm: 'text-sm px-4 py-1.5',
      default: 'text-sm px-6 py-2.5',
      lg: 'text-base px-8 py-3',
    };

    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      'group transition-all duration-300',
      variant === 'default' && 'hover:shadow-lg hover:shadow-purple-500/20',
      props.disabled && 'opacity-50 cursor-not-allowed',
      className
    );

    const innerClasses = cn(
      'relative z-10 flex items-center justify-center rounded-full w-full h-full',
      'transition-all duration-300',
      variant === 'default' ? 'bg-gray-900 group-hover:bg-gray-800' : 'bg-transparent',
      sizeStyles[size]
    );

    // Render as Link if href is provided
    if (Tag === 'a' && 'href' in props) {
      const { href, ...rest } = props as LinkProps;
      return (
        <Link
          ref={setRefs as React.Ref<HTMLAnchorElement>}
          href={href}
          className={buttonClasses}
          style={{
            '--x': '0px',
            '--y': '0px',
            '--gradient-angle': '0deg',
          } as React.CSSProperties}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <span ref={spanRef} className={innerClasses}>
            {children}
            <GradientBorder />
          </span>
        </Link>
      );
    }

    // Render as button
    const { type = 'button', ...buttonProps } = props as ButtonProps;
    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        type={type}
        className={buttonClasses}
        style={{
          '--x': '0px',
          '--y': '0px',
          '--gradient-angle': '0deg',
        } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        disabled={props.disabled}
        {...buttonProps}
      >
        <span ref={spanRef} className={innerClasses}>
          {children}
          <GradientBorder />
        </span>
      </button>
    );
  }
);

// Separate component for the gradient border to avoid re-renders
const GradientBorder = () => (
  <span className="gradient-border">
    <style jsx>{`
      .gradient-border {
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        padding: 2px;
        background: conic-gradient(
          from var(--gradient-angle, 0deg),
          #3b82f6,
          #8b5cf6,
          #ec4899,
          #8b5cf6,
          #3b82f6
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        z-index: 0;
      }
    `}</style>
  </span>
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
