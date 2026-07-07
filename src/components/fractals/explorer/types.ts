import type { ReglContext } from 'regl';

export interface Vec2 {
  x: number;
  y: number;
}

export interface FractalParams {
  iterations: number;
  zoom: number;
  offset: Vec2;
  juliaC: Vec2;
  xScale: number;
  yScale: number;
  colorScheme: string;
}

export interface FractalConfig {
  id: string;
  name: string;
  equation: string;
  description: string;
  initialSettings?: {
    colorScheme?: string;
  };
  initialPosition?: {
    zoom?: number;
    offset?: Vec2;
  };
  supportsJuliaC?: boolean;
  supportsOrder?: boolean;
}

export interface FractalModule {
  id: string;
  name: string;
  render: (
    regl: ReglContext,
    params: FractalParams,
    canvas: HTMLCanvasElement
  ) => (() => void) | null;
  config: FractalConfig;
  is2D: boolean;
}
