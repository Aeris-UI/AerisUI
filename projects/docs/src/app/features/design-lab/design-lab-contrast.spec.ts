import {
  auditAerisThemeContrast,
  resolveAerisTheme,
  resolveAerisThemeScheme,
  resolveAerisThemeTokens,
} from '@aeris-ui/core/theming';
import { labContrastColor } from './design-lab-contrast';

describe('Design Lab contrast tracing', () => {
  it.each(['monochrome', 'earth', 'coastal', 'orchid'] as const)(
    'traces every measured color to the actual %s CSS token in both schemes',
    (preset) => {
      for (const mode of ['light', 'dark'] as const) {
        const theme = resolveAerisTheme({ preset });
        const scheme = resolveAerisThemeScheme(theme, mode);
        const tokens = resolveAerisThemeTokens(theme, mode);
        for (const check of auditAerisThemeContrast(theme, mode).checks) {
          for (const [property, value, role] of [
            [check.foregroundProperty, check.foreground, 'Foreground'],
            [check.backgroundProperty, check.background, 'Background'],
          ] as const) {
            const color = labContrastColor(theme, mode, scheme, property, value, role);
            expect(tokens[color.token], `${mode}.${property}`).toBe(value);
            expect(color.path).toBe(`${mode}.${property}`);
            expect(color.source).not.toBe('Override');
          }
        }
      }
    },
  );

  it('distinguishes explicit values, whole-tone Auto, field Auto, and inherited derivation', () => {
    const theme = resolveAerisTheme({
      palette: { primary: '#123456' },
      light: {
        text: 'var(--app-text)',
        tones: {
          primary: { onBase: '#ffffff', hover: null },
          warning: null,
        },
      },
    });
    const resolved = resolveAerisThemeScheme(theme, 'light');
    const source = (property: Parameters<typeof labContrastColor>[3]) =>
      labContrastColor(theme, 'light', resolved, property, '#ffffff', 'Foreground').source;
    expect(source('text')).toBe('Override');
    expect(source('tones.primary.onBase')).toBe('Override');
    expect(source('tones.primary.hover')).toBe('Automatic');
    expect(source('tones.warning.onBase')).toBe('Automatic');
    expect(source('tones.primary.base')).toBe('Derived');
    expect(source('surface')).toBe('Starter value');
    expect(
      labContrastColor(
        theme,
        'dark',
        resolveAerisThemeScheme(theme, 'dark'),
        'text',
        '#fff',
        'Foreground',
      ).source,
    ).not.toBe('Override');
  });
});
