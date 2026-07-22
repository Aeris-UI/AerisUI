import { Component, signal } from '@angular/core';
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

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tabs-basic', label: 'Basic' },
    { id: 'tabs-controlled', label: 'Controlled state' },
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

  protected readonly interfacesCode = `type AerisTabsOrientation = 'horizontal' | 'vertical';
type AerisTabsActivationMode = 'automatic' | 'manual';
type AerisTabsVariant = 'line' | 'pill';
type AerisTabsSize = 'sm' | 'md' | 'lg';
type AerisTabsJustify = 'start' | 'center' | 'end' | 'stretch';

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

  protected recordChange(event: AerisTabChangeEvent): void {
    this.lastChange.set(`Changed from ${event.previousValue} to ${event.value}`);
  }
}
