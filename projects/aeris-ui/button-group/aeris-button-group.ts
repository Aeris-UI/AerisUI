import { Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

export type AerisButtonGroupOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'aeris-button-group',
  template: '<ng-content />',
  styleUrl: './aeris-button-group.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-button-group',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-responsive]': 'responsive() || null',
  },
})
export class AerisButtonGroupComponent {
  readonly ariaLabel = input<string>();
  readonly ariaLabelledBy = input<string>();
  readonly orientation = input<AerisButtonGroupOrientation>('horizontal');
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly responsive = input(false, { transform: booleanAttribute });
}

export const AerisButtonGroup = [
  AerisButtonGroupComponent,
  AerisButton,
] as const;
