'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { DSOImage, CatalogueType } from '@/types/astro';

interface DSOCardProps {
  dso: DSOImage;
  onSelect: (dso: DSOImage) => void;
}

const cataloguePrefix: Record<CatalogueType, string> = {
  messier: 'M',
  ngc: 'NGC',
  ic: 'IC',
  barnard: 'B',
  sharpless: 'Sh2',
  other: '',
};

function formatCatalogue(dso: DSOImage): string {
  if (!dso.catalogues || dso.catalogues.length === 0) return '';
  const priority: CatalogueType[] = ['messier', 'ngc', 'ic', 'sharpless', 'barnard', 'other'];
  for (const pref of priority) {
    const cat = dso.catalogues.find(c => c.type === pref);
    if (cat) {
      const prefix = cataloguePrefix[cat.type];
      return prefix ? `${prefix} ${cat.number}` : String(cat.number);
    }
  }
  return '';
}

function formatExposureShort(exposure: string): string {
  const match = exposure.match(/([\d.]+)\s*hour/i);
  if (match) return `${match[1]} hours`;
  const minMatch = exposure.match(/([\d.]+)\s*min/i);
  if (minMatch) return `${minMatch[1]} min`;
  return exposure;
}

export function DSOCard({ dso, onSelect }: DSOCardProps) {
  const catalogue = formatCatalogue(dso);
  const exposureShort = formatExposureShort(dso.exposure);
  const integrationParts = [catalogue, dso.type.replace('-', ' '), exposureShort].filter(Boolean);
  const integrationLine = integrationParts.join(' | ');

  return (
    <motion.div
      className="relative bg-gray-800/40 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
      onClick={() => onSelect(dso)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        layoutId={`dso-image-${dso.id}`}
        className="relative aspect-[16/9] bg-gray-900 overflow-hidden"
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Image
          src={dso.imageUrl}
          alt={dso.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
      </motion.div>
      <div className="px-4 pt-3 pb-2">
        <motion.h3
          layoutId={`dso-title-${dso.id}`}
          className="text-base font-bold text-white"
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {dso.title}
        </motion.h3>
        <p className="text-gray-500 text-xs capitalize">{integrationLine}</p>
      </div>
    </motion.div>
  );
}
