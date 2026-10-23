# TreeTable

> Hierarchical tabular data with expansion, filtering, custom editors, pagination, lazy loading, and branch and column pinning.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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
| `stickyHeader` | `boolean` | `true` | Keeps header and filter rows at measured offsets while the table viewport scrolls vertically. False disables vertical header pinning. Oversized headers scroll normally to keep data accessible. |
| `pinnedRows` | `AerisTablePinnedRows (model)` | `{ top: [], bottom: [] }` | Loaded root keys to pin at top/bottom of the current filtered root page. Expanded descendants stay with their pinned root. Child and missing keys are ignored; top wins duplicates. Sorting order within groups is preserved. Oversized pinned regions revert to normal scrolling. Pinning never fetches unloaded data. |
| `sortIconTemplate` | `TemplateRef&lt;AerisTreeTableSortIconContext&gt; &#124; undefined` | `undefined` | Artwork for sortable headers. Context: $implicit is the column; direction is asc, desc, or null. Header buttons retain sorting and aria-sort. |
| `loadingIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the loading icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `toggleIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the toggle icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `paginatorDropdownAppendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `global config or 'self'` | Forwards the mounting target to the paginator rows-per-page menu. |
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
| `propagateSelection` | `boolean` | `true` | Cascades checkbox state through loaded selectable nodes in the rendered branch, including the parent. Path filtering can restrict that branch to matching descendants; unloaded children cannot be selected. |
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
| `editable` | `boolean` | `false` | Default editing permission. Columns override it; cellEditable has final priority. Disabled nodes remain non-editable. |
| `cellEditable` | `AerisTreeTableCellEditable&lt;TData&gt; &#124; undefined` | `undefined` | Pure (data, column, node) callback: true allows editing, false prevents it, undefined inherits column.editable then table editable. Supports row-wide and cell rules. Disabled nodes cannot be overridden. Permission revocation cancels the draft. |
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
| `selectionKeys` | `readonly string[]` | `[]` | Controlled selected node keys, retained across filters, collapsed branches, and root pages. With checkbox propagation, keys can include both parent folders and descendants; the length is not necessarily a leaf-file count. |
| `sorts` | `readonly AerisTreeTableSort[]` | `[]` | Ordered sort definitions. |
| `globalFilterValue` | `string` | `''` | Global search value. |
| `columnFilters` | `Readonly&lt;Record&lt;string, string&gt;&gt;` | `{}` | Filter values keyed by column field. |
| `first` | `number` | `0` | First root-row index. |
| `rows` | `number` | `10` | Root rows per page. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pinnedRowsChange` | `AerisTablePinnedRows` | `—` | Emits when the component model is changed programmatically. Bind [(pinnedRows)] for controlled pin state; normal view reordering never mutates it. |
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
| `aerisTreeTableCell` | `AerisTreeTableCellContext&lt;TData&gt;` | `Formatted field value` | Custom body content outside editing. Use aerisTreeTableEditor to replace the editing view. |
| `aerisTreeTableEditor` | `AerisTreeTableEditorContext&lt;TData&gt;` | `Named text input` | Custom editing view with editor ($implicit), node, data, key, column and rowIndex. Included in AerisTreeTableModule. |
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

### TreeTable custom editor state

| Member | Type | Behavior |
| --- | --- | --- |
| value | WritableSignal&lt;unknown&gt; | Draft value. Replace it with value.set(next); preserve number, boolean, Date, array, object, or null types. |
| originalValue | unknown | Value at edit start. Treat objects and dates as immutable; no deep cloning is performed. |
| valid | WritableSignal&lt;boolean&gt; | Whether the draft may commit. Defaults to true. Update this from your form validation; invalid drafts stay open on blur and are discarded when switching cells. |
| ariaLabel | string | Default accessible name: Edit followed by the column header. Bind it to your editor control. |
| commit(event?) | (event?: Event) =&gt; void | Saves a valid draft and finishes editing. Also runs automatically when focus or a pointer leaves the owned editor, or on an unconsumed Enter outside multiline fields. |
| cancel(event?) | (event?: Event) =&gt; void | Discards the draft and finishes editing. Escape also cancels unless a child control consumes it or has an open picker. |

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

interface AerisTreeTableEditorContext<TData extends AerisTreeTableData> {
  readonly $implicit: AerisCellEditor;
  readonly editor: AerisCellEditor;
  readonly node: AerisTreeTableNode<TData>;
  readonly data: TData;
  readonly key: string;
  readonly column: AerisTreeTableColumn;
  readonly rowIndex: number;
}
```

### Interfaces

```ts
type AerisTreeTableData = Readonly<Record<string, unknown>>;
type AerisTableColumnPin = 'start' | 'end';
interface AerisTablePinnedRows {
  readonly top: readonly string[];
  readonly bottom: readonly string[];
}
type AerisTreeTableSize = 'sm' | 'md' | 'lg';
type AerisTreeTableSelectionMode = 'single' | 'multiple' | 'checkbox';
type AerisTreeTableSortDirection = 'asc' | 'desc';
type AerisTreeTableSortMode = 'single' | 'multiple';
type AerisTreeTableFilterStrategy = 'subtree' | 'path';
type AerisTreeTableResponsiveMode = 'scroll' | 'stack';
type AerisTreeTableCellEditable<TData extends AerisTreeTableData = AerisTreeTableData> = (
  data: TData, column: AerisTreeTableColumn, node: AerisTreeTableNode<TData>,
) => boolean | undefined;

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
  readonly pinned?: AerisTableColumnPin;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
}

interface AerisTreeTableSortIconContext {
  readonly $implicit: AerisTreeTableColumn;
  readonly direction: AerisTreeTableSortDirection | null;
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
| `--aeris-tree-table-indent` | `CSS custom property` | — | Indent per hierarchy level. |
| `--aeris-tree-table-toggle-size` | `CSS custom property` | — | Branch disclosure button size. |
| `--aeris-tree-table-stripe` | `CSS custom property` | — | Alternate row surface. |
| `--aeris-tree-table-row-hover` | `CSS custom property` | — | Hover and focused row surface. |
| `--aeris-tree-table-row-selected` | `CSS custom property` | — | Selected row surface. |

## Examples

### Basic

Dynamic columns render hierarchical records while expandedKeys controls which descendants are visible.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { type AerisBadgeSeverity } from '@aeris-ui/core/badge';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableBasicDemo {
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);


  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableControlledDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode, type AerisTreeTableSort } from '@aeris-ui/core/tree-table';

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
export class TreeTableSortingDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableFilterEvent, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableFilteringDemo {
  protected readonly eventText = signal('No TreeTable event yet.');


  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode, type AerisTreeTableSelectionEvent } from '@aeris-ui/core/tree-table';

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
export class TreeTableSingleSelectionDemo {
  protected readonly eventText = signal('No TreeTable event yet.');


  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableMultipleSelectionDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableCheckboxSelectionDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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

### Selection workflow

Select files across root pages and collapsed branches, then remove them together. A column menu controls visible fields without introducing another selection store.

#### TS

```ts
import { Component, DestroyRef, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode, type AerisTreeTableSort } from '@aeris-ui/core/tree-table';

const SELECTION_FILES: readonly AerisTreeTableNode[] = [
  {
    key: 'design-files',
    data: { name: 'Design', type: 'Folder', owner: 'Maya' },
    selectable: false,
    children: [
      { key: 'brief', data: { name: 'Brief.md', type: 'Document', owner: 'Maya' }, leaf: true },
      { key: 'palette', data: { name: 'Palette.json', type: 'JSON', owner: 'Ava' }, leaf: true },
    ],
  },
  {
    key: 'engineering-files',
    data: { name: 'Engineering', type: 'Folder', owner: 'Noah' },
    selectable: false,
    children: [
      {
        key: 'component',
        data: { name: 'Component.ts', type: 'TypeScript', owner: 'Noah' },
        leaf: true,
      },
      {
        key: 'spec',
        data: { name: 'Component.spec.ts', type: 'TypeScript', owner: 'Liam' },
        leaf: true,
      },
    ],
  },
  {
    key: 'release-notes',
    data: { name: 'Release notes.md', type: 'Document', owner: 'Sofia' },
    leaf: true,
  },
];

const FILE_COLUMNS: readonly AerisTreeTableColumn[] = [
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    filterable: true,
    pinned: 'start',
    width: '15rem',
  },
  {
    field: 'size',
    header: 'Size (KB)',
    sortable: true,
    filterable: true,
    align: 'end',
    width: '8rem',
  },
  { field: 'type', header: 'Type', sortable: true, filterable: true, width: '9rem' },
  { field: 'modified', header: 'Modified', sortable: true, filterable: true, width: '10rem' },
];

type FileRecord = AerisTreeTableData & {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly modified: string;
  readonly status: 'active' | 'review' | 'archived';
};

@Component({
  selector: 'app-tree-table-selection-workflow-demo',
  imports: [AerisButton, AerisMenuModule, AerisToolbarModule, AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-selection-workflow.demo.html',
  styleUrl: './tree-table-selection-workflow.demo.scss'
})
export class TreeTableSelectionWorkflowDemo {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly files = this.createFiles();

  protected readonly columns = FILE_COLUMNS;

  protected readonly sorts = signal<readonly AerisTreeTableSort[]>([]);

  protected readonly workflowFiles = signal(SELECTION_FILES);

  protected readonly workflowFocusTarget = viewChild('workflowColumnsButton', {
      read: ElementRef<HTMLButtonElement>,
    });

  protected readonly workflowSelection = signal<readonly string[]>([]);

  protected readonly workflowExpanded = signal<readonly string[]>([
      'design-files',
      'engineering-files',
    ]);

  protected readonly workflowFirst = signal(0);

  protected readonly workflowQuery = signal('');

  protected readonly workflowBusy = signal(false);

  protected readonly workflowStatus = signal(
      'Select files across root pages. Folders are not selectable.',
    );

  protected readonly workflowSorts = signal<readonly AerisTreeTableSort[]>([]);

  protected readonly workflowFilters = signal<Readonly<Record<string, string>>>({});

  protected readonly workflowHidden = signal<readonly string[]>([]);

  protected readonly workflowAllColumns = signal<readonly AerisTreeTableColumn[]>([
      { field: 'name', header: 'Name', sortable: true },
      { field: 'type', header: 'Type', sortable: true },
      { field: 'owner', header: 'Owner', sortable: true },
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
      this.workflowSorts.update((sorts) => sorts.filter((sort) => sort.field !== field));
      this.workflowFirst.set(0);
    }

  protected orderWorkflowColumns(columns: readonly AerisTreeTableColumn[]): void {
      let index = 0;
      this.workflowAllColumns.update((all) =>
        all.map((column) =>
          this.workflowHidden().includes(column.field) ? column : (columns[index++] ?? column),
        ),
      );
    }

  protected clearWorkflowSelection(fallback?: HTMLButtonElement): void {
      this.workflowSelection.set([]);
      this.workflowStatus.set('Selection cleared across every root page and collapsed branch.');
      fallback?.focus();
    }

  protected async removeWorkflowFiles(fallback?: HTMLButtonElement): Promise<void> {
      if (this.workflowBusy() || !this.workflowSelection().length) return;
      const keys = new Set(this.workflowSelection());
      this.workflowBusy.set(true);
      this.workflowStatus.set(`Removing ${keys.size} selected files…`);
      // Replace this delay with your application's API request; update nodes only on success.
      await new Promise<void>((resolve) => setTimeout(resolve, 300));
      if (this.destroyRef.destroyed) return;
      this.workflowFiles.update((nodes) => this.removeWorkflowNodes(nodes, keys));
      this.workflowSelection.set([]);
      this.workflowFirst.set(0);
      this.workflowBusy.set(false);
      this.workflowStatus.set(
        `Removed ${keys.size} files. Selection cleared; focus returned to Columns.`,
      );
      fallback?.focus();
    }

  private removeWorkflowNodes(
      nodes: readonly AerisTreeTableNode[],
      keys: ReadonlySet<string>,
    ): readonly AerisTreeTableNode[] {
      return nodes
        .filter((node) => !keys.has(node.key))
        .map((node) =>
          node.children ? { ...node, children: this.removeWorkflowNodes(node.children, keys) } : node,
        );
    }

  protected restoreWorkflowFiles(): void {
      if (this.workflowBusy()) return;
      this.workflowFiles.set(SELECTION_FILES);
      this.workflowSelection.set([]);
      this.workflowFirst.set(0);
      this.workflowQuery.set('');
      this.workflowFilters.set({});
      this.workflowSorts.set([]);
      this.workflowExpanded.set(['design-files', 'engineering-files']);
      this.workflowStatus.set('Example files restored.');
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
```

#### HTML

```html
<div class="selection-workflow">
  <aeris-toolbar fluid wrap variant="plain" role="group" ariaLabel="File bulk actions">
    <span aerisToolbarStart aria-live="polite">
      {{ workflowSelection().length }} files selected across all root pages
    </span>
    <div aerisToolbarEnd>
      <button
        aerisButton
        type="button"
        variant="ghost"
        [disabled]="!workflowSelection().length || workflowBusy()"
        (click)="clearWorkflowSelection(workflowFocusTarget()?.nativeElement)"
      >
        Clear selection
      </button>
      <button
        aerisButton
        type="button"
        severity="danger"
        [disabled]="!workflowSelection().length || workflowBusy()"
        [loading]="workflowBusy()"
        (click)="removeWorkflowFiles(workflowFocusTarget()?.nativeElement)"
      >
        Remove selected files
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
        (click)="restoreWorkflowFiles()"
      >
        Restore files
      </button>
    </div>
  </aeris-toolbar>
  <aeris-menu
    #workflowMenu
    popup
    [model]="workflowColumnItems()"
    ariaLabel="File columns"
  />
  <aeris-tree-table
    ariaLabel="File selection workspace"
    [value]="workflowFiles()"
    [columns]="workflowColumns()"
    (columnsChange)="orderWorkflowColumns($event)"
    [(selectionKeys)]="workflowSelection"
    [(globalFilterValue)]="workflowQuery"
    [(expandedKeys)]="workflowExpanded"
    [(first)]="workflowFirst"
    [(sorts)]="workflowSorts"
    [(columnFilters)]="workflowFilters"
    selectionMode="checkbox"
    [propagateSelection]="false"
    paginator
    [rows]="1"
    globalFilter
    columnFilter
    reorderableColumns
    globalFilterLabel="Find files"
    globalFilterPlaceholder="Search visible columns"
    [loading]="workflowBusy()"
    loadingMessage="Removing files"
    emptyMessage="No files remain. Restore the example data."
    emptyFilterMessage="No matching files. Clear the search and column filters."
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

### Pagination

Pagination counts root nodes while descendants remain attached to their parent page.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTablePaginationDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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

Editable cells use a built-in text input and are visually indicated. Double-click one, press Enter or move focus to commit, and press Escape to cancel. Value updates are immutable.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableCellEditEvent, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

const FILE_COLUMNS: readonly AerisTreeTableColumn[] = [
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    filterable: true,
    pinned: 'start',
    width: '15rem',
  },
  {
    field: 'size',
    header: 'Size (KB)',
    sortable: true,
    filterable: true,
    align: 'end',
    width: '8rem',
  },
  { field: 'type', header: 'Type', sortable: true, filterable: true, width: '9rem' },
  { field: 'modified', header: 'Modified', sortable: true, filterable: true, width: '10rem' },
];

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
        [columns]="editingColumns"
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
export class TreeTableEditingDemo {
  protected readonly editingColumns: readonly AerisTreeTableColumn[] = FILE_COLUMNS.map(
      (column) => ({
        ...column,
        editable: column.field === 'size',
      }),
    );

  protected readonly editableExpanded = signal<readonly string[]>(['workspace', 'source']);

  protected readonly eventText = signal('No TreeTable event yet.');


  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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

### Editing permissions

Name inherits the table default. Team opts in at column level. Status opts out. The cell predicate locks Noah's entire row and Sofia's Team cell. Toggle the default to see which cells inherit it.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableCellEditable, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-tree-table-editing-permissions-demo',
  imports: [AerisButton, AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-editing-permissions.demo.html',
  styleUrl: './tree-table-editing-permissions.demo.scss'
})
export class TreeTableEditingPermissionsDemo {
  protected readonly permissionDefault = signal(true);

  protected readonly permissionColumns: readonly AerisTreeTableColumn[] = [
      { field: 'name', header: 'Name', width: '40%' },
      { field: 'team', header: 'Team', editable: true, width: '30%' },
      { field: 'status', header: 'Status', editable: false, width: '30%' },
    ];

  protected readonly permissionNodes = signal<readonly AerisTreeTableNode[]>([
      { key: 'one', data: { name: 'Maya', team: 'Design', status: 'Active' } },
      { key: 'two', data: { name: 'Noah', team: 'Engineering', status: 'Archived' } },
      { key: 'three', data: { name: 'Sofia', team: 'Research', status: 'Active' } },
    ]);

  protected readonly canEditCell: AerisTreeTableCellEditable = (data, column, node) =>
      data['status'] === 'Archived' || (node.key === 'three' && column.field === 'team')
        ? false
        : undefined;
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
  <aeris-tree-table
    ariaLabel="Editing permissions"
    [(value)]="permissionNodes"
    [columns]="permissionColumns"
    [editable]="permissionDefault()"
    [cellEditable]="canEditCell"
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
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-tree-table-custom-editors-demo',
  imports: [AerisDatePicker, AerisInputNumber, AerisInputText, AerisSelect, AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-custom-editors.demo.html',
  styleUrl: './tree-table-custom-editors.demo.scss'
})
export class TreeTableCustomEditorsDemo {
  protected readonly isDate = (value: unknown): value is Date => value instanceof Date;

  protected readonly customEditorColumns: readonly AerisTreeTableColumn[] = [
      { field: 'name', header: 'Name', editable: true, width: '30%' },
      { field: 'quantity', header: 'Quantity', editable: true, width: '20%' },
      { field: 'status', header: 'Status', editable: true, width: '25%' },
      { field: 'date', header: 'Date', editable: true, width: '25%' },
    ];

  protected readonly customEditorNodes = signal<readonly AerisTreeTableNode[]>([
      {
        key: 'docs',
        data: { name: 'Documentation', quantity: 2, status: 'draft', date: new Date(2026, 9, 21) },
        children: [
          {
            key: 'api',
            data: {
              name: 'API reference',
              quantity: 5,
              status: 'published',
              date: new Date(2026, 9, 22),
            },
          },
        ],
      },
    ]);

  protected readonly editorStatuses = [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ];

  protected readonly editorResult = signal('Double-click a cell or focus it and press F2 to edit.');

  protected readonly editorExpanded = ['docs'];
}
```

#### HTML

```html
<div class="custom-editor-demo">
  <aeris-tree-table
    ariaLabel="Custom editor files"
    [(value)]="customEditorNodes"
    [expandedKeys]="editorExpanded"
    [columns]="customEditorColumns"
    editable
    (cellEdited)="editorResult.set('Saved ' + $event.field + '.')"
    (editCancelled)="editorResult.set('Edit cancelled.')"
  >
    <ng-template aerisTreeTableEditor let-editor let-column="column">
      @let draft = editor.value();
      <div class="custom-cell-editor">
        @switch (column.field) {
          @case ('quantity') {
            <aeris-input-number
              [ariaLabel]="editor.ariaLabel"
              [value]="typeof draft === 'number' ? draft : null"
              (valueChange)="
                editor.value.set($event); editor.valid.set($event !== null && $event >= 0)
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
  </aeris-tree-table>
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

### Column resizing and reordering

Resize separators support pointer dragging and Arrow keys. Resizing adjusts the next column to keep the table width stable. Headers support drag reordering and Alt plus horizontal Arrow keys.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableColumnReorderEvent, type AerisTreeTableColumnResizeEvent, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

const FILE_COLUMNS: readonly AerisTreeTableColumn[] = [
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    filterable: true,
    pinned: 'start',
    width: '15rem',
  },
  {
    field: 'size',
    header: 'Size (KB)',
    sortable: true,
    filterable: true,
    align: 'end',
    width: '8rem',
  },
  { field: 'type', header: 'Type', sortable: true, filterable: true, width: '9rem' },
  { field: 'modified', header: 'Modified', sortable: true, filterable: true, width: '10rem' },
];

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
export class TreeTableColumnsDemo {
  protected readonly eventText = signal('No TreeTable event yet.');


  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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

### Sticky headers

Headers and filters stay aligned at measured offsets. Toggle stickyHeader to let both scroll normally.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-tree-table-sticky-headers-demo',
  imports: [AerisButton, AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-sticky-headers.demo.html',
  styleUrl: './tree-table-sticky-headers.demo.scss'
})
export class TreeTableStickyHeadersDemo {
  protected readonly pinHeaders = signal(true);

  protected readonly pinningNodes = signal<readonly AerisTreeTableNode[]>(
      Array.from({ length: 24 }, (_, index) => ({
        key: `pin-${index + 1}`,
        data: {
          name: `Record ${index + 1}`,
          team: index % 2 ? 'Engineering' : 'Design',
          details: `Milestone ${index + 1}: review the latest updates with the team.`,
          status: index % 3 ? 'Active' : 'Review',
        },
        ...(index === 2
          ? {
              children: [
                {
                  key: 'pin-3-a',
                  data: {
                    name: 'Draft',
                    team: 'Design',
                    details: 'Prepare the milestone.',
                    status: 'Review',
                  },
                },
                {
                  key: 'pin-3-b',
                  data: {
                    name: 'Approval',
                    team: 'Engineering',
                    details: 'Confirm the milestone.',
                    status: 'Active',
                  },
                },
              ],
            }
          : {}),
      })),
    );

  protected readonly pinningPlainColumns: readonly AerisTreeTableColumn[] = [
      { field: 'name', header: 'Name', width: '45%', sortable: true },
      { field: 'team', header: 'Team', width: '30%' },
      { field: 'status', header: 'Status', width: '25%' },
    ];
}
```

#### HTML

```html
<div class="custom-editor-demo">
  <button
    aerisButton
    variant="outline"
    [attr.aria-pressed]="pinHeaders()"
    (click)="pinHeaders.set(!pinHeaders())"
  >
    Sticky headers: {{ pinHeaders() ? 'on' : 'off' }}
  </button>
  <aeris-tree-table
    ariaLabel="Sticky headers and filters"
    [value]="pinningNodes()"
    [columns]="pinningPlainColumns"
    scrollable
    scrollHeight="22rem"
    columnFilter
    [stickyHeader]="pinHeaders()"
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

### Pinned columns

Name stays at the logical start and Status at the end. Both sides follow RTL automatically. Scroll horizontally; if pinned columns leave less than 44px for normal content, they scroll normally instead.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-tree-table-pinned-columns-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  template: `
    <div class="custom-editor-demo">
      <aeris-tree-table
        ariaLabel="Start and end columns"
        [value]="pinningNodes()"
        [columns]="pinnedColumns()"
        scrollable
        scrollHeight="22rem"
      />
    </div>
  `,
  styles: `
    .custom-editor-demo,
    .custom-cell-editor {
      display: grid;
      min-inline-size: 0;
      inline-size: 100%;
      gap: 0.75rem;
    }
  `
})
export class TreeTablePinnedColumnsDemo {
  protected readonly pinningNodes = signal<readonly AerisTreeTableNode[]>(
      Array.from({ length: 24 }, (_, index) => ({
        key: `pin-${index + 1}`,
        data: {
          name: `Record ${index + 1}`,
          team: index % 2 ? 'Engineering' : 'Design',
          details: `Milestone ${index + 1}: review the latest updates with the team.`,
          status: index % 3 ? 'Active' : 'Review',
        },
        ...(index === 2
          ? {
              children: [
                {
                  key: 'pin-3-a',
                  data: {
                    name: 'Draft',
                    team: 'Design',
                    details: 'Prepare the milestone.',
                    status: 'Review',
                  },
                },
                {
                  key: 'pin-3-b',
                  data: {
                    name: 'Approval',
                    team: 'Engineering',
                    details: 'Confirm the milestone.',
                    status: 'Active',
                  },
                },
              ],
            }
          : {}),
      })),
    );

  protected readonly pinnedColumns = signal<readonly AerisTreeTableColumn[]>([
      { field: 'name', header: 'Name', width: '12rem', pinned: 'start', sortable: true },
      { field: 'team', header: 'Team', width: '12rem' },
      { field: 'details', header: 'Details', width: '24rem' },
      { field: 'status', header: 'Status', width: '10rem', pinned: 'end' },
    ]);
}
```

### Pinned rows

Root Record 3 and its expanded descendants stay together at the top; Record 18 stays at the bottom. Only root keys can be pinned. Expand or collapse the pinned branch; if pinned rows become too tall, they scroll normally instead.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { type AerisTablePinnedRows } from '@aeris-ui/core/table';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-tree-table-pinned-rows-demo',
  imports: [AerisButton, AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-pinned-rows.demo.html',
  styleUrl: './tree-table-pinned-rows.demo.scss'
})
export class TreeTablePinnedRowsDemo {
  protected readonly defaultPinRows: AerisTablePinnedRows = { top: ['pin-3'], bottom: ['pin-18'] };

  protected readonly pinRows = signal<AerisTablePinnedRows>(this.defaultPinRows);

  protected readonly pinningNodes = signal<readonly AerisTreeTableNode[]>(
      Array.from({ length: 24 }, (_, index) => ({
        key: `pin-${index + 1}`,
        data: {
          name: `Record ${index + 1}`,
          team: index % 2 ? 'Engineering' : 'Design',
          details: `Milestone ${index + 1}: review the latest updates with the team.`,
          status: index % 3 ? 'Active' : 'Review',
        },
        ...(index === 2
          ? {
              children: [
                {
                  key: 'pin-3-a',
                  data: {
                    name: 'Draft',
                    team: 'Design',
                    details: 'Prepare the milestone.',
                    status: 'Review',
                  },
                },
                {
                  key: 'pin-3-b',
                  data: {
                    name: 'Approval',
                    team: 'Engineering',
                    details: 'Confirm the milestone.',
                    status: 'Active',
                  },
                },
              ],
            }
          : {}),
      })),
    );

  protected readonly pinningExpanded = signal<readonly string[]>(['pin-3']);

  protected readonly pinningPlainColumns: readonly AerisTreeTableColumn[] = [
      { field: 'name', header: 'Name', width: '45%', sortable: true },
      { field: 'team', header: 'Team', width: '30%' },
      { field: 'status', header: 'Status', width: '25%' },
    ];
}
```

#### HTML

```html
<div class="custom-editor-demo">
  <button
    aerisButton
    variant="outline"
    [attr.aria-pressed]="pinRows().top.length > 0"
    (click)="pinRows.set(pinRows().top.length ? { top: [], bottom: [] } : defaultPinRows)"
  >
    {{ pinRows().top.length ? 'Unpin rows' : 'Pin rows' }}
  </button>
  <aeris-tree-table
    ariaLabel="Top and bottom rows"
    [value]="pinningNodes()"
    [columns]="pinningPlainColumns"
    scrollable
    scrollHeight="26rem"
    [(pinnedRows)]="pinRows"
    [(expandedKeys)]="pinningExpanded"
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

### Combined pinning

Pinned branches and columns meet without content showing through. Try sorting, filtering, resizing or editing a cell. Columns reorder within their pin group. Root pagination and lazy data remain authoritative.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { type AerisTablePinnedRows } from '@aeris-ui/core/table';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

@Component({
  selector: 'app-tree-table-combined-pinning-demo',
  imports: [AerisTreeModule, AerisTreeTableModule],
  templateUrl: './tree-table-combined-pinning.demo.html',
  styleUrl: './tree-table-combined-pinning.demo.scss'
})
export class TreeTableCombinedPinningDemo {
  protected readonly defaultPinRows: AerisTablePinnedRows = { top: ['pin-3'], bottom: ['pin-18'] };

  protected readonly pinningNodes = signal<readonly AerisTreeTableNode[]>(
      Array.from({ length: 24 }, (_, index) => ({
        key: `pin-${index + 1}`,
        data: {
          name: `Record ${index + 1}`,
          team: index % 2 ? 'Engineering' : 'Design',
          details: `Milestone ${index + 1}: review the latest updates with the team.`,
          status: index % 3 ? 'Active' : 'Review',
        },
        ...(index === 2
          ? {
              children: [
                {
                  key: 'pin-3-a',
                  data: {
                    name: 'Draft',
                    team: 'Design',
                    details: 'Prepare the milestone.',
                    status: 'Review',
                  },
                },
                {
                  key: 'pin-3-b',
                  data: {
                    name: 'Approval',
                    team: 'Engineering',
                    details: 'Confirm the milestone.',
                    status: 'Active',
                  },
                },
              ],
            }
          : {}),
      })),
    );

  protected readonly pinningExpanded = signal<readonly string[]>(['pin-3']);

  protected readonly pinnedColumns = signal<readonly AerisTreeTableColumn[]>([
      { field: 'name', header: 'Name', width: '12rem', pinned: 'start', sortable: true },
      { field: 'team', header: 'Team', width: '12rem' },
      { field: 'details', header: 'Details', width: '24rem' },
      { field: 'status', header: 'Status', width: '10rem', pinned: 'end' },
    ]);
}
```

#### HTML

```html
<div class="custom-editor-demo">
  <aeris-tree-table
    ariaLabel="Combined pinning"
    striped
    [(value)]="pinningNodes"
    [(columns)]="pinnedColumns"
    [pinnedRows]="defaultPinRows"
    [(expandedKeys)]="pinningExpanded"
    scrollable
    scrollHeight="26rem"
    columnFilter
    resizableColumns
    reorderableColumns
    editable
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

### Scrolling, frozen columns, and responsive stacking

Frozen columns remain visible during horizontal scrolling. Stack mode replaces overflow with labeled cell rows on narrow screens.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableScrollingDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableLazyLoadEvent, type AerisTreeTableNode, type AerisTreeTableNodeEvent } from '@aeris-ui/core/tree-table';

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
export class TreeTableLazyDemo {
  protected readonly lazyExpanded = signal<readonly string[]>([]);

  protected readonly lazyFirst = signal(0);

  protected readonly lazyPageRows = signal(5);

  protected readonly eventText = signal('No TreeTable event yet.');


  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
    this.eventText.set(
      'Requested roots ' + (event.first + 1) + '–' + (event.first + event.rows) + '.',
    );
  }

  protected handleLazyExpand(event: AerisTreeTableNodeEvent<FileRecord>): void {
    if (event.node.children || event.node.leaf !== false) return;
    this.lazyLoadingKeys.set([event.key]);
    globalThis.setTimeout(() => {
      const children: readonly AerisTreeTableNode<FileRecord>[] = [
        {
          key: event.key + '-source',
          data: { name: 'Remote source', size: 12, type: 'folder', modified: 'Today', status: 'active' },
          leaf: true,
        },
        {
          key: event.key + '-readme',
          data: { name: 'REMOTE.md', size: 4, type: 'document', modified: 'Today', status: 'review' },
          leaf: true,
        },
      ];
      this.lazyRows.update((nodes) => nodes.map((node) =>
        node.key === event.key ? { ...node, children } : node,
      ));
      this.lazyLoadingKeys.set([]);
    }, 500);
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
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableTemplatesDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
.column-heading[data-sorted] { color: var(--aeris-primary-text); }
```

### States

Loading and empty states stay inside the named treegrid and expose polite status text.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeTableModule, type AerisTreeTableColumn, type AerisTreeTableData, type AerisTreeTableNode } from '@aeris-ui/core/tree-table';

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
export class TreeTableStatesDemo {
  protected readonly columns: readonly AerisTreeTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true, filterable: true, pinned: 'start', width: '15rem' },
    { field: 'size', header: 'Size (KB)', sortable: true, filterable: true, align: 'end', width: '8rem' },
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
    <aeris-tree-table ariaLabel="Empty project files" [value]="[]" [columns]="columns" />
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
- Editing uses a named native text input. Enter commits, Escape cancels, blur commits, and focus returns to the cell after keyboard completion. Custom editors commit valid drafts when you leave them or press an unconsumed Enter outside multiline fields. Nested pickers keep their own keyboard behavior and remain part of the editor when portaled.
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
| `Enter / F2 on an editable cell` | Starts editing and focuses its first available control. |
| `Enter in the built-in editor` | Commits a valid draft. Custom editors also commit on an unconsumed Enter outside multiline fields; child controls may handle the key first. |
| `Escape while editing` | Cancels the edit unless a nested control consumes Escape or has an open picker to dismiss first. |
