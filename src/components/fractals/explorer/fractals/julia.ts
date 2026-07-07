import type { ReglContext } from 'regl';
import { createFragmentShader, createStandardDrawCommand } from '../core/utils';
import type { FractalModule, FractalParams } from '../types';

const fractalFunction = `
    float computeFractal(vec2 c) {
        vec2 z = c;
        float zx2 = 0.0;
        float zy2 = 0.0;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 1.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 2.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 3.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 4.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 5.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 6.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 7.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 8.0 - nu;
        }
        z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;

        for (int i = 8; i < 200; i++) {
            if (i >= int(uIterations)) break;

            zx2 = z.x * z.x;
            zy2 = z.y * z.y;
            if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
                float log_zn = log(zx2 + zy2) * 0.5;
                float nu = log(log_zn * INV_LOG2) * INV_LOG2;
                return float(i) + 1.0 - nu;
            }

            z = vec2(zx2 - zy2, 2.0 * z.x * z.y) + uJuliaC;
        }
        return uIterations;
    }
`;

export const julia: FractalModule = {
  id: 'julia',
  name: 'Julia',
  is2D: true,
  render: (regl: ReglContext, params: FractalParams, canvas: HTMLCanvasElement) => {
    const fragmentShader = createFragmentShader(fractalFunction);
    return createStandardDrawCommand(regl, params, canvas, fragmentShader, params.juliaC);
  },
  config: {
    id: 'julia',
    name: 'Julia',
    equation: 'z = z² + c',
    description:
      'Julia sets use the same formula as the Mandelbrot set, but c is fixed for the whole image while z starts at each pixel. Different c values produce wildly different shapes.',
    supportsJuliaC: true,
    initialSettings: { colorScheme: 'midnight' },
    initialPosition: { zoom: 1, offset: { x: 0, y: 0 } },
  },
};
