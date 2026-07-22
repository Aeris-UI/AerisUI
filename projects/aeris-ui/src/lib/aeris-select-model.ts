export type AerisSelectFilterMatchMode = 'contains' | 'startsWith' | 'endsWith' | 'equals';

export interface AerisSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

export interface AerisSelectOptionGroup {
  readonly label: string | null;
  readonly options: readonly AerisSelectOption[];
}

export interface AerisSelectVirtualRange {
  readonly start: number;
  readonly end: number;
  readonly topPadding: number;
  readonly bottomPadding: number;
}

export function filterSelectOptions(
  options: readonly AerisSelectOption[],
  query: string,
  fields: readonly ('label' | 'description' | 'group')[],
  matchMode: AerisSelectFilterMatchMode,
  locale?: string,
): readonly AerisSelectOption[] {
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  if (!normalizedQuery) return options;

  return options.filter((option) =>
    fields.some((field) => {
      const candidate = option[field]?.toLocaleLowerCase(locale) ?? '';
      return matchesSelectFilter(candidate, normalizedQuery, matchMode);
    }),
  );
}

export function groupSelectOptions(
  options: readonly AerisSelectOption[],
): readonly AerisSelectOptionGroup[] {
  const groups = new Map<string | null, AerisSelectOption[]>();

  for (const option of options) {
    const label = option.group?.trim() || null;
    const group = groups.get(label);
    if (group) group.push(option);
    else groups.set(label, [option]);
  }

  return Array.from(groups, ([label, groupedOptions]) => ({
    label,
    options: groupedOptions,
  }));
}

export function selectVirtualRange(
  optionCount: number,
  start: number,
  panelMaxHeight: string,
  itemSize: number,
  buffer: number,
): AerisSelectVirtualRange {
  const safeItemSize = Math.max(1, itemSize);
  const safeBuffer = Math.max(0, buffer);
  const safeStart = Math.max(0, Math.min(start, optionCount));
  const visibleCount = Math.ceil(selectPanelPixels(panelMaxHeight) / safeItemSize) + safeBuffer * 2;
  const end = Math.min(optionCount, safeStart + visibleCount);

  return {
    start: safeStart,
    end,
    topPadding: safeStart * safeItemSize,
    bottomPadding: Math.max(0, (optionCount - end) * safeItemSize),
  };
}

export function nextEnabledSelectValue(
  options: readonly AerisSelectOption[],
  currentValue: string | null,
  direction: 1 | -1,
): string | null {
  if (!options.length || options.every((option) => option.disabled)) return null;

  let index = options.findIndex((option) => option.value === currentValue);
  if (index < 0) index = direction === 1 ? -1 : 0;

  do {
    index = (index + direction + options.length) % options.length;
  } while (options[index]?.disabled);

  return options[index]?.value ?? null;
}

export function boundarySelectValue(
  options: readonly AerisSelectOption[],
  boundary: 'start' | 'end',
): string | null {
  if (boundary === 'start') {
    return options.find((option) => !option.disabled)?.value ?? null;
  }

  for (let index = options.length - 1; index >= 0; index -= 1) {
    const option = options[index];
    if (option && !option.disabled) return option.value;
  }

  return null;
}

function matchesSelectFilter(
  candidate: string,
  query: string,
  matchMode: AerisSelectFilterMatchMode,
): boolean {
  switch (matchMode) {
    case 'startsWith':
      return candidate.startsWith(query);
    case 'endsWith':
      return candidate.endsWith(query);
    case 'equals':
      return candidate === query;
    case 'contains':
      return candidate.includes(query);
    default:
      return false;
  }
}

function selectPanelPixels(value: string): number {
  const normalized = value.trim();
  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount)) return 288;
  return normalized.endsWith('rem') ? amount * 16 : amount;
}
