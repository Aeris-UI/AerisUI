import {
  AERIS_COLOR_DERIVATION_VERSION,
  AERIS_THEME_PRESETS,
  resolveAerisTheme,
  resolveAerisThemeTokens,
  type AerisThemeOverride,
  type AerisThemeTokenMap,
} from '../../../theme-builder/public-api';

interface ColorStabilityFixture {
  readonly input: AerisThemeOverride;
  readonly light: string;
  readonly dark: string;
  readonly tokenCount: number;
}

const COLOR_STABILITY_FIXTURES: Readonly<Record<string, ColorStabilityFixture>> = {
  earth: {
    input: AERIS_THEME_PRESETS.earth,
    light: '1cc8093ca6bd6b85',
    dark: '63f95a7d553341cc',
    tokenCount: 94,
  },
  coastal: {
    input: AERIS_THEME_PRESETS.coastal,
    light: 'f614c21dc3fdbd8b',
    dark: 'f8bac1248c8f3496',
    tokenCount: 94,
  },
  orchid: {
    input: AERIS_THEME_PRESETS.orchid,
    light: 'efbe963fd9a76485',
    dark: 'e58ea0f913df64e4',
    tokenCount: 94,
  },
  monochrome: {
    input: AERIS_THEME_PRESETS.monochrome,
    light: '0adf43a3541a7370',
    dark: '1c50d6bd0819725d',
    tokenCount: 94,
  },
  customOcean: {
    input: {
      palette: {
        surface: '#dce9ee',
        primary: '#167f92',
        secondary: '#6a5fa0',
        accent: '#e8a84f',
        contrast: '#173a4a',
      },
    },
    light: '7b7dc663aa5c0fb0',
    dark: 'bf948d062d3661f3',
    tokenCount: 94,
  },
  customWarm: {
    input: {
      palette: {
        surface: '#efe1d3',
        primary: '#a3422f',
        secondary: '#6f7652',
        accent: '#d99b3d',
        contrast: '#34221d',
      },
    },
    light: '8ae265aa6d2c12aa',
    dark: '9e658310c70c8e85',
    tokenCount: 94,
  },
};

describe(`Aeris color derivation v${AERIS_COLOR_DERIVATION_VERSION}`, () => {
  it('preserves every official preset color from v1 apart from removed palette aliases', () => {
    const previous = {
      earth: ['4f7c19c5e503a4eb', 'b2f3d1682641554c'],
      coastal: ['17d2ec41bef554ec', '0cce3283d9084ca3'],
      orchid: ['55ac54eb7cd8f0a7', '717a131cf4350c6e'],
      monochrome: ['fddbb1091ffebc75', '1d03f9ab6c11bf2c'],
    } as const;
    for (const name of Object.keys(previous) as (keyof typeof previous)[]) {
      const theme = resolveAerisTheme(AERIS_THEME_PRESETS[name]);
      for (const [index, mode] of (['light', 'dark'] as const).entries()) {
        // Reconstruct only the five removed aliases to compare the original v1 checksum.
        const tokens = {
          ...resolveAerisThemeTokens(theme, mode),
          '--aeris-palette-mist': theme.palette.surface,
          '--aeris-palette-sage': theme.palette.primary,
          '--aeris-palette-cloud': theme.palette.secondary,
          '--aeris-palette-sand': theme.palette.accent,
          '--aeris-palette-umber': theme.palette.contrast,
        };
        expect(fingerprint(canonicalColorTokens(tokens).serialized), `${name} ${mode}`).toBe(
          previous[name][index],
        );
      }
    }
  });
  for (const [name, fixture] of Object.entries(COLOR_STABILITY_FIXTURES)) {
    it(`preserves every derived color token for ${name}`, () => {
      const theme = resolveAerisTheme(fixture.input);
      const light = canonicalColorTokens(resolveAerisThemeTokens(theme, 'light'));
      const dark = canonicalColorTokens(resolveAerisThemeTokens(theme, 'dark'));

      expect(light.tokenCount).toBe(fixture.tokenCount);
      expect(dark.tokenCount).toBe(fixture.tokenCount);
      expect(fingerprint(light.serialized)).toBe(fixture.light);
      expect(fingerprint(dark.serialized)).toBe(fixture.dark);
    });
  }
});

function canonicalColorTokens(tokens: AerisThemeTokenMap): {
  readonly serialized: string;
  readonly tokenCount: number;
} {
  const entries = Object.entries(tokens)
    .filter(([, value]) => isResolvedColorValue(value))
    .sort(([first], [second]) => first.localeCompare(second));

  return {
    serialized: entries.map(([token, value]) => `${token}:${value}`).join('|'),
    tokenCount: entries.length,
  };
}

function isResolvedColorValue(value: string): boolean {
  return /^(?:#|rgb\(|hsl\(|oklch\(|color-mix\()/.test(value);
}

/** Deterministic 64-bit FNV-1a fingerprint; this is a regression checksum, not a security hash. */
function fingerprint(value: string): string {
  let hash = 0xcbf29ce484222325n;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= BigInt(value.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }

  return hash.toString(16).padStart(16, '0');
}
