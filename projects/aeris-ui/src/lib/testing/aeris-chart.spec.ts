import { Component, PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import {
  AERIS_CHART_FACTORY,
  AerisChartModule,
  type AerisChartConfiguration,
  type AerisChartData,
  type AerisChartFactory,
  type AerisChartInstance,
  type AerisChartOptions,
  type AerisChartPlugin,
  type AerisChartType,
} from '../../../chart/aeris-chart';

class TestChart implements AerisChartInstance {
  private readonly chartConfig: AerisChartInstance['config'];
  data;
  options;
  destroyed = false;
  updates = 0;
  resized: readonly [number | undefined, number | undefined] | null = null;
  resetCalled = false;

  constructor(configuration: AerisChartConfiguration) {
    this.chartConfig = Object.freeze({
      type: configuration.type,
      plugins: configuration.plugins,
    });
    this.data = configuration.data;
    this.options = configuration.options ?? {};
  }

  get config(): AerisChartInstance['config'] {
    return this.chartConfig;
  }

  destroy(): void {
    this.destroyed = true;
  }

  update(): void {
    this.updates += 1;
  }

  resize(width?: number, height?: number): void {
    this.resized = [width, height];
  }

  reset(): void {
    this.resetCalled = true;
  }

  toBase64Image(): string {
    return 'data:image/png;base64,aeris';
  }
}

const renderedCharts: TestChart[] = [];
const chartFactory: AerisChartFactory = (_canvas, configuration) => {
  const chart = new TestChart(configuration);
  renderedCharts.push(chart);
  return chart;
};

@Component({
  imports: [AerisChartModule],
  providers: [{ provide: AERIS_CHART_FACTORY, useValue: chartFactory }],
  template: `
    <aeris-chart
      [type]="type()"
      [data]="data()"
      [options]="options()"
      [plugins]="plugins()"
      ariaLabel="Revenue chart"
      ariaDescription="Monthly revenue comparison"
      (chartReady)="readyCount.update((count) => count + 1)"
      (chartError)="errorCount.update((count) => count + 1)"
    />
  `,
})
class ChartHost {
  readonly type = signal<AerisChartType>('bar');
  readonly plugins = signal<readonly AerisChartPlugin[]>([]);
  readonly errorCount = signal(0);
  readonly data = signal<AerisChartData>({
    labels: ['Jan', 'Feb'],
    datasets: [{ label: 'Revenue', data: [12, 18] }],
  });
  readonly options = signal<AerisChartOptions>({ maintainAspectRatio: false });
  readonly readyCount = signal(0);
}

@Component({
  imports: [AerisChartModule],
  providers: [{ provide: AERIS_CHART_FACTORY, useValue: chartFactory }],
  template: `<aeris-chart [data]="null" emptyMessage="Waiting for reports" />`,
})
class EmptyChartHost {}

describe('AerisChart', () => {
  beforeEach(() => {
    renderedCharts.length = 0;
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('associates its complete data summary with the canvas and copies mutable data arrays', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    await fixture.whenStable();
    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement;
    const summary = fixture.nativeElement.querySelector('.aeris-chart__summary') as HTMLElement;
    expect(canvas.getAttribute('aria-describedby')?.split(' ')).toContain(summary.id);
    const source = fixture.componentInstance.data();
    expect(renderedCharts[0]?.data.datasets[0]?.data).not.toBe(source.datasets[0]?.data);
    expect(renderedCharts[0]?.data.labels).not.toBe(source.labels);
  });

  it('themes implicit axes, radial labels, tooltip footer and RTL without adding axes to pie charts', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    const host = fixture.nativeElement as HTMLElement;
    host.style.setProperty('--aeris-text', '#111111');
    host.style.setProperty('--aeris-text-muted', '#333333');
    host.style.setProperty('--aeris-border', '#aaaaaa');
    host.style.direction = 'rtl';
    await fixture.whenStable();
    expect(renderedCharts[0]?.options.scales?.['x']?.ticks?.color).toBe('#333333');
    expect(renderedCharts[0]?.options.scales?.['y']?.grid?.color).toBe('#aaaaaa');
    expect(renderedCharts[0]?.options.plugins?.tooltip?.footerColor).toBe('#111111');
    expect(renderedCharts[0]?.options.plugins?.legend?.rtl).toBe(true);
    expect(renderedCharts[0]?.options.plugins?.filler?.drawTime).toBe('beforeDatasetsDraw');
    fixture.componentInstance.type.set('radar');
    await fixture.whenStable();
    expect(renderedCharts.at(-1)?.options.scales?.['r']).toMatchObject({
      pointLabels: { color: '#333333' },
    });
    fixture.componentInstance.type.set('pie');
    await fixture.whenStable();
    expect(renderedCharts.at(-1)?.options.scales).toEqual({});
  });

  it('preserves caller formatting, colors, custom axes, plugins and animation settings', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    const tick = () => '$12';
    const label = () => 'Revenue: $12';
    const plugin: AerisChartPlugin = { id: 'consumer-plugin' };
    fixture.componentInstance.plugins.set([plugin]);
    fixture.componentInstance.data.set({
      datasets: [{ data: [12], xAxisID: 'period', yAxisID: 'revenue' }],
    });
    fixture.componentInstance.options.set({
      animation: { duration: 750 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false, callbacks: { label }, bodyColor: '#123456' },
      },
      scales: { revenue: { ticks: { callback: tick, color: '#654321' } } },
    });
    await fixture.whenStable();
    const chart = renderedCharts[0];
    expect(chart?.config.plugins?.[0]).toBe(plugin);
    expect(chart?.options.scales?.['x']).toBeUndefined();
    expect(chart?.options.scales?.['period']).toBeDefined();
    expect(chart?.options.scales?.['revenue']?.ticks?.callback).toBe(tick);
    expect(chart?.options.scales?.['revenue']?.ticks?.color).toBe('#654321');
    expect(chart?.options.plugins?.tooltip?.callbacks?.label).toBe(label);
    expect(chart?.options.plugins?.tooltip?.enabled).toBe(false);
    expect(chart?.options.plugins?.tooltip?.bodyColor).toBe('#123456');
    expect(chart?.options.plugins?.legend?.display).toBe(false);
    expect(chart?.options.animation).toEqual({ duration: 750 });
  });

  it('draws all fills behind dataset strokes without changing data, stacking or dataset order', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    fixture.componentInstance.type.set('line');
    const data: AerisChartData = {
      labels: ['Jan', 'Feb'],
      datasets: [
        { label: 'Filled', data: [12, 18], fill: true, order: 2 },
        { label: 'Unfilled', data: [6, 9], fill: false, order: 1 },
        { label: 'Gap', data: [8, 10], fill: '-1', order: 3 },
      ],
    };
    const options: AerisChartOptions = {
      plugins: { filler: { propagate: false } },
      scales: { y: { stacked: true } },
    };
    fixture.componentInstance.data.set(data);
    fixture.componentInstance.options.set(options);
    await fixture.whenStable();
    const chart = renderedCharts[0];
    expect(chart?.options.plugins?.filler).toEqual({
      drawTime: 'beforeDatasetsDraw',
      propagate: false,
    });
    expect(chart?.data.datasets).toEqual(data.datasets);
    expect(chart?.options.scales?.['y']).toMatchObject({ stacked: true });
    expect(options.plugins?.filler).toEqual({ propagate: false });
  });

  it.each(['beforeDraw', 'beforeDatasetDraw', 'beforeDatasetsDraw'] as const)(
    'preserves an explicit filler draw time of %s',
    async (drawTime) => {
      const fixture = TestBed.createComponent(ChartHost);
      fixture.componentInstance.options.set({ plugins: { filler: { drawTime } } });
      await fixture.whenStable();
      expect(renderedCharts[0]?.options.plugins?.filler?.drawTime).toBe(drawTime);
    },
  );

  it('preserves runtime Chart.js plugin disable flags', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    fixture.componentInstance.options.set({
      plugins: { legend: false, tooltip: false, filler: false },
    } as unknown as AerisChartOptions);
    await fixture.whenStable();
    expect(renderedCharts[0]?.options.plugins?.legend).toBe(false);
    expect(renderedCharts[0]?.options.plugins?.tooltip).toBe(false);
    expect(renderedCharts[0]?.options.plugins?.filler).toBe(false);
    fixture.componentInstance.options.set({ plugins: false } as unknown as AerisChartOptions);
    await fixture.whenStable();
    expect(renderedCharts[0]?.options.plugins).toBe(false);
  });

  it('coalesces scoped theme changes and cancels scheduled work on destroy', async () => {
    const frames = new Map<number, FrameRequestCallback>();
    let nextId = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++nextId, callback);
      return nextId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      frames.delete(id);
    });
    const fixture = TestBed.createComponent(ChartHost);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const chart = renderedCharts[0];
    host.style.setProperty('--aeris-text', '#fefefe');
    host.setAttribute('data-aeris-theme', 'dark');
    await Promise.resolve();
    expect(frames.size).toBe(1);
    const callback = [...frames.values()][0];
    frames.clear();
    callback?.(0);
    expect(chart?.updates).toBe(1);
    expect(chart?.options.color).toBe('#fefefe');
    host.style.setProperty('--aeris-text', '#eeeeee');
    await Promise.resolve();
    fixture.destroy();
    expect(frames.size).toBe(0);
    expect(chart?.destroyed).toBe(true);
  });

  it('honors live reduced-motion changes without recreating the renderer', async () => {
    let reduced = true;
    const motion = new EventTarget();
    Object.defineProperty(motion, 'matches', { get: () => reduced });
    vi.stubGlobal('matchMedia', () => motion);
    vi.stubGlobal('requestAnimationFrame', undefined);
    const fixture = TestBed.createComponent(ChartHost);
    fixture.componentInstance.options.set({ animation: { duration: 900 } });
    await fixture.whenStable();
    const chart = renderedCharts[0];
    expect(chart?.options.animation).toBe(false);
    reduced = false;
    motion.dispatchEvent(new Event('change'));
    expect(chart?.options.animation).toEqual({ duration: 900 });
    expect(renderedCharts).toHaveLength(1);
    fixture.destroy();
    const updates = chart?.updates;
    motion.dispatchEvent(new Event('change'));
    expect(chart?.updates).toBe(updates);
  });

  it('destroys empty series, recovers when values arrive and reports failed updates', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    await fixture.whenStable();
    const original = renderedCharts[0];
    fixture.componentInstance.data.set({ datasets: [{ label: 'Revenue', data: [] }] });
    await fixture.whenStable();
    expect(original?.destroyed).toBe(true);
    expect(fixture.nativeElement.querySelector('.aeris-chart__empty')).not.toBeNull();
    fixture.componentInstance.data.set({ datasets: [{ data: [5] }] });
    await fixture.whenStable();
    const current = renderedCharts.at(-1);
    if (!current) throw new Error('Expected a recovered renderer');
    vi.spyOn(current, 'update').mockImplementation(() => {
      throw new Error('Renderer failed');
    });
    fixture.componentInstance.data.set({ datasets: [{ data: [6] }] });
    await fixture.whenStable();
    expect(current.destroyed).toBe(true);
    expect(fixture.componentInstance.errorCount()).toBe(1);
  });

  it('renders accessible canvas semantics and an assistive data summary', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const chart = fixture.nativeElement.querySelector('aeris-chart') as HTMLElement;
    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement;

    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Revenue chart');
    expect(canvas.getAttribute('aria-describedby')).toContain('description');
    expect(chart.textContent).toContain('Labels: Jan, Feb. Revenue: 12, 18');
    expect(fixture.componentInstance.readyCount()).toBe(1);
    expect(renderedCharts).toHaveLength(1);
  });

  it('renders semantic content on the server without constructing a canvas renderer', async () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const fixture = TestBed.createComponent(ChartHost);
    await fixture.whenStable();
    expect(renderedCharts).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('canvas')?.getAttribute('aria-label')).toBe(
      'Revenue chart',
    );
    expect(fixture.nativeElement.textContent).toContain('Revenue: 12, 18');
  });

  it('updates the existing renderer when data changes and exposes instance methods', async () => {
    const fixture = TestBed.createComponent(ChartHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.debugElement.children[0]?.componentInstance as {
      resize(width?: number, height?: number): void;
      reset(): void;
      toBase64Image(): string | null;
    };
    const chart = renderedCharts[0] as TestChart;

    fixture.componentInstance.data.set({
      labels: ['Mar'],
      datasets: [{ label: 'Revenue', data: [24] }],
    });
    fixture.detectChanges();

    expect(chart.updates).toBe(1);
    expect(chart.data.labels).toEqual(['Mar']);

    component.resize(640, 320);
    component.reset();
    expect(component.toBase64Image()).toBe('data:image/png;base64,aeris');
    expect(chart.resized).toEqual([640, 320]);
    expect(chart.resetCalled).toBe(true);
  });

  it('shows a named empty state without creating a renderer', async () => {
    const fixture = TestBed.createComponent(EmptyChartHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas') as HTMLCanvasElement;
    const empty = fixture.nativeElement.querySelector('.aeris-chart__empty') as HTMLElement;

    expect(canvas.getAttribute('aria-hidden')).toBe('true');
    expect(empty.getAttribute('role')).toBe('status');
    expect(empty.textContent).toContain('Waiting for reports');
    expect(renderedCharts).toHaveLength(0);
  });
});
