import { resolveAerisFoundation } from './aeris-foundation';
import { AERIS_SEMANTIC_TONE_NAMES, resolveAerisSemanticTones } from './aeris-semantic-tones';
import { resolveAerisDensity, resolveAerisRadius } from './aeris-theme-resolver';
import { type AerisDensityScale, type AerisRadiusScale, type AerisTheme } from './aeris-theme';

export type AerisThemeTokenName = `--aeris-${string}`;
export type AerisThemeTokenMap = Readonly<Record<AerisThemeTokenName, string>>;

const FOUNDATION_TOKENS = [
  ['page', '--aeris-page'],
  ['surface', '--aeris-surface'],
  ['surface2', '--aeris-surface-2'],
  ['surface3', '--aeris-surface-3'],
  ['interactiveHover', '--aeris-interactive-hover'],
  ['text', '--aeris-text'],
  ['text2', '--aeris-text-2'],
  ['text3', '--aeris-text-3'],
  ['border', '--aeris-border'],
  ['borderStrong', '--aeris-border-strong'],
  ['focus', '--aeris-focus'],
] as const;

const DENSITY_TOKENS: readonly (readonly [keyof AerisDensityScale, AerisThemeTokenName])[] = [
  ['controlHeight', '--aeris-control-height'],
  ['controlPaddingX', '--aeris-control-padding-x'],
  ['itemHeight', '--aeris-item-height'],
  ['itemPaddingY', '--aeris-item-padding-y'],
  ['itemPaddingX', '--aeris-item-padding-x'],
  ['gap', '--aeris-density-gap'],
  ['iconSize', '--aeris-icon-size'],
];

const RADIUS_TOKENS: readonly (readonly [keyof AerisRadiusScale, AerisThemeTokenName])[] = [
  ['sm', '--aeris-radius-sm'],
  ['md', '--aeris-radius-md'],
  ['lg', '--aeris-radius-lg'],
  ['xl', '--aeris-radius-xl'],
  ['control', '--aeris-radius-control'],
  ['pill', '--aeris-radius-pill'],
];

/** Resolves the ordered CSS custom properties used by runtime and generated Aeris themes. */
export function resolveAerisThemeTokens(
  theme: AerisTheme,
  mode: 'light' | 'dark',
): AerisThemeTokenMap {
  const tokens: Partial<Record<AerisThemeTokenName, string>> = {};

  for (const [name, value] of Object.entries(theme.palette)) {
    tokens[`--aeris-palette-${name}`] = value;
  }

  const foundation = resolveAerisFoundation(theme, mode);
  for (const [property, token] of FOUNDATION_TOKENS) {
    tokens[token] = foundation[property];
  }

  tokens['--aeris-accent'] = theme[mode].accent ?? theme.palette.accent;
  if (theme[mode].shadowXs) tokens['--aeris-shadow-xs'] = theme[mode].shadowXs;
  if (theme[mode].shadowSm) tokens['--aeris-shadow-sm'] = theme[mode].shadowSm;

  const tones = resolveAerisSemanticTones(theme, mode);
  for (const name of AERIS_SEMANTIC_TONE_NAMES) {
    const tone = tones[name];
    tokens[`--aeris-${name}`] = tone.base;
    tokens[`--aeris-${name}-boundary`] = tone.boundary;
    tokens[`--aeris-${name}-hover`] = tone.hover;
    tokens[`--aeris-${name}-active`] = tone.active;
    tokens[`--aeris-on-${name}`] = tone.onBase;
    tokens[`--aeris-on-${name}-hover`] = tone.onHover;
    tokens[`--aeris-on-${name}-active`] = tone.onActive;
    tokens[`--aeris-${name}-text`] = tone.text;
    tokens[`--aeris-${name}-soft`] = tone.soft;
    tokens[`--aeris-on-${name}-soft`] = tone.onSoft;
    tokens[`--aeris-${name}-contrast`] = tone.onBase;
  }
  tokens['--aeris-primary-contrast'] = tones.primary.onBase;

  const density = resolveAerisDensity(theme);
  for (const [property, token] of DENSITY_TOKENS) {
    const value = density[property];
    if (value) tokens[token] = value;
  }

  const radius = resolveAerisRadius(theme);
  for (const [property, token] of RADIUS_TOKENS) {
    const value = radius[property];
    if (value) tokens[token] = value;
  }

  return tokens as AerisThemeTokenMap;
}
