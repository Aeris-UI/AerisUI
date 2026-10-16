import { Component, computed, inject } from '@angular/core';
import { AerisChartModule, AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';
import { AerisThemeService } from '@aeris-ui/core/theming';
@Component({
  selector: 'app-catalog-chart-preview',
  imports: [AerisChartModule],
  template: `<aeris-chart
    type="bar"
    [data]="data()"
    [options]="options"
    height="12rem"
    ariaLabel="Weekly activity"
  />`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-width: 0;
      }
    `,
  ],
})
export class CatalogChartPreviewComponent {
  private readonly theme = inject(AerisThemeService);
  protected readonly data = computed<AerisChartData>(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Activity',
        data: [24, 38, 30, 52, 44],
        backgroundColor: this.theme.semanticTones().primary.base,
        borderRadius: 3,
      },
    ],
  }));
  protected readonly options: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    animation: false,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { maxTicksLimit: 4 } },
    },
  };
}
