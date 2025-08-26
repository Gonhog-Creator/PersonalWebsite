'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@iconify/react';
import { faEnvelope, faPhone, faMapMarkerAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { Sidebar } from '@/components/Sidebar/Sidebar';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Message sent successfully! I\'ll get back to you soon.'
        });
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <h2 className="text-4xl font-bold mb-4 dark:text-white">About <span className="text-blue-600 dark:text-blue-400">Me</span></h2>
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
                    <h4 className="font-semibold text-gray-800 dark:text-gray-300">Degrees:</h4>
                    <p className="text-gray-600 dark:text-gray-300">M.S. Material Science Engineering</p>
                    <p className="text-gray-600 dark:text-gray-300">B.S. Chemical Engineering</p>
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
        <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">My <span className="text-blue-600 dark:text-blue-400">Experience</span></h2>
            </div>
            <Work />
          </div>
        </section>
        
        {/* Photography Section */}
        <section id="photography" className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 dark:text-white">My <span className="text-blue-600 dark:text-blue-400">Photography</span></h2>
            </div>
            <Photography />
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="technical-skills" className="relative py-12 overflow-hidden">
          <WavyBackground
            className="max-w-7xl mx-auto"
            colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
            waveWidth={50}
            backgroundFill="#101828"
            blur={8}
            speed="fast"
            waveOpacity={0.3}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
                  Technical <span className="text-blue-600 dark:text-blue-400">Skills</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
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
        <section id="contact" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 w-full py-20">
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="w-full">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                  Send <span className="text-blue-600">Email</span>
                </h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Subject"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Your message"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="space-y-4">
                    {submitStatus && (
                      <div 
                        className={`p-4 rounded-lg ${
                          submitStatus.success 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {submitStatus.message}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Jose Maria Barbeito. All rights reserved.</p>
        </div>
      </footer>

      {/* Particles.js Background */}
      <div id="particles-js" className="fixed top-0 left-0 w-full h-full -z-10"></div>
    </div>
  );
}
