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

export type AerisProgressBarMode = 'determinate' | 'indeterminate';
export type AerisProgressBarSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';
export type AerisProgressBarSize = 'sm' | 'md' | 'lg';

export interface AerisProgressBarStep {
  readonly label: string;
  readonly value?: number;
}

export interface AerisProgressBarValueContext {
  readonly $implicit: number;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
}

export interface AerisProgressBarStepContext {
  readonly $implicit: AerisProgressBarStep;
  readonly step: AerisProgressBarStep;
  readonly index: number;
  readonly active: boolean;
  readonly complete: boolean;
  readonly percent: number;
}

@Directive({ selector: 'ng-template[aerisProgressBarValue]' })
export class AerisProgressBarValueTemplate {
  readonly template = inject<TemplateRef<AerisProgressBarValueContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisProgressBarStep]' })
export class AerisProgressBarStepTemplate {
  readonly template = inject<TemplateRef<AerisProgressBarStepContext>>(TemplateRef);
}

interface AerisProgressBarStepView {
  readonly step: AerisProgressBarStep;
  readonly index: number;
  readonly active: boolean;
  readonly complete: boolean;
  readonly percent: string;
  readonly context: AerisProgressBarStepContext;
}

let nextProgressBarId = 0;

@Component({
  selector: 'aeris-progress-bar',
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-progress-bar__track">
      <span class="aeris-progress-bar__fill" [style.inline-size.%]="mode() === 'determinate' ? percent() : null"></span>
      @if (showValue() && mode() === 'determinate') {
        <span class="aeris-progress-bar__value">
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
    </div>

    @if (stepViews().length > 0) {
      <ol class="aeris-progress-bar__steps" aria-hidden="true">
        @for (item of stepViews(); track item.index) {
          <li
            class="aeris-progress-bar__step"
            [attr.data-active]="item.active || null"
            [attr.data-complete]="item.complete || null"
            [style.--aeris-progress-bar-step-position]="item.percent"
          >
            <span class="aeris-progress-bar__step-marker"></span>
            <span class="aeris-progress-bar__step-label">
              @if (stepTemplate(); as template) {
                <ng-container
                  [ngTemplateOutlet]="template.template"
                  [ngTemplateOutletContext]="item.context"
                />
              } @else {
                {{ item.step.label }}
              }
            </span>
          </li>
        }
      </ol>
    }
  `,
  styleUrl: './aeris-progress-bar.scss',
  host: {
    class: 'aeris-progress-bar',
    '[attr.id]': 'id()',
    role: 'progressbar',
    '[attr.aria-valuemin]': 'mode() === "determinate" ? min() : null',
    '[attr.aria-valuemax]': 'mode() === "determinate" ? max() : null',
    '[attr.aria-valuenow]': 'mode() === "determinate" ? clampedValue() : null',
    '[attr.aria-valuetext]': 'resolvedAriaValueText()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.data-mode]': 'mode()',
    '[attr.data-severity]': 'severity()',
    '[attr.data-size]': 'size()',
    '[attr.data-striped]': 'striped() || null',
    '[attr.data-animated]': 'animated() || null',
    '[attr.data-rounded]': 'rounded() || null',
    '[style.--aeris-progress-bar-value]': 'percentStyle()',
  },
})
export class AerisProgressBar {
  protected readonly valueTemplate = contentChild(AerisProgressBarValueTemplate);
  protected readonly stepTemplate = contentChild(AerisProgressBarStepTemplate);

  readonly id = input(`aeris-progress-bar-${++nextProgressBarId}`);
  readonly value = input(0, { transform: numberAttribute });
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly mode = input<AerisProgressBarMode>('determinate');
  readonly severity = input<AerisProgressBarSeverity>('primary');
  readonly size = input<AerisProgressBarSize>('md');
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly striped = input(false, { transform: booleanAttribute });
  readonly animated = input(false, { transform: booleanAttribute });
  readonly rounded = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('');
  readonly ariaLabelledBy = input('');
  readonly ariaValueText = input('');
  readonly steps = input<readonly AerisProgressBarStep[]>([]);
  readonly activeStep = input<number | null>(null);
  readonly valueFormatter = input<((context: AerisProgressBarValueContext) => string) | null>(null);

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
    return this.clamp(
      Number.isFinite(value) ? value : this.normalizedMin(),
      this.normalizedMin(),
      this.normalizedMax(),
    );
  });

  protected readonly percent = computed(() => {
    const min = this.normalizedMin();
    const max = this.normalizedMax();
    const range = max - min;
    if (range <= 0) return 0;
    return Math.round(((this.clampedValue() - min) / range) * 1000) / 10;
  });

  protected readonly percentStyle = computed(() => `${this.percent()}%`);

  protected readonly valueContext = computed<AerisProgressBarValueContext>(() => ({
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
    if (this.mode() !== 'determinate') return this.ariaValueText() || null;
    return this.ariaValueText() || this.valueText();
  });

  protected readonly stepViews = computed<readonly AerisProgressBarStepView[]>(() => {
    const steps = this.steps();
    if (steps.length === 0) return [];

    const activeStep = this.activeStep();
    const denominator = Math.max(1, steps.length - 1);
    return steps.map((step, index) => {
      const fallbackPercent = steps.length === 1 ? 100 : (index / denominator) * 100;
      const stepPercent = this.stepPercent(step.value, fallbackPercent);
      const active = activeStep === null ? this.percent() >= stepPercent : activeStep === index;
      const complete = activeStep === null ? this.percent() >= stepPercent : index <= activeStep;
      return {
        step,
        index,
        active,
        complete,
        percent: `${stepPercent}%`,
        context: {
          $implicit: step,
          step,
          index,
          active,
          complete,
          percent: stepPercent,
        },
      };
    });
  });

  private stepPercent(value: number | undefined, fallback: number): number {
    if (value === undefined || !Number.isFinite(value)) return this.clamp(fallback, 0, 100);

    const min = this.normalizedMin();
    const max = this.normalizedMax();
    return this.clamp(((value - min) / (max - min)) * 100, 0, 100);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

export const AerisProgressBarModule = [
  AerisProgressBar,
  AerisProgressBarValueTemplate,
  AerisProgressBarStepTemplate,
] as const;
