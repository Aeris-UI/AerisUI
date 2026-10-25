import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { ɵaerisDisplayInvalid } from '@aeris-ui/core';

export type AerisNativeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisNativeSelectAppearance = 'outline' | 'filled';

/** Styles a native select without replacing its value accessor or browser picker. */
@Directive({
  selector: 'select[aerisNativeSelect]',
  host: {
    class: 'aeris-native-select',
    '[attr.data-control-size]': 'controlSize()',
    '[attr.data-appearance]': 'appearance()',
    '[class.aeris-native-select--fluid]': 'fluid()',
    '[class.aeris-native-select--invalid]': 'displayInvalid()',
    '[attr.aria-invalid]': 'displayInvalid() || null',
  },
})
export class AerisNativeSelect {
  readonly controlSize = input<AerisNativeSelectSize>('md');
  readonly appearance = input<AerisNativeSelectAppearance>('outline');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input<boolean | null>(null);
  protected readonly displayInvalid = computed(() =>
    ɵaerisDisplayInvalid(this.invalid(), this.touched()),
  );
}
