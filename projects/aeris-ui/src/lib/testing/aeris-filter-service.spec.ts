import { TestBed } from '@angular/core/testing';

import {
  AERIS_FILTER_MODES,
  AerisFilterService,
  type AerisFilterConstraint,
} from '../../../filter-service/aeris-filter-service';

interface Product {
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly supplier: {
    readonly country: string;
  };
}

describe('AerisFilterService', () => {
  let service: AerisFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AerisFilterService);
  });

  it('provides all documented built-in constraints', () => {
    expect(AERIS_FILTER_MODES).toHaveLength(15);
    expect(AERIS_FILTER_MODES.every((mode) => service.has(mode))).toBe(true);
    expect(service.constraints().size).toBe(AERIS_FILTER_MODES.length);
  });

  it('matches text without case or accent sensitivity', () => {
    expect(service.matches('Crème brûlée', 'CREME', 'starts-with', 'fr')).toBe(true);
    expect(service.matches('Crème brûlée', 'brulee', 'ends-with', 'fr')).toBe(true);
    expect(service.matches('Crème brûlée', 'ME BRU', 'contains', 'fr')).toBe(true);
    expect(service.matches('Crème brûlée', 'coffee', 'not-contains', 'fr')).toBe(true);
    expect(service.matches(null, 'coffee', 'not-contains', 'fr')).toBe(false);
    expect(service.matches(null, 'creme', 'contains')).toBe(false);
  });

  it('supports equality aliases and membership constraints', () => {
    expect(service.matches('ACTIVE', 'active', 'equals')).toBe(true);
    expect(service.matches('ACTIVE', 'active', 'is')).toBe(true);
    expect(service.matches('active', 'archived', 'not-equals')).toBe(true);
    expect(service.matches('active', 'archived', 'is-not')).toBe(true);
    expect(service.matches('active', ['draft', 'active'], 'one-of')).toBe(true);
    expect(service.matches('active', 'active', 'one-of')).toBe(false);
  });

  it('compares finite numbers, bigints, strings, and dates', () => {
    expect(service.matches(8, 10, 'less-than')).toBe(true);
    expect(service.matches(10, 10, 'less-than-or-equal')).toBe(true);
    expect(service.matches(11n, 10n, 'greater-than')).toBe(true);
    expect(service.matches('chapter 12', 'chapter 9', 'greater-than')).toBe(true);
    expect(service.matches(new Date('2026-01-01'), '2026-02-01', 'before')).toBe(true);
    expect(service.matches('2026-03-01', new Date('2026-02-01'), 'after')).toBe(true);
    expect(service.matches(Number.NaN, 10, 'less-than')).toBe(false);
    expect(service.matches('not-a-date', '2026-01-01', 'before')).toBe(false);
  });

  it('filters across fields with OR matching by default without mutating the source', () => {
    const products: readonly Product[] = [
      {
        name: 'Desk lamp',
        category: 'Lighting',
        price: 68,
        supplier: { country: 'Denmark' },
      },
      {
        name: 'Wool throw',
        category: 'Textiles',
        price: 120,
        supplier: { country: 'Iceland' },
      },
      {
        name: 'Pendant light',
        category: 'Lighting',
        price: 210,
        supplier: { country: 'Sweden' },
      },
    ];

    const filtered = service.filter(products, {
      query: 'light',
      fields: ['name', 'category'],
    });

    expect(filtered.map((product) => product.name)).toEqual(['Desk lamp', 'Pendant light']);
    expect(filtered).not.toBe(products);
    expect(products).toHaveLength(3);
  });

  it('supports nested paths, selector functions, and AND field matching', () => {
    const products: readonly Product[] = [
      {
        name: 'Danish lamp',
        category: 'Lighting',
        price: 68,
        supplier: { country: 'Denmark' },
      },
      {
        name: 'Danish throw',
        category: 'Textiles',
        price: 120,
        supplier: { country: 'Denmark' },
      },
    ];

    expect(
      service.filter(products, {
        query: 'denmark',
        fields: ['supplier.country', (product) => product.name.replace('Danish', 'Denmark')],
        fieldOperator: 'and',
      }),
    ).toHaveLength(2);
    expect(
      service
        .filter(products, {
          query: 100,
          fields: [(product) => product.price],
          mode: 'greater-than',
        })
        .map((product) => product.name),
    ).toEqual(['Danish throw']);
  });

  it('matches the item itself when fields are omitted', () => {
    expect(service.filter(['Calm', 'Bright', 'Clear'], { query: 'br' })).toEqual(['Bright']);
  });

  it('returns a shallow copy for an empty query and no matches for an unknown mode', () => {
    const values = ['one', 'two'] as const;
    const unfiltered = service.filter(values, { query: '   ' });

    expect(unfiltered).toEqual(values);
    expect(unfiltered).not.toBe(values);
    expect(service.filter(values, { query: 'o', mode: 'missing-mode' })).toEqual([]);
    expect(service.matches('one', 'o', 'missing-mode')).toBe(false);
  });

  it('registers custom constraints and restores a previous constraint on dispose', () => {
    const builtInContains = service.constraints().get('contains');
    const even: AerisFilterConstraint = (value) => typeof value === 'number' && value % 2 === 0;
    const disposeEven = service.register('even', even);

    expect(service.matches(4, null, 'even')).toBe(true);
    expect(service.filter([1, 2, 3, 4], { query: true, mode: 'even' })).toEqual([2, 4]);

    const disposeOverride = service.register('contains', () => false);
    expect(service.matches('Aeris', 'aeris', 'contains')).toBe(false);
    disposeOverride();
    expect(service.constraints().get('contains')).toBe(builtInContains);

    disposeEven();
    disposeEven();
    expect(service.has('even')).toBe(false);
  });

  it('unregisters custom constraints and restores overridden built-ins', () => {
    service.register('always', () => true);
    expect(service.unregister('always')).toBe(true);
    expect(service.unregister('always')).toBe(false);

    service.register('equals', () => false);
    expect(service.unregister('equals')).toBe(true);
    expect(service.matches('same', 'SAME', 'equals')).toBe(true);
    expect(service.unregister('equals')).toBe(false);
  });

  it('disposes overlapping registrations safely in any order', () => {
    const disposeFirst = service.register('shared', () => true);
    const disposeSecond = service.register('shared', () => false);

    disposeFirst();
    expect(service.matches('value', 'query', 'shared')).toBe(false);
    disposeSecond();
    expect(service.has('shared')).toBe(false);
  });

  it('normalizes names and returns stable sorted discovery data', () => {
    service.register('  Ends-On-Odd  ', (value) => typeof value === 'number' && value % 2 !== 0);

    expect(service.has('ends-on-odd')).toBe(true);
    expect(service.constraintNames()).toEqual([...service.constraintNames()].sort());
  });

  it('does not traverse prototype paths and contains failing user callbacks', () => {
    const dangerous = Object.create({ inherited: 'hidden' }) as {
      inherited?: string;
      safe: string;
      broken?: string;
    };
    dangerous.safe = 'visible';
    Object.defineProperty(dangerous, 'broken', {
      enumerable: true,
      get: () => {
        throw new Error('Getter failure');
      },
    });

    expect(service.filter([dangerous], { query: 'hidden', fields: ['inherited'] })).toEqual([]);
    expect(service.filter([dangerous], { query: 'value', fields: ['__proto__.value'] })).toEqual(
      [],
    );
    expect(service.filter([dangerous], { query: 'failure', fields: ['broken'] })).toEqual([]);
    expect(
      service.filter([dangerous], {
        query: 'failure',
        fields: [
          () => {
            throw new Error('Selector failure');
          },
        ],
      }),
    ).toEqual([]);

    service.register('throws', () => {
      throw new Error('Constraint failure');
    });
    expect(service.matches('value', 'value', 'throws')).toBe(false);
  });
});
