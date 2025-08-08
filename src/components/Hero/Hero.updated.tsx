'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TextTrail from '../ui/TextTrail';
import DecryptedText from '../ui/DecryptedText';
import ScrambledText from '../ui/ScrambledText';
import Image from 'next/image';
import { ParticlesBackground } from '../ParticlesBackground/ParticlesBackground';

export function Hero() {
  const [fontSize, setFontSize] = useState(72);

  useEffect(() => {
    // Set initial font size based on window width
    const handleResize = () => {
      setFontSize(window.innerWidth < 768 ? 48 : 72);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Particles Background */}
      <ParticlesBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--primary)] font-mono mb-4 text-lg">Hi, my name is</p>
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6">
                <DecryptedText 
                  text="Jose Maria Barbeito"
                  speed={50}
                  maxIterations={1}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={true}
                  className="text-[var(--text-primary)]"
                  encryptedClassName="opacity-30 text-[var(--text-secondary)]"
                />
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-6">
              <div>
                <DecryptedText 
                  text="Chemical Engineer &"
                  speed={50}
                  maxIterations={1}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={true}
                  className="text-[var(--text-primary)]"
                  encryptedClassName="opacity-30 text-[var(--text-secondary)]"
                />
              </div>
              <div className="mt-2">
                <DecryptedText 
                  text="Material Scientist"
                  speed={50}
                  maxIterations={1}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={true}
                  className="text-[var(--text-primary)]"
                  encryptedClassName="opacity-30 text-[var(--text-secondary)]"
                />
              </div>
            </h2>
            <div className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed space-y-4 mt-6">
              <div>
                <DecryptedText 
                  text="I'm currently studying Chemical Engineering and Material Science"
                  speed={50}
                  maxIterations={1}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={true}
                  className="text-[var(--text-secondary)]"
                  encryptedClassName="opacity-30 text-[var(--text-secondary)]"
                />
              </div>
              <div>
                <DecryptedText 
                  text="at North Carolina State University. In August 2025, I will be"
                  speed={50}
                  maxIterations={1}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={true}
                  className="text-[var(--text-secondary)]"
                  encryptedClassName="opacity-30 text-[var(--text-secondary)]"
                />
              </div>
              <div>
                <DecryptedText 
                  text="starting my Masters in Material Science Engineering at NC State!"
                  speed={50}
                  maxIterations={1}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  useOriginalCharsOnly={true}
                  className="text-[var(--text-secondary)]"
                  encryptedClassName="opacity-30 text-[var(--text-secondary)]"
                />
              </div>
            </div>
          </motion.div>
          
          {/* Profile Photo */}
          <motion.div 
            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-[var(--primary)] shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/img/profile.png"
              alt="Jose Barbeito"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
