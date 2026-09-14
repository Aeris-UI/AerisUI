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
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';

export type AerisRadioButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisRadioButtonLabelPosition = 'start' | 'end';

export interface AerisRadioButtonChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
}

let nextRadioButtonId = 0;

@Component({
  selector: 'aeris-radio-button',
  template: `
    <label
      class="aeris-radio"
      [class.aeris-radio--label-start]="labelPosition() === 'start'"
      [attr.data-size]="size()"
      [attr.data-selected]="isSelected()"
      [attr.data-disabled]="effectiveDisabled()"
      [attr.data-invalid]="displayInvalid() || null"
    >
      <input
        #radioInput
        class="aeris-radio__input"
        type="radio"
        [id]="resolvedInputId()"
        [name]="name()"
        [value]="value()"
        [checked]="isSelected()"
        [disabled]="effectiveDisabled()"
        [required]="required()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="displayInvalid() || null"
        [attr.aria-required]="required() || null"
        (change)="handleChange($event)"
        (focus)="focused.emit($event)"
        (blur)="handleBlur($event)"
      />
      <span class="aeris-radio__control" aria-hidden="true">
        <span class="aeris-radio__dot"></span>
      </span>
      <span class="aeris-radio__label">
        @if (label()) {
          {{ label() }}
        } @else {
          <ng-content />
        }
      </span>
    </label>
  `,
  styleUrl: './aeris-radio-button.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisRadioButton),
      multi: true,
    },
  ],
  host: {
    '[attr.data-selected]': 'isSelected()',
    '[attr.data-disabled]': 'effectiveDisabled()',
  },
})
export class AerisRadioButton implements ControlValueAccessor {
  readonly selected = model<string | null>(null);
  readonly value = input.required<string>();
  readonly name = input('');
  readonly inputId = input('');
  readonly label = input('');
  readonly size = input<AerisRadioButtonSize>('md');
  readonly labelPosition = input<AerisRadioButtonLabelPosition>('end');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  readonly changed = output<AerisRadioButtonChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  private readonly generatedId = `aeris-radio-${++nextRadioButtonId}`;
  protected readonly formDisabled = signal(false);
  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly isSelected = computed(() => this.selected() === this.value());

  private readonly radioInput = viewChild<ElementRef<HTMLInputElement>>('radioInput');
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.selected.set(value == null ? null : String(value));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  focus(options?: FocusOptions): void {
    this.radioInput()?.nativeElement.focus(options);
  }

  select(): void {
    if (this.effectiveDisabled() || this.isSelected()) {
      return;
    }

    this.updateSelection();
    this.focus();
  }

  protected handleChange(event: Event): void {
    if (this.effectiveDisabled()) {
      return;
    }

    this.updateSelection();
    this.changed.emit({ originalEvent: event, value: this.value() });
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  private updateSelection(): void {
    const value = this.value();
    this.selected.set(value);
    this.onChange(value);
  }
}
