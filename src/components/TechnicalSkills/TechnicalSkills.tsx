'use client';

import { Icon } from '@iconify/react';

export const TechnicalSkills = () => {
  const skills = [
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
  ];

  return (
    <section id="technical-skills" className="py-6 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">
            Technical <span className="text-blue-600 dark:text-blue-400">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
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
              <span className="text-gray-700 dark:text-gray-300 font-medium text-center">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
