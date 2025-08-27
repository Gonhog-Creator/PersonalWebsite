'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { FaIndustry, FaFlask, FaChartLine, FaMicrochip } from 'react-icons/fa6';
import { Icon } from '@iconify/react';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Navigation links for the header
const navLinks = [
  { name: 'Home', href: '/#home', icon: 'mdi:home' },
  { name: 'About', href: '/#about', icon: 'mdi:account' },
  { name: 'Experience', href: '/#experience', icon: 'mdi:coffee' },
  { name: 'Photography', href: '/#photography', icon: 'mdi:camera' },
  { name: 'Contact', href: '/#contact', icon: 'mdi:email' },
];

// Custom header component with navigation and theme toggle
function ProjectHeader() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out font-sans ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 shadow-sm' 
          : 'bg-transparent dark:bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="relative w-[22.4rem] h-28 -ml-2">
            <Image 
              src="/img/logo.png" 
              alt="JB Logo" 
              fill 
              className="object-contain"
              priority
            />
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center justify-center gap-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="relative group flex items-center py-8"
              >
                <Icon icon={link.icon} className="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition-transform duration-200" />
                <span className="text-gray-800 dark:text-white text-base font-medium tracking-wide ml-4">{link.name}</span>
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"></span>
              </Link>
            ))}
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Icon icon="mdi:lightbulb" className="w-6 h-6 text-yellow-300" />
              ) : (
                <Icon icon="mdi:lightbulb-outline" className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function WolfspeedPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Custom Header */}
      <ProjectHeader />
      
      {/* Main content area with purple gradient */}
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 pt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center md:text-right">
              <h1 className="text-5xl font-bold text-white mb-2">Wolfspeed</h1>
              <p className="text-xl text-blue-100 mb-1">Process Engineering Intern & Co-op</p>
              <p className="text-blue-100">May 2022 - May 2025 • Durham, NC</p>
            </div>
            
            <div className="w-48 h-48 rounded-full bg-white p-4 shadow-xl flex-shrink-0">
              <Image
                src="/img/Wolfspeed/Wolfspeed Purple Logo.png"
                alt="Wolfspeed Logo"
                width={160}
                height={160}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-8 max-w-6xl">
          {/* SiC Epitaxy Division */}
          <section className="mb-16" data-aos="fade-up">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Junior Engineer
                </h2>
                <p className="text-lg text-blue-600 dark:text-blue-400 mb-3">
                  SiC Epitaxy Division | Wolfspeed
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Summer 2024, Academic Year 2024-2025
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Durham, NC
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    FTIR Spectroscopy
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Data Analysis
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Process Development
                  </span>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-10 shadow-md">
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      During my time in the SiC epitaxy wafering division, I was responsible for managing the qualification of several product-specific recipes using FTIR (Fourier Transform Infrared) spectroscopy tools within a Class 100 cleanroom environment. This involved ensuring the recipes met stringent quality and performance standards by analyzing material properties and process outcomes.
                    </p>
                  </div>
                  <ul className="list-disc pl-6 space-y-3 text-base text-gray-700 dark:text-gray-300 mt-6">
                    <li>Worked on precision measurements tool calibration for FTIR tools</li>
                    <li>Operated in Class 100 Cleanrooms</li>
                    <li>Managed quality control processes and reports</li>
                    <li>Provided technical support for product SiC Epitaxy engineering teams</li>
                    <li>Develop and validate new epitaxy recipes to meet product-specific requirements</li>
                    <li>Create custom data analysis code to facilitate repetitive GRR reports</li>
                    <li>Collaborate with cross-functional teams to resolve metrology issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Wafering Division */}
          <section className="mb-16" data-aos="fade-up" data-aos-delay="100">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Junior Engineer
                </h2>
                <p className="text-lg text-blue-600 dark:text-blue-400 mb-3">
                  Wafering Division | Wolfspeed
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Summer 2023, Academic Year 2023-2024
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Durham, NC
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Process Improvement
                  </span>
                  <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                    Failure Analysis
                  </span>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-10 shadow-md">
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      During my first internship at Wolfspeed I began as a junior engineer in the Wafering Division, working on process improvement, cost reduction, and failure analysis. I learned preliminary data analysis and general engineering practices while learning to operate wafer cutting tools, high powered metrology microscopes, and various other machinery.
                    </p>
                  </div>
                  <ul className="list-disc pl-6 space-y-3 text-base text-gray-700 dark:text-gray-300 mt-6">
                    <li>Performed failure analysis on Disco Kabra tools to pinpoint process issues</li>
                    <li>Contributed to various projects aimed at increasing tool uptime and yield</li>
                    <li>Collaborated on day to day process engineering tasks to keep the tools running</li>
                    <li>Utilized X-ray diffraction techniques for crystal boule analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Photo Gallery */}
          <section className="mb-16" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Manufacturing Environment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cleanroom Image */}
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/img/Wolfspeed/cleanroom (1).jpg"
                  alt="Class 100 Cleanroom Environment"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-xs">Class 100 Cleanroom where I performed FTIR measurements</p>
                </div>
              </div>

              {/* Wafer Processing */}
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/img/Wolfspeed/wafering (1).png"
                  alt="Wafer Processing Equipment"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-xs">Wafer processing equipment in the manufacturing area</p>
                </div>
              </div>

              {/* FTIR Analysis */}
              <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src="/img/Wolfspeed/ftir (2).png"
                  alt="FTIR Analysis Equipment"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-xs">FTIR spectroscopy equipment used for material analysis</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
