import type { ReglContext } from 'regl';
import { createFragmentShader, createStandardDrawCommand } from '../core/utils';
import type { FractalModule, FractalParams } from '../types';

const fractalFunction = `
    float computeFractal(vec2 c) {
        vec2 z = vec2(0.0);
        float zx2 = 0.0;
        float zy2 = 0.0;
        float abs_x, abs_y;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 1.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 2.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 3.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 4.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 5.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 6.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 7.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 8.0 - nu;
        }
        abs_x = abs(z.x);
        abs_y = abs(z.y);
        z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;

        for (int i = 8; i < 200; i++) {
            if (i >= int(uIterations)) break;

            zx2 = z.x * z.x;
            zy2 = z.y * z.y;
            if (zx2 + zy2 > ESCAPE_RADIUS_SQ) {
                float log_zn = log(zx2 + zy2) * 0.5;
                float nu = log(log_zn * INV_LOG2) * INV_LOG2;
                return float(i) + 1.0 - nu;
            }

            abs_x = abs(z.x);
            abs_y = abs(z.y);
            z = vec2(abs_x * abs_x - abs_y * abs_y, 2.0 * abs_x * abs_y) + c;
        }
        return uIterations;
    }
`;

export const burningShip: FractalModule = {
  id: 'burning-ship',
  name: 'Burning Ship',
  is2D: true,
  render: (regl: ReglContext, params: FractalParams, canvas: HTMLCanvasElement) => {
    const fragmentShader = createFragmentShader(fractalFunction);
    return createStandardDrawCommand(regl, params, canvas, fragmentShader, { x: 0, y: 0 });
  },
  config: {
    id: 'burning-ship',
    name: 'Burning Ship',
    equation: 'z = (|Re(z)| + i|Im(z)|)² + c',
    description:
      'A variant of the Mandelbrot set where the absolute values of the real and imaginary parts are taken before squaring. The result looks like a burning ship sailing through fractal waves.',
    initialSettings: { colorScheme: 'midnight' },
    initialPosition: { zoom: 1.2, offset: { x: -0.2924, y: -0.2544 } },
  },
};
