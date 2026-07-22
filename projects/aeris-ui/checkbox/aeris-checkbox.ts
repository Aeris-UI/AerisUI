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

export type AerisCheckboxSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisCheckboxLabelPosition = 'start' | 'end';

export interface AerisCheckboxChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly indeterminate: boolean;
  readonly value: string;
}

let checkboxId = 0;

@Component({
  selector: 'aeris-checkbox',
  template: `
    <label
      class="aeris-checkbox"
      [attr.data-size]="size()"
      [attr.data-label-position]="labelPosition()"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-invalid]="invalid() || null"
    >
      <input
        #checkboxInput
        type="checkbox"
        [id]="resolvedInputId()"
        [name]="name()"
        [value]="value()"
        [checked]="checked()"
        [indeterminate]="indeterminate()"
        [disabled]="effectiveDisabled()"
        [required]="required()"
        [attr.tabindex]="tabIndex()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-describedby]="ariaDescribedby()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-required]="required() || null"
        (change)="handleChange($event)"
        (focus)="focused.emit($event)"
        (blur)="handleBlur($event)"
      />
      <span class="aeris-checkbox__control" aria-hidden="true">
        <span class="aeris-checkbox__icon">
          @if (indeterminate()) {
            <span class="aeris-checkbox__mixed-mark"></span>
          } @else {
            <span class="aeris-checkbox__check-mark"></span>
          }
        </span>
      </span>
      <span class="aeris-checkbox__label">
        @if (label()) {
          <span>{{ label() }}</span>
        }
        <ng-content />
      </span>
    </label>
  `,
  styleUrl: './aeris-checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisCheckbox),
      multi: true,
    },
  ],
  host: {
    '[attr.data-checked]': 'checked() || null',
    '[attr.data-indeterminate]': 'indeterminate() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
  },
})
export class AerisCheckbox implements ControlValueAccessor {
  private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('checkboxInput');
  private readonly generatedId = `aeris-checkbox-${++checkboxId}`;
  private readonly formDisabled = signal(false);
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly inputId = input('');
  readonly name = input('');
  readonly value = input('on');
  readonly label = input('');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly size = input<AerisCheckboxSize>('md');
  readonly labelPosition = input<AerisCheckboxLabelPosition>('end');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly tabIndex = input(0);

  readonly checkedInput = output<boolean>();
  readonly changed = output<AerisCheckboxChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly resolvedInputId = computed(() => this.inputId() || this.generatedId);
  protected readonly effectiveDisabled = computed(() => this.disabled() || this.formDisabled());

  focus(options?: FocusOptions): void {
    this.inputElement()?.nativeElement.focus(options);
  }

  writeValue(value: unknown): void {
    this.checked.set(Boolean(value));
  }

  registerOnChange(callback: (value: boolean) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  reset(): void {
    this.indeterminate.set(false);
    this.setChecked(false);
  }

  toggle(): void {
    if (this.effectiveDisabled()) return;
    if (this.indeterminate()) this.indeterminate.set(false);
    this.setChecked(!this.checked());
    this.focus();
  }

  protected handleChange(event: Event): void {
    if (this.effectiveDisabled()) return;
    const inputElement = event.target as HTMLInputElement;
    if (this.indeterminate()) this.indeterminate.set(false);
    this.setChecked(inputElement.checked);
    this.changed.emit({
      originalEvent: event,
      checked: inputElement.checked,
      indeterminate: false,
      value: this.value(),
    });
  }

  protected handleBlur(event: FocusEvent): void {
    this.touch.emit();
    this.onTouched();
    this.blurred.emit(event);
  }

  private setChecked(checked: boolean): void {
    if (this.checked() === checked) return;
    this.checked.set(checked);
    this.checkedInput.emit(checked);
    this.onChange(checked);
  }
}
