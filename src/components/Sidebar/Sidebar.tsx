'use client';

import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ParticleEffect } from './ParticleEffect';

const socialLinks = [
  { 
    name: 'GitHub', 
    url: 'https://github.com/Gonhog-Creator', 
    icon: 'mdi:github',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  { 
    name: 'Instagram', 
    url: 'https://instagram.com/day_by_day_jmb', 
    icon: 'mdi:instagram',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    iconColor: 'text-gray-900'
  },
  { 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/in/jose-barbeito-04315b231/', 
    icon: 'mdi:linkedin',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    iconColor: 'text-white'
  },
  { 
    name: 'Resume', 
    url: '/Jose-Barbeito-Resume.pdf', 
    icon: 'mdi:file-document',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    iconColor: 'text-gray-900',
    download: 'Jose-Barbeito-Resume.pdf'
  },
];

type SocialLinkProps = {
  name: string;
  url: string;
  icon: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
};

const SocialLink = ({ name, url, icon, bgColor, textColor, iconColor }: SocialLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative h-14 flex items-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center h-full w-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={name}
        download={name === 'Resume' ? 'Jose-Barbeito-Resume.pdf' : undefined}
      >
        <div 
          className={`relative h-14 ${bgColor} rounded-r-full flex items-center transition-all duration-300 ease-out ${
            isHovered ? 'w-48 pl-5' : 'w-16'
          }`}
        >
          <ParticleEffect 
            isHovered={isHovered} 
            isWhiteBg={bgColor === 'bg-white'} 
          />
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                className={`${textColor} text-base font-medium whitespace-nowrap`}
                style={{ marginRight: '6.5rem', marginLeft: '0.5rem' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {name}
              </motion.span>
            )}
          </AnimatePresence>
          <div 
            className={`absolute right-2 w-12 h-12 rounded-full ${bgColor} flex items-center justify-center transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            <Icon 
              icon={icon}
              className={iconColor}
              width={28}
              height={28}
            />
          </div>
        </div>
      </a>
    </div>
  );
};

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-20 flex flex-col items-start justify-center z-40">
      <div className="flex flex-col space-y-3 pl-2">
        {socialLinks.map((link) => (
          <SocialLink 
            key={link.name}
            name={link.name}
            url={link.url}
            icon={link.icon}
            bgColor={link.bgColor}
            textColor={link.textColor}
            iconColor={link.iconColor}
          />
        ))}
      </div>
    </div>
  );
}
