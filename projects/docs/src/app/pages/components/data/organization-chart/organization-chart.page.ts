import { Component, signal } from '@angular/core';
import {
  AerisOrganizationChartModule,
  type AerisOrganizationChartNode,
  type AerisOrganizationChartNodeEvent,
  type AerisOrganizationChartSelectionEvent,
} from '@aeris-ui/core/organization-chart';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

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

interface Person {
  readonly name: string;
  readonly role: string;
  readonly team: string;
  readonly tone: 'sage' | 'blue' | 'gold' | 'rose';
}

@Component({
  selector: 'app-organization-chart-page',
  imports: [
    AerisOrganizationChartModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './organization-chart.page.html',
  styleUrl: './organization-chart.page.scss',
})
export class OrganizationChartPage {
  protected readonly chart = this.createChart();
  protected readonly wideChart = this.createWideChart();
  protected readonly selectedSingle = signal<readonly string[]>(['product']);
  protected readonly selectedMultiple = signal<readonly string[]>(['design', 'platform']);
  protected readonly collapsed = signal<readonly string[]>(['ops']);
  protected readonly eventText = signal('No chart event yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'organization-chart-basic', label: 'Basic' },
    { id: 'organization-chart-selection', label: 'Selection' },
    { id: 'organization-chart-multiple', label: 'Multiple selection' },
    { id: 'organization-chart-collapsible', label: 'Collapsible' },
    { id: 'organization-chart-template', label: 'Template' },
    { id: 'organization-chart-scrolling', label: 'Scrolling' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'organization-chart-api-inputs', label: 'Inputs' },
    { id: 'organization-chart-api-models', label: 'Models' },
    { id: 'organization-chart-api-outputs', label: 'Outputs' },
    { id: 'organization-chart-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';`;

  protected readonly basicTsCode = `interface Person {
  readonly name: string;
  readonly role: string;
  readonly team: string;
}

protected readonly chart: readonly AerisOrganizationChartNode<Person>[] = [
  {
    key: 'ceo',
    label: 'Maya Chen',
    type: 'Chief Executive Officer',
    data: { name: 'Maya Chen', role: 'CEO', team: 'Leadership' },
    children: [
      { key: 'product', label: 'Noah Williams', type: 'Product' },
      { key: 'engineering', label: 'Sofia Rossi', type: 'Engineering' },
    ],
  },
];`;

  protected readonly eventsTsCode = `protected readonly selectedSingle = signal<readonly string[]>(['product']);
protected readonly eventText = signal('No chart event yet.');

protected handleSelection(event: AerisOrganizationChartSelectionEvent<Person>): void {
  this.eventText.set(\`Selected \${event.node.label ?? event.key}.\`);
}

protected handleCollapse(event: AerisOrganizationChartNodeEvent<Person>): void {
  this.eventText.set(\`Collapsed \${event.node.label ?? event.key}.\`);
}`;

  protected readonly templateHtmlCode = `<aeris-organization-chart
  class="people-chart"
  ariaLabel="Template organization chart"
  selectionMode="single"
  [value]="chart"
  [(selectionKeys)]="selectedSingle"
>
  <ng-template aerisOrganizationChartNode let-node let-selected="selected">
    <span class="person-card" [attr.data-tone]="node.data?.tone" [attr.data-selected]="selected || null">
      <span class="person-card__avatar">{{ initials(node.data?.name) }}</span>
      <span>
        <strong>{{ node.data?.name }}</strong>
        <small>{{ node.data?.role }}</small>
      </span>
    </span>
  </ng-template>
</aeris-organization-chart>`;

  protected readonly templateCssCode = `.person-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.person-card__avatar {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary-text);
  font-size: 0.75rem;
  font-weight: 800;
}`;

  protected readonly scrollingCssCode = `.wide-chart {
  --aeris-organization-chart-node-min-width: 9rem;
  --aeris-organization-chart-node-gap: 0.5rem;
}`;

  protected readonly interfacesCode = `type AerisOrganizationChartSelectionMode = 'single' | 'multiple';

interface AerisOrganizationChartNode<TData = unknown> {
  readonly key?: string;
  readonly label?: string;
  readonly type?: string;
  readonly data?: TData;
  readonly children?: readonly AerisOrganizationChartNode<TData>[];
  readonly selectable?: boolean;
}

interface AerisOrganizationChartNodeEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
}

interface AerisOrganizationChartSelectionEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly selectedKeys: readonly string[];
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'readonly AerisOrganizationChartNode<TData>[]', defaultValue: '[]', description: 'Root nodes rendered by the chart.' },
    { name: 'selectionMode', type: "'single' | 'multiple' | null", defaultValue: 'null', description: 'Enables single or multiple node selection.' },
    { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Shows branch expand and collapse controls.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Makes the chart fill the available width while preserving horizontal scroll for wide trees.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Organization chart'", description: 'Accessible name for the tree.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No organization chart data available'", description: 'Message shown when value is empty.' },
    { name: 'expandAriaLabel', type: 'string', defaultValue: "'Expand node'", description: 'Accessible label for collapsed branch controls.' },
    { name: 'collapseAriaLabel', type: 'string', defaultValue: "'Collapse node'", description: 'Accessible label for expanded branch controls.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'selectionKeys', type: 'readonly string[]', defaultValue: '[]', description: 'Selected node keys.' },
    { name: 'collapsedKeys', type: 'readonly string[]', defaultValue: '[]', description: 'Collapsed branch keys.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'selectionChanged', type: 'AerisOrganizationChartSelectionEvent<TData>', defaultValue: '-', description: 'Emitted whenever selection changes.' },
    { name: 'nodeSelected', type: 'AerisOrganizationChartSelectionEvent<TData>', defaultValue: '-', description: 'Emitted when a node becomes selected.' },
    { name: 'nodeUnselected', type: 'AerisOrganizationChartSelectionEvent<TData>', defaultValue: '-', description: 'Emitted when a selected node is cleared.' },
    { name: 'nodeExpanded', type: 'AerisOrganizationChartNodeEvent<TData>', defaultValue: '-', description: 'Emitted when a branch expands.' },
    { name: 'nodeCollapsed', type: 'AerisOrganizationChartNodeEvent<TData>', defaultValue: '-', description: 'Emitted when a branch collapses.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisOrganizationChartNode', type: '{ $implicit, node, key, selected, expanded, leaf, level }', defaultValue: '-', description: 'Custom node content while Aeris keeps layout, selection, and collapse behavior.' },
    { name: 'aerisOrganizationChartEmpty', type: 'none', defaultValue: '-', description: 'Custom empty state.' },
  ];

  protected handleSelection(event: AerisOrganizationChartSelectionEvent<Person>): void {
    this.eventText.set(`Selected ${event.node.label ?? event.key}.`);
  }

  protected handleCollapse(event: AerisOrganizationChartNodeEvent<Person>): void {
    this.eventText.set(`Collapsed ${event.node.label ?? event.key}.`);
  }

  protected initials(name: string | undefined): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private person(name: string, role: string, team: string, tone: Person['tone']): Person {
    return { name, role, team, tone };
  }

  private createChart(): readonly AerisOrganizationChartNode<Person>[] {
    return [
      {
        key: 'ceo',
        label: 'Maya Chen',
        type: 'Executive',
        data: this.person('Maya Chen', 'Chief Executive Officer', 'Leadership', 'sage'),
        children: [
          {
            key: 'product',
            label: 'Noah Williams',
            type: 'Product',
            data: this.person('Noah Williams', 'VP Product', 'Product', 'blue'),
            children: [
              { key: 'design', label: 'Lena Park', type: 'Design', data: this.person('Lena Park', 'Design Lead', 'Experience', 'rose') },
              { key: 'research', label: 'Iris Novak', type: 'Research', data: this.person('Iris Novak', 'Research Lead', 'Insights', 'gold') },
            ],
          },
          {
            key: 'engineering',
            label: 'Sofia Rossi',
            type: 'Engineering',
            data: this.person('Sofia Rossi', 'VP Engineering', 'Engineering', 'sage'),
            children: [
              { key: 'platform', label: 'Eli Brooks', type: 'Platform', data: this.person('Eli Brooks', 'Platform Lead', 'Core', 'blue') },
              { key: 'quality', label: 'Ava Patel', type: 'Quality', data: this.person('Ava Patel', 'Quality Lead', 'QA', 'gold') },
            ],
          },
          {
            key: 'ops',
            label: 'Liam Novak',
            type: 'Operations',
            data: this.person('Liam Novak', 'Operations Director', 'Operations', 'rose'),
            children: [
              { key: 'finance', label: 'Mila Costa', type: 'Finance', data: this.person('Mila Costa', 'Finance Lead', 'Finance', 'sage') },
              { key: 'people', label: 'Theo Stone', type: 'People', data: this.person('Theo Stone', 'People Lead', 'People', 'blue') },
            ],
          },
        ],
      },
    ];
  }

  private createWideChart(): readonly AerisOrganizationChartNode<Person>[] {
    const teams = ['Growth', 'Support', 'Data', 'Security', 'Mobile', 'Web', 'Infrastructure', 'Enablement'];
    return [
      {
        key: 'wide-root',
        label: 'Aeris Group',
        type: 'Company',
        data: this.person('Aeris Group', 'Organization', 'Company', 'sage'),
        children: teams.map((team, index) => ({
          key: `wide-${team.toLowerCase()}`,
          label: team,
          type: 'Team',
          data: this.person(`${team} Team`, 'Team', team, index % 2 === 0 ? 'blue' : 'gold'),
        })),
      },
    ];
  }
}
