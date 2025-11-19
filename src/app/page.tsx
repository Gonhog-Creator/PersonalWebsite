'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getRandomPalette } from '@/lib/colorPalettes';
import AOS from 'aos';
import 'aos/dist/aos.css';
// Icons are used in the component (using custom Icon component)
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Icon } from '@/components/ui/Icon'; // Importing our custom Icon component

const SideQuests = dynamic(
  () => import('@/components/SideQuests/SideQuests').then(mod => mod.default),
  { ssr: false, loading: () => <div className="py-20 text-center">Loading side quests...</div> }
);

const WavyBackground = dynamic(
  () => import('@/components/ui/wavy-background').then(mod => mod.WavyBackground),
  { ssr: false }
);

// Dynamically import components with proper loading states
const Work = dynamic(
  () => import('@/components/Work/Work').then(mod => mod.default),
  { ssr: false, loading: () => <div className="py-20 text-center">Loading work experience...</div> }
);

const Photography = dynamic(
  () => import('@/components/Photography/Photography').then(mod => mod.default),
  { ssr: false, loading: () => <div className="py-20 text-center">Loading photography...</div> }
);

const Skills = dynamic(
  () => import('@/components/Skills/Skills').then(mod => mod.default),
  { ssr: false, loading: () => <div className="py-20 text-center">Loading skills...</div> }
);



export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const handleEmailClick = () => {
    window.location.href = 'mailto:josemaria.barbeito@icloud.com';
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-gray-100">
      <Sidebar />
      <Header />
      <Hero />

      <main className="relative bg-gray-900">
        {/* About Section */}
        <section id="about" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">About <span className="text-blue-400">Me</span></h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2" data-aos="fade-right">
                <h3 className="text-2xl font-semibold mb-4 text-white">Who am I?</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  I&apos;m a passionate Chemical Engineer and Material Scientist with a strong interest in materials innovation and sustainable technologies.
                  In May 2025 I completed my bachelors in Chemical Engineering and Material Science at North Carolina State University and am now pursing my Master&apos;s degree at the University of Padua, in northern Italy.
                </p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  My journey in engineering has equipped me with skills in materials characterization, process optimization, and data analysis, along with a problem-solving mindset that I apply to both my academic and personal projects.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-300">Name:</h4>
                    <p className="text-gray-300">Jose Maria Barbeito</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Email:</h4>
                    <p className="text-gray-300">josemaria.barbeito@icloud.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Education:</h4>
                    <p className="text-gray-300">NC State University</p>
                    <p className="text-gray-300">Padua University</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Degrees:</h4>
                    <p className="text-gray-300">B.S. Chemical Engineering</p>
                    <p className="text-gray-300">M.S. Material Science Engineering</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 flex items-center justify-center h-full min-h-[400px]" data-aos="fade-left">
                <div className="w-full h-full max-w-md flex items-center justify-center">
                  <Skills />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section id="experience" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">Work <span className="text-blue-400">Experience</span></h2>
            </div>
            <Work />
          </div>
        </section>

        {/* Photography Section */}
        <section id="photography" className="pt-20 pb-8 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">My <span className="text-blue-400">Photography</span></h2>
            </div>
            <Photography />
          </div>
        </section>

        {/* Side Quests Section */}
        <SideQuests />

        {/* Technical Skills Section */}
        <section id="technical-skills" className="relative py-8 overflow-hidden">
          <WavyBackground
            className="max-w-7xl mx-auto h-[300px]"
            colors={getRandomPalette()}
            waveWidth={60}
            backgroundFill="#101828"
            blur={4}
            speed="fast"
            waveOpacity={0.5}
            containerClassName="h-[300px]"
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                  Technical <span className="text-blue-600 dark:text-blue-400">Skills</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {[
                  { name: 'Lightroom', icon: 'logos:adobe-lightroom' },
                  { name: 'Photoshop', icon: 'logos:adobe-photoshop' },
                  { name: 'Excel', icon: 'vscode-icons:file-type-excel' },
                  { name: 'Arduino', icon: 'logos:arduino' },
                  { name: 'Ansys', icon: 'simple-icons:ansys' },
                  { name: 'JSL', icon: 'tabler:code' },
                  { name: 'SPC', icon: 'healthicons:chart-line-outline' },
                  { name: 'Matlab', icon: 'vscode-icons:file-type-matlab' },
                  { name: 'JavaScript', icon: 'logos:javascript' },
                  { name: 'HTML', icon: 'vscode-icons:file-type-html' },
                  { name: 'Python', icon: 'logos:python' },
                  { name: 'Java', icon: 'logos:java' },
                ].map((skill, index) => (
                  <div
                    key={skill.name}
                    className="flex flex-col items-center p-4 hover:opacity-80 transition-opacity duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <div className="w-20 h-20 flex items-center justify-center mb-3">
                      <Icon
                        icon={skill.icon}
                        className="w-full h-full text-gray-700 dark:text-gray-200"
                        width="90"
                        height="90"
                      />
                    </div>
                    <span className="text-gray-200 font-medium text-center">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </WavyBackground>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 w-full">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Get In <span className="text-blue-400">Touch</span>
                  </h2>
                  <p className="text-gray-300">Feel free to reach out to me!</p>
                </div>

                <div
                  className={`bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform ${
                    isHovered ? 'scale-105 shadow-blue-500/20' : 'shadow-lg'
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleEmailClick}
                >
                  <div className="p-8 flex flex-col items-center text-center cursor-pointer">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-900 flex items-center justify-center transition-transform duration-300 hover:rotate-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Email Me!</h3>
                    <p className="text-blue-400 font-mono text-lg transition-all duration-300 hover:tracking-wider">
                      josemaria.barbeito@icloud.com
                    </p>
                  </div>

                  <div className={`h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ${
                    isHovered ? 'opacity-100' : 'opacity-70'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative h-[6vh] w-full">
        <div className="absolute bottom-0 left-0 right-0 py-2 bg-gray-900/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300 text-sm md:text-base">© 2025 Jose Maria Barbeito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
