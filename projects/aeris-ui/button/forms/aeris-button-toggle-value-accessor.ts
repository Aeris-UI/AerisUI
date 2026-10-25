import { DestroyRef, Directive, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { AerisButtonToggle } from '@aeris-ui/core/button';

/** @internal Only instantiated for classic Angular forms, not ordinary/Signal Forms buttons. */
@Directive({
  selector:
    'button[aerisButtonToggle][formControl], button[aerisButtonToggle][formControlName], button[aerisButtonToggle][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisButtonToggleValueAccessor),
      multi: true,
    },
  ],
  host: { '(blur)': 'onTouched()' },
})
export class AerisButtonToggleValueAccessor implements ControlValueAccessor {
  private readonly toggle = inject(AerisButtonToggle);
  private writing = false;
  private onChange: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  constructor() {
    const subscription = this.toggle.checked.subscribe((value) => {
      if (!this.writing) this.onChange(value);
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  writeValue(value: unknown): void {
    this.writing = true;
    try {
      this.toggle.checked.set(value === true);
    } finally {
      this.writing = false;
    }
  }
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.toggle.aerisInternalSetDisabled(disabled);
  }
}
