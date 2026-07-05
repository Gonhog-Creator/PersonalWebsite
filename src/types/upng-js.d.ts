declare module 'upng-js' {
  interface UPNGImage {
    width: number;
    height: number;
    data: ArrayBuffer;
    depth: number;
    ctype: number;
    frames: unknown[];
    tabs: Record<string, unknown>;
  }

  const UPNG: {
    encode: (
      img: Uint8Array,
      w: number,
      h: number,
      cnum?: number
    ) => ArrayBuffer;
    decode: (buff: ArrayBuffer) => UPNGImage;
    toRGBA8: (out: UPNGImage) => ArrayBuffer[];
  };

  export default UPNG;
}
