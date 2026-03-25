'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';

// Reuse the ProjectHeader component from the gallery components
import { ProjectHeader } from '@/components/gallery/ProjectHeader';

type ModuleItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
};

const modules: ModuleItem[] = [
  {
    id: 'pendulums',
    title: 'Pendulums',
    description: 'Explore chaotic behavior in double pendulum systems',
    icon: 'mdi:pendulum',
    path: '/projects/fractals/pendulums',
    color: 'from-purple-600 to-blue-600'
  },
  {
    id: 'multiple-pendulums',
    title: 'Multiple Pendulums',
    description: 'Chaos theory demonstration with 5 double pendulums',
    icon: 'mdi:pendulum',
    path: '/projects/fractals/pendulums/multiple',
    color: 'from-orange-600 to-red-600'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function FractalsPage() {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Custom Header */}
      <ProjectHeader />
      
      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="text-center md:text-left" data-aos="fade-right">
              <h1 className="text-6xl font-bold text-white mb-4">
                Deep Dive Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Fractals</span>
              </h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                Exploring and simulating chaos theory and fractals with the help of visualizations
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                  Chaos Theory
                </span>
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                  Fractals
                </span>
                <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30">
                  Visualization
                </span>
              </div>
            </div>
            
            <div className="w-80 h-80 rounded-full bg-white/10 backdrop-blur-sm p-8 shadow-2xl flex-shrink-0" data-aos="fade-left">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-2">🌀</div>
                  <p className="text-sm font-medium">Interactive Simulations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modules Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Interactive <span className="text-blue-400">Modules</span>
            </h2>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 w-full"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                variants={item}
                className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-[280px] sm:max-w-xs md:max-w-sm bg-gray-800"
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Link href={module.path} className="block w-full h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={
                        module.id === 'pendulums' 
                          ? '/img/projects/fractals/pendulumscover.jpg'
                          : module.id === 'multiple-pendulums'
                          ? '/img/projects/fractals/multiplependulums.png'
                          : '/img/projects/fractals/pendulumscover.jpg'
                      }
                      alt={module.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div 
                      className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex flex-col items-center justify-end pb-8 ${
                        hoveredModule === module.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="w-full px-6 text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                        <p className="text-gray-200 text-sm">{module.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              What is <span className="text-blue-400">Chaos Theory?</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="bg-gray-900 rounded-xl shadow-xl" 
              style={{ 
                padding: '60px 40px',
                boxSizing: 'border-box'
              }} 
              data-aos="fade-up" 
              data-aos-delay="100"
            >
              <h3 className="text-2xl font-semibold text-white mb-8">The Beauty of Chaos</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                Chaos theory studies systems that appear random but are actually deterministic, governed by precise mathematical rules. These systems are highly sensitive to initial conditions - famous "butterfly effect."
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through interactive visualizations, you can explore how small changes in starting conditions lead to dramatically different outcomes, revealing the hidden order within apparent chaos.
              </p>
            </div>
            
            <div 
              className="bg-gray-900 rounded-xl shadow-xl" 
              style={{ 
                padding: '60px 40px',
                boxSizing: 'border-box'
              }} 
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              <h3 className="text-2xl font-semibold text-white mb-8">Fractal Patterns</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                Fractals are infinitely complex patterns that are self-similar across different scales. They are created by repeating simple processes over and over in an ongoing feedback loop.
              </p>
              <p className="text-gray-300 leading-relaxed">
                From coastlines to clouds, from trees to blood vessels, fractals appear everywhere in nature. This project helps you understand and visualize these fascinating mathematical structures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
