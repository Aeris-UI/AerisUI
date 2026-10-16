/** Internal Gregorian calendar values. Months are one-based, unlike Date's month index. */
export interface AerisInternalDateParts {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface AerisInternalTimeParts {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

export type AerisInternalDateDraft = {
  readonly [K in keyof AerisInternalDateParts]: number | null;
};
export type AerisInternalTimeDraft = {
  readonly [K in keyof AerisInternalTimeParts]: number | null;
};
export type AerisInternalDateTimeResolution<T> =
  | { readonly state: 'empty' | 'incomplete' | 'invalid'; readonly value: null }
  | { readonly state: 'complete'; readonly value: T };

/** Allows calendar arithmetic/rollover while avoiding Date's special handling of years 0–99. */
export function aerisInternalLocalDate(year: number, monthIndex: number, day: number): Date {
  if (year < 0 || year >= 100) return new Date(year, monthIndex, day);
  const result = new Date(0);
  result.setFullYear(year, monthIndex, day);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function aerisInternalDateAtMidnight(date: Date): Date {
  return aerisInternalLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
}

export function aerisInternalReadDate(date: Date): AerisInternalDateParts {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function aerisInternalReadTime(date: Date): AerisInternalTimeParts {
  return { hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds() };
}

export function aerisInternalDaysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return 0;
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function validPart(value: number | null, minimum: number, maximum: number): boolean {
  return value === null || (Number.isInteger(value) && value >= minimum && value <= maximum);
}

export function aerisInternalResolveDateDraft(
  draft: AerisInternalDateDraft,
): AerisInternalDateTimeResolution<AerisInternalDateParts> {
  const { year, month, day } = draft;
  if (year === null && month === null && day === null) return { state: 'empty', value: null };
  if (!validPart(year, 1, 9999) || !validPart(month, 1, 12) || !validPart(day, 1, 31))
    return { state: 'invalid', value: null };
  if (year === null || month === null || day === null) return { state: 'incomplete', value: null };
  if (day > aerisInternalDaysInMonth(year, month)) return { state: 'invalid', value: null };
  return { state: 'complete', value: { year, month, day } };
}

export function aerisInternalResolveTimeDraft(
  draft: AerisInternalTimeDraft,
): AerisInternalDateTimeResolution<AerisInternalTimeParts> {
  const { hours, minutes, seconds } = draft;
  if (hours === null && minutes === null && seconds === null)
    return { state: 'empty', value: null };
  if (!validPart(hours, 0, 23) || !validPart(minutes, 0, 59) || !validPart(seconds, 0, 59))
    return { state: 'invalid', value: null };
  if (hours === null || minutes === null || seconds === null)
    return { state: 'incomplete', value: null };
  return { state: 'complete', value: { hours, minutes, seconds } };
}

export function aerisInternalFormatDateParts(parts: AerisInternalDateParts): string {
  const year = parts.year < 0 ? String(parts.year) : String(parts.year).padStart(4, '0');
  return `${year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function aerisInternalFormatTimeParts(
  parts: AerisInternalTimeParts,
  showSeconds = false,
): string {
  const time = `${String(parts.hours).padStart(2, '0')}:${String(parts.minutes).padStart(2, '0')}`;
  return showSeconds ? `${time}:${String(parts.seconds).padStart(2, '0')}` : time;
}

/** Canonical values, not locale-dependent free-text parsing. Empty/invalid input never rolls over. */
export function aerisInternalParseDateParts(value: string): AerisInternalDateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return aerisInternalResolveDateDraft({
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }).value;
}

export function aerisInternalParseTimeParts(value: string): AerisInternalTimeParts | null {
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!match) return null;
  return aerisInternalResolveTimeDraft({
    hours: Number(match[1]),
    minutes: Number(match[2]),
    seconds: Number(match[3] ?? 0),
  }).value;
}

/** Explicit local bridge. Date-only values accept a shifted midnight within the same day;
 * supplied clock values reject DST gaps. Entirely skipped local dates are always rejected. */
export function aerisInternalDateFromParts(
  date: AerisInternalDateParts,
  time?: AerisInternalTimeParts,
): Date | null {
  if (
    !aerisInternalResolveDateDraft(date).value ||
    (time && !aerisInternalResolveTimeDraft(time).value)
  )
    return null;
  const result = aerisInternalLocalDate(date.year, date.month - 1, date.day);
  if (time) result.setHours(time.hours, time.minutes, time.seconds, 0);
  return result.getFullYear() === date.year &&
    result.getMonth() === date.month - 1 &&
    result.getDate() === date.day &&
    (!time ||
      (result.getHours() === time.hours &&
        result.getMinutes() === time.minutes &&
        result.getSeconds() === time.seconds))
    ? result
    : null;
}

export function aerisInternalToTwelveHour(hours: number): number {
  return hours % 12 || 12;
}

export function aerisInternalFromTwelveHour(hour: number, period: 'AM' | 'PM'): number {
  return (hour === 12 ? 0 : hour) + (period === 'PM' ? 12 : 0);
}

/** Day ordinal only; UTC arithmetic avoids DST-length days without converting stored local dates. */
export function aerisInternalCalendarDayIndex(date: Date): number {
  const utc = new Date(0);
  utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  return utc.getTime() / 86_400_000;
}

export type AerisInternalDateTimeSegment =
  | { readonly type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'dayPeriod' }
  | { readonly type: 'literal'; readonly value: string };

/** Current Intl API plus the legacy getter used by some engines. Sunday is zero for the calendar. */
export function aerisInternalLocaleFirstDay(locale: string): number {
  try {
    const value = new Intl.Locale(locale) as Intl.Locale & {
      readonly getWeekInfo?: () => { readonly firstDay: number };
      readonly weekInfo?: { readonly firstDay: number };
    };
    const info = value.getWeekInfo?.() ?? value.weekInfo;
    return (info?.firstDay ?? 7) % 7;
  } catch {
    return 0;
  }
}

/** Layout metadata only. No Date values, UTC conversion, localized parsing or UI state is inferred. */
export function aerisInternalDateTimeLayout(
  locale: string,
  kind: 'date' | 'time',
  hourCycle: '12' | '24' = '24',
  showSeconds = false,
): readonly AerisInternalDateTimeSegment[] {
  const formatter = new Intl.DateTimeFormat(locale, {
    calendar: 'gregory',
    timeZone: 'UTC',
    ...(kind === 'date'
      ? ({ year: 'numeric', month: '2-digit', day: '2-digit' } as const)
      : ({
          hour: '2-digit',
          minute: '2-digit',
          second: showSeconds ? '2-digit' : undefined,
          hourCycle: hourCycle === '12' ? 'h12' : 'h23',
        } as const)),
  });
  const layout: AerisInternalDateTimeSegment[] = [];
  for (const part of formatter.formatToParts(new Date(Date.UTC(2006, 10, 22, 13, 14, 15)))) {
    if (part.type === 'literal') layout.push({ type: 'literal', value: part.value });
    else if (
      part.type === 'year' ||
      part.type === 'month' ||
      part.type === 'day' ||
      part.type === 'hour' ||
      part.type === 'minute' ||
      part.type === 'second' ||
      part.type === 'dayPeriod'
    )
      layout.push({ type: part.type });
  }
  return layout;
}
