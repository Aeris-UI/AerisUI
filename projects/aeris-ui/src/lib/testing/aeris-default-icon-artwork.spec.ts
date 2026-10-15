import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  template: '',
  styleUrl: '../../styles/aeris.css',
  encapsulation: ViewEncapsulation.None,
})
class DefaultArtworkHost {}

function artwork(name: string): SVGSVGElement {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--aeris-icon-${name}`)
    .trim();
  const data = /^url\(['"]?data:image\/svg\+xml,(.*?)['"]?\)$/s.exec(value)?.[1];
  expect(data, `${name} must have bundled SVG artwork`).toBeTruthy();
  // The compiler may serialize a data URL without quotes and escape its spaces.
  const markup = decodeURIComponent(data ?? '').replace(/\\([^\r\n])/g, '$1');
  const svg = new DOMParser().parseFromString(markup, 'image/svg+xml');
  expect(svg.querySelector('parsererror'), markup).toBeNull();
  return svg.documentElement as unknown as SVGSVGElement;
}

describe('Aeris default icon artwork', () => {
  beforeEach(async () => {
    const fixture = TestBed.createComponent(DefaultArtworkHost);
    await fixture.whenStable();
  });

  it('uses the same 24-unit geometry and rounded 2-unit stroke for shared glyphs', () => {
    for (const name of [
      'calendar',
      'check',
      'minus',
      'eye',
      'eye-off',
      'copy',
      'chevron-right',
      'chevron',
      'close',
      'search',
      'plus',
      'upload',
      'eyedropper',
      'edit',
    ]) {
      const svg = artwork(name);
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg.getAttribute('fill')).toBe('none');
      expect(svg.getAttribute('stroke-width')).toBe('2');
      expect(svg.getAttribute('stroke-linecap')).toBe('round');
      expect(svg.getAttribute('stroke-linejoin')).toBe('round');
      expect(svg.querySelector('script, foreignObject, image, use')).toBeNull();
    }
  });

  it('preserves the copied calendar geometry, including its full-size frame and bindings', () => {
    const svg = artwork('calendar');
    expect(Array.from(svg.querySelectorAll('path'), (path) => path.getAttribute('d'))).toEqual([
      'M8 2v3',
      'M16 2v3',
      'M3 9h18',
    ]);
    const frame = svg.querySelector('rect');
    expect(frame?.getAttribute('x')).toBe('3');
    expect(frame?.getAttribute('y')).toBe('3');
    expect(frame?.getAttribute('width')).toBe('18');
    expect(frame?.getAttribute('height')).toBe('18');
    expect(frame?.getAttribute('rx')).toBe('2');
  });

  it('keeps chevrons, close, check, and plus on their exact SVG paths', () => {
    const paths: Readonly<Record<string, readonly string[]>> = {
      chevron: ['m6 9 6 6 6-6'],
      'chevron-right': ['m9 18 6-6-6-6'],
      close: ['M18 6 6 18', 'm6 6 12 12'],
      check: ['M20 6 9 17l-5-5'],
      plus: ['M5 12h14', 'M12 5v14'],
    };
    for (const [name, expected] of Object.entries(paths)) {
      expect(
        Array.from(artwork(name).querySelectorAll('path'), (path) => path.getAttribute('d')),
      ).toEqual(expected);
    }
  });
});
