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

export type AerisToggleSwitchSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisToggleSwitchLabelPosition = 'start' | 'end';

export interface AerisToggleSwitchChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly value: string;
}

let toggleSwitchId = 0;

@Component({
  selector: 'aeris-toggle-switch',
  template: `
    <label
      class="aeris-toggle-switch"
      [attr.data-size]="size()"
      [attr.data-label-position]="labelPosition()"
      [attr.data-checked]="checked() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-invalid]="invalid() || null"
    >
      <input
        #switchInput
        class="aeris-toggle-switch__input"
        type="checkbox"
        role="switch"
        [id]="resolvedInputId()"
        [name]="name()"
        [value]="value()"
        [checked]="checked()"
        [disabled]="effectiveDisabled()"
        [required]="required()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledby()"
        [attr.aria-describedby]="ariaDescribedby()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-required]="required() || null"
        (change)="handleChange($event)"
        (focus)="focused.emit($event)"
        (blur)="handleBlur($event)"
      />
      <span class="aeris-toggle-switch__control" aria-hidden="true">
        <span class="aeris-toggle-switch__thumb"></span>
      </span>
      <span class="aeris-toggle-switch__label">
        @if (label()) {
          <span>{{ label() }}</span>
        }
        <ng-content />
      </span>
    </label>
  `,
  styleUrl: './aeris-toggle-switch.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisToggleSwitch),
      multi: true,
    },
  ],
  host: {
    '[attr.data-checked]': 'checked() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
  },
})
export class AerisToggleSwitch implements ControlValueAccessor {
  private readonly inputElement =
    viewChild<ElementRef<HTMLInputElement>>('switchInput');
  private readonly generatedId = `aeris-toggle-switch-${++toggleSwitchId}`;
  private readonly formDisabled = signal(false);
  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly checked = model(false);
  readonly inputId = input('');
  readonly name = input('');
  readonly value = input('on');
  readonly label = input('');
  readonly ariaLabel = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly ariaDescribedby = input<string>();
  readonly size = input<AerisToggleSwitchSize>('md');
  readonly labelPosition = input<AerisToggleSwitchLabelPosition>('end');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });

  readonly checkedInput = output<boolean>();
  readonly changed = output<AerisToggleSwitchChangeEvent>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly resolvedInputId = computed(
    () => this.inputId() || this.generatedId,
  );
  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );

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

  focus(options?: FocusOptions): void {
    this.inputElement()?.nativeElement.focus(options);
  }

  toggle(): void {
    if (this.effectiveDisabled()) {
      return;
    }

    this.setChecked(!this.checked());
    this.focus();
  }

  reset(): void {
    this.setChecked(false);
  }

  protected handleChange(event: Event): void {
    if (this.effectiveDisabled()) {
      return;
    }

    const checked = (event.target as HTMLInputElement).checked;
    this.setChecked(checked);
    this.changed.emit({
      originalEvent: event,
      checked,
      value: this.value(),
    });
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  private setChecked(checked: boolean): void {
    if (this.checked() === checked) {
      return;
    }

    this.checked.set(checked);
    this.checkedInput.emit(checked);
    this.onChange(checked);
  }
}
