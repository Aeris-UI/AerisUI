import { resolveAerisTheme } from '@aeris-ui/core/theming';
import {
  LAB_JSON_LIMIT,
  labThemeCode,
  labThemeDocument,
  labThemeOverride,
  parseLabThemeDocument,
} from './design-lab-theme';

describe('Design Lab theme documents', () => {
  it('round-trips palette, both schemes, automatic tones, custom scales, direction, and mode', () => {
    const theme = resolveAerisTheme({
      preset: 'coastal',
      palette: { primary: '#123456' },
      direction: 'rtl',
      light: { page: '#fafafa', tones: { primary: { onBase: '#ffffff', hover: null } } },
      dark: { text: '#eeeeee', tones: { danger: null } },
      density: 'product',
      densities: { product: { controlHeight: '2.75rem' } },
      radius: 'product',
      radii: { product: { control: '0.4rem' } },
    });
    const result = parseLabThemeDocument(JSON.stringify(labThemeDocument(theme, 'dark')));
    expect(result.mode).toBe('dark');
    expect(resolveAerisTheme(result.theme)).toEqual(theme);
    expect(result.theme.palette).toEqual({ primary: '#123456' });
    expect(result.theme.densities).toEqual({ product: { controlHeight: '2.75rem' } });
    expect(result.theme.radii).toEqual({ product: { control: '0.4rem' } });
  });

  it('accepts plain overrides and keeps deliberate low-contrast choices', () => {
    const document = parseLabThemeDocument(
      JSON.stringify({ light: { page: '#ffffff', text: '#ffffff' } }),
    );
    expect(document.mode).toBe('system');
    expect(document.theme.light?.text).toBe('#ffffff');
  });

  it('drops empty overrides without dropping explicit automatic values', () => {
    const result = labThemeOverride(
      resolveAerisTheme({ light: { tones: { primary: {} } }, dark: { tones: { warning: null } } }),
    );
    expect(result.light).toBeUndefined();
    expect(result.dark?.tones?.warning).toBeNull();
  });

  it.each([
    'export const theme = {}',
    'null',
    '[]',
    '{"preset":["coastal"]}',
    '{"preset":"missing"}',
    '{"palette":null}',
    '{"palette":{"primary":42}}',
    '{"light":{"tones":{"primary":{"base":false}}}}',
    '{"light":{"primary":"#000000"}}',
    '{"dark":{"tones":{"neutral":null}}}',
    '{"density":"missing"}',
    '{"radius":"constructor"}',
    '{"densities":{"__proto__":{"gap":"0"}}}',
    '{"__proto__":{"polluted":true}}',
    '{"light":{"constructor":{}}}',
    '{"version":2,"mode":"light","theme":{}}',
    '{"version":1,"mode":"unknown","theme":{}}',
    '{"version":1,"mode":"light","theme":{},"script":"alert(1)"}',
  ])('rejects malformed or unsupported input: %s', (source) => {
    expect(() => parseLabThemeDocument(source)).toThrow();
    expect(Object.hasOwn(Object.prototype, 'polluted')).toBe(false);
  });

  it.each([
    'red; color: blue',
    'url(https://example.com/image)',
    'image-set("https://example.com/image" 1x)',
    'red\nblue',
    '{color:red}',
    'u\\72l(https://example.com)',
  ])('rejects unsafe CSS values: %s', (color) => {
    expect(() => parseLabThemeDocument(JSON.stringify({ palette: { surface: color } }))).toThrow();
  });

  it('rejects oversized documents before parsing', () => {
    expect(() => parseLabThemeDocument(' '.repeat(LAB_JSON_LIMIT + 1))).toThrow('64 KiB');
  });

  it('quotes custom scale keys and escapes string literals in TypeScript exports', () => {
    const code = labThemeCode({
      radius: 'product-round',
      radii: { 'product-round': { control: "var(--radius, 'small')" } },
    });
    expect(code).toContain('"product-round":');
    expect(code).toContain("control: 'var(--radius, \\'small\\')'");
  });
});
