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

export type AerisMeterGroupOrientation = 'horizontal' | 'vertical';
export type AerisMeterGroupLegendLayout = 'auto' | 'row' | 'column';
export type AerisMeterGroupLegendPosition = 'before' | 'after';
export type AerisMeterGroupSize = 'sm' | 'md' | 'lg';
export type AerisMeterGroupTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

export interface AerisMeterGroupItem {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
  readonly tone?: AerisMeterGroupTone;
}

export interface AerisMeterGroupItemContext {
  readonly $implicit: AerisMeterGroupItem;
  readonly item: AerisMeterGroupItem;
  readonly index: number;
  readonly value: number;
  readonly percent: number;
  readonly formattedValue: string;
}

export interface AerisMeterGroupSummaryContext {
  readonly $implicit: number;
  readonly total: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
  readonly remaining: number;
}

@Directive({ selector: 'ng-template[aerisMeterGroupLabel]' })
export class AerisMeterGroupLabelTemplate {
  readonly template = inject<TemplateRef<AerisMeterGroupItemContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMeterGroupSegment]' })
export class AerisMeterGroupSegmentTemplate {
  readonly template = inject<TemplateRef<AerisMeterGroupItemContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMeterGroupHeader]' })
export class AerisMeterGroupHeaderTemplate {
  readonly template = inject<TemplateRef<AerisMeterGroupSummaryContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisMeterGroupFooter]' })
export class AerisMeterGroupFooterTemplate {
  readonly template = inject<TemplateRef<AerisMeterGroupSummaryContext>>(TemplateRef);
}

interface AerisMeterGroupItemView {
  readonly item: AerisMeterGroupItem;
  readonly index: number;
  readonly value: number;
  readonly percent: number;
  readonly renderPercent: number;
  readonly formattedValue: string;
  readonly tone: AerisMeterGroupTone;
  readonly color: string | null;
  readonly context: AerisMeterGroupItemContext;
}

@Component({
  selector: 'aeris-meter-group',
  imports: [NgTemplateOutlet],
  template: `
    @if (headerTemplate(); as header) {
      <div class="aeris-meter-group__header">
        <ng-container
          [ngTemplateOutlet]="header.template"
          [ngTemplateOutletContext]="summaryContext()"
        />
      </div>
    }

    <div class="aeris-meter-group__layout">
      @if (showLegend() && legendPosition() === 'before') {
        <ng-container [ngTemplateOutlet]="legend" />
      }

      <div
        class="aeris-meter-group__track"
        role="meter"
        [attr.aria-valuemin]="normalizedMin()"
        [attr.aria-valuemax]="normalizedMax()"
        [attr.aria-valuenow]="total()"
        [attr.aria-valuetext]="resolvedAriaValueText()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-labelledby]="ariaLabelledBy() || null"
      >
        @for (view of itemViews(); track view.index) {
          @if (view.renderPercent > 0) {
            <span
              class="aeris-meter-group__segment"
              aria-hidden="true"
              [attr.data-tone]="view.tone"
              [style.background-color]="view.color"
              [style.--aeris-meter-group-segment-size]="view.renderPercent + '%'"
            >
              @if (segmentTemplate(); as segment) {
                <ng-container
                  [ngTemplateOutlet]="segment.template"
                  [ngTemplateOutletContext]="view.context"
                />
              }
            </span>
          }
        }
      </div>

      @if (showLegend() && legendPosition() === 'after') {
        <ng-container [ngTemplateOutlet]="legend" />
      }
    </div>

    @if (footerTemplate(); as footer) {
      <div class="aeris-meter-group__footer">
        <ng-container
          [ngTemplateOutlet]="footer.template"
          [ngTemplateOutletContext]="summaryContext()"
        />
      </div>
    }

    <ng-template #legend>
      <ul class="aeris-meter-group__legend">
        @for (view of itemViews(); track view.index) {
          <li class="aeris-meter-group__legend-item">
            <span class="aeris-meter-group__accessible">
              {{ view.item.label }}: {{ view.formattedValue }}
            </span>
            <span class="aeris-meter-group__legend-visible" aria-hidden="true">
              <span
                class="aeris-meter-group__marker"
                [attr.data-tone]="view.tone"
                [style.background-color]="view.color"
              ></span>
              <span class="aeris-meter-group__label">
                @if (labelTemplate(); as label) {
                  <ng-container
                    [ngTemplateOutlet]="label.template"
                    [ngTemplateOutletContext]="view.context"
                  />
                } @else {
                  {{ view.item.label }}
                }
              </span>
              @if (showValues()) {
                <span class="aeris-meter-group__value">{{ view.formattedValue }}</span>
              }
            </span>
          </li>
        }
      </ul>
    </ng-template>
  `,
  styleUrl: './aeris-meter-group.scss',
  host: {
    class: 'aeris-meter-group',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-legend-layout]': 'resolvedLegendLayout()',
    '[attr.data-legend-position]': 'legendPosition()',
    '[attr.data-size]': 'size()',
    '[attr.data-rounded]': 'rounded() || null',
    '[attr.data-empty]': 'itemViews().length === 0 || null',
  },
})
export class AerisMeterGroup {
  private readonly defaultTones: readonly AerisMeterGroupTone[] = [
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'secondary',
    'neutral',
    'contrast',
  ];

  readonly items = input<readonly AerisMeterGroupItem[]>([]);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly orientation = input<AerisMeterGroupOrientation>('horizontal');
  readonly legendLayout = input<AerisMeterGroupLegendLayout>('auto');
  readonly legendPosition = input<AerisMeterGroupLegendPosition>('after');
  readonly size = input<AerisMeterGroupSize>('md');
  readonly showLegend = input(true, { transform: booleanAttribute });
  readonly showValues = input(true, { transform: booleanAttribute });
  readonly rounded = input(true, { transform: booleanAttribute });
  readonly valueSuffix = input('%');
  readonly ariaLabel = input('Meter group');
  readonly ariaLabelledBy = input('');
  readonly ariaValueText = input('');
  readonly valueFormatter = input<((context: AerisMeterGroupItemContext) => string) | null>(null);

  protected readonly labelTemplate = contentChild(AerisMeterGroupLabelTemplate);
  protected readonly segmentTemplate = contentChild(AerisMeterGroupSegmentTemplate);
  protected readonly headerTemplate = contentChild(AerisMeterGroupHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisMeterGroupFooterTemplate);

  protected readonly normalizedMin = computed(() => {
    const min = this.min();
    return Number.isFinite(min) ? min : 0;
  });

  protected readonly normalizedMax = computed(() => {
    const min = this.normalizedMin();
    const max = this.max();
    return Number.isFinite(max) && max > min ? max : min + 100;
  });

  protected readonly range = computed(() => this.normalizedMax() - this.normalizedMin());

  protected readonly itemViews = computed<readonly AerisMeterGroupItemView[]>(() => {
    let remainingPercent = 100;
    return this.items().map((item, index) => {
      const value = Number.isFinite(item.value) ? Math.max(0, item.value) : 0;
      const percent = this.round((value / this.range()) * 100);
      const renderPercent = this.round(Math.min(percent, remainingPercent));
      remainingPercent = Math.max(0, remainingPercent - renderPercent);
      const baseContext: AerisMeterGroupItemContext = {
        $implicit: item,
        item,
        index,
        value,
        percent,
        formattedValue: '',
      };
      const formattedValue =
        this.valueFormatter()?.(baseContext) ?? `${this.formatNumber(value)}${this.valueSuffix()}`;
      const context = { ...baseContext, formattedValue };
      return {
        item,
        index,
        value,
        percent,
        renderPercent,
        formattedValue,
        tone: item.tone ?? this.defaultTones[index % this.defaultTones.length] ?? 'primary',
        color: typeof item.color === 'string' ? item.color.trim() || null : null,
        context,
      };
    });
  });

  protected readonly total = computed(() => {
    const contributions = this.itemViews().reduce((sum, view) => sum + view.value, 0);
    return this.round(
      Math.min(
        this.normalizedMax(),
        Math.max(this.normalizedMin(), this.normalizedMin() + contributions),
      ),
    );
  });

  protected readonly totalPercent = computed(() =>
    this.round(((this.total() - this.normalizedMin()) / this.range()) * 100),
  );

  protected readonly summaryContext = computed<AerisMeterGroupSummaryContext>(() => ({
    $implicit: this.total(),
    total: this.total(),
    min: this.normalizedMin(),
    max: this.normalizedMax(),
    percent: this.totalPercent(),
    remaining: this.round(Math.max(0, this.normalizedMax() - this.total())),
  }));

  protected readonly resolvedLegendLayout = computed(() => {
    const layout = this.legendLayout();
    if (layout !== 'auto') return layout;
    return this.orientation() === 'vertical' ? 'column' : 'row';
  });

  protected readonly resolvedAriaValueText = computed(() => {
    if (this.ariaValueText()) return this.ariaValueText();
    const items = this.itemViews()
      .map((view) => `${view.item.label} ${view.formattedValue}`)
      .join(', ');
    const suffix = this.valueSuffix();
    const total = `${this.formatNumber(this.total())}${suffix} of ${this.formatNumber(this.normalizedMax())}${suffix}`;
    return items ? `${items}. Total ${total}.` : `No measurements. Total ${total}.`;
  });

  private formatNumber(value: number): string {
    return Number.isInteger(value) ? String(value) : String(this.round(value));
  }

  private round(value: number): number {
    return Math.round(value * 10) / 10;
  }
}

export const AerisMeterGroupModule = [
  AerisMeterGroup,
  AerisMeterGroupLabelTemplate,
  AerisMeterGroupSegmentTemplate,
  AerisMeterGroupHeaderTemplate,
  AerisMeterGroupFooterTemplate,
] as const;
