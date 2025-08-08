'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  scroll?: boolean;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function NavLink({
  children,
  className,
  activeClassName = 'text-blue-600 dark:text-blue-400 font-medium',
  exact = false,
  scroll = true,
  onClick,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const href = typeof props.href === 'string' ? props.href : props.href.pathname || '';
  
  // Check if the current route matches the link
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href) && href !== '/';

  // Handle hash links for smooth scrolling
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    }

    // If it's a hash link, handle smooth scrolling
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL without causing a page reload
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
  };

  return (
    <Link
      {...props}
      className={cn(
        'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
        className,
        isActive && activeClassName
      )}
      onClick={handleClick}
      scroll={scroll}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

// Variant for mobile menu links
export function MobileNavLink({
  children,
  className,
  activeClassName = 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400',
  ...props
}: NavLinkProps) {
  return (
    <NavLink
      className={cn(
        'block px-4 py-2 text-base rounded-md hover:bg-gray-100 dark:hover:bg-gray-800',
        className
      )}
      activeClassName={activeClassName}
      {...props}
    >
      {children}
    </NavLink>
  );
}
