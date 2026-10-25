import { describe, expect, it } from 'vitest';
import {
  aerisInternalLocalDate,
  aerisInternalDateAtMidnight,
  aerisInternalReadDate,
  aerisInternalReadTime,
  aerisInternalDaysInMonth,
  aerisInternalResolveDateDraft,
  aerisInternalResolveTimeDraft,
  aerisInternalFormatDateParts,
  aerisInternalFormatTimeParts,
  aerisInternalParseDateParts,
  aerisInternalParseTimeParts,
  aerisInternalDateFromParts,
  aerisInternalToTwelveHour,
  aerisInternalFromTwelveHour,
  aerisInternalCalendarDayIndex,
  aerisInternalDateTimeLayout,
  aerisInternalLocaleFirstDay,
} from '../aeris-date-time';

describe('Shared date/time foundation', () => {
  it('resolves locale week starts with the current Intl API', () => {
    expect(aerisInternalLocaleFirstDay('en-US')).toBe(0);
    expect(aerisInternalLocaleFirstDay('en-GB')).toBe(1);
    expect(aerisInternalLocaleFirstDay('ar-EG')).toBe(6);
    expect(aerisInternalLocaleFirstDay('not_a_locale')).toBe(0);
  });

  it('supports engines with only the legacy weekInfo getter', () => {
    const prototype = Intl.Locale.prototype;
    const method = Object.getOwnPropertyDescriptor(prototype, 'getWeekInfo');
    const getter = Object.getOwnPropertyDescriptor(prototype, 'weekInfo');
    try {
      Object.defineProperty(prototype, 'getWeekInfo', { configurable: true, value: undefined });
      Object.defineProperty(prototype, 'weekInfo', {
        configurable: true,
        get: () => ({ firstDay: 1 }),
      });
      expect(aerisInternalLocaleFirstDay('en-GB')).toBe(1);
    } finally {
      if (method) Object.defineProperty(prototype, 'getWeekInfo', method);
      else Reflect.deleteProperty(prototype, 'getWeekInfo');
      if (getter) Object.defineProperty(prototype, 'weekInfo', getter);
      else Reflect.deleteProperty(prototype, 'weekInfo');
    }
  });
  it.each([
    [1900, 28],
    [2000, 29],
    [2024, 29],
    [2025, 28],
    [2100, 28],
  ])('handles Gregorian February in %i', (year, days) => {
    expect(aerisInternalDaysInMonth(year, 2)).toBe(days);
  });

  it('constructs early local years, rolls months deliberately and never mutates a source', () => {
    const date = aerisInternalLocalDate(42, 0, 31);
    expect(aerisInternalReadDate(date)).toEqual({ year: 42, month: 1, day: 31 });
    date.setHours(16, 30, 20, 123);
    const midnight = aerisInternalDateAtMidnight(date);
    expect(midnight).not.toBe(date);
    expect(midnight.getFullYear()).toBe(42);
    expect(midnight.getHours()).toBe(0);
    expect(date.getHours()).toBe(16);
    expect(aerisInternalReadDate(aerisInternalLocalDate(99, 12, 1))).toEqual({
      year: 100,
      month: 1,
      day: 1,
    });
  });

  it('distinguishes empty, incomplete, invalid and complete drafts without fabricating a date', () => {
    expect(aerisInternalResolveDateDraft({ year: null, month: null, day: null }).state).toBe(
      'empty',
    );
    expect(aerisInternalResolveDateDraft({ year: 2024, month: 2, day: null })).toEqual({
      state: 'incomplete',
      value: null,
    });
    expect(aerisInternalResolveDateDraft({ year: 2025, month: 2, day: 29 })).toEqual({
      state: 'invalid',
      value: null,
    });
    expect(aerisInternalResolveDateDraft({ year: 2024, month: 2, day: 29 })).toEqual({
      state: 'complete',
      value: { year: 2024, month: 2, day: 29 },
    });
    expect(aerisInternalResolveDateDraft({ year: null, month: 13, day: null }).state).toBe(
      'invalid',
    );
    expect(aerisInternalResolveTimeDraft({ hours: null, minutes: null, seconds: null }).state).toBe(
      'empty',
    );
    expect(aerisInternalResolveTimeDraft({ hours: 12, minutes: null, seconds: 0 }).state).toBe(
      'incomplete',
    );
    expect(aerisInternalResolveTimeDraft({ hours: 24, minutes: 0, seconds: 0 }).state).toBe(
      'invalid',
    );
    expect(aerisInternalResolveTimeDraft({ hours: 0, minutes: 0, seconds: 0 }).value).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it.each([
    '0000-01-01',
    '10000-01-01',
    '2025-02-29',
    '2026-04-31',
    '2026-13-01',
    '2026-01-00',
    '2026-1-2',
    '11/12/2026',
    '2026-01-01T00:00:00Z',
    '',
  ])('rejects non-canonical or impossible date %s', (value) => {
    expect(aerisInternalParseDateParts(value)).toBeNull();
  });

  it.each(['0001-01-01', '0099-12-31', '2000-02-29', '2026-10-16', '9999-12-31'])(
    'round trips calendar-only %s',
    (value) => {
      const parts = aerisInternalParseDateParts(value);
      expect(parts).not.toBeNull();
      if (!parts) throw new Error('Expected complete calendar parts');
      expect(aerisInternalFormatDateParts(parts)).toBe(value);
      const date = aerisInternalDateFromParts(parts);
      expect(date).not.toBeNull();
      if (!date) throw new Error('Expected a representable local date');
      expect(aerisInternalReadDate(date)).toEqual(parts);
    },
  );

  it.each(['24:00', '23:60', '23:59:60', '9:05', '09:5', '09:05 PM', '09:05Z', ''])(
    'rejects non-canonical or invalid time %s',
    (value) => {
      expect(aerisInternalParseTimeParts(value)).toBeNull();
    },
  );

  it('formats clock-only values without attaching a calendar date', () => {
    const parts = { hours: 23, minutes: 59, seconds: 58 };
    expect(aerisInternalFormatTimeParts(parts)).toBe('23:59');
    expect(aerisInternalFormatTimeParts(parts, true)).toBe('23:59:58');
    expect(aerisInternalParseTimeParts('00:00')).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(aerisInternalParseTimeParts('23:59:58')).toEqual(parts);
    const date = aerisInternalDateFromParts({ year: 2026, month: 6, day: 11 }, parts);
    if (!date) throw new Error('Expected a valid local date and time');
    expect(aerisInternalReadTime(date)).toEqual(parts);
    expect(date.getMilliseconds()).toBe(0);
  });

  it('rejects fractional, NaN and out-of-range parts rather than letting Date normalize them', () => {
    for (const year of [0, 10000, NaN, Infinity, 2026.5])
      expect(aerisInternalResolveDateDraft({ year, month: 1, day: 1 }).state).toBe('invalid');
    for (const minutes of [-1, 60, NaN, Infinity, 2.5])
      expect(aerisInternalResolveTimeDraft({ hours: 12, minutes, seconds: 0 }).state).toBe(
        'invalid',
      );
    expect(aerisInternalDateFromParts({ year: 2025, month: 2, day: 29 })).toBeNull();
    expect(
      aerisInternalDateFromParts(
        { year: 2026, month: 1, day: 1 },
        { hours: 25, minutes: 0, seconds: 0 },
      ),
    ).toBeNull();
  });

  it('round trips all 24 hours through AM/PM, including noon and midnight', () => {
    for (let hours = 0; hours < 24; hours++) {
      const display = aerisInternalToTwelveHour(hours);
      expect(display).toBeGreaterThanOrEqual(1);
      expect(display).toBeLessThanOrEqual(12);
      expect(aerisInternalFromTwelveHour(display, hours < 12 ? 'AM' : 'PM')).toBe(hours);
    }
    expect(aerisInternalToTwelveHour(0)).toBe(12);
    expect(aerisInternalFromTwelveHour(12, 'AM')).toBe(0);
    expect(aerisInternalFromTwelveHour(12, 'PM')).toBe(12);
  });

  it.each([
    ['en-US', ['month', 'day', 'year']],
    ['en-GB', ['day', 'month', 'year']],
    ['de-DE', ['day', 'month', 'year']],
    ['ja-JP', ['year', 'month', 'day']],
    ['ar-EG', ['day', 'month', 'year']],
  ] as const)('derives segment order from %s', (locale, expected) => {
    expect(
      aerisInternalDateTimeLayout(locale, 'date')
        .filter((part) => part.type !== 'literal')
        .map((part) => part.type),
    ).toEqual(expected);
  });

  it('preserves localized literals and honors explicit hour cycle and second granularity', () => {
    const layout = aerisInternalDateTimeLayout('de-DE', 'date');
    expect(layout.filter((part) => part.type === 'literal')).toEqual([
      { type: 'literal', value: '.' },
      { type: 'literal', value: '.' },
    ]);
    expect(
      aerisInternalDateTimeLayout('en-US-u-hc-h12', 'time', '24').map((part) => part.type),
    ).not.toContain('dayPeriod');
    expect(aerisInternalDateTimeLayout('en-US', 'time', '12').map((part) => part.type)).toContain(
      'dayPeriod',
    );
    expect(
      aerisInternalDateTimeLayout('en-US', 'time', '24', true).map((part) => part.type),
    ).toContain('second');
    expect(aerisInternalDateTimeLayout('en-US', 'time').map((part) => part.type)).not.toContain(
      'second',
    );
    expect(aerisInternalDateTimeLayout('zh-TW', 'time', '12')[0]?.type).toBe('dayPeriod');
  });

  it('counts calendar days independently of the local clock and supports early years', () => {
    const before = aerisInternalLocalDate(99, 11, 31);
    const after = aerisInternalLocalDate(100, 0, 1);
    expect(aerisInternalCalendarDayIndex(after) - aerisInternalCalendarDayIndex(before)).toBe(1);
  });
});
