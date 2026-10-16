import {
  Component,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ɵaerisDisplayInvalid, aerisInternalDaysInMonth } from '@aeris-ui/core';
import {
  datePickerInputAscii,
  datePickerInputDigits,
  datePickerInputDraft,
  datePickerInputLayout,
  datePickerInputPaste,
  resolveDatePickerInput,
  type DatePickerInputRules,
} from './aeris-date-picker-input.utils';
import type {
  AerisDatePickerInputEditEvent,
  AerisDatePickerInputGranularity,
  AerisDatePickerInputSegment,
} from './aeris-date-picker-input.utils';

let fieldId = 0;
@Component({
  selector: 'aeris-internal-date-picker-input',
  templateUrl: './aeris-date-picker-input.html',
  styleUrl: './aeris-date-picker-input.scss',
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-invalid]': 'displayInvalid() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
  },
})
export class ɵAerisDatePickerInput {
  readonly value = model<string | null>(null);
  readonly inputId = input('');
  readonly locale = input('en-US');
  readonly granularity = input<AerisDatePickerInputGranularity>('day');
  readonly min = input<string | null | undefined>(null);
  readonly max = input<string | null | undefined>(null);
  readonly dateDisabled = input<((value: string) => boolean) | null>(null);
  readonly size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  readonly appearance = input<'outline' | 'filled'>('outline');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  readonly ariaLabel = input('Date');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');
  readonly edited = output<AerisDatePickerInputEditEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly generatedId = `aeris-date-picker-input-${++fieldId}`;
  private readonly interacted = signal(false);
  private readonly segments = viewChildren<ElementRef<HTMLInputElement>>('segment');
  protected readonly effectiveDisabled = computed(() => this.disabled());
  protected readonly resolvedId = computed(() => this.inputId() || this.generatedId);
  private readonly rules = computed<DatePickerInputRules>(() => ({
    granularity: this.granularity(),
    min: this.min() ?? null,
    max: this.max() ?? null,
    required: this.required(),
    dateDisabled: this.dateDisabled(),
  }));
  protected readonly draft = linkedSignal(() => datePickerInputDraft(this.value()));
  readonly validationError = computed(
    () => resolveDatePickerInput(this.draft(), this.rules()).error,
  );
  protected readonly displayInvalid = computed(
    () =>
      ɵaerisDisplayInvalid(this.invalid(), this.touched()) ||
      Boolean(this.validationError() && (this.touched() ?? this.interacted())),
  );
  private readonly digits = computed(() => datePickerInputDigits(this.locale()));
  private readonly layout = computed(() =>
    datePickerInputLayout(this.locale(), this.granularity()),
  );
  private readonly labels = computed(() => {
    const names = new Intl.DisplayNames(this.locale(), { type: 'dateTimeField' });
    return Object.fromEntries(
      (['year', 'month', 'day'] as const).map((part) => [part, names.of(part) || part]),
    );
  });
  protected readonly entries = computed(() => {
    let index = 0;
    return this.layout().map((part) => {
      if (part.type === 'literal')
        return {
          ...part,
          id: '',
          label: '',
          text: part.value,
          minimum: 0,
          maximum: 0,
          now: null,
          width: 0,
        };
      const raw = this.draft()[part.type];
      const [minimum, maximum] = this.bounds(part.type);
      const now = /^\d+$/.test(raw) ? Number(raw) : null;
      return {
        ...part,
        id: index++ === 0 ? this.resolvedId() : `${this.resolvedId()}-${part.type}`,
        label: this.labels()[part.type],
        text: raw.replace(/\d/g, (digit) => this.digits()[Number(digit)]),
        minimum,
        maximum,
        now: now !== null && now >= minimum && now <= maximum ? now : null,
        width: part.type === 'year' ? 4 : 2,
      };
    });
  });

  constructor() {
    effect(() => {
      const error = this.validationError();
      const inputs = this.segments();
      if (this.browser)
        inputs.forEach((element, index) =>
          element.nativeElement.setCustomValidity(
            index === 0 && error && !this.effectiveDisabled() ? `Date ${error}.` : '',
          ),
        );
    });
  }

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : null);
    this.draft.set(datePickerInputDraft(this.value()));
    this.interacted.set(false);
  }
  focus(options?: FocusOptions): void {
    this.segments()[0]?.nativeElement.focus(options);
  }
  protected handleFieldClick(event: MouseEvent): void {
    if (
      this.effectiveDisabled() ||
      this.segments().some((segment) => segment.nativeElement === event.target)
    )
      return;
    this.focus();
  }
  protected handleFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
    this.focused.emit(event);
  }
  protected handleNativeInvalid(event: Event): void {
    this.interacted.set(true);
    this.publish(event);
  }
  protected handleInput(part: AerisDatePickerInputSegment, event: Event): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const raw = datePickerInputAscii((event.target as HTMLInputElement).value, this.digits());
    this.draft.update((draft) => ({ ...draft, [part]: raw }));
    const [, maximum] = this.bounds(part);
    if (
      /^\d+$/.test(raw) &&
      (raw.length === (part === 'year' ? 4 : 2) ||
        (part !== 'year' && Number(raw) > Math.floor(maximum / 10)))
    ) {
      this.finalize(part);
      if (Number(raw) <= maximum && Number(raw) > 0) this.move(part, 1);
    }
    this.publish(event);
  }
  protected handleSegmentBlur(part: AerisDatePickerInputSegment, event: FocusEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.finalize(part);
    this.publish(event);
  }
  protected handleFocusOut(event: FocusEvent): void {
    if (this.effectiveDisabled()) return;
    if (this.host.nativeElement.contains(event.relatedTarget as Node | null)) return;
    this.interacted.set(true);
    this.blurred.emit(event);
  }
  protected handleKey(part: AerisDatePickerInputSegment, event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || this.effectiveDisabled()) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      if (!this.readonly()) this.finalize(part);
      const rtl =
        this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(this.host.nativeElement)
          .direction === 'rtl';
      this.move(part, (event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1));
      return;
    }
    if (this.readonly()) return;
    const [minimum, maximum] = this.bounds(part);
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const current = Number(this.draft()[part]) || minimum;
      const next =
        event.key === 'Home'
          ? minimum
          : event.key === 'End'
            ? maximum
            : current + (event.key === 'ArrowUp' ? 1 : -1);
      const number =
        part === 'year'
          ? Math.max(minimum, Math.min(maximum, next))
          : next < minimum
            ? maximum
            : next > maximum
              ? minimum
              : next;
      this.draft.update((draft) => ({
        ...draft,
        [part]: String(number).padStart(part === 'year' ? 4 : 2, '0'),
      }));
      this.finalize(part);
      this.publish(event);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.draft.update((draft) => ({ ...draft, [part]: '' }));
      this.publish(event);
    } else if (
      event.key.length === 1 &&
      !/\d/.test(datePickerInputAscii(event.key, this.digits())) &&
      this.layout().some((entry) => entry.type === 'literal' && entry.value.includes(event.key))
    ) {
      event.preventDefault();
      this.finalize(part);
      this.publish(event);
      this.move(part, 1);
    }
  }
  protected handlePaste(event: ClipboardEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    // A canonical paste with greater precision must not silently discard its day/month.
    const pasted = datePickerInputPaste(text, this.locale(), this.granularity());
    const error = pasted ? resolveDatePickerInput(pasted, this.rules()).error : 'invalid';
    if (
      pasted &&
      error !== 'invalid' &&
      error !== 'incomplete' &&
      (this.granularity() === 'day' ||
        (pasted.day === '01' && (this.granularity() !== 'year' || pasted.month === '01')))
    )
      this.draft.set(pasted);
    else this.draft.set({ year: text, month: '', day: '' });
    this.publish(event);
  }
  private bounds(part: AerisDatePickerInputSegment): readonly [number, number] {
    return part === 'year'
      ? [1, 9999]
      : part === 'month'
        ? [1, 12]
        : [
            1,
            aerisInternalDaysInMonth(Number(this.draft().year), Number(this.draft().month)) || 31,
          ];
  }
  private finalize(part: AerisDatePickerInputSegment): void {
    const draft = this.draft();
    const raw = draft[part];
    if (!/^\d+$/.test(raw)) return;
    const [minimum, maximum] = this.bounds(part);
    if (Number(raw) < minimum || Number(raw) > maximum) return;
    let next = { ...draft, [part]: raw.padStart(part === 'year' ? 4 : 2, '0') };
    if (
      part !== 'day' &&
      /^\d{4}$/.test(next.year) &&
      /^\d{2}$/.test(next.month) &&
      /^\d{2}$/.test(next.day)
    ) {
      const lastDay = aerisInternalDaysInMonth(Number(next.year), Number(next.month));
      if (lastDay && Number(next.day) > lastDay)
        next = { ...next, day: String(lastDay).padStart(2, '0') };
    }
    this.draft.set(next);
  }
  private move(part: AerisDatePickerInputSegment, direction: number): void {
    const parts = this.entries().filter((entry) => entry.type !== 'literal');
    const index = parts.findIndex((entry) => entry.type === part);
    const target = this.segments()[index + direction]?.nativeElement;
    target?.focus();
    target?.select();
  }
  private publish(event: Event): void {
    const result = resolveDatePickerInput(this.draft(), this.rules());
    if (!result.error || result.error === 'required') this.value.set(result.value);
    this.edited.emit({ ...result, originalEvent: event });
  }
}
