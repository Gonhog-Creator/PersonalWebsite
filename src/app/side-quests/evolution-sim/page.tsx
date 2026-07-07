'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProjectHeader } from '@/components/gallery/ProjectHeader';
import { Spacer } from '@/components/ui/Spacer';
import { evolutionSimPosts } from '@/data/evolutionSimPosts';

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export default function EvolutionSimPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <ProjectHeader />

      {/* Hero */}
      <section className="relative pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-gray-900 to-gray-900" />
        <Spacer className="h-40" />
        <div className="w-full max-w-3xl mx-auto relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-emerald-400 font-medium tracking-widest uppercase text-sm mb-4"
          >
            Devblog
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-white"
          >
            Evolution <span className="text-emerald-400">Sim</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Building a simulator where creatures controlled by neural networks
            evolve, adapt, and compete over generations.
          </motion.p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10">
            Latest Posts
          </h2>

          {evolutionSimPosts.length === 0 ? (
            <p className="text-gray-400 text-center py-16">
              No posts yet. Check back soon!
            </p>
          ) : (
            <div className="space-y-6">
              {evolutionSimPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/side-quests/evolution-sim/${post.slug}`}
                    className="block bg-gray-800/60 border border-gray-700/60 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-emerald-500/50 hover:bg-gray-800 group"
                  >
                    <time className="text-sm text-gray-500">
                      {formatDate(post.date)}
                    </time>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mt-2 mb-3 group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                    {post.tags && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
