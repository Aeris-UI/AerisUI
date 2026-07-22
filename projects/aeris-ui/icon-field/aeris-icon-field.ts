import {
  Component,
  Directive,
  booleanAttribute,
  input,
  ViewEncapsulation,
} from '@angular/core';

export type AerisIconFieldSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisIconFieldAppearance = 'outline' | 'filled';
export type AerisIconFieldDensity = 'comfortable' | 'compact';

@Directive({
  selector: '[aerisIcon]',
  host: {
    class: 'aeris-icon-field__icon',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class AerisIconDirective {
  readonly decorative = input(true, { transform: booleanAttribute });
}

@Directive({
  selector: '[aerisIconStart]',
  host: {
    class: 'aeris-icon-field__icon aeris-icon-field__icon--start',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class AerisIconStartDirective {
  readonly decorative = input(true, { transform: booleanAttribute });
}

@Directive({
  selector: '[aerisIconEnd]',
  host: {
    class: 'aeris-icon-field__icon aeris-icon-field__icon--end',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
  },
})
export class AerisIconEndDirective {
  readonly decorative = input(true, { transform: booleanAttribute });
}

@Component({
  selector: 'aeris-icon-field',
  template: `
    <span class="aeris-icon-field__content">
      <ng-content select="[aerisIconStart]" />
      <ng-content select="[aerisIcon]" />
      <ng-content />
      <ng-content select="[aerisIconEnd]" />
    </span>
  `,
  styleUrl: './aeris-icon-field.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aeris-icon-field',
    '[class.aeris-icon-field--xs]': 'size() === "xs"',
    '[class.aeris-icon-field--sm]': 'size() === "sm"',
    '[class.aeris-icon-field--md]': 'size() === "md"',
    '[class.aeris-icon-field--lg]': 'size() === "lg"',
    '[class.aeris-icon-field--filled]': 'appearance() === "filled"',
    '[class.aeris-icon-field--invalid]': 'invalid()',
    '[class.aeris-icon-field--disabled]': 'disabled()',
    '[class.aeris-icon-field--readonly]': 'readonly()',
    '[class.aeris-icon-field--compact]': 'density() === "compact"',
    '[class.aeris-icon-field--fluid]': 'fluid()',
    '[class.aeris-icon-field--left]': 'iconPosition() === "left"',
    '[class.aeris-icon-field--right]': 'iconPosition() === "right"',
    '[attr.data-fluid]': 'fluid() || null',
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-invalid]': 'invalid() || null',
    '[attr.aria-invalid]': 'invalid() || null',
  },
})
export class AerisIconFieldComponent {
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly size = input<AerisIconFieldSize>('md');
  readonly appearance = input<AerisIconFieldAppearance>('outline');
  readonly density = input<AerisIconFieldDensity>('comfortable');
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
}

export const AerisIconField = [
  AerisIconFieldComponent,
  AerisIconDirective,
  AerisIconStartDirective,
  AerisIconEndDirective,
] as const;
