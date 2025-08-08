'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Sidebar } from '@/components/Sidebar/Sidebar';

// Dynamically import components with proper loading states
const Work = dynamic(
  () => import('@/components/Work/Work').then(mod => mod.default),
  { ssr: false, loading: () => <div className="py-20 text-center">Loading work experience...</div> }
);

const Photography = dynamic(
  () => import('@/components/Photography/Photography').then(mod => mod.default),
  { ssr: false, loading: () => <div className="py-20 text-center">Loading photography...</div> }
);

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <Header />
      <Hero />
      
      <main className="relative bg-white dark:bg-gray-900">
        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-200">About Me</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2" data-aos="fade-right">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-200">Who am I?</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  I'm a passionate Chemical Engineer and Material Scientist with a strong interest in materials innovation and sustainable technologies. 
                  I'm currently pursuing my education at North Carolina State University and will be starting my Master's degree in August 2025.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  My journey in engineering has equipped me with skills in materials characterization, process optimization, and data analysis, along with a problem-solving mindset that I apply to both my academic and personal projects.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300 transition-colors duration-200">Name:</h4>
                    <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">Jose Barbeito</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300">Email:</h4>
                    <p className="text-gray-600 dark:text-gray-300">jbarbei@ncsu.edu</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300">Education:</h4>
                    <p className="text-gray-600 dark:text-gray-300">NC State University</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300">Degree:</h4>
                    <p className="text-gray-600 dark:text-gray-300">M.S. Material Science Engineering</p>
                  </div>
                </div>
                
                <a 
                  href="#contact" 
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-800 dark:hover:bg-blue-900"
                >
                  Contact Me
                </a>
              </div>
              
              <div className="lg:w-1/2" data-aos="fade-left">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-200">My Skills</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Chemical Engineering', level: 90 },
                    { name: 'Material Science', level: 85 },
                    { name: 'Data Analysis', level: 80 },
                    { name: 'Laboratory Techniques', level: 85 },
                    { name: 'Project Management', level: 75 },
                    { name: 'Technical Writing', level: 80 },
                  ].map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 dark:bg-blue-800 h-2.5 rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Work Experience Section */}
        <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-200">My Experience</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
            <Work />
          </div>
        </section>
        
        {/* Photography Section */}
        <section id="photography" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">My Photography</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
            <Photography />
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">Get In Touch</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
                Have a question or want to work together? Feel free to reach out!
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8 md:p-12 transition-colors duration-300" data-aos="fade-up">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <input 
                      type="text" 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="How can I help you?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
                    <textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5} 
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Let's talk about..."
                      required
                    ></textarea>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center" data-aos="fade-up" data-aos-delay="100">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">Email Me</h3>
                  <a href="mailto:jbarbei@ncsu.edu" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    jbarbei@ncsu.edu
                  </a>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faPhone} className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">Call Me</h3>
                  <a href="tel:+19195550123" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    +1 (919) 555-0123
                  </a>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 dark:text-white">Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">Raleigh, NC, USA</p>
                </div>
              </div>
              
              <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="200">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Follow Me</h3>
                <div className="flex justify-center space-x-6">
                  <a 
                    href="https://www.linkedin.com/in/jose-barbeito-04315b231/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
                  </a>
                  <a 
                    href="https://github.com/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-2xl" />
                  </a>
                  <a 
                    href="https://www.instagram.com/day_by_day_jmb/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section id="work" className="min-h-screen">
          <Work />
        </section>

        {/* Photography Section */}
        <section id="photography" className="min-h-screen">
          <Photography />
        </section>

      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <p> 2024 Jose Barbeito. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
            </a>
            <a 
              href="https://twitter.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>

      {/* Particles.js Background */}
      <div id="particles-js" className="fixed top-0 left-0 w-full h-full -z-10"></div>
    </div>
  );
}
