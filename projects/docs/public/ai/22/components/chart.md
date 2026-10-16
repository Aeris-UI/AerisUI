# Chart

> Chart.js-powered data visualization with responsive rendering, theme-aware defaults, and accessible summaries.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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

### Helper Exports

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `createAerisChartAreaFill(color, opacity?)` | `&lt;TType extends ChartType&gt;(context: ScriptableContext&lt;TType&gt;) =&gt; CanvasGradient &#124; string` | `-` | Assign the returned callback to a line dataset backgroundColor, and set fill: true. Cached per chart; rebuilds after vertical geometry or device-pixel-ratio changes. Safe to create during server rendering. |
| `color (area fill)` | `string` | `required` | A solid color supported by Chart.js, such as HEX, RGB, HSL or a named color. Resolve CSS variables before passing them. Unsupported values produce a transparent fill. |
| `opacity (area fill)` | `number` | `0.24` | Alpha at the top of the plotting area, fading to zero at its bottom. Clamped to 0–1; non-finite values use 0.24. |
| `createAerisChartComparisonGuide(options?)` | `AerisChartPlugin` | `{}` | Pass the returned plugin in plugins. Draws a dotted vertical guide for active Cartesian elements. Configure interaction.mode: index and intersect: false to compare series. It does not alter interaction, tooltips or datasets. |
| `options.color (comparison guide)` | `string` | `--aeris-text-3` | Optional solid canvas stroke color. Inherits the text token on every draw when omitted. |
| `options.width (comparison guide)` | `number` | `1` | Stroke width in CSS pixels. Zero or negative values hide the guide; non-finite values use 1. |
| `options.dash (comparison guide)` | `readonly number[]` | `[3, 4]` | Alternating dash and gap lengths in CSS pixels. Empty draws a solid line. Negative and non-finite entries are ignored. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `AerisChartType` | `'bar'` | Chart visualization type. |
| `data` | `AerisChartData &#124; null` | `null` | Chart labels and dataset values. |
| `options` | `AerisChartOptions &#124; null` | `null` | Chart.js options, callbacks and external tooltips override Aeris defaults. Default animation duration is 220ms; system reduced motion always disables animation. Theme changes update the existing renderer. |
| `plugins` | `readonly AerisChartPlugin[]` | `[]` | Chart.js plugins applied to this chart instance. |
| `height` | `string` | `'20rem'` | Chart container block size. |
| `responsive` | `boolean` | `true` | Passes responsive rendering to Chart.js. |
| `redraw` | `boolean` | `false` | Recreates the renderer whenever chart inputs update. |
| `ariaLabel` | `string` | `'Chart'` | Accessible name for the chart canvas. |
| `ariaDescription` | `string` | `''` | Additional chart description referenced by the canvas. |
| `emptyMessage` | `string` | `'No chart data available'` | Status message shown when data is null, has no datasets, or every dataset has an empty data array. This is not a loading indicator. |

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

interface AerisChartComparisonGuideOptions {
  readonly color?: string;
  readonly width?: number;
  readonly dash?: readonly number[];
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-chart-min-height` | `length` | `12rem` | Minimum chart container height. |
| `--aeris-chart-padding` | `length` | `1rem` | Space between the rendered chart and its container border. |
| `--aeris-chart-border` | `color` | `--aeris-border` | Container border color. |
| `--aeris-chart-radius` | `length` | `--aeris-radius-surface` | Container corner radius. |
| `--aeris-chart-background` | `color` | `--aeris-surface` | Container background. |
| `--aeris-chart-color` | `color` | `--aeris-text` | Base text color used by the chart surface. |
| `--aeris-chart-empty-color` | `color` | `--aeris-text-muted` | Empty-state text color. |

## Examples

### Bar chart

Compare related values with a responsive bar chart and an accessible description.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';

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
    devicePixelRatio:
        typeof window === 'undefined'
          ? 2
          : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';

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
    devicePixelRatio:
        typeof window === 'undefined'
          ? 2
          : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };
}
```

### Fading area fill

Use the optional area-fill helper for a translucent fade beneath a line. It caches its canvas gradient and adapts to resizing. Turn the fill off to keep the same line without an area.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-area-demo',
  imports: [AerisButton, AerisChartModule],
  templateUrl: './chart-area.demo.html',
  styleUrl: './chart-area.demo.scss'
})
export class ChartAreaFadingAreaFillDemo {
}
```

#### HTML

```html
<div>
  <aeris-chart
    type="line"
    [data]="areaEnabled() ? areaData : areaLineData"
    [options]="areaOptions"
    height="20rem"
    ariaLabel="Completed orders this week"
    ariaDescription="Orders increased from 34 on Monday to 96 on Sunday, with small declines on Wednesday and Friday."
  />
  <div class="chart-actions">
    <button
      aerisButton
      type="button"
      variant="outline"
      [attr.aria-pressed]="areaEnabled()"
      (click)="areaEnabled.set(!areaEnabled())"
    >
      {{ areaEnabled() ? 'Hide area fill' : 'Show area fill' }}
    </button>
  </div>
</div>
```

#### CSS

```css
.chart-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.875rem;
}
```

### Compare multiple series

Hover or touch a month to compare both series in one tooltip. Index interaction is native Chart.js behavior; the optional comparison-guide helper adds the dotted vertical line.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-comparison-demo',
  imports: [AerisChartModule],
  templateUrl: './chart-comparison.demo.html'
})
export class ChartComparisonCompareMultipleSeriesDemo {
}
```

#### HTML

```html
<div>
  <aeris-chart
    type="line"
    [data]="comparisonData"
    [options]="comparisonOptions"
    [plugins]="comparisonPlugins"
    height="22rem"
    ariaLabel="Monthly subscriptions and renewals"
    ariaDescription="June has 420 new subscriptions and 320 renewals. Both series increase overall from January to June."
  />
  <p>
    June: 420 new subscriptions and 320 renewals. The series are overlaid, not
    stacked.
  </p>
</div>
```

### Radial charts and gauges

Slim progress fills have subtly rounded ends and become seamless when complete. Doughnut options support rings, semicircular gauges and spaced concentric series without another dependency. For a single accessible progress indicator rather than a data visualization, use ProgressSpinner.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-radial-demo',
  imports: [AerisChartModule],
  templateUrl: './chart-radial.demo.html',
  styleUrl: './chart-radial.demo.scss'
})
export class ChartRadialRadialChartsAndGaugesDemo {
}
```

#### HTML

```html
<div>
  <div class="chart-radial-grid">
    <section aria-label="Progress ring">
      <h4>Release readiness</h4>
      <div class="chart-ring">
        <aeris-chart
          type="doughnut"
          [data]="ringData"
          [options]="ringOptions"
          height="14rem"
          ariaLabel="Release readiness: 76 percent complete"
        />
        <span class="chart-ring-value" aria-hidden="true">76<span>%</span></span>
      </div>
      <p>76 of 100 release checks completed.</p>
    </section>
    <section aria-label="Semicircular gauge">
      <h4>Capacity used</h4>
      <aeris-chart
        type="doughnut"
        [data]="gaugeData"
        [options]="gaugeOptions"
        height="14rem"
        ariaLabel="Capacity used: 76 percent"
      />
      <p><strong>76%</strong> used · 24% available</p>
    </section>
    <section aria-label="Concentric goal rings">
      <h4>Quarterly goals</h4>
      <aeris-chart
        type="doughnut"
        [data]="goalData"
        [options]="goalOptions"
        height="14rem"
        ariaLabel="Quarterly goals: Design 88 percent, Development 72 percent, Testing 56 percent"
      />
      <ul class="chart-goals">
        @for (goal of goalSeries; track goal.label) {
          <li>
            <span
              class="chart-goal-dot"
              [style.background]="goal.color"
              aria-hidden="true"
            ></span>
            <span>{{ goal.label }}</span>
            <strong>{{ goal.value }}%</strong>
          </li>
        }
      </ul>
    </section>
  </div>
</div>
```

#### CSS

```css
.chart-radial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  gap: 1.5rem;
}

.chart-radial-grid section {
  min-inline-size: 0;
}

.chart-radial-grid h4 {
  margin-block: 0 1rem;
  text-align: start;
}

.chart-radial-grid aeris-chart {
  --aeris-chart-border: transparent;
  --aeris-chart-padding: 0.5rem;
  --aeris-chart-background: transparent;
  inline-size: 100%;
  max-inline-size: 14rem;
  margin-inline: auto;
}

.chart-ring {
  position: relative;
  inline-size: 100%;
  max-inline-size: 14rem;
  margin-inline: auto;
}

.chart-ring-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  pointer-events: none;
}

.chart-ring-value span {
  font-size: 1rem;
  margin-inline-start: 0.125rem;
}

.chart-goals {
  list-style: none;
  padding: 0;
  margin-block: 1rem 0;
  display: grid;
  gap: 0.5rem;
}

.chart-goals li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-goals strong {
  margin-inline-start: auto;
}

.chart-goal-dot {
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  flex: 0 0 auto;
}
```

### Circular charts

Pie and doughnut variants present proportional parts of a whole.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';

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
    devicePixelRatio:
        typeof window === 'undefined'
          ? 2
          : Math.max(window.devicePixelRatio, Math.min(4, window.devicePixelRatio * 2)),
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
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';

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
import { AerisChartModule, type AerisChartData, type AerisChartOptions } from '@aeris-ui/core/chart';

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

    .chart-actions { display: flex; gap: 0.5rem; margin-top: 0.875rem; }
  `
})
export class ChartDynamicDynamicDataDemo {
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
import { type Plugin } from 'chart.js';

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

### Compact KPI and sparkline

Compose a small trend chart with a real Card. Keep the headline value and a written trend visible without requiring a tooltip.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-compact-demo',
  imports: [AerisCardModule, AerisChartModule],
  templateUrl: './chart-compact.demo.html',
  styleUrl: './chart-compact.demo.scss'
})
export class ChartCompactCompactKPIAndSparklineDemo {
}
```

#### HTML

```html
<div class="chart-kpi">
  <aeris-card>
    <div aerisCardHeader><h4 aerisCardTitle>Orders this week</h4></div>
    <p class="chart-kpi-value">273</p>
    <p>Daily orders increased from 28 on Monday to 52 on Sunday.</p>
    <aeris-chart
      class="chart-sparkline"
      type="line"
      [data]="compactData"
      [options]="compactOptions"
      height="5rem"
      ariaLabel="Daily orders this week"
    />
  </aeris-card>
</div>
```

#### CSS

```css
.chart-kpi {
  max-inline-size: 24rem;
}

.chart-kpi-value {
  margin-block: 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
}

.chart-sparkline {
  --aeris-chart-min-height: 0;
  --aeris-chart-padding: 0;
  --aeris-chart-border: transparent;
  --aeris-chart-background: transparent;
}
```

### Mixed series and formatting

Combine bars and a target line. Use native Chart.js callbacks to format axis values and tooltips as currency; no extra formatter API is required.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-mixed-demo',
  imports: [AerisChartModule],
  template: `
    <div>
      <aeris-chart
        type="bar"
        [data]="mixedData"
        [options]="moneyOptions"
        height="22rem"
        ariaLabel="Revenue and target in US dollars"
        ariaDescription="Revenue totals $16,300 for January through April. April revenue is $5,200, exceeding its $4,800 target."
      />
      <p>January–April revenue: $16,300. April exceeded its target by $400.</p>
    </div>
  `
})
export class ChartMixedMixedSeriesAndFormattingDemo {
}
```

### Stacked values

Stack related series to compare totals and their composition. The written summary conveys the main result without relying on color or hover.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChartModule } from '@aeris-ui/core/chart';

@Component({
  selector: 'app-chart-stacked-demo',
  imports: [AerisChartModule],
  template: `
    <div>
      <aeris-chart
        type="bar"
        [data]="stackedData"
        [options]="stackedOptions"
        height="22rem"
        ariaLabel="Completed tasks by discipline"
        ariaDescription="Weekly totals are 28, 38, 42 and 52 tasks. In week four, Design completed 14, Development 26 and Testing 12."
      />
      <p>
        Weekly totals: 28, 38, 42 and 52 tasks. Every discipline completed more tasks in
        week four than in week one.
      </p>
    </div>
  `
})
export class ChartStackedStackedValuesDemo {
}
```

### Loading composition

Use Skeleton while waiting for data, then render Chart. Keep loading state in your application rather than using an empty chart to imply an active request.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChartModule } from '@aeris-ui/core/chart';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-chart-loading-demo',
  imports: [AerisButton, AerisChartModule, AerisSkeletonModule],
  templateUrl: './chart-loading.demo.html',
  styleUrl: './chart-loading.demo.scss'
})
export class ChartLoadingLoadingCompositionDemo {
}
```

#### HTML

```html
<div>
  <div class="chart-loading-region" [attr.aria-busy]="loadingReport()">
    @if (loadingReport()) {
      <aeris-skeleton shape="rectangle" height="14rem" />
    } @else {
      <aeris-chart
        type="line"
        [data]="trendData"
        [options]="chartOptions"
        height="14rem"
        ariaLabel="Active projects over seven days"
      />
    }
  </div>
  <p role="status">{{ loadingReport() ? 'Loading report…' : 'Report loaded.' }}</p>
  <button aerisButton type="button" (click)="loadingReport.set(!loadingReport())">
    {{ loadingReport() ? 'Show report' : 'Show loading state' }}
  </button>
</div>
```

#### CSS

```css
.chart-loading-region {
  min-block-size: 14rem;
}
```

## Accessibility

- Each rendered canvas exposes role="img" and uses ariaLabel as its accessible name.
- ariaDescription provides additional context through an associated hidden description.
- A text summary of labels and dataset values is associated with the canvas through aria-describedby. Add a visible summary or data table when readers need to compare exact values.
- Empty charts replace the canvas with a named status message.
- Charts are visualizations, not input controls. Provide equivalent controls outside the chart for any action or filtering workflow.
- Canvas tooltips and legends are pointer interactions, not keyboard controls. Do not put essential information only in a tooltip, and provide external native controls for toggling datasets when that action is required.
- Aeris disables Chart.js animations when the system requests reduced motion, including when the preference changes while the chart is open.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the next native interactive element; charts do not add a keyboard stop. |
