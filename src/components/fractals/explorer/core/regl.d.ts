declare module 'regl' {
  export interface ReglTexture {
    destroy: () => void;
  }

  export interface ReglBuffer {
    destroy: () => void;
  }

  export interface ReglCommand {
    (props?: Record<string, unknown>): void;
    destroy?: () => void;
  }

  export interface ReglContext {
    (config: Record<string, unknown>): ReglCommand;
    clear: (opts: { color?: [number, number, number, number]; depth?: number }) => void;
    buffer: (data: number[]) => ReglBuffer;
    texture: (opts: Record<string, unknown>) => ReglTexture;
    prop: (name: string) => unknown;
    _gl: WebGLRenderingContext | WebGL2RenderingContext;
  }

  function createREGL(
    canvasOrOptions?: HTMLCanvasElement | { canvas: HTMLCanvasElement }
  ): ReglContext;

  export default createREGL;
}
