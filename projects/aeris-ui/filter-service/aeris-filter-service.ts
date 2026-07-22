import { Service, signal } from '@angular/core';

export const AERIS_FILTER_MODES = [
  'starts-with',
  'contains',
  'not-contains',
  'ends-with',
  'equals',
  'not-equals',
  'is',
  'is-not',
  'one-of',
  'less-than',
  'less-than-or-equal',
  'greater-than',
  'greater-than-or-equal',
  'before',
  'after',
] as const;

export type AerisBuiltInFilterMode = (typeof AERIS_FILTER_MODES)[number];
export type AerisFilterMode = AerisBuiltInFilterMode | string;
export type AerisFilterLocale = string | readonly string[];
export type AerisFilterField<T> = string | ((item: T) => unknown);
export type AerisFilterFieldOperator = 'or' | 'and';

export interface AerisFilterContext {
  readonly mode: string;
  readonly locale?: AerisFilterLocale;
}

export type AerisFilterConstraint = (
  value: unknown,
  filter: unknown,
  context: AerisFilterContext,
) => boolean;

export interface AerisFilterOptions<T> {
  readonly query: unknown;
  readonly fields?: readonly AerisFilterField<T>[];
  readonly mode?: AerisFilterMode;
  readonly locale?: AerisFilterLocale;
  readonly fieldOperator?: AerisFilterFieldOperator;
}

const BLOCKED_PATH_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);

@Service()
export class AerisFilterService {
  private readonly builtIns = new Map<string, AerisFilterConstraint>([
    ['starts-with', (value, filter, context) => this.textMatch(value, filter, context, 'start')],
    ['contains', (value, filter, context) => this.textMatch(value, filter, context, 'anywhere')],
    [
      'not-contains',
      (value, filter, context) =>
        this.isEmptyFilter(filter) ||
        (value !== null &&
          value !== undefined &&
          !this.textMatch(value, filter, context, 'anywhere')),
    ],
    ['ends-with', (value, filter, context) => this.textMatch(value, filter, context, 'end')],
    ['equals', (value, filter, context) => this.equals(value, filter, context)],
    ['not-equals', (value, filter, context) => this.notEquals(value, filter, context)],
    ['is', (value, filter, context) => this.equals(value, filter, context)],
    ['is-not', (value, filter, context) => this.notEquals(value, filter, context)],
    ['one-of', (value, filter, context) => this.oneOf(value, filter, context)],
    ['less-than', (value, filter, context) => this.comparison(value, filter, context, 'lt')],
    [
      'less-than-or-equal',
      (value, filter, context) => this.comparison(value, filter, context, 'lte'),
    ],
    ['greater-than', (value, filter, context) => this.comparison(value, filter, context, 'gt')],
    [
      'greater-than-or-equal',
      (value, filter, context) => this.comparison(value, filter, context, 'gte'),
    ],
    ['before', (value, filter) => this.dateComparison(value, filter, 'before')],
    ['after', (value, filter) => this.dateComparison(value, filter, 'after')],
  ]);
  private readonly registry = signal<ReadonlyMap<string, AerisFilterConstraint>>(
    new Map(this.builtIns),
  );
  private readonly customRegistrations = new Map<
    string,
    { readonly token: symbol; readonly constraint: AerisFilterConstraint }[]
  >();

  readonly constraints = this.registry.asReadonly();

  filter<T>(values: readonly T[], options: AerisFilterOptions<T>): T[] {
    if (this.isEmptyFilter(options.query)) return [...values];

    const mode = this.normalizeName(options.mode ?? 'contains');
    const constraint = this.registry().get(mode);
    if (!constraint) return [];

    const context = { mode, locale: options.locale } satisfies AerisFilterContext;
    const fields = options.fields?.filter((field) =>
      typeof field === 'function' ? true : field.trim().length > 0,
    );
    const operator = options.fieldOperator ?? 'or';

    return values.filter((item) => {
      if (!fields?.length) return this.applyConstraint(constraint, item, options.query, context);

      const results = fields.map((field) =>
        this.applyConstraint(constraint, this.resolveField(item, field), options.query, context),
      );
      return operator === 'and' ? results.every(Boolean) : results.some(Boolean);
    });
  }

  matches(
    value: unknown,
    filter: unknown,
    mode: AerisFilterMode = 'contains',
    locale?: AerisFilterLocale,
  ): boolean {
    const normalizedMode = this.normalizeName(mode);
    const constraint = this.registry().get(normalizedMode);
    if (!constraint) return false;
    return this.applyConstraint(constraint, value, filter, {
      mode: normalizedMode,
      locale,
    });
  }

  register(name: string, constraint: AerisFilterConstraint): () => void {
    const normalizedName = this.normalizeName(name);
    if (!normalizedName) throw new TypeError('Filter constraint names must not be empty.');

    const token = Symbol(normalizedName);
    const registrations = this.customRegistrations.get(normalizedName) ?? [];
    registrations.push({ token, constraint });
    this.customRegistrations.set(normalizedName, registrations);
    this.syncConstraint(normalizedName);
    let registered = true;

    return () => {
      if (!registered) return;
      registered = false;
      const current = this.customRegistrations.get(normalizedName);
      if (!current) return;
      const next = current.filter((registration) => registration.token !== token);
      if (next.length) this.customRegistrations.set(normalizedName, next);
      else this.customRegistrations.delete(normalizedName);
      this.syncConstraint(normalizedName);
    };
  }

  unregister(name: string): boolean {
    const normalizedName = this.normalizeName(name);
    if (!this.customRegistrations.has(normalizedName)) return false;
    this.customRegistrations.delete(normalizedName);
    this.syncConstraint(normalizedName);
    return true;
  }

  has(name: string): boolean {
    return this.registry().has(this.normalizeName(name));
  }

  constraintNames(): readonly string[] {
    return [...this.registry().keys()].sort((left, right) => left.localeCompare(right));
  }

  private textMatch(
    value: unknown,
    filter: unknown,
    context: AerisFilterContext,
    position: 'start' | 'anywhere' | 'end',
  ): boolean {
    if (this.isEmptyFilter(filter)) return true;
    if (value === null || value === undefined) return false;

    const candidate = this.normalizeText(value, context.locale);
    const query = this.normalizeText(filter, context.locale);
    if (candidate === null || query === null) return false;
    if (position === 'start') return candidate.startsWith(query);
    if (position === 'end') return candidate.endsWith(query);
    return candidate.includes(query);
  }

  private equals(value: unknown, filter: unknown, context: AerisFilterContext): boolean {
    if (this.isEmptyFilter(filter)) return true;
    return this.equalValues(value, filter, context.locale);
  }

  private notEquals(value: unknown, filter: unknown, context: AerisFilterContext): boolean {
    if (this.isEmptyFilter(filter)) return true;
    return !this.equalValues(value, filter, context.locale);
  }

  private oneOf(value: unknown, filter: unknown, context: AerisFilterContext): boolean {
    if (!Array.isArray(filter)) return false;
    if (filter.length === 0) return true;
    return filter.some((candidate) => this.equalValues(value, candidate, context.locale));
  }

  private equalValues(value: unknown, filter: unknown, locale?: AerisFilterLocale): boolean {
    if (value instanceof Date || filter instanceof Date) {
      const valueTime = this.dateValue(value);
      const filterTime = this.dateValue(filter);
      return valueTime !== null && filterTime !== null && valueTime === filterTime;
    }
    if (typeof value === 'string' && typeof filter === 'string') {
      return this.normalizeText(value, locale) === this.normalizeText(filter, locale);
    }
    return Object.is(value, filter);
  }

  private comparison(
    value: unknown,
    filter: unknown,
    context: AerisFilterContext,
    operator: 'lt' | 'lte' | 'gt' | 'gte',
  ): boolean {
    if (this.isEmptyFilter(filter)) return true;
    const comparison = this.compareValues(value, filter, context.locale);
    if (comparison === null) return false;
    if (operator === 'lt') return comparison < 0;
    if (operator === 'lte') return comparison <= 0;
    if (operator === 'gt') return comparison > 0;
    return comparison >= 0;
  }

  private compareValues(
    value: unknown,
    filter: unknown,
    locale?: AerisFilterLocale,
  ): number | null {
    if (value instanceof Date || filter instanceof Date) {
      const left = this.dateValue(value);
      const right = this.dateValue(filter);
      return left === null || right === null ? null : Math.sign(left - right);
    }
    if (typeof value === 'number' && typeof filter === 'number') {
      return Number.isFinite(value) && Number.isFinite(filter) ? Math.sign(value - filter) : null;
    }
    if (typeof value === 'bigint' && typeof filter === 'bigint') {
      return value === filter ? 0 : value < filter ? -1 : 1;
    }
    if (typeof value === 'string' && typeof filter === 'string') {
      try {
        return new Intl.Collator(this.localeArgument(locale), {
          numeric: true,
          sensitivity: 'base',
        }).compare(value, filter);
      } catch {
        return value.localeCompare(filter);
      }
    }
    return null;
  }

  private dateComparison(value: unknown, filter: unknown, operator: 'before' | 'after'): boolean {
    if (this.isEmptyFilter(filter)) return true;
    const valueTime = this.dateValue(value);
    const filterTime = this.dateValue(filter);
    if (valueTime === null || filterTime === null) return false;
    return operator === 'before' ? valueTime < filterTime : valueTime > filterTime;
  }

  private dateValue(value: unknown): number | null {
    if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
      return null;
    }
    const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isFinite(time) ? time : null;
  }

  private normalizeText(value: unknown, locale?: AerisFilterLocale): string | null {
    try {
      const text = String(value).normalize('NFKD').replace(/\p{M}/gu, '');
      try {
        return text.toLocaleLowerCase(this.localeArgument(locale));
      } catch {
        return text.toLowerCase();
      }
    } catch {
      return null;
    }
  }

  private localeArgument(locale?: AerisFilterLocale): string | string[] | undefined {
    return Array.isArray(locale) ? [...locale] : (locale as string | undefined);
  }

  private resolveField<T>(item: T, field: AerisFilterField<T>): unknown {
    if (typeof field === 'function') {
      try {
        return field(item);
      } catch {
        return undefined;
      }
    }

    let current: unknown = item;
    for (const segment of field.split('.')) {
      if (!segment || BLOCKED_PATH_SEGMENTS.has(segment)) return undefined;
      if ((typeof current !== 'object' && typeof current !== 'function') || current === null) {
        return undefined;
      }
      if (!Object.prototype.hasOwnProperty.call(current, segment)) return undefined;
      try {
        current = (current as Record<string, unknown>)[segment];
      } catch {
        return undefined;
      }
    }
    return current;
  }

  private applyConstraint(
    constraint: AerisFilterConstraint,
    value: unknown,
    filter: unknown,
    context: AerisFilterContext,
  ): boolean {
    try {
      return Boolean(constraint(value, filter, context));
    } catch {
      return false;
    }
  }

  private updateRegistry(
    update: (registry: Map<string, AerisFilterConstraint>) => Map<string, AerisFilterConstraint>,
  ): void {
    this.registry.update((current) => new Map(update(new Map(current))));
  }

  private syncConstraint(name: string): void {
    const registrations = this.customRegistrations.get(name);
    const constraint = registrations?.at(-1)?.constraint ?? this.builtIns.get(name);
    this.updateRegistry((registry) => {
      if (constraint) registry.set(name, constraint);
      else registry.delete(name);
      return registry;
    });
  }

  private isEmptyFilter(value: unknown): boolean {
    return value === null || value === undefined || (typeof value === 'string' && !value.trim());
  }

  private normalizeName(value: string): string {
    return value.trim().toLocaleLowerCase();
  }
}
