import {
  aerisContrastRatio,
  formatAerisHex,
  mixAerisColor,
  mixAerisRgb,
  parseAerisColor,
} from '../../../theme-builder/aeris-color';

describe('Aeris color derivation', () => {
  it('interpolates neutral colors by perceptual lightness', () => {
    expect(mixAerisColor('#000000', '#ffffff', 0.5)).toBe('#636363');
    expect(mixAerisColor('#000000', '#ffffff', 0.5)).not.toBe('#808080');
  });

  it('preserves endpoints and clamps out-of-range weights', () => {
    expect(mixAerisColor('#123456', '#abcdef', 0)).toBe('#123456');
    expect(mixAerisColor('#123456', '#abcdef', 1)).toBe('#abcdef');
    expect(mixAerisColor('#123456', '#abcdef', -1)).toBe('#123456');
    expect(mixAerisColor('#123456', '#abcdef', 2)).toBe('#abcdef');
  });

  it('gamut-maps saturated perceptual mixes to stable sRGB colors', () => {
    const mixed = mixAerisColor('#ff0000', '#0000ff', 0.5);

    expect(mixed).toMatch(/^#[\da-f]{6}$/);
    expect(mixed).not.toBe('#800080');
    expect(parseAerisColor(mixed)).not.toBeNull();
  });

  it('does not turn residual neutral chroma into an abrupt palette tint', () => {
    expect(mixAerisColor('#090b0f', '#e8dfe0', 0.004)).toBe('#0c0c0c');
  });

  it('uses the same perceptual path for RGB contrast corrections', () => {
    const black = parseAerisColor('#000000')!;
    const white = parseAerisColor('#ffffff')!;
    const mixed = mixAerisRgb(black, white, 0.5);

    expect(formatAerisHex(mixed)).toBe('#636363');
    expect(aerisContrastRatio(formatAerisHex(mixed), '#ffffff')).toBeGreaterThan(5);
  });

  it('keeps unresolved CSS colors perceptual in the browser fallback', () => {
    expect(mixAerisColor('var(--brand)', '#ffffff', 0.25)).toBe(
      'color-mix(in oklch, var(--brand) 75%, #ffffff)',
    );
  });
});
