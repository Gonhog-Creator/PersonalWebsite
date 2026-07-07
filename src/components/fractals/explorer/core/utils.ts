import type { ReglContext, ReglTexture } from 'regl';
import { computeColorForScheme, getColorSchemeIndex } from './colorSchemes';
import type { FractalParams } from '../types';

const PALETTE_SIZE = 512;
const paletteTextureCache = new Map<string, ReglTexture>();
const vertexBufferCache = new WeakMap<object, unknown>();

export function getVertexShader(): string {
  return `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0, 1);
    }
  `;
}

export function getFullScreenQuadBuffer(regl: ReglContext): unknown {
  if (vertexBufferCache.has(regl as unknown as object)) {
    return vertexBufferCache.get(regl as unknown as object);
  }
  const buffer = regl.buffer([-1, -1, 1, -1, -1, 1, 1, 1]);
  vertexBufferCache.set(regl as unknown as object, buffer);
  return buffer;
}

export function generatePaletteTexture(
  regl: ReglContext,
  colorScheme: string
): ReglTexture {
  const schemeIndex = getColorSchemeIndex(colorScheme);
  const cacheKey = `${colorScheme}_${PALETTE_SIZE}`;

  if (paletteTextureCache.has(cacheKey)) {
    return paletteTextureCache.get(cacheKey)!;
  }

  const paletteData = new Uint8Array(PALETTE_SIZE * 4);
  const colorOut = new Float32Array(3);

  for (let i = 0; i < PALETTE_SIZE; i++) {
    const t = i / (PALETTE_SIZE - 1);
    const color = computeColorForScheme(t, schemeIndex, colorOut);
    const offset = i * 4;
    paletteData[offset + 0] = Math.floor(color[0] * 255);
    paletteData[offset + 1] = Math.floor(color[1] * 255);
    paletteData[offset + 2] = Math.floor(color[2] * 255);
    paletteData[offset + 3] = 255;
  }

  const texture = regl.texture({
    width: PALETTE_SIZE,
    height: 1,
    data: paletteData,
    format: 'rgba',
    type: 'uint8',
    min: 'linear',
    mag: 'linear',
    wrap: 'clamp',
  });

  paletteTextureCache.set(cacheKey, texture);
  return texture;
}

export function clearPaletteCache(): void {
  for (const texture of paletteTextureCache.values()) {
    texture.destroy();
  }
  paletteTextureCache.clear();
}

export function createFragmentShader(
  fractalFunction: string,
  precision: string = 'mediump'
): string {
  return `
    #ifdef GL_ES
    precision ${precision} float;
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
    const float ESCAPE_RADIUS_SQ = 4.0;

    ${fractalFunction}

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        float scale = 4.0 / uZoom;

        vec2 uvCentered = uv - 0.5;
        vec2 c = vec2(
            uvCentered.x * scale * aspect * uXScale + uOffset.x,
            uvCentered.y * scale * uYScale + uOffset.y
        );

        float iterations = computeFractal(c);
        float invIterations = 1.0 / uIterations;
        float t = clamp(iterations * invIterations, 0.0, 1.0);

        lowp vec3 color = texture2D(uPalette, vec2(t, 0.5)).rgb;
        float isInSet = step(uIterations, iterations);
        color = mix(color, vec3(0.0), isInSet);

        gl_FragColor = vec4(color, 1.0);
    }
  `;
}

export function createStandardDrawCommand(
  regl: ReglContext,
  params: FractalParams,
  canvas: HTMLCanvasElement,
  fragmentShader: string,
  juliaC: { x: number; y: number } = { x: 0, y: 0 }
): () => void {
  const paletteTexture = generatePaletteTexture(regl, params.colorScheme);
  const quadBuffer = getFullScreenQuadBuffer(regl);

  const drawInner = regl({
    vert: getVertexShader(),
    frag: fragmentShader,
    attributes: {
      position: { buffer: quadBuffer, size: 2 },
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
    drawInner({
      uIterations: p.iterations,
      uZoom: p.zoom,
      uOffset: [p.offset.x, p.offset.y],
      uResolution: [canvas.width, canvas.height],
      uJuliaC: [juliaC.x, juliaC.y],
      uXScale: p.xScale,
      uYScale: p.yScale,
    });
  };
}
