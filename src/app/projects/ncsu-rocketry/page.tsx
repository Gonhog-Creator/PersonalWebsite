'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { FaUniversity, FaRocket, FaCog, FaChartLine, FaTools, FaArrowLeft, FaWind, FaFlask } from 'react-icons/fa';

const ParticlesBackground = dynamic(
  () => import('@/components/ParticlesBackground/ParticlesBackground').then(mod => mod.default || mod),
  { ssr: false }
);

export default function NCSURocketryPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ProjectHeader />
      
      {/* Hero Section with Background Image */}
      <section className="relative pt-48 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center justify-center min-h-[80vh]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rdre/RDRE Main Background.jpg"
            alt="RDRE Turbine Background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>
        
        <div className="max-w-4xl w-full mx-auto relative z-10 text-center px-4">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight"
            data-aos="fade-up"
          >
            NC State Liquid Rocketry Lab
          </h1>
          <p 
            className="text-xl md:text-2xl text-blue-300 mb-8 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Advanced Projects Team - Rotating Detonation Engine Turbine Design
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div 
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <FaUniversity className="text-blue-300 text-xl mr-2" />
              <span className="text-sm sm:text-base">NC State University</span>
            </div>
            <div 
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <FaRocket className="text-blue-300 text-xl mr-2" />
              <span className="text-sm sm:text-base">Liquid Rocketry Lab</span>
            </div>
            <div 
              className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <FaCog className="text-blue-300 text-xl mr-2" />
              <span className="text-sm sm:text-base">Advanced Projects Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full flex flex-col items-center">
          <div className="text-center w-full mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold">Project Overview</h2>
          </div>
          
          <div className="w-full max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2" data-aos="fade-right">
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <p className="text-center md:text-left">
                    As part of the NC State Liquid Rocketry Lab, I collaborated with Dr. James Braun's research group to develop
                    a novel power extraction system for Rotating Detonation Rocket Engines (RDREs). Our team designed and
                    manufactured a bladed turbine that harnesses the high-energy exhaust gases from an RDRE to generate
                    electrical power.
                  </p>
                  <p className="text-center md:text-left">
                    This interdisciplinary project combined principles from aerospace engineering, mechanical design, and
                    propulsion systems to create a more efficient method of power generation from rocket engine exhaust.
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative h-96 w-full max-w-xl rounded-xl overflow-hidden shadow-2xl" data-aos="fade-left">
                  <Image
                    src="/rdre/rde-diagram.jpg"
                    alt="RDE Turbine Diagram - Save as: /public/rdre/rde-diagram.jpg"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is an RDRE? */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12" data-aos="fade-up">
              <div className="flex items-center justify-center mb-4">
                <FaRocket className="text-blue-600 dark:text-blue-400 text-3xl mr-3" />
                <h2 className="text-3xl font-bold">What is a Rotating Detonation Engine?</h2>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 space-y-6 text-gray-700 dark:text-gray-300" data-aos="fade-right">
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
              
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative h-96 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl" data-aos="fade-left">
                  <Image
                    src="/rdre/rdre-schematic-diagram.jpg"
                    alt="RDRE Schematic Diagram - Save as: /public/rdre/rdre-schematic-diagram.jpg"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Components */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="w-full flex flex-col items-center">
          <div className="text-center w-full mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold">Project Components</h2>
          </div>
          
          <div className="w-full max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="100">
                <div className="flex items-center mb-4">
                  <FaCog className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                  <h3 className="text-xl font-semibold">Turbine Design</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Designed a high-efficiency axial flow turbine optimized for the unique exhaust conditions of the RDRE,
                  including temperature-resistant materials and aerodynamically optimized blades.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="150">
                <div className="flex items-center mb-4">
                  <FaTools className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                  <h3 className="text-xl font-semibold">Manufacturing</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Utilized advanced manufacturing techniques including CNC machining and 3D printing to create precision
                  components capable of withstanding extreme temperatures and pressures.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center mb-4">
                  <FaWind className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                  <h3 className="text-xl font-semibold">CFD Analysis</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Conducted computational fluid dynamics (CFD) simulations to analyze flow characteristics,
                  optimize turbine performance, and validate design parameters under various operating conditions.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300" data-aos="fade-up" data-aos-delay="250">
                <div className="flex items-center mb-4">
                  <FaFlask className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                  <h3 className="text-xl font-semibold">Validation, Verification, and Testing</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Performed comprehensive Validation, Verification, and Testing (VVT) to ensure structural integrity and
                  performance reliability of turbine components under operational conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results and Impact */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="w-full flex flex-col items-center">
          <div className="text-center w-full mb-12">
            <h2 className="text-4xl font-bold text-white" data-aos="fade-up">Results and Impact</h2>
          </div>
          
          <div className="w-full max-w-5xl text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20" data-aos="fade-up">
              <div className="space-y-6">
                <div className="bg-yellow-500 text-blue-900 font-bold text-sm inline-block px-3 py-1 rounded-full">
                  AIAA SCITECH 2025 ACHIEVEMENT
                </div>
                
                <h3 className="text-3xl font-bold text-white">
                  Third Place: AIAA Scitech Undergraduate Team Competition
                </h3>
                
                <div className="mb-6">
                  <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-2">
                    <Image
                      src="/rdre/rdre-schematic-diagram.jpg"
                      alt="RDRE Turbine Power Extraction System"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-blue-200 italic">
                    Our team's RDRE turbine power extraction system design
                  </p>
                </div>
                
                <p className="text-blue-100 text-lg">
                  Our team was honored to receive third place at the prestigious AIAA Scitech 2025 conference in the undergraduate team category for our work on:
                </p>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-blue-100 text-xl font-medium">
                    "Design and Analysis of Axial Turbine Power Extraction from a Small-Scale Rotating Detonation Rocket Combustor"
                  </p>
                </div>
                
                <p className="text-blue-100">
                  Corey Thunes, Donovan Ngum, Ellie Murray, <strong>Jose Barbeito</strong>, Lucas Nicol, Rodrigo Dacosta, Trevor Larsen and James Braun<br />
                  North Carolina State University (Raleigh, NC)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="w-full flex flex-col items-center">
          <div className="text-center w-full mb-12">
            <h2 className="text-4xl font-bold" data-aos="fade-up">Project Gallery</h2>
          </div>
          
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item} 
                  className="relative h-64 w-full max-w-xs rounded-xl overflow-hidden group"
                  data-aos="fade-up"
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
        </div>
      </section>

      <footer className="relative h-[6vh] w-full">
        <div className="absolute inset-0 w-full h-full">
          <ParticlesBackground />
        </div>
        <div className="absolute bottom-0 left-0 right-0 py-2 bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300 text-sm md:text-base">© 2025 Jose Maria Barbeito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
