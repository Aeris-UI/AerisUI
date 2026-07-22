import {
  Component,
  ElementRef,
  Directive,
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

export type AerisInputTextSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisInputTextAppearance = 'outline' | 'filled';

/** @deprecated Use AerisInputTextSize instead. */
export type AerisControlSize = AerisInputTextSize;

@Directive({
  selector: 'input[aerisInputText]',
  host: {
    class: 'aeris-input-text',
    '[class.aeris-input-text--xs]': 'size() === "xs"',
    '[class.aeris-input-text--sm]': 'size() === "sm"',
    '[class.aeris-input-text--md]': 'size() === "md"',
    '[class.aeris-input-text--lg]': 'size() === "lg"',
    '[class.aeris-input-text--filled]': 'appearance() === "filled"',
    '[class.aeris-input-text--invalid]': 'invalid()',
    '[class.aeris-input-text--fluid]': 'fluid()',
    '[attr.aria-invalid]': 'invalid() || null',
  },
})
export class AerisInputTextDirective {
  readonly size = input<AerisInputTextSize>('md');
  readonly appearance = input<AerisInputTextAppearance>('outline');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
}

let inputTextId = 0;

@Component({
  selector: 'aeris-input-text',
  imports: [AerisInputTextDirective],
  template: `
    <span class="aeris-input-text-component__field">
      <input
        #textInput
        aerisInputText
        [id]="resolvedInputId()"
        [type]="type()"
        [name]="name()"
        [placeholder]="placeholder()"
        [autocomplete]="autocomplete()"
        [value]="value()"
        [size]="size()"
        [appearance]="appearance()"
        [invalid]="invalid()"
        [disabled]="effectiveDisabled()"
        [readOnly]="readonly()"
        [required]="required()"
        fluid
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-describedby]="ariaDescribedby()"
        (input)="handleInput($event)"
        (focus)="focused.emit($event)"
        (blur)="handleBlur($event)"
      />
      @if (showClearButton()) {
        <button
          type="button"
          class="aeris-input-text-component__clear"
          [attr.aria-label]="clearButtonAriaLabel()"
          (click)="clear()"
        >
          <span class="aeris-input-text-component__clear-mark" aria-hidden="true"></span>
        </button>
      }
    </span>
  `,
  styleUrl: './aeris-input-text-component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisInputTextComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisInputTextComponent implements ControlValueAccessor {
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('textInput');
  private readonly generatedId = `aeris-input-text-${++inputTextId}`;
  private readonly formDisabled = signal(false);
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly value = model('');
  readonly inputId = input('');
  readonly type = input('text');
  readonly name = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly size = input<AerisInputTextSize>('md');
  readonly appearance = input<AerisInputTextAppearance>('outline');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear value');

  readonly valueInput = output<string>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly showClearButton = computed(
    () =>
      this.clearable() &&
      this.value().length > 0 &&
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
    this.setValue((event.target as HTMLInputElement).value);
  }

  protected handleBlur(event: FocusEvent): void {
    this.touch.emit();
    this.onTouched();
    this.blurred.emit(event);
  }

  private setValue(value: string): void {
    if (this.value() === value) return;
    this.value.set(value);
    this.valueInput.emit(value);
    this.onChange(value);
  }
}

export const AerisInputText = [
  AerisInputTextDirective,
  AerisInputTextComponent,
] as const;
