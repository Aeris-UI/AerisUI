import { Component, signal } from '@angular/core';
import { AerisBadgeModule, type AerisBadgeSeverity } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisTreeTableModule,
  type AerisTreeTableCellEditEvent,
  type AerisTreeTableColumn,
  type AerisTreeTableColumnReorderEvent,
  type AerisTreeTableColumnResizeEvent,
  type AerisTreeTableData,
  type AerisTreeTableFilterEvent,
  type AerisTreeTableLazyLoadEvent,
  type AerisTreeTableNode,
  type AerisTreeTableNodeEvent,
  type AerisTreeTableSelectionEvent,
  type AerisTreeTableSort,
} from '@aeris-ui/core/tree-table';
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

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

const FILE_COLUMNS: readonly AerisTreeTableColumn[] = [
  { field: 'name', header: 'Name', sortable: true, filterable: true, frozen: true, width: '15rem' },
  {
    field: 'size',
    header: 'Size (KB)',
    sortable: true,
    filterable: true,
    editable: true,
    align: 'end',
    width: '8rem',
  },
  { field: 'type', header: 'Type', sortable: true, filterable: true, width: '9rem' },
  { field: 'modified', header: 'Modified', sortable: true, filterable: true, width: '10rem' },
];

@Component({
  selector: 'app-tree-table-page',
  imports: [
    AerisBadgeModule,
    AerisButton,
    AerisTreeTableModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './tree-table.page.html',
  styleUrl: './tree-table.page.scss',
})
export class TreeTablePage {
  protected readonly files = this.createFiles();
  protected readonly columns = FILE_COLUMNS;
  protected readonly statusSeverities: Readonly<Record<FileRecord['status'], AerisBadgeSeverity>> =
    {
      active: 'success',
      review: 'warning',
      archived: 'neutral',
    };
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
  protected readonly controlledExpanded = signal<readonly string[]>(['workspace']);
  protected readonly sorts = signal<readonly AerisTreeTableSort[]>([]);
  protected readonly globalQuery = signal('');
  protected readonly columnFilters = signal<Readonly<Record<string, string>>>({});
  protected readonly singleSelection = signal<readonly string[]>(['readme']);
  protected readonly multipleSelection = signal<readonly string[]>(['app', 'readme']);
  protected readonly checkboxSelection = signal<readonly string[]>(['assets', 'logo', 'cover']);
  protected readonly pageFirst = signal(0);
  protected readonly pageRows = signal(2);
  protected readonly editableFiles = signal<readonly AerisTreeTableNode<FileRecord>[]>(this.files);
  protected readonly editableExpanded = signal<readonly string[]>(['workspace', 'source']);
  protected readonly managedColumns = signal<readonly AerisTreeTableColumn[]>(
    FILE_COLUMNS.map((column) => ({ ...column })),
  );
  protected readonly lazyRows = signal<readonly AerisTreeTableNode<FileRecord>[]>([
    this.fileNode('remote-1', 'Remote workspace 1', 0, 'folder', 'Today', 'active', false),
    this.fileNode('remote-2', 'Remote workspace 2', 0, 'folder', 'Today', 'review', false),
  ]);
  protected readonly lazyExpanded = signal<readonly string[]>([]);
  protected readonly lazyLoadingKeys = signal<readonly string[]>([]);
  protected readonly lazyFirst = signal(0);
  protected readonly lazyPageRows = signal(5);
  protected readonly eventText = signal('No TreeTable event yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tree-table-basic', label: 'Basic' },
    { id: 'tree-table-controlled', label: 'Controlled expansion' },
    { id: 'tree-table-sorting', label: 'Sorting' },
    { id: 'tree-table-filtering', label: 'Filtering' },
    { id: 'tree-table-single-selection', label: 'Single selection' },
    { id: 'tree-table-multiple-selection', label: 'Multiple selection' },
    { id: 'tree-table-checkbox-selection', label: 'Checkbox selection' },
    { id: 'tree-table-pagination', label: 'Pagination' },
    { id: 'tree-table-editing', label: 'Editing' },
    { id: 'tree-table-columns', label: 'Column controls' },
    { id: 'tree-table-scrolling', label: 'Scrolling and responsive' },
    { id: 'tree-table-lazy', label: 'Lazy loading' },
    { id: 'tree-table-templates', label: 'Templates' },
    { id: 'tree-table-states', label: 'States' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'tree-table-api-inputs', label: 'Inputs' },
    { id: 'tree-table-api-models', label: 'Models' },
    { id: 'tree-table-api-outputs', label: 'Outputs' },
    { id: 'tree-table-api-templates', label: 'Templates' },
    { id: 'tree-table-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisTreeTableModule } from '@aeris-ui/core/tree-table';`;

  private readonly dataCode = `type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

protected readonly columns: readonly AerisTreeTableColumn[] = [
  { field: 'name', header: 'Name', sortable: true, filterable: true, frozen: true, width: '15rem' },
  { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, editable: true, align: 'end', width: '8rem' },
  { field: 'type', header: 'Type', sortable: true, filterable: true, width: '9rem' },
  { field: 'modified', header: 'Modified', sortable: true, filterable: true, width: '10rem' },
];

protected readonly files: readonly AerisTreeTableNode<FileRecord>[] = [
  {
    key: 'workspace',
    data: { name: 'Aeris workspace', size: 48, type: 'folder', modified: 'Today', status: 'active' },
    children: [
      {
        key: 'source',
        data: { name: 'Source', size: 24, type: 'folder', modified: 'Today', status: 'active' },
        children: [
          { key: 'app', data: { name: 'app.ts', size: 6, type: 'typescript', modified: 'Today', status: 'active' }, leaf: true },
          { key: 'tokens', data: { name: 'tokens.scss', size: 8, type: 'stylesheet', modified: 'Yesterday', status: 'review' }, leaf: true },
        ],
      },
      { key: 'readme', data: { name: 'README.md', size: 10, type: 'document', modified: 'Monday', status: 'active' }, leaf: true },
    ],
  },
];`;

  protected readonly basicTsCode = `${this.dataCode}

protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);`;

  protected readonly controlledTsCode = `${this.dataCode}

protected readonly controlledExpanded = signal<readonly string[]>(['workspace']);

protected expandAll(): void {
  this.controlledExpanded.set(['workspace', 'source', 'assets']);
}

protected collapseAll(): void {
  this.controlledExpanded.set([]);
}`;

  protected readonly controlsCssCode = `.tree-table-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}`;

  protected readonly sortingTsCode = `${this.dataCode}

protected readonly sorts = signal<readonly AerisTreeTableSort[]>([]);`;
  protected readonly filteringTsCode = `${this.dataCode}

protected readonly globalQuery = signal('');
protected readonly columnFilters = signal<Readonly<Record<string, string>>>({});

protected handleFilter(event: AerisTreeTableFilterEvent<FileRecord>): void {
  this.eventText.set(\`Showing \${event.value.length} matching root rows.\`);
}`;
  protected readonly selectionTsCode = `${this.dataCode}

protected readonly singleSelection = signal<readonly string[]>(['readme']);

protected handleSelection(event: AerisTreeTableSelectionEvent<FileRecord>): void {
  this.eventText.set(event.selected ? \`Selected \${event.node.data.name}.\` : \`Cleared \${event.node.data.name}.\`);
}`;
  protected readonly multipleSelectionTsCode = `${this.dataCode}

protected readonly multipleSelection = signal<readonly string[]>(['app', 'readme']);`;
  protected readonly checkboxSelectionTsCode = `${this.dataCode}

protected readonly checkboxSelection = signal<readonly string[]>(['assets', 'logo', 'cover']);`;
  protected readonly paginationTsCode = `${this.dataCode}

protected readonly pageFirst = signal(0);
protected readonly pageRows = signal(2);`;
  protected readonly editingTsCode = `${this.dataCode}

protected readonly editableFiles = signal<readonly AerisTreeTableNode<FileRecord>[]>(this.files);

protected handleEdit(event: AerisTreeTableCellEditEvent<FileRecord>): void {
  this.eventText.set(\`Updated \${event.node.data.name} / \${event.field} to \${event.value}.\`);
}`;
  protected readonly columnTsCode = `${this.dataCode}

protected readonly managedColumns = signal<readonly AerisTreeTableColumn[]>(
  FILE_COLUMNS.map((column) => ({ ...column })),
);

protected handleResize(event: AerisTreeTableColumnResizeEvent): void {
  this.eventText.set(\`Resized \${event.field} to \${event.width}.\`);
}

protected handleReorder(event: AerisTreeTableColumnReorderEvent): void {
  this.eventText.set(\`Moved \${event.field} to column \${event.toIndex + 1}.\`);
}`;
  protected readonly lazyTsCode = `${this.dataCode}

protected readonly lazyRows = signal<readonly AerisTreeTableNode<FileRecord>[]>([
  { key: 'remote-1', data: { name: 'Remote workspace 1', size: 0, type: 'folder', modified: 'Today', status: 'active' }, leaf: false },
]);
protected readonly lazyLoadingKeys = signal<readonly string[]>([]);

protected handleLazyLoad(event: AerisTreeTableLazyLoadEvent): void {
  requestPage(event).then((nodes) => this.lazyRows.set(nodes));
}

protected handleLazyExpand(event: AerisTreeTableNodeEvent<FileRecord>): void {
  this.lazyLoadingKeys.set([event.key]);
  requestChildren(event.key).then((children) => {
    this.lazyRows.update((nodes) => attachChildren(nodes, event.key, children));
    this.lazyLoadingKeys.set([]);
  });
}`;
  protected readonly templateHtmlCode = `<aeris-tree-table
  ariaLabel="Project review hierarchy"
  [value]="files"
  [columns]="columns"
  [expandedKeys]="['workspace', 'source']"
>
  <ng-template aerisTreeTableHeader let-column let-sort="sort">
    <span class="column-heading" [attr.data-sorted]="sort || null">{{ column.header }}</span>
  </ng-template>

  <ng-template aerisTreeTableCell let-value let-data="data" let-column="column">
    @if (column.field === 'type') {
      <aeris-badge
        [value]="$any(value)"
        [severity]="$any(statusSeverities)[$any(data).status]"
        size="sm"
        variant="soft"
      />
    } @else {
      {{ value }}
    }
  </ng-template>
</aeris-tree-table>`;
  protected readonly templateTsCode = `${this.dataCode}

protected readonly statusSeverities: Readonly<
  Record<FileRecord['status'], AerisBadgeSeverity>
> = {
  active: 'success',
  review: 'warning',
  archived: 'neutral',
};`;
  protected readonly templateCssCode = `.column-heading[data-sorted] { color: var(--primary-text); }
`;

  protected readonly interfacesCode = `type AerisTreeTableData = Readonly<Record<string, unknown>>;
type AerisTreeTableSize = 'sm' | 'md' | 'lg';
type AerisTreeTableSelectionMode = 'single' | 'multiple' | 'checkbox';
type AerisTreeTableSortDirection = 'asc' | 'desc';
type AerisTreeTableSortMode = 'single' | 'multiple';
type AerisTreeTableFilterStrategy = 'subtree' | 'path';
type AerisTreeTableResponsiveMode = 'scroll' | 'stack';

interface AerisTreeTableNode<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly key: string;
  readonly data: TData;
  readonly children?: readonly AerisTreeTableNode<TData>[];
  readonly leaf?: boolean;
  readonly disabled?: boolean;
  readonly selectable?: boolean;
}

interface AerisTreeTableColumn {
  readonly field: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly editable?: boolean;
  readonly frozen?: boolean;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
}

interface AerisTreeTableSort {
  readonly field: string;
  readonly direction: AerisTreeTableSortDirection;
}

interface AerisTreeTableNodeEvent<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly originalEvent: Event;
  readonly node: AerisTreeTableNode<TData>;
  readonly key: string;
}

interface AerisTreeTableSelectionEvent<TData extends AerisTreeTableData = AerisTreeTableData>
  extends AerisTreeTableNodeEvent<TData> {
  readonly selected: boolean;
  readonly selectedKeys: readonly string[];
}

interface AerisTreeTableSortEvent {
  readonly originalEvent: Event;
  readonly sorts: readonly AerisTreeTableSort[];
}

interface AerisTreeTableFilterEvent<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly originalEvent: Event | null;
  readonly globalValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly value: readonly AerisTreeTableNode<TData>[];
}

interface AerisTreeTablePageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}

interface AerisTreeTableLazyLoadEvent {
  readonly first: number;
  readonly rows: number;
  readonly sorts: readonly AerisTreeTableSort[];
  readonly globalValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
}

interface AerisTreeTableCellEditEvent<TData extends AerisTreeTableData = AerisTreeTableData>
  extends AerisTreeTableNodeEvent<TData> {
  readonly field: string;
  readonly previousValue: unknown;
  readonly value: unknown;
}

interface AerisTreeTableColumnResizeEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly width: string;
  readonly columns: readonly AerisTreeTableColumn[];
}

interface AerisTreeTableColumnReorderEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly columns: readonly AerisTreeTableColumn[];
}

interface AerisTreeTableHeaderContext {
  readonly $implicit: AerisTreeTableColumn;
  readonly column: AerisTreeTableColumn;
  readonly sort: AerisTreeTableSortDirection | null;
}

interface AerisTreeTableCellContext<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly $implicit: unknown;
  readonly value: unknown;
  readonly node: AerisTreeTableNode<TData>;
  readonly data: TData;
  readonly column: AerisTreeTableColumn;
  readonly rowIndex: number;
  readonly level: number;
  readonly expanded: boolean;
  readonly selected: boolean;
  readonly leaf: boolean;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'treeColumn',
      type: 'string',
      defaultValue: "''",
      description:
        'Column field that owns indentation, toggles, and checkbox controls. Defaults to the first column.',
    },
    { name: 'caption', type: 'string', defaultValue: "''", description: 'Native table caption.' },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Tree table'",
      description: 'Accessible name for the treegrid.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Cell density.',
    },
    {
      name: 'striped',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Alternates row backgrounds.',
    },
    {
      name: 'gridlines',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows vertical cell borders.',
    },
    {
      name: 'hoverable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Highlights the hovered row.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Fills the available width.',
    },
    {
      name: 'responsiveMode',
      type: "'scroll' | 'stack'",
      defaultValue: "'scroll'",
      description: 'Keeps horizontal overflow or stacks labeled cells on narrow screens.',
    },
    {
      name: 'scrollable',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Makes the viewport keyboard-focusable with sticky headers.',
    },
    {
      name: 'scrollHeight',
      type: 'string',
      defaultValue: "''",
      description: 'Maximum scrollable viewport height.',
    },
    {
      name: 'tableMinWidth',
      type: 'string',
      defaultValue: "'42rem'",
      description: 'Minimum table width before horizontal scrolling.',
    },
    {
      name: 'selectionMode',
      type: "'single' | 'multiple' | 'checkbox' | null",
      defaultValue: 'null',
      description: 'Enables row or cascading checkbox selection.',
    },
    {
      name: 'propagateSelection',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Cascades checkbox state through selectable descendants.',
    },
    {
      name: 'sortMode',
      type: "'single' | 'multiple'",
      defaultValue: "'single'",
      description: 'Keeps one sort or composes multiple sorts.',
    },
    {
      name: 'removableSort',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Allows the third sort activation to clear the column.',
    },
    {
      name: 'globalFilter',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the global search field.',
    },
    {
      name: 'columnFilter',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows per-column search fields.',
    },
    {
      name: 'filterStrategy',
      type: "'subtree' | 'path'",
      defaultValue: "'path'",
      description: 'Includes all descendants of a matched branch or only matched paths.',
    },
    {
      name: 'globalFilterLabel',
      type: 'string',
      defaultValue: "'Search'",
      description: 'Visible global filter label.',
    },
    {
      name: 'globalFilterPlaceholder',
      type: 'string',
      defaultValue: "'Search rows'",
      description: 'Global filter placeholder.',
    },
    {
      name: 'columnFilterPlaceholder',
      type: 'string',
      defaultValue: "''",
      description:
        'Shared column filter placeholder; column-specific text is generated when empty.',
    },
    {
      name: 'paginator',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Paginates root nodes using the Aeris paginator.',
    },
    {
      name: 'pageLinkSize',
      type: 'number',
      defaultValue: '5',
      description: 'Maximum visible page links.',
    },
    {
      name: 'rowsPerPageOptions',
      type: 'readonly number[]',
      defaultValue: '[]',
      description: 'Selectable root-row page sizes.',
    },
    {
      name: 'lazy',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Delegates sorting, filtering, and paging to lazyLoad.',
    },
    {
      name: 'totalRecords',
      type: 'number',
      defaultValue: '0',
      description: 'Logical root-row count in lazy mode.',
    },
    {
      name: 'loading',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Replaces rows with the loading state.',
    },
    {
      name: 'loadingKeys',
      type: 'readonly string[]',
      defaultValue: '[]',
      description: 'Branch keys currently loading children.',
    },
    {
      name: 'loadingMessage',
      type: 'string',
      defaultValue: "'Loading rows'",
      description: 'Default loading status text.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No rows available'",
      description: 'Default empty status text.',
    },
    {
      name: 'emptyFilterMessage',
      type: 'string',
      defaultValue: "'No matching rows'",
      description: 'Default no-results status text.',
    },
    {
      name: 'editable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Marks editable cells and enables double-click editing for editable columns.',
    },
    {
      name: 'resizableColumns',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Adds width-preserving pointer and keyboard column resize separators.',
    },
    {
      name: 'reorderableColumns',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Enables header dragging and Alt+Arrow column reordering.',
    },
    {
      name: 'minColumnWidth',
      type: 'number',
      defaultValue: '96',
      description: 'Minimum resized column width in pixels.',
    },
    {
      name: 'showOverflowTooltip',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows an Aeris Tooltip for truncated header and cell values only when ellipsis is active.',
    },
    {
      name: 'expandAriaLabel',
      type: 'string',
      defaultValue: "'Expand row'",
      description: 'Accessible label for collapsed branch controls.',
    },
    {
      name: 'collapseAriaLabel',
      type: 'string',
      defaultValue: "'Collapse row'",
      description: 'Accessible label for expanded branch controls.',
    },
    {
      name: 'selectRowAriaLabel',
      type: 'string',
      defaultValue: "'Select row'",
      description: 'Accessible label for checkbox selection controls.',
    },
    {
      name: 'paginatorAriaLabel',
      type: 'string',
      defaultValue: "'Tree table pagination'",
      description: 'Accessible name for pagination.',
    },
  ];

  protected readonly models: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'readonly AerisTreeTableNode<TData>[]',
      defaultValue: '[]',
      description: 'Root nodes; editing writes immutable node data.',
    },
    {
      name: 'columns',
      type: 'readonly AerisTreeTableColumn[]',
      defaultValue: '[]',
      description: 'Dynamic columns; resizing and reordering update this model.',
    },
    {
      name: 'expandedKeys',
      type: 'readonly string[]',
      defaultValue: '[]',
      description: 'Expanded branch keys.',
    },
    {
      name: 'selectionKeys',
      type: 'readonly string[]',
      defaultValue: '[]',
      description: 'Selected node keys.',
    },
    {
      name: 'sorts',
      type: 'readonly AerisTreeTableSort[]',
      defaultValue: '[]',
      description: 'Ordered sort definitions.',
    },
    {
      name: 'globalFilterValue',
      type: 'string',
      defaultValue: "''",
      description: 'Global search value.',
    },
    {
      name: 'columnFilters',
      type: 'Readonly<Record<string, string>>',
      defaultValue: '{}',
      description: 'Filter values keyed by column field.',
    },
    { name: 'first', type: 'number', defaultValue: '0', description: 'First root-row index.' },
    { name: 'rows', type: 'number', defaultValue: '10', description: 'Root rows per page.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'nodeExpanded',
      type: 'AerisTreeTableNodeEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when a branch expands.',
    },
    {
      name: 'nodeCollapsed',
      type: 'AerisTreeTableNodeEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when a branch collapses.',
    },
    {
      name: 'selectionChanged',
      type: 'AerisTreeTableSelectionEvent<TData>',
      defaultValue: '-',
      description: 'Emitted whenever selection changes.',
    },
    {
      name: 'nodeSelected',
      type: 'AerisTreeTableSelectionEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when selection is added.',
    },
    {
      name: 'nodeUnselected',
      type: 'AerisTreeTableSelectionEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when selection is removed.',
    },
    {
      name: 'sorted',
      type: 'AerisTreeTableSortEvent',
      defaultValue: '-',
      description: 'Emitted after controlled sort state changes.',
    },
    {
      name: 'filtered',
      type: 'AerisTreeTableFilterEvent<TData>',
      defaultValue: '-',
      description: 'Emitted after global or column filters change.',
    },
    {
      name: 'pageChanged',
      type: 'AerisTreeTablePageEvent',
      defaultValue: '-',
      description: 'Emitted after paginator navigation.',
    },
    {
      name: 'lazyLoad',
      type: 'AerisTreeTableLazyLoadEvent',
      defaultValue: '-',
      description: 'Requests a server-side page, sort, or filter result.',
    },
    {
      name: 'editStarted',
      type: 'AerisTreeTableCellEditEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when cell editing begins.',
    },
    {
      name: 'cellEdited',
      type: 'AerisTreeTableCellEditEvent<TData>',
      defaultValue: '-',
      description: 'Emitted after an edit is committed.',
    },
    {
      name: 'editCancelled',
      type: 'AerisTreeTableCellEditEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when Escape cancels an edit.',
    },
    {
      name: 'columnResized',
      type: 'AerisTreeTableColumnResizeEvent',
      defaultValue: '-',
      description: 'Emitted after pointer or keyboard resizing.',
    },
    {
      name: 'columnReordered',
      type: 'AerisTreeTableColumnReorderEvent',
      defaultValue: '-',
      description: 'Emitted after pointer or keyboard column reordering.',
    },
  ];

  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisTreeTableHeader',
      type: 'AerisTreeTableHeaderContext',
      defaultValue: 'column.header',
      description: 'Custom header content with column and sort state.',
    },
    {
      name: 'aerisTreeTableCell',
      type: 'AerisTreeTableCellContext<TData>',
      defaultValue: 'Formatted field value',
      description: 'Custom content for every body cell.',
    },
    {
      name: 'aerisTreeTableEmpty',
      type: 'none',
      defaultValue: 'emptyMessage / emptyFilterMessage',
      description: 'Custom empty and no-results content.',
    },
    {
      name: 'aerisTreeTableLoading',
      type: 'none',
      defaultValue: 'Spinner and loadingMessage',
      description: 'Custom loading content.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'focus(key?: string)',
      type: 'void',
      defaultValue: '-',
      description: 'Focuses a visible row by key or the active row.',
    },
    {
      name: 'expandAll()',
      type: 'void',
      defaultValue: '-',
      description: 'Adds every branch key to expandedKeys.',
    },
    { name: 'collapseAll()', type: 'void', defaultValue: '-', description: 'Clears expandedKeys.' },
    {
      name: 'clearFilters()',
      type: 'void',
      defaultValue: '-',
      description: 'Clears global and column filter models.',
    },
    {
      name: 'startEdit(key, field)',
      type: 'void',
      defaultValue: '-',
      description: 'Starts editing a visible editable cell.',
    },
  ];

  protected expandAll(): void {
    this.controlledExpanded.set(['workspace', 'source', 'assets']);
  }

  protected collapseAll(): void {
    this.controlledExpanded.set([]);
  }

  protected handleFilter(event: AerisTreeTableFilterEvent<FileRecord>): void {
    this.eventText.set(`Showing ${event.value.length} matching root rows.`);
  }

  protected handleSelection(event: AerisTreeTableSelectionEvent<FileRecord>): void {
    this.eventText.set(
      event.selected ? `Selected ${event.node.data.name}.` : `Cleared ${event.node.data.name}.`,
    );
  }

  protected handleEdit(event: AerisTreeTableCellEditEvent<FileRecord>): void {
    this.eventText.set(`Updated ${event.node.data.name} / ${event.field} to ${event.value}.`);
  }

  protected handleResize(event: AerisTreeTableColumnResizeEvent): void {
    this.eventText.set(`Resized ${event.field} to ${event.width}.`);
  }

  protected handleReorder(event: AerisTreeTableColumnReorderEvent): void {
    this.eventText.set(`Moved ${event.field} to column ${event.toIndex + 1}.`);
  }

  protected handleLazyLoad(event: AerisTreeTableLazyLoadEvent): void {
    this.eventText.set(`Requested roots ${event.first + 1}–${event.first + event.rows}.`);
  }

  protected handleLazyExpand(event: AerisTreeTableNodeEvent<FileRecord>): void {
    if (event.node.children || event.node.leaf !== false) return;
    this.lazyLoadingKeys.set([event.key]);
    globalThis.setTimeout(() => {
      const children = [
        this.fileNode(
          `${event.key}-source`,
          'Remote source',
          12,
          'folder',
          'Today',
          'active',
          true,
        ),
        this.fileNode(`${event.key}-readme`, 'REMOTE.md', 4, 'document', 'Today', 'review', true),
      ];
      this.lazyRows.update((nodes) =>
        nodes.map((node) => (node.key === event.key ? { ...node, children, leaf: false } : node)),
      );
      this.lazyLoadingKeys.set([]);
    }, 500);
  }

  private fileNode(
    key: string,
    name: string,
    size: number,
    type: string,
    modified: string,
    status: FileRecord['status'],
    leaf: boolean,
  ): AerisTreeTableNode<FileRecord> {
    return { key, data: { name, size, type, modified, status }, leaf };
  }

  private createFiles(): readonly AerisTreeTableNode<FileRecord>[] {
    return [
      {
        key: 'workspace',
        data: {
          name: 'Aeris workspace',
          size: 48,
          type: 'folder',
          modified: 'Today',
          status: 'active',
        },
        children: [
          {
            key: 'source',
            data: { name: 'Source', size: 24, type: 'folder', modified: 'Today', status: 'active' },
            children: [
              this.fileNode('app', 'app.ts', 6, 'typescript', 'Today', 'active', true),
              this.fileNode('tokens', 'tokens.scss', 8, 'stylesheet', 'Yesterday', 'review', true),
            ],
          },
          {
            key: 'assets',
            data: {
              name: 'Assets',
              size: 14,
              type: 'folder',
              modified: 'Tuesday',
              status: 'review',
            },
            children: [
              this.fileNode('logo', 'logo.svg', 4, 'image', 'Tuesday', 'active', true),
              this.fileNode('cover', 'cover.webp', 10, 'image', 'Tuesday', 'review', true),
            ],
          },
          this.fileNode('readme', 'README.md', 10, 'document', 'Monday', 'active', true),
        ],
      },
      {
        key: 'packages',
        data: { name: 'Packages', size: 62, type: 'folder', modified: 'Friday', status: 'active' },
        children: [
          this.fileNode('core', 'core', 36, 'package', 'Friday', 'active', true),
          this.fileNode('docs', 'docs', 26, 'package', 'Thursday', 'review', true),
        ],
      },
      this.fileNode('archive', 'Archive', 120, 'folder', 'May 12', 'archived', true),
    ];
  }
}
