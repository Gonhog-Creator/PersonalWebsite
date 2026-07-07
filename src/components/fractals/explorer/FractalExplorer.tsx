'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  RefreshCw,
  RotateCcw,
  Camera,
  Maximize,
  Minimize,
  Palette,
  BookOpen,
  Settings,
  Square,
  Target,
  Scale,
  Bug,
  ChevronRight,
  ChevronLeft,
  Copy,
} from 'lucide-react';
import { FractalRenderer } from './core/renderer';
import { fractalList, getFractalModule } from './fractals';
import { COLOR_SCHEMES } from './core/colorSchemes';
import type { FractalParams, Vec2 } from './types';

const DEFAULT_PARAMS: FractalParams = {
  iterations: 100,
  zoom: 1,
  offset: { x: 0, y: 0 },
  juliaC: { x: -0.7269, y: 0.1889 },
  xScale: 1,
  yScale: 1,
  colorScheme: 'classic',
};

function parseParams(searchParams: URLSearchParams): {
  fractalId: string;
  params: FractalParams;
} {
  const fractalId = searchParams.get('fractal') || 'mandelbrot';
  const module = getFractalModule(fractalId);

  const params: FractalParams = {
    iterations: parseInt(searchParams.get('iterations') || String(DEFAULT_PARAMS.iterations), 10),
    zoom: parseFloat(searchParams.get('zoom') || String(DEFAULT_PARAMS.zoom)),
    offset: {
      x: parseFloat(searchParams.get('ox') || String(DEFAULT_PARAMS.offset.x)),
      y: parseFloat(searchParams.get('oy') || String(DEFAULT_PARAMS.offset.y)),
    },
    juliaC: {
      x: parseFloat(searchParams.get('jx') || String(DEFAULT_PARAMS.juliaC.x)),
      y: parseFloat(searchParams.get('jy') || String(DEFAULT_PARAMS.juliaC.y)),
    },
    xScale: parseFloat(searchParams.get('xs') || String(DEFAULT_PARAMS.xScale)),
    yScale: parseFloat(searchParams.get('ys') || String(DEFAULT_PARAMS.yScale)),
    colorScheme: searchParams.get('scheme') || DEFAULT_PARAMS.colorScheme,
  };

  if (module?.config.initialPosition) {
    params.zoom = module.config.initialPosition.zoom ?? params.zoom;
    params.offset = {
      x: module.config.initialPosition.offset?.x ?? params.offset.x,
      y: module.config.initialPosition.offset?.y ?? params.offset.y,
    };
  }

  if (module?.config.initialSettings?.colorScheme) {
    params.colorScheme = module.config.initialSettings.colorScheme;
  }

  return { fractalId, params };
}

function buildQueryString(fractalId: string, params: FractalParams): string {
  const query = new URLSearchParams();
  query.set('fractal', fractalId);
  query.set('iterations', String(params.iterations));
  query.set('zoom', String(params.zoom));
  query.set('ox', params.offset.x.toFixed(8));
  query.set('oy', params.offset.y.toFixed(8));
  if (params.juliaC.x !== 0 || params.juliaC.y !== 0) {
    query.set('jx', params.juliaC.x.toFixed(8));
    query.set('jy', params.juliaC.y.toFixed(8));
  }
  query.set('xs', String(params.xScale));
  query.set('ys', String(params.yScale));
  query.set('scheme', params.colorScheme);
  return query.toString();
}

export function FractalExplorer(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fractalId, params: initialParams } = parseParams(searchParams);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<FractalRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const latestParamsRef = useRef<FractalParams>(initialParams);
  const isInitialMount = useRef(true);

  const [fractalIdState, setFractalIdState] = useState(fractalId);
  const [params, setParams] = useState<FractalParams>(initialParams);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Vec2>({ x: 0, y: 0 });
  const [offsetStart, setOffsetStart] = useState<Vec2>({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openSections, setOpenSections] = useState({
    gettingStarted: true,
    settings: false,
    fractal: true,
    iterations: true,
    julia: currentFractal?.config.supportsJuliaC ?? false,
    scale: true,
    debugInfo: false,
  });

  const currentFractal = getFractalModule(fractalIdState);

  const updateUrl = useCallback(
    (id: string, p: FractalParams) => {
      const query = buildQueryString(id, p);
      router.replace(`?${query}`, { scroll: false });
    },
    [router]
  );

  const updateParams = useCallback(
    (updater: (prev: FractalParams) => FractalParams) => {
      setParams(updater);
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new FractalRenderer(canvas);
    renderer.initialize();
    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!currentFractal || !rendererRef.current) return;
    rendererRef.current.setFractal(currentFractal, params);
  }, [currentFractal, fractalIdState]);

  useEffect(() => {
    setOpenSections((prev) => ({
      ...prev,
      julia: currentFractal?.config.supportsJuliaC ?? false,
    }));
  }, [currentFractal]);

  useEffect(() => {
    latestParamsRef.current = params;
  }, [params]);

  useEffect(() => {
    rendererRef.current?.updateParams(params);
  }, [params]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isDragging) return;
    updateUrl(fractalIdState, params);
  }, [fractalIdState, params, isDragging, updateUrl]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      setTimeout(() => {
        rendererRef.current?.resizeCanvas();
        rendererRef.current?.renderProgressive();
      }, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleZoom = (factor: number, centerX: number, centerY: number) => {
    if (!containerRef.current || !currentFractal) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (centerX - rect.left) / rect.width;
    const y = 1 - (centerY - rect.top) / rect.height;

    setParams((prev) => {
      const aspect = rect.width / rect.height;
      const scale = 4 / (prev.zoom * factor);

      const worldX = (x - 0.5) * scale * aspect * prev.yScale + prev.offset.x;
      const worldY = (y - 0.5) * scale * prev.yScale + prev.offset.y;

      const newZoom = prev.zoom * factor;
      const newScale = 4 / newZoom;
      const newOffsetX = worldX - (x - 0.5) * newScale * aspect * prev.yScale;
      const newOffsetY = worldY - (y - 0.5) * newScale * prev.yScale;

      return {
        ...prev,
        zoom: newZoom,
        offset: { x: newOffsetX, y: newOffsetY },
      };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOffsetStart({ ...params.offset });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const currentParams = latestParamsRef.current;
    const scale = 4 / currentParams.zoom;
    const aspect = rect.width / rect.height;
    const worldDx = (dx / rect.width) * scale * aspect;
    const worldDy = -(dy / rect.height) * scale;

    const next = {
      ...currentParams,
      offset: {
        x: offsetStart.x - worldDx,
        y: offsetStart.y - worldDy,
      },
    };

    setParams(next);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.8 : 1.25;
    handleZoom(factor, e.clientX, e.clientY);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    handleZoom(2, e.clientX, e.clientY);
  };

  const handleFractalChange = (id: string) => {
    const module = getFractalModule(id);
    if (!module) return;

    setFractalIdState(id);
    const next: FractalParams = {
      ...DEFAULT_PARAMS,
      zoom: module.config.initialPosition?.zoom ?? DEFAULT_PARAMS.zoom,
      offset: {
        x: module.config.initialPosition?.offset?.x ?? DEFAULT_PARAMS.offset.x,
        y: module.config.initialPosition?.offset?.y ?? DEFAULT_PARAMS.offset.y,
      },
      xScale: module.config.supportsOrder ? 0 : DEFAULT_PARAMS.xScale,
      colorScheme: module.config.initialSettings?.colorScheme ?? DEFAULT_PARAMS.colorScheme,
    };
    setParams(next);
  };

  const handleRender = () => {
    rendererRef.current?.renderProgressive();
  };

  const handleReset = () => {
    if (!currentFractal) return;
    const next = {
      ...params,
      zoom: currentFractal.config.initialPosition?.zoom ?? DEFAULT_PARAMS.zoom,
      offset: {
        x: currentFractal.config.initialPosition?.offset?.x ?? DEFAULT_PARAMS.offset.x,
        y: currentFractal.config.initialPosition?.offset?.y ?? DEFAULT_PARAMS.offset.y,
      },
    };
    setParams(next);
  };

  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `fractal-${fractalIdState}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setTimeout(() => {
      rendererRef.current?.resizeCanvas();
      rendererRef.current?.renderProgressive();
    }, 300);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
    setTimeout(() => {
      rendererRef.current?.resizeCanvas();
      rendererRef.current?.renderProgressive();
    }, 300);
  };

  const sectionHeader = (
    id: keyof typeof openSections,
    icon: React.ReactNode,
    title: string
  ) => (
    <button
      onClick={() => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))}
      className="w-full flex items-center gap-2 py-2.5 text-left hover:bg-[#353535] transition-colors"
    >
      <span className="text-[#a0a0a0]">{icon}</span>
      <span className="text-[0.85rem] font-medium flex-1">{title}</span>
      <ChevronRight
        size={14}
        className={`text-[#a0a0a0] transition-transform duration-300 ${
          openSections[id] ? 'rotate-90' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="h-screen w-screen bg-[#0f0f0f] text-white overflow-hidden flex">
      {/* Left Sidebar */}
      <aside
        className={`shrink-0 h-full bg-[#252525] border-r border-[#3a3a3a] flex flex-col transition-all duration-300 ease-in-out px-3 ${
          sidebarOpen ? 'w-[320px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
        }`}
      >
        <header className="flex items-center gap-2 py-3 border-b border-[#3a3a3a] bg-[#1a1a1a]">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-[#a0a0a0] hover:bg-[#353535] hover:text-white transition-colors"
            aria-label="Hide sidebar"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-[0.7rem] font-semibold tracking-wide uppercase text-[#a0a0a0]">
            Rendering Settings
          </span>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Warning */}
          <div className="flex items-start gap-2 p-2.5 my-2.5 bg-[rgb(255_193_7/12%)] border border-[rgb(255_193_7/25%)] rounded text-[#ffc107] text-xs leading-snug">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-0.5"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Some fractals, or using a higher number of iterations, may cause your browser to become unresponsive.</span>
          </div>

          {/* Getting Started */}
          <section className="border-t border-b border-[#3a3a3a]">
            {sectionHeader('gettingStarted', <BookOpen size={16} />, 'Getting Started')}
            <div
              className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                openSections.gettingStarted ? 'max-h-[1000px] pb-3' : 'max-h-0'
              }`}
            >
              <div className="space-y-4">
                <div className="control">
                  <div className="control-label">What is a fractal?</div>
                  <p className="text-xs leading-relaxed">
                    A fractal is a shape or pattern that repeats itself at every size. When you zoom
                    in, you keep finding smaller versions of the same pattern, almost like the shape
                    goes on forever. It is a never ending pattern that keeps looking similar no matter
                    how close you get.
                  </p>
                </div>
                <div className="control">
                  <div className="control-label">Key points</div>
                  <ul className="list-disc pl-4 text-xs space-y-0.5">
                    <li>A fractal repeats its pattern again and again.</li>
                    <li>Zooming in reveals smaller versions of the same shape.</li>
                    <li>The pattern can go on forever in theory.</li>
                    <li>Examples in nature include trees, ferns and coastlines.</li>
                  </ul>
                </div>
                <div className="control">
                  <div className="control-label">Pan & Zoom Controls</div>
                  <ul className="list-disc pl-4 text-xs space-y-0.5">
                    <li><strong className="text-white">Pan</strong>: Click and drag on the fractal.</li>
                    <li><strong className="text-white">Double-Click</strong>: Zoom in around a point.</li>
                    <li><strong className="text-white">Scroll</strong>: Use the mouse wheel to zoom in and out.</li>
                  </ul>
                </div>
                <div className="control">
                  <div className="control-label">Fractal Selection</div>
                  <p className="text-xs leading-relaxed">
                    Choose from the fractal types using the dropdown menu. Explore Mandelbrot variants, Julia sets, and more.
                  </p>
                </div>
                <div className="control">
                  <div className="control-label">Color Schemes</div>
                  <p className="text-xs leading-relaxed">
                    Experiment with color schemes to change the visual appearance. Access the Colour Scheme selector in the right panel.
                  </p>
                </div>
                <div className="control">
                  <div className="control-label">Iterations</div>
                  <p className="text-xs leading-relaxed">
                    Adjust the iteration count (20-400) to control the level of detail. Higher iterations reveal more intricate patterns but take longer to render.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Settings */}
          <section className="border-b border-[#3a3a3a]">
            {sectionHeader('settings', <Settings size={16} />, 'Settings')}
            <div
              className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                openSections.settings ? 'max-h-[500px] pb-3' : 'max-h-0'
              }`}
            >
              <div className="space-y-4">
                <div className="control">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="mt-0.5" defaultChecked />
                    <div>
                      <div className="text-xs font-medium text-white">Auto-Render on Change</div>
                      <div className="text-[0.7rem] text-[#a0a0a0]">Automatically update the fractal when settings change</div>
                    </div>
                  </label>
                </div>
                <div className="control">
                  <div className="control-label">Export Resolution</div>
                  <div className="flex gap-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="export-resolution" defaultChecked />
                      <span>Default</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="export-resolution" />
                      <span>4K</span>
                    </label>
                  </div>
                </div>
                <div className="control">
                  <div className="control-label">Coordinates</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#a0a0a0]">Zoom:</span>
                      <span className="text-white">{params.zoom.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a0a0a0]">Offset X:</span>
                      <span className="text-white">{params.offset.x.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a0a0a0]">Offset Y:</span>
                      <span className="text-white">{params.offset.y.toFixed(6)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `Zoom: ${params.zoom.toFixed(4)}, Offset: ${params.offset.x.toFixed(6)}, ${params.offset.y.toFixed(6)}`
                      )
                    }
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2d2d2d] border border-[#3a3a3a] text-xs text-white hover:border-[#4a9eff] hover:bg-[#353535] transition-colors"
                  >
                    <Copy size={12} />
                    Copy Coordinates
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Fractal */}
          <section className="border-b border-[#3a3a3a]">
            {sectionHeader('fractal', <Square size={16} />, 'Fractal')}
            <div
              className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                openSections.fractal ? 'max-h-[400px] pb-3' : 'max-h-0'
              }`}
            >
              <div className="control">
                <label className="control-label">Type</label>
                <select
                  value={fractalIdState}
                  onChange={(e) => handleFractalChange(e.target.value)}
                  className="styled-select compact"
                >
                  {fractalList.map((fractal) => (
                    <option key={fractal.id} value={fractal.id}>
                      {fractal.name}
                    </option>
                  ))}
                </select>
              </div>
              {currentFractal && (
                <div className="control">
                  <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded px-3 py-2 text-center">
                    <span className="text-base text-white font-mono">{currentFractal.config.equation}</span>
                  </div>
                  <p className="text-xs leading-relaxed mt-2">{currentFractal.config.description}</p>
                </div>
              )}
            </div>
          </section>

          {/* Iterations */}
          <section className="border-b border-[#3a3a3a]">
            {sectionHeader('iterations', <RefreshCw size={16} />, 'Iterations')}
            <div
              className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                openSections.iterations ? 'max-h-[200px] pb-3' : 'max-h-0'
              }`}
            >
              <div className="control">
                <label className="flex justify-between text-xs text-white mb-1.5">
                  <span>Count</span>
                  <span className="value">{params.iterations}</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={params.iterations}
                  onChange={(e) =>
                    updateParams((prev) => ({
                      ...prev,
                      iterations: parseInt(e.target.value, 10),
                    }))
                  }
                  className="styled-slider"
                />
              </div>
            </div>
          </section>

          {/* Julia Parameters */}
          {currentFractal?.config.supportsJuliaC && (
            <section className="border-b border-[#3a3a3a]">
              {sectionHeader('julia', <Target size={16} />, 'Julia Parameters')}
              <div
                className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                  openSections.julia ? 'max-h-[300px] pb-3' : 'max-h-0'
                }`}
              >
                <div className="control">
                  <label className="flex justify-between text-xs text-white mb-1.5">
                    <span>C (Real)</span>
                    <span className="value">{params.juliaC.x.toFixed(4)}</span>
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.01"
                    value={params.juliaC.x}
                    onChange={(e) =>
                      updateParams((prev) => ({
                        ...prev,
                        juliaC: { ...prev.juliaC, x: parseFloat(e.target.value) },
                      }))
                    }
                    className="styled-slider"
                  />
                </div>
                <div className="control">
                  <label className="flex justify-between text-xs text-white mb-1.5">
                    <span>C (Imaginary)</span>
                    <span className="value">{params.juliaC.y.toFixed(4)}</span>
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.01"
                    value={params.juliaC.y}
                    onChange={(e) =>
                      updateParams((prev) => ({
                        ...prev,
                        juliaC: { ...prev.juliaC, y: parseFloat(e.target.value) },
                      }))
                    }
                    className="styled-slider"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Scale */}
          <section className="border-b border-[#3a3a3a]">
            {sectionHeader('scale', <Scale size={16} />, 'Scale')}
            <div
              className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                openSections.scale ? 'max-h-[300px] pb-3' : 'max-h-0'
              }`}
            >
              {currentFractal?.config.supportsOrder ? (
                <div className="control">
                  <label className="flex justify-between text-xs text-white mb-1.5">
                    <span>Order</span>
                    <span className="value">{(2 + params.xScale * 8).toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={params.xScale}
                    onChange={(e) =>
                      updateParams((prev) => ({
                        ...prev,
                        xScale: parseFloat(e.target.value),
                      }))
                    }
                    className="styled-slider"
                  />
                </div>
              ) : (
                <div className="control">
                  <div className="text-xs text-[#a0a0a0]">No scale parameters available for this fractal.</div>
                </div>
              )}
              <div className="control">
                <label className="flex justify-between text-xs text-white mb-1.5">
                  <span>Y Axis</span>
                  <span className="value">{params.yScale.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={params.yScale}
                  onChange={(e) =>
                    updateParams((prev) => ({
                      ...prev,
                      yScale: parseFloat(e.target.value),
                    }))
                  }
                  className="styled-slider"
                />
              </div>
            </div>
          </section>

          {/* Debug Info */}
          <section className="border-b border-[#3a3a3a]">
            {sectionHeader('debugInfo', <Bug size={16} />, 'Debug Info')}
            <div
              className={`text-sm text-[#a0a0a0] overflow-hidden transition-all duration-300 ${
                openSections.debugInfo ? 'max-h-[400px] pb-3' : 'max-h-0'
              }`}
            >
              <div className="space-y-3">
                {[
                  { label: 'Fractal Name', value: currentFractal?.name ?? '-' },
                  { label: 'Zoom', value: params.zoom.toFixed(4) },
                  { label: 'Offset X', value: params.offset.x.toFixed(6) },
                  { label: 'Offset Y', value: params.offset.y.toFixed(6) },
                  { label: 'Theme', value: params.colorScheme },
                ].map(({ label, value }) => (
                  <div key={label} className="control">
                    <div className="control-label text-xs">{label}</div>
                    <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#3a3a3a] rounded px-2.5 py-1.5">
                      <span className="text-xs text-white">{value}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(value)}
                        className="p-1 rounded text-[#a0a0a0] hover:text-white hover:bg-[#353535] transition-colors"
                        aria-label={`Copy ${label}`}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `${currentFractal?.name ?? ''} | Zoom: ${params.zoom.toFixed(4)} | Offset: ${params.offset.x.toFixed(6)}, ${params.offset.y.toFixed(6)} | Theme: ${params.colorScheme}`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-[#2d2d2d] border border-[#3a3a3a] text-xs text-white hover:border-[#4a9eff] hover:bg-[#353535] transition-colors"
                >
                  <Copy size={12} />
                  Copy All Debug Info
                </button>
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* Canvas Area */}
      <div className="relative flex-1 h-full bg-black">
        {/* Show left sidebar button */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-1/2 left-4 -translate-y-1/2 z-50 w-11 h-11 flex items-center justify-center rounded-lg bg-[rgb(45_45_45/85%)] border border-[rgb(255_255_255/20%)] text-white opacity-70 hover:opacity-100 hover:bg-[rgb(74_158_255/90%)] hover:border-[#4a9eff] transition-all shadow-lg backdrop-blur-md"
            aria-label="Show sidebar"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Show right sidebar button */}
        {!rightSidebarOpen && (
          <button
            onClick={toggleRightSidebar}
            className="fixed top-1/2 right-4 -translate-y-1/2 z-50 w-11 h-11 flex items-center justify-center rounded-lg bg-[rgb(45_45_45/85%)] border border-[rgb(255_255_255/20%)] text-white opacity-70 hover:opacity-100 hover:bg-[rgb(74_158_255/90%)] hover:border-[#4a9eff] transition-all shadow-lg backdrop-blur-md"
            aria-label="Show themes and presets"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Top Action Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-5 py-4 pointer-events-none bg-gradient-to-b from-black/70 via-black/40 to-transparent">
          <button
            type="button"
            onClick={handleRender}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[rgb(45_45_45/90%)] border border-white/15 shadow-lg backdrop-blur-md transition-all hover:bg-[#4a9eff] hover:border-[#4a9eff] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(74,158,255,0.3)] active:translate-y-0 active:bg-[#3a7ac7]"
          >
            <RefreshCw size={18} />
            <span>Render</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[rgb(45_45_45/90%)] border border-white/15 shadow-lg backdrop-blur-md transition-all hover:bg-[#4a9eff] hover:border-[#4a9eff] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(74,158,255,0.3)] active:translate-y-0 active:bg-[#3a7ac7]"
          >
            <RotateCcw size={18} />
            <span>Reset View</span>
          </button>
          <button
            type="button"
            onClick={handleScreenshot}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[rgb(45_45_45/90%)] border border-white/15 shadow-lg backdrop-blur-md transition-all hover:bg-[#4a9eff] hover:border-[#4a9eff] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(74,158,255,0.3)] active:translate-y-0 active:bg-[#3a7ac7]"
          >
            <Camera size={18} />
            <span>Screenshot</span>
          </button>
          <button
            type="button"
            onClick={handleFullscreen}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[rgb(45_45_45/90%)] border border-white/15 shadow-lg backdrop-blur-md transition-all hover:bg-[#4a9eff] hover:border-[#4a9eff] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(74,158,255,0.3)] active:translate-y-0 active:bg-[#3a7ac7]"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Right Sidebar - Themes & Presets */}
      <aside
        className={`shrink-0 h-full bg-[#252525] border-l border-[#3a3a3a] flex flex-col transition-all duration-300 ease-in-out px-3 ${
          rightSidebarOpen ? 'w-[280px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
        }`}
      >
        <header className="flex items-center gap-2 py-3 border-b border-[#3a3a3a] bg-[#1a1a1a]">
          <Palette size={18} className="text-[#a0a0a0]" />
          <span className="text-[0.7rem] font-semibold tracking-wide uppercase text-[#a0a0a0] flex-1">
            Themes & Presets
          </span>
          <button
            onClick={toggleRightSidebar}
            className="p-1 rounded-md text-[#a0a0a0] hover:bg-[#353535] hover:text-white transition-colors"
            aria-label="Hide themes and presets"
          >
            <ChevronRight size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-3 space-y-4">
          {/* Color Schemes */}
          <section>
            <div className="control-label mb-2">Color Schemes</div>
            <div className="control">
              <label className="compact-label mb-1.5">Theme</label>
              <select
                value={params.colorScheme}
                onChange={(e) =>
                  updateParams((prev) => ({ ...prev, colorScheme: e.target.value }))
                }
                className="styled-select compact"
              >
                {COLOR_SCHEMES.map((scheme) => (
                  <option key={scheme} value={scheme}>
                    {scheme}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Current View Info */}
          <section className="border-t border-[#3a3a3a] pt-3">
            <div className="control-label mb-2">Current View Info</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#a0a0a0]">Zoom:</span>
                <span className="text-white">{params.zoom.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a0a0]">Offset X:</span>
                <span className="text-white">{params.offset.x.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a0a0]">Offset Y:</span>
                <span className="text-white">{params.offset.y.toFixed(6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a0a0a0]">Iterations:</span>
                <input
                  type="number"
                  min="20"
                  max="400"
                  step="10"
                  value={params.iterations}
                  onChange={(e) =>
                    updateParams((prev) => ({
                      ...prev,
                      iterations: Math.max(20, Math.min(400, parseInt(e.target.value, 10) || 20)),
                    }))
                  }
                  className="w-14 bg-[#1a1a1a] border border-[#3a3a3a] rounded px-1 py-0.5 text-xs text-white text-center focus:border-[#4a9eff] focus:outline-none"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[#a0a0a0]">Theme:</span>
                <span className="text-white">{params.colorScheme}</span>
              </div>
            </div>
          </section>
        </div>
      </aside>

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .control {
          margin-bottom: 20px;
        }
        .control:last-child {
          margin-bottom: 0;
        }
        .control-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
          margin-bottom: 8px;
        }
        .compact-control {
          margin-bottom: 12px;
        }
        .compact-control:last-child {
          margin-bottom: 0;
        }
        .compact-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #a0a0a0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 5px;
        }
        .styled-select {
          width: 100%;
          padding: 10px 36px 10px 16px;
          background: #2d2d2d;
          border: 1px solid #3a3a3a;
          border-radius: 6px;
          color: #fff;
          font-size: 0.9rem;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: border-color 0.2s ease;
        }
        .styled-select.compact {
          padding: 7px 32px 7px 12px;
          font-size: 0.85rem;
          background-position: right 10px center;
        }
        .styled-select:hover {
          border-color: #4a4a4a;
        }
        .styled-select:focus {
          outline: none;
          border-color: #4a9eff;
        }
        .styled-select option {
          background: #2d2d2d;
          color: #fff;
        }
        .styled-slider {
          width: 100%;
          height: 4px;
          background: #2d2d2d;
          border-radius: 2px;
          outline: none;
          appearance: none;
          cursor: pointer;
        }
        .styled-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4a9eff;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s ease;
        }
        .styled-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 12px rgba(74, 158, 255, 0.6);
        }
        .styled-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4a9eff;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
