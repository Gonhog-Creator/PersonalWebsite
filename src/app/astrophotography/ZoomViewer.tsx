'use client';

import { useEffect, useRef, useState } from 'react';
import { FaSearchPlus, FaSearchMinus, FaExpand, FaHome, FaTimes } from 'react-icons/fa';
import type OpenSeadragon from 'openseadragon';

interface ZoomViewerProps {
  src: string;
  onExit: () => void;
}

/**
 * AstroBin-style deep zoom viewer (mounted on desktop only, on demand).
 * Loads the full-resolution JPEG as a simple image tile source, so no
 * pre-generated tiles are needed. Wheel/drag gestures are captured only
 * while the pointer is over the viewer, so page scroll still works
 * everywhere else.
 */
export function ZoomViewer({ src, onExit }: ZoomViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const lastSrcRef = useRef(src);
  const hoveringRef = useRef(false);
  // Stays transparent until the full-res image opens so the medium-res
  // image underneath covers the grow animation and initial load.
  const [loaded, setLoaded] = useState(false);

  // Create the viewer once on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const OSD = (await import('openseadragon')).default;
      if (cancelled || !containerRef.current) return;

      const el = containerRef.current;
      el.addEventListener('mouseenter', () => { hoveringRef.current = true; });
      el.addEventListener('mouseleave', () => { hoveringRef.current = false; });

      viewerRef.current = OSD({
        element: el,
        tileSources: { type: 'image', url: lastSrcRef.current },
        showNavigationControl: false,
        zoomInButton: 'dso-zoom-in',
        zoomOutButton: 'dso-zoom-out',
        homeButton: 'dso-zoom-home',
        fullPageButton: 'dso-zoom-full',
        gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
        minZoomLevel: 0.5,
        maxZoomPixelRatio: 5,
        visibilityRatio: 0.1,
        animationTime: 0.3,
      });

      viewerRef.current.addHandler('open', () => setLoaded(true));
    })();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  // Swap the image when the active palette/source changes
  useEffect(() => {
    if (src === lastSrcRef.current) return;
    lastSrcRef.current = src;
    setLoaded(false);
    viewerRef.current?.open({ tileSource: { type: 'image', url: src } });
  }, [src]);

  // Esc exits zoom mode (capture phase, so it doesn't also close the
  // detail modal). While the pointer is over the viewer, arrow keys are
  // kept from triggering DSO prev/next navigation in the parent page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onExit();
        return;
      }
      if (hoveringRef.current && e.key.startsWith('Arrow')) {
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onExit]);

  const btnClass =
    'p-2.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-200 hover:text-white transition-colors backdrop-blur-sm border border-white/10';

  return (
    <div className="absolute inset-0 group/zoom">
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-colors duration-300 ${loaded ? 'bg-black' : ''}`}
      />

      {/* Controls - ids are wired to OpenSeadragon button options */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button id="dso-zoom-in" className={btnClass} aria-label="Zoom in">
          <FaSearchPlus size={16} />
        </button>
        <button id="dso-zoom-out" className={btnClass} aria-label="Zoom out">
          <FaSearchMinus size={16} />
        </button>
        <button id="dso-zoom-home" className={btnClass} aria-label="Reset zoom">
          <FaHome size={16} />
        </button>
        <button id="dso-zoom-full" className={btnClass} aria-label="Toggle fullscreen">
          <FaExpand size={16} />
        </button>
        <button onClick={onExit} className={btnClass} aria-label="Exit zoom" title="Exit zoom (Esc)">
          <FaTimes size={16} />
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-gray-300 bg-black/60 px-4 py-1.5 rounded-full pointer-events-none whitespace-nowrap opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300">
        Scroll to zoom · Drag to pan · Double-click to zoom in · Esc to exit
      </div>
    </div>
  );
}
