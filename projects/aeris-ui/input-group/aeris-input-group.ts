import {
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
  input,
} from '@angular/core';

export type AerisInputGroupSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisInputGroupAppearance = 'outline' | 'filled';
export type AerisInputGroupMode = 'attached' | 'embedded';

@Directive({
  selector: '[aerisInputGroupAddon]',
  host: {
    class: 'aeris-input-group__addon',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class AerisInputGroupAddonDirective {
  readonly decorative = input(false, { transform: booleanAttribute });
}

@Component({
  selector: 'aeris-input-group-addon',
  template: `<ng-content />`,
  host: {
    class: 'aeris-input-group__addon',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class AerisInputGroupAddonComponent {
  readonly decorative = input(false, { transform: booleanAttribute });
}

@Directive({
  selector: '[aerisInputGroupAddonStack]',
  host: {
    class: 'aeris-input-group__stack',
  },
})
export class AerisInputGroupAddonStackDirective {}

@Component({
  selector: 'aeris-input-group-addon-stack',
  template: `<ng-content />`,
  host: {
    class: 'aeris-input-group__stack',
  },
})
export class AerisInputGroupAddonStackComponent {}

@Component({
  selector: 'aeris-input-group',
  template: `<ng-content />`,
  styleUrl: './aeris-input-group.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-input-group',
    '[class.aeris-input-group--xs]': 'size() === "xs"',
    '[class.aeris-input-group--sm]': 'size() === "sm"',
    '[class.aeris-input-group--md]': 'size() === "md"',
    '[class.aeris-input-group--lg]': 'size() === "lg"',
    '[class.aeris-input-group--filled]': 'appearance() === "filled"',
    '[class.aeris-input-group--embedded]': 'mode() === "embedded"',
    '[class.aeris-input-group--invalid]': 'invalid()',
    '[class.aeris-input-group--disabled]': 'disabled()',
    '[class.aeris-input-group--fluid]': 'fluid()',
    '[class.aeris-input-group--vertical]': 'orientation() === "vertical"',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.aria-invalid]': 'invalid() || null',
  },
})
export class AerisInputGroupComponent {
  readonly size = input<AerisInputGroupSize>('md');
  readonly appearance = input<AerisInputGroupAppearance>('outline');
  readonly mode = input<AerisInputGroupMode>('attached');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
}

export const AerisInputGroup = [
  AerisInputGroupComponent,
  AerisInputGroupAddonDirective,
  AerisInputGroupAddonComponent,
  AerisInputGroupAddonStackDirective,
  AerisInputGroupAddonStackComponent,
] as const;
