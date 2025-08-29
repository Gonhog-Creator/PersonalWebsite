'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type ScrambledTextProps = {
  text: string;
  speed?: number;
  className?: string;
  scrambleOnHover?: boolean;
};

const ScrambledText: React.FC<ScrambledTextProps> = ({
  text,
  speed = 30,
  className = '',
  scrambleOnHover = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);

  const characters = '!<>-_\\/[]{}—=+*^?#________';
  
  const scramble = (current: string, target: string): string => {
    if (current === target) return current;
    
    const newText = target
      .split('')
      .map((char, i) => {
        if (current[i] === char) return char;
        if (current[i] === undefined) return char;
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join('');
      
    return newText;
  };

  useEffect(() => {
    if (!scrambleOnHover || isHovering) {
      let scrambleCount = 0;
      const maxScrambles = 10;
      
      const interval = setInterval(() => {
        setDisplayText(prev => {
          const scrambled = scramble(prev, text);
          scrambleCount++;
          
          if (scrambled === text || scrambleCount >= maxScrambles) {
            clearInterval(interval);
            setIsScrambling(false);
            return text;
          }
          
          return scrambled;
        });
      }, speed);
      
      return () => clearInterval(interval);
    }
  }, [text, isHovering, scrambleOnHover, speed]);

  const handleHover = () => {
    if (scrambleOnHover) {
      setIsHovering(true);
      setIsScrambling(true);
    }
  };

  const handleHoverEnd = () => {
    if (scrambleOnHover) {
      setIsHovering(false);
    }
  };

  return (
    <motion.span
      className={className}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
      animate={{
        opacity: isScrambling ? [1, 0.8, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
};

export default ScrambledText;
