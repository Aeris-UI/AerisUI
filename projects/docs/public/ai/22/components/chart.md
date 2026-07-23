# Chart

> Chart.js-powered data visualization with responsive rendering, theme-aware defaults, and accessible summaries.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/chart`
- Human-readable documentation: [https://aeris-ui.dev/components/chart](https://aeris-ui.dev/components/chart)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
npm install chart.js

import { AerisChartModule } from '@aeris-ui/core/chart';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `AerisChartType` | `'bar'` | Chart visualization type. |
| `data` | `AerisChartData &#124; null` | `null` | Chart labels and dataset values. |
| `options` | `AerisChartOptions &#124; null` | `null` | Chart.js options, merged with Aeris theme-aware defaults. |
| `plugins` | `readonly AerisChartPlugin[]` | `[]` | Chart.js plugins applied to this chart instance. |
| `height` | `string` | `'20rem'` | Chart container block size. |
| `responsive` | `boolean` | `true` | Passes responsive rendering to Chart.js. |
| `redraw` | `boolean` | `false` | Recreates the renderer whenever chart inputs update. |
| `ariaLabel` | `string` | `'Chart'` | Accessible name for the chart canvas. |
| `ariaDescription` | `string` | `''` | Additional chart description referenced by the canvas. |
| `emptyMessage` | `string` | `'No chart data available'` | Status message shown when data has no datasets. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `chartReady` | `AerisChartReadyEvent` | `-` | Emitted after a Chart.js renderer is created. |
| `chartError` | `AerisChartErrorEvent` | `-` | Emitted when renderer creation or update fails. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `refresh()` | `void` | `-` | Applies current inputs and theme defaults to the chart. |
| `resize(width?, height?)` | `void` | `-` | Resizes the chart using optional pixel dimensions. |
| `reset()` | `void` | `-` | Restores Chart.js initial animation state. |
| `toBase64Image(type?, quality?)` | `string &#124; null` | `-` | Returns an image data URL when a chart is rendered. |

## Interfaces and types

### Types

```ts
import type { AerisChartData, AerisChartOptions } from '@aeris-ui/core/chart';

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
};
```

### Interfaces

```ts
import type { ChartData, ChartOptions, ChartType, Plugin } from 'chart.js';

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
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-chart-min-height` | `length` | `12rem` | Minimum chart container height. |
| `--aeris-chart-padding` | `length` | `1rem` | Space between the rendered chart and its container border. |
| `--aeris-chart-border` | `color` | `--aeris-border` | Container border color. |
| `--aeris-chart-radius` | `length` | `--aeris-radius-lg` | Container corner radius. |
| `--aeris-chart-background` | `color` | `--aeris-surface` | Container background. |
| `--aeris-chart-color` | `color` | `--aeris-text` | Base text color used by the chart surface. |
| `--aeris-chart-empty-color` | `color` | `--aeris-text-muted` | Empty-state text color. |

## Examples

### Bar chart

Compare related values with a responsive bar chart and an accessible description.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions, type ChartData, type ChartOptions } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-basic-demo',
  imports: [AerisChartModule],
  template: `
    <div>
      <aeris-chart
        type="bar"
        [data]="salesData"
        [options]="chartOptions"
        height="22rem"
        ariaLabel="Monthly revenue and target"
        ariaDescription="Revenue exceeds the monthly target from April through June."
      />
    </div>
  `
})
export class ChartBasicBarChartDemo {
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
  };
}
```

### Line chart

Use a line chart to show change across an ordered sequence.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions, type ChartData, type ChartOptions } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-line-demo',
  imports: [AerisChartModule],
  template: `
    <div>
      <aeris-chart
        type="line"
        [data]="trendData"
        [options]="chartOptions"
        height="20rem"
        ariaLabel="Active projects over seven days"
      />
    </div>
  `
})
export class ChartLineLineChartDemo {
  protected readonly trendData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Active projects', data: [18, 24, 22, 31, 29, 37, 42], tension: 0.35, fill: true }],
  };

  protected readonly chartOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };
}
```

### Circular charts

Pie and doughnut variants present proportional parts of a whole.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions, type ChartData, type ChartOptions } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-circular-demo',
  imports: [AerisChartModule],
  templateUrl: './chart-circular.demo.html',
  styleUrl: './chart-circular.demo.scss'
})
export class ChartCircularCircularChartsDemo {
  protected readonly shareData: AerisChartData = {
    labels: ['Product', 'Engineering', 'Operations', 'Growth'],
    datasets: [{ label: 'Team allocation', data: [36, 29, 18, 17] }],
  };

  protected readonly radialOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };
}
```

#### HTML

```html
<div class="chart-grid">
  <aeris-chart
    type="pie"
    [data]="shareData"
    [options]="radialOptions"
    height="18rem"
    ariaLabel="Team allocation as pie chart"
  />
  <aeris-chart
    type="doughnut"
    [data]="shareData"
    [options]="radialOptions"
    height="18rem"
    ariaLabel="Team allocation as doughnut chart"
  />
</div>
```

#### CSS

```css
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 44rem) {
  .chart-grid {
      grid-template-columns: 1fr;
    }
}

.chart-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; } @media (max-width: 44rem) { .chart-grid { grid-template-columns: 1fr; } }
```

### More chart types

Radar, scatter, bubble, and polar area data use the same declarative component API.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions, type ChartData, type ChartOptions } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-types-demo',
  imports: [AerisChartModule],
  templateUrl: './chart-types.demo.html',
  styleUrl: './chart-types.demo.scss'
})
export class ChartTypesMoreChartTypesDemo {
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
  };
}
```

#### HTML

```html
<div class="chart-grid">
  <aeris-chart
    type="radar"
    [data]="radarData"
    [options]="radialOptions"
    height="18rem"
    ariaLabel="Quality metrics radar chart"
  />
  <aeris-chart
    type="polarArea"
    [data]="shareData"
    [options]="radialOptions"
    height="18rem"
    ariaLabel="Team allocation polar area chart"
  />
  <aeris-chart
    type="scatter"
    [data]="scatterData"
    [options]="scatterOptions"
    height="18rem"
    ariaLabel="Experiment reach and value scatter chart"
  />
  <aeris-chart
    type="bubble"
    [data]="bubbleData"
    [options]="scatterOptions"
    height="18rem"
    ariaLabel="Opportunity bubble chart"
  />
</div>
```

#### CSS

```css
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 44rem) {
  .chart-grid {
      grid-template-columns: 1fr;
    }
}

.chart-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; } @media (max-width: 44rem) { .chart-grid { grid-template-columns: 1fr; } }
```

### Dynamic data

Replace chart data immutably to update the existing renderer.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChartModule, type AerisChartData, type AerisChartOptions, type ChartData, type ChartOptions } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-dynamic-demo',
  imports: [AerisButton, AerisChartModule],
  template: `
    <div>
      <aeris-chart
        type="bar"
        [data]="dynamicData()"
        [options]="chartOptions"
        height="20rem"
        ariaLabel="Completed tasks by week"
      />
      <div class="chart-actions">
        <button aerisButton type="button" (click)="addWeek()">Add week</button>
      </div>
    </div>
  `,
  styles: `
    .chart-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.875rem;
    }
    
    .chart-actions { display: flex; gap: 0.5rem; margin-top: 0.875rem; } .chart-actions button { min-height: 2.25rem; padding: 0.45rem 0.75rem; border: 1px solid var(--border); border-radius: var(--aeris-radius-control); background: var(--surface); color: var(--text); font: inherit; font-weight: 700; cursor: pointer; } .chart-actions button:hover { background: var(--surface-2); } .chart-actions button:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
  `
})
export class ChartDynamicDynamicDataDemo {
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
      labels: [...(data.labels ?? []), `Week ${(data.labels?.length ?? 0) + 1}`],
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data, 20 + Math.round(Math.random() * 25)],
      })),
    }));
  }
}
```

### Plugin

Pass Chart.js plugins through the plugins input for chart-specific drawing behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';
import { type n } from 'chart.js';

@Component({
  selector: 'app-chart-plugin-demo',
  imports: [AerisChartModule],
  template: `
    <div>
      <aeris-chart
        type="doughnut"
        [data]="shareData"
        [options]="radialOptions"
        [plugins]="[centerLabelPlugin]"
        height="20rem"
        ariaLabel="Team allocation with total in the center"
      />
    </div>
  `
})
export class ChartPluginPluginDemo {
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
  };
}
```

### Empty state

When no datasets are available, Chart shows a named status message instead of a blank canvas.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-empty-demo',
  imports: [AerisChartModule],
  template: `
    <div>
      <aeris-chart
        [data]="null"
        height="14rem"
        emptyMessage="Reports will appear here when data is available."
      />
    </div>
  `
})
export class ChartEmptyEmptyStateDemo {
}
```

## Accessibility

- Each rendered canvas exposes role="img" and uses ariaLabel as its accessible name.
- ariaDescription provides additional context through an associated hidden description.
- A concise text summary of labels and dataset values is kept available to assistive technologies.
- Empty charts replace the canvas with a named status message.
- Charts are visualizations, not input controls. Provide equivalent controls outside the chart for any action or filtering workflow.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the next native interactive element; charts do not add a keyboard stop. |
