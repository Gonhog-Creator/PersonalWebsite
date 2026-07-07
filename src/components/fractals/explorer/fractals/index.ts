import { mandelbrot } from './mandelbrot';
import { julia } from './julia';
import { burningShip } from './burningShip';
import { multibrot } from './multibrot';
import type { FractalModule } from '../types';

export const fractalRegistry: Record<string, FractalModule> = {
  [mandelbrot.id]: mandelbrot,
  [julia.id]: julia,
  [burningShip.id]: burningShip,
  [multibrot.id]: multibrot,
};

export const fractalList = Object.values(fractalRegistry);

export function getFractalModule(id: string): FractalModule | undefined {
  return fractalRegistry[id];
}
