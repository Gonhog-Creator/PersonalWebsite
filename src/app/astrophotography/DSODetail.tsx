'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { DSOImage } from '@/types/astro';

interface DSODetailProps {
  dso: DSOImage;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function DSODetail({ dso, onClose, onNavigate }: DSODetailProps) {
  const [isVertical, setIsVertical] = useState(false);
  const [activePalette, setActivePalette] = useState<'sho' | 'hoo' | 'custom'>('sho');

  const hasPalettes = !!(dso.palettes?.sho || dso.palettes?.hoo || dso.palettes?.custom);

  const paletteOptions: { key: 'sho' | 'hoo' | 'custom'; label: string }[] = [];
  if (dso.palettes?.sho) paletteOptions.push({ key: 'sho', label: 'SHO' });
  if (dso.palettes?.hoo) paletteOptions.push({ key: 'hoo', label: 'HOO' });
  if (dso.palettes?.custom) paletteOptions.push({ key: 'custom', label: dso.palettes.customLabel || 'Custom' });

  const activeImageSrc = hasPalettes
    ? (dso.palettes?.[activePalette] || dso.imageUrl)
    : dso.imageUrl;

  const paletteAstrobinUrls: Record<string, string | undefined> = {
    sho: dso.palettes?.shoAstrobinUrl,
    hoo: dso.palettes?.hooAstrobinUrl,
    custom: dso.palettes?.customAstrobinUrl,
  };
  const activeAstrobinUrl = paletteAstrobinUrls[activePalette] || dso.astrobinUrl;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm overflow-y-auto overscroll-contain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-[100] flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onNavigate('prev')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <FaArrowLeft size={18} />
          <span className="text-sm hidden sm:inline">Prev</span>
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-2"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Next"
        >
          <span className="text-sm hidden sm:inline">Next</span>
          <FaArrowRight size={18} />
        </button>
      </div>

      <div className="mx-auto px-4 sm:px-8 pb-16 w-full" onClick={e => e.stopPropagation()}>
        {isVertical ? (
          /* Side-by-side layout for vertical images */
          <div className="flex flex-col md:flex-row gap-8 mt-4">
            {/* Image column */}
            <div className="md:w-1/2 md:flex-shrink-0">
              <motion.div
                layoutId={`dso-image-${dso.id}`}
                className="relative w-full h-[50vh] md:h-[75vh] overflow-hidden"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ pointerEvents: 'none' }}
              >
                <Image
                  src={activeImageSrc}
                  alt={dso.title}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (img.naturalWidth && img.naturalHeight) {
                      setIsVertical(img.naturalHeight > img.naturalWidth);
                    }
                  }}
                />
              </motion.div>
              <div className="flex justify-center items-center gap-4 mt-3" onClick={e => e.stopPropagation()}>
                {hasPalettes && (
                  <div className="flex gap-2">
                    {paletteOptions.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setActivePalette(opt.key)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activePalette === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
                {activeAstrobinUrl ? (
                  <a
                    href={activeAstrobinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    View full resolution ↗
                  </a>
                ) : (
                  <a
                    href={activeImageSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    View full resolution ↗
                  </a>
                )}
              </div>
            </div>

            {/* Details column */}
            <div className="md:w-1/2 md:flex-1">
              <motion.div
                layoutId={`dso-title-${dso.id}`}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ pointerEvents: 'none' }}
              >
                <h1 className="text-3xl font-bold text-white">{dso.title}</h1>
              </motion.div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="px-3 py-1 bg-purple-900/40 text-purple-300 text-sm rounded-full capitalize">
                  {dso.type.replace('-', ' ')}
                </span>
                <span className="text-gray-400 text-sm">{dso.constellation}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">{dso.date}</span>
              </div>

              <p className="text-gray-300 mt-6 leading-relaxed">
                {dso.fullDescription}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Acquisition</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Telescope</span>
                      <span className="text-gray-200">{dso.telescope}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Exposure</span>
                      <span className="text-gray-200">{dso.exposure}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location</span>
                      <span className="text-gray-200">{dso.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-200">{dso.date}</span>
                    </div>
                  </div>
                </div>

                {dso.integration && dso.integration.length > 0 && (
                  <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                    <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Integration</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 text-xs uppercase tracking-wide">
                            <th className="text-left pb-2">Filter</th>
                            <th className="text-right pb-2">Frames</th>
                            <th className="text-right pb-2">Sub</th>
                            <th className="text-right pb-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dso.integration.map((row, i) => (
                            <tr key={i} className="border-t border-gray-800">
                              <td className="py-2 text-gray-200">{row.filter}</td>
                              <td className="py-2 text-right text-gray-400">{row.frames}</td>
                              <td className="py-2 text-right text-gray-400">{row.subExposure}</td>
                              <td className="py-2 text-right text-gray-200 font-medium">{row.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Catalogues</h3>
                  <div className="flex flex-wrap gap-2">
                    {dso.catalogues?.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
                      >
                        <span className="text-gray-500 capitalize">{cat.type} </span>
                        {cat.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {dso.processing && (
                <div className="mt-4 bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                  <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wide text-gray-400">Processing</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{dso.processing}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Stacked layout for horizontal images */
          <>
            {/* Hero image with shared layout transition */}
            <motion.div
              layoutId={`dso-image-${dso.id}`}
              className="relative w-full h-[75vh] overflow-hidden"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ pointerEvents: 'none' }}
            >
              <Image
                src={activeImageSrc}
                alt={dso.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.naturalWidth && img.naturalHeight) {
                    setIsVertical(img.naturalHeight > img.naturalWidth);
                  }
                }}
              />
            </motion.div>

            <div className="flex justify-center items-center gap-4 mt-4" onClick={e => e.stopPropagation()}>
              {hasPalettes && (
                <div className="flex gap-2">
                  {paletteOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setActivePalette(opt.key)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activePalette === opt.key ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
              {activeAstrobinUrl ? (
                <a
                  href={activeAstrobinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View full resolution ↗
                </a>
              ) : (
                <a
                  href={activeImageSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  View full resolution ↗
                </a>
              )}
            </div>

            {/* Title with shared layout transition */}
            <motion.div
              layoutId={`dso-title-${dso.id}`}
              className="mt-6"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{ pointerEvents: 'none' }}
            >
              <h1 className="text-3xl font-bold text-white">{dso.title}</h1>
            </motion.div>

            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="px-3 py-1 bg-purple-900/40 text-purple-300 text-sm rounded-full capitalize">
                {dso.type.replace('-', ' ')}
              </span>
              <span className="text-gray-400 text-sm">{dso.constellation}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">{dso.date}</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 mt-6 leading-relaxed">
              {dso.fullDescription}
            </p>

            {/* Acquisition table */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Acquisition</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Telescope</span>
                    <span className="text-gray-200">{dso.telescope}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Exposure</span>
                    <span className="text-gray-200">{dso.exposure}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="text-gray-200">{dso.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-200">{dso.date}</span>
                  </div>
                </div>
              </div>

              {dso.integration && dso.integration.length > 0 && (
                <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                  <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Integration</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-wide">
                          <th className="text-left pb-2">Filter</th>
                          <th className="text-right pb-2">Frames</th>
                          <th className="text-right pb-2">Sub</th>
                          <th className="text-right pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dso.integration.map((row, i) => (
                          <tr key={i} className="border-t border-gray-800">
                            <td className="py-2 text-gray-200">{row.filter}</td>
                            <td className="py-2 text-right text-gray-400">{row.frames}</td>
                            <td className="py-2 text-right text-gray-400">{row.subExposure}</td>
                            <td className="py-2 text-right text-gray-200 font-medium">{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">Catalogues</h3>
                <div className="flex flex-wrap gap-2">
                  {dso.catalogues?.map((cat, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
                    >
                      <span className="text-gray-500 capitalize">{cat.type} </span>
                      {cat.number}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Processing */}
            {dso.processing && (
              <div className="mt-6 bg-gray-900/60 rounded-xl p-5 border border-gray-800">
                <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wide text-gray-400">Processing</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{dso.processing}</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
