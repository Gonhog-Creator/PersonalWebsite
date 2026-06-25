'use client';

import { useEffect, useRef, useState } from 'react';
import * as SPLAT from 'gsplat';

interface SplatViewerProps {
  url: string;
  className?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  fov?: number;
}

export function SplatViewer({
  url,
  className = '',
  cameraPosition = [0, -1, 3],
  cameraTarget = [0, 0, 0],
  fov = 50,
}: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let cancelled = false;
    let animationId: number;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const renderer = new SPLAT.WebGLRenderer();
    const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

    controls.setCameraTarget(new SPLAT.Vector3(cameraTarget[0], cameraTarget[1], cameraTarget[2]));
    camera.position = new SPLAT.Vector3(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      if (fov) {
        const fl = fovToFocalLength(fov, rect.height);
        camera.data.fx = fl;
        camera.data.fy = fl;
      }
    };

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };

    resize();
    window.addEventListener('resize', onResize);

    const frame = () => {
      if (cancelled) return;
      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(frame);
    };

    SPLAT.Loader.LoadAsync(url, scene, (p) => {
      if (!cancelled) setProgress(Math.round(p * 100));
    })
      .then(() => {
        if (cancelled) return;
        setIsLoading(false);
        animationId = requestAnimationFrame(frame);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load splat');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.canvas.parentElement) {
        renderer.canvas.parentElement.removeChild(renderer.canvas);
      }
    };
  }, [url, cameraPosition, cameraTarget, fov]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: '#000000' }}
    >
      {isLoading && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-white">
          <div className="text-lg font-semibold">Loading 3D scene</div>
          <div className="mt-3 h-2 w-48 rounded-full bg-gray-700">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-300">{progress}%</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 text-white p-6">
          <div className="text-center max-w-md">
            <p className="text-lg font-semibold text-red-400">Could not load 3D scene</p>
            <p className="mt-2 text-sm text-gray-300 break-words">{error}</p>
            <p className="mt-4 text-xs text-gray-400">
              Make sure the .splat file exists and is accessible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function fovToFocalLength(fov: number, height: number): number {
  return height / (2 * Math.tan((fov * Math.PI) / 360));
}
