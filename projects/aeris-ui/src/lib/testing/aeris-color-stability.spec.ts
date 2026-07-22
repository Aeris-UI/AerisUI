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
    light: 'bebca20a715e9eb0',
    dark: 'cd5fbd903a973ea3',
    tokenCount: 99,
  },
  coastal: {
    input: AERIS_THEME_PRESETS.coastal,
    light: 'a23e4d2863f0c302',
    dark: '777bf42ed13fe0a2',
    tokenCount: 99,
  },
  orchid: {
    input: AERIS_THEME_PRESETS.orchid,
    light: '1e814f7cab7d0dc7',
    dark: 'e0e4e2c89747ea03',
    tokenCount: 99,
  },
  monochrome: {
    input: AERIS_THEME_PRESETS.monochrome,
    light: '713c6a1c71c17ba7',
    dark: '201472cca3b3a642',
    tokenCount: 99,
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
    light: 'b5fd89406372a2e0',
    dark: '36ea54e6c9d722bb',
    tokenCount: 99,
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
    light: '5e274a0907a499fe',
    dark: '6c3cf926290f9a76',
    tokenCount: 99,
  },
};

describe(`Aeris color derivation v${AERIS_COLOR_DERIVATION_VERSION}`, () => {
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
