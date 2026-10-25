import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisSkeleton } from '@aeris-ui/core/skeleton';
import {
  AerisChartModule,
  createAerisChartAreaFill,
  createAerisChartComparisonGuide,
  type AerisChartData,
  type AerisChartOptions,
  type AerisChartPlugin,
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
    AerisButton,
    AerisCardModule,
    AerisSkeleton,
    AerisChartModule,
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
  protected readonly areaEnabled = signal(true);
  protected readonly areaData: AerisChartData<'line'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Completed orders',
        data: [34, 52, 44, 69, 62, 84, 96],
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
        backgroundColor: createAerisChartAreaFill('#2563eb'),
        fill: true,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.3,
      },
    ],
  };
  protected readonly areaLineData: AerisChartData<'line'> = {
    ...this.areaData,
    datasets: this.areaData.datasets.map((dataset) => ({ ...dataset, fill: false })),
  };
  protected readonly areaOptions: AerisChartOptions<'line'> = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false, axis: 'x' },
    plugins: { legend: { display: false }, tooltip: { displayColors: false } },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { drawTicks: false },
        ticks: { maxTicksLimit: 5 },
      },
    },
  };
  protected readonly comparisonData: AerisChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New subscriptions',
        data: [180, 240, 220, 340, 310, 420],
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
        backgroundColor: createAerisChartAreaFill('#2563eb', 0.12),
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Renewals',
        data: [120, 160, 190, 210, 270, 320],
        borderColor: '#d97706',
        pointBackgroundColor: '#d97706',
        backgroundColor: createAerisChartAreaFill('#d97706', 0.1),
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };
  protected readonly comparisonPlugins: readonly AerisChartPlugin<'line'>[] = [
    createAerisChartComparisonGuide<'line'>(),
  ];
  protected readonly comparisonOptions: AerisChartOptions<'line'> = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false, axis: 'x' },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { drawTicks: false },
        ticks: { maxTicksLimit: 5 },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        usePointStyle: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 6,
      },
    },
  };
  protected readonly ringData: AerisChartData<'doughnut'> = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Release readiness',
        data: [76, 24],
        backgroundColor: ['#2563eb', 'rgba(128,128,128,0.14)'],
        borderWidth: 0,
        borderRadius: (context) =>
          context.dataIndex === 0 && context.parsed > 0 && context.parsed < 100 ? 3 : 0,
        spacing: 0,
        hoverOffset: 0,
      },
    ],
  };
  protected readonly ringOptions: AerisChartOptions<'doughnut'> = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    cutout: '88%',
    plugins: {
      legend: { display: false },
      tooltip: {
        filter: (item) => item.dataIndex === 0,
        callbacks: { label: (item) => `${item.dataset.label}: ${item.parsed}%` },
      },
    },
  };
  protected readonly gaugeData: AerisChartData<'doughnut'> = {
    ...this.ringData,
    datasets: this.ringData.datasets.map((dataset) => ({
      ...dataset,
      label: 'Capacity used',
      backgroundColor: ['#7c3aed', 'rgba(128,128,128,0.14)'],
    })),
  };
  protected readonly gaugeOptions: AerisChartOptions<'doughnut'> = {
    ...this.ringOptions,
    rotation: -90,
    circumference: 180,
    cutout: '88%',
  };
  protected readonly goalSeries = [
    { label: 'Design', value: 88, color: '#2563eb' },
    { label: 'Development', value: 72, color: '#7c3aed' },
    { label: 'Testing', value: 56, color: '#d97706' },
  ];
  protected readonly goalData: AerisChartData<'doughnut'> = {
    labels: ['Completed', 'Remaining'],
    datasets: this.goalSeries.map((goal) => ({
      label: goal.label,
      data: [goal.value, 100 - goal.value],
      backgroundColor: [goal.color, 'rgba(128,128,128,0.14)'],
      borderWidth: 0,
      borderRadius: (context) =>
        context.dataIndex === 0 && context.parsed > 0 && context.parsed < 100 ? 3 : 0,
      spacing: 0,
      hoverOffset: 0,
    })),
  };
  protected readonly goalOptions: AerisChartOptions<'doughnut'> = {
    ...this.ringOptions,
    cutout: '62%',
    // Inset successive rings without separating their completed and remaining arcs.
    radius: (context) => `${100 - context.datasetIndex * 2}%`,
  };
  protected readonly helperExports: readonly ApiRow[] = [
    {
      name: 'createAerisChartAreaFill(color, opacity?)',
      type: '<TType extends ChartType>(context: ScriptableContext<TType>) => CanvasGradient | string',
      defaultValue: '-',
      description:
        'Assign the returned callback to a line dataset backgroundColor, and set fill: true. Cached per chart; rebuilds after vertical geometry or device-pixel-ratio changes. Safe to create during server rendering.',
    },
    {
      name: 'color (area fill)',
      type: 'string',
      defaultValue: 'required',
      description:
        'A solid color supported by Chart.js, such as HEX, RGB, HSL or a named color. Resolve CSS variables before passing them. Unsupported values produce a transparent fill.',
    },
    {
      name: 'opacity (area fill)',
      type: 'number',
      defaultValue: '0.24',
      description:
        'Alpha at the top of the plotting area, fading to zero at its bottom. Clamped to 0–1; non-finite values use 0.24.',
    },
    {
      name: 'createAerisChartComparisonGuide(options?)',
      type: 'AerisChartPlugin',
      defaultValue: '{}',
      description:
        'Pass the returned plugin in plugins. Draws a dotted vertical guide for active Cartesian elements. Configure interaction.mode: index and intersect: false to compare series. It does not alter interaction, tooltips or datasets.',
    },
    {
      name: 'options.color (comparison guide)',
      type: 'string',
      defaultValue: '--aeris-text-3',
      description:
        'Optional solid canvas stroke color. Inherits the text token on every draw when omitted.',
    },
    {
      name: 'options.width (comparison guide)',
      type: 'number',
      defaultValue: '1',
      description:
        'Stroke width in CSS pixels. Zero or negative values hide the guide; non-finite values use 1.',
    },
    {
      name: 'options.dash (comparison guide)',
      type: 'readonly number[]',
      defaultValue: '[3, 4]',
      description:
        'Alternating dash and gap lengths in CSS pixels. Empty draws a solid line. Negative and non-finite entries are ignored.',
    },
  ];
  protected readonly loadingReport = signal(true);
  protected readonly compactData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [28, 35, 32, 41, 38, 47, 52],
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };
  protected readonly compactOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
    interaction: { mode: 'index', intersect: false },
  };
  protected readonly revenueFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  protected readonly mixedData: AerisChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      { type: 'bar', label: 'Revenue', data: [3200, 4100, 3800, 5200], order: 2 },
      { type: 'line', label: 'Target', data: [3500, 3800, 4200, 4800], borderWidth: 2, order: 1 },
    ],
  };
  protected readonly moneyOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${this.revenueFormat.format(item.parsed.y ?? 0)}`,
        },
      },
    },
    scales: { y: { ticks: { callback: (value) => this.revenueFormat.format(Number(value)) } } },
  };
  protected readonly stackedData: AerisChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      { label: 'Design', data: [8, 12, 10, 14] },
      { label: 'Development', data: [14, 18, 22, 26] },
      { label: 'Testing', data: [6, 8, 10, 12] },
    ],
  };
  protected readonly stackedOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Completed tasks' } },
    },
  };
  protected readonly salesData: AerisChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Revenue', data: [42, 56, 49, 68, 74, 86], borderWidth: 2, borderRadius: 7 },
      { label: 'Target', data: [48, 48, 54, 60, 66, 72], borderWidth: 2, borderRadius: 7 },
    ],
  };

  protected readonly trendData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Active projects', data: [18, 24, 22, 31, 29, 37, 42], tension: 0.35, fill: true },
    ],
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
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };

  protected readonly radialOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  protected readonly scatterOptions: AerisChartOptions = {
    devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
      context.fillStyle =
        getComputedStyle(chart.canvas).getPropertyValue('--aeris-text').trim() || '#222222';
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
    { id: 'chart-area', label: 'Fading area fill' },
    { id: 'chart-comparison', label: 'Compare multiple series' },
    { id: 'chart-radial', label: 'Radial charts and gauges' },
    { id: 'chart-circular', label: 'Circular charts' },
    { id: 'chart-types', label: 'More types' },
    { id: 'chart-dynamic', label: 'Dynamic data' },
    { id: 'chart-plugin', label: 'Plugin' },
    { id: 'chart-empty', label: 'Empty state' },
    { id: 'chart-compact', label: 'Compact KPI' },
    { id: 'chart-mixed', label: 'Mixed series and formatting' },
    { id: 'chart-stacked', label: 'Stacked values' },
    { id: 'chart-loading', label: 'Loading composition' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'chart-import', label: 'Import' },
    { id: 'chart-api-inputs', label: 'Inputs' },
    { id: 'chart-api-outputs', label: 'Outputs' },
    { id: 'chart-api-methods', label: 'Methods' },
    { id: 'chart-api-helpers', label: 'Presentation helpers' },
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
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
};

protected readonly scatterOptions: AerisChartOptions = {
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
  devicePixelRatio:
      typeof window === 'undefined'
        ? 2
        : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
}

interface AerisChartComparisonGuideOptions {
  readonly color?: string;
  readonly width?: number;
  readonly dash?: readonly number[];
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'type',
      type: 'AerisChartType',
      defaultValue: "'bar'",
      description: 'Chart visualization type.',
    },
    {
      name: 'data',
      type: 'AerisChartData | null',
      defaultValue: 'null',
      description: 'Chart labels and dataset values.',
    },
    {
      name: 'options',
      type: 'AerisChartOptions | null',
      defaultValue: 'null',
      description:
        'Chart.js options, callbacks and external tooltips override Aeris defaults. Area fills default to plugins.filler.drawTime: beforeDatasetsDraw so dataset strokes stay above fills; explicit filler settings and plugin disable flags are preserved. Default animation duration is 220ms; system reduced motion always disables animation. Theme changes update the existing renderer.',
    },
    {
      name: 'plugins',
      type: 'readonly AerisChartPlugin[]',
      defaultValue: '[]',
      description: 'Chart.js plugins applied to this chart instance.',
    },
    {
      name: 'height',
      type: 'string',
      defaultValue: "'20rem'",
      description: 'Chart container block size.',
    },
    {
      name: 'responsive',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Passes responsive rendering to Chart.js.',
    },
    {
      name: 'redraw',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Recreates the renderer whenever chart inputs update.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Chart'",
      description: 'Accessible name for the chart canvas.',
    },
    {
      name: 'ariaDescription',
      type: 'string',
      defaultValue: "''",
      description: 'Additional chart description referenced by the canvas.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No chart data available'",
      description:
        'Status message shown when data is null, has no datasets, or every dataset has an empty data array. This is not a loading indicator.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'chartReady',
      type: 'AerisChartReadyEvent',
      defaultValue: '-',
      description: 'Emitted after a Chart.js renderer is created.',
    },
    {
      name: 'chartError',
      type: 'AerisChartErrorEvent',
      defaultValue: '-',
      description: 'Emitted when renderer creation or update fails.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'refresh()',
      type: 'void',
      defaultValue: '-',
      description: 'Applies current inputs and theme defaults to the chart.',
    },
    {
      name: 'resize(width?, height?)',
      type: 'void',
      defaultValue: '-',
      description: 'Resizes the chart using optional pixel dimensions.',
    },
    {
      name: 'reset()',
      type: 'void',
      defaultValue: '-',
      description: 'Restores Chart.js initial animation state.',
    },
    {
      name: 'toBase64Image(type?, quality?)',
      type: 'string | null',
      defaultValue: '-',
      description: 'Returns an image data URL when a chart is rendered.',
    },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--aeris-chart-min-height',
      type: 'length',
      defaultValue: '12rem',
      description: 'Minimum chart container height.',
    },
    {
      name: '--aeris-chart-padding',
      type: 'length',
      defaultValue: '1rem',
      description: 'Space between the rendered chart and its container border.',
    },
    {
      name: '--aeris-chart-border',
      type: 'color',
      defaultValue: '--aeris-border',
      description: 'Container border color.',
    },
    {
      name: '--aeris-chart-radius',
      type: 'length',
      defaultValue: '--aeris-radius-surface',
      description: 'Container corner radius.',
    },
    {
      name: '--aeris-chart-background',
      type: 'color',
      defaultValue: '--aeris-surface',
      description: 'Container background.',
    },
    {
      name: '--aeris-chart-color',
      type: 'color',
      defaultValue: '--aeris-text',
      description: 'Base text color used by the chart surface.',
    },
    {
      name: '--aeris-chart-empty-color',
      type: 'color',
      defaultValue: '--aeris-text-muted',
      description: 'Empty-state text color.',
    },
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
