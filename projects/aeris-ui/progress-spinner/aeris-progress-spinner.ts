import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

export type AerisProgressSpinnerSize = 'sm' | 'md' | 'lg';
export type AerisProgressSpinnerTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

export interface AerisProgressSpinnerValueContext {
  readonly $implicit: number;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
}

@Directive({ selector: 'ng-template[aerisProgressSpinnerValue]' })
export class AerisProgressSpinnerValueTemplate {
  readonly template = inject<TemplateRef<AerisProgressSpinnerValueContext>>(TemplateRef);
}

function nullableNumberAttribute(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

@Component({
  selector: 'aeris-progress-spinner',
  imports: [NgTemplateOutlet],
  template: `
    <svg
      class="aeris-progress-spinner__graphic"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      @if (showTrack()) {
        <circle
          class="aeris-progress-spinner__track"
          cx="24"
          cy="24"
          r="20"
          fill="none"
          [attr.stroke-width]="resolvedStrokeWidth()"
        />
      }
      <circle
        class="aeris-progress-spinner__indicator"
        cx="24"
        cy="24"
        r="20"
        fill="none"
        [attr.stroke-width]="resolvedStrokeWidth()"
        [attr.stroke-linecap]="rounded() ? 'round' : 'butt'"
        [attr.stroke-dasharray]="circumference"
        [attr.stroke-dashoffset]="determinate() ? dashOffset() : null"
      />
    </svg>

    @if (determinate() && showValue()) {
      <span class="aeris-progress-spinner__value" aria-hidden="true">
        @if (valueTemplate(); as template) {
          <ng-container
            [ngTemplateOutlet]="template.template"
            [ngTemplateOutletContext]="valueContext()"
          />
        } @else {
          {{ valueText() }}
        }
      </span>
    }
  `,
  styleUrl: './aeris-progress-spinner.scss',
  host: {
    class: 'aeris-progress-spinner',
    role: 'progressbar',
    '[attr.aria-valuemin]': 'determinate() ? normalizedMin() : null',
    '[attr.aria-valuemax]': 'determinate() ? normalizedMax() : null',
    '[attr.aria-valuenow]': 'determinate() ? clampedValue() : null',
    '[attr.aria-valuetext]': 'resolvedAriaValueText()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.data-mode]': 'determinate() ? "determinate" : "indeterminate"',
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-track]': 'showTrack() || null',
    '[attr.data-rounded]': 'rounded() || null',
  },
})
export class AerisProgressSpinner {
  protected readonly circumference = 2 * Math.PI * 20;
  protected readonly valueTemplate = contentChild(AerisProgressSpinnerValueTemplate);

  readonly value = input<number | null>(null, { transform: nullableNumberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly size = input<AerisProgressSpinnerSize>('md');
  readonly tone = input<AerisProgressSpinnerTone>('primary');
  readonly strokeWidth = input(4, { transform: numberAttribute });
  readonly showTrack = input(true, { transform: booleanAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly rounded = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Loading');
  readonly ariaLabelledBy = input('');
  readonly ariaValueText = input('');
  readonly valueFormatter = input<((context: AerisProgressSpinnerValueContext) => string) | null>(
    null,
  );

  protected readonly determinate = computed(() => this.value() !== null);

  protected readonly normalizedMin = computed(() => {
    const min = this.min();
    return Number.isFinite(min) ? min : 0;
  });

  protected readonly normalizedMax = computed(() => {
    const min = this.normalizedMin();
    const max = this.max();
    return Number.isFinite(max) && max > min ? max : min + 100;
  });

  protected readonly clampedValue = computed(() => {
    const value = this.value();
    const min = this.normalizedMin();
    const max = this.normalizedMax();
    if (value === null || !Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  });

  protected readonly percent = computed(() => {
    const range = this.normalizedMax() - this.normalizedMin();
    return this.round(((this.clampedValue() - this.normalizedMin()) / range) * 100);
  });

  protected readonly dashOffset = computed(
    () => this.circumference - (this.percent() / 100) * this.circumference,
  );

  protected readonly resolvedStrokeWidth = computed(() => {
    const width = this.strokeWidth();
    if (!Number.isFinite(width)) return 4;
    return Math.min(12, Math.max(1, width));
  });

  protected readonly valueContext = computed<AerisProgressSpinnerValueContext>(() => ({
    $implicit: this.clampedValue(),
    value: this.clampedValue(),
    min: this.normalizedMin(),
    max: this.normalizedMax(),
    percent: this.percent(),
  }));

  protected readonly valueText = computed(() => {
    const formatter = this.valueFormatter();
    if (formatter) return formatter(this.valueContext());
    return `${Math.round(this.percent())}%`;
  });

  protected readonly resolvedAriaValueText = computed(() => {
    if (this.ariaValueText()) return this.ariaValueText();
    return this.determinate() ? this.valueText() : null;
  });

  private round(value: number): number {
    return Math.round(value * 10) / 10;
  }
}

export const AerisProgressSpinnerModule = [
  AerisProgressSpinner,
  AerisProgressSpinnerValueTemplate,
] as const;
