export const COLOR_SCHEMES = [
  'classic',
  'fire',
  'ocean',
  'rainbow',
  'monochrome',
  'forest',
  'sunset',
  'purple',
  'cyan',
  'gold',
  'ice',
  'neon',
  'rainbow-pastel',
  'rainbow-dark',
  'rainbow-vibrant',
  'rainbow-double',
  'rainbow-shifted',
  'cosmic',
  'aurora',
  'coral',
  'autumn',
  'midnight',
  'emerald',
  'rosegold',
  'electric',
  'vintage',
  'tropical',
  'galaxy',
  'lava',
  'arctic',
  'sakura',
  'volcanic',
  'mint',
  'sunrise',
  'steel',
  'prism',
  'mystic',
  'amber',
  'noir-ember',
  'ultraviolet',
  'toxic',
  'blood-moon',
  'void-ice',
  'acid-rain',
  'solar-flare',
  'deep-sea',
  'chiaroscuro',
  'spectral-night',
];

export function getColorSchemeIndex(scheme: string): number {
  return COLOR_SCHEMES.indexOf(scheme);
}

export function computeColorForScheme(
  t: number,
  schemeIndexOrName: number | string,
  out?: Float32Array
): Float32Array {
  const schemeIndex =
    typeof schemeIndexOrName === 'number'
      ? schemeIndexOrName
      : getColorSchemeIndex(schemeIndexOrName);

  t = Math.max(0, Math.min(1, t));
  const result = out || new Float32Array(3);

  switch (schemeIndex) {
    case 1: // fire
      result[0] = t;
      result[1] = t * 0.5;
      result[2] = 0;
      return result;
    case 2: // ocean
      result[0] = 0;
      result[1] = t * 0.5;
      result[2] = t;
      return result;
    case 3: { // rainbow
      const hue = ((t * 360) % 360) / 360;
      result[0] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 0.0);
      result[1] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 2.09);
      result[2] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 4.18);
      return result;
    }
    case 12: { // rainbow-pastel
      const hue = ((t * 360) % 360) / 360;
      const sat = 0.6;
      const light = 0.7;
      result[0] = light + sat * Math.cos(hue * 6.28 + 0.0);
      result[1] = light + sat * Math.cos(hue * 6.28 + 2.09);
      result[2] = light + sat * Math.cos(hue * 6.28 + 4.18);
      return result;
    }
    case 13: { // rainbow-dark
      const hue = ((t * 360) % 360) / 360;
      const sat = 1.0;
      const light = 0.3;
      result[0] = light + sat * Math.cos(hue * 6.28 + 0.0);
      result[1] = light + sat * Math.cos(hue * 6.28 + 2.09);
      result[2] = light + sat * Math.cos(hue * 6.28 + 4.18);
      return result;
    }
    case 14: { // rainbow-vibrant
      const hue = ((t * 360) % 360) / 360;
      const sat = 1.2;
      const light = 0.4;
      result[0] = Math.max(0, Math.min(1, light + sat * Math.cos(hue * 6.28 + 0.0)));
      result[1] = Math.max(0, Math.min(1, light + sat * Math.cos(hue * 6.28 + 2.09)));
      result[2] = Math.max(0, Math.min(1, light + sat * Math.cos(hue * 6.28 + 4.18)));
      return result;
    }
    case 15: { // rainbow-double
      const hue = ((t * 720) % 360) / 360;
      result[0] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 0.0);
      result[1] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 2.09);
      result[2] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 4.18);
      return result;
    }
    case 16: { // rainbow-shifted
      const hue = ((t * 360 + 60) % 360) / 360;
      result[0] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 0.0);
      result[1] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 2.09);
      result[2] = 0.5 + 0.5 * Math.cos(hue * 6.28 + 4.18);
      return result;
    }
    case 4: // monochrome
      result[0] = t;
      result[1] = t;
      result[2] = t;
      return result;
    case 5: // forest
      result[0] = t * 0.3;
      result[1] = t * 0.8;
      result[2] = t * 0.4;
      return result;
    case 6: // sunset
      result[0] = t;
      result[1] = t * 0.4;
      result[2] = t * 0.2;
      return result;
    case 7: // purple
      result[0] = t * 0.6;
      result[1] = t * 0.3;
      result[2] = t;
      return result;
    case 8: // cyan
      result[0] = 0;
      result[1] = t;
      result[2] = t;
      return result;
    case 9: // gold
      result[0] = t;
      result[1] = t * 0.8;
      result[2] = t * 0.2;
      return result;
    case 10: // ice
      result[0] = t * 0.7;
      result[1] = t * 0.9;
      result[2] = t;
      return result;
    case 11: { // neon
      const pulse = Math.sin(t * Math.PI) * 0.5 + 0.5;
      result[0] = t * 0.2 + pulse * 0.8;
      result[1] = t * 0.8 + pulse * 0.2;
      result[2] = t;
      return result;
    }
    case 17: { // cosmic
      const darkBase = 0.05;
      const brightPeak = 1.0;
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      const r = darkBase + (brightPeak - darkBase) * (phase1 * 0.4 + phase2 * 0.6);
      const g = darkBase + (brightPeak - darkBase) * (phase1 * 0.2 + phase2 * 0.8);
      const b = darkBase + (brightPeak - darkBase) * (phase1 * 0.6 + phase2 * 1.0);
      const sparkle = Math.sin(t * Math.PI * 8.0) * 0.1 + 0.9;
      result[0] = Math.min(1.0, r * sparkle);
      result[1] = Math.min(1.0, g * sparkle);
      result[2] = Math.min(1.0, b * sparkle);
      return result;
    }
    case 18: { // aurora
      const phase = t * 2.0;
      if (phase < 1.0) {
        result[0] = 0.1 + phase * 0.2;
        result[1] = 0.3 + phase * 0.5;
        result[2] = 0.2 + phase * 0.6;
      } else {
        const p = phase - 1.0;
        result[0] = 0.3 + p * 0.5;
        result[1] = 0.8 - p * 0.3;
        result[2] = 0.8 + p * 0.2;
      }
      return result;
    }
    case 19: { // coral
      const phase1 = Math.min(t * 3.0, 1.0);
      const phase2 = Math.max(0.0, Math.min((t - 0.33) * 3.0, 1.0));
      const phase3 = Math.max(0.0, (t - 0.66) * 3.0);
      result[0] = phase1 * 0.1 + phase2 * 0.3 + phase3 * 1.0;
      result[1] = phase1 * 0.4 + phase2 * 0.8 + phase3 * 0.6;
      result[2] = phase1 * 0.8 + phase2 * 0.7 + phase3 * 0.5;
      return result;
    }
    case 20: { // autumn
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.3 + phase1 * 0.5 + phase2 * 0.2;
      result[1] = 0.1 + phase1 * 0.3 + phase2 * 0.6;
      result[2] = 0.0 + phase1 * 0.1 + phase2 * 0.1;
      return result;
    }
    case 21: { // midnight
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.05 + phase1 * 0.3 + phase2 * 0.65;
      result[1] = 0.05 + phase1 * 0.2 + phase2 * 0.3;
      result[2] = 0.2 + phase1 * 0.5 + phase2 * 0.3;
      return result;
    }
    case 22: { // emerald
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.0 + phase1 * 0.1 + phase2 * 0.8;
      result[1] = 0.2 + phase1 * 0.7 + phase2 * 0.6;
      result[2] = 0.1 + phase1 * 0.4 + phase2 * 0.1;
      return result;
    }
    case 23: { // rosegold
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.3 + phase1 * 0.5 + phase2 * 0.2;
      result[1] = 0.2 + phase1 * 0.3 + phase2 * 0.5;
      result[2] = 0.2 + phase1 * 0.2 + phase2 * 0.1;
      return result;
    }
    case 24: { // electric
      const hue = ((t * 360 + 180) % 360) / 360;
      const sat = 1.0;
      const light = 0.5;
      result[0] = Math.max(0, Math.min(1, light + sat * Math.cos(hue * 6.28 + 0.0) * 1.2));
      result[1] = Math.max(0, Math.min(1, light + sat * Math.cos(hue * 6.28 + 2.09) * 1.2));
      result[2] = Math.max(0, Math.min(1, light + sat * Math.cos(hue * 6.28 + 4.18) * 1.2));
      return result;
    }
    case 25: { // vintage
      const hue = ((t * 360 + 30) % 360) / 360;
      const sat = 0.4;
      const light = 0.7;
      result[0] = light + sat * Math.cos(hue * 6.28 + 0.0) * 0.5;
      result[1] = light + sat * Math.cos(hue * 6.28 + 2.09) * 0.5;
      result[2] = light + sat * Math.cos(hue * 6.28 + 4.18) * 0.5;
      return result;
    }
    case 26: { // tropical
      const phase = t * 3.0;
      if (phase < 1.0) {
        result[0] = phase;
        result[1] = 1.0 - phase * 0.3;
        result[2] = 1.0 - phase * 0.5;
      } else if (phase < 2.0) {
        const p = phase - 1.0;
        result[0] = 1.0;
        result[1] = 0.7 + p * 0.3;
        result[2] = 0.5 - p * 0.5;
      } else {
        const p = phase - 2.0;
        result[0] = 1.0 - p;
        result[1] = 1.0;
        result[2] = p;
      }
      return result;
    }
    case 27: { // galaxy
      const darkBase = 0.02;
      const phase1 = Math.min(t * 2.5, 1.0);
      const phase2 = Math.max(0.0, (t - 0.4) * 1.67);
      const r = darkBase + phase1 * 0.4 + phase2 * 0.6;
      const g = darkBase + phase1 * 0.2 + phase2 * 0.8;
      const b = darkBase + phase1 * 0.6 + phase2 * 1.0;
      const sparkle = Math.sin(t * Math.PI * 12.0) * 0.15 + 0.85;
      result[0] = Math.min(1.0, r * sparkle);
      result[1] = Math.min(1.0, g * sparkle);
      result[2] = Math.min(1.0, b * sparkle);
      return result;
    }
    case 28: { // lava
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.2 + phase1 * 0.6 + phase2 * 0.2;
      result[1] = 0.0 + phase1 * 0.4 + phase2 * 0.6;
      result[2] = 0.0 + phase1 * 0.1 + phase2 * 0.9;
      return result;
    }
    case 29: { // arctic
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.1 + phase1 * 0.3 + phase2 * 0.6;
      result[1] = 0.2 + phase1 * 0.5 + phase2 * 0.3;
      result[2] = 0.4 + phase1 * 0.4 + phase2 * 0.6;
      return result;
    }
    case 30: { // sakura
      const phase1 = Math.min(t * 2.5, 1.0);
      const phase2 = Math.max(0.0, (t - 0.4) * 1.67);
      result[0] = 0.3 + phase1 * 0.5 + phase2 * 0.2;
      result[1] = 0.2 + phase1 * 0.4 + phase2 * 0.4;
      result[2] = 0.25 + phase1 * 0.35 + phase2 * 0.4;
      return result;
    }
    case 31: { // volcanic
      const darkBase = 0.05;
      const phase1 = Math.min(t * 3.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.33) * 1.5);
      result[0] = darkBase + phase1 * 0.4 + phase2 * 0.55;
      result[1] = darkBase + phase1 * 0.1 + phase2 * 0.4;
      result[2] = darkBase + phase1 * 0.0 + phase2 * 0.2;
      return result;
    }
    case 32: { // mint
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.1 + phase1 * 0.2 + phase2 * 0.3;
      result[1] = 0.3 + phase1 * 0.5 + phase2 * 0.2;
      result[2] = 0.2 + phase1 * 0.4 + phase2 * 0.4;
      return result;
    }
    case 33: { // sunrise
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.4 + phase1 * 0.4 + phase2 * 0.2;
      result[1] = 0.3 + phase1 * 0.3 + phase2 * 0.4;
      result[2] = 0.35 + phase1 * 0.15 + phase2 * 0.5;
      return result;
    }
    case 34: { // steel
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.2 + phase1 * 0.3 + phase2 * 0.3;
      result[1] = 0.25 + phase1 * 0.35 + phase2 * 0.25;
      result[2] = 0.3 + phase1 * 0.4 + phase2 * 0.3;
      return result;
    }
    case 35: { // prism
      const hue = ((t * 360 * 1.5 + 180) % 360) / 360;
      const r = 0.5 + 0.5 * Math.cos(hue * 6.28 + 0.0);
      const g = 0.5 + 0.5 * Math.cos(hue * 6.28 + 2.09);
      const b = 0.5 + 0.5 * Math.cos(hue * 6.28 + 4.18);
      result[0] = Math.max(0, Math.min(1, 0.15 + (1.0 - r) * 0.85));
      result[1] = Math.max(0, Math.min(1, 0.15 + (1.0 - g) * 0.85));
      result[2] = Math.max(0, Math.min(1, 0.15 + (1.0 - b) * 0.85));
      return result;
    }
    case 36: { // mystic
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      const r = 0.1 + phase1 * 0.5 + phase2 * 0.4;
      const g = 0.05 + phase1 * 0.2 + phase2 * 0.5;
      const b = 0.2 + phase1 * 0.6 + phase2 * 0.2;
      const sparkle = Math.sin(t * Math.PI * 10.0) * 0.2 + 0.8;
      result[0] = Math.min(1.0, r * sparkle);
      result[1] = Math.min(1.0, g * sparkle);
      result[2] = Math.min(1.0, b * sparkle);
      return result;
    }
    case 37: { // amber
      const phase1 = Math.min(t * 2.0, 1.0);
      const phase2 = Math.max(0.0, (t - 0.5) * 2.0);
      result[0] = 0.2 + phase1 * 0.5 + phase2 * 0.3;
      result[1] = 0.15 + phase1 * 0.4 + phase2 * 0.45;
      result[2] = 0.1 + phase1 * 0.2 + phase2 * 0.7;
      return result;
    }
    case 38: { // noir-ember
      const x = t * t;
      const hot = Math.pow(t, 6);
      result[0] = Math.min(1, 0.02 + x * 1.15);
      result[1] = Math.min(1, 0.01 + x * 0.35 + hot * 0.9);
      result[2] = Math.min(1, 0.01 + x * 0.08 + hot * 1.0);
      return result;
    }
    case 39: { // ultraviolet
      const a = Math.min(1, t * 1.25);
      const b = Math.max(0, (t - 0.35) / 0.65);
      result[0] = 0.02 + a * 0.55 + b * 0.05;
      result[1] = 0.0 + a * 0.12 + b * 0.95;
      result[2] = 0.08 + a * 0.95 + b * 0.15;
      return result;
    }
    case 40: { // toxic
      const a = Math.min(1, t * 1.4);
      const b = Math.max(0, (t - 0.55) / 0.45);
      result[0] = 0.01 + b * 0.95;
      result[1] = 0.05 + a * 0.95;
      result[2] = 0.0 + a * 0.12;
      return result;
    }
    case 41: { // blood-moon
      const a = Math.pow(t, 1.2);
      const h = Math.pow(t, 5.5);
      result[0] = Math.min(1, 0.02 + a * 0.95);
      result[1] = Math.min(1, 0.0 + a * 0.1 + h * 0.25);
      result[2] = Math.min(1, 0.0 + a * 0.12 + h * 0.95);
      return result;
    }
    case 42: { // void-ice
      const a = Math.pow(t, 1.4);
      const w = Math.pow(t, 7);
      result[0] = Math.min(1, 0.01 + a * 0.25 + w * 0.95);
      result[1] = Math.min(1, 0.02 + a * 0.55 + w * 0.95);
      result[2] = Math.min(1, 0.08 + a * 0.95 + w * 0.95);
      return result;
    }
    case 43: { // acid-rain
      const a = Math.min(1, t * 1.1);
      const b = Math.max(0, (t - 0.4) / 0.6);
      const sparkle = Math.sin(t * Math.PI * 14) * 0.08 + 0.92;
      result[0] = (0.02 + a * 0.15 + b * 0.25) * sparkle;
      result[1] = (0.1 + a * 0.75 + b * 0.35) * sparkle;
      result[2] = (0.12 + a * 0.55 + b * 0.45) * sparkle;
      return result;
    }
    case 44: { // solar-flare
      const a = Math.pow(t, 1.1);
      const hot = Math.pow(t, 5);
      const flare = Math.sin(t * Math.PI * 10) * 0.12 + 0.88;
      result[0] = Math.min(1, (0.02 + a * 1.05) * flare);
      result[1] = Math.min(1, (0.01 + a * 0.55 + hot * 0.85) * flare);
      result[2] = Math.min(1, (0.0 + a * 0.1 + hot * 1.0) * flare);
      return result;
    }
    case 45: { // deep-sea
      const a = Math.pow(t, 1.25);
      const glow = Math.pow(Math.max(0, t - 0.55) / 0.45, 2.2);
      result[0] = 0.0 + a * 0.08;
      result[1] = 0.03 + a * 0.55 + glow * 0.45;
      result[2] = 0.08 + a * 0.85 + glow * 0.25;
      return result;
    }
    case 46: { // chiaroscuro
      const c =
        t < 0.55
          ? Math.pow(t / 0.55, 1.8) * 0.35
          : 0.35 + Math.pow((t - 0.55) / 0.45, 0.7) * 0.65;
      result[0] = c;
      result[1] = c * 0.98;
      result[2] = Math.min(1, c * 1.08);
      return result;
    }
    case 47: { // spectral-night
      const hue = ((t * 420) % 360) / 360;
      const sat = 1.15;
      const base = 0.12 + 0.35 * Math.pow(t, 1.6);
      const r = 0.5 + 0.5 * Math.cos(hue * 6.28 + 0.0);
      const g = 0.5 + 0.5 * Math.cos(hue * 6.28 + 2.09);
      const b = 0.5 + 0.5 * Math.cos(hue * 6.28 + 4.18);
      result[0] = Math.max(0, Math.min(1, base + (r - 0.5) * sat));
      result[1] = Math.max(0, Math.min(1, base + (g - 0.5) * sat));
      result[2] = Math.max(0, Math.min(1, base + (b - 0.5) * sat));
      return result;
    }
    default: // classic
      result[0] = t * 0.5;
      result[1] = t;
      result[2] = Math.min(t * 1.5, 1);
      return result;
  }
}
