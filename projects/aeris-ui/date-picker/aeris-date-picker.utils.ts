export interface AerisCalendarCell {
  readonly date: Date;
  readonly key: string;
  readonly label: string;
  readonly day: number;
  readonly currentMonth: boolean;
}

export function dateAtMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function sameDate(left: Date | null, right: Date | null): boolean {
  return Boolean(left && right && dateKey(left) === dateKey(right));
}

export function addDays(date: Date, amount: number): Date {
  const result = dateAtMidnight(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

export function addYears(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear() + amount, date.getMonth(), 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

export function startOfWeek(date: Date, firstDayOfWeek: number): Date {
  const normalized = dateAtMidnight(date);
  const difference = (normalized.getDay() - firstDayOfWeek + 7) % 7;
  return addDays(normalized, -difference);
}

export function calendarCells(
  month: Date,
  firstDayOfWeek: number,
  locale: string,
): readonly AerisCalendarCell[] {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = startOfWeek(monthStart, firstDayOfWeek);
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      key: dateKey(date),
      label: formatter.format(date),
      day: date.getDate(),
      currentMonth: date.getMonth() === month.getMonth(),
    };
  });
}

export function weekdayLabels(
  locale: string,
  firstDayOfWeek: number,
): readonly string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sunday = new Date(2024, 0, 7);
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (firstDayOfWeek + index) % 7)),
  );
}

export function weekNumber(date: Date): number {
  const target = dateAtMidnight(date);
  target.setDate(target.getDate() + 4 - (target.getDay() || 7));
  const yearStart = new Date(target.getFullYear(), 0, 1);
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

export function isDateBetween(
  date: Date,
  start: Date | null,
  end: Date | null,
): boolean {
  if (!start || !end) return false;
  const timestamp = dateAtMidnight(date).getTime();
  return timestamp > dateAtMidnight(start).getTime() &&
    timestamp < dateAtMidnight(end).getTime();
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function clampDate(date: Date, minDate?: Date, maxDate?: Date): Date {
  const normalized = dateAtMidnight(date);
  if (minDate && normalized < dateAtMidnight(minDate)) return dateAtMidnight(minDate);
  if (maxDate && normalized > dateAtMidnight(maxDate)) return dateAtMidnight(maxDate);
  return normalized;
}
