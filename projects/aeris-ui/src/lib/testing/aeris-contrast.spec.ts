import {
  AERIS_DEFAULT_THEME,
  AERIS_THEME_PRESETS,
  auditAerisThemeContrast,
  type AerisTheme,
  type AerisThemePreset,
} from '../../../theming/public-api';
import { aerisContrastRatio } from '../../../theme-builder/aeris-color';
import { resolveAerisFoundation } from '../../../theme-builder/aeris-foundation';

describe('Aeris theme contrast audit', () => {
  it('reports every WCAG AA text, interaction, focus, and boundary check', () => {
    const report = auditAerisThemeContrast(AERIS_DEFAULT_THEME, 'light');

    expect(report.mode).toBe('light');
    expect(report.total).toBe(53);
    expect(report.checks.some((check) => check.category === 'text')).toBe(true);
    expect(report.checks.some((check) => check.category === 'interaction')).toBe(true);
    expect(report.checks.some((check) => check.category === 'focus')).toBe(true);
    expect(report.checks.some((check) => check.category === 'boundary')).toBe(true);
    expect(report.passed + report.failed + report.unresolved).toBe(report.total);
  });

  it('calculates exact ratios and evaluates semantic states independently', () => {
    const theme: AerisTheme = {
      ...AERIS_DEFAULT_THEME,
      light: {
        tones: {
          primary: {
            base: '#000000',
            hover: '#ffffff',
            active: '#000000',
            onBase: '#ffffff',
            onHover: '#ffffff',
            onActive: '#ffffff',
          },
        },
      },
    };

    const report = auditAerisThemeContrast(theme, 'light');
    const base = report.checks.find((check) => check.id === 'primary-base-content');
    const hover = report.checks.find((check) => check.id === 'primary-hover-content');

    expect(base?.ratio).toBe(21);
    expect(base?.status).toBe('pass');
    expect(hover?.ratio).toBe(1);
    expect(hover?.status).toBe('fail');
  });

  it('audits light and dark overrides without using the active document mode', () => {
    const theme: AerisTheme = {
      ...AERIS_DEFAULT_THEME,
      light: {
        tones: { warning: { base: '#ffffff', onBase: '#ffffff' } },
      },
      dark: {
        tones: { warning: { base: '#000000', onBase: '#ffffff' } },
      },
    };

    const light = auditAerisThemeContrast(theme, 'light');
    const dark = auditAerisThemeContrast(theme, 'dark');

    expect(light.checks.find((check) => check.id === 'warning-base-content')?.status).toBe('fail');
    expect(dark.checks.find((check) => check.id === 'warning-base-content')?.status).toBe('pass');
  });

  it('marks colors that cannot be resolved statically for review', () => {
    const theme: AerisTheme = {
      ...AERIS_DEFAULT_THEME,
      light: {
        text: 'var(--product-text)',
      },
    };

    const report = auditAerisThemeContrast(theme, 'light');
    const textCheck = report.checks.find((check) => check.id === 'text-surface');

    expect(textCheck?.ratio).toBeNull();
    expect(textCheck?.status).toBe('unresolved');
    expect(report.unresolved).toBeGreaterThan(0);
  });

  it('does not report an opaque ratio for translucent colors', () => {
    const theme: AerisTheme = {
      ...AERIS_DEFAULT_THEME,
      light: {
        text: 'rgb(0 0 0 / 50%)',
      },
    };

    const report = auditAerisThemeContrast(theme, 'light');
    const textCheck = report.checks.find((check) => check.id === 'text-surface');

    expect(textCheck?.ratio).toBeNull();
    expect(textCheck?.status).toBe('unresolved');
  });

  it('passes every check for each Aeris palette in light and dark modes', () => {
    for (const preset of Object.values(AERIS_THEME_PRESETS)) {
      const theme = resolvePresetTheme(preset);

      for (const mode of ['light', 'dark'] as const) {
        const report = auditAerisThemeContrast(theme, mode);
        const failures = report.checks
          .filter((check) => check.status === 'fail')
          .map((check) => `${check.id} (${check.ratio?.toFixed(2)} / ${check.requiredRatio})`)
          .join(', ');
        expect(report.failed, `${mode} ${preset.palette.primary}: ${failures}`).toBe(0);
        expect(report.unresolved, `${mode} ${preset.palette.primary}`).toBe(0);
        expect(report.score, `${mode} ${preset.palette.primary}`).toBe(100);
      }
    }
  });

  it('keeps generated light button foregrounds stable across interaction states', () => {
    for (const preset of Object.values(AERIS_THEME_PRESETS)) {
      const report = auditAerisThemeContrast(resolvePresetTheme(preset), 'light');

      for (const tone of ['primary', 'secondary'] as const) {
        const foregrounds = ['base', 'hover', 'active'].map(
          (state) =>
            report.checks.find((check) => check.id === `${tone}-${state}-content`)?.foreground,
        );

        expect(new Set(foregrounds).size, `${tone} ${preset.palette.primary}`).toBe(1);
      }
    }
  });

  it('gives monochrome action tones distinct accessible visual roles', () => {
    const theme = resolvePresetTheme(AERIS_THEME_PRESETS.monochrome);

    for (const mode of ['light', 'dark'] as const) {
      const report = auditAerisThemeContrast(theme, mode);
      const actionChecks = ['primary', 'secondary', 'contrast'].map((name) => ({
        name,
        fill: report.checks.find((check) => check.id === `${name}-base-content`)?.background,
        boundary: report.checks.find((check) => check.id === `${name}-boundary`)?.foreground,
      }));

      expect(new Set(actionChecks.map(({ fill }) => fill)).size, `${mode} fills`).toBe(3);
      expect(actionChecks.find(({ name }) => name === 'contrast')?.boundary).not.toBe(
        actionChecks.find(({ name }) => name === 'contrast')?.fill,
      );
      expect(report.failed, `${mode} monochrome action tones`).toBe(0);
    }
  });

  it('uses the Earth starter theme as the default palette', () => {
    expect(Object.keys(AERIS_THEME_PRESETS)).toEqual(['earth', 'coastal', 'orchid', 'monochrome']);
    expect(AERIS_DEFAULT_THEME.palette).toEqual(
      expect.objectContaining(AERIS_THEME_PRESETS.earth.palette),
    );
  });

  it('keeps foundation text neutral while allowing monochrome to increase contrast', () => {
    for (const mode of ['light', 'dark'] as const) {
      const foundations = Object.values(AERIS_THEME_PRESETS).map((preset) =>
        resolveAerisFoundation(resolvePresetTheme(preset), mode),
      );

      expect(new Set(foundations.map((foundation) => foundation.border)).size).toBe(4);
      expect(new Set(foundations.map((foundation) => foundation.borderStrong)).size).toBe(4);
      expect(new Set(foundations.slice(0, 3).map((foundation) => foundation.text)).size).toBe(1);
      expect(new Set(foundations.slice(0, 3).map((foundation) => foundation.text2)).size).toBe(1);
      expect(new Set(foundations.slice(0, 3).map((foundation) => foundation.text3)).size).toBe(1);

      for (const foundation of foundations) {
        expect(isAchromaticHex(foundation.text)).toBe(true);
        expect(isAchromaticHex(foundation.text2)).toBe(true);
        expect(isAchromaticHex(foundation.text3)).toBe(true);
      }
    }
  });

  it('keeps unchecked toggle boundaries visible in every preset and mode', () => {
    for (const preset of Object.values(AERIS_THEME_PRESETS)) {
      const theme = resolvePresetTheme(preset);

      for (const mode of ['light', 'dark'] as const) {
        const foundation = resolveAerisFoundation(theme, mode);
        const trackRatio = aerisContrastRatio(foundation.text3, foundation.surface3);
        const surfaceRatio = aerisContrastRatio(foundation.text3, foundation.surface);

        expect(trackRatio, `${mode} ${preset.palette.primary} track`).toBeGreaterThanOrEqual(3);
        expect(surfaceRatio, `${mode} ${preset.palette.primary} surface`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('keeps the generated dark foundation deep while retaining a surface hierarchy', () => {
    const foundation = resolveAerisFoundation(AERIS_DEFAULT_THEME, 'dark');
    const page = hexChannels(foundation.page);
    const surface = hexChannels(foundation.surface);
    const surface2 = hexChannels(foundation.surface2);
    const surface3 = hexChannels(foundation.surface3);

    expect(Math.max(...page)).toBeLessThan(20);
    expect(averageChannel(page)).toBeLessThan(averageChannel(surface));
    expect(averageChannel(surface)).toBeLessThan(averageChannel(surface2));
    expect(averageChannel(surface2)).toBeLessThan(averageChannel(surface3));
  });

  it('preserves explicit foundation overrides', () => {
    const foundation = resolveAerisFoundation(
      {
        ...AERIS_DEFAULT_THEME,
        light: {
          text: '#101010',
          border: '#123456',
          interactiveHover: '#eef2e8',
        },
      },
      'light',
    );

    expect(foundation.text).toBe('#101010');
    expect(foundation.border).toBe('#123456');
    expect(foundation.interactiveHover).toBe('#eef2e8');
  });
});

function isAchromaticHex(value: string): boolean {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value);
  return Boolean(match && match[1] === match[2] && match[2] === match[3]);
}

function hexChannels(value: string): readonly [number, number, number] {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value);
  if (!match) throw new Error(`Expected a six-digit hex color, received ${value}.`);
  return [
    Number.parseInt(match[1]!, 16),
    Number.parseInt(match[2]!, 16),
    Number.parseInt(match[3]!, 16),
  ];
}

function averageChannel(channels: readonly number[]): number {
  return channels.reduce((total, channel) => total + channel, 0) / channels.length;
}

function resolvePresetTheme(preset: AerisThemePreset): AerisTheme {
  return {
    ...AERIS_DEFAULT_THEME,
    ...preset,
    palette: { ...AERIS_DEFAULT_THEME.palette, ...preset.palette },
    light: {
      ...AERIS_DEFAULT_THEME.light,
      ...preset.light,
      tones: { ...AERIS_DEFAULT_THEME.light.tones, ...preset.light?.tones },
    },
    dark: {
      ...AERIS_DEFAULT_THEME.dark,
      ...preset.dark,
      tones: { ...AERIS_DEFAULT_THEME.dark.tones, ...preset.dark?.tones },
    },
    densities: { ...AERIS_DEFAULT_THEME.densities, ...preset.densities },
    radii: { ...AERIS_DEFAULT_THEME.radii, ...preset.radii },
  };
}
