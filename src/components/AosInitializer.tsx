'use client';

import { useEffect } from 'react';

export default function AosInitializer() {
  useEffect(() => {
    const initAos = async () => {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
      });
    };

    initAos();
  }, []);

  return null;
}
