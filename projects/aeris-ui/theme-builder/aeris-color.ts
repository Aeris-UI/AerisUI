export interface AerisRgbColor {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

interface AerisOklabColor {
  readonly lightness: number;
  readonly a: number;
  readonly b: number;
}

interface AerisOklchColor {
  readonly lightness: number;
  readonly chroma: number;
  readonly hue: number | null;
}

const ACHROMATIC_CHROMA = 0.01;
const GAMUT_SEARCH_STEPS = 24;
const SRGB_GAMUT_TOLERANCE = 0.000_000_1;

export function parseAerisColor(value: string): AerisRgbColor | null {
  const color = value.trim().toLowerCase();
  if (color === 'black') return { red: 0, green: 0, blue: 0 };
  if (color === 'white') return { red: 255, green: 255, blue: 255 };
  if (color.startsWith('#')) return parseHex(color);
  if (color.startsWith('rgb(') || color.startsWith('rgba(')) return parseRgb(color);
  if (color.startsWith('hsl(') || color.startsWith('hsla(')) return parseHsl(color);
  return null;
}

export function mixAerisColor(from: string, to: string, amount: number): string {
  const weight = clampUnit(amount);
  const start = parseAerisColor(from);
  const end = parseAerisColor(to);
  if (!start || !end) {
    const startWeight = formatPercentage((1 - weight) * 100);
    return `color-mix(in oklch, ${from} ${startWeight}%, ${to})`;
  }
  return formatAerisHex(mixAerisRgb(start, end, weight));
}

export function aerisContrastRatio(first: string, second: string): number | null {
  const firstColor = parseAerisColor(first);
  const secondColor = parseAerisColor(second);
  if (!firstColor || !secondColor) return null;
  return aerisRgbContrastRatio(firstColor, secondColor);
}

export function aerisRgbContrastRatio(first: AerisRgbColor, second: AerisRgbColor): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function mixAerisRgb(from: AerisRgbColor, to: AerisRgbColor, amount: number): AerisRgbColor {
  const weight = clampUnit(amount);
  if (weight === 0) return { ...from };
  if (weight === 1) return { ...to };

  const start = oklabToOklch(rgbToOklab(from));
  const end = oklabToOklch(rgbToOklab(to));
  const mixed: AerisOklchColor = {
    lightness: interpolate(start.lightness, end.lightness, weight),
    chroma: interpolate(start.chroma, end.chroma, weight),
    hue: interpolateHue(start.hue, end.hue, weight),
  };

  return oklchToGamutMappedRgb(mixed);
}

export function formatAerisHex(color: AerisRgbColor): string {
  const channel = (value: number): string =>
    Math.round(clampChannel(value)).toString(16).padStart(2, '0');
  return `#${channel(color.red)}${channel(color.green)}${channel(color.blue)}`;
}

function relativeLuminance(color: AerisRgbColor): number {
  const linear = (value: number): number => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(color.red) + 0.7152 * linear(color.green) + 0.0722 * linear(color.blue);
}

function rgbToOklab(color: AerisRgbColor): AerisOklabColor {
  const red = srgbToLinear(clampChannel(color.red) / 255);
  const green = srgbToLinear(clampChannel(color.green) / 255);
  const blue = srgbToLinear(clampChannel(color.blue) / 255);

  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue;
  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    lightness: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

function oklabToOklch(color: AerisOklabColor): AerisOklchColor {
  const chroma = Math.hypot(color.a, color.b);
  const achromatic = chroma < ACHROMATIC_CHROMA;
  return {
    lightness: color.lightness,
    chroma: achromatic ? 0 : chroma,
    hue: achromatic ? null : normalizeHue((Math.atan2(color.b, color.a) * 180) / Math.PI),
  };
}

function oklchToGamutMappedRgb(color: AerisOklchColor): AerisRgbColor {
  const direct = oklchToSrgb(color);
  if (isInSrgbGamut(direct)) return toRgbChannels(direct);

  let minimumChroma = 0;
  let maximumChroma = color.chroma;
  let mapped = oklchToSrgb({ ...color, chroma: minimumChroma });

  for (let step = 0; step < GAMUT_SEARCH_STEPS; step += 1) {
    const chroma = (minimumChroma + maximumChroma) / 2;
    const candidate = oklchToSrgb({ ...color, chroma });
    if (isInSrgbGamut(candidate)) {
      minimumChroma = chroma;
      mapped = candidate;
    } else {
      maximumChroma = chroma;
    }
  }

  return toRgbChannels(mapped);
}

function oklchToSrgb(color: AerisOklchColor): readonly [number, number, number] {
  const hueRadians = ((color.hue ?? 0) * Math.PI) / 180;
  const a = color.chroma * Math.cos(hueRadians);
  const b = color.chroma * Math.sin(hueRadians);
  const lRoot = color.lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = color.lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = color.lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;

  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function interpolateHue(from: number | null, to: number | null, amount: number): number | null {
  if (from === null) return to;
  if (to === null) return from;
  const difference = ((to - from + 540) % 360) - 180;
  return normalizeHue(from + difference * amount);
}

function srgbToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number): number {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;
}

function isInSrgbGamut(color: readonly number[]): boolean {
  return color.every(
    (channel) => channel >= -SRGB_GAMUT_TOLERANCE && channel <= 1 + SRGB_GAMUT_TOLERANCE,
  );
}

function toRgbChannels(color: readonly [number, number, number]): AerisRgbColor {
  return {
    red: clampUnit(color[0]) * 255,
    green: clampUnit(color[1]) * 255,
    blue: clampUnit(color[2]) * 255,
  };
}

function interpolate(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function formatPercentage(value: number): string {
  return Number(value.toFixed(4)).toString();
}

function parseHex(value: string): AerisRgbColor | null {
  const hex = value.slice(1);
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(hex)) return null;
  const normalized =
    hex.length === 3 ? [...hex].map((character) => character.repeat(2)).join('') : hex;
  return {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function parseRgb(value: string): AerisRgbColor | null {
  const functionalValue = splitFunctionalColor(value);
  if (!functionalValue) return null;
  const body = functionalValue.channels;
  if (!body) return null;
  const channels = body.replaceAll(',', ' ').split(/\s+/).filter(Boolean);
  if (channels.length !== 3) return null;

  const parsed = channels.map((channel) => {
    const numeric = Number.parseFloat(channel);
    if (!Number.isFinite(numeric)) return Number.NaN;
    return channel.endsWith('%') ? numeric * 2.55 : numeric;
  });
  if (parsed.some((channel) => !Number.isFinite(channel))) return null;
  return {
    red: clampChannel(parsed[0]!),
    green: clampChannel(parsed[1]!),
    blue: clampChannel(parsed[2]!),
  };
}

function parseHsl(value: string): AerisRgbColor | null {
  const functionalValue = splitFunctionalColor(value);
  if (!functionalValue) return null;
  const body = functionalValue.channels;
  if (!body) return null;
  const channels = body.replaceAll(',', ' ').split(/\s+/).filter(Boolean);
  if (channels.length !== 3 || !channels[1]?.endsWith('%') || !channels[2]?.endsWith('%')) {
    return null;
  }

  const hue = Number.parseFloat(channels[0]!);
  const saturation = Number.parseFloat(channels[1]!) / 100;
  const lightness = Number.parseFloat(channels[2]!) / 100;
  if (![hue, saturation, lightness].every(Number.isFinite)) return null;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = (((hue % 360) + 360) % 360) / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const [red, green, blue] =
    section < 1
      ? [chroma, secondary, 0]
      : section < 2
        ? [secondary, chroma, 0]
        : section < 3
          ? [0, chroma, secondary]
          : section < 4
            ? [0, secondary, chroma]
            : section < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];
  const match = lightness - chroma / 2;
  return {
    red: clampChannel((red + match) * 255),
    green: clampChannel((green + match) * 255),
    blue: clampChannel((blue + match) * 255),
  };
}

function splitFunctionalColor(value: string): { readonly channels: string } | null {
  const body = value.slice(value.indexOf('(') + 1, -1);
  const [channels, alpha, ...remainder] = body.split('/').map((part) => part.trim());
  if (!channels || remainder.length > 0) return null;
  if (alpha !== undefined && !isOpaqueAlpha(alpha)) return null;
  return { channels };
}

function isOpaqueAlpha(value: string): boolean {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return false;
  return value.endsWith('%') ? numeric === 100 : numeric === 1;
}

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, value));
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}
