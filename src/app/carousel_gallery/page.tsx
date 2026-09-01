"use client";

import { useEffect, useState, useCallback } from 'react';
import galleryImages from '@/data/galleryImages.json';
import galleryPanos from '@/data/galleryPanos.json';

const REFRESH_INTERVAL = 15000;
const ALL_PANO_COUNT = 3;
const COLS_NORMAL = 7;
const COLS_2K = 9;
const PHOTOS_PER_COL_NORMAL = 6;
const PHOTOS_PER_COL_WITH_PANO = 5;

// Layout heights (vh) - must total ~100vh per layout
// normal: 1 masonry section × 100vh
// top-pano: 18vh pano + 1 masonry × 82vh
// bottom-pano: 1 masonry × 82vh + 18vh pano
// all-pano: 3 panos × 33vh = 99vh
const PANO_VH = { 'top-pano': 18, 'bottom-pano': 18, 'all-pano': 33 };
const GRID_VH = { normal: 100, 'top-pano': 82, 'bottom-pano': 82 };

type LayoutType = 'normal' | 'top-pano' | 'bottom-pano' | 'all-pano';
const LAYOUTS: LayoutType[] = ['normal', 'top-pano', 'bottom-pano', 'all-pano'];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type LayoutData = {
  type: LayoutType;
  panoramas: string[];
  columns: string[][];
};

const panoPattern = /panorama/i;
const regularOnly = galleryImages.filter(src => !panoPattern.test(src));

function distributeToColumns(items: string[], cols: number): string[][] {
  const columns: string[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });
  return columns;
}

function generateLayout(type: LayoutType, colCount: number): LayoutData {
  const shuffledRegular = shuffle(regularOnly);
  const shuffledPanos = shuffle(galleryPanos);
  let regIdx = 0;
  let panoIdx = 0;

  const getRegBatch = (count: number, colCount: number) => {
    const batch: string[] = [];
    for (let r = 0; r < count; r++) {
      if (regIdx >= shuffledRegular.length) regIdx = 0;
      batch.push(shuffledRegular[regIdx++]);
    }
    return distributeToColumns(batch, colCount);
  };

  const getPano = () => {
    if (panoIdx >= shuffledPanos.length) panoIdx = 0;
    return shuffledPanos[panoIdx++];
  };

  if (type === 'all-pano') {
    const panoramas: string[] = [];
    for (let i = 0; i < ALL_PANO_COUNT; i++) panoramas.push(getPano());
    return { type, panoramas, columns: [] };
  }

  if (type === 'top-pano') {
    return {
      type,
      panoramas: [getPano(), getPano()],
      columns: getRegBatch(PHOTOS_PER_COL_WITH_PANO * colCount, colCount),
    };
  }

  if (type === 'bottom-pano') {
    return {
      type,
      panoramas: [getPano(), getPano()],
      columns: getRegBatch(PHOTOS_PER_COL_WITH_PANO * colCount, colCount),
    };
  }

  // normal - single full-screen masonry
  return { type, panoramas: [], columns: getRegBatch(PHOTOS_PER_COL_NORMAL * colCount, colCount) };
}

export default function Screensaver() {
  const [data, setData] = useState<LayoutData | null>(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [colCount, setColCount] = useState(COLS_NORMAL);

  useEffect(() => {
    const updateCols = () => {
      setColCount(window.innerWidth >= 2048 ? COLS_2K : COLS_NORMAL);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const refresh = useCallback((newLayout: boolean) => {
    setLayoutIdx(prev => {
      const nextIdx = newLayout ? (prev + 1) % LAYOUTS.length : prev;
      setData(generateLayout(LAYOUTS[nextIdx], colCount));
      return nextIdx;
    });
    setFadeKey(k => k + 1);
    setLoading(false);
  }, [colCount]);

  useEffect(() => {
    refresh(false);
    const interval = setInterval(() => refresh(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading || !data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const panoVh = PANO_VH[data.type] ?? 0;
  const gridVh = GRID_VH[data.type] ?? 100;

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <div key={fadeKey} className="flex flex-col h-full animate-fadeIn">
        {/* Top panorama row */}
        {data.type === 'top-pano' && (
          <div className="flex gap-[3px] px-[3px] pt-[3px] shrink-0" style={{ height: `${panoVh}vh` }}>
            {data.panoramas.map((src, i) => (
              <div
                key={`p-top-${fadeKey}-${i}`}
                className="flex-1 overflow-hidden bg-gray-900 relative rounded-md"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.04}s both` }}
              >
                <img src={src} alt="" loading="lazy" className="w-full h-full block object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        )}

        {/* All-panorama layout */}
        {data.type === 'all-pano' && (
          <div className="flex flex-col gap-[3px] px-[3px] pt-[3px] h-full">
            {data.panoramas.map((src, i) => (
              <div
                key={`p-all-${fadeKey}-${i}`}
                className="flex-1 overflow-hidden bg-gray-900 relative rounded-md"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.06}s both` }}
              >
                <img src={src} alt="" loading="lazy" className="w-full h-full block object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        )}

        {/* Single masonry section filling remaining space */}
        {data.columns?.length > 0 && (
          <div
            className="flex gap-[3px] px-[3px] py-[3px] shrink-0 overflow-hidden"
            style={{ height: `${gridVh}vh` }}
          >
            {data.columns.map((col, cIdx) => (
              <div key={`col-${fadeKey}-${cIdx}`} className="flex-1 flex flex-col gap-[3px] min-h-0 overflow-hidden">
                {col.map((src, i) => {
                  const isLast = i === col.length - 1;
                  return (
                    <div
                      key={`m-${fadeKey}-${cIdx}-${i}`}
                      className={`relative overflow-hidden bg-gray-900 rounded-md ${isLast ? 'flex-1 min-h-0' : 'shrink-0'}`}
                      style={{ animation: `fadeInUp 0.5s ease-out ${(cIdx * 4 + i) * 0.015}s both` }}
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className={`w-full block ${isLast ? 'h-full object-cover' : 'h-auto'}`}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Bottom panorama row */}
        {data.type === 'bottom-pano' && (
          <div className="flex gap-[3px] px-[3px] pb-[3px] shrink-0" style={{ height: `${panoVh}vh` }}>
            {data.panoramas.map((src, i) => (
              <div
                key={`p-bot-${fadeKey}-${i}`}
                className="flex-1 overflow-hidden bg-gray-900 relative rounded-md"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.04}s both` }}
              >
                <img src={src} alt="" loading="lazy" className="w-full h-full block object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
