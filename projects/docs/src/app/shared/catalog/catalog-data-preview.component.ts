import { Component, input, ViewEncapsulation } from '@angular/core';
import { AerisOrderListModule } from '@aeris-ui/core/order-list';
import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';
import { AerisPaginator } from '@aeris-ui/core/paginator';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';
import { AerisTableModule } from '@aeris-ui/core/table';
import { AerisTimelineModule } from '@aeris-ui/core/timeline';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-catalog-data-preview',
  host: { class: 'catalog-data-scene', '[attr.data-kind]': 'kind()' },
  encapsulation: ViewEncapsulation.None,
  imports: [
    AerisOrderListModule,
    AerisOrganizationChartModule,
    AerisPaginator,
    AerisPickListModule,
    AerisTableModule,
    AerisTimelineModule,
    AerisTreeModule,
    AerisTreeTableModule,
  ],
  styleUrl: './catalog-data-preview.component.scss',
  template: `
    @switch (kind()) {
      @case ('order-list') {
        <aeris-order-list [items]="priorities" header="Priorities" [showControls]="false" />
      }
      @case ('organization-chart') {
        <div class="preview-data-surface">
          <aeris-organization-chart
            [value]="organization"
            [collapsedKeys]="active() ? [] : ['studio']"
          />
        </div>
      }
      @case ('paginator') {
        <aeris-paginator [totalRecords]="20" [rows]="10" [pageLinkSize]="2" />
      }
      @case ('pick-list') {
        <div class="preview-data-surface">
          <aeris-pick-list
            [source]="items"
            [target]="selected"
            [showSourceControls]="false"
            [showTargetControls]="false"
            sourceHeader="Available"
            targetHeader="Selected"
          />
        </div>
      }
      @case ('table') {
        <aeris-table [data]="rows" [columns]="columns" size="sm" />
      }
      @case ('timeline') {
        <aeris-timeline
          [value]="events"
          align="alternate"
          [responsive]="false"
          [activeIndex]="active() ? 2 : 1"
        />
      }
      @case ('tree') {
        <aeris-tree [value]="nodes" [expandedKeys]="active() ? ['workspace'] : []" />
      }
      @case ('tree-table') {
        <aeris-tree-table
          [value]="tableNodes"
          [columns]="columns"
          [expandedKeys]="active() ? ['project'] : []"
          size="sm"
        />
      }
    }
  `,
})
export class CatalogDataPreviewComponent {
  readonly kind = input.required<string>();
  readonly active = input(false);
  protected readonly priorities = [
    { id: 'plan', label: 'Plan the release' },
    { id: 'design', label: 'Review the design' },
    { id: 'build', label: 'Build the interface' },
    { id: 'test', label: 'Test the details' },
  ];
  protected readonly items = [
    { id: 'plan', label: 'Plan' },
    { id: 'design', label: 'Design' },
  ];
  protected readonly selected = [{ id: 'build', label: 'Build' }];
  protected readonly rows = [
    { name: 'Website', status: 'Active' },
    { name: 'Mobile app', status: 'Review' },
    { name: 'Brand kit', status: 'Done' },
    { name: 'Design system', status: 'Active' },
    { name: 'Documentation', status: 'Review' },
  ];
  protected readonly columns = [
    { field: 'name', header: 'Project', width: '65%' },
    { field: 'status', header: 'Status', width: '35%' },
  ];
  protected readonly nodes = [
    {
      key: 'workspace',
      label: 'Workspace',
      children: [
        { key: 'design', label: 'Design' },
        { key: 'assets', label: 'Assets' },
      ],
    },
  ];
  protected readonly tableNodes = [
    {
      key: 'project',
      data: { name: 'Website', status: 'Active' },
      children: [{ key: 'page', data: { name: 'Landing page', status: 'Review' } }],
    },
  ];
  protected readonly events = [
    { title: 'Planned' },
    { title: 'In progress' },
    { title: 'Delivered' },
  ];
  protected readonly organization = [
    {
      key: 'studio',
      label: 'Studio',
      children: [
        { key: 'design', label: 'Design' },
        { key: 'engineering', label: 'Build' },
      ],
    },
  ];
}
