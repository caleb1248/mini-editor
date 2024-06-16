interface Color {
  rgba: RGBA;
  hsla: HSLA;
  hsva: HSVA;
}

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

export function rgba(
  rgba: [number, number, number, number] | [number, number, number]
): RGBA;

export function rgba(hex: string): RGBA;

export function rgba(
  rgbaOrHex:
    | [number, number, number, number]
    | [number, number, number]
    | string
): RGBA {
  if (typeof rgbaOrHex === 'string') {
    return hexToRgba(rgbaOrHex);
  }

  return {
    r: rgbaOrHex[0],
    g: rgbaOrHex[1],
    b: rgbaOrHex[2],
    a: rgbaOrHex[3] ?? 1,
  };
}

function hexToRgba(hex: string): RGBA {
  const result = {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: 1,
  };

  if (hex.length === 9) {
    result.a = parseInt(hex.slice(7, 9), 16) / 255;
  }

  return result;
}

export function rgbaToCSSValue(rgba: RGBA): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

export type { Color, RGBA, HSLA, HSVA };
