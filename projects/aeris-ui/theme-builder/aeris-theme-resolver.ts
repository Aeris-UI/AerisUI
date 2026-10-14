import {
  AERIS_DEFAULT_THEME,
  AERIS_SEMANTIC_TONE_NAMES,
  AERIS_THEME_PRESETS,
  type AerisDensityScale,
  type AerisPaletteConfig,
  type AerisRadiusScale,
  type AerisTheme,
  type AerisThemeOverride,
  type AerisThemeScheme,
} from './aeris-theme';

/** Resolves every configuration against Monochrome unless a preset is selected. */
export function resolveAerisTheme(theme: AerisThemeOverride = {}): AerisTheme {
  const preset = theme.preset ?? AERIS_DEFAULT_THEME.preset;
  return {
    ...AERIS_DEFAULT_THEME,
    ...theme,
    preset,
    palette: mergePalette(
      (Object.hasOwn(AERIS_THEME_PRESETS, preset)
        ? AERIS_THEME_PRESETS[preset]
        : AERIS_THEME_PRESETS.monochrome
      ).palette,
      theme.palette,
    ),
    light: mergeScheme({}, theme.light),
    dark: mergeScheme({}, theme.dark),
    densities: { ...AERIS_DEFAULT_THEME.densities, ...theme.densities },
    radii: { ...AERIS_DEFAULT_THEME.radii, ...theme.radii },
  };
}

/** Merge explicit values; changing preset starts a new theme instead of leaking old overrides. */
export function mergeAerisTheme(theme: AerisTheme, update: AerisThemeOverride): AerisTheme {
  if (update.preset !== undefined && update.preset !== theme.preset) {
    return resolveAerisTheme({
      density: theme.density,
      densities: theme.densities,
      radius: theme.radius,
      radii: theme.radii,
      direction: theme.direction,
      ...update,
    });
  }
  return resolveAerisTheme({
    ...theme,
    ...update,
    palette: { ...theme.palette, ...update.palette },
    light: mergeScheme(theme.light, update.light),
    dark: mergeScheme(theme.dark, update.dark),
    densities: { ...theme.densities, ...update.densities },
    radii: { ...theme.radii, ...update.radii },
  });
}

export function resolveAerisDensity(theme: AerisTheme): AerisDensityScale {
  return theme.densities[theme.density] ?? AERIS_DEFAULT_THEME.densities['medium'];
}

export function resolveAerisRadius(theme: AerisTheme): AerisRadiusScale {
  return theme.radii[theme.radius] ?? AERIS_DEFAULT_THEME.radii['rounded'];
}

function mergeScheme(current: AerisThemeScheme, update: AerisThemeScheme = {}): AerisThemeScheme {
  const tones = { ...current.tones };
  for (const name of AERIS_SEMANTIC_TONE_NAMES) {
    if (!Object.hasOwn(update.tones ?? {}, name)) continue;
    const tone = update.tones?.[name];
    if (tone === undefined) {
      delete tones[name];
    } else if (tone === null) {
      tones[name] = null;
    } else {
      const merged = { ...current.tones?.[name], ...tone };
      for (const key of Object.keys(merged) as (keyof typeof merged)[])
        if (merged[key] === undefined) delete merged[key];
      tones[name] = merged;
    }
  }
  return { ...current, ...update, tones };
}

function mergePalette(
  current: AerisPaletteConfig,
  update?: Partial<AerisPaletteConfig>,
): AerisPaletteConfig {
  const palette = { ...current };
  for (const key of Object.keys(current) as (keyof AerisPaletteConfig)[]) {
    const value = update?.[key];
    if (value !== undefined) palette[key] = value;
  }
  return palette;
}
