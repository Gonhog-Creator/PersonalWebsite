import { useState, useEffect, useCallback } from 'react';

type TypewriterOptions = {
  speed?: number;
  delay?: number;
  loop?: boolean;
  loopDelay?: number;
  onComplete?: () => void;
};

export function useTypewriter(
  text: string,
  options: TypewriterOptions = {}
) {
  const {
    speed = 50, // Typing speed in milliseconds
    delay = 0, // Delay before starting in milliseconds
    loop = false, // Whether to loop the animation
    loopDelay = 2000, // Delay before restarting the loop in milliseconds
    onComplete,
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const typeText = useCallback(() => {
    if (currentIndex < text.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      onComplete?.();

      if (loop) {
        const timeout = setTimeout(() => {
          setDisplayedText('');
          setCurrentIndex(0);
          typeText();
        }, loopDelay);

        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, loop, loopDelay, onComplete, speed, text]);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => {
        typeText();
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      typeText();
    }
  }, [delay, typeText]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(false);
  }, [text]);

  return {
    displayedText,
    isTyping,
    currentIndex,
    totalLength: text.length,
    progress: text.length > 0 ? (currentIndex / text.length) * 100 : 0,
  };
}
