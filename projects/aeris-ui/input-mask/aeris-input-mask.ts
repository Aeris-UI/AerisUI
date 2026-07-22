import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisInputMaskSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisInputMaskAppearance = 'outline' | 'filled';

type MaskToken =
  | { readonly kind: 'literal'; readonly value: string }
  | { readonly kind: 'slot'; readonly symbol: '9' | 'a' | '*' };

let inputMaskId = 0;

@Component({
  selector: 'aeris-input-mask',
  template: `
    <span
      class="aeris-input-mask"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-readonly]="readonly() || null"
    >
      <input
        #maskInput
        class="aeris-input-mask__input"
        type="text"
        [id]="resolvedInputId()"
        [name]="name()"
        [placeholder]="effectivePlaceholder()"
        [autocomplete]="autocomplete()"
        [inputMode]="inputMode()"
        [value]="displayValue()"
        [disabled]="effectiveDisabled()"
        [readOnly]="readonly()"
        [required]="required()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-describedby]="ariaDescribedby()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-required]="required() || null"
        (input)="handleInput($event)"
        (focus)="focused.emit($event)"
        (blur)="handleBlur($event)"
      />
      @if (showClearButton()) {
        <button
          type="button"
          class="aeris-input-mask__clear"
          [attr.aria-label]="clearButtonAriaLabel()"
          (click)="clear()"
        >
          <span class="aeris-input-mask__clear-mark" aria-hidden="true"></span>
        </button>
      }
    </span>
  `,
  styleUrl: './aeris-input-mask.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisInputMask),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisInputMask implements ControlValueAccessor {
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('maskInput');
  private readonly generatedId = `aeris-input-mask-${++inputMaskId}`;
  private readonly formDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model('');
  readonly mask = input.required<string>();
  readonly inputId = input('');
  readonly name = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly inputMode = input<'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search'>('text');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly slotChar = input('_');
  readonly showMask = input(false, { transform: booleanAttribute });
  readonly unmask = input(false, { transform: booleanAttribute });
  readonly autoClear = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear value');
  readonly size = input<AerisInputMaskSize>('md');
  readonly appearance = input<AerisInputMaskAppearance>('outline');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });

  readonly valueInput = output<string>();
  readonly completed = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly tokens = computed(() => parseMask(this.mask()));
  protected readonly slotCount = computed(
    () => this.tokens().filter((token) => token.kind === 'slot').length,
  );
  protected readonly rawValue = computed(() =>
    this.unmask()
      ? normalizeRaw(this.value(), this.tokens())
      : extractRaw(this.value(), this.tokens()),
  );
  protected readonly formattedValue = computed(() =>
    formatRaw(this.rawValue(), this.tokens(), '', false),
  );
  protected readonly displayValue = computed(() =>
    formatRaw(this.rawValue(), this.tokens(), this.slotChar(), this.showMask()),
  );
  protected readonly effectivePlaceholder = computed(() => {
    if (this.placeholder()) return this.placeholder();
    return this.showMask() ? '' : maskPlaceholder(this.tokens(), this.slotChar());
  });
  protected readonly complete = computed(() => this.rawValue().length === this.slotCount());
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      this.rawValue().length > 0 &&
      !this.effectiveDisabled() &&
      !this.readonly(),
  );

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : value == null ? '' : String(value));
  }

  registerOnChange(callback: (value: string) => void): void {
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
    this.setValue('');
  }

  clear(): void {
    if (this.effectiveDisabled() || this.readonly()) return;
    this.setValue('');
    this.focus();
  }

  protected handleInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const raw = extractRaw(inputElement.value, this.tokens());
    this.commitRaw(raw);
    inputElement.value = formatRaw(raw, this.tokens(), this.slotChar(), this.showMask());
    queueMicrotask(() => inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length));
  }

  protected handleBlur(event: FocusEvent): void {
    if (this.autoClear() && !this.complete()) this.setValue('');
    this.touch.emit();
    this.onTouched();
    this.blurred.emit(event);
  }

  private commitRaw(raw: string): void {
    const nextValue = this.unmask() ? raw : formatRaw(raw, this.tokens(), '', false);
    const wasComplete = this.complete();
    this.setValue(nextValue);
    if (!wasComplete && raw.length === this.slotCount()) this.completed.emit(nextValue);
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }
}

function parseMask(mask: string): readonly MaskToken[] {
  const tokens: MaskToken[] = [];
  let escaped = false;

  for (const character of mask) {
    if (escaped) {
      tokens.push({ kind: 'literal', value: character });
      escaped = false;
    } else if (character === '\\') {
      escaped = true;
    } else if (character === '9' || character === 'a' || character === '*') {
      tokens.push({ kind: 'slot', symbol: character });
    } else {
      tokens.push({ kind: 'literal', value: character });
    }
  }

  if (escaped) tokens.push({ kind: 'literal', value: '\\' });
  return tokens;
}

function extractRaw(value: string, tokens: readonly MaskToken[]): string {
  const characters = Array.from(value);
  let sourceIndex = 0;
  let raw = '';

  for (const token of tokens) {
    if (token.kind === 'literal') {
      if (characters[sourceIndex] === token.value) sourceIndex += 1;
      continue;
    }

    while (sourceIndex < characters.length) {
      const character = characters[sourceIndex++] as string;
      if (matchesSlot(character, token.symbol)) {
        raw += character;
        break;
      }
    }
  }

  return raw;
}

function normalizeRaw(value: string, tokens: readonly MaskToken[]): string {
  let sourceIndex = 0;
  let raw = '';

  for (const token of tokens) {
    if (token.kind === 'literal') continue;
    while (sourceIndex < value.length) {
      const character = value[sourceIndex++] as string;
      if (matchesSlot(character, token.symbol)) {
        raw += character;
        break;
      }
    }
  }

  return raw;
}

function formatRaw(
  raw: string,
  tokens: readonly MaskToken[],
  slotChar: string,
  includeEmptySlots: boolean,
): string {
  let result = '';
  let rawIndex = 0;
  let hasValue = false;

  for (const token of tokens) {
    if (token.kind === 'literal') {
      if (hasValue || includeEmptySlots || rawIndex < raw.length) result += token.value;
      continue;
    }

    const character = raw[rawIndex];
    if (character && matchesSlot(character, token.symbol)) {
      result += character;
      rawIndex += 1;
      hasValue = true;
    } else if (includeEmptySlots) {
      result += slotChar;
    } else {
      break;
    }
  }

  return result;
}

function maskPlaceholder(tokens: readonly MaskToken[], slotChar: string): string {
  return tokens
    .map((token) => (token.kind === 'literal' ? token.value : slotChar))
    .join('');
}

function matchesSlot(character: string, symbol: '9' | 'a' | '*'): boolean {
  if (symbol === '9') return /\p{Nd}/u.test(character);
  if (symbol === 'a') return /\p{L}/u.test(character);
  return /[\p{L}\p{Nd}]/u.test(character);
}
