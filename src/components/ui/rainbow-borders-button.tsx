import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'button' | 'a';
  href?: string;
  width?: string;
  height?: string;
} & (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);

export const RainbowBorderButton = ({
  children,
  className = '',
  as: Component = 'button',
  width = 'auto',
  height = 'auto',
  ...props
}: ButtonProps) => {
  const buttonClasses = `rainbow-border relative flex items-center justify-center gap-2.5 px-6 py-2.5 bg-black rounded-xl border-none text-[#eee] cursor-pointer font-bold transition-all duration-200 ${className}`;
  const buttonStyle = {
    width,
    height,
  };

  const buttonContent = (
    <>
      <span className="relative z-10 text-[#eee]">{children}</span>
      <style jsx global>{`
        .rainbow-border {
          position: relative;
          z-index: 0;
          overflow: hidden;
        }
        .rainbow-border::before {
          content: '';
          position: absolute;
          z-index: -2;
          left: -50%;
          top: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
          background-size: 400% 400%;
          animation: rainbow 20s linear infinite;
          border-radius: 16px;
        }
        .rainbow-border::after {
          content: '';
          position: absolute;
          z-index: -1;
          left: 1px;
          top: 1px;
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          background: #1a1a1a;
          border-radius: 14px;
        }
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );

  if (Component === 'a' && props.href) {
    const { className: _, ...linkProps } = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={props.href} className={buttonClasses} style={buttonStyle} {...linkProps}>
        {buttonContent}
      </Link>
    );
  }

  const { className: __, ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={buttonClasses} style={buttonStyle} {...buttonProps as ButtonHTMLAttributes<HTMLButtonElement>}>
      {buttonContent}
    </button>
  );
};

export default RainbowBorderButton;