import { Component, signal } from '@angular/core';
import {
  AerisChartModule,
  type AerisChartData,
  type AerisChartOptions,
} from '@aeris-ui/core/chart';
import { AerisTabsModule, type AerisTabChangeEvent } from '@aeris-ui/core/tabs';

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
  selector: 'app-tabs-page',
  imports: [
    AerisChartModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './tabs.page.html',
  styleUrl: './tabs.page.scss',
})
export class TabsPage {
  protected readonly accountTab = signal('profile');
  protected readonly manualTab = signal('overview');
  protected readonly lastChange = signal('No tab change yet');

  protected readonly trafficData: AerisChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sessions',
        data: [1240, 1580, 1470, 1920, 2180, 1760, 2340],
        tension: 0.35,
        fill: true,
      },
    ],
  };

  protected readonly conversionData: AerisChartData = {
    labels: ['Direct', 'Search', 'Social', 'Referral'],
    datasets: [{ label: 'Conversions', data: [420, 680, 310, 250], borderRadius: 7 }],
  };

  protected readonly statisticsOptions: AerisChartOptions = {
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
  };

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tabs-basic', label: 'Basic' },
    { id: 'tabs-controlled', label: 'Controlled state' },
    { id: 'tabs-lazy', label: 'Deferred rendering' },
    { id: 'tabs-disabled', label: 'Disabled tabs' },
    { id: 'tabs-manual', label: 'Manual activation' },
    { id: 'tabs-vertical', label: 'Vertical tabs' },
    { id: 'tabs-variants', label: 'Variants' },
    { id: 'tabs-headers', label: 'Header templates' },
    { id: 'tabs-sizes', label: 'Sizes and alignment' },
    { id: 'tabs-scrollable', label: 'Scrollable tabs' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'tabs-api-inputs', label: 'Tabs inputs' },
    { id: 'tabs-api-panel', label: 'Panel inputs' },
    { id: 'tabs-api-outputs', label: 'Outputs' },
    { id: 'tabs-api-templates', label: 'Templates' },
    { id: 'tabs-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisTabsModule } from '@aeris-ui/core/tabs';`;

  protected readonly controlledCode = `protected readonly accountTab =
  signal('profile');

protected readonly lastChange = signal('No tab change yet');

protected recordChange(event: AerisTabChangeEvent): void {
  this.lastChange.set(
    \`Changed from \${event.previousValue} to \${event.value}\`,
  );
}`;

  protected readonly lazyCode = `protected readonly trafficData: AerisChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Sessions',
      data: [1240, 1580, 1470, 1920, 2180, 1760, 2340],
      tension: 0.35,
      fill: true,
    },
  ],
};

protected readonly conversionData: AerisChartData = {
  labels: ['Direct', 'Search', 'Social', 'Referral'],
  datasets: [
    { label: 'Conversions', data: [420, 680, 310, 250], borderRadius: 7 },
  ],
};

protected readonly statisticsOptions: AerisChartOptions = {
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
};`;

  protected readonly lazyCss = `.statistics-summary {
  min-height: 15rem;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  color: var(--aeris-text-2);
  text-align: center;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.statistics-card {
  min-width: 0;
  padding: 1rem;
  border-radius: var(--aeris-radius-container);
  background: var(--aeris-surface-2);
}

.statistics-card h4 {
  margin: 0 0 0.75rem;
}

@media (max-width: 44rem) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly interfacesCode = `type AerisTabsOrientation = 'horizontal' | 'vertical';
type AerisTabsActivationMode = 'automatic' | 'manual';
type AerisTabsVariant = 'line' | 'pill';
type AerisTabsSize = 'sm' | 'md' | 'lg';
type AerisTabsJustify = 'start' | 'center' | 'end' | 'stretch';
type AerisTabRenderStrategy = 'eager' | 'preserve' | 'active';

interface AerisTabChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: string;
  readonly previousValue: string;
}`;

  protected readonly tabsInputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'string (model)',
      defaultValue: "''",
      description: 'Selected panel value with two-way binding.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name for the tab list.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID reference to visible text that labels the tab list.',
    },
    {
      name: 'orientation',
      type: 'horizontal | vertical',
      defaultValue: "'horizontal'",
      description: 'Visual layout and matching arrow-key direction.',
    },
    {
      name: 'activationMode',
      type: 'automatic | manual',
      defaultValue: "'automatic'",
      description: 'Selects on focus, or waits for Enter or Space.',
    },
    {
      name: 'variant',
      type: 'line | pill',
      defaultValue: "'line'",
      description: 'Underline or contained visual treatment.',
    },
    {
      name: 'size',
      type: 'sm | md | lg',
      defaultValue: "'md'",
      description: 'Tab height, padding, and typography.',
    },
    {
      name: 'justify',
      type: 'start | center | end | stretch',
      defaultValue: "'start'",
      description: 'Horizontal tab alignment.',
    },
    {
      name: 'scrollable',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Keeps horizontal tabs contained and shows scroll controls only when the tab list overflows.',
    },
    {
      name: 'panelTabIndex',
      type: '0 | -1',
      defaultValue: '0',
      description: 'Controls whether the active tabpanel is directly focusable.',
    },
  ];

  protected readonly panelInputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'string, required',
      defaultValue: 'required',
      description: 'Stable selection identifier.',
    },
    {
      name: 'label',
      type: 'string, required',
      defaultValue: 'required',
      description: 'Default visible tab label.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables and removes the tab from keyboard navigation.',
    },
    {
      name: 'renderStrategy',
      type: 'eager | preserve | active',
      defaultValue: "'eager'",
      description:
        'Renders immediately, preserves deferred content after first activation, or mounts deferred content only while active.',
    },
  ];

  protected recordChange(event: AerisTabChangeEvent): void {
    this.lastChange.set(`Changed from ${event.previousValue} to ${event.value}`);
  }
}
