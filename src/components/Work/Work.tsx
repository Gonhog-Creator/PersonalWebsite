'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SilverBorderButton } from '../ui/SilverBorderButton';

interface WorkExperience {
  id: number;
  title: string;
  role: string;
  period: string;
  description: string;
  image: string;
  link: string;
  skills: string[];
}

const Work = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const workExperiences: WorkExperience[] = [
    {
      id: 1,
      title: 'Wolfspeed',
      role: 'Process Engineering Intern & Co-op',
      period: 'May 2022 - May 2025',
      description: 'During two summer internships and part-time co-ops at Wolfspeed, I gained hands-on experience working on precision measurements, recipe qualification, and process optimization. I contributed to the development and testing of cutting-edge semiconductor technology, focusing on improving yield and process efficiency in a high-volume manufacturing environment.',
      image: '/img/Wolfspeed/Wolfspeed Purple Logo.png',
      link: '/projects/wolfspeed',
      skills: ['Process Optimization', 'Data Analysis', 'Statistical Process Control', 'JMP']
    }
  ];

  return (
    <section className="w-full bg-white dark:bg-gray-900 transition-colors duration-300 py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="flex flex-col gap-12">
            {workExperiences.map((experience, index) => (
              <div 
                key={experience.id}
                className="flex flex-col md:flex-row gap-8 lg:gap-12 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="md:w-5/12">
                  <div className="relative overflow-hidden rounded-xl aspect-[4/3] border-2 border-blue-100 dark:border-gray-700">
                    <Image
                      src={experience.image}
                      alt={experience.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                    />
                  </div>
                </div>
                
                <div className="md:w-7/12 flex flex-col justify-center">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {experience.period}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {experience.title}
                  </h3>
                  
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-4">
                    {experience.role}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {experience.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {experience.skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="h-6"></div>
                  
                  <div className="text-center">
                    <SilverBorderButton 
                      as="a" 
                      href={experience.link}
                      width="180px"
                      height="45px"
                      className="text-sm"
                    >
                      View Project Details
                    </SilverBorderButton>
                  </div>
                </div>
              </div>
            ))}
          
            </div>
            {/* Resume download button removed as per user request */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
