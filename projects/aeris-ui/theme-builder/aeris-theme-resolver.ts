import { AERIS_SEMANTIC_TONE_NAMES } from './aeris-semantic-tones';
import {
  AERIS_DEFAULT_THEME,
  AERIS_THEME_PRESETS,
  type AerisDensityScale,
  type AerisPalette,
  type AerisRadiusScale,
  type AerisTheme,
  type AerisThemeOverride,
  type AerisThemeScheme,
} from './aeris-theme';

const AERIS_THEME_RESOLUTION_BASE: AerisTheme = {
  ...AERIS_DEFAULT_THEME,
  palette: {
    ...AERIS_THEME_PRESETS.earth.palette,
    mist: AERIS_THEME_PRESETS.earth.palette.surface,
    sage: AERIS_THEME_PRESETS.earth.palette.primary,
    cloud: AERIS_THEME_PRESETS.earth.palette.secondary,
    sand: AERIS_THEME_PRESETS.earth.palette.accent,
    umber: AERIS_THEME_PRESETS.earth.palette.contrast,
  },
  light: {},
  dark: { ...AERIS_THEME_PRESETS.earth.dark },
};

/** Resolves an optional theme override against the complete Aeris defaults. */
export function resolveAerisTheme(theme: AerisThemeOverride | undefined): AerisTheme {
  const base = theme === undefined ? AERIS_DEFAULT_THEME : AERIS_THEME_RESOLUTION_BASE;

  return {
    ...base,
    ...theme,
    palette: {
      ...base.palette,
      ...normalizeAerisPalette(theme?.palette),
    },
    light: {
      ...base.light,
      ...theme?.light,
      tones: mergeAerisSemanticTones(base.light.tones, theme?.light?.tones),
    },
    dark: {
      ...base.dark,
      ...theme?.dark,
      tones: mergeAerisSemanticTones(base.dark.tones, theme?.dark?.tones),
    },
    densities: {
      ...base.densities,
      ...theme?.densities,
    },
    radii: {
      ...base.radii,
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
