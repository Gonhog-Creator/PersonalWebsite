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
    },
    {
      id: 2,
      title: 'NC State Liquid Rocketry Lab',
      role: 'Advanced Projects Team Member',
      period: 'Aug 2023 - May 2025',
      description: 'As a member of the Advanced Projects Team, I contributed to the development of Rotating Detonation Engines (RDE) for next-generation propulsion systems. My work involved computational modeling, experimental testing, and data analysis to optimize engine performance and advance cutting-edge aerospace technology.',
      image: '/img/projects/RDE/RDE_Cover.png',
      link: '/side-quests/ncsu-rocketry',
      skills: ['Rotating Detonation Engines', 'Computational Modeling', 'Experimental Testing', 'Data Analysis', 'Propulsion Systems']
    },
    {
      id: 3,
      title: 'Delta V Blindajes',
      role: 'Engineering & Technical Program Manager',
      period: '2024 - Present',
      description: 'Working across the complete lifecycle of ballistic-protection systems — from material sourcing and product development through manufacturing, international logistics, ballistic testing, NIJ certification, and laboratory infrastructure.',
      image: '/img/deltavcoverimage.jpg',
      link: '/projects/deltav-ballistics',
      skills: ['Ballistic Engineering', 'NIJ Certification', 'UHMWPE', 'Manufacturing', 'ERP/Odoo', 'Full-Stack Development', 'International Logistics', 'Defense Industry']
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Timeline line - horizontal on desktop, vertical on mobile */}
      <div className="absolute left-4 md:left-0 md:right-0 md:top-6 md:bottom-auto md:h-px md:w-full top-0 bottom-0 w-px bg-gradient-to-r from-blue-500/60 via-blue-500/30 to-transparent md:bg-gradient-to-r bg-gradient-to-b" />

      <div className="flex flex-col md:flex-row gap-12 md:gap-6 md:items-start">
        {workExperiences.map((experience, index) => (
          <div
            key={experience.id}
            className="relative flex flex-col md:flex-1"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-6 md:top-6 top-6 -translate-x-1/2 md:-translate-x-1/2 z-10">
              <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-gray-900 ring-offset-2 ring-offset-blue-500/20" />
            </div>

            {/* Content card */}
            <div className="ml-12 md:ml-0 md:mt-12">
              <div className="group relative rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/40 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-blue-500/10">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

                {/* Company logo */}
                <div className="relative h-36 overflow-hidden border-b border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Period badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    {experience.period}
                  </div>

                  {/* Company & role */}
                  <h3 className="text-xl font-bold text-white mb-1">
                    {experience.title}
                  </h3>
                  <p className="text-sm text-blue-400 font-medium mb-4">
                    {experience.role}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">
                    {experience.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {experience.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md bg-gray-800/80 border border-gray-700/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <SilverBorderButton
                    as="a"
                    href={experience.link}
                    width="100%"
                    height="42px"
                    className="text-sm w-full"
                  >
                    View Details
                  </SilverBorderButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
