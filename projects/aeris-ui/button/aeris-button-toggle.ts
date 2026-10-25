import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import type { FormCheckboxControl } from '@angular/forms/signals';
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';
import { aerisInternalButtonSelection } from './aeris-button-selection';

/** Opt-in pressed behavior for a native Aeris button; not a navigation anchor. */
@Directive({
  selector: 'button[aerisButton][aerisButtonToggle]',
  providers: [
    { provide: aerisInternalButtonSelection, useExisting: forwardRef(() => AerisButtonToggle) },
  ],
  host: {
    type: 'button',
    '[attr.aria-pressed]': 'checked()',
    '[attr.data-selected]': 'checked()',
    '[attr.aria-invalid]': 'displayInvalid() || null',
    '(click)': 'activate()',
    '(blur)': 'markTouched()',
  },
})
export class AerisButtonToggle implements Pick<FormCheckboxControl, 'checked'> {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  readonly touch = output<void>();
  private readonly formDisabled = signal(false);
  readonly selectionDisabled = computed(() => this.disabled() || this.formDisabled());
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected activate(): void {
    if (this.selectionDisabled() || this.element.nativeElement.disabled) return;
    this.checked.update((value) => !value);
  }

  protected markTouched(): void {
    this.touch.emit();
  }

  /** @internal Classic-forms adapter bridge; Signal Forms uses the disabled input. */
  aerisInternalSetDisabled(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
