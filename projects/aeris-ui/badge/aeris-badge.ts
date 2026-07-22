import { Component, booleanAttribute, computed, input } from '@angular/core';

export type AerisBadgeSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

export type AerisBadgeSize = 'sm' | 'md' | 'lg';
export type AerisBadgeVariant = 'solid' | 'soft' | 'outline';
export type AerisBadgeShape = 'pill' | 'rounded';
export type AerisBadgeRole = 'status' | 'note' | '';
export type AerisBadgeOverlayPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

const nullableNumberAttribute = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

@Component({
  selector: 'aeris-badge',
  template: `
    @if (!dot()) {
      @if (hasInputValue()) {
        {{ displayValue() }}
      } @else {
        <ng-content />
      }
    }
  `,
  styleUrl: './aeris-badge.scss',
  host: {
    class: 'aeris-badge',
    '[attr.role]': 'isHiddenFromAssistiveTechnology() ? null : role() || null',
    '[attr.aria-hidden]': 'isHiddenFromAssistiveTechnology() ? "true" : null',
    '[attr.aria-label]': 'isHiddenFromAssistiveTechnology() ? null : ariaLabel() || null',
    '[attr.aria-labelledby]': 'isHiddenFromAssistiveTechnology() ? null : ariaLabelledBy() || null',
    '[attr.data-severity]': 'severity()',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-dot]': 'dot() || null',
    '[attr.data-hidden]': 'resolvedHidden() || null',
  },
})
export class AerisBadge {
  readonly value = input<string | number | null | undefined>(undefined);
  readonly severity = input<AerisBadgeSeverity>('primary');
  readonly size = input<AerisBadgeSize>('md');
  readonly variant = input<AerisBadgeVariant>('solid');
  readonly shape = input<AerisBadgeShape>('pill');
  readonly max = input<number | null>(null, { transform: nullableNumberAttribute });
  readonly dot = input(false, { transform: booleanAttribute });
  readonly showZero = input(true, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly decorative = input(false, { transform: booleanAttribute });
  readonly role = input<AerisBadgeRole>('');
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');

  protected readonly hasInputValue = computed(() => {
    const value = this.value();
    return value !== undefined && value !== null && value !== '';
  });

  protected readonly displayValue = computed(() => {
    const value = this.value();
    const max = this.max();

    if (typeof value === 'number' && max !== null && value > max) {
      return `${max}+`;
    }

    return `${value ?? ''}`;
  });

  protected readonly resolvedHidden = computed(() => {
    if (this.hidden()) return true;

    const value = this.value();
    return !this.showZero() && (value === 0 || value === '0');
  });

  protected readonly isHiddenFromAssistiveTechnology = computed(
    () => this.decorative() || this.resolvedHidden(),
  );
}

@Component({
  selector: 'aeris-badge-overlay',
  imports: [AerisBadge],
  template: `
    <ng-content />
    @if (!resolvedHidden()) {
      <aeris-badge
        class="aeris-badge-overlay__badge"
        decorative
        [value]="value()"
        [severity]="severity()"
        [size]="size()"
        [variant]="variant()"
        [shape]="shape()"
        [max]="max()"
        [dot]="dot()"
        [showZero]="showZero()"
      />
    }
  `,
  styleUrl: './aeris-badge.scss',
  host: {
    class: 'aeris-badge-overlay',
    '[attr.data-position]': 'position()',
  },
})
export class AerisBadgeOverlay {
  readonly value = input<string | number | null | undefined>(undefined);
  readonly severity = input<AerisBadgeSeverity>('primary');
  readonly size = input<AerisBadgeSize>('md');
  readonly variant = input<AerisBadgeVariant>('solid');
  readonly shape = input<AerisBadgeShape>('pill');
  readonly max = input<number | null>(null, { transform: nullableNumberAttribute });
  readonly dot = input(false, { transform: booleanAttribute });
  readonly showZero = input(true, { transform: booleanAttribute });
  readonly hidden = input(false, { transform: booleanAttribute });
  readonly position = input<AerisBadgeOverlayPosition>('top-right');

  protected readonly resolvedHidden = computed(() => {
    if (this.hidden()) return true;

    const value = this.value();
    return !this.showZero() && (value === 0 || value === '0');
  });
}

export const AerisBadgeModule = [AerisBadge, AerisBadgeOverlay] as const;
