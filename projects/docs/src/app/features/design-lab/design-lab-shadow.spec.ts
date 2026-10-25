import { parseLabShadow, serializeLabShadow } from './design-lab-shadow';

describe('Design Lab shadow controls', () => {
  it.each(['0 2px 8px rgb(0 0 0 / 14%)', 'rgba(0, 0, 0, 0.14) 0px 2px 8px 0px'])(
    'preserves the alpha of %s',
    (value) => {
      const shadow = parseLabShadow(value);
      expect(shadow).toEqual({
        x: 0,
        y: 2,
        blur: 8,
        spread: 0,
        color: '#000000',
        opacity: 0.14,
        inset: false,
      });
      if (!shadow) throw new Error('Expected an editable shadow.');
      expect(parseLabShadow(serializeLabShadow(shadow))).toEqual(shadow);
    },
  );
  it('supports negative offsets/spread, inset and a colored translucent shadow', () => {
    const shadow = parseLabShadow('inset -2px 3.5px 12px -1px #ff000080');
    expect(shadow).toMatchObject({
      x: -2,
      y: 3.5,
      blur: 12,
      spread: -1,
      color: '#ff0000',
      inset: true,
    });
    expect(shadow?.opacity).toBeCloseTo(128 / 255);
  });
  it.each([
    'none',
    'var(--my-shadow)',
    '0 1rem 2rem #000',
    '0 1px 2px #000, 0 2px 5px #fff',
    '0 0 -2px black',
    'inset inset 0 0 black',
  ])('keeps unsupported expressions intact: %s', (value) => {
    expect(parseLabShadow(value)).toBeNull();
  });
});
