import { Component, ViewEncapsulation, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'aeris-fluid',
  template: `<ng-content />`,
  styleUrl: './aeris-fluid.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-fluid',
    '[attr.data-enabled]': 'enabled()',
  },
})
export class AerisFluid {
  readonly enabled = input(true, { transform: booleanAttribute });
}

export const AerisFluidModule = [AerisFluid] as const;
