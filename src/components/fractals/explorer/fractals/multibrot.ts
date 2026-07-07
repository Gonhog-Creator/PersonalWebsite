import type { ReglContext } from 'regl';
import { generatePaletteTexture, getVertexShader } from '../core/utils';
import type { FractalModule, FractalParams } from '../types';

const fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    precision lowp sampler2D;
    #endif

    uniform float uTime;
    uniform float uIterations;
    uniform float uZoom;
    uniform vec2 uOffset;
    uniform vec2 uResolution;
    uniform vec2 uJuliaC;
    uniform sampler2D uPalette;
    uniform float uXScale;
    uniform float uYScale;

    varying vec2 vUv;

    const float LOG2 = 0.6931471805599453;
    const float INV_LOG2 = 1.4426950408889634;

    vec2 complexPower(vec2 z, float n) {
        if (n == 2.0) {
            return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
        }
        float r = length(z);
        if (r < 0.0001) {
            return vec2(0.0, 0.0);
        }
        float theta = atan(z.y, z.x);
        float rn = pow(r, n);
        float nTheta = n * theta;
        return vec2(rn * cos(nTheta), rn * sin(nTheta));
    }

    float computeFractal(vec2 c) {
        float n = 2.0 + uXScale * 8.0;
        n = max(2.0, min(10.0, n));

        vec2 z = vec2(0.0);
        float zx2 = 0.0;
        float zy2 = 0.0;

        z = complexPower(z, n) + c;
        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > 4.0) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 1.0 - nu;
        }

        z = complexPower(z, n) + c;
        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > 4.0) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 2.0 - nu;
        }

        z = complexPower(z, n) + c;
        zx2 = z.x * z.x;
        zy2 = z.y * z.y;
        if (zx2 + zy2 > 4.0) {
            float log_zn = log(zx2 + zy2) * 0.5;
            float nu = log(log_zn * INV_LOG2) * INV_LOG2;
            return 3.0 - nu;
        }

        for (int i = 3; i < 200; i++) {
            if (i >= int(uIterations)) break;

            zx2 = z.x * z.x;
            zy2 = z.y * z.y;
            if (zx2 + zy2 > 4.0) {
                float log_zn = log(zx2 + zy2) * 0.5;
                float nu = log(log_zn * INV_LOG2) * INV_LOG2;
                return float(i) + 1.0 - nu;
            }

            z = complexPower(z, n) + c;
        }
        return uIterations;
    }

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        float scale = 4.0 / uZoom;

        vec2 c = vec2(
            (uv.x - 0.5) * scale * aspect + uOffset.x,
            (uv.y - 0.5) * scale * uYScale + uOffset.y
        );

        float iterations = computeFractal(c);
        float t = clamp(iterations / uIterations, 0.0, 1.0);
        lowp vec3 color = texture2D(uPalette, vec2(t, 0.5)).rgb;

        if (iterations >= uIterations) {
            color = vec3(0.0);
        }

        gl_FragColor = vec4(color, 1.0);
    }
`;

export const multibrot: FractalModule = {
  id: 'multibrot',
  name: 'Multibrot',
  is2D: true,
  render: (regl: ReglContext, params: FractalParams, canvas: HTMLCanvasElement) => {
    const paletteTexture = generatePaletteTexture(regl, params.colorScheme);

    const draw = regl({
      vert: getVertexShader(),
      frag: fragmentShader,
      attributes: {
        position: [-1, -1, 1, -1, -1, 1, 1, 1],
      },
      uniforms: {
        uTime: 0,
        uIterations: regl.prop('uIterations'),
        uZoom: regl.prop('uZoom'),
        uOffset: regl.prop('uOffset'),
        uResolution: regl.prop('uResolution'),
        uJuliaC: regl.prop('uJuliaC'),
        uPalette: paletteTexture,
        uXScale: regl.prop('uXScale'),
        uYScale: regl.prop('uYScale'),
      },
      viewport: {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      },
      count: 4,
      primitive: 'triangle strip',
    });

    return (overrideParams?: FractalParams) => {
      const p = overrideParams ?? params;
      draw({
        uIterations: p.iterations,
        uZoom: p.zoom,
        uOffset: [p.offset.x, p.offset.y],
        uResolution: [canvas.width, canvas.height],
        uJuliaC: [0, 0],
        uXScale: p.xScale,
        uYScale: p.yScale,
      });
    };
  },
  config: {
    id: 'multibrot',
    name: 'Multibrot',
    equation: 'z = zⁿ + c',
    description:
      'Generalizes the Mandelbrot set by raising z to any power n. Use the Order slider to change the exponent and explore multi-lobed Mandelbrot-like shapes.',
    supportsOrder: true,
    initialSettings: { colorScheme: 'rainbow' },
    initialPosition: { zoom: 1, offset: { x: 0, y: 0 } },
  },
};
