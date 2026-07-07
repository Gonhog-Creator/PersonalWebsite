import createREGL from 'regl';
import type { ReglContext } from 'regl';
import type { FractalModule, FractalParams } from '../types';
import { clearPaletteCache } from './utils';

export class FractalRenderer {
  private canvas: HTMLCanvasElement;
  private regl: ReglContext | null = null;
  private drawCommand: (() => void) | null = null;
  private currentModule: FractalModule | null = null;
  private currentParams: FractalParams | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private progressiveFrame: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  initialize(): void {
    if (this.regl) return;

    this.regl = createREGL({ canvas: this.canvas }) as unknown as ReglContext;
    this.resizeCanvas();

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
      this.render();
    });
    this.resizeObserver.observe(this.canvas);
  }

  destroy(): void {
    if (this.progressiveFrame !== null) {
      cancelAnimationFrame(this.progressiveFrame);
      this.progressiveFrame = null;
    }
    this.resizeObserver?.disconnect();
    clearPaletteCache();
    this.regl = null;
  }

  resizeCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
  }

  setFractal(module: FractalModule, params: FractalParams): void {
    if (!this.regl) return;

    this.currentModule = module;
    this.currentParams = { ...params };
    this.drawCommand = module.render(this.regl, this.currentParams, this.canvas);
    this.renderProgressive();
  }

  updateParams(params: FractalParams): void {
    if (!this.regl || !this.currentModule) return;

    this.currentParams = { ...params };
    this.drawCommand = this.currentModule.render(
      this.regl,
      this.currentParams,
      this.canvas
    );
    this.renderProgressive();
  }

  render(): void {
    if (!this.regl || !this.drawCommand) return;

    this.regl.clear({ color: [0, 0, 0, 1], depth: 1 });
    this.drawCommand();
  }

  renderProgressive(): void {
    if (!this.regl || !this.currentModule || !this.currentParams) return;

    if (this.progressiveFrame !== null) {
      cancelAnimationFrame(this.progressiveFrame);
    }

    const targetIterations = this.currentParams.iterations;
    const stepSize = Math.max(10, Math.floor(targetIterations * 0.15));
    let currentIterations = Math.max(20, Math.floor(targetIterations * 0.2));

    const step = () => {
      if (!this.regl || !this.currentModule || !this.currentParams) return;

      const progressiveParams = {
        ...this.currentParams,
        iterations: Math.min(currentIterations, targetIterations),
      };

      const draw = this.currentModule.render(
        this.regl,
        progressiveParams,
        this.canvas
      );
      if (draw) {
        this.regl.clear({ color: [0, 0, 0, 1], depth: 1 });
        draw();
      }

      if (currentIterations < targetIterations) {
        currentIterations = Math.min(currentIterations + stepSize, targetIterations);
        this.progressiveFrame = requestAnimationFrame(step);
      } else {
        this.progressiveFrame = null;
      }
    };

    step();
  }
}
