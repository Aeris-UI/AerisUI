import {
  aerisInternalDateTimeLayout,
  aerisInternalFormatDateParts,
  aerisInternalParseDateParts,
  aerisInternalResolveDateDraft,
} from '@aeris-ui/core';

export type AerisDatePickerInputGranularity = 'day' | 'month' | 'year';
export type AerisDatePickerInputSegment = 'year' | 'month' | 'day';
export type AerisDatePickerInputError =
  'required' | 'incomplete' | 'invalid' | 'min' | 'max' | 'unavailable' | 'configuration';
export type AerisDatePickerInputDraft = Readonly<Record<AerisDatePickerInputSegment, string>>;
export interface AerisDatePickerInputEditEvent {
  readonly originalEvent: Event;
  readonly value: string | null;
  readonly error: AerisDatePickerInputError | null;
}
export interface DatePickerInputRules {
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

export function datePickerInputDraft(value: string | null): AerisDatePickerInputDraft {
  const parts = value === null ? null : aerisInternalParseDateParts(value);
  if (!parts) return { year: value === null ? '' : value, month: '', day: '' };
  return {
    year: String(parts.year).padStart(4, '0'),
    month: String(parts.month).padStart(2, '0'),
    day: String(parts.day).padStart(2, '0'),
  };
}

export function datePickerInputParts(
  granularity: AerisDatePickerInputGranularity,
): readonly AerisDatePickerInputSegment[] {
  return granularity === 'year'
    ? ['year']
    : granularity === 'month'
      ? ['year', 'month']
      : ['year', 'month', 'day'];
}

export function resolveDatePickerInput(
  draft: AerisDatePickerInputDraft,
  rules: DatePickerInputRules,
): DatePickerInputResolution {
  const visible = datePickerInputParts(rules.granularity);
  if (visible.every((part) => draft[part] === ''))
    return { value: null, error: rules.required ? 'required' : null };
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
  if (rules.dateDisabled?.(value)) return { value: null, error: 'unavailable' };
  return { value, error: null };
}

export function datePickerInputLayout(
  locale: string,
  granularity: AerisDatePickerInputGranularity,
): readonly (
  | { readonly type: AerisDatePickerInputSegment }
  | { readonly type: 'literal'; readonly value: string }
)[] {
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
): AerisDatePickerInputDraft | null {
  const text = datePickerInputAscii(value.trim(), datePickerInputDigits(locale));
  if (aerisInternalParseDateParts(text)) return datePickerInputDraft(text);
  if (granularity === 'year' && /^\d{4}$/.test(text)) return { year: text, month: '01', day: '01' };
  if (granularity === 'month' && /^\d{4}-\d{2}$/.test(text))
    return datePickerInputDraft(`${text}-01`);
  const layout = datePickerInputLayout(locale, granularity);
  const pattern = layout
    .map((part) =>
      part.type === 'literal'
        ? part.value.replace(/[\u200e\u200f\u061c]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        : '(\\d{1,4})',
    )
    .join('');
  const match = new RegExp(`^${pattern}$`, 'u').exec(text);
  if (!match) return null;
  const draft = { year: '', month: '01', day: '01' };
  let index = 1;
  for (const part of layout)
    if (part.type !== 'literal')
      draft[part.type] = (match[index++] ?? '').padStart(part.type === 'year' ? 4 : 2, '0');
  return draft;
}
