import { AERIS_SEMANTIC_TONE_NAMES } from './aeris-semantic-tones';
import {
  AERIS_DEFAULT_THEME,
  type AerisDensityScale,
  type AerisPalette,
  type AerisRadiusScale,
  type AerisTheme,
  type AerisThemeOverride,
  type AerisThemeScheme,
} from './aeris-theme';

/** Resolves an optional theme override against the complete Aeris defaults. */
export function resolveAerisTheme(theme: AerisThemeOverride | undefined): AerisTheme {
  return {
    ...AERIS_DEFAULT_THEME,
    ...theme,
    palette: {
      ...AERIS_DEFAULT_THEME.palette,
      ...normalizeAerisPalette(theme?.palette),
    },
    light: {
      ...AERIS_DEFAULT_THEME.light,
      ...theme?.light,
      tones: mergeAerisSemanticTones(AERIS_DEFAULT_THEME.light.tones, theme?.light?.tones),
    },
    dark: {
      ...AERIS_DEFAULT_THEME.dark,
      ...theme?.dark,
      tones: mergeAerisSemanticTones(AERIS_DEFAULT_THEME.dark.tones, theme?.dark?.tones),
    },
    densities: {
      ...AERIS_DEFAULT_THEME.densities,
      ...theme?.densities,
    },
    radii: {
      ...AERIS_DEFAULT_THEME.radii,
      ...theme?.radii,
    },
  };
}

/** Deeply merges a runtime update into an already resolved Aeris theme. */
export function mergeAerisTheme(theme: AerisTheme, update: AerisThemeOverride): AerisTheme {
  return {
    ...theme,
    ...update,
    palette: {
      ...theme.palette,
      ...normalizeAerisPalette(update.palette),
    },
    light: {
      ...theme.light,
      ...update.light,
      tones: mergeAerisSemanticTones(theme.light.tones, update.light?.tones),
    },
    dark: {
      ...theme.dark,
      ...update.dark,
      tones: mergeAerisSemanticTones(theme.dark.tones, update.dark?.tones),
    },
    densities: {
      ...theme.densities,
      ...update.densities,
    },
    radii: {
      ...theme.radii,
      ...update.radii,
    },
  };
}

export function resolveAerisDensity(theme: AerisTheme): AerisDensityScale {
  return theme.densities[theme.density] ?? AERIS_DEFAULT_THEME.densities['medium'];
}

export function resolveAerisRadius(theme: AerisTheme): AerisRadiusScale {
  return theme.radii[theme.radius] ?? AERIS_DEFAULT_THEME.radii['rounded'];
}

function mergeAerisSemanticTones(
  current: AerisThemeScheme['tones'],
  updates: AerisThemeScheme['tones'],
): AerisThemeScheme['tones'] {
  if (!current && !updates) return undefined;

  return Object.fromEntries(
    AERIS_SEMANTIC_TONE_NAMES.map((name) => [
      name,
      {
        ...current?.[name],
        ...updates?.[name],
      },
    ]),
  );
}

function normalizeAerisPalette(palette: Partial<AerisPalette> | undefined): Partial<AerisPalette> {
  if (!palette) return {};

  const surface = palette.surface ?? palette.mist;
  const primary = palette.primary ?? palette.sage;
  const secondary = palette.secondary ?? palette.cloud;
  const accent = palette.accent ?? palette.sand;
  const contrast = palette.contrast ?? palette.umber;

  return {
    ...palette,
    ...(surface ? { surface, mist: surface } : {}),
    ...(primary ? { primary, sage: primary } : {}),
    ...(secondary ? { secondary, cloud: secondary } : {}),
    ...(accent ? { accent, sand: accent } : {}),
    ...(contrast ? { contrast, umber: contrast } : {}),
  };
}
