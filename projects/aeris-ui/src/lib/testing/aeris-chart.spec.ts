import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  AERIS_CHART_FACTORY,
  AerisChartModule,
  type AerisChartConfiguration,
  type AerisChartData,
  type AerisChartFactory,
  type AerisChartInstance,
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
      type="bar"
      [data]="data()"
      [options]="options"
      ariaLabel="Revenue chart"
      ariaDescription="Monthly revenue comparison"
      (chartReady)="readyCount.update((count) => count + 1)"
    />
  `,
})
class ChartHost {
  readonly data = signal<AerisChartData>({
    labels: ['Jan', 'Feb'],
    datasets: [{ label: 'Revenue', data: [12, 18] }],
  });
  readonly options = { maintainAspectRatio: false };
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
