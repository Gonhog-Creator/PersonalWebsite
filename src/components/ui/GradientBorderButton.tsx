'use client';

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  href?: string;
}

const GradientBorderButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full p-0.5 overflow-hidden",
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
          "group transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20",
          className
        )}
        {...props}
      >
        <span className="relative px-6 py-2.5 bg-gray-900 rounded-full w-full h-full text-sm font-medium text-white transition-all duration-300 group-hover:bg-gray-800">
          {children}
          <span className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="absolute inset-0 bg-gray-900 rounded-full"></span>
          </span>
        </span>
      </button>
    );
  }
);

GradientBorderButton.displayName = "GradientBorderButton";

export { GradientBorderButton };
