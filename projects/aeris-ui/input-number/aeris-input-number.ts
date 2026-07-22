import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisInputNumberSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisInputNumberAppearance = 'outline' | 'filled';
export type AerisInputNumberMode = 'decimal' | 'currency';
export type AerisInputNumberButtonLayout = 'stacked' | 'horizontal' | 'vertical';
export type AerisInputNumberCurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

let inputNumberId = 0;

@Component({
  selector: 'aeris-input-number',
  template: `
    <div
      class="aeris-input-number"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-button-layout]="showButtons() ? buttonLayout() : null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
      [attr.data-invalid]="invalid() || null"
    >
      @if (showButtons() && buttonLayout() !== 'stacked') {
        <button
          type="button"
          class="aeris-input-number__button aeris-input-number__button--decrement"
          [disabled]="decrementDisabled()"
          [attr.aria-label]="decrementButtonAriaLabel()"
          [attr.tabindex]="buttonTabIndex()"
          (click)="stepBy(-1)"
        >
          <span class="aeris-input-number__minus-mark" aria-hidden="true"></span>
        </button>
      }

      <div class="aeris-input-number__field">
        @if (prefix()) {
          <span class="aeris-input-number__affix" aria-hidden="true">{{ prefix() }}</span>
        }
        <input
          #numberInput
          class="aeris-input-number__input"
          type="text"
          inputmode="decimal"
          role="spinbutton"
          [id]="resolvedInputId()"
          [name]="name()"
          [placeholder]="placeholder()"
          [autocomplete]="autocomplete()"
          [value]="displayValue()"
          [disabled]="effectiveDisabled()"
          [readOnly]="readonly()"
          [required]="required()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-labelledby]="ariaLabelledby()"
          [attr.aria-describedby]="ariaDescribedby()"
          [attr.aria-invalid]="invalid() || null"
          [attr.aria-required]="required() || null"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.aria-valuenow]="value()"
          [attr.aria-valuetext]="formattedValue() || null"
          (input)="handleInput($event)"
          (focus)="handleFocus($event)"
          (blur)="handleBlur($event)"
          (keydown)="handleKeydown($event)"
        />
        @if (suffix()) {
          <span class="aeris-input-number__affix" aria-hidden="true">{{ suffix() }}</span>
        }
        @if (showClearButton()) {
          <button
            type="button"
            class="aeris-input-number__clear"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="clear()"
          >
            <span class="aeris-input-number__clear-mark" aria-hidden="true"></span>
          </button>
        }
      </div>

      @if (showButtons() && buttonLayout() === 'stacked') {
        <span class="aeris-input-number__stack">
          <button
            type="button"
            class="aeris-input-number__button aeris-input-number__button--increment"
            [disabled]="incrementDisabled()"
            [attr.aria-label]="incrementButtonAriaLabel()"
            [attr.tabindex]="buttonTabIndex()"
            (click)="stepBy(1)"
          >
            <span class="aeris-input-number__chevron aeris-input-number__chevron--up" aria-hidden="true"></span>
          </button>
          <button
            type="button"
            class="aeris-input-number__button aeris-input-number__button--decrement"
            [disabled]="decrementDisabled()"
            [attr.aria-label]="decrementButtonAriaLabel()"
            [attr.tabindex]="buttonTabIndex()"
            (click)="stepBy(-1)"
          >
            <span class="aeris-input-number__chevron aeris-input-number__chevron--down" aria-hidden="true"></span>
          </button>
        </span>
      } @else if (showButtons()) {
        <button
          type="button"
          class="aeris-input-number__button aeris-input-number__button--increment"
          [disabled]="incrementDisabled()"
          [attr.aria-label]="incrementButtonAriaLabel()"
          [attr.tabindex]="buttonTabIndex()"
          (click)="stepBy(1)"
        >
          <span class="aeris-input-number__plus-mark" aria-hidden="true"></span>
        </button>
      }
    </div>
  `,
  styleUrl: './aeris-input-number.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisInputNumber),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisInputNumber implements ControlValueAccessor {
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('numberInput');
  private readonly generatedId = `aeris-input-number-${++inputNumberId}`;
  private readonly editing = signal(false);
  private readonly editValue = signal('');
  private readonly formDisabled = signal(false);
  private onChange: (value: number | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model<number | null>(null);
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly locale = input('en-US');
  readonly mode = input<AerisInputNumberMode>('decimal');
  readonly currency = input('USD');
  readonly currencyDisplay = input<AerisInputNumberCurrencyDisplay>('symbol');
  readonly prefix = input('');
  readonly suffix = input('');
  readonly min = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly max = input<number | undefined, unknown>(undefined, { transform: optionalNumber });
  readonly step = input(1, { transform: numberAttribute });
  readonly minFractionDigits = input<number | undefined, unknown>(undefined, {
    transform: optionalInteger,
  });
  readonly maxFractionDigits = input<number | undefined, unknown>(undefined, {
    transform: optionalInteger,
  });
  readonly useGrouping = input(true, { transform: booleanAttribute });
  readonly allowEmpty = input(true, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear value');
  readonly showButtons = input(false, { transform: booleanAttribute });
  readonly buttonLayout = input<AerisInputNumberButtonLayout>('stacked');
  readonly buttonTabIndex = input(-1, { transform: numberAttribute });
  readonly incrementButtonAriaLabel = input('Increase value');
  readonly decrementButtonAriaLabel = input('Decrease value');
  readonly size = input<AerisInputNumberSize>('md');
  readonly appearance = input<AerisInputNumberAppearance>('outline');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly valueInput = output<number | null>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly numberFormat = computed(
    () =>
      new Intl.NumberFormat(this.locale(), {
        style: this.mode(),
        currency: this.mode() === 'currency' ? this.currency() : undefined,
        currencyDisplay: this.currencyDisplay(),
        useGrouping: this.useGrouping(),
        minimumFractionDigits: this.minFractionDigits(),
        maximumFractionDigits: this.maxFractionDigits(),
      }),
  );
  protected readonly formattedValue = computed(() => {
    const value = this.value();
    return value === null ? '' : this.numberFormat().format(value);
  });
  protected readonly displayValue = computed(() =>
    this.editing() ? this.editValue() : this.formattedValue(),
  );
  protected readonly incrementDisabled = computed(
    () =>
      this.effectiveDisabled() ||
      this.readonly() ||
      (this.max() !== undefined && (this.value() ?? 0) >= (this.max() as number)),
  );
  protected readonly decrementDisabled = computed(
    () =>
      this.effectiveDisabled() ||
      this.readonly() ||
      (this.min() !== undefined && (this.value() ?? 0) <= (this.min() as number)),
  );
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      this.value() !== null &&
      !this.effectiveDisabled() &&
      !this.readonly(),
  );

  writeValue(value: unknown): void {
    this.value.set(
      typeof value === 'number' && Number.isFinite(value) ? value : null,
    );
    this.editValue.set(this.editableValue());
  }

  registerOnChange(callback: (value: number | null) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  focus(options?: FocusOptions): void {
    this.inputElement()?.nativeElement.focus(options);
  }

  reset(): void {
    this.setValue(null);
    this.editValue.set('');
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue(null);
    this.editValue.set('');
    this.focus();
  }

  protected handleInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    this.editValue.set(rawValue);
    const parsed = this.parse(rawValue);
    if (parsed !== undefined) this.setValue(parsed);
  }

  protected handleFocus(event: FocusEvent): void {
    this.editing.set(true);
    this.editValue.set(this.editableValue());
    queueMicrotask(() => this.inputElement()?.nativeElement.select());
    this.focused.emit(event);
  }

  protected handleBlur(event: FocusEvent): void {
    this.editing.set(false);
    const parsed = this.parse(this.editValue());
    if (parsed === undefined) {
      this.editValue.set(this.editableValue());
    } else if (parsed === null) {
      this.setValue(null);
    } else {
      this.setValue(this.constrain(parsed));
    }
    this.touch.emit();
    this.onTouched();
    this.blurred.emit(event);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.stepBy(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepBy(-1);
    } else if (event.key === 'Home' && this.min() !== undefined) {
      event.preventDefault();
      this.setValue(this.min() as number);
      this.syncEditingValue();
    } else if (event.key === 'End' && this.max() !== undefined) {
      event.preventDefault();
      this.setValue(this.max() as number);
      this.syncEditingValue();
    }
  }

  protected stepBy(direction: -1 | 1): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    const base = this.value() ?? this.min() ?? 0;
    const next = this.constrain(roundToPrecision(base + this.step() * direction));
    this.setValue(next);
    this.syncEditingValue();
    this.focus();
  }

  private setValue(value: number | null): void {
    if (Object.is(this.value(), value)) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }

  private syncEditingValue(): void {
    if (this.editing()) this.editValue.set(this.editableValue());
  }

  private editableValue(): string {
    const value = this.value();
    if (value === null) return '';
    const decimal = this.decimalSeparator();
    return String(value).replace('.', decimal);
  }

  private parse(rawValue: string): number | null | undefined {
    const trimmed = rawValue.trim();
    if (!trimmed) return this.allowEmpty() ? null : this.value();

    const parts = this.numberFormat().formatToParts(-12345.6);
    const group = parts.find((part) => part.type === 'group')?.value;
    const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
    const minus = parts.find((part) => part.type === 'minusSign')?.value ?? '-';

    let normalized = trimmed;
    if (group) normalized = normalized.split(group).join('');
    normalized = normalized.split('\u00a0').join('').split('\u202f').join('');
    normalized = normalized.replaceAll(decimal, '.').replaceAll(minus, '-');
    normalized = normalized.replace(/[^\d+\-.]/g, '');

    if (!normalized || normalized === '-' || normalized === '+' || normalized === '.') {
      return undefined;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private constrain(value: number): number {
    const min = this.min();
    const max = this.max();
    return Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, value));
  }

  private decimalSeparator(): string {
    return (
      this.numberFormat()
        .formatToParts(1.1)
        .find((part) => part.type === 'decimal')?.value ?? '.'
    );
  }
}

function optionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function optionalInteger(value: unknown): number | undefined {
  const number = optionalNumber(value);
  return number === undefined ? undefined : Math.max(0, Math.trunc(number));
}

function roundToPrecision(value: number): number {
  return Number.parseFloat(value.toPrecision(14));
}
