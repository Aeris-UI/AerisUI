import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  InjectionToken,
  PLATFORM_ID,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { InputSignal, InputSignalWithTransform } from '@angular/core';
import { aerisInternalCreateFrameScheduler } from '@aeris-ui/core';
import { Chart, registerables } from 'chart.js';
import type { ChartConfiguration, ChartData, ChartOptions, ChartType, Plugin } from 'chart.js';

export type AerisChartType = ChartType;
export type AerisChartData<TType extends ChartType = ChartType> = ChartData<TType>;
export type AerisChartOptions<TType extends ChartType = ChartType> = ChartOptions<TType>;
export type AerisChartPlugin<TType extends ChartType = ChartType> = Plugin<TType>;
export type AerisChartConfiguration<TType extends ChartType = ChartType> =
  ChartConfiguration<TType>;

export interface AerisChartInstance {
  readonly config: {
    type: ChartType;
    plugins?: readonly Plugin[];
  };
  data: ChartData;
  options: ChartOptions;
  destroy(): void;
  update(mode?: string): void;
  resize(width?: number, height?: number): void;
  reset(): void;
  toBase64Image(type?: string, quality?: number): string;
}

export type AerisChartFactory = (
  canvas: HTMLCanvasElement,
  configuration: ChartConfiguration,
) => AerisChartInstance;

/**
 * Advanced integration point for supplying a Chart.js-compatible renderer.
 * Chart uses the default Chart.js renderer unless this provider is overridden.
 */
export const AERIS_CHART_FACTORY = new InjectionToken<AerisChartFactory>('AERIS_CHART_FACTORY', {
  factory: () => (canvas, configuration) =>
    new Chart(canvas, configuration) as unknown as AerisChartInstance,
});

export interface AerisChartReadyEvent {
  readonly chart: AerisChartInstance;
}

export interface AerisChartErrorEvent {
  readonly error: unknown;
}

let chartJsRegistered = false;

@Component({
  selector: 'aeris-chart',
  template: `
    <div class="aeris-chart__canvas-wrap" [style.block-size]="height()">
      <canvas
        #canvas
        class="aeris-chart__canvas"
        role="img"
        [attr.aria-label]="resolvedAriaLabel()"
        [attr.aria-describedby]="describedBy()"
        [attr.aria-hidden]="hasData() ? null : 'true'"
      ></canvas>
      @if (!hasData()) {
        <div class="aeris-chart__empty" role="status">{{ emptyMessage() }}</div>
      }
    </div>
    @if (ariaDescription()) {
      <p class="aeris-chart__description" [id]="descriptionId()">{{ ariaDescription() }}</p>
    }
    <p class="aeris-chart__summary" [id]="summaryId">{{ accessibleSummary() }}</p>
  `,
  styleUrl: './aeris-chart.scss',
  host: {
    class: 'aeris-chart',
    '[attr.data-chart-type]': 'type()',
    '[attr.data-responsive]': 'responsive() || null',
  },
})
export class AerisChart<TType extends ChartType = ChartType> {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly chartFactory = inject(AERIS_CHART_FACTORY);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly ready = signal(false);
  private readonly chartId = `aeris-chart-${++nextChartId}`;
  private readonly browser = isPlatformBrowser(this.platformId);
  private themeObserver: MutationObserver | null = null;
  private readonly themeFrame = aerisInternalCreateFrameScheduler(() => this.refresh());
  private motion: MediaQueryList | null = null;
  private chart: AerisChartInstance | null = null;
  private renderedType: ChartType | null = null;
  private renderedPlugins: readonly AerisChartPlugin<TType>[] | null = null;

  readonly type: InputSignal<TType> = input<TType>('bar' as TType);
  readonly data: InputSignal<AerisChartData<TType> | null> = input<AerisChartData<TType> | null>(
    null,
  );
  readonly options: InputSignal<AerisChartOptions<TType> | null> =
    input<AerisChartOptions<TType> | null>(null);
  readonly plugins: InputSignal<readonly AerisChartPlugin<TType>[]> = input<
    readonly AerisChartPlugin<TType>[]
  >([]);
  readonly height: InputSignal<string> = input('20rem');
  readonly responsive: InputSignalWithTransform<boolean, unknown> = input(true, {
    transform: booleanAttribute,
  });
  readonly redraw: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
  });
  readonly ariaLabel: InputSignal<string> = input('Chart');
  readonly ariaDescription: InputSignal<string> = input('');
  readonly emptyMessage: InputSignal<string> = input('No chart data available');

  readonly chartReady = output<AerisChartReadyEvent>();
  readonly chartError = output<AerisChartErrorEvent>();

  protected readonly hasData = computed(() =>
    Boolean(this.data()?.datasets.some((dataset) => dataset.data.length)),
  );
  protected readonly summaryId = `${this.chartId}-summary`;
  protected readonly describedBy = computed(() =>
    [this.ariaDescription() ? this.descriptionId() : '', this.summaryId].filter(Boolean).join(' '),
  );
  protected readonly descriptionId = computed(() => `${this.chartId}-description`);
  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() || 'Chart');
  protected readonly accessibleSummary = computed(() => this.chartSummary(this.data()));

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.themeObserver?.disconnect();
      this.themeFrame.cancel();
      this.destroyChart();
    });

    afterNextRender(() => {
      if (!this.browser) return;
      const view = this.document.defaultView;
      this.motion = view?.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
      const scheme = view?.matchMedia?.('(prefers-color-scheme: dark)');
      const refresh = () => this.themeFrame.schedule();
      this.motion?.addEventListener('change', refresh);
      scheme?.addEventListener('change', refresh);
      this.destroyRef.onDestroy(() => {
        this.motion?.removeEventListener('change', refresh);
        scheme?.removeEventListener('change', refresh);
      });
      this.themeObserver = this.createThemeObserver();
      this.setReady();
    });

    effect(() => {
      const canvas = this.canvas()?.nativeElement;
      const ready = this.isReady();
      const data = this.data();
      const type = this.type();
      const options = this.options();
      const plugins = this.plugins();
      const responsive = this.responsive();
      const redraw = this.redraw();

      if (!ready || !canvas || !data || !this.hasData()) {
        this.destroyChart();
        return;
      }

      this.renderChart(canvas, type, data, options, plugins, responsive, redraw);
    });
  }

  /** Updates the chart using its current data and options. */
  refresh(): void {
    const canvas = this.canvas()?.nativeElement;
    const data = this.data();
    if (!canvas || !data || !this.hasData() || !this.isReady()) return;
    this.renderChart(
      canvas,
      this.type(),
      data,
      this.options(),
      this.plugins(),
      this.responsive(),
      this.redraw(),
    );
  }

  /** Resizes the underlying chart to its container or supplied pixel dimensions. */
  resize(width?: number, height?: number): void {
    this.chart?.resize(width, height);
  }

  /** Restores the current chart to its initial animation state. */
  reset(): void {
    this.chart?.reset();
  }

  /** Returns a data URL snapshot when a chart is currently rendered. */
  toBase64Image(type?: string, quality?: number): string | null {
    return this.chart?.toBase64Image(type, quality) ?? null;
  }

  private setReady(): void {
    this.ready.set(true);
  }

  private isReady(): boolean {
    return this.ready();
  }

  private renderChart(
    canvas: HTMLCanvasElement,
    type: TType,
    data: AerisChartData<TType>,
    options: AerisChartOptions<TType> | null,
    plugins: readonly AerisChartPlugin<TType>[],
    responsive: boolean,
    redraw: boolean,
  ): void {
    try {
      const configuration = this.configuration(type, data, options, plugins, responsive);
      if (!this.chart || this.renderedType !== type || this.renderedPlugins !== plugins || redraw) {
        this.destroyChart();
        this.registerChartJs();
        this.chart = this.chartFactory(canvas, configuration);
        this.renderedType = type;
        this.renderedPlugins = plugins;
        this.chartReady.emit({ chart: this.chart });
        return;
      }

      this.chart.data = configuration.data as ChartData;
      this.chart.options = configuration.options as ChartOptions;
      this.chart.update();
    } catch (error: unknown) {
      this.destroyChart();
      this.chartError.emit({ error });
    }
  }

  private configuration(
    type: TType,
    data: AerisChartData<TType>,
    options: AerisChartOptions<TType> | null,
    plugins: readonly AerisChartPlugin<TType>[],
    responsive: boolean,
  ): ChartConfiguration {
    return {
      type,
      data: this.copyData(data),
      options: this.themedOptions(type, data, options, responsive),
      plugins: [...plugins],
    } as ChartConfiguration;
  }

  private copyData(data: AerisChartData<TType>): ChartData {
    return {
      ...data,
      labels: data.labels ? [...data.labels] : [],
      datasets: data.datasets.map((dataset) => ({ ...dataset, data: [...dataset.data] })),
    } as ChartData;
  }

  private themedOptions(
    type: TType,
    data: AerisChartData<TType>,
    options: AerisChartOptions<TType> | null,
    responsive: boolean,
  ): ChartOptions {
    // Only shared options are themed; controller-specific settings pass through unchanged.
    const source = (options ?? {}) as ChartOptions;
    const style = getComputedStyle(this.host.nativeElement);
    const text =
      style.getPropertyValue('--aeris-chart-color').trim() ||
      style.getPropertyValue('--aeris-text').trim() ||
      '#222222';
    const muted = style.getPropertyValue('--aeris-text-muted').trim() || '#6d7068';
    const border = style.getPropertyValue('--aeris-border').trim() || '#deddd7';
    const surface = style.getPropertyValue('--aeris-surface').trim() || '#ffffff';
    const font = {
      family: style.fontFamily || 'system-ui',
      size: Number.parseFloat(style.fontSize) || 14,
    };
    const rtl = style.direction === 'rtl';
    const plugins = source.plugins;
    const legend = plugins?.legend;
    const tooltip = plugins?.tooltip;
    const defaultScales: Record<string, object> = {};
    const radialScales = new Set<string>();
    for (const dataset of data.datasets) {
      const kind = dataset.type ?? type;
      const axes = dataset as { xAxisID?: string; yAxisID?: string; rAxisID?: string };
      if (kind === 'radar' || kind === 'polarArea') {
        const id = axes.rAxisID ?? 'r';
        defaultScales[id] = {};
        radialScales.add(id);
      } else if (kind !== 'pie' && kind !== 'doughnut') {
        defaultScales[axes.xAxisID ?? 'x'] = {};
        defaultScales[axes.yAxisID ?? 'y'] = {};
      }
    }
    const scales = Object.fromEntries(
      Object.entries({ ...defaultScales, ...source.scales }).map(([key, scale]) => {
        const sourceScale = (scale ?? {}) as Record<string, unknown>;
        return [
          key,
          {
            ...sourceScale,
            grid: { color: border, ...this.objectValue(sourceScale['grid']) },
            ticks: {
              color: muted,
              ...(radialScales.has(key) ? { backdropColor: surface } : {}),
              ...this.objectValue(sourceScale['ticks']),
            },
            border: { color: border, ...this.objectValue(sourceScale['border']) },
            title: { color: text, ...this.objectValue(sourceScale['title']) },
            pointLabels: { color: muted, ...this.objectValue(sourceScale['pointLabels']) },
            angleLines: { color: border, ...this.objectValue(sourceScale['angleLines']) },
          },
        ];
      }),
    );

    return {
      ...source,
      responsive,
      color: source.color ?? text,
      font: { ...font, ...source.font },
      animation: this.motion?.matches ? false : (source.animation ?? { duration: 220 }),
      plugins:
        (plugins as unknown) === false
          ? false
          : {
              ...plugins,
              legend:
                (legend as unknown) === false
                  ? false
                  : {
                      rtl,
                      textDirection: rtl ? 'rtl' : 'ltr',
                      ...legend,
                      labels: {
                        color: muted,
                        ...legend?.labels,
                      },
                    },
              tooltip:
                (tooltip as unknown) === false
                  ? false
                  : {
                      rtl,
                      textDirection: rtl ? 'rtl' : 'ltr',
                      padding: 12,
                      titleFont: () => ({ ...font, weight: 'bold' }),
                      bodyFont: () => font,
                      footerFont: () => ({ ...font, weight: 'bold' }),
                      ...tooltip,
                      backgroundColor: tooltip?.backgroundColor ?? surface,
                      titleColor: tooltip?.titleColor ?? text,
                      bodyColor: tooltip?.bodyColor ?? text,
                      footerColor: tooltip?.footerColor ?? text,
                      borderColor: tooltip?.borderColor ?? border,
                      borderWidth: tooltip?.borderWidth ?? 1,
                    },
            },
      scales,
    } as ChartOptions;
  }

  private registerChartJs(): void {
    if (chartJsRegistered) return;
    Chart.register(...registerables);
    chartJsRegistered = true;
  }

  private destroyChart(): void {
    this.chart?.destroy();
    this.chart = null;
    this.renderedType = null;
    this.renderedPlugins = null;
  }

  private createThemeObserver(): MutationObserver | null {
    if (!this.browser || typeof MutationObserver === 'undefined') return null;
    const observer = new MutationObserver(() => this.themeFrame.schedule());
    for (
      let element: HTMLElement | null = this.host.nativeElement;
      element;
      element = element.parentElement
    ) {
      observer.observe(element, {
        attributes: true,
        attributeFilter: [
          'class',
          'data-aeris-theme',
          'data-aeris-density',
          'data-aeris-radius',
          'data-theme',
          'data-palette',
          'dir',
          'style',
        ],
      });
    }
    return observer;
  }

  private chartSummary(data: AerisChartData<TType> | null): string {
    if (!this.hasData() || !data) return this.emptyMessage();
    const labels = (data.labels ?? []).map((label) => String(label));
    const datasets = data.datasets.map((dataset, index) => {
      const label = dataset.label || `Dataset ${index + 1}`;
      const values = dataset.data.map((value) => this.valueText(value)).join(', ');
      return `${label}: ${values}`;
    });
    return [labels.length ? `Labels: ${labels.join(', ')}.` : '', ...datasets]
      .filter(Boolean)
      .join(' ');
  }

  private valueText(value: unknown): string {
    if (typeof value === 'number' || typeof value === 'string') return String(value);
    if (value && typeof value === 'object') {
      const point = value as Record<string, unknown>;
      const x = point['x'];
      const y = point['y'];
      const r = point['r'];
      return [
        x !== undefined ? `x ${x}` : '',
        y !== undefined ? `y ${y}` : '',
        r !== undefined ? `r ${r}` : '',
      ]
        .filter(Boolean)
        .join(', ');
    }
    return String(value);
  }

  private objectValue(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  }
}

let nextChartId = 0;

export const AerisChartModule = [AerisChart] as const;
