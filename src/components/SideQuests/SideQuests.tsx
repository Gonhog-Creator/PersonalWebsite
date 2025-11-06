'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ProjectItem = {
  id: string;
  title: string;
  image: string;
  description: string;
  path: string;
};

const projects: ProjectItem[] = [
  {
    id: 'my-movies',
    title: 'My Movies',
    image: '/img/projects/movies/popcorncover.jpg',
    description: 'Rating every movie I watch!',
    path: '/side-quests/my-movies'
  },
  {
    id: 'food-tree',
    title: 'Food Tree',
    image: '/img/projects/foodtree/foodtreetemp.png',
    description: 'Explore connections between ingredients and dishes in an interactive 3D graph',
    path: '/side-quests/foodtree'
  },
  {
    id: 'rocketry-lab',
    title: 'NC State Liquid Rocketry Lab',
    image: '/img/projects/RDE/RDE_Cover.png',
    description: 'Advanced Projects Team Member - Rotating Detonation Engine Development',
    path: '/side-quests/ncsu-rocketry'
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

export default function SideQuests() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">
            Side <span className="text-blue-600 dark:text-blue-400">Quests</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 w-full"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-[280px] sm:max-w-xs md:max-w-sm"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <Link href={project.path} className="block w-full h-full">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 flex items-end justify-center ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="p-6 w-full text-center">
                      <p className="text-gray-200 text-lg">{project.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
