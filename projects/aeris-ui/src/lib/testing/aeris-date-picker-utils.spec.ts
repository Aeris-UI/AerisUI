import { describe, expect, it } from 'vitest';

import {
  addDays,
  addMonths,
  addYears,
  calendarCells,
  dateKey,
  isDateBetween,
  sameDate,
  startOfWeek,
  weekNumber,
} from '../../../date-picker/aeris-date-picker.utils';

describe('Aeris DatePicker utilities', () => {
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
    expect(
      isDateBetween(
        new Date(2026, 5, 11),
        new Date(2026, 5, 10),
        new Date(2026, 5, 12),
      ),
    ).toBe(true);
    expect(weekNumber(new Date(2026, 0, 1))).toBe(1);
  });
});
