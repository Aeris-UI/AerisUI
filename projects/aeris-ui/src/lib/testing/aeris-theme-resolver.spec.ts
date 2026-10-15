import {
  AERIS_THEME_PRESETS,
  compileAerisTheme,
  mergeAerisTheme,
  resolveAerisSemanticTones,
  resolveAerisTheme,
  resolveAerisThemeScheme,
  resolveAerisThemeTokens,
  validateAerisTheme,
  type AerisThemeOverride,
} from '../../../theme-builder/public-api';

describe('Aeris theme inheritance', () => {
  it('keeps omitted, empty, and geometry-only themes on the complete Monochrome defaults', () => {
    const defaults = resolveAerisTheme();
    for (const input of [{}, { density: 'compact' }, { radius: 'soft' }]) {
      const theme = resolveAerisTheme(input);
      expect(theme.preset).toBe('monochrome');
      expect(theme.palette).toEqual(defaults.palette);
      for (const mode of ['light', 'dark'] as const) {
        expect(resolveAerisThemeScheme(theme, mode)).toEqual(
          resolveAerisThemeScheme(defaults, mode),
        );
      }
    }
  });

  it('retains preset identity across object spreads and JSON round trips', () => {
    for (const preset of Object.values(AERIS_THEME_PRESETS)) {
      const input = { ...preset, density: 'compact' };
      const original = resolveAerisTheme(input);
      const restored = resolveAerisTheme(JSON.parse(JSON.stringify(input)) as AerisThemeOverride);
      for (const mode of ['light', 'dark'] as const) {
        expect(resolveAerisThemeTokens(restored, mode)).toEqual(
          resolveAerisThemeTokens(original, mode),
        );
      }
      expect(original.light.tones).toEqual({});
    }
  });

  it('regenerates inherited primary colors in both modes when the seed changes', () => {
    const original = resolveAerisTheme();
    const changed = mergeAerisTheme(original, { palette: { primary: '#2563eb' } });
    for (const mode of ['light', 'dark'] as const) {
      const tones = resolveAerisSemanticTones(changed, mode);
      expect(tones.primary.base).not.toBe(resolveAerisSemanticTones(original, mode).primary.base);
      expect(tones.primary.hover).not.toBe(resolveAerisSemanticTones(original, mode).primary.hover);
      expect(tones.secondary).toEqual(resolveAerisSemanticTones(original, mode).secondary);
      expect(tones.danger).toEqual(resolveAerisSemanticTones(original, mode).danger);
    }
    expect(resolveAerisSemanticTones(changed, 'light').primary.base).toBe('#2563eb');
  });

  it('returns to inherited colors when a seed is restored', () => {
    const original = resolveAerisTheme();
    const changed = mergeAerisTheme(original, { palette: { primary: '#2563eb' } });
    const restored = mergeAerisTheme(changed, { palette: { primary: original.palette.primary } });
    expect(resolveAerisThemeTokens(restored, 'dark')).toEqual(
      resolveAerisThemeTokens(original, 'dark'),
    );
  });

  it('regenerates inherited tone states when an explicit base changes', () => {
    const theme = resolveAerisTheme({ light: { tones: { primary: { base: '#facc15' } } } });
    const tone = resolveAerisSemanticTones(theme, 'light').primary;
    expect(tone.base).toBe('#facc15');
    expect(tone.hover).not.toBe('#242424');
    expect(tone.onBase).not.toBe('#ffffff');
    expect(resolveAerisSemanticTones(theme, 'dark')).toEqual(
      resolveAerisSemanticTones(resolveAerisTheme(), 'dark'),
    );
  });

  it('preserves explicit states and foregrounds through later seed and base updates', () => {
    const theme = resolveAerisTheme({
      light: { tones: { primary: { hover: '#123456', onBase: '#eeeeee' } } },
    });
    const changed = mergeAerisTheme(theme, {
      palette: { primary: '#2563eb' },
      light: { tones: { primary: { base: '#345678' } } },
    });
    expect(resolveAerisSemanticTones(changed, 'light').primary).toEqual(
      expect.objectContaining({ base: '#345678', hover: '#123456', onBase: '#eeeeee' }),
    );
  });

  it('derives paired foregrounds when a preset background state is overridden', () => {
    const theme = resolveAerisTheme({
      light: { tones: { primary: { hover: '#facc15', active: '#ffffff', soft: '#111111' } } },
    });
    const tone = resolveAerisSemanticTones(theme, 'light').primary;
    expect(tone.onHover).not.toBe('#ffffff');
    expect(tone.onActive).not.toBe('#ffffff');
    expect(tone.onSoft).not.toBe('#111111');
    const explicit = mergeAerisTheme(theme, {
      light: { tones: { primary: { onHover: '#123456' } } },
    });
    expect(resolveAerisSemanticTones(explicit, 'light').primary.onHover).toBe('#123456');
  });

  it('allows automatic tone resets to be serialized and edited again', () => {
    const automatic = resolveAerisTheme({ light: { tones: { primary: null } } });
    const restored = resolveAerisTheme(JSON.parse(JSON.stringify(automatic)) as AerisThemeOverride);
    expect(resolveAerisThemeTokens(restored, 'light')).toEqual(
      resolveAerisThemeTokens(automatic, 'light'),
    );
    const edited = mergeAerisTheme(restored, {
      light: { tones: { primary: { base: '#2563eb' } } },
    });
    expect(resolveAerisSemanticTones(edited, 'light').primary.base).toBe('#2563eb');
  });

  it('resets one tone or one property to automatic using serializable null values', () => {
    const theme = resolveAerisTheme();
    const propertyReset = mergeAerisTheme(theme, {
      light: { tones: { primary: { hover: null } } },
    });
    const toneReset = mergeAerisTheme(theme, { light: { tones: { primary: null } } });
    const original = resolveAerisSemanticTones(theme, 'light').primary;
    expect(resolveAerisSemanticTones(propertyReset, 'light').primary.hover).not.toBe(
      original.hover,
    );
    expect(resolveAerisSemanticTones(propertyReset, 'light').primary.base).toBe(original.base);
    expect(resolveAerisSemanticTones(toneReset, 'light').primary.hover).not.toBe(original.hover);
    expect(propertyReset.light.tones?.primary).toEqual({ hover: null });
    expect(toneReset.light.tones?.primary).toBeNull();
    expect(
      validateAerisTheme(toneReset).issues.some(({ code }) => code === 'invalid-css-value'),
    ).toBe(false);
  });

  it('removes an explicit override with undefined and restores inheritance', () => {
    const original = resolveAerisTheme();
    const changed = mergeAerisTheme(original, {
      light: { tones: { primary: { hover: '#123456' } } },
    });
    const restored = mergeAerisTheme(changed, {
      light: { tones: { primary: { hover: undefined } } },
    });
    expect(resolveAerisSemanticTones(restored, 'light')).toEqual(
      resolveAerisSemanticTones(original, 'light'),
    );
  });

  it('removes foundation overrides rather than masking inherited starter values with undefined', () => {
    for (const mode of ['light', 'dark'] as const) {
      const original = resolveAerisTheme();
      const changed = mergeAerisTheme(original, {
        [mode]: { text: '#123456', surface: '#654321' },
      });
      const restored = mergeAerisTheme(changed, {
        [mode]: { text: undefined, surface: undefined },
      });
      expect(Object.hasOwn(restored[mode], 'text')).toBe(false);
      expect(Object.hasOwn(restored[mode], 'surface')).toBe(false);
      expect(resolveAerisThemeTokens(restored, mode)).toEqual(
        resolveAerisThemeTokens(original, mode),
      );
      expect(
        resolveAerisThemeTokens(resolveAerisTheme({ [mode]: { text: undefined } }), mode),
      ).toEqual(resolveAerisThemeTokens(original, mode));
    }
  });

  it('changes preset without leaking previous colors or overrides and retains geometry', () => {
    const theme = resolveAerisTheme({
      density: 'compact',
      radius: 'soft',
      direction: 'rtl',
      light: { page: '#123456', tones: { primary: { hover: '#654321' } } },
    });
    const changed = mergeAerisTheme(theme, { preset: 'coastal' });
    expect(changed).toEqual(
      resolveAerisTheme({
        preset: 'coastal',
        density: 'compact',
        radius: 'soft',
        direction: 'rtl',
      }),
    );
  });

  it('keeps explicit foundations authoritative when palette seeds change', () => {
    const theme = resolveAerisTheme({ light: { page: '#fafafa', focus: '#123456' } });
    const changed = mergeAerisTheme(theme, { palette: { surface: '#e0e7ff', primary: '#2563eb' } });
    expect(resolveAerisThemeTokens(changed, 'light')).toEqual(
      expect.objectContaining({ '--aeris-page': '#fafafa', '--aeris-focus': '#123456' }),
    );
  });

  it('produces identical build-time and runtime tokens after edits and automatic resets', () => {
    const theme = mergeAerisTheme(resolveAerisTheme(AERIS_THEME_PRESETS.orchid), {
      palette: { primary: '#2563eb' },
      light: { tones: { primary: { hover: null } } },
    });
    const compiled = compileAerisTheme(theme, { validateContrast: false });
    expect(compiled.lightTokens).toEqual(resolveAerisThemeTokens(theme, 'light'));
    expect(compiled.darkTokens).toEqual(resolveAerisThemeTokens(theme, 'dark'));
  });

  it('never mutates shared presets or earlier theme states', () => {
    const before = JSON.stringify(AERIS_THEME_PRESETS);
    const theme = resolveAerisTheme();
    const stored = JSON.stringify(theme);
    mergeAerisTheme(theme, {
      palette: { primary: '#2563eb' },
      light: { tones: { primary: null } },
    });
    expect(JSON.stringify(theme)).toBe(stored);
    expect(JSON.stringify(AERIS_THEME_PRESETS)).toBe(before);
  });

  it('exports only the five canonical palette colors and no legacy CSS aliases', () => {
    const theme = resolveAerisTheme();
    expect(Object.keys(theme.palette).sort()).toEqual([
      'accent',
      'contrast',
      'primary',
      'secondary',
      'surface',
    ]);
    expect(
      Object.keys(resolveAerisThemeTokens(theme, 'light')).filter((name) =>
        name.startsWith('--aeris-palette-'),
      ),
    ).toHaveLength(5);
  });

  it('reports unknown preset names instead of crashing resolution', () => {
    for (const preset of ['unknown', '__proto__', 'constructor']) {
      const input = { preset } as unknown as AerisThemeOverride;
      expect(validateAerisTheme(input).errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'invalid-preset', path: 'preset' }),
        ]),
      );
      expect(() => compileAerisTheme(input)).toThrow('Aeris theme generation failed');
    }
  });
});
