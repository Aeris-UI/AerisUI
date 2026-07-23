# Table

> High-performance data table with sorting, filtering, editing, and virtualization.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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
| `data` | `readonly AerisTableData[]` | `[]` | Rows rendered by the table. |
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
| `lazy` | `boolean` | `false` | Emits lazyLoad metadata instead of assuming all data changes are local. |
| `pageLinkSize` | `number` | `5` | Paginator page button count. |
| `rowsPerPageOptions` | `readonly number[]` | `[]` | Rows-per-page menu options. |
| `selectionMode` | `single &#124; multiple &#124; null` | `null` | Enables single or multiple row selection. |
| `selectionControl` | `row &#124; control` | `'control'` | Uses row clicks or rendered checkbox/radio controls. |
| `selectedKeys` | `readonly string[] (model)` | `[]` | Controlled selected row keys. |
| `contextMenu` | `AerisContextMenu &#124; null` | `null` | ContextMenu instance opened from body rows on right-click. |
| `contextMenuDisabled` | `boolean &#124; function` | `false` | Disables row context-menu handling globally or per row. |
| `contextMenuRow` | `AerisTableData &#124; null (model)` | `null` | Controlled row currently associated with the context menu. |
| `contextMenuRowKey` | `string (model)` | `''` | Controlled key for the row currently associated with the context menu. |
| `expandableRows` | `boolean` | `false` | Enables row detail expansion. |
| `expandedKeys` | `readonly string[] (model)` | `[]` | Controlled expanded row keys. |
| `editable` | `boolean` | `false` | Enables double-click in-cell editing. |
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
| `cellEdited` | `AerisTableCellEditEvent` | `-` | Emitted when an editable cell commits a new string value. |
| `editCompleted` | `AerisTableCellEditEvent` | `-` | Emitted after an editable cell commits. |
| `columnResized` | `AerisTableColumnResizeEvent` | `-` | Emitted after pointer or keyboard resizing updates the controlled columns model. |
| `columnReordered` | `AerisTableColumnReorderEvent` | `-` | Emitted after pointer or keyboard column reordering updates the controlled columns model. |
| `stateSaved` | `AerisTableState` | `-` | Emitted when saveState returns current table state. |
| `stateRestored` | `AerisTableState` | `-` | Emitted when restoreState applies table state. |
| `csvExported` | `AerisTableCsvExportEvent` | `-` | Emitted after exportCSV creates CSV text. |

### Table templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisTableHeader | column | Custom header content. |
| aerisTableCell | value, row, column, rowIndex | Custom body cells. |
| aerisTableExpansion | row, rowIndex | Expandable detail row content. |
| aerisTableEmpty | none | Custom empty state. |
| aerisTableLoading | none | Custom loading state. |

### Table methods

| Name | Returns | Description |
| --- | --- | --- |
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

### Interfaces

```ts
type AerisTableSize = 'sm' | 'md' | 'lg';
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
import { AerisTableModule } from '@aeris-ui/core/table';

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
}
```

### Global filtering

Enable a built-in search field and bind filterValue when application state needs to inspect or restore the query.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule } from '@aeris-ui/core/table';

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
import { AerisTableModule } from '@aeris-ui/core/table';

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
import { AerisTableModule } from '@aeris-ui/core/table';

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
}
```

### Selection

Use highlighted row selection, checkbox selection, or radio-button selection depending on the interaction model.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-selection-demo',
  imports: [AerisTableModule],
  templateUrl: './table-selection.demo.html',
  styleUrl: './table-selection.demo.scss'
})
export class TableSelectionSelectionDemo {
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

### Context menu

Bind an Aeris ContextMenu instance to the table. Right-clicking a body row opens the menu and exposes the row through controlled contextMenuRow state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { type AerisContextMenuItemEvent } from '@aeris-ui/core/context-menu';
import { AerisTableContextMenuModule, type AerisTableContextMenuEvent, type AerisTableData } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-context-menu-demo',
  imports: [AerisTableContextMenuModule],
  templateUrl: './table-context-menu.demo.html'
})
export class TableContextMenuContextMenuDemo {
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
import { AerisTableModule } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-appearance-demo',
  imports: [AerisTableModule],
  templateUrl: './table-appearance.demo.html',
  styleUrl: './table-appearance.demo.scss'
})
export class TableAppearanceStripedRowsSizesAndGridlinesDemo {
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

### Row expansion

Expandable rows keep the disclosure button, aria-expanded state, and expanded content synchronized.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule } from '@aeris-ui/core/table';

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
  protected readonly selectedMembers =
    signal<readonly string[]>(['1']);

  protected readonly expandedMembers =
    signal<readonly string[]>([]);

  protected readonly filter = signal('');
}
```

### In-cell editing

Double-click a cell to edit. Aeris emits the edit event and lets the app decide how to persist the value.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTableModule, type AerisTableCellEditEvent, type AerisTableData } from '@aeris-ui/core/table';

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
  protected readonly editableMembers =
    signal<readonly AerisTableData[]>(members);

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

### Scrolling

Scrollable tables constrain the body viewport while headers remain sticky. Use horizontal scroll for wide column sets.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule } from '@aeris-ui/core/table';

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
}
```

### Cell templates

Cell templates receive value, row, column, and rowIndex while Table preserves native table structure.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-templates-demo',
  imports: [AerisTableModule],
  templateUrl: './table-templates.demo.html',
  styleUrl: './table-templates.demo.scss'
})
export class TableTemplatesCellTemplatesDemo {
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
import { AerisTableModule } from '@aeris-ui/core/table';

@Component({
  selector: 'app-table-responsive-demo',
  imports: [AerisTableModule],
  templateUrl: './table-responsive.demo.html',
  styleUrl: './table-responsive.demo.scss'
})
export class TableResponsiveResponsiveLayoutsDemo {
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
import { AerisTableModule, type AerisTable } from '@aeris-ui/core/table';

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
import { AerisTableModule } from '@aeris-ui/core/table';

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
}
```

### Events

Sort and selection events provide typed metadata without requiring consumers to parse DOM state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTableModule, type AerisTableSelectionEvent, type AerisTableSortEvent } from '@aeris-ui/core/table';

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
  protected handleSort(event: AerisTableSortEvent): void {
    this.eventText.set(event.sort ? `Sorted by ${event.sort.field}` : 'Sorting cleared');
  }

  protected handleSelection(event: AerisTableSelectionEvent): void {
    this.eventText.set(`${event.keys.length} selected`);
  }
}
```

## Accessibility

- Table uses native table, caption, thead, tbody, th, and td semantics.
- Sortable headers are native buttons and synchronize aria-sort.
- Selection uses native checkbox or radio controls, including a visible-row select-all checkbox for multiple mode.
- When a context menu is bound, the native context menu gesture opens the configured Aeris ContextMenu for enabled body rows and exposes row metadata through table state and events.
- Expandable rows use native buttons with synchronized aria-expanded.
- Resizable columns expose named separator controls and keep the combined width of each adjusted column pair stable. Reorderable headers support pointer dragging and keyboard movement.
- When showOverflowTooltip is enabled, truncated headers and cells use Aeris Tooltip to reveal their complete value.
- Loading and empty states use status semantics and remain inside the table body.
- Stack responsive mode preserves cell labels through generated row labels on narrow screens.
- Use a meaningful caption for every data table, even when the visible description is brief.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through global filter, sortable headers, selection controls, expansion controls, table viewport, and paginator buttons. |
| `Enter / Space` | Activates sortable headers, selection controls, expansion controls, and paginator buttons. |
| `Enter` | Expands or collapses a focused row when row navigation and expandableRows are enabled. |
| `Space` | Selects or deselects a focused row when row navigation and selectionMode are enabled. |
| `Context menu gesture` | Opens the configured row context menu when contextMenu is bound and the row is not disabled for context-menu handling. |
| `Arrow keys` | Use native browser scrolling inside the table viewport when content overflows. |
| `Arrow Left / Arrow Right` | Resizes the column beside a focused resize separator in 16-pixel increments. |
| `Alt + Arrow Left / Arrow Right` | Moves a focused reorderable header one position in the requested visual direction. |
