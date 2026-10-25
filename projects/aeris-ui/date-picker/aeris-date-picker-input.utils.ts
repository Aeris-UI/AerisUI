import {
  aerisInternalDateTimeLayout,
  aerisInternalFormatDateParts,
  aerisInternalParseDateParts,
  aerisInternalResolveDateDraft,
  aerisInternalParseTimeParts,
  aerisInternalFormatTimeParts,
  aerisInternalToTwelveHour,
  aerisInternalFromTwelveHour,
} from '@aeris-ui/core';

export type AerisDatePickerInputGranularity = 'day' | 'month' | 'year';
export type AerisDatePickerInputSegment =
  'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'dayPeriod';
export interface DatePickerInputOptions {
  readonly mode?: 'date' | 'time' | 'dateTime';
  readonly hourCycle?: '12' | '24';
  readonly showSeconds?: boolean;
}
export type AerisDatePickerInputError =
  'required' | 'incomplete' | 'invalid' | 'min' | 'max' | 'unavailable' | 'configuration';
export type AerisDatePickerInputDraft = Readonly<Record<AerisDatePickerInputSegment, string>>;
export interface AerisDatePickerInputEditEvent {
  readonly originalEvent: Event;
  readonly value: string | null;
  readonly error: AerisDatePickerInputError | null;
}
export interface DatePickerInputRules extends DatePickerInputOptions {
  readonly granularity: AerisDatePickerInputGranularity;
  readonly min: string | null;
  readonly max: string | null;
  readonly required: boolean;
  readonly dateDisabled: ((value: string) => boolean) | null;
}
export interface DatePickerInputResolution {
  readonly value: string | null;
  readonly error: AerisDatePickerInputError | null;
}

export function datePickerInputDraft(
  value: string | null,
  options: DatePickerInputOptions = {},
): AerisDatePickerInputDraft {
  const draft = { year: '', month: '', day: '', hour: '', minute: '', second: '', dayPeriod: '' };
  if (value === null) return draft;
  const [date, clock] = value.split('T');
  const parts = options.mode === 'time' ? null : aerisInternalParseDateParts(date ?? '');
  const time =
    options.mode === 'dateTime'
      ? aerisInternalParseTimeParts(clock ?? '')
      : options.mode === 'time'
        ? aerisInternalParseTimeParts(value)
        : null;
  if ((!parts && options.mode !== 'time') || (!time && options.mode && options.mode !== 'date'))
    return { ...draft, [options.mode === 'time' ? 'hour' : 'year']: value };
  return {
    year: parts ? String(parts.year).padStart(4, '0') : '',
    month: parts ? String(parts.month).padStart(2, '0') : '',
    day: parts ? String(parts.day).padStart(2, '0') : '',
    hour: time
      ? String(
          options.hourCycle === '12' ? aerisInternalToTwelveHour(time.hours) : time.hours,
        ).padStart(2, '0')
      : '',
    minute: time ? String(time.minutes).padStart(2, '0') : '',
    second: time ? String(time.seconds).padStart(2, '0') : '',
    dayPeriod: time ? (time.hours >= 12 ? 'PM' : 'AM') : '',
  };
}

export function datePickerInputParts(
  granularity: AerisDatePickerInputGranularity,
  options: DatePickerInputOptions = {},
): readonly AerisDatePickerInputSegment[] {
  const date: readonly AerisDatePickerInputSegment[] =
    granularity === 'year'
      ? ['year']
      : granularity === 'month'
        ? ['year', 'month']
        : ['year', 'month', 'day'];
  const time: readonly AerisDatePickerInputSegment[] = [
    'hour',
    'minute',
    ...(options.showSeconds ? ['second' as const] : []),
    ...(options.hourCycle === '12' ? ['dayPeriod' as const] : []),
  ];
  return options.mode === 'time' ? time : options.mode === 'dateTime' ? [...date, ...time] : date;
}

export function resolveDatePickerInput(
  draft: AerisDatePickerInputDraft,
  rules: DatePickerInputRules,
): DatePickerInputResolution {
  const visible = datePickerInputParts(rules.granularity, rules);
  if (visible.every((part) => draft[part] === ''))
    return { value: null, error: rules.required ? 'required' : null };
  const date =
    rules.mode === 'time' ? { value: null, error: null } : resolveCalendarInput(draft, rules);
  if (date.error) return date;
  if (!rules.mode || rules.mode === 'date') return date;
  const clockParts = visible.filter(
    (part) => part === 'hour' || part === 'minute' || part === 'second',
  );
  if (
    clockParts.some(
      (part) => draft[part] !== '' && (!/^\d+$/.test(draft[part]) || draft[part].length > 2),
    )
  )
    return { value: null, error: 'invalid' };
  const hour = Number(draft.hour);
  const minute = Number(draft.minute);
  const second = Number(draft.second || '0');
  if (
    (draft.hour !== '' &&
      (hour < (rules.hourCycle === '12' ? 1 : 0) || hour > (rules.hourCycle === '12' ? 12 : 23))) ||
    minute > 59 ||
    second > 59 ||
    !Number.isInteger(second) ||
    second < 0
  )
    return { value: null, error: 'invalid' };
  if (
    rules.hourCycle === '12' &&
    draft.dayPeriod !== '' &&
    draft.dayPeriod !== 'AM' &&
    draft.dayPeriod !== 'PM'
  )
    return { value: null, error: 'invalid' };
  if (
    clockParts.some((part) => draft[part].length < 2) ||
    (rules.hourCycle === '12' && draft.dayPeriod === '')
  )
    return { value: null, error: 'incomplete' };
  const time = aerisInternalFormatTimeParts(
    {
      hours:
        rules.hourCycle === '12'
          ? aerisInternalFromTwelveHour(hour, draft.dayPeriod as 'AM' | 'PM')
          : hour,
      minutes: minute,
      seconds: second,
    },
    true,
  );
  const value = rules.mode === 'time' ? time : `${date.value}T${time}`;
  if (rules.dateDisabled?.(value)) return { value: null, error: 'unavailable' };
  return { value, error: null };
}

function resolveCalendarInput(
  draft: AerisDatePickerInputDraft,
  rules: DatePickerInputRules,
): DatePickerInputResolution {
  const visible = datePickerInputParts(rules.granularity);
  if (visible.some((part) => draft[part] !== '' && !/^\d+$/.test(draft[part])))
    return { value: null, error: 'invalid' };
  const result = aerisInternalResolveDateDraft({
    year: draft.year === '' ? null : Number(draft.year),
    month: rules.granularity === 'year' ? 1 : draft.month === '' ? null : Number(draft.month),
    day: rules.granularity !== 'day' ? 1 : draft.day === '' ? null : Number(draft.day),
  });
  if (result.state === 'invalid') return { value: null, error: 'invalid' };
  if (
    result.state !== 'complete' ||
    visible.some((part) => draft[part].length < (part === 'year' ? 4 : 2))
  )
    return { value: null, error: 'incomplete' };
  if (visible.some((part) => draft[part].length > (part === 'year' ? 4 : 2)))
    return { value: null, error: 'invalid' };
  const value = aerisInternalFormatDateParts(result.value);
  const minimum = rules.min === null ? null : aerisInternalParseDateParts(rules.min);
  const maximum = rules.max === null ? null : aerisInternalParseDateParts(rules.max);
  const minimumKey = minimum ? aerisInternalFormatDateParts(minimum) : null;
  const maximumKey = maximum ? aerisInternalFormatDateParts(maximum) : null;
  if (
    (rules.min !== null && !minimum) ||
    (rules.max !== null && !maximum) ||
    (minimumKey !== null && maximumKey !== null && minimumKey > maximumKey)
  )
    return { value: null, error: 'configuration' };
  const length = rules.granularity === 'year' ? 4 : rules.granularity === 'month' ? 7 : 10;
  if (minimumKey !== null && value.slice(0, length) < minimumKey.slice(0, length))
    return { value: null, error: 'min' };
  if (maximumKey !== null && value.slice(0, length) > maximumKey.slice(0, length))
    return { value: null, error: 'max' };
  if ((!rules.mode || rules.mode === 'date') && rules.dateDisabled?.(value))
    return { value: null, error: 'unavailable' };
  return { value, error: null };
}

export function datePickerInputLayout(
  locale: string,
  granularity: AerisDatePickerInputGranularity,
  options: DatePickerInputOptions = {},
): readonly (
  | { readonly type: AerisDatePickerInputSegment }
  | { readonly type: 'literal'; readonly value: string }
)[] {
  if (options.mode === 'time')
    return aerisInternalDateTimeLayout(locale, 'time', options.hourCycle, options.showSeconds);
  if (options.mode === 'dateTime')
    return [
      ...datePickerInputLayout(locale, granularity),
      { type: 'literal', value: ' ' },
      ...aerisInternalDateTimeLayout(locale, 'time', options.hourCycle, options.showSeconds),
    ];
  if (granularity === 'day')
    return aerisInternalDateTimeLayout(locale, 'date').filter(
      (
        part,
      ): part is
        | { readonly type: AerisDatePickerInputSegment }
        | { readonly type: 'literal'; readonly value: string } =>
        part.type === 'literal' ||
        part.type === 'year' ||
        part.type === 'month' ||
        part.type === 'day',
    );
  return new Intl.DateTimeFormat(locale, {
    calendar: 'gregory',
    timeZone: 'UTC',
    year: 'numeric',
    month: granularity === 'month' ? '2-digit' : undefined,
  })
    .formatToParts(new Date(Date.UTC(2006, 10, 22)))
    .flatMap<
      | { readonly type: AerisDatePickerInputSegment }
      | { readonly type: 'literal'; readonly value: string }
    >((part) =>
      part.type === 'literal'
        ? [{ type: 'literal' as const, value: part.value }]
        : part.type === 'year' || part.type === 'month'
          ? [{ type: part.type }]
          : [],
    );
}

export function datePickerInputDigits(locale: string): readonly string[] {
  const formatter = new Intl.NumberFormat(locale, { useGrouping: false });
  return Array.from({ length: 10 }, (_, digit) => formatter.format(digit));
}

export function datePickerInputAscii(value: string, digits: readonly string[]): string {
  let result = value;
  digits.forEach((digit, index) => {
    result = result.replaceAll(digit, String(index));
  });
  return result.replace(/[\u200e\u200f\u061c]/g, '');
}

export function datePickerInputPaste(
  value: string,
  locale: string,
  granularity: AerisDatePickerInputGranularity,
  options: DatePickerInputOptions = {},
): AerisDatePickerInputDraft | null {
  const text = datePickerInputAscii(value.trim(), datePickerInputDigits(locale));
  if (
    options.mode === 'time' &&
    aerisInternalParseTimeParts(text) &&
    (!options.showSeconds || /^\d{2}:\d{2}:\d{2}$/.test(text))
  )
    return datePickerInputDraft(text, options);
  if (options.mode === 'dateTime') {
    const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?)$/.exec(text);
    if (
      match &&
      aerisInternalParseDateParts(match[1]) &&
      aerisInternalParseTimeParts(match[2]) &&
      (!options.showSeconds || match[2].length === 8)
    )
      return datePickerInputDraft(`${match[1]}T${match[2]}`, options);
  }
  if ((!options.mode || options.mode === 'date') && aerisInternalParseDateParts(text))
    return datePickerInputDraft(text);
  if ((!options.mode || options.mode === 'date') && granularity === 'year' && /^\d{4}$/.test(text))
    return datePickerInputDraft(`${text}-01-01`);
  if (
    (!options.mode || options.mode === 'date') &&
    granularity === 'month' &&
    /^\d{4}-\d{2}$/.test(text)
  )
    return datePickerInputDraft(`${text}-01`);
  const layout = datePickerInputLayout(locale, granularity, options);
  const periods =
    options.hourCycle === '12' ? datePickerInputPeriods(locale) : { AM: 'AM', PM: 'PM' };
  const pattern = layout
    .map((part) =>
      part.type === 'literal'
        ? part.value.trim() === ''
          ? '[\\s,،]+'
          : escapePattern(part.value.replace(/[\u200e\u200f\u061c]/g, ''))
        : part.type === 'dayPeriod'
          ? `(${escapePattern(periods.AM)}|${escapePattern(periods.PM)}|AM|PM)`
          : '(\\d{1,4})',
    )
    .join('');
  const match = new RegExp(`^${pattern}$`, 'iu').exec(text);
  if (!match) return null;
  const draft = {
    ...datePickerInputDraft(null),
    month: '01',
    day: '01',
    second: options.showSeconds ? '' : '00',
  };
  let index = 1;
  for (const part of layout)
    if (part.type !== 'literal')
      draft[part.type] =
        part.type === 'dayPeriod'
          ? datePickerInputPeriod(match[index++] ?? '', periods)
          : (match[index++] ?? '').padStart(part.type === 'year' ? 4 : 2, '0');
  return draft;
}

function escapePattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function datePickerInputPeriods(locale: string): Readonly<Record<'AM' | 'PM', string>> {
  const format = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hourCycle: 'h12',
    timeZone: 'UTC',
  });
  const label = (hour: number) =>
    format
      .formatToParts(new Date(Date.UTC(2006, 10, 22, hour)))
      .find((part) => part.type === 'dayPeriod')?.value;
  return { AM: label(0) ?? 'AM', PM: label(12) ?? 'PM' };
}

export function datePickerInputPeriod(
  value: string,
  periods: Readonly<Record<'AM' | 'PM', string>>,
): string {
  const text = value.trim().toLocaleLowerCase();
  const matches = (['AM', 'PM'] as const).filter((period) =>
    [period, periods[period]].some(
      (label) =>
        label.toLocaleLowerCase() === text ||
        (text.length === 1 && label.toLocaleLowerCase().startsWith(text)),
    ),
  );
  return matches.length === 1 ? matches[0] : value;
}
