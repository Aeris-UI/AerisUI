import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisTable,
  AerisTableContextMenuModule,
  type AerisTableCellEditEvent,
  type AerisTableColumn,
  type AerisTableContextMenuEvent,
  type AerisTableData,
  type AerisTableSelectionEvent,
  type AerisTableSortEvent,
} from '@aeris-ui/core/table';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { type AerisContextMenuItemEvent } from '@aeris-ui/core/context-menu';

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
  selector: 'app-table-page',
  imports: [
    AerisButton,
    AerisTableContextMenuModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './table.page.html',
  styleUrl: './table.page.scss',
})
export class TablePage {
  protected readonly selectedMembers = signal<readonly string[]>(['1']);
  protected readonly singleSelectedMember = signal<readonly string[]>(['2']);
  protected readonly rowSelectedMembers = signal<readonly string[]>([]);
  protected readonly singleRowSelectedMember = signal<readonly string[]>(['3']);
  protected readonly contextMenuMember = signal<AerisTableData | null>(null);
  protected readonly contextMenuMemberKey = signal('');
  protected readonly contextMenuStatus = signal('Right-click a row to open member actions.');
  protected readonly expandedMembers = signal<readonly string[]>([]);
  protected readonly eventText = signal('No table event yet');
  protected readonly sortState = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  protected readonly filter = signal('');
  protected readonly columnFilters = signal<Readonly<Record<string, string>>>({});
  protected readonly columnFilterPlaceholders: Readonly<Record<string, string>> = {
    name: 'Search names',
    role: 'Search roles',
    team: 'Search teams',
    status: 'Search status',
    lastActive: 'Search activity',
  };
  protected readonly editableMembers = signal<readonly AerisTableData[]>([
    { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
    { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
    { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
  ]);

  protected readonly columns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, width: '22%' },
    { field: 'role', header: 'Role', sortable: true, width: '26%' },
    { field: 'team', header: 'Team', sortable: true, width: '20%' },
    { field: 'status', header: 'Status', align: 'center', width: '14%' },
    { field: 'lastActive', header: 'Last active', sortable: true, width: '18%' },
  ];

  protected readonly compactColumns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, width: '42%' },
    { field: 'team', header: 'Team', width: '34%' },
    { field: 'status', header: 'Status', align: 'end', width: '24%' },
  ];
  protected readonly adjustableColumns = signal<readonly AerisTableColumn[]>([
    ...this.compactColumns,
  ]);

  protected readonly members: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', role: 'Product designer', team: 'Design', status: 'Active', lastActive: 'Just now', notes: 'Owns the design system rollout.' },
    { id: '2', name: 'Noah Williams', role: 'Frontend engineer', team: 'Engineering', status: 'Invited', lastActive: '2 hours ago', notes: 'Works on Angular component architecture.' },
    { id: '3', name: 'Sofia Rossi', role: 'Researcher', team: 'Research', status: 'Offline', lastActive: 'Yesterday', notes: 'Runs usability research for forms.' },
    { id: '4', name: 'Liam Novak', role: 'QA engineer', team: 'Quality', status: 'Active', lastActive: 'Today', notes: 'Maintains accessibility test plans.' },
    { id: '5', name: 'Ava Patel', role: 'Product manager', team: 'Product', status: 'Active', lastActive: '1 day ago', notes: 'Coordinates roadmap decisions.' },
  ];

  protected readonly manyMembers: readonly AerisTableData[] = Array.from(
    { length: 24 },
    (_, index) => {
      const base = this.members[index % this.members.length];
      return {
        ...base,
        id: `member-${index + 1}`,
        name: `${String(base['name'])} ${index + 1}`,
      };
    },
  );

  protected readonly memberContextMenuItems = [
    { label: 'Open profile' },
    { label: 'Copy member link' },
    { separator: true },
    { label: 'Archive member' },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'table-basic', label: 'Basic' },
    { id: 'table-dynamic', label: 'Dynamic columns' },
    { id: 'table-sort', label: 'Sorting' },
    { id: 'table-filter', label: 'Global filtering' },
    { id: 'table-column-filter', label: 'Column filtering' },
    { id: 'table-pagination', label: 'Pagination' },
    { id: 'table-selection', label: 'Selection' },
    { id: 'table-context-menu', label: 'Context menu' },
    { id: 'table-appearance', label: 'Appearance' },
    { id: 'table-resizing', label: 'Column controls' },
    { id: 'table-expansion', label: 'Row expansion' },
    { id: 'table-editing', label: 'Cell editing' },
    { id: 'table-scrolling', label: 'Scrolling' },
    { id: 'table-templates', label: 'Templates' },
    { id: 'table-responsive', label: 'Responsive' },
    { id: 'table-csv', label: 'CSV export' },
    { id: 'table-states', label: 'States' },
    { id: 'table-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'table-api-inputs', label: 'Inputs' },
    { id: 'table-api-outputs', label: 'Outputs' },
    { id: 'table-api-templates', label: 'Templates' },
    { id: 'table-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisTableModule } from '@aeris-ui/core/table';`;

  protected readonly dataCode = `protected readonly columns: readonly AerisTableColumn[] = [
  { field: 'name', header: 'Name', sortable: true, width: '42%' },
  { field: 'team', header: 'Team', width: '34%' },
  { field: 'status', header: 'Status', align: 'end', width: '24%' },
];

protected readonly members: readonly AerisTableData[] = [
  { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
  { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
];`;

  protected readonly stateCode = `protected readonly selectedMembers =
  signal<readonly string[]>(['1']);

protected readonly expandedMembers =
  signal<readonly string[]>([]);

protected readonly filter = signal('');`;

  protected readonly contextMenuCode = `protected readonly contextMenuMember =
  signal<AerisTableData | null>(null);

protected readonly contextMenuMemberKey =
  signal('');

protected readonly memberContextMenuItems = [
  { label: 'Open profile' },
  { label: 'Copy member link' },
  { separator: true },
  { label: 'Archive member' },
];

protected handleTableContextMenu(event: AerisTableContextMenuEvent): void {
  this.contextMenuStatus.set(\`Opened actions for \${event.row['name']}\`);
}
protected handleMemberMenuAction(event: AerisContextMenuItemEvent): void {
  const member = this.contextMenuMember();
  this.contextMenuStatus.set(
    \`\${event.item.label} for \${member?.['name'] ?? 'selected member'}\`,
  );
}`;

  protected readonly columnFilterCode = `protected readonly columnFilters =
  signal<Readonly<Record<string, string>>>({});

protected readonly columnFilterPlaceholders = {
  name: 'Search names',
  role: 'Search roles',
  team: 'Search teams',
  status: 'Search status',
  lastActive: 'Search activity',
};`;

  protected readonly resizingCode = `protected readonly adjustableColumns =
  signal<readonly AerisTableColumn[]>([
    { field: 'name', header: 'Name', sortable: true, width: '42%' },
    { field: 'team', header: 'Team', width: '34%' },
    { field: 'status', header: 'Status', align: 'end', width: '24%' },
  ]);

protected readonly members: readonly AerisTableData[] = [
  { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
  { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
  { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
];`;

  protected readonly editCode = `protected readonly editableMembers =
  signal<readonly AerisTableData[]>(members);

protected handleCellEdit(event: AerisTableCellEditEvent): void {
  this.editableMembers.update((rows) =>
    rows.map((row) =>
      row['id'] === event.row['id']
        ? { ...row, [event.field]: event.value }
        : row,
    ),
  );
}`;

  protected readonly eventsCode = `protected handleSort(event: AerisTableSortEvent): void {
  this.eventText.set(event.sort ? \`Sorted by \${event.sort.field}\` : 'Sorting cleared');
}

protected handleSelection(event: AerisTableSelectionEvent): void {
  this.eventText.set(\`\${event.keys.length} selected\`);
}`;

  protected readonly csvCode = `protected exportCsv(table: AerisTable): void {
  table.exportCSV({
    filename: 'team-members.csv',
    rows: 'filtered',
  });
}`;

  protected readonly interfacesCode = `type AerisTableSize = 'sm' | 'md' | 'lg';
type AerisTableSortDirection = 'asc' | 'desc';
type AerisTableSelectionMode = 'single' | 'multiple';
type AerisTableResponsiveMode = 'scroll' | 'stack';
type AerisTableData = Record<string, unknown>;
type AerisTableContextMenuDisabled =
  | boolean
  | ((row: AerisTableData, rowIndex: number) => boolean);

interface AerisTableColumn {
  readonly field: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
}

interface AerisTableSort {
  readonly field: string;
  readonly direction: AerisTableSortDirection;
}

interface AerisTableSortEvent {
  readonly originalEvent: Event;
  readonly sort: AerisTableSort | null;
}

interface AerisTablePageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}

interface AerisTableFilterEvent {
  readonly originalEvent: Event | null;
  readonly filterValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly rows: readonly AerisTableData[];
}

interface AerisTableSelectionEvent {
  readonly originalEvent: Event;
  readonly keys: readonly string[];
  readonly row: AerisTableData;
}

interface AerisTableContextMenuEvent {
  readonly originalEvent: MouseEvent;
  readonly row: AerisTableData;
  readonly rowIndex: number;
  readonly key: string;
}

interface AerisTableCellEditEvent {
  readonly originalEvent: Event;
  readonly row: AerisTableData;
  readonly field: string;
  readonly value: string;
}

interface AerisTableColumnResizeEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly width: string;
  readonly columns: readonly AerisTableColumn[];
}

interface AerisTableColumnReorderEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly columns: readonly AerisTableColumn[];
}

interface AerisTableCsvExportOptions {
  readonly filename?: string;
  readonly separator?: string;
  readonly includeHeaders?: boolean;
  readonly rows?: 'all' | 'filtered' | 'page';
  readonly download?: boolean;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'data', type: 'readonly AerisTableData[]', defaultValue: '[]', description: 'Rows rendered by the table.' },
    { name: 'columns', type: 'readonly AerisTableColumn[] (model)', defaultValue: '[]', description: 'Column definitions used for headers, cells, sorting, filtering, and controlled resized widths.' },
    { name: 'rowKeyField', type: 'string', defaultValue: "'id'", description: 'Row field used for selection, expansion, and tracking.' },
    { name: 'caption', type: 'string', defaultValue: "''", description: 'Accessible table caption and optional visible description.' },
    { name: 'size', type: 'sm | md | lg', defaultValue: "'md'", description: 'Controls row density.' },
    { name: 'striped', type: 'boolean', defaultValue: 'false', description: 'Applies alternating row backgrounds.' },
    { name: 'gridlines', type: 'boolean', defaultValue: 'false', description: 'Adds vertical grid lines between cells.' },
    { name: 'hoverable', type: 'boolean', defaultValue: 'true', description: 'Highlights body rows on hover.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Fills the available inline space.' },
    { name: 'responsiveMode', type: 'scroll | stack', defaultValue: "'scroll'", description: 'Horizontal scrolling or stacked mobile rows.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows the loading state inside the table body.' },
    { name: 'loadingMessage', type: 'string', defaultValue: "'Loading data'", description: 'Default text shown while loading.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No records found'", description: 'Default text shown when no rows are available.' },
    { name: 'sort', type: 'AerisTableSort | null (model)', defaultValue: 'null', description: 'Controlled sort state.' },
    { name: 'globalFilter', type: 'boolean', defaultValue: 'false', description: 'Shows the built-in global search field.' },
    { name: 'filterValue', type: 'string (model)', defaultValue: "''", description: 'Controlled global filter value.' },
    { name: 'columnFilter', type: 'boolean', defaultValue: 'false', description: 'Shows per-column filter inputs.' },
    { name: 'columnFilters', type: 'Record<string, string> (model)', defaultValue: '{}', description: 'Controlled per-column filter values.' },
    { name: 'columnFilterPlaceholder', type: 'string | Record<string, string> | function', defaultValue: "''", description: 'Placeholder text for column filter inputs. Use a record or function for per-column text.' },
    { name: 'paginator', type: 'boolean', defaultValue: 'false', description: 'Shows the built-in paginator.' },
    { name: 'first', type: 'number (model)', defaultValue: '0', description: 'Index of the first visible row.' },
    { name: 'rows', type: 'number (model)', defaultValue: '10', description: 'Rows displayed per page.' },
    { name: 'lazy', type: 'boolean', defaultValue: 'false', description: 'Emits lazyLoad metadata instead of assuming all data changes are local.' },
    { name: 'pageLinkSize', type: 'number', defaultValue: '5', description: 'Paginator page button count.' },
    { name: 'rowsPerPageOptions', type: 'readonly number[]', defaultValue: '[]', description: 'Rows-per-page menu options.' },
    { name: 'selectionMode', type: 'single | multiple | null', defaultValue: 'null', description: 'Enables single or multiple row selection.' },
    { name: 'selectionControl', type: 'row | control', defaultValue: "'control'", description: 'Uses row clicks or rendered checkbox/radio controls.' },
    { name: 'selectedKeys', type: 'readonly string[] (model)', defaultValue: '[]', description: 'Controlled selected row keys.' },
    { name: 'contextMenu', type: 'AerisContextMenu | null', defaultValue: 'null', description: 'ContextMenu instance opened from body rows on right-click.' },
    { name: 'contextMenuDisabled', type: 'boolean | function', defaultValue: 'false', description: 'Disables row context-menu handling globally or per row.' },
    { name: 'contextMenuRow', type: 'AerisTableData | null (model)', defaultValue: 'null', description: 'Controlled row currently associated with the context menu.' },
    { name: 'contextMenuRowKey', type: 'string (model)', defaultValue: "''", description: 'Controlled key for the row currently associated with the context menu.' },
    { name: 'expandableRows', type: 'boolean', defaultValue: 'false', description: 'Enables row detail expansion.' },
    { name: 'expandedKeys', type: 'readonly string[] (model)', defaultValue: '[]', description: 'Controlled expanded row keys.' },
    { name: 'editable', type: 'boolean', defaultValue: 'false', description: 'Enables double-click in-cell editing.' },
    { name: 'resizableColumns', type: 'boolean', defaultValue: 'false', description: 'Adds pointer and keyboard resize separators that preserve the total table width.' },
    { name: 'reorderableColumns', type: 'boolean', defaultValue: 'false', description: 'Allows pointer dragging and Alt plus arrow keys to reorder columns.' },
    { name: 'minColumnWidth', type: 'number', defaultValue: '96', description: 'Minimum width in pixels for either column affected by resizing.' },
    { name: 'showOverflowTooltip', type: 'boolean', defaultValue: 'false', description: 'Shows an Aeris Tooltip for truncated header and cell values only when ellipsis is active.' },
    { name: 'scrollable', type: 'boolean', defaultValue: 'false', description: 'Constrains the table viewport.' },
    { name: 'scrollHeight', type: 'string', defaultValue: "''", description: 'Maximum scroll viewport height.' },
    { name: 'csvSeparator', type: 'string', defaultValue: "','", description: 'Default CSV separator.' },
    { name: 'exportFilename', type: 'string', defaultValue: "'aeris-table.csv'", description: 'Default CSV download filename.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'sorted', type: 'AerisTableSortEvent', defaultValue: '-', description: 'Emitted when a sortable header changes state.' },
    { name: 'filtered', type: 'AerisTableFilterEvent', defaultValue: '-', description: 'Emitted when global or column filters change.' },
    { name: 'pageChanged', type: 'AerisTablePageEvent', defaultValue: '-', description: 'Emitted when paginator buttons change the page.' },
    { name: 'lazyLoad', type: 'AerisTableLazyLoadEvent', defaultValue: '-', description: 'Emitted after sort, filter, or page changes when lazy is enabled.' },
    { name: 'selectionChanged', type: 'AerisTableSelectionEvent', defaultValue: '-', description: 'Emitted when row or visible-row selection changes.' },
    { name: 'rowSelected', type: 'AerisTableSelectionEvent', defaultValue: '-', description: 'Emitted when a row becomes selected.' },
    { name: 'rowUnselected', type: 'AerisTableSelectionEvent', defaultValue: '-', description: 'Emitted when a row becomes unselected.' },
    { name: 'contextMenuOpened', type: 'AerisTableContextMenuEvent', defaultValue: '-', description: 'Emitted when a body row opens the bound context menu.' },
    { name: 'visibleRowsToggled', type: 'AerisTableToggleRowsEvent', defaultValue: '-', description: 'Emitted when the visible-row checkbox selects or clears rows.' },
    { name: 'rowExpanded', type: 'AerisTableData', defaultValue: '-', description: 'Emitted when a detail row opens.' },
    { name: 'rowCollapsed', type: 'AerisTableData', defaultValue: '-', description: 'Emitted when a detail row closes.' },
    { name: 'editStarted', type: 'AerisTableCellEditStartEvent', defaultValue: '-', description: 'Emitted when cell editing starts.' },
    { name: 'editCancelled', type: 'AerisTableCellEditStartEvent', defaultValue: '-', description: 'Emitted when cell editing is cancelled.' },
    { name: 'cellEdited', type: 'AerisTableCellEditEvent', defaultValue: '-', description: 'Emitted when an editable cell commits a new string value.' },
    { name: 'editCompleted', type: 'AerisTableCellEditEvent', defaultValue: '-', description: 'Emitted after an editable cell commits.' },
    { name: 'columnResized', type: 'AerisTableColumnResizeEvent', defaultValue: '-', description: 'Emitted after pointer or keyboard resizing updates the controlled columns model.' },
    { name: 'columnReordered', type: 'AerisTableColumnReorderEvent', defaultValue: '-', description: 'Emitted after pointer or keyboard column reordering updates the controlled columns model.' },
    { name: 'stateSaved', type: 'AerisTableState', defaultValue: '-', description: 'Emitted when saveState returns current table state.' },
    { name: 'stateRestored', type: 'AerisTableState', defaultValue: '-', description: 'Emitted when restoreState applies table state.' },
    { name: 'csvExported', type: 'AerisTableCsvExportEvent', defaultValue: '-', description: 'Emitted after exportCSV creates CSV text.' },
  ];

  protected handleSort(event: AerisTableSortEvent): void {
    this.eventText.set(event.sort ? `Sorted by ${event.sort.field}` : 'Sorting cleared');
  }

  protected handleSelection(event: AerisTableSelectionEvent): void {
    this.eventText.set(`${event.keys.length} selected`);
  }

  protected handleTableContextMenu(event: AerisTableContextMenuEvent): void {
    this.contextMenuStatus.set(`Opened actions for ${event.row['name']}`);
  }

  protected handleMemberMenuAction(event: AerisContextMenuItemEvent): void {
    const member = this.contextMenuMember();
    this.contextMenuStatus.set(
      `${event.item.label} for ${member?.['name'] ?? 'selected member'}`,
    );
  }

  protected handleCellEdit(event: AerisTableCellEditEvent): void {
    this.editableMembers.update((rows) =>
      rows.map((row) =>
        row['id'] === event.row['id']
          ? { ...row, [event.field]: event.value }
          : row,
      ),
    );
  }

  protected exportCsv(table: AerisTable): void {
    table.exportCSV({
      filename: 'team-members.csv',
      rows: 'filtered',
    });
  }
}
