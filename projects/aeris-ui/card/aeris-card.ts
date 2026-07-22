import {
  Component,
  Directive,
  ViewEncapsulation,
  booleanAttribute,
  contentChild,
  input,
} from '@angular/core';

export type AerisCardVariant = 'outlined' | 'elevated' | 'filled';
export type AerisCardOrientation = 'vertical' | 'horizontal';
export type AerisCardPadding = 'none' | 'sm' | 'md' | 'lg';
export type AerisCardRole = 'article' | 'region' | 'group';

@Directive({
  selector: '[aerisCardMedia]',
  host: { class: 'aeris-card__media' },
})
export class AerisCardMedia {}

@Directive({
  selector: '[aerisCardHeader]',
  host: { class: 'aeris-card__header' },
})
export class AerisCardHeader {}

@Directive({
  selector: '[aerisCardTitle]',
  host: { class: 'aeris-card__title' },
})
export class AerisCardTitle {}

@Directive({
  selector: '[aerisCardSubtitle]',
  host: { class: 'aeris-card__subtitle' },
})
export class AerisCardSubtitle {}

@Directive({
  selector: '[aerisCardFooter]',
  host: { class: 'aeris-card__footer' },
})
export class AerisCardFooter {}

@Component({
  selector: 'aeris-card',
  template: `
    <div
      class="aeris-card"
      [attr.data-variant]="variant()"
      [attr.data-orientation]="orientation()"
      [attr.data-padding]="padding()"
      [attr.data-hoverable]="hoverable() || null"
      [attr.data-has-media]="media() ? 'true' : null"
    >
      <ng-content select="[aerisCardMedia]" />
      <div class="aeris-card__body">
        <ng-content select="[aerisCardHeader]" />
        <div class="aeris-card__content"><ng-content /></div>
        <ng-content select="[aerisCardFooter]" />
      </div>
    </div>
  `,
  styleUrl: './aeris-card.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.role]': 'semanticRole()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.aria-describedby]': 'ariaDescribedBy() || null',
  },
})
export class AerisCard {
  readonly variant = input<AerisCardVariant>('outlined');
  readonly orientation = input<AerisCardOrientation>('vertical');
  readonly padding = input<AerisCardPadding>('md');
  readonly hoverable = input(false, { transform: booleanAttribute });
  readonly semanticRole = input<AerisCardRole | null>(null, { alias: 'role' });
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaDescribedBy = input('');

  protected readonly media = contentChild(AerisCardMedia);
}

export const AerisCardModule = [
  AerisCard,
  AerisCardMedia,
  AerisCardHeader,
  AerisCardTitle,
  AerisCardSubtitle,
  AerisCardFooter,
] as const;
