import { describe, expect, it } from 'vitest';

import type { AerisSelectOption } from '../../../select/aeris-select';
import {
  boundarySelectValue,
  filterSelectOptions,
  groupSelectOptions,
  nextEnabledSelectValue,
  selectVirtualRange,
} from '../aeris-select-model';

const options: readonly AerisSelectOption[] = [
  { label: 'Product designer', value: 'designer', group: 'Product' },
  {
    label: 'Quality engineer',
    value: 'quality',
    disabled: true,
    group: 'Engineering',
  },
  {
    label: 'Software engineer',
    value: 'engineer',
    group: 'Engineering',
  },
];

describe('Aeris Select utilities', () => {
  it('filters and groups options without mutating the source', () => {
    const filtered = filterSelectOptions(options, 'engineer', ['label'], 'contains');
    const groups = groupSelectOptions(options);

    expect(filtered.map((option) => option.value)).toEqual(['quality', 'engineer']);
    expect(groups.map((group) => group.label)).toEqual(['Product', 'Engineering']);
    expect(options).toHaveLength(3);
  });

  it('calculates a bounded virtual range', () => {
    expect(selectVirtualRange(500, 20, '18rem', 40, 4)).toEqual({
      start: 20,
      end: 36,
      topPadding: 800,
      bottomPadding: 18560,
    });
  });

  it('navigates enabled options and boundaries', () => {
    expect(nextEnabledSelectValue(options, 'designer', 1)).toBe('engineer');
    expect(nextEnabledSelectValue(options, 'designer', -1)).toBe('engineer');
    expect(boundarySelectValue(options, 'start')).toBe('designer');
    expect(boundarySelectValue(options, 'end')).toBe('engineer');
  });
});
