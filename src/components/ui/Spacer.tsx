import { HTMLAttributes } from 'react';

interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const sizeMap = {
  sm: 'h-4',     // 1rem (16px)
  md: 'h-8',     // 2rem (32px)
  lg: 'h-12',    // 3rem (48px)
  xl: 'h-16',    // 4rem (64px)
  '2xl': 'h-20', // 5rem (80px)
  '3xl': 'h-24', // 6rem (96px)
};

export function Spacer({ size = 'md', className = '', ...props }: SpacerProps) {
  return (
    <div 
      className={`${sizeMap[size]} w-full ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}
