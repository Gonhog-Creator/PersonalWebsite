import UPNG from 'upng-js';
import * as jpeg from 'jpeg-js';

/*
  FULL COMPRESSION CONTROL ROADMAP

  JPEG (currently handled by jpeg-js)
    - quality: 1-100
    - chroma subsampling: 4:2:0, 4:2:2, 4:4:4 (requires forking jpeg-js or switching to libjpeg-turbo/mozjpeg WASM)
    - progressive vs. baseline scan
    - custom quantization tables
    - trellis quantization / trellis quantization of DCT coefficients
    - Needs: a JPEG encoder that exposes these options, or a custom DCT/sine-wave encoder.

  WebP (currently handled by browser canvas.toBlob)
    - quality: 0-100
    - method / compression effort: 0-6
    - alpha quality (for images with transparency)
    - filtering strength
    - Needs: libwebp WASM bindings.

  PNG (currently handled by upng-js)
    - color palette size: 2-256
    - filter strategy: none, sub, up, average, paeth, adaptive
    - compression level
    - Needs: extend upng-js options or replace with pako + custom PNG writer.

  AVIF
    - quality, speed, chroma subsampling
    - Needs: libavif WASM.

  GIF
    - color palette size, dithering algorithm
    - Needs: gif.js or omggif.

  General future controls
    - resize / downsample before encoding
    - multi-pass optimization (try multiple quality settings and pick smallest above a quality threshold)
    - custom sine-wave / DCT educational encoder
*/

export type OutputFormat = 'jpeg' | 'png' | 'webp';

export type JpegOptions = {
  quality: number;
};

export type PngOptions = {
  /** Number of indexed colors (2-256). Lower = smaller file, more banding. */
  colors: number;
};

export type WebpOptions = {
  quality: number;
};

export type FormatOptions = {
  jpeg: JpegOptions;
  png: PngOptions;
  webp: WebpOptions;
};

export const DEFAULT_OPTIONS: FormatOptions = {
  jpeg: { quality: 80 },
  png: { colors: 256 },
  webp: { quality: 80 },
};

export const FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
};

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export async function decodeImage(file: File): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function encodeImage(
  imageData: ImageData,
  format: OutputFormat,
  options: FormatOptions[OutputFormat]
): Promise<ArrayBuffer> {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }
  ctx.putImageData(imageData, 0, 0);

  let mimeType: string;
  let quality: number | undefined;

  switch (format) {
    case 'jpeg': {
      const { quality } = options as JpegOptions;
      const encoded = jpeg.encode(imageData, quality);
      const bytes = encoded.data;
      return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength
      ) as ArrayBuffer;
    }
    case 'webp':
      mimeType = 'image/webp';
      quality = (options as WebpOptions).quality / 100;
      break;
    case 'png': {
      const { colors } = options as PngOptions;
      const rgba = new Uint8Array(imageData.data);
      return UPNG.encode(rgba, imageData.width, imageData.height, colors);
    }
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, quality)
  );
  if (!blob) {
    throw new Error(`Failed to encode image as ${format}`);
  }
  return blobToArrayBuffer(blob);
}

export function changeExtension(filename: string, ext: string): string {
  const base = filename.replace(/\.[^/.]+$/, '');
  return `${base}.${ext}`;
}

export interface CompressedFile {
  originalName: string;
  outputName: string;
  originalSize: number;
  compressedSize: number;
  buffer: ArrayBuffer;
  keptOriginal: boolean;
}

export async function compressFile(
  file: File,
  format: OutputFormat,
  options: FormatOptions[OutputFormat],
  keepOriginalIfLarger: boolean = true
): Promise<CompressedFile> {
  const imageData = await decodeImage(file);
  const encodedBuffer = await encodeImage(imageData, format, options);
  const ext = FORMAT_EXTENSIONS[format];

  if (keepOriginalIfLarger && encodedBuffer.byteLength >= file.size) {
    const originalBuffer = await blobToArrayBuffer(file);
    return {
      originalName: file.name,
      outputName: file.name,
      originalSize: file.size,
      compressedSize: originalBuffer.byteLength,
      buffer: originalBuffer,
      keptOriginal: true,
    };
  }

  return {
    originalName: file.name,
    outputName: changeExtension(file.name, ext),
    originalSize: file.size,
    compressedSize: encodedBuffer.byteLength,
    buffer: encodedBuffer,
    keptOriginal: false,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatSavings(original: number, compressed: number): string {
  if (original === 0) return '0%';
  const saved = original - compressed;
  const percent = Math.round((saved / original) * 100);
  return `${percent}%`;
}
