import { Component, booleanAttribute, input } from '@angular/core';

export type AerisDividerOrientation = 'horizontal' | 'vertical';
export type AerisDividerAlign = 'start' | 'center' | 'end';
export type AerisDividerLineStyle = 'solid' | 'dashed' | 'dotted';
export type AerisDividerSpacing = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'aeris-divider',
  template: `
    <span class="aeris-divider__line" aria-hidden="true"></span>
    <span class="aeris-divider__content"><ng-content /></span>
    <span class="aeris-divider__line" aria-hidden="true"></span>
  `,
  styleUrl: './aeris-divider.scss',
  host: {
    class: 'aeris-divider',
    '[attr.role]': 'decorative() ? "none" : "separator"',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
    '[attr.aria-orientation]': 'decorative() ? null : orientation()',
    '[attr.aria-label]': 'decorative() ? null : ariaLabel() || null',
    '[attr.aria-labelledby]': 'decorative() ? null : ariaLabelledBy() || null',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-align]': 'align()',
    '[attr.data-line-style]': 'lineStyle()',
    '[attr.data-spacing]': 'spacing()',
  },
})
export class AerisDivider {
  readonly orientation = input<AerisDividerOrientation>('horizontal');
  readonly align = input<AerisDividerAlign>('center');
  readonly lineStyle = input<AerisDividerLineStyle>('solid');
  readonly spacing = input<AerisDividerSpacing>('md');
  readonly decorative = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
}

export const AerisDividerModule = [AerisDivider] as const;
