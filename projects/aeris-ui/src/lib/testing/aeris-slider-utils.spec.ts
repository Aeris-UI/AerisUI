import { describe, expect, it } from 'vitest';

import {
  alignSliderValue,
  normalizeSliderRange,
  sliderPercentage,
} from '../../../slider/aeris-slider.utils';

describe('Aeris Slider utilities', () => {
  it('aligns values to steps and constraints', () => {
    expect(alignSliderValue(4.26, 0, 10, 0.5)).toBe(4.5);
    expect(alignSliderValue(-4, 0, 10, 1)).toBe(0);
    expect(alignSliderValue(14, 0, 10, 1)).toBe(10);
  });

  it('normalizes ordered ranges and minimum gaps', () => {
    expect(normalizeSliderRange([8, 2], 0, 10, 1, 0)).toEqual([2, 8]);
    expect(normalizeSliderRange([4, 5], 0, 10, 1, 3)).toEqual([4, 7]);
  });

  it('calculates bounded percentages', () => {
    expect(sliderPercentage(25, 0, 100)).toBe(25);
    expect(sliderPercentage(200, 0, 100)).toBe(100);
  });
});

