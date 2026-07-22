import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisChartModule,
  type AerisChartData,
  type AerisChartOptions,
} from '@aeris-ui/core/chart';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import type { Plugin } from 'chart.js';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-chart-page',
  imports: [
    AerisButton,    AerisChartModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './chart.page.html',
  styleUrl: './chart.page.scss',
})
export class ChartPage {
  protected readonly salesData: AerisChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Revenue', data: [42, 56, 49, 68, 74, 86], borderWidth: 2, borderRadius: 7 },
      { label: 'Target', data: [48, 48, 54, 60, 66, 72], borderWidth: 2, borderRadius: 7 },
    ],
  };

  protected readonly trendData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Active projects', data: [18, 24, 22, 31, 29, 37, 42], tension: 0.35, fill: true }],
  };

  protected readonly shareData: AerisChartData = {
    labels: ['Product', 'Engineering', 'Operations', 'Growth'],
    datasets: [{ label: 'Team allocation', data: [36, 29, 18, 17] }],
  };

  protected readonly radarData: AerisChartData = {
    labels: ['Speed', 'Quality', 'Coverage', 'Reliability', 'Clarity'],
    datasets: [
      { label: 'Current', data: [82, 74, 67, 91, 78] },
      { label: 'Goal', data: [88, 86, 80, 90, 84] },
    ],
  };

  protected readonly scatterData: AerisChartData = {
    datasets: [
      {
        label: 'Experiments',
        data: [
          { x: 4, y: 18 },
          { x: 7, y: 31 },
          { x: 11, y: 42 },
          { x: 14, y: 39 },
          { x: 18, y: 62 },
        ],
      },
    ],
  };

  protected readonly bubbleData: AerisChartData = {
    datasets: [
      {
        label: 'Opportunities',
        data: [
          { x: 4, y: 14, r: 8 },
          { x: 9, y: 28, r: 13 },
          { x: 14, y: 20, r: 10 },
          { x: 17, y: 42, r: 17 },
        ],
      },
    ],
  };

  protected readonly chartOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };

  protected readonly radialOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  protected readonly scatterOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Reach' } },
      y: { title: { display: true, text: 'Value' } },
    },
    plugins: { legend: { display: false } },
  };

  protected readonly dynamicData = signal<AerisChartData>({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{ label: 'Completed tasks', data: [18, 27, 22, 34], borderRadius: 7 }],
  });

  protected readonly centerLabelPlugin: Plugin = {
    id: 'aeris-center-label',
    afterDraw: (chart) => {
      const context = chart.ctx;
      const area = chart.chartArea;
      if (!area) return;
      context.save();
      context.fillStyle = getComputedStyle(chart.canvas).getPropertyValue('--aeris-text').trim() || '#222222';
      context.font = '700 14px system-ui';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('100%', (area.left + area.right) / 2, (area.top + area.bottom) / 2);
      context.restore();
    },
  };

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'chart-import', label: 'Import' },
    { id: 'chart-basic', label: 'Bar chart' },
    { id: 'chart-line', label: 'Line chart' },
    { id: 'chart-circular', label: 'Circular charts' },
    { id: 'chart-types', label: 'More types' },
    { id: 'chart-dynamic', label: 'Dynamic data' },
    { id: 'chart-plugin', label: 'Plugin' },
    { id: 'chart-empty', label: 'Empty state' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'chart-import', label: 'Import' },
    { id: 'chart-api-inputs', label: 'Inputs' },
    { id: 'chart-api-outputs', label: 'Outputs' },
    { id: 'chart-api-methods', label: 'Methods' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'chart-import', label: 'Import' },
    { id: 'chart-interfaces', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'chart-import', label: 'Import' },
    { id: 'chart-tokens', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'chart-import', label: 'Import' },
    { id: 'chart-a11y-semantics', label: 'Semantics' },
    { id: 'chart-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly importCode = `npm install chart.js

import { AerisChartModule } from '@aeris-ui/core/chart';`;

  protected readonly basicCode = `import type { AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';

protected readonly salesData: AerisChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    { label: 'Revenue', data: [42, 56, 49, 68, 74, 86], borderWidth: 2, borderRadius: 7 },
    { label: 'Target', data: [48, 48, 54, 60, 66, 72], borderWidth: 2, borderRadius: 7 },
  ],
};

protected readonly chartOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
};`;

  protected readonly lineCode = `import type { AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';

protected readonly trendData: AerisChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ label: 'Active projects', data: [18, 24, 22, 31, 29, 37, 42], tension: 0.35, fill: true }],
};

protected readonly chartOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
};`;

  protected readonly circularCode = `import type { AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';

protected readonly shareData: AerisChartData = {
  labels: ['Product', 'Engineering', 'Operations', 'Growth'],
  datasets: [{ label: 'Team allocation', data: [36, 29, 18, 17] }],
};

protected readonly radialOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};`;

  protected readonly typesCode = `import type { AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';

protected readonly radarData: AerisChartData = {
  labels: ['Speed', 'Quality', 'Coverage', 'Reliability', 'Clarity'],
  datasets: [{ label: 'Current', data: [82, 74, 67, 91, 78] }, { label: 'Goal', data: [88, 86, 80, 90, 84] }],
};

protected readonly shareData: AerisChartData = {
  labels: ['Product', 'Engineering', 'Operations', 'Growth'],
  datasets: [{ label: 'Team allocation', data: [36, 29, 18, 17] }],
};

protected readonly scatterData: AerisChartData = {
  datasets: [{ label: 'Experiments', data: [{ x: 4, y: 18 }, { x: 7, y: 31 }, { x: 11, y: 42 }, { x: 14, y: 39 }, { x: 18, y: 62 }] }],
};

protected readonly bubbleData: AerisChartData = {
  datasets: [{ label: 'Opportunities', data: [{ x: 4, y: 14, r: 8 }, { x: 9, y: 28, r: 13 }, { x: 14, y: 20, r: 10 }, { x: 17, y: 42, r: 17 }] }],
};

protected readonly radialOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};

protected readonly scatterOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  scales: {
    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Reach' } },
    y: { title: { display: true, text: 'Value' } },
  },
  plugins: { legend: { display: false } },
};`;

  protected readonly dynamicCode = `import { signal } from '@angular/core';
import type { AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';

protected readonly dynamicData = signal<AerisChartData>({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [{ label: 'Completed tasks', data: [18, 27, 22, 34], borderRadius: 7 }],
});

protected readonly chartOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
};

protected addWeek(): void {
  this.dynamicData.update((data) => ({
    labels: [...(data.labels ?? []), \`Week \${(data.labels?.length ?? 0) + 1}\`],
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: [...dataset.data, 20 + Math.round(Math.random() * 25)],
    })),
  }));
}`;

  protected readonly pluginCode = `import { type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';
import type { Plugin } from 'chart.js';

protected readonly shareData: AerisChartData = {
  labels: ['Product', 'Engineering', 'Operations', 'Growth'],
  datasets: [{ label: 'Team allocation', data: [36, 29, 18, 17] }],
};

protected readonly radialOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};

protected readonly centerLabelPlugin: Plugin = {
  id: 'aeris-center-label',
  afterDraw: (chart) => {
    const context = chart.ctx;
    const area = chart.chartArea;
    if (!area) return;

    context.save();
    context.fillStyle = getComputedStyle(chart.canvas).getPropertyValue('--aeris-text').trim() || '#222222';
    context.font = '700 14px system-ui';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('100%', (area.left + area.right) / 2, (area.top + area.bottom) / 2);
    context.restore();
  },
};`;

  protected readonly interfacesCode = `import type { ChartData, ChartOptions, ChartType, Plugin } from 'chart.js';

type AerisChartType =
  | 'bar'
  | 'line'
  | 'pie'
  | 'doughnut'
  | 'polarArea'
  | 'radar'
  | 'scatter'
  | 'bubble';

type AerisChartData<TType extends ChartType = ChartType> = ChartData<TType>;
type AerisChartOptions<TType extends ChartType = ChartType> = ChartOptions<TType>;
type AerisChartPlugin<TType extends ChartType = ChartType> = Plugin<TType>;

interface AerisChartReadyEvent {
  readonly chart: AerisChartInstance;
}

interface AerisChartErrorEvent {
  readonly error: unknown;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'type', type: 'AerisChartType', defaultValue: "'bar'", description: 'Chart visualization type.' },
    { name: 'data', type: 'AerisChartData | null', defaultValue: 'null', description: 'Chart labels and dataset values.' },
    { name: 'options', type: 'AerisChartOptions | null', defaultValue: 'null', description: 'Chart.js options, merged with Aeris theme-aware defaults.' },
    { name: 'plugins', type: 'readonly AerisChartPlugin[]', defaultValue: '[]', description: 'Chart.js plugins applied to this chart instance.' },
    { name: 'height', type: 'string', defaultValue: "'20rem'", description: 'Chart container block size.' },
    { name: 'responsive', type: 'boolean', defaultValue: 'true', description: 'Passes responsive rendering to Chart.js.' },
    { name: 'redraw', type: 'boolean', defaultValue: 'false', description: 'Recreates the renderer whenever chart inputs update.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Chart'", description: 'Accessible name for the chart canvas.' },
    { name: 'ariaDescription', type: 'string', defaultValue: "''", description: 'Additional chart description referenced by the canvas.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No chart data available'", description: 'Status message shown when data has no datasets.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'chartReady', type: 'AerisChartReadyEvent', defaultValue: '-', description: 'Emitted after a Chart.js renderer is created.' },
    { name: 'chartError', type: 'AerisChartErrorEvent', defaultValue: '-', description: 'Emitted when renderer creation or update fails.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'refresh()', type: 'void', defaultValue: '-', description: 'Applies current inputs and theme defaults to the chart.' },
    { name: 'resize(width?, height?)', type: 'void', defaultValue: '-', description: 'Resizes the chart using optional pixel dimensions.' },
    { name: 'reset()', type: 'void', defaultValue: '-', description: 'Restores Chart.js initial animation state.' },
    { name: 'toBase64Image(type?, quality?)', type: 'string | null', defaultValue: '-', description: 'Returns an image data URL when a chart is rendered.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-chart-min-height', type: 'length', defaultValue: '12rem', description: 'Minimum chart container height.' },
    { name: '--aeris-chart-padding', type: 'length', defaultValue: '1rem', description: 'Space between the rendered chart and its container border.' },
    { name: '--aeris-chart-border', type: 'color', defaultValue: '--aeris-border', description: 'Container border color.' },
    { name: '--aeris-chart-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Container corner radius.' },
    { name: '--aeris-chart-background', type: 'color', defaultValue: '--aeris-surface', description: 'Container background.' },
    { name: '--aeris-chart-color', type: 'color', defaultValue: '--aeris-text', description: 'Base text color used by the chart surface.' },
    { name: '--aeris-chart-empty-color', type: 'color', defaultValue: '--aeris-text-muted', description: 'Empty-state text color.' },
  ];

  protected addWeek(): void {
    this.dynamicData.update((data) => ({
      labels: [...(data.labels ?? []), `Week ${(data.labels?.length ?? 0) + 1}`],
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data, 20 + Math.round(Math.random() * 25)],
      })),
    }));
  }
}
