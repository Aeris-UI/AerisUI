import { describe, expect, it } from 'vitest';

import {
  addDays,
  addMonths,
  addYears,
  calendarCells,
  dateKey,
  dateAtMidnight,
  localDate,
  isDateBetween,
  sameDate,
  startOfWeek,
  weekNumber,
} from '../../../date-picker/aeris-date-picker.utils';

describe('Aeris DatePicker utilities', () => {
  it('keeps years below 100 through calendar construction, month arithmetic and serialization', () => {
    const date = localDate(42, 0, 31);
    expect(dateKey(dateAtMidnight(date))).toBe('0042-01-31');
    expect(dateKey(addMonths(date, 1))).toBe('0042-02-28');
    expect(dateKey(addYears(localDate(99, 11, 31), 1))).toBe('0100-12-31');
    const cells = calendarCells(localDate(42, 5, 1), 1, 'en-US');
    expect(cells.some((cell) => cell.key === '0042-06-11')).toBe(true);
    expect(cells.every((cell) => cell.date.getFullYear() === 42)).toBe(true);
  });

  it('handles ISO week-year boundaries and leap days', () => {
    expect(weekNumber(new Date(2021, 0, 1))).toBe(53);
    expect(weekNumber(new Date(2021, 0, 4))).toBe(1);
    expect(weekNumber(new Date(2020, 11, 31))).toBe(53);
    expect(dateKey(addDays(new Date(2024, 1, 28), 1))).toBe('2024-02-29');
    expect(dateKey(addDays(new Date(2024, 1, 29), 1))).toBe('2024-03-01');
  });
  it('creates a stable six-week calendar grid', () => {
    const cells = calendarCells(new Date(2026, 5, 1), 1, 'en-US');

    expect(cells).toHaveLength(42);
    expect(dateKey(cells[0]!.date)).toBe('2026-06-01');
    expect(cells[0]!.currentMonth).toBe(true);
  });

  it('handles date arithmetic without mutating the source date', () => {
    const source = new Date(2026, 0, 31);
    const result = addDays(source, 1);

    expect(dateKey(source)).toBe('2026-01-31');
    expect(dateKey(result)).toBe('2026-02-01');
    expect(dateKey(startOfWeek(result, 1))).toBe('2026-01-26');
    expect(dateKey(addMonths(source, 1))).toBe('2026-02-28');
    expect(dateKey(addYears(new Date(2024, 1, 29), 1))).toBe('2025-02-28');
  });

  it('compares ranges and ISO week numbers', () => {
    expect(sameDate(new Date(2026, 5, 11), new Date(2026, 5, 11, 20))).toBe(true);
    expect(isDateBetween(new Date(2026, 5, 11), new Date(2026, 5, 10), new Date(2026, 5, 12))).toBe(
      true,
    );
    expect(weekNumber(new Date(2026, 0, 1))).toBe(1);
  });
});
