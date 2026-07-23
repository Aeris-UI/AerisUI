# TreeTable

> Hierarchical tabular data with controlled expansion, sorting, filtering, selection, editing, pagination, and lazy loading.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/tree-table`
- Human-readable documentation: [https://aeris-ui.dev/components/tree-table](https://aeris-ui.dev/components/tree-table)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTreeTableModule } from '@aeris-ui/core/tree-table';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `treeColumn` | `string` | `''` | Column field that owns indentation, toggles, and checkbox controls. Defaults to the first column. |
| `caption` | `string` | `''` | Native table caption. |
| `ariaLabel` | `string` | `'Tree table'` | Accessible name for the treegrid. |
| `size` | `'sm' &#124; 'md' &#124; 'lg'` | `'md'` | Cell density. |
| `striped` | `boolean` | `false` | Alternates row backgrounds. |
| `gridlines` | `boolean` | `false` | Shows vertical cell borders. |
| `hoverable` | `boolean` | `true` | Highlights the hovered row. |
| `fluid` | `boolean` | `true` | Fills the available width. |
| `responsiveMode` | `'scroll' &#124; 'stack'` | `'scroll'` | Keeps horizontal overflow or stacks labeled cells on narrow screens. |
| `scrollable` | `boolean` | `true` | Makes the viewport keyboard-focusable with sticky headers. |
| `scrollHeight` | `string` | `''` | Maximum scrollable viewport height. |
| `tableMinWidth` | `string` | `'42rem'` | Minimum table width before horizontal scrolling. |
| `selectionMode` | `'single' &#124; 'multiple' &#124; 'checkbox' &#124; null` | `null` | Enables row or cascading checkbox selection. |
| `propagateSelection` | `boolean` | `true` | Cascades checkbox state through selectable descendants. |
| `sortMode` | `'single' &#124; 'multiple'` | `'single'` | Keeps one sort or composes multiple sorts. |
| `removableSort` | `boolean` | `true` | Allows the third sort activation to clear the column. |
| `globalFilter` | `boolean` | `false` | Shows the global search field. |
| `columnFilter` | `boolean` | `false` | Shows per-column search fields. |
| `filterStrategy` | `'subtree' &#124; 'path'` | `'path'` | Includes all descendants of a matched branch or only matched paths. |
| `globalFilterLabel` | `string` | `'Search'` | Visible global filter label. |
| `globalFilterPlaceholder` | `string` | `'Search rows'` | Global filter placeholder. |
| `columnFilterPlaceholder` | `string` | `''` | Shared column filter placeholder; column-specific text is generated when empty. |
| `paginator` | `boolean` | `false` | Paginates root nodes using the Aeris paginator. |
| `pageLinkSize` | `number` | `5` | Maximum visible page links. |
| `rowsPerPageOptions` | `readonly number[]` | `[]` | Selectable root-row page sizes. |
| `lazy` | `boolean` | `false` | Delegates sorting, filtering, and paging to lazyLoad. |
| `totalRecords` | `number` | `0` | Logical root-row count in lazy mode. |
| `loading` | `boolean` | `false` | Replaces rows with the loading state. |
| `loadingKeys` | `readonly string[]` | `[]` | Branch keys currently loading children. |
| `loadingMessage` | `string` | `'Loading rows'` | Default loading status text. |
| `emptyMessage` | `string` | `'No rows available'` | Default empty status text. |
| `emptyFilterMessage` | `string` | `'No matching rows'` | Default no-results status text. |
| `editable` | `boolean` | `false` | Marks editable cells and enables double-click editing for editable columns. |
| `resizableColumns` | `boolean` | `false` | Adds width-preserving pointer and keyboard column resize separators. |
| `reorderableColumns` | `boolean` | `false` | Enables header dragging and Alt+Arrow column reordering. |
| `minColumnWidth` | `number` | `96` | Minimum resized column width in pixels. |
| `showOverflowTooltip` | `boolean` | `false` | Shows an Aeris Tooltip for truncated header and cell values only when ellipsis is active. |
| `expandAriaLabel` | `string` | `'Expand row'` | Accessible label for collapsed branch controls. |
| `collapseAriaLabel` | `string` | `'Collapse row'` | Accessible label for expanded branch controls. |
| `selectRowAriaLabel` | `string` | `'Select row'` | Accessible label for checkbox selection controls. |
| `paginatorAriaLabel` | `string` | `'Tree table pagination'` | Accessible name for pagination. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `readonly AerisTreeTableNode&lt;TData&gt;[]` | `[]` | Root nodes; editing writes immutable node data. |
| `columns` | `readonly AerisTreeTableColumn[]` | `[]` | Dynamic columns; resizing and reordering update this model. |
| `expandedKeys` | `readonly string[]` | `[]` | Expanded branch keys. |
| `selectionKeys` | `readonly string[]` | `[]` | Selected node keys. |
| `sorts` | `readonly AerisTreeTableSort[]` | `[]` | Ordered sort definitions. |
| `globalFilterValue` | `string` | `''` | Global search value. |
| `columnFilters` | `Readonly&lt;Record&lt;string, string&gt;&gt;` | `{}` | Filter values keyed by column field. |
| `first` | `number` | `0` | First root-row index. |
| `rows` | `number` | `10` | Root rows per page. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `nodeExpanded` | `AerisTreeTableNodeEvent&lt;TData&gt;` | `-` | Emitted when a branch expands. |
| `nodeCollapsed` | `AerisTreeTableNodeEvent&lt;TData&gt;` | `-` | Emitted when a branch collapses. |
| `selectionChanged` | `AerisTreeTableSelectionEvent&lt;TData&gt;` | `-` | Emitted whenever selection changes. |
| `nodeSelected` | `AerisTreeTableSelectionEvent&lt;TData&gt;` | `-` | Emitted when selection is added. |
| `nodeUnselected` | `AerisTreeTableSelectionEvent&lt;TData&gt;` | `-` | Emitted when selection is removed. |
| `sorted` | `AerisTreeTableSortEvent` | `-` | Emitted after controlled sort state changes. |
| `filtered` | `AerisTreeTableFilterEvent&lt;TData&gt;` | `-` | Emitted after global or column filters change. |
| `pageChanged` | `AerisTreeTablePageEvent` | `-` | Emitted after paginator navigation. |
| `lazyLoad` | `AerisTreeTableLazyLoadEvent` | `-` | Requests a server-side page, sort, or filter result. |
| `editStarted` | `AerisTreeTableCellEditEvent&lt;TData&gt;` | `-` | Emitted when cell editing begins. |
| `cellEdited` | `AerisTreeTableCellEditEvent&lt;TData&gt;` | `-` | Emitted after an edit is committed. |
| `editCancelled` | `AerisTreeTableCellEditEvent&lt;TData&gt;` | `-` | Emitted when Escape cancels an edit. |
| `columnResized` | `AerisTreeTableColumnResizeEvent` | `-` | Emitted after pointer or keyboard resizing. |
| `columnReordered` | `AerisTreeTableColumnReorderEvent` | `-` | Emitted after pointer or keyboard column reordering. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTreeTableHeader` | `AerisTreeTableHeaderContext` | `column.header` | Custom header content with column and sort state. |
| `aerisTreeTableCell` | `AerisTreeTableCellContext&lt;TData&gt;` | `Formatted field value` | Custom content for every body cell. |
| `aerisTreeTableEmpty` | `none` | `emptyMessage / emptyFilterMessage` | Custom empty and no-results content. |
| `aerisTreeTableLoading` | `none` | `Spinner and loadingMessage` | Custom loading content. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(key?: string)` | `void` | `-` | Focuses a visible row by key or the active row. |
| `expandAll()` | `void` | `-` | Adds every branch key to expandedKeys. |
| `collapseAll()` | `void` | `-` | Clears expandedKeys. |
| `clearFilters()` | `void` | `-` | Clears global and column filter models. |
| `startEdit(key, field)` | `void` | `-` | Starts editing a visible editable cell. |

## Interfaces and types

### Interfaces

```ts
type AerisTreeTableData = Readonly<Record<string, unknown>>;
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-tree-table-border` | `CSS custom property` | — | Viewport border color. |
| `--aeris-tree-table-radius` | `CSS custom property` | — | Viewport corner radius. |
| `--aeris-tree-table-background` | `CSS custom property` | — | Table surface. |
| `--aeris-tree-table-header-background` | `CSS custom property` | — | Header and filter-row surface. |
| `--aeris-tree-table-cell-padding` | `CSS custom property` | — | Header and body cell padding. |
| `--aeris-tree-table-min-width` | `CSS custom property` | — | Rendered table minimum width. |
| `--aeris-tree-table-scroll-height` | `CSS custom property` | — | Maximum scroll viewport height. |
| `--aeris-tree-table-header-height` | `CSS custom property` | — | Sticky header offset used by column filters. |
| `--aeris-tree-table-indent` | `CSS custom property` | — | Indent per hierarchy level. |
| `--aeris-tree-table-stripe` | `CSS custom property` | — | Alternate row surface. |
| `--aeris-tree-table-row-hover` | `CSS custom property` | — | Hover and focused row surface. |
| `--aeris-tree-table-row-selected` | `CSS custom property` | — | Selected row surface. |

## Examples

### Basic

Dynamic columns render hierarchical records while expandedKeys controls which descendants are visible.

#### TS

```ts
import { Component } from '@angular/core';
import { type AerisBadgeSeverity } from '@aeris-ui/core/badge';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-basic-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo">
      <aeris-tree-table
        ariaLabel="Project files"
        [value]="files"
        [columns]="columns"
        [(expandedKeys)]="basicExpanded"
      />
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableBasicBasicDemo {
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
  ];

  protected readonly statusSeverities: Readonly<
    Record<FileRecord['status'], AerisBadgeSeverity>
  > = {
    active: 'success',
    review: 'warning',
    archived: 'neutral',
  };
}
```

### Controlled expansion

Replace the controlled key collection to expand or collapse every known branch.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-controlled-demo',
  imports: [AerisButton, AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo tree-table-demo--stack">
      <div class="tree-table-controls" aria-label="TreeTable expansion controls">
        <button aerisButton type="button" (click)="expandAll()">Expand all</button>
        <button aerisButton type="button" (click)="collapseAll()">Collapse all</button>
      </div>
      <aeris-tree-table
        ariaLabel="Controlled project files"
        [value]="files"
        [columns]="columns"
        [(expandedKeys)]="controlledExpanded"
      />
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
    
    .tree-table-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
    }
  `
})
export class TreeTableControlledControlledExpansionDemo {
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
  ];

  protected readonly controlledExpanded = signal<readonly string[]>(['workspace']);

  protected expandAll(): void {
    this.controlledExpanded.set(['workspace', 'source', 'assets']);
  }

  protected collapseAll(): void {
    this.controlledExpanded.set([]);
  }
}
```

### Single and multiple sorting

Sortable headers cycle through ascending, descending, and cleared state. Multiple mode composes sibling-level sorts without requiring a modifier key.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode, type AerisTreeTableSort } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-sorting-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo">
      <aeris-tree-table
        sortMode="multiple"
        ariaLabel="Sortable project files"
        [value]="files"
        [columns]="columns"
        [expandedKeys]="['workspace', 'source']"
        [(sorts)]="sorts"
      />
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableSortingSingleAndMultipleSortingDemo {
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
  ];

  protected readonly sorts = signal<readonly AerisTreeTableSort[]>([]);
}
```

### Global and column filtering

Search every filterable column or narrow individual fields. Enable gridlines when the entire column should be divided, including its filter cell. Path mode keeps matching rows and their ancestors.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableFilterEvent, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-filtering-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo tree-table-demo--stack">
      <aeris-tree-table
        globalFilter
        columnFilter
        ariaLabel="Filterable project files"
        [value]="files"
        [columns]="columns"
        [(globalFilterValue)]="globalQuery"
        [(columnFilters)]="columnFilters"
        (filtered)="handleFilter($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableFilteringGlobalAndColumnFilteringDemo {
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
  ];

  protected readonly globalQuery = signal('');
  protected readonly columnFilters = signal<Readonly<Record<string, string>>>({});

  protected handleFilter(event: AerisTreeTableFilterEvent<FileRecord>): void {
    this.eventText.set(`Showing ${event.value.length} matching root rows.`);
  }
}
```

### Single selection

Single mode keeps one selected row key and reports selection changes with the complete node.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode, type AerisTreeTableSelectionEvent } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-single-selection-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo tree-table-demo--stack">
      <aeris-tree-table
        selectionMode="single"
        ariaLabel="Single-select project files"
        [value]="files"
        [columns]="columns"
        [expandedKeys]="['workspace', 'source']"
        [(selectionKeys)]="singleSelection"
        (selectionChanged)="handleSelection($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableSingleSelectionSingleSelectionDemo {
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
  ];

  protected readonly singleSelection = signal<readonly string[]>(['readme']);

  protected handleSelection(event: AerisTreeTableSelectionEvent<FileRecord>): void {
    this.eventText.set(event.selected ? `Selected ${event.node.data.name}.` : `Cleared ${event.node.data.name}.`);
  }
}
```

### Multiple selection

Multiple mode toggles independent rows with selected-row styling and no checkbox controls.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-multiple-selection-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo">
      <aeris-tree-table
        selectionMode="multiple"
        ariaLabel="Multiple-select project files"
        [value]="files"
        [columns]="columns"
        [expandedKeys]="['workspace', 'source']"
        [(selectionKeys)]="multipleSelection"
      />
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableMultipleSelectionMultipleSelectionDemo {
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
  ];

  protected readonly multipleSelection = signal<readonly string[]>(['app', 'readme']);
}
```

### Checkbox selection

Checkbox mode cascades selection through descendants and exposes mixed state on partially selected branches.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-checkbox-selection-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo">
      <aeris-tree-table
        selectionMode="checkbox"
        ariaLabel="Checkbox project files"
        [value]="files"
        [columns]="columns"
        [expandedKeys]="['workspace', 'assets']"
        [(selectionKeys)]="checkboxSelection"
      />
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableCheckboxSelectionCheckboxSelectionDemo {
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
  ];

  protected readonly checkboxSelection = signal<readonly string[]>(['assets', 'logo', 'cover']);
}
```

### Pagination

Pagination counts root nodes while descendants remain attached to their parent page.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-pagination-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo">
      <aeris-tree-table
        paginator
        ariaLabel="Paginated project files"
        [rowsPerPageOptions]="[1, 2, 3]"
        [value]="files"
        [columns]="columns"
        [(first)]="pageFirst"
        [(rows)]="pageRows"
      />
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTablePaginationPaginationDemo {
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
  ];

  protected readonly pageFirst = signal(0);
  protected readonly pageRows = signal(2);
}
```

### Cell editing

Editable cells are visually indicated. Double-click one, press Enter or move focus to commit, and press Escape to cancel. Value updates are immutable.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableCellEditEvent, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-editing-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="tree-table-demo tree-table-demo--stack">
      <aeris-tree-table
        editable
        ariaLabel="Editable project files"
        [(value)]="editableFiles"
        [columns]="columns"
        [(expandedKeys)]="editableExpanded"
        (cellEdited)="handleEdit($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .tree-table-demo {
      width: 100%;
    }
    
    .tree-table-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-table-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeTableEditingCellEditingDemo {
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
  ];

  protected readonly editableFiles = signal<readonly AerisTreeTableNode<FileRecord>[]>(this.files);

  protected handleEdit(event: AerisTreeTableCellEditEvent<FileRecord>): void {
    this.eventText.set(`Updated ${event.node.data.name} / ${event.field} to ${event.value}.`);
  }
}
```

### Column resizing and reordering

Resize separators support pointer dragging and Arrow keys. Resizing adjusts the next column to keep the table width stable. Headers support drag reordering and Alt plus horizontal Arrow keys.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableColumnReorderEvent, type AerisTreeTableColumnResizeEvent, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-columns-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-columns.demo.html',
  styleUrl: './tree-table-columns.demo.scss'
})
export class TreeTableColumnsColumnResizingAndReorderingDemo {
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
  ];

  protected readonly managedColumns = signal<readonly AerisTreeTableColumn[]>(
    FILE_COLUMNS.map((column) => ({ ...column })),
  );

  protected handleResize(event: AerisTreeTableColumnResizeEvent): void {
    this.eventText.set(`Resized ${event.field} to ${event.width}.`);
  }

  protected handleReorder(event: AerisTreeTableColumnReorderEvent): void {
    this.eventText.set(`Moved ${event.field} to column ${event.toIndex + 1}.`);
  }
}
```

#### HTML

```html
<div class="tree-table-demo tree-table-demo--stack">
  <aeris-tree-table
    resizableColumns
    reorderableColumns
    showOverflowTooltip
    gridlines
    ariaLabel="Adjustable project columns"
    [value]="files"
    [(columns)]="managedColumns"
    [expandedKeys]="['workspace']"
    (columnResized)="handleResize($event)"
    (columnReordered)="handleReorder($event)"
  />
  <small aria-live="polite">{{ eventText() }}</small>
</div>
```

#### CSS

```css
.tree-table-demo {
  width: 100%;
}

.tree-table-demo--stack {
  display: grid;
  gap: 0.75rem;
}

.tree-table-demo small {
  color: var(--aeris-text-2);
  font-weight: 600;
}
```

### Scrolling, frozen columns, and responsive stacking

Frozen columns remain visible during horizontal scrolling. Stack mode replaces overflow with labeled cell rows on narrow screens.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-scrolling-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-scrolling.demo.html',
  styleUrl: './tree-table-scrolling.demo.scss'
})
export class TreeTableScrollingScrollingFrozenColumnsAndResponsiveStackingDemo {
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
  ];

  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
}
```

#### HTML

```html
<div class="tree-table-layouts">
  <section>
    <h3>Scrollable</h3>
    <aeris-tree-table
      scrollHeight="15rem"
      ariaLabel="Scrollable project files"
      [value]="files"
      [columns]="columns"
      [expandedKeys]="['workspace', 'source', 'assets']"
    />
  </section>
  <section>
    <h3>Responsive stack</h3>
    <aeris-tree-table
      responsiveMode="stack"
      ariaLabel="Responsive project files"
      [value]="files"
      [columns]="columns"
      [expandedKeys]="['workspace']"
    />
  </section>
</div>
```

#### CSS

```css
.tree-table-layouts,
.tree-table-states {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.tree-table-layouts section,
.tree-table-states section {
  min-width: 0;
}

.tree-table-layouts h3,
.tree-table-states h3 {
  margin: 0 0 0.625rem;
  font-size: 0.8125rem;
}

@media (max-width: 72rem) {
  .tree-table-layouts,
    .tree-table-states {
      grid-template-columns: 1fr;
    }
}
```

### Lazy loading

Lazy mode reports paging, sorting, and filtering state while branch expansion requests children independently.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableLazyLoadEvent, type AerisTreeTableNode, type AerisTreeTableNodeEvent } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-lazy-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-lazy.demo.html',
  styleUrl: './tree-table-lazy.demo.scss'
})
export class TreeTableLazyLazyLoadingDemo {
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
  ];

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
  }
}
```

#### HTML

```html
<div class="tree-table-demo tree-table-demo--stack">
  <aeris-tree-table
    lazy
    paginator
    [totalRecords]="100"
    ariaLabel="Remote project files"
    [(value)]="lazyRows"
    [columns]="columns"
    [loadingKeys]="lazyLoadingKeys()"
    [(expandedKeys)]="lazyExpanded"
    [(first)]="lazyFirst"
    [(rows)]="lazyPageRows"
    (lazyLoad)="handleLazyLoad($event)"
    (nodeExpanded)="handleLazyExpand($event)"
  />
  <small aria-live="polite">{{ eventText() }}</small>
</div>
```

#### CSS

```css
.tree-table-demo {
  width: 100%;
}

.tree-table-demo--stack {
  display: grid;
  gap: 0.75rem;
}

.tree-table-demo small {
  color: var(--aeris-text-2);
  font-weight: 600;
}
```

### Header and cell templates

Typed templates customize content while Aeris retains treegrid structure, sorting, hierarchy, and responsive labels.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-templates-demo',
  imports: [AerisBadgeModule, AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-templates.demo.html',
  styleUrl: './tree-table-templates.demo.scss'
})
export class TreeTableTemplatesHeaderAndCellTemplatesDemo {
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
  ];

  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
}
```

#### HTML

```html
<aeris-tree-table
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
</aeris-tree-table>
```

#### CSS

```css
.column-heading[data-sorted] { color: var(--primary-text); }
```

### States

Loading and empty states stay inside the named treegrid and expose polite status text.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-states-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-states.demo.html',
  styleUrl: './tree-table-states.demo.scss'
})
export class TreeTableStatesStatesDemo {
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
  ];

  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
}
```

#### HTML

```html
<div class="tree-table-states">
  <section>
    <h3>Loading</h3>
    <aeris-tree-table
      loading
      ariaLabel="Loading project files"
      [value]="files"
      [columns]="columns"
    />
  </section>
  <section>
    <h3>Empty</h3>
    <aeris-tree-table
      ariaLabel="Empty project files"
      [value]="[]"
      [columns]="columns"
    />
  </section>
</div>
```

#### CSS

```css
.tree-table-layouts,
.tree-table-states {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.tree-table-layouts section,
.tree-table-states section {
  min-width: 0;
}

.tree-table-layouts h3,
.tree-table-states h3 {
  margin: 0 0 0.625rem;
  font-size: 0.8125rem;
}

@media (max-width: 72rem) {
  .tree-table-layouts,
    .tree-table-states {
      grid-template-columns: 1fr;
    }
}
```

## Accessibility

- The native table uses treegrid semantics. Rows expose hierarchy level, sibling position, set size, expanded state, selected state, disabled state, and busy state.
- Only one visible row participates in the tab order. Arrow keys move through the visible hierarchy without changing source order.
- Sortable headers are native buttons and expose aria-sort. Resize separators are named and keyboard adjustable.
- Checkbox mode uses native checkboxes with checked and mixed states. Single and multiple modes use row selection without checkbox visuals.
- Scrollable viewports are keyboard focusable. Frozen columns retain native header and cell semantics, and stack mode keeps visible column labels.
- Editing uses a named native text input. Enter commits, Escape cancels, blur commits, and focus returns to the row.
- When showOverflowTooltip is enabled, truncated headers and cells use Aeris Tooltip to reveal their complete value.
- Loading, empty, and no-results states use polite status regions. The integrated paginator supplies its own navigation semantics.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through filters, sortable headers, resize separators, the active row, cell editor, and pagination. |
| `ArrowDown / ArrowUp` | Moves focus to the next or previous visible row. |
| `ArrowRight` | Expands a collapsed branch, then moves to its first child. |
| `ArrowLeft` | Collapses an expanded branch, otherwise moves to its parent. |
| `Home / End` | Moves to the first or last visible row. |
| `Enter / Space` | Toggles row selection when enabled; otherwise toggles branch expansion. |
| `Ctrl / Cmd + A` | Selects all visible selectable rows in multiple mode. |
| `Printable characters` | Moves to the next visible row whose tree-column value starts with the typed characters. |
| `Enter / Space on a sortable header` | Cycles that column sort state. |
| `Alt + ArrowLeft / ArrowRight on a header` | Reorders the column when enabled. |
| `ArrowLeft / ArrowRight on a resize separator` | Decreases or increases the column width by 16 pixels while the next column absorbs the inverse change. |
| `Enter / Escape while editing` | Commits or cancels the active cell edit. |
