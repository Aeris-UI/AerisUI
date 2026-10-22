# Table

> High-performance data table with sorting, filtering, editing, and virtualization.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/table`
- Human-readable documentation: [https://aeris-ui.dev/components/table](https://aeris-ui.dev/components/table)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTableModule } from '@aeris-ui/core/table';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `reorderableRows` | `boolean` | `false` | Enables local row reordering with stable unique rowKeyField values. Disabled during sorting, active filters, pagination, lazy loading, loading, or cell editing. |
| `showRowReorderHandle` | `boolean` | `true` | Shows dedicated drag/keyboard handles when reorderableRows is enabled. Hide when providing external controls through moveRow(). |
| `rowReorderDisabled` | `boolean &#124; ((row: AerisTableData, rowIndex: number) =&gt; boolean)` | `false` | Fixes rows in place. Other rows cannot move across a disabled row. |
| `rowReorderAriaLabel` | `string` | `'Reorder row'` | Handle name prefix, followed by the one-based row position. |
| `rowReorderInstructions` | `string` | `'Drag, or activate this handle and then a destination handle. Alt plus Arrow Up or Arrow Down also moves the row. Escape cancels.'` | Accessible instructions associated with each handle. |
| `rowReorderIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Decorative replacement for the default six-dot drag handle icon. |
| `toggleIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Decorative row-expander artwork. Supply a down-pointing icon; Aeris rotates it for the collapsed state. |
| `sortIconTemplate` | `TemplateRef&lt;AerisTableSortIconContext&gt; &#124; undefined` | `undefined` | Artwork for sortable headers. Context: $implicit is the column; direction is asc, desc, or null. Header buttons retain sorting and aria-sort. |
| `loadingIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the loading icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `paginatorDropdownAppendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `global config or 'self'` | Forwards the mounting target to the paginator rows-per-page menu. |
| `data` | `readonly AerisTableData[] (model)` | `[]` | Rows rendered by the table. Bind [(data)] to retain row reorder changes in the parent. |
| `columns` | `readonly AerisTableColumn[] (model)` | `[]` | Column definitions used for headers, cells, sorting, filtering, and controlled resized widths. |
| `rowKeyField` | `string` | `'id'` | Row field used for selection, expansion, and tracking. |
| `caption` | `string` | `''` | Accessible table caption and optional visible description. |
| `size` | `sm &#124; md &#124; lg` | `'md'` | Controls row density. |
| `striped` | `boolean` | `false` | Applies alternating row backgrounds. |
| `gridlines` | `boolean` | `false` | Adds vertical grid lines between cells. |
| `hoverable` | `boolean` | `true` | Highlights body rows on hover. |
| `fluid` | `boolean` | `true` | Fills the available inline space. |
| `responsiveMode` | `scroll &#124; stack` | `'scroll'` | Horizontal scrolling or stacked mobile rows. |
| `loading` | `boolean` | `false` | Shows the loading state inside the table body. |
| `loadingMessage` | `string` | `'Loading data'` | Default text shown while loading. |
| `emptyMessage` | `string` | `'No records found'` | Default text shown when no rows are available. |
| `sort` | `AerisTableSort &#124; null (model)` | `null` | Controlled sort state. |
| `globalFilter` | `boolean` | `false` | Shows the built-in global search field. |
| `filterValue` | `string (model)` | `''` | Controlled global filter value. |
| `columnFilter` | `boolean` | `false` | Shows per-column filter inputs. |
| `columnFilters` | `Record&lt;string, string&gt; (model)` | `{}` | Controlled per-column filter values. |
| `columnFilterPlaceholder` | `string &#124; Record&lt;string, string&gt; &#124; function` | `''` | Placeholder text for column filter inputs. Use a record or function for per-column text. |
| `paginator` | `boolean` | `false` | Shows the built-in paginator. |
| `first` | `number (model)` | `0` | Index of the first visible row. |
| `rows` | `number (model)` | `10` | Rows displayed per page. |
| `lazy` | `boolean` | `false` | Emits lazyLoad request state on sort, filter, and page actions. Local processing of supplied data still applies; it does not select or represent unloaded server records. |
| `pageLinkSize` | `number` | `5` | Paginator page button count. |
| `rowsPerPageOptions` | `readonly number[]` | `[]` | Rows-per-page menu options. |
| `selectionMode` | `single &#124; multiple &#124; null` | `null` | Enables single or multiple row selection. |
| `selectionControl` | `row &#124; control` | `'control'` | Uses row clicks or rendered checkbox/radio controls. |
| `selectedKeys` | `readonly string[] (model)` | `[]` | Controlled selected row keys, retained across filters and pages. The header checkbox changes only the current filtered page; the key count can include off-page or unloaded records. |
| `contextMenu` | `AerisContextMenu &#124; null` | `null` | ContextMenu instance opened from body rows on right-click. |
| `contextMenuDisabled` | `boolean &#124; function` | `false` | Disables row context-menu handling globally or per row. |
| `contextMenuRow` | `AerisTableData &#124; null (model)` | `null` | Controlled row currently associated with the context menu. |
| `contextMenuRowKey` | `string (model)` | `''` | Controlled key for the row currently associated with the context menu. |
| `expandableRows` | `boolean` | `false` | Enables row detail expansion. |
| `expandedKeys` | `readonly string[] (model)` | `[]` | Controlled expanded row keys. |
| `editable` | `boolean` | `false` | Default editing permission. Columns override it; cellEditable has final priority. Not a master switch. |
| `cellEditable` | `AerisTableCellEditable &#124; undefined` | `undefined` | Pure (row, column) callback: true allows editing, false prevents it, undefined inherits column.editable then table editable. Supports row-wide and individual-cell rules. Permission revocation cancels the draft. |
| `resizableColumns` | `boolean` | `false` | Adds pointer and keyboard resize separators that preserve the total table width. |
| `reorderableColumns` | `boolean` | `false` | Allows pointer dragging and Alt plus arrow keys to reorder columns. |
| `minColumnWidth` | `number` | `96` | Minimum width in pixels for either column affected by resizing. |
| `showOverflowTooltip` | `boolean` | `false` | Shows an Aeris Tooltip for truncated header and cell values only when ellipsis is active. |
| `scrollable` | `boolean` | `false` | Constrains the table viewport. |
| `scrollHeight` | `string` | `''` | Maximum scroll viewport height. |
| `csvSeparator` | `string` | `','` | Default CSV separator. |
| `exportFilename` | `string` | `'aeris-table.csv'` | Default CSV download filename. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `sorted` | `AerisTableSortEvent` | `-` | Emitted when a sortable header changes state. |
| `filtered` | `AerisTableFilterEvent` | `-` | Emitted when global or column filters change. |
| `pageChanged` | `AerisTablePageEvent` | `-` | Emitted when paginator buttons change the page. |
| `lazyLoad` | `AerisTableLazyLoadEvent` | `-` | Emitted after sort, filter, or page changes when lazy is enabled. |
| `selectionChanged` | `AerisTableSelectionEvent` | `-` | Emitted when row or visible-row selection changes. |
| `rowSelected` | `AerisTableSelectionEvent` | `-` | Emitted when a row becomes selected. |
| `rowUnselected` | `AerisTableSelectionEvent` | `-` | Emitted when a row becomes unselected. |
| `contextMenuOpened` | `AerisTableContextMenuEvent` | `-` | Emitted when a body row opens the bound context menu. |
| `visibleRowsToggled` | `AerisTableToggleRowsEvent` | `-` | Emitted when the visible-row checkbox selects or clears rows. |
| `rowExpanded` | `AerisTableData` | `-` | Emitted when a detail row opens. |
| `rowCollapsed` | `AerisTableData` | `-` | Emitted when a detail row closes. |
| `editStarted` | `AerisTableCellEditStartEvent` | `-` | Emitted when cell editing starts. |
| `editCancelled` | `AerisTableCellEditStartEvent` | `-` | Emitted when cell editing is cancelled. |
| `cellEdited` | `AerisTableCellEditEvent` | `-` | Emitted when an editable cell commits. Built-in editors produce strings; custom editors preserve the draft value type. |
| `editCompleted` | `AerisTableCellEditEvent` | `-` | Emitted after an editable cell commits. |
| `columnResized` | `AerisTableColumnResizeEvent` | `-` | Emitted after pointer or keyboard resizing updates the controlled columns model. |
| `columnReordered` | `AerisTableColumnReorderEvent` | `-` | Emitted after pointer or keyboard column reordering updates the controlled columns model. |
| `dataChange` | `readonly AerisTableData[]` | `-` | Emitted with a new immutable row array when a reorder updates the data model. |
| `rowReordered` | `AerisTableRowReorderEvent` | `-` | Emitted after an accepted pointer, keyboard, or moveRow request, with the stable key, zero-based indices, and updated data. |
| `stateSaved` | `AerisTableState` | `-` | Emitted when saveState returns current table state. |
| `stateRestored` | `AerisTableState` | `-` | Emitted when restoreState applies table state. |
| `csvExported` | `AerisTableCsvExportEvent` | `-` | Emitted after exportCSV creates CSV text. |

### Table templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisTableHeader | column | Custom header content. |
| aerisTableCell | value, row, column, rowIndex | Custom body content outside editing. Use aerisTableEditor to replace the editing view. |
| aerisTableEditor | editor ($implicit), row, column, rowIndex | Custom editing view. Included in AerisTableModule and AerisTableContextMenuModule; no additional table import. |
| aerisTableExpansion | row, rowIndex | Expandable detail row content. |
| aerisTableEmpty | none | Custom empty state. |
| aerisTableLoading | none | Custom loading state. |

### Table custom editor state

| Member | Type | Behavior |
| --- | --- | --- |
| value | WritableSignal&lt;unknown&gt; | Draft value. Replace it with value.set(next); preserve number, boolean, Date, array, object, or null types. |
| originalValue | unknown | Value at edit start. Treat objects and dates as immutable; no deep cloning is performed. |
| valid | WritableSignal&lt;boolean&gt; | Whether the draft may commit. Defaults to true. Update this from your form validation; invalid drafts stay open on blur and are discarded when switching cells. |
| ariaLabel | string | Default accessible name: Edit followed by the column header. Bind it to your editor control. |
| commit(event?) | (event?: Event) =&gt; void | Saves a valid draft and finishes editing. Also runs automatically when focus or a pointer leaves the owned editor, or on an unconsumed Enter outside multiline fields. |
| cancel(event?) | (event?: Event) =&gt; void | Discards the draft and finishes editing. Escape also cancels unless a child control consumes it or has an open picker. |

### Table methods

| Name | Returns | Description |
| --- | --- | --- |
| moveRow(fromIndex, toIndex, originalEvent?) | boolean | Moves a row using zero-based data indices; returns false without events for invalid, disabled, or unsupported moves. The optional Event defaults to null. |
| reset() | void | Clears sort, filter, pagination, selection, and expansion state. |
| clearSort() | void | Clears the current sort state and emits sorted. |
| clearFilters() | void | Clears global and column filters, resets to first page, and emits filtered. |
| clearSelection() | void | Clears selected row keys. |
| clearContextMenuRow() | void | Clears the row associated with the bound context menu. |
| clearExpandedRows() | void | Closes every expanded row. |
| selectRows(keys) | void | Selects rows by key when the keys exist in the current data. |
| expandRow(rowOrKey) | void | Opens a detail row programmatically. |
| collapseRow(rowOrKey) | void | Closes a detail row programmatically. |
| filter(value) | void | Updates the global filter programmatically. |
| filterColumn(field, value) | void | Updates a column filter programmatically. |
| saveState() | AerisTableState | Serializes table state owned by Aeris Table. |
| restoreState(state) | void | Restores table state owned by Aeris Table. |
| exportCSV(options?) | string | Creates formula-neutralized, quoted CSV from all, filtered, or visible rows and optionally starts a download with a sanitized filename. |

## Interfaces and types

### Editor Interfaces

```ts
import type { WritableSignal } from '@angular/core';

interface AerisCellEditor {
  readonly value: WritableSignal<unknown>;
  readonly valid: WritableSignal<boolean>;
  readonly originalValue: unknown;
  readonly ariaLabel: string;
  readonly commit: (event?: Event) => void;
  readonly cancel: (event?: Event) => void;
}

interface AerisTableEditorContext {
  readonly $implicit: AerisCellEditor;
  readonly editor: AerisCellEditor;
  readonly row: AerisTableData;
  readonly column: AerisTableColumn;
  readonly rowIndex: number;
}
```

### Interfaces

```ts
type AerisTableSize = 'sm' | 'md' | 'lg';
type AerisTableSortDirection = 'asc' | 'desc';
type AerisTableSelectionMode = 'single' | 'multiple';
type AerisTableResponsiveMode = 'scroll' | 'stack';
type AerisTableData = Record<string, unknown>;
type AerisTableCellEditable = (
  row: AerisTableData, column: AerisTableColumn,
) => boolean | undefined;
type AerisTableContextMenuDisabled =
  | boolean
  | ((row: AerisTableData, rowIndex: number) => boolean);

interface AerisTableColumn {
  readonly field: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly editable?: boolean;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
}

interface AerisTableSortIconContext {
  readonly $implicit: AerisTableColumn;
  readonly direction: AerisTableSortDirection | null;
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
  readonly value: unknown;
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

type AerisTableRowReorderDisabled = boolean | ((row: AerisTableData, rowIndex: number) => boolean);

interface AerisTableRowReorderEvent {
  readonly originalEvent: Event | null;
  readonly row: AerisTableData;
  readonly key: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly data: readonly AerisTableData[];
}

interface AerisTableCsvExportOptions {
  readonly filename?: string;
  readonly separator?: string;
  readonly includeHeaders?: boolean;
  readonly rows?: 'all' | 'filtered' | 'page';
  readonly download?: boolean;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-surface` | `CSS custom property` | — | Table and control surface. |
| `--aeris-surface-2` | `CSS custom property` | — | Header, expansion, and alternating row surface. |
| `--aeris-border` | `CSS custom property` | — | Outer, row, and gridline borders. |
| `--aeris-text / --aeris-text-2` | `CSS custom property` | — | Cell and secondary text. |
| `--aeris-primary` | `CSS custom property` | — | Selected and hovered row accents. |
| `--aeris-focus` | `CSS custom property` | — | Visible focus rings. |
| `--aeris-table-toggle-size` | `CSS custom property` | — | Expandable-row disclosure button size. |

## Examples

### Basic

Define columns and pass row data. Table renders native table, thead, tbody, th, td, and caption semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-basic-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table caption="Team members" [data]="members" [columns]="compactColumns" />
    </div>
  `
})
export class TableBasicBasicDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly columns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, width: '42%' },
    { field: 'team', header: 'Team', width: '34%' },
    { field: 'status', header: 'Status', align: 'end', width: '24%' },
  ];

  protected readonly members: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
    { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
  ];
}
```

### Dynamic columns

Columns are data. Alignment and sorting are defined in the column model; this example right-aligns the Status column and the snippet shows that explicitly.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-dynamic-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Dynamic team member columns"
        [data]="members"
        [columns]="compactColumns"
        striped
      />
    </div>
  `
})
export class TableDynamicDynamicColumnsDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly columns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, width: '42%' },
    { field: 'team', header: 'Team', width: '34%' },
    { field: 'status', header: 'Status', align: 'end', width: '24%' },
  ];

  protected readonly members: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
    { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
  ];
}
```

### Sorting

Sortable headers cycle through ascending, descending, and cleared state with aria-sort kept in sync.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-sort-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table caption="Sortable team members" [data]="members" [columns]="columns" />
    </div>
  `
})
export class TableSortSortingDemo {
  protected readonly columns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '22%' },
      { field: 'role', header: 'Role', sortable: true, width: '26%' },
      { field: 'team', header: 'Team', sortable: true, width: '20%' },
      { field: 'status', header: 'Status', align: 'center', width: '14%' },
      { field: 'lastActive', header: 'Last active', sortable: true, width: '18%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];
}
```

### Global filtering

Enable a built-in search field and bind filterValue when application state needs to inspect or restore the query.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-filter-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Filtered team members"
        [data]="members"
        [columns]="compactColumns"
        globalFilter
        [(filterValue)]="filter"
      />
    </div>
  `
})
export class TableFilterGlobalFilteringDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected readonly selectedMembers =
    signal<readonly string[]>(['1']);

  protected readonly expandedMembers =
    signal<readonly string[]>([]);

  protected readonly filter = signal('');
}
```

### Column filtering

Column filters are independent text inputs in the header. They combine with the global filter when both are enabled. Enable table gridlines when the entire column should be visually divided, including its filter cell.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-column-filter-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Column filtered team members"
        [data]="members"
        [columns]="columns"
        columnFilter
        [columnFilterPlaceholder]="columnFilterPlaceholders"
        [(columnFilters)]="columnFilters"
      />
    </div>
  `
})
export class TableColumnFilterColumnFilteringDemo {
  protected readonly columns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '22%' },
      { field: 'role', header: 'Role', sortable: true, width: '26%' },
      { field: 'team', header: 'Team', sortable: true, width: '20%' },
      { field: 'status', header: 'Status', align: 'center', width: '14%' },
      { field: 'lastActive', header: 'Last active', sortable: true, width: '18%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected readonly columnFilters =
    signal<Readonly<Record<string, string>>>({});

  protected readonly columnFilterPlaceholders = {
    name: 'Search names',
    role: 'Search roles',
    team: 'Search teams',
    status: 'Search status',
    lastActive: 'Search activity',
  };
}
```

### Pagination

Client-side pagination exposes page metadata and keeps the visible row range announced politely.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-pagination-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Paginated team members"
        [data]="manyMembers"
        [columns]="compactColumns"
        paginator
        [rows]="5"
        [rowsPerPageOptions]="[5, 10, 20]"
      />
    </div>
  `
})
export class TablePaginationPaginationDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
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
}
```

### Selection

Use highlighted row selection, checkbox selection, or radio-button selection depending on the interaction model.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-selection-demo',
  imports: [AerisTableModule],
  templateUrl: './table-selection.demo.html',
  styleUrl: './table-selection.demo.scss'
})
export class TableSelectionSelectionDemo {
  protected readonly singleSelectedMember = signal<readonly string[]>(['2']);

  protected readonly rowSelectedMembers = signal<readonly string[]>([]);

  protected readonly singleRowSelectedMember = signal<readonly string[]>(['3']);

  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected readonly selectedMembers =
    signal<readonly string[]>(['1']);

  protected readonly expandedMembers =
    signal<readonly string[]>([]);

  protected readonly filter = signal('');
}
```

#### HTML

```html
<div class="table-state-grid">
  <aeris-table
    caption="Row selection team members"
    [data]="members"
    [columns]="compactColumns"
    selectionMode="multiple"
    selectionControl="row"
    [(selectedKeys)]="rowSelectedMembers"
  />
  <aeris-table
    caption="Single row selection team members"
    [data]="members"
    [columns]="compactColumns"
    selectionMode="single"
    selectionControl="row"
    [(selectedKeys)]="singleRowSelectedMember"
  />
  <aeris-table
    caption="Checkbox selection team members"
    [data]="members"
    [columns]="compactColumns"
    selectionMode="multiple"
    selectionControl="control"
    [(selectedKeys)]="selectedMembers"
  />
  <aeris-table
    caption="Radio selection team members"
    [data]="members"
    [columns]="compactColumns"
    selectionMode="single"
    selectionControl="control"
    [(selectedKeys)]="singleSelectedMember"
  />
</div>
```

#### CSS

```css
.table-state-grid {
  width: 100%;
  display: grid;
  gap: 1rem;
}

.table-state-grid > .aeris-button {
  justify-self: start;
}
```

### Selection workflow

Keep one selectedKeys model for counts and bulk actions across pages and filters. Use the column menu to hide or restore fields, or reorder visible headers with their keyboard controls.

#### TS

```ts
import { Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisTableModule, type AerisTableColumn, type AerisTableData, type AerisTableSort } from '@aeris-ui/core/table';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

const SELECTION_MEMBERS: readonly AerisTableData[] = [
  { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
  { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
  { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
  { id: '4', name: 'Liam Novak', team: 'Quality', status: 'Active' },
  { id: '5', name: 'Ava Patel', team: 'Product', status: 'Active' },
];

@Component({
  selector: 'app-table-selection-workflow-demo',
  imports: [AerisButton, AerisMenuModule, AerisTableModule, AerisToolbarModule],
  templateUrl: './table-selection-workflow.demo.html',
  styleUrl: './table-selection-workflow.demo.scss'
})
export class TableSelectionWorkflowSelectionWorkflowDemo {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly filter = signal('');

  protected readonly columns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '22%' },
      { field: 'role', header: 'Role', sortable: true, width: '26%' },
      { field: 'team', header: 'Team', sortable: true, width: '20%' },
      { field: 'status', header: 'Status', align: 'center', width: '14%' },
      { field: 'lastActive', header: 'Last active', sortable: true, width: '18%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected readonly workflowMembers = signal(SELECTION_MEMBERS);

  protected readonly workflowFocusTarget = viewChild('workflowColumnsButton', {
      read: ElementRef<HTMLButtonElement>,
    });

  protected readonly workflowSelected = signal<readonly string[]>([]);

  protected readonly workflowFirst = signal(0);

  protected readonly workflowQuery = signal('');

  protected readonly workflowBusy = signal(false);

  protected readonly workflowStatus = signal('Select members on any page to remove them together.');

  protected readonly workflowSort = signal<AerisTableSort | null>(null);

  protected readonly workflowFilters = signal<Readonly<Record<string, string>>>({});

  protected readonly workflowHidden = signal<readonly string[]>([]);

  protected readonly workflowAllColumns = signal<readonly AerisTableColumn[]>([
      { field: 'name', header: 'Name', sortable: true },
      { field: 'team', header: 'Team', sortable: true },
      { field: 'status', header: 'Status', sortable: true },
    ]);

  protected readonly workflowColumns = computed(() =>
      this.workflowAllColumns().filter((column) => !this.workflowHidden().includes(column.field)),
    );

  protected readonly workflowColumnItems = computed<readonly AerisMenuItem[]>(() =>
      this.workflowAllColumns().map((column) => ({
        label:
          column.field === 'name'
            ? 'Name (required)'
            : `${this.workflowHidden().includes(column.field) ? 'Show' : 'Hide'} ${column.header}`,
        disabled: column.field === 'name' || this.workflowBusy(),
        command: () => this.toggleWorkflowColumn(column.field),
      })),
    );

  protected toggleWorkflowColumn(field: string): void {
      if (field === 'name' || this.workflowBusy()) return;
      this.workflowHidden.update((fields) =>
        fields.includes(field) ? fields.filter((item) => item !== field) : [...fields, field],
      );
      this.workflowFilters.update((filters) =>
        Object.fromEntries(Object.entries(filters).filter(([key]) => key !== field)),
      );
      if (this.workflowSort()?.field === field) this.workflowSort.set(null);
      this.workflowFirst.set(0);
    }

  protected orderWorkflowColumns(columns: readonly AerisTableColumn[]): void {
      let index = 0;
      this.workflowAllColumns.update((all) =>
        all.map((column) =>
          this.workflowHidden().includes(column.field) ? column : (columns[index++] ?? column),
        ),
      );
    }

  protected clearWorkflowSelection(fallback?: HTMLButtonElement): void {
      this.workflowSelected.set([]);
      this.workflowStatus.set('Selection cleared on every page, including filtered-out members.');
      fallback?.focus();
    }

  protected async removeWorkflowMembers(fallback?: HTMLButtonElement): Promise<void> {
      if (this.workflowBusy() || !this.workflowSelected().length) return;
      const keys = new Set(this.workflowSelected());
      this.workflowBusy.set(true);
      this.workflowStatus.set(`Removing ${keys.size} selected members…`);
      // Replace this delay with your application's API request; update rows only on success.
      await new Promise<void>((resolve) => setTimeout(resolve, 300));
      if (this.destroyRef.destroyed) return;
      this.workflowMembers.update((members) =>
        members.filter((member) => !keys.has(String(member['id']))),
      );
      this.workflowSelected.set([]);
      this.workflowFirst.set(0);
      this.workflowBusy.set(false);
      this.workflowStatus.set(
        `Removed ${keys.size} members. Selection cleared; focus returned to Columns.`,
      );
      fallback?.focus();
    }

  protected restoreWorkflowMembers(): void {
      if (this.workflowBusy()) return;
      this.workflowMembers.set(SELECTION_MEMBERS);
      this.workflowSelected.set([]);
      this.workflowFirst.set(0);
      this.workflowQuery.set('');
      this.workflowFilters.set({});
      this.workflowSort.set(null);
      this.workflowStatus.set('Example members restored.');
    }
}
```

#### HTML

```html
<div class="selection-workflow">
  <aeris-toolbar variant="plain" role="group" ariaLabel="Member bulk actions">
    <span aerisToolbarStart aria-live="polite"
      >{{ workflowSelected().length }} selected across all pages</span>
    <div aerisToolbarEnd>
      <button
        aerisButton
        type="button"
        variant="ghost"
        [disabled]="!workflowSelected().length || workflowBusy()"
        (click)="clearWorkflowSelection(workflowFocusTarget()?.nativeElement)"
      >
        Clear selection
      </button>
      <button
        aerisButton
        type="button"
        severity="danger"
        [disabled]="!workflowSelected().length || workflowBusy()"
        [loading]="workflowBusy()"
        (click)="removeWorkflowMembers(workflowFocusTarget()?.nativeElement)"
      >
        Remove selected members
      </button>
      <button
        #workflowColumnsButton
        aerisButton
        type="button"
        variant="outline"
        (click)="workflowMenu.toggle($event)"
      >
        Columns
      </button>
      <button
        aerisButton
        type="button"
        variant="ghost"
        [disabled]="workflowBusy()"
        (click)="restoreWorkflowMembers()"
      >
        Restore members
      </button>
    </div>
  </aeris-toolbar>
  <aeris-menu
    #workflowMenu
    popup
    [model]="workflowColumnItems()"
    ariaLabel="Member columns"
  />
  <aeris-table
    caption="Member selection workspace"
    rowKeyField="id"
    [data]="workflowMembers()"
    [columns]="workflowColumns()"
    (columnsChange)="orderWorkflowColumns($event)"
    [(selectedKeys)]="workflowSelected"
    [(filterValue)]="workflowQuery"
    [(first)]="workflowFirst"
    [(sort)]="workflowSort"
    [(columnFilters)]="workflowFilters"
    selectionMode="multiple"
    paginator
    [rows]="2"
    globalFilter
    columnFilter
    reorderableColumns
    filterLabel="Find members"
    filterPlaceholder="Search visible columns"
    [loading]="workflowBusy()"
    loadingMessage="Removing members"
    emptyMessage="No matching members. Clear filters or restore the example data."
  />
  <p class="workflow-note" role="status">{{ workflowStatus() }}</p>
</div>
```

#### CSS

```css
.selection-workflow {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 1rem;
}

.workflow-note {
  margin: 0;
  color: var(--aeris-text-2);
  font-size: 0.875rem;
  line-height: 1.6;
}

.selection-workflow [aerisToolbarStart] {
  flex: 1 1 12rem;
}

.selection-workflow [aerisToolbarEnd] {
  flex: 2 1 24rem;
}
```

### Context menu

Bind an Aeris ContextMenu instance to the table. Right-clicking a body row opens the menu and exposes the row through controlled contextMenuRow state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { type AerisContextMenuItemEvent } from '@aeris-ui/core/context-menu';
import { AerisTableContextMenuModule, type AerisTableColumn, type AerisTableContextMenuEvent, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-context-menu-demo',
  imports: [AerisTableContextMenuModule],
  templateUrl: './table-context-menu.demo.html'
})
export class TableContextMenuContextMenuDemo {
  protected readonly contextMenuStatus = signal('Right-click a row to open member actions.');

  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected readonly contextMenuMember =
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
    this.contextMenuStatus.set(`Opened actions for ${event.row['name']}`);
  }
  protected handleMemberMenuAction(event: AerisContextMenuItemEvent): void {
    const member = this.contextMenuMember();
    this.contextMenuStatus.set(
      `${event.item.label} for ${member?.['name'] ?? 'selected member'}`,
    );
  }
}
```

#### HTML

```html
<div>
  <aeris-table
    caption="Context menu team members"
    [data]="members"
    [columns]="compactColumns"
    [contextMenu]="memberMenu"
    [(contextMenuRow)]="contextMenuMember"
    [(contextMenuRowKey)]="contextMenuMemberKey"
    (contextMenuOpened)="handleTableContextMenu($event)"
  />
  <aeris-context-menu
    #memberMenu
    [model]="memberContextMenuItems"
    ariaLabel="Member actions"
    (itemSelected)="handleMemberMenuAction($event)"
  />
  <small aria-live="polite">{{ contextMenuStatus() }}</small>
</div>
```

### Striped rows, sizes, and gridlines

Three density sizes change cell padding. Striped rows and gridlines are independent visual options.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-appearance-demo',
  imports: [AerisTableModule],
  templateUrl: './table-appearance.demo.html',
  styleUrl: './table-appearance.demo.scss'
})
export class TableAppearanceStripedRowsSizesAndGridlinesDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];
}
```

#### HTML

```html
<div class="table-state-grid">
  <aeris-table
    caption="Small striped table"
    [data]="members"
    [columns]="compactColumns"
    size="sm"
    striped
  />
  <aeris-table
    caption="Large grid table"
    [data]="members"
    [columns]="compactColumns"
    size="lg"
    gridlines
  />
</div>
```

#### CSS

```css
.table-state-grid {
  width: 100%;
  display: grid;
  gap: 1rem;
}

.table-state-grid > .aeris-button {
  justify-self: start;
}
```

### Column controls

Drag a centered separator or focus it and use the arrow keys to resize without changing the table width. Drag headers or use Alt with the arrow keys to reorder them. Truncated values expose an Aeris Tooltip.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-resizing-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Resizable team member columns"
        [data]="members"
        [(columns)]="adjustableColumns"
        resizableColumns
        reorderableColumns
        showOverflowTooltip
        gridlines
      />
    </div>
  `
})
export class TableResizingColumnControlsDemo {
  protected readonly adjustableColumns =
    signal<readonly AerisTableColumn[]>([
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ]);

  protected readonly members: readonly AerisTableData[] = [
    { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
    { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
    { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
  ];
}
```

### Row reordering

Drag a dedicated handle, or click/tap a source handle and then a destination handle. Keyboard users can also press Alt + Arrow Up/Down. Liam stays fixed in place. The external button demonstrates the same moveRow method.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTableModule, type AerisTableColumn, type AerisTableData, type AerisTableRowReorderEvent } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-row-reordering-demo',
  imports: [AerisButton, AerisTableModule],
  templateUrl: './table-row-reordering.demo.html',
  styleUrl: './table-row-reordering.demo.scss'
})
export class TableRowReorderingRowReorderingDemo {
  protected readonly reorderMembers = signal<readonly AerisTableData[]>([
    { id: '1', name: 'Maya Chen', team: 'Design' },
    { id: '2', name: 'Noah Williams', team: 'Engineering' },
    { id: '3', name: 'Sofia Rossi', team: 'Research' },
    { id: '4', name: 'Liam Novak', team: 'Quality' },
  ]);
  protected readonly reorderColumns: readonly AerisTableColumn[] = [
    { field: 'name', header: 'Name', width: '60%' },
    { field: 'team', header: 'Team', width: '40%' },
  ];
  protected readonly pinnedMember = (row: AerisTableData): boolean => row['id'] === '4';
  protected readonly reorderStatus = signal('Liam is fixed in the last position.');
  protected handleRowReorder(event: AerisTableRowReorderEvent): void {
    this.reorderStatus.set(`${event.row['name']} moved to position ${event.toIndex + 1}.`);
  }
}
```

#### HTML

```html
<div class="row-reorder-demo">
  <button aerisButton variant="outline" (click)="reorderTable.moveRow(0, 1)">
    Move first row down
  </button>
  <aeris-table
    #reorderTable
    caption="Team priority order"
    [(data)]="reorderMembers"
    [columns]="reorderColumns"
    reorderableRows
    [rowReorderDisabled]="pinnedMember"
    (rowReordered)="handleRowReorder($event)"
  />
  <p class="workflow-note">{{ reorderStatus() }}</p>
</div>
```

#### CSS

```css
.row-reorder-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 1rem;
}

.row-reorder-demo > button {
  justify-self: start;
}

.workflow-note {
  margin: 0;
  color: var(--aeris-text-2);
  font-size: 0.875rem;
  line-height: 1.6;
}
```

### Row expansion

Expandable rows keep the disclosure button, aria-expanded state, and expanded content synchronized.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-expansion-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Expandable team members"
        [data]="members"
        [columns]="compactColumns"
        expandableRows
        [(expandedKeys)]="expandedMembers"
      >
        <ng-template aerisTableExpansion let-row>
          <strong>{{ row['name'] }}</strong> - {{ row['notes'] }}
        </ng-template>
      </aeris-table>
    </div>
  `
})
export class TableExpansionRowExpansionDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected readonly selectedMembers =
    signal<readonly string[]>(['1']);

  protected readonly expandedMembers =
    signal<readonly string[]>([]);

  protected readonly filter = signal('');
}
```

### In-cell editing

Double-click a cell to edit using the built-in text input. Aeris emits the edit event and lets the app decide how to persist the value.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableCellEditEvent, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-editing-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Editable team members"
        [data]="editableMembers()"
        [columns]="compactColumns"
        editable
        (cellEdited)="handleCellEdit($event)"
      />
    </div>
  `
})
export class TableEditingInCellEditingDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly editableMembers =
    signal<readonly AerisTableData[]>([
      { id: '1', name: 'Maya Chen', team: 'Design', status: 'Active' },
      { id: '2', name: 'Noah Williams', team: 'Engineering', status: 'Invited' },
      { id: '3', name: 'Sofia Rossi', team: 'Research', status: 'Offline' },
    ]);

  protected handleCellEdit(event: AerisTableCellEditEvent): void {
    this.editableMembers.update((rows) =>
      rows.map((row) =>
        row['id'] === event.row['id']
          ? { ...row, [event.field]: event.value }
          : row,
      ),
    );
  }
}
```

### Editing permissions

Name inherits the table default. Team opts in at column level. Status opts out. The cell predicate locks Noah's entire row and Sofia's Team cell. Toggle the default to see which cells inherit it.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTableModule, type AerisTableCellEditEvent, type AerisTableCellEditable, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-editing-permissions-demo',
  imports: [AerisButton, AerisTableModule],
  templateUrl: './table-editing-permissions.demo.html',
  styleUrl: './table-editing-permissions.demo.scss'
})
export class TableEditingPermissionsEditingPermissionsDemo {
  protected readonly permissionDefault = signal(true);

  protected readonly permissionColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', width: '40%' },
      { field: 'team', header: 'Team', editable: true, width: '30%' },
      { field: 'status', header: 'Status', editable: false, width: '30%' },
    ];

  protected readonly permissionRows = signal<readonly AerisTableData[]>([
      { id: 'one', name: 'Maya', team: 'Design', status: 'Active' },
      { id: 'two', name: 'Noah', team: 'Engineering', status: 'Archived' },
      { id: 'three', name: 'Sofia', team: 'Research', status: 'Active' },
    ]);

  protected readonly canEditCell: AerisTableCellEditable = (row, column) =>
      row['status'] === 'Archived' || (row['id'] === 'three' && column.field === 'team')
        ? false
        : undefined;

  protected savePermissionEdit(event: AerisTableCellEditEvent): void {
      this.permissionRows.update((rows) =>
        rows.map((row) => (row === event.row ? { ...row, [event.field]: event.value } : row)),
      );
    }
}
```

#### HTML

```html
<div class="custom-editor-demo">
  <button
    aerisButton
    variant="outline"
    [attr.aria-pressed]="permissionDefault()"
    (click)="permissionDefault.set(!permissionDefault())"
  >
    Table default: {{ permissionDefault() ? 'editable' : 'read-only' }}
  </button>
  <aeris-table
    caption="Editing permissions"
    [data]="permissionRows()"
    [columns]="permissionColumns"
    [editable]="permissionDefault()"
    [cellEditable]="canEditCell"
    (cellEdited)="savePermissionEdit($event)"
  />
</div>
```

#### CSS

```css
.custom-editor-demo,
.custom-cell-editor {
  display: grid;
  min-inline-size: 0;
  inline-size: 100%;
  gap: 0.75rem;
}
```

### Custom editors

Edit text, quantities, dates, and selections directly. Leaving a cell commits its valid draft. Double-click another cell to switch immediately; Escape cancels. Body-mounted pickers remain part of the editor.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisDatePicker } from '@aeris-ui/core/date-picker';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisTableModule, type AerisTableCellEditEvent, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-custom-editors-demo',
  imports: [AerisDatePicker, AerisInputNumber, AerisInputText, AerisSelect, AerisTableModule],
  templateUrl: './table-custom-editors.demo.html',
  styleUrl: './table-custom-editors.demo.scss'
})
export class TableCustomEditorsCustomEditorsDemo {
  protected readonly isDate = (value: unknown): value is Date => value instanceof Date;

  protected readonly customEditorColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', width: '30%' },
      { field: 'quantity', header: 'Quantity', width: '20%' },
      { field: 'status', header: 'Status', width: '25%' },
      { field: 'date', header: 'Date', width: '25%' },
    ];

  protected readonly customEditorRows = signal<readonly AerisTableData[]>([
      { id: 'one', name: 'Release notes', quantity: 3, status: 'draft', date: new Date(2026, 9, 21) },
      {
        id: 'two',
        name: 'API reference',
        quantity: 5,
        status: 'published',
        date: new Date(2026, 9, 22),
      },
    ]);

  protected readonly editorStatuses = [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ];

  protected readonly editorResult = signal('Double-click a cell or focus it and press F2 to edit.');

  protected saveCustomEditor(event: AerisTableCellEditEvent): void {
      this.customEditorRows.update((rows) =>
        rows.map((row) => (row === event.row ? { ...row, [event.field]: event.value } : row)),
      );
      this.editorResult.set(`Saved ${event.field}.`);
    }
}
```

#### HTML

```html
<div class="custom-editor-demo">
  <aeris-table
    caption="Custom editor records"
    [data]="customEditorRows()"
    [columns]="customEditorColumns"
    editable
    (cellEdited)="saveCustomEditor($event)"
    (editCancelled)="editorResult.set('Edit cancelled.')"
  >
    <ng-template aerisTableEditor let-editor let-column="column">
      @let draft = editor.value();
      <div class="custom-cell-editor">
        @switch (column.field) {
          @case ('quantity') {
            <aeris-input-number
              [ariaLabel]="editor.ariaLabel"
              [value]="typeof draft === 'number' ? draft : null"
              (valueChange)="
                editor.value.set($event);
                editor.valid.set($event !== null && $event >= 0)
              "
              [invalid]="typeof draft !== 'number' || draft < 0"
              fluid
            />
            @if (typeof draft !== 'number' || draft < 0) {
              <small role="alert">Enter a quantity of zero or greater.</small>
            }
          }
          @case ('status') {
            <aeris-select
              [ariaLabel]="editor.ariaLabel"
              [options]="editorStatuses"
              [value]="typeof draft === 'string' ? draft : null"
              (valueChange)="editor.value.set($event)"
              appendTo="body"
              fluid
            />
          }
          @case ('date') {
            @if (isDate(draft) || draft === null) {
              <aeris-date-picker
                [ariaLabel]="editor.ariaLabel"
                [value]="draft"
                (valueChange)="editor.value.set($event)"
                appendTo="body"
                fluid
              />
            }
          }
          @default {
            <aeris-input-text
              [ariaLabel]="editor.ariaLabel"
              [value]="typeof draft === 'string' ? draft : ''"
              (valueChange)="editor.value.set($event)"
              fluid
            />
          }
        }
      </div>
    </ng-template>
  </aeris-table>
  <small role="status">{{ editorResult() }}</small>
</div>
```

#### CSS

```css
.custom-editor-demo,
.custom-cell-editor {
  display: grid;
  min-inline-size: 0;
  inline-size: 100%;
  gap: 0.75rem;
}
```

### Scrolling

Scrollable tables constrain the body viewport while headers remain sticky. Use horizontal scroll for wide column sets.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-scrolling-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Scrollable team members"
        [data]="manyMembers"
        [columns]="columns"
        scrollable
        scrollHeight="18rem"
      />
    </div>
  `
})
export class TableScrollingScrollingDemo {
  protected readonly columns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '22%' },
      { field: 'role', header: 'Role', sortable: true, width: '26%' },
      { field: 'team', header: 'Team', sortable: true, width: '20%' },
      { field: 'status', header: 'Status', align: 'center', width: '14%' },
      { field: 'lastActive', header: 'Last active', sortable: true, width: '18%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
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
}
```

### Cell templates

Cell templates receive value, row, column, and rowIndex while Table preserves native table structure.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-templates-demo',
  imports: [AerisTableModule],
  templateUrl: './table-templates.demo.html',
  styleUrl: './table-templates.demo.scss'
})
export class TableTemplatesCellTemplatesDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];
}
```

#### HTML

```html
<div>
  <aeris-table
    caption="Templated team members"
    [data]="members"
    [columns]="compactColumns"
  >
    <ng-template aerisTableCell let-value let-column="column">
      @if (column.field === 'status') {
        <span class="status-pill" [attr.data-status]="value">{{ value }}</span>
      } @else {
        {{ value }}
      }
    </ng-template>
  </aeris-table>
</div>
```

#### CSS

```css
.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  background: var(--aeris-surface-2);
  color: var(--aeris-text-2);
  font-size: 0.75rem;
  font-weight: 700;
}

.status-pill[data-status=Active] {
  background: color-mix(in srgb, var(--aeris-success) 14%, transparent);
  color: var(--aeris-success);
}

.status-pill[data-status=Invited] {
  background: color-mix(in srgb, var(--aeris-warning) 16%, transparent);
  color: var(--aeris-warning);
}
```

### Responsive layouts

Default scroll mode keeps wide tables horizontally scrollable. Stack mode turns rows into labelled cards on narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-responsive-demo',
  imports: [AerisTableModule],
  templateUrl: './table-responsive.demo.html',
  styleUrl: './table-responsive.demo.scss'
})
export class TableResponsiveResponsiveLayoutsDemo {
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

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];
}
```

#### HTML

```html
<div class="table-state-grid">
  <aeris-table
    caption="Horizontally scrollable team members"
    [data]="members"
    [columns]="columns"
    responsiveMode="scroll"
  />
  <aeris-table
    caption="Responsive team members"
    [data]="members"
    [columns]="compactColumns"
    responsiveMode="stack"
    striped
  />
</div>
```

#### CSS

```css
.table-state-grid {
  width: 100%;
  display: grid;
  gap: 1rem;
}

.table-state-grid > .aeris-button {
  justify-self: start;
}
```

### CSV export

Call exportCSV from a template reference to download CSV for all, filtered, or current page rows. Fields are quoted and formula-like values are emitted as text to reduce spreadsheet injection risk.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTableModule, type AerisTable, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-csv-demo',
  imports: [AerisButton, AerisTableModule],
  template: `
    <div class="table-state-grid">
      <aeris-table
        #csvTable
        caption="CSV team members"
        [data]="members"
        [columns]="compactColumns"
      />
      <button aerisButton type="button" (click)="exportCsv(csvTable)">Export CSV</button>
    </div>
  `,
  styles: `
    .table-state-grid {
      width: 100%;
      display: grid;
      gap: 1rem;
    }

    .table-state-grid > .aeris-button {
      justify-self: start;
    }
  `
})
export class TableCsvCSVExportDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected exportCsv(table: AerisTable): void {
    table.exportCSV({
      filename: 'team-members.csv',
      rows: 'filtered',
    });
  }
}
```

### Loading and empty states

Loading and empty content are announced with status semantics and can be replaced with templates.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-states-demo',
  imports: [AerisTableModule],
  template: `
    <div class="table-state-grid">
      <aeris-table
        caption="Loading members"
        [data]="members"
        [columns]="compactColumns"
        loading
      />
      <aeris-table
        caption="Empty members"
        [data]="[]"
        [columns]="compactColumns"
        emptyMessage="No members match the current view."
      />
    </div>
  `,
  styles: `
    .table-state-grid {
      width: 100%;
      display: grid;
      gap: 1rem;
    }

    .table-state-grid > .aeris-button {
      justify-self: start;
    }
  `
})
export class TableStatesLoadingAndEmptyStatesDemo {
  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];
}
```

### Events

Sort and selection events provide typed metadata without requiring consumers to parse DOM state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableColumn, type AerisTableData, type AerisTableSelectionEvent, type AerisTableSortEvent } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-events-demo',
  imports: [AerisTableModule],
  template: `
    <div>
      <aeris-table
        caption="Event team members"
        [data]="members"
        [columns]="compactColumns"
        [(sort)]="sortState"
        selectionMode="multiple"
        [(selectedKeys)]="selectedMembers"
        (sorted)="handleSort($event)"
        (selectionChanged)="handleSelection($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `
})
export class TableEventsEventsDemo {
  protected readonly selectedMembers = signal<readonly string[]>(['1']);

  protected readonly eventText = signal('No table event yet');

  protected readonly sortState = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);

  protected readonly compactColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'Name', sortable: true, width: '42%' },
      { field: 'team', header: 'Team', width: '34%' },
      { field: 'status', header: 'Status', align: 'end', width: '24%' },
    ];

  protected readonly members: readonly AerisTableData[] = [
      {
        id: '1',
        name: 'Maya Chen',
        role: 'Product designer',
        team: 'Design',
        status: 'Active',
        lastActive: 'Just now',
        notes: 'Owns the design system rollout.',
      },
      {
        id: '2',
        name: 'Noah Williams',
        role: 'Frontend engineer',
        team: 'Engineering',
        status: 'Invited',
        lastActive: '2 hours ago',
        notes: 'Works on Angular component architecture.',
      },
      {
        id: '3',
        name: 'Sofia Rossi',
        role: 'Researcher',
        team: 'Research',
        status: 'Offline',
        lastActive: 'Yesterday',
        notes: 'Runs usability research for forms.',
      },
      {
        id: '4',
        name: 'Liam Novak',
        role: 'QA engineer',
        team: 'Quality',
        status: 'Active',
        lastActive: 'Today',
        notes: 'Maintains accessibility test plans.',
      },
      {
        id: '5',
        name: 'Ava Patel',
        role: 'Product manager',
        team: 'Product',
        status: 'Active',
        lastActive: '1 day ago',
        notes: 'Coordinates roadmap decisions.',
      },
    ];

  protected handleSort(event: AerisTableSortEvent): void {
    this.eventText.set(event.sort ? `Sorted by ${event.sort.field}` : 'Sorting cleared');
  }

  protected handleSelection(event: AerisTableSelectionEvent): void {
    this.eventText.set(`${event.keys.length} selected`);
  }
}
```

## Accessibility

- Click or tap a row handle, then a destination handle to move without dragging. The pressed state and live instructions identify the picked row. Activate the same handle again or press Escape to cancel.
- Row reorder handles are named native buttons with instructions. Use Alt + Arrow Up/Down to move a focused row; focus stays on that row and its new position is announced. Escape cancels pointer dragging. For non-drag pointer alternatives, provide buttons calling moveRow(), as in the Row reordering example.
- Table uses native table, caption, thead, tbody, th, and td semantics.
- Sortable headers are native buttons and synchronize aria-sort.
- Selection uses native checkbox or radio controls, including a visible-row select-all checkbox for multiple mode.
- When a context menu is bound, the native context menu gesture opens the configured Aeris ContextMenu for enabled body rows and exposes row metadata through table state and events.
- Expandable rows use native buttons with synchronized aria-expanded.
- Resizable columns expose named separator controls and keep the combined width of each adjusted column pair stable. Reorderable headers support pointer dragging and keyboard movement.
- When showOverflowTooltip is enabled, truncated headers and cells use Aeris Tooltip to reveal their complete value.
- Read-only cells have no edit indicator or editing tab stop. Double-click, Enter and F2 cannot start editing them.
- Loading and empty states use status semantics and remain inside the table body.
- Stack responsive mode preserves cell labels through generated row labels on narrow screens.
- Use a meaningful caption for every data table, even when the visible description is brief.
- Editors commit valid drafts when you leave the cell or press an unconsumed Enter. Textareas keep Enter for new lines, and nested pickers handle their own keys. Escape cancels. The first available control receives focus on entry; keyboard completion returns focus to the cell without stealing focus from outside controls on blur.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / F2 on an editable cell` | Starts editing and focuses the first available editor control. |
| `Escape while editing` | Cancels the edit after any nested picker has handled its own Escape. Custom editors commit valid drafts when you leave the cell. |
| `Tab` | Moves through global filter, sortable headers, selection controls, expansion controls, table viewport, and paginator buttons. |
| `Enter / Space` | Activates sortable headers, selection controls, expansion controls, and paginator buttons. |
| `Enter` | Expands or collapses a focused row when row navigation and expandableRows are enabled. |
| `Space` | Selects or deselects a focused row when row navigation and selectionMode are enabled. |
| `Context menu gesture` | Opens the configured row context menu when contextMenu is bound and the row is not disabled for context-menu handling. |
| `Arrow keys` | Use native browser scrolling inside the table viewport when content overflows. |
| `Arrow Left / Arrow Right` | Resizes the column beside a focused resize separator in 16-pixel increments. |
| `Alt + Arrow Up / Arrow Down` | Moves the row whose reorder handle has focus. Bounds and fixed rows are respected. |
| `Enter / Space on a reorder handle` | Picks a source row, then places it at the next activated destination handle. |
| `Escape` | Cancels row dragging or a picked row without changing data. |
| `Alt + Arrow Left / Arrow Right` | Moves a focused reorderable header one position in the requested visual direction. |
