'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUniversity, FaRocket, FaCog, FaChartLine, FaTools } from 'react-icons/fa';
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
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <FaArrowLeft className="text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Back to Home</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
              >
                <Icon icon={link.icon} className="w-5 h-5" />
                <span>{link.name}</span>
              </a>
            ))}
          </div>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Icon icon="mdi:weather-sunny" className="w-5 h-5" />
            ) : (
              <Icon icon="mdi:weather-night" className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default function NCSURocketryPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ProjectHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            NC State Liquid Rocketry Lab
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advancing propulsion technology through innovative research in rotating detonation rocket engines (RDRE)
          </p>
        </div>

        {/* Project Overview */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                As part of the NC State Liquid Rocketry Lab, I collaborated with Dr. James Braun's research group to develop
                a novel power extraction system for Rotating Detonation Rocket Engines (RDREs). Our team designed and
                manufactured a bladed turbine that harnesses the high-energy exhaust gases from an RDRE to generate
                electrical power.
              </p>
              <p>
                This interdisciplinary project combined principles from aerospace engineering, mechanical design, and
                propulsion systems to create a more efficient method of power generation from rocket engine exhaust.
              </p>
            </div>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl" data-aos="fade-left">
            <Image
              src="/rdre/rdre-diagram.jpg"
              alt="RDRE Turbine Concept"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* What is an RDRE? */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 mb-24" data-aos="fade-up">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <FaRocket className="text-blue-600 dark:text-blue-400 text-3xl mr-4" />
              <h2 className="text-3xl font-bold">What is a Rotating Detonation Engine?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  A Rotating Detonation Engine (RDE) is a type of propulsion system that utilizes continuous detonation
                  waves to combust fuel and oxidizer. Unlike traditional rocket engines that rely on deflagration
                  (subsonic combustion), RDEs maintain supersonic detonation waves that rotate around an annular
                  combustion chamber.
                </p>
                <p>
                  The key advantage of RDREs is their potential for higher thermodynamic efficiency compared to
                  conventional rocket engines, as they can achieve near-constant volume combustion, resulting in
                  improved specific impulse and thrust-to-weight ratios.
                </p>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src="/rdre/rdre-schematic.png"
                  alt="RDRE Schematic"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Components */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">Project Components</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center mb-4">
                <FaCog className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                <h3 className="text-xl font-semibold">Turbine Design</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Designed a high-efficiency axial flow turbine optimized for the unique exhaust conditions of the RDRE,
                including temperature-resistant materials and aerodynamically optimized blades.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center mb-4">
                <FaTools className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                <h3 className="text-xl font-semibold">Manufacturing</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Utilized advanced manufacturing techniques including CNC machining and 3D printing to create precision
                components capable of withstanding extreme temperatures and pressures.
              </p>
            </div>
          </div>
        </div>

        {/* Results and Impact */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white mb-24" data-aos="fade-up">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Results & Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">25%</div>
                <p>Increase in power extraction efficiency compared to traditional methods</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">6</div>
                <p>Months of research and development</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">1</div>
                <p>Patent pending for the novel turbine design</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item} 
                className="relative h-64 rounded-xl overflow-hidden group"
                data-aos="fade-up"
                data-aos-delay={item * 50}
              >
                <Image
                  src={`/rdre/gallery-${item}.jpg`}
                  alt={`RDRE Project ${item}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-6">Looking Forward</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Our work on the RDRE power extraction system has opened new possibilities for more efficient propulsion
            systems. The success of this project has led to further research opportunities and potential applications
            in both aerospace and terrestrial power generation.
          </p>
          <Link
            href="/#experience"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Experience
          </Link>
        </div>
      </section>

      <footer className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} NC State Liquid Rocketry Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
