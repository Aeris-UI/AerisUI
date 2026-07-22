import {
  type AerisSemanticTone,
  type AerisSemanticToneName,
  type AerisResolvedSemanticTone,
  type AerisResolvedSemanticTones,
  type AerisTheme,
  type AerisThemeScheme,
} from './aeris-theme';
import {
  aerisRgbContrastRatio,
  formatAerisHex,
  mixAerisColor,
  mixAerisRgb,
  parseAerisColor,
} from './aeris-color';

export const AERIS_SEMANTIC_TONE_NAMES: readonly AerisSemanticToneName[] = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'contrast',
];

const LIGHT_BASES: Readonly<Partial<Record<AerisSemanticToneName, string>>> = {
  success: '#52744d',
  info: '#4f7180',
  warning: '#c38600',
  danger: '#c81e2a',
};

const DARK_BASES: Readonly<Partial<Record<AerisSemanticToneName, string>>> = {
  success: '#91b78a',
  info: '#91b7c8',
  warning: '#facc15',
  danger: '#ff5c68',
};

const DARK_FOREGROUND = '#111411';
const LIGHT_FOREGROUND = '#ffffff';
const REQUIRED_TEXT_CONTRAST = 4.5;
const LIGHT_HOVER_MIX = 0.04;
const LIGHT_ACTIVE_MIX = 0.05;
const DARK_HOVER_MIX = 0.2;
const DARK_ACTIVE_MIX = 0.28;

export function resolveAerisSemanticTones(
  theme: AerisTheme,
  mode: 'light' | 'dark',
): AerisResolvedSemanticTones {
  const scheme = theme[mode];
  const surface = resolveSurface(theme, scheme, mode);
  const result = {} as Record<AerisSemanticToneName, AerisResolvedSemanticTone>;

  for (const name of AERIS_SEMANTIC_TONE_NAMES) {
    const overrides = scheme.tones?.[name] ?? {};
    const base = overrides.base ?? defaultBase(theme, mode, name);
    const boundary = overrides.boundary ?? base;
    const hover = overrides.hover ?? deriveState(base, mode, stateMix(mode, 'hover'));
    const active = overrides.active ?? deriveState(base, mode, stateMix(mode, 'active'));
    const soft = overrides.soft ?? mixAerisColor(surface, base, mode === 'dark' ? 0.2 : 0.14);
    const text = overrides.text ?? ensureTextContrast(base, surface, mode);
    const onBase = overrides.onBase ?? contrastingForeground(base);
    const onHover = overrides.onHover ?? contrastingForeground(hover, onBase);
    const onActive = overrides.onActive ?? contrastingForeground(active, onHover);
    const onSoft = overrides.onSoft ?? ensureTextContrast(text, soft, mode);

    result[name] = {
      base,
      boundary,
      hover,
      active,
      onBase,
      onHover,
      onActive,
      text,
      soft,
      onSoft,
    };
  }

  return result;
}

function defaultBase(
  theme: AerisTheme,
  mode: 'light' | 'dark',
  name: AerisSemanticToneName,
): string {
  const fixed = (mode === 'dark' ? DARK_BASES : LIGHT_BASES)[name];
  if (fixed) return fixed;

  const seed =
    name === 'primary'
      ? theme.palette.primary
      : name === 'secondary'
        ? theme.palette.secondary
        : theme.palette.contrast;
  if (mode === 'light') return seed;
  return mixAerisColor(seed, LIGHT_FOREGROUND, name === 'contrast' ? 0.29 : 0.22);
}

function resolveSurface(
  theme: AerisTheme,
  scheme: AerisThemeScheme,
  mode: 'light' | 'dark',
): string {
  if (scheme.surface) return scheme.surface;
  return mode === 'light'
    ? LIGHT_FOREGROUND
    : mixAerisColor('#1f221c', theme.palette.surface, 0.02);
}

function deriveState(base: string, mode: 'light' | 'dark', amount: number): string {
  return mixAerisColor(base, mode === 'light' ? DARK_FOREGROUND : LIGHT_FOREGROUND, amount);
}

function stateMix(mode: 'light' | 'dark', state: 'hover' | 'active'): number {
  if (mode === 'light') return state === 'hover' ? LIGHT_HOVER_MIX : LIGHT_ACTIVE_MIX;
  return state === 'hover' ? DARK_HOVER_MIX : DARK_ACTIVE_MIX;
}

function contrastingForeground(color: string, fallback = DARK_FOREGROUND): string {
  const background = parseAerisColor(color);
  if (!background) return fallback;

  const fallbackColor = parseAerisColor(fallback);
  if (fallbackColor && aerisRgbContrastRatio(background, fallbackColor) >= REQUIRED_TEXT_CONTRAST) {
    return fallback;
  }

  const darkContrast = aerisRgbContrastRatio(background, parseAerisColor(DARK_FOREGROUND)!);
  const lightContrast = aerisRgbContrastRatio(background, parseAerisColor(LIGHT_FOREGROUND)!);
  return lightContrast > darkContrast ? LIGHT_FOREGROUND : DARK_FOREGROUND;
}

function ensureTextContrast(color: string, background: string, mode: 'light' | 'dark'): string {
  const foreground = parseAerisColor(color);
  const surface = parseAerisColor(background);
  if (!foreground || !surface) return color;
  if (aerisRgbContrastRatio(foreground, surface) >= REQUIRED_TEXT_CONTRAST) return color;

  const target = parseAerisColor(mode === 'light' ? DARK_FOREGROUND : LIGHT_FOREGROUND)!;
  for (let amount = 0.05; amount <= 1; amount += 0.05) {
    const candidate = mixAerisRgb(foreground, target, amount);
    if (aerisRgbContrastRatio(candidate, surface) >= REQUIRED_TEXT_CONTRAST) {
      return formatAerisHex(candidate);
    }
  }
  return formatAerisHex(target);
}
