import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { AerisPaginator, type AerisPaginatorPageEvent } from '@aeris-ui/core/paginator';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisContextMenu, AerisContextMenuItemTemplate } from '@aeris-ui/core/context-menu';
import { AerisTooltip } from '@aeris-ui/core/tooltip';
import {
  aerisInternalApplyMeasuredColumnWidths,
  aerisInternalClampColumnResizeDelta,
  aerisInternalColumnResizeDirection,
  aerisInternalColumnWidthPixels,
  aerisInternalListenForColumnResize,
  aerisInternalMeasureColumnWidths,
  aerisInternalPixelWidth,
  aerisInternalSetColumnPairWidths,
} from '@aeris-ui/core';

export type AerisTableSize = 'sm' | 'md' | 'lg';
export type AerisTableSortDirection = 'asc' | 'desc';
export type AerisTableSelectionMode = 'single' | 'multiple';
export type AerisTableSelectionControl = 'row' | 'control';
export type AerisTableResponsiveMode = 'scroll' | 'stack';
export type AerisTableData = Record<string, unknown>;
export type AerisTableCsvRows = 'all' | 'filtered' | 'page';
export type AerisTableContextMenuDisabled =
  boolean | ((row: AerisTableData, rowIndex: number) => boolean);
export type AerisTableColumnFilterPlaceholder =
  string | Readonly<Record<string, string>> | ((column: AerisTableColumn) => string);

export interface AerisTableColumn {
  readonly field: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
}

export interface AerisTableSort {
  readonly field: string;
  readonly direction: AerisTableSortDirection;
}

export interface AerisTableSortEvent {
  readonly originalEvent: Event;
  readonly sort: AerisTableSort | null;
}

export interface AerisTablePageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}

export interface AerisTableFilterEvent {
  readonly originalEvent: Event | null;
  readonly filterValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly rows: readonly AerisTableData[];
}

export interface AerisTableCellEditEvent {
  readonly originalEvent: Event;
  readonly row: AerisTableData;
  readonly field: string;
  readonly value: string;
}

export interface AerisTableCellEditStartEvent {
  readonly originalEvent: Event;
  readonly row: AerisTableData;
  readonly field: string;
  readonly value: string;
}

export interface AerisTableColumnResizeEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly width: string;
  readonly columns: readonly AerisTableColumn[];
}

export interface AerisTableColumnReorderEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly columns: readonly AerisTableColumn[];
}

export interface AerisTableSelectionEvent {
  readonly originalEvent: Event;
  readonly keys: readonly string[];
  readonly row: AerisTableData;
}

export interface AerisTableContextMenuEvent {
  readonly originalEvent: MouseEvent;
  readonly row: AerisTableData;
  readonly rowIndex: number;
  readonly key: string;
}

export interface AerisTableToggleRowsEvent {
  readonly originalEvent: Event;
  readonly keys: readonly string[];
  readonly rows: readonly AerisTableData[];
  readonly checked: boolean;
}

export interface AerisTableLazyLoadEvent {
  readonly first: number;
  readonly rows: number;
  readonly sort: AerisTableSort | null;
  readonly filterValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
}

export interface AerisTableState {
  readonly first: number;
  readonly rows: number;
  readonly sort: AerisTableSort | null;
  readonly filterValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly selectedKeys: readonly string[];
  readonly expandedKeys: readonly string[];
}

export interface AerisTableCsvExportOptions {
  readonly filename?: string;
  readonly separator?: string;
  readonly includeHeaders?: boolean;
  readonly rows?: AerisTableCsvRows;
  readonly download?: boolean;
}

interface TableResizeState {
  readonly field: string;
  readonly adjacentField: string;
  readonly startX: number;
  readonly startWidth: number;
  readonly startAdjacentWidth: number;
  readonly direction: 1 | -1;
}

export interface AerisTableCsvExportEvent {
  readonly csv: string;
  readonly rows: readonly AerisTableData[];
  readonly options: Required<AerisTableCsvExportOptions>;
}

interface AerisTableHeaderContext {
  readonly $implicit: AerisTableColumn;
  readonly column: AerisTableColumn;
}

interface AerisTableCellContext {
  readonly $implicit: unknown;
  readonly value: unknown;
  readonly row: AerisTableData;
  readonly column: AerisTableColumn;
  readonly rowIndex: number;
}

interface AerisTableRowExpansionContext {
  readonly $implicit: AerisTableData;
  readonly row: AerisTableData;
  readonly rowIndex: number;
}

@Directive({ selector: 'ng-template[aerisTableHeader]' })
export class AerisTableHeaderTemplate {
  readonly template = inject<TemplateRef<AerisTableHeaderContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisTableHeaderTemplate,
    context: unknown,
  ): context is AerisTableHeaderContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTableCell]' })
export class AerisTableCellTemplate {
  readonly template = inject<TemplateRef<AerisTableCellContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisTableCellTemplate,
    context: unknown,
  ): context is AerisTableCellContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTableExpansion]' })
export class AerisTableExpansionTemplate {
  readonly template = inject<TemplateRef<AerisTableRowExpansionContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisTableExpansionTemplate,
    context: unknown,
  ): context is AerisTableRowExpansionContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTableEmpty]' })
export class AerisTableEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTableLoading]' })
export class AerisTableLoadingTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Component({
  selector: 'aeris-table',
  imports: [NgTemplateOutlet, AerisCheckbox, AerisPaginator, AerisTooltip],
  template: `
    <div
      class="aeris-table"
      [attr.data-size]="size()"
      [attr.data-striped]="striped() || null"
      [attr.data-gridlines]="gridlines() || null"
      [attr.data-hoverable]="hoverable() || null"
      [attr.data-responsive]="responsiveMode()"
      [attr.data-fluid]="fluid() || null"
      [attr.aria-busy]="loading() || null"
      [style.--aeris-table-scroll-height]="scrollHeight() || null"
    >
      @if (caption()) {
        <div class="aeris-table__caption">{{ caption() }}</div>
      }

      @if (globalFilter()) {
        <label class="aeris-table__filter">
          <span>{{ filterLabel() }}</span>
          <input
            type="search"
            [value]="filterValue()"
            [placeholder]="filterPlaceholder()"
            (input)="handleFilterInput($event)"
          />
        </label>
      }

      <div class="aeris-table__frame">
        <div
          class="aeris-table__viewport"
          tabindex="0"
          [attr.data-scrollable]="scrollable() || null"
        >
          <table>
            @if (caption()) {
              <caption>
                {{
                  caption()
                }}
              </caption>
            }
            <thead>
              <tr>
                @if (expandableRows()) {
                  <th class="aeris-table__control-cell" scope="col">
                    <span class="aeris-table__sr">Toggle row details</span>
                  </th>
                }
                @if (selectionMode() && selectionControl() === 'control') {
                  <th class="aeris-table__control-cell" scope="col">
                    @if (selectionMode() === 'multiple' && selectionControl() === 'control') {
                      <aeris-checkbox
                        size="sm"
                        [checked]="allVisibleRowsSelected()"
                        [indeterminate]="someVisibleRowsSelected()"
                        [ariaLabel]="selectAllAriaLabel()"
                        (changed)="toggleVisibleRows($event.originalEvent)"
                      />
                    } @else {
                      <span class="aeris-table__sr">Select row</span>
                    }
                  </th>
                }
                @for (column of columns(); track column.field; let columnIndex = $index) {
                  <th
                    scope="col"
                    [attr.data-field]="column.field"
                    [attr.data-resizing-column]="resizingField() === column.field ? true : null"
                    [style.width]="column.width || null"
                    [attr.data-align]="column.align || 'start'"
                    [attr.aria-sort]="ariaSort(column)"
                    [attr.draggable]="reorderableColumns() ? true : null"
                    (dragstart)="handleColumnDragStart(column.field, $event)"
                    (dragover)="handleColumnDragOver($event)"
                    (drop)="handleColumnDrop(column.field, $event)"
                    (dragend)="handleColumnDragEnd()"
                  >
                    @if (column.sortable) {
                      <button
                        class="aeris-table__sort"
                        type="button"
                        [attr.aria-label]="sortLabel(column)"
                        (click)="toggleSort(column, $event)"
                        (keydown)="handleHeaderKeydown(column.field, $event)"
                      >
                        @if (headerTemplate(); as header) {
                          <span
                            class="aeris-table__header-label"
                            [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                            aerisTooltipEvent="hover"
                            aerisTooltipTruncatedOnly
                            [aerisTooltipShowDelay]="300"
                          >
                            <ng-container
                              [ngTemplateOutlet]="header.template"
                              [ngTemplateOutletContext]="{ $implicit: column, column }"
                            />
                          </span>
                        } @else {
                          <span
                            class="aeris-table__header-label"
                            [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                            aerisTooltipEvent="hover"
                            aerisTooltipTruncatedOnly
                            [aerisTooltipShowDelay]="300"
                          >
                            {{ column.header }}
                          </span>
                        }
                        <span
                          class="aeris-table__sort-mark"
                          [attr.data-direction]="
                            sort()?.field === column.field ? sort()?.direction : null
                          "
                          aria-hidden="true"
                        >
                          <span></span>
                          <span></span>
                        </span>
                      </button>
                    } @else {
                      @if (headerTemplate(); as header) {
                        <span
                          class="aeris-table__header-label"
                          [attr.tabindex]="reorderableColumns() ? 0 : null"
                          [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                          aerisTooltipEvent="hover"
                          aerisTooltipTruncatedOnly
                          [aerisTooltipShowDelay]="300"
                          (keydown)="handleHeaderKeydown(column.field, $event)"
                        >
                          <ng-container
                            [ngTemplateOutlet]="header.template"
                            [ngTemplateOutletContext]="{ $implicit: column, column }"
                          />
                        </span>
                      } @else {
                        <span
                          class="aeris-table__header-label"
                          [attr.tabindex]="reorderableColumns() ? 0 : null"
                          [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                          aerisTooltipEvent="hover"
                          aerisTooltipTruncatedOnly
                          [aerisTooltipShowDelay]="300"
                          (keydown)="handleHeaderKeydown(column.field, $event)"
                        >
                          {{ column.header }}
                        </span>
                      }
                    }
                    @if (resizableColumns() && columnIndex < columns().length - 1) {
                      <span
                        class="aeris-table__resize"
                        role="separator"
                        tabindex="0"
                        aria-orientation="vertical"
                        [attr.aria-label]="'Resize ' + column.header + ' column'"
                        [attr.aria-valuemin]="minColumnWidth()"
                        [attr.aria-valuetext]="column.width || 'Automatic width'"
                        [attr.data-resizing]="resizingField() === column.field ? true : null"
                        (pointerdown)="handleResizeStart(column.field, columnIndex, $event)"
                        (keydown)="handleResizeKeydown(column.field, $event)"
                      ></span>
                    }
                  </th>
                }
              </tr>
              @if (columnFilter()) {
                <tr class="aeris-table__filter-row">
                  @if (expandableRows()) {
                    <th class="aeris-table__control-cell" scope="col"></th>
                  }
                  @if (selectionMode() && selectionControl() === 'control') {
                    <th class="aeris-table__control-cell" scope="col"></th>
                  }
                  @for (column of columns(); track column.field) {
                    <th scope="col" [attr.data-align]="column.align || 'start'">
                      @if (column.filterable !== false) {
                        <label>
                          <span class="aeris-table__sr">Filter {{ column.header }}</span>
                          <input
                            type="search"
                            [value]="columnFilterValue(column.field)"
                            [placeholder]="columnFilterPlaceholderText(column)"
                            (input)="handleColumnFilterInput(column.field, $event)"
                          />
                        </label>
                      }
                    </th>
                  }
                </tr>
              }
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td [attr.colspan]="columnSpan()">
                    <div class="aeris-table__message" role="status">
                      @if (loadingTemplate(); as customLoading) {
                        <ng-container [ngTemplateOutlet]="customLoading.template" />
                      } @else {
                        <span class="aeris-table__spinner" aria-hidden="true"></span>
                        {{ loadingMessage() }}
                      }
                    </div>
                  </td>
                </tr>
              } @else if (!pageRows().length) {
                <tr>
                  <td [attr.colspan]="columnSpan()">
                    <div class="aeris-table__message" role="status">
                      @if (emptyTemplate(); as customEmpty) {
                        <ng-container [ngTemplateOutlet]="customEmpty.template" />
                      } @else {
                        {{ emptyMessage() }}
                      }
                    </div>
                  </td>
                </tr>
              } @else {
                @for (row of pageRows(); track rowKey(row); let rowIndex = $index) {
                  <tr
                    [attr.data-selected]="isSelected(row) || null"
                    [attr.data-expanded]="isExpanded(row) || null"
                    [attr.data-context-menu-active]="isContextMenuRow(row) || null"
                    [attr.data-context-menu-disabled]="
                      contextMenuRowDisabled(row, first() + rowIndex) || null
                    "
                    [attr.tabindex]="rowNavigation() ? 0 : null"
                    [class.aeris-table__selectable-row]="
                      selectionMode() && selectionControl() === 'row'
                    "
                    (click)="handleRowClick(row, $event)"
                    (contextmenu)="handleRowContextMenu(row, first() + rowIndex, $event)"
                    (dblclick)="handleRowDoubleClick($event)"
                    (keydown)="handleRowKeydown($event, row)"
                  >
                    @if (expandableRows()) {
                      <td class="aeris-table__control-cell">
                        <button
                          class="aeris-table__icon-button"
                          type="button"
                          [attr.aria-label]="
                            isExpanded(row) ? collapseRowAriaLabel() : expandRowAriaLabel()
                          "
                          [attr.aria-expanded]="isExpanded(row)"
                          (click)="toggleExpanded(row)"
                        >
                          <span aria-hidden="true"></span>
                        </button>
                      </td>
                    }
                    @if (selectionMode() && selectionControl() === 'control') {
                      <td class="aeris-table__control-cell">
                        @if (selectionMode() === 'multiple') {
                          <aeris-checkbox
                            size="sm"
                            [checked]="isSelected(row)"
                            [ariaLabel]="rowSelectionAriaLabel()"
                            (changed)="toggleRow(row, $event.originalEvent)"
                          />
                        } @else {
                          <input
                            type="radio"
                            [name]="tableId"
                            [checked]="isSelected(row)"
                            [attr.aria-label]="rowSelectionAriaLabel()"
                            (change)="toggleRow(row, $event)"
                          />
                        }
                      </td>
                    }
                    @for (column of columns(); track column.field) {
                      <td
                        [attr.data-label]="column.header"
                        [attr.data-align]="column.align || 'start'"
                        [attr.data-editable]="editable() || null"
                        (dblclick)="startCellEdit(row, column, $event)"
                      >
                        @if (isEditing(row, column.field)) {
                          <input
                            class="aeris-table__cell-editor"
                            type="text"
                            [value]="editValue()"
                            (input)="editValue.set($any($event.target).value)"
                            (keydown)="handleEditKeydown($event, row, column.field)"
                            (blur)="commitCellEdit($event, row, column.field)"
                            autofocus
                          />
                        } @else {
                          <div
                            class="aeris-table__cell-content"
                            [aerisTooltip]="
                              showOverflowTooltip() ? displayValue(row, column.field) : ''
                            "
                            aerisTooltipEvent="hover"
                            aerisTooltipTruncatedOnly
                            [aerisTooltipShowDelay]="300"
                          >
                            @if (cellTemplate(); as cell) {
                              <ng-container
                                [ngTemplateOutlet]="cell.template"
                                [ngTemplateOutletContext]="{
                                  $implicit: value(row, column.field),
                                  value: value(row, column.field),
                                  row,
                                  column,
                                  rowIndex: first() + rowIndex,
                                }"
                              />
                            } @else {
                              <span class="aeris-table__cell-value">
                                {{ displayValue(row, column.field) }}
                              </span>
                            }
                          </div>
                        }
                      </td>
                    }
                  </tr>
                  @if (expandableRows() && isExpanded(row)) {
                    <tr class="aeris-table__expansion-row">
                      <td [attr.colspan]="columnSpan()">
                        @if (expansionTemplate(); as expansion) {
                          <ng-container
                            [ngTemplateOutlet]="expansion.template"
                            [ngTemplateOutletContext]="{
                              $implicit: row,
                              row,
                              rowIndex: first() + rowIndex,
                            }"
                          />
                        } @else {
                          {{ expandedRowFallback(row) }}
                        }
                      </td>
                    </tr>
                  }
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (paginator()) {
        <aeris-paginator
          [ariaLabel]="paginatorAriaLabel()"
          [(first)]="first"
          [(rows)]="rows"
          [totalRecords]="filteredSortedRows().length"
          [pageLinkSize]="pageLinkSize()"
          [rowsPerPageOptions]="rowsPerPageOptions()"
          (page)="handlePage($event)"
        />
      }
    </div>
  `,
  styleUrl: './aeris-table.scss',
})
export class AerisTable {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private resizeListenersCleanup: (() => void) | null = null;
  readonly data = input<readonly AerisTableData[]>([]);
  readonly columns = model<readonly AerisTableColumn[]>([]);
  readonly rowKeyField = input('id');
  readonly caption = input('');
  readonly size = input<AerisTableSize>('md');
  readonly striped = input(false, { transform: booleanAttribute });
  readonly gridlines = input(false, { transform: booleanAttribute });
  readonly hoverable = input(true, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly responsiveMode = input<AerisTableResponsiveMode>('scroll');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingMessage = input('Loading data');
  readonly emptyMessage = input('No records found');
  readonly paginator = input(false, { transform: booleanAttribute });
  readonly lazy = input(false, { transform: booleanAttribute });
  readonly rows = model(10);
  readonly first = model(0);
  readonly pageLinkSize = input(5);
  readonly rowsPerPageOptions = input<readonly number[]>([]);
  readonly globalFilter = input(false, { transform: booleanAttribute });
  readonly filterValue = model('');
  readonly columnFilter = input(false, { transform: booleanAttribute });
  readonly columnFilters = model<Readonly<Record<string, string>>>({});
  readonly filterLabel = input('Search');
  readonly filterPlaceholder = input('Search records');
  readonly columnFilterPlaceholder = input<AerisTableColumnFilterPlaceholder>('');
  readonly sort = model<AerisTableSort | null>(null);
  readonly selectionMode = input<AerisTableSelectionMode | null>(null);
  readonly selectionControl = input<AerisTableSelectionControl>('control');
  readonly selectedKeys = model<readonly string[]>([]);
  readonly contextMenu = input<AerisContextMenu | null>(null);
  readonly contextMenuDisabled = input<AerisTableContextMenuDisabled>(false);
  readonly contextMenuRow = model<AerisTableData | null>(null);
  readonly contextMenuRowKey = model('');
  readonly editable = input(false, { transform: booleanAttribute });
  readonly resizableColumns = input(false, { transform: booleanAttribute });
  readonly reorderableColumns = input(false, { transform: booleanAttribute });
  readonly minColumnWidth = input(96);
  readonly showOverflowTooltip = input(false, { transform: booleanAttribute });
  readonly scrollable = input(false, { transform: booleanAttribute });
  readonly scrollHeight = input('');
  readonly expandableRows = input(false, { transform: booleanAttribute });
  readonly expandedKeys = model<readonly string[]>([]);
  readonly rowNavigation = input(true, { transform: booleanAttribute });
  readonly selectAllAriaLabel = input('Select all visible rows');
  readonly rowSelectionAriaLabel = input('Select row');
  readonly expandRowAriaLabel = input('Expand row');
  readonly collapseRowAriaLabel = input('Collapse row');
  readonly paginatorAriaLabel = input('Table pagination');
  readonly csvSeparator = input(',');
  readonly exportFilename = input('aeris-table.csv');

  readonly sorted = output<AerisTableSortEvent>();
  readonly filtered = output<AerisTableFilterEvent>();
  readonly pageChanged = output<AerisTablePageEvent>();
  readonly lazyLoad = output<AerisTableLazyLoadEvent>();
  readonly selectionChanged = output<AerisTableSelectionEvent>();
  readonly rowSelected = output<AerisTableSelectionEvent>();
  readonly rowUnselected = output<AerisTableSelectionEvent>();
  readonly contextMenuOpened = output<AerisTableContextMenuEvent>();
  readonly visibleRowsToggled = output<AerisTableToggleRowsEvent>();
  readonly rowExpanded = output<AerisTableData>();
  readonly rowCollapsed = output<AerisTableData>();
  readonly editStarted = output<AerisTableCellEditStartEvent>();
  readonly cellEdited = output<AerisTableCellEditEvent>();
  readonly editCompleted = output<AerisTableCellEditEvent>();
  readonly editCancelled = output<AerisTableCellEditStartEvent>();
  readonly columnResized = output<AerisTableColumnResizeEvent>();
  readonly columnReordered = output<AerisTableColumnReorderEvent>();
  readonly stateSaved = output<AerisTableState>();
  readonly stateRestored = output<AerisTableState>();
  readonly csvExported = output<AerisTableCsvExportEvent>();

  protected readonly tableId = `aeris-table-${Math.random().toString(36).slice(2)}`;
  protected readonly headerTemplate = contentChild(AerisTableHeaderTemplate);
  protected readonly cellTemplate = contentChild(AerisTableCellTemplate);
  protected readonly expansionTemplate = contentChild(AerisTableExpansionTemplate);
  protected readonly emptyTemplate = contentChild(AerisTableEmptyTemplate);
  protected readonly loadingTemplate = contentChild(AerisTableLoadingTemplate);
  protected readonly editingCell = signal('');
  protected readonly editValue = signal('');
  private readonly resizeState = signal<TableResizeState | null>(null);
  protected readonly resizingField = computed(() => this.resizeState()?.field ?? null);
  private readonly draggedColumn = signal<string | null>(null);
  private readonly rowIndexByIdentity = computed(() => {
    const indexes = new Map<AerisTableData, number>();
    this.data().forEach((row, index) => {
      if (!indexes.has(row)) indexes.set(row, index);
    });
    return indexes;
  });
  private readonly selectedKeySet = computed(() => new Set(this.selectedKeys()));
  private readonly expandedKeySet = computed(() => new Set(this.expandedKeys()));

  protected readonly filteredSortedRows = computed(() => {
    const filtered = this.applyFilter(this.data());
    const sort = this.sort();
    if (!sort) return filtered;
    return [...filtered].sort((left, right) =>
      this.compareValues(left[sort.field], right[sort.field], sort.direction),
    );
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredSortedRows().length / Math.max(1, this.rows()))),
  );
  protected readonly pageRows = computed(() => {
    if (!this.paginator()) return this.filteredSortedRows();
    return this.filteredSortedRows().slice(this.first(), this.first() + this.rows());
  });
  protected readonly columnSpan = computed(
    () =>
      this.columns().length +
      (this.selectionMode() && this.selectionControl() === 'control' ? 1 : 0) +
      (this.expandableRows() ? 1 : 0),
  );
  protected readonly allVisibleRowsSelected = computed(
    () =>
      this.pageRows().length > 0 &&
      this.pageRows().every((row) => this.selectedKeySet().has(this.rowKey(row))),
  );
  protected readonly someVisibleRowsSelected = computed(
    () =>
      !this.allVisibleRowsSelected() &&
      this.pageRows().some((row) => this.selectedKeySet().has(this.rowKey(row))),
  );
  protected readonly pageReport = computed(() => {
    const total = this.filteredSortedRows().length;
    if (total === 0) return '0 of 0';
    const start = Math.min(this.first() + 1, total);
    const end = Math.min(this.first() + this.rows(), total);
    return `${start}-${end} of ${total}`;
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.stopResizeListeners());
  }

  protected value(row: AerisTableData, field: string): unknown {
    return row[field];
  }

  protected displayValue(row: AerisTableData, field: string): string {
    const value = row[field];
    if (value == null) return '';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  protected handleResizeStart(
    field: string,
    columnIndex: number,
    originalEvent: PointerEvent,
  ): void {
    if (!this.resizableColumns()) return;
    const column = this.columns()[columnIndex];
    const adjacentColumn = this.columns()[columnIndex + 1];
    if (!column || !adjacentColumn) return;

    originalEvent.preventDefault();
    const handle = originalEvent.currentTarget as HTMLElement;
    const header = handle.parentElement;
    const measuredWidths = this.lockMeasuredColumnWidths(header);
    const measuredWidth = measuredWidths.get(field) ?? 0;
    const measuredAdjacentWidth = measuredWidths.get(adjacentColumn.field) ?? 0;
    this.resizeState.set({
      field,
      adjacentField: adjacentColumn.field,
      startX: originalEvent.clientX,
      startWidth: measuredWidth > 0 ? measuredWidth : this.columnWidthPixels(column.width),
      startAdjacentWidth:
        measuredAdjacentWidth > 0
          ? measuredAdjacentWidth
          : this.columnWidthPixels(adjacentColumn.width),
      direction: this.resizeDirection(handle),
    });
    this.startResizeListeners();
  }

  protected handleResizeMove(originalEvent: PointerEvent): void {
    const state = this.resizeState();
    if (!state) return;
    const requestedDelta = (originalEvent.clientX - state.startX) * state.direction;
    const delta = this.clampResizeDelta(requestedDelta, state.startWidth, state.startAdjacentWidth);
    this.setColumnPairWidths(
      state.field,
      state.adjacentField,
      state.startWidth + delta,
      state.startAdjacentWidth - delta,
    );
  }

  protected handleResizeEnd(originalEvent: PointerEvent): void {
    const state = this.resizeState();
    this.stopResizeListeners();
    if (!state) return;
    this.resizeState.set(null);
    const column = this.columns().find((item) => item.field === state.field);
    this.columnResized.emit({
      originalEvent,
      field: state.field,
      width: column?.width ?? `${this.minColumnWidth()}px`,
      columns: this.columns(),
    });
  }

  protected handleResizeKeydown(field: string, originalEvent: KeyboardEvent): void {
    if (originalEvent.key !== 'ArrowLeft' && originalEvent.key !== 'ArrowRight') return;
    originalEvent.preventDefault();
    const columns = this.columns();
    const columnIndex = columns.findIndex((item) => item.field === field);
    const column = columns[columnIndex];
    const adjacentColumn = columns[columnIndex + 1];
    if (!column || !adjacentColumn) return;

    const handle = originalEvent.currentTarget as HTMLElement;
    const header = handle.parentElement;
    const measuredWidths = this.lockMeasuredColumnWidths(header);
    const measuredWidth = measuredWidths.get(field) ?? 0;
    const measuredAdjacentWidth = measuredWidths.get(adjacentColumn.field) ?? 0;
    const current = measuredWidth > 0 ? measuredWidth : this.columnWidthPixels(column.width);
    const adjacent =
      measuredAdjacentWidth > 0
        ? measuredAdjacentWidth
        : this.columnWidthPixels(adjacentColumn.width);
    const visualDelta = originalEvent.key === 'ArrowRight' ? 16 : -16;
    const delta = this.clampResizeDelta(
      visualDelta * this.resizeDirection(handle),
      current,
      adjacent,
    );
    const width = current + delta;
    this.setColumnPairWidths(field, adjacentColumn.field, width, adjacent - delta);
    this.columnResized.emit({
      originalEvent,
      field,
      width: this.pixelWidth(width),
      columns: this.columns(),
    });
  }

  protected handleColumnDragStart(field: string, originalEvent: DragEvent): void {
    if (!this.reorderableColumns()) {
      originalEvent.preventDefault();
      return;
    }
    this.draggedColumn.set(field);
    originalEvent.dataTransfer?.setData('text/plain', field);
    if (originalEvent.dataTransfer) originalEvent.dataTransfer.effectAllowed = 'move';
  }

  protected handleColumnDragOver(originalEvent: DragEvent): void {
    if (!this.draggedColumn()) return;
    originalEvent.preventDefault();
    if (originalEvent.dataTransfer) originalEvent.dataTransfer.dropEffect = 'move';
  }

  protected handleColumnDrop(field: string, originalEvent: DragEvent): void {
    const source = this.draggedColumn();
    this.draggedColumn.set(null);
    if (!source || source === field) return;
    originalEvent.preventDefault();
    this.reorderColumn(source, field, originalEvent);
  }

  protected handleColumnDragEnd(): void {
    this.draggedColumn.set(null);
  }

  protected handleHeaderKeydown(field: string, originalEvent: KeyboardEvent): void {
    if (!this.reorderableColumns() || !originalEvent.altKey) return;
    if (originalEvent.key !== 'ArrowLeft' && originalEvent.key !== 'ArrowRight') return;
    originalEvent.preventDefault();
    const columns = this.columns();
    const index = columns.findIndex((column) => column.field === field);
    const visualOffset = originalEvent.key === 'ArrowRight' ? 1 : -1;
    const direction = this.resizeDirection(originalEvent.currentTarget as HTMLElement);
    const target = columns[index + visualOffset * direction];
    if (target) this.reorderColumn(field, target.field, originalEvent);
  }

  protected rowKey(row: AerisTableData): string {
    const key = row[this.rowKeyField()];
    return key == null ? String(this.rowIndexByIdentity().get(row) ?? -1) : String(key);
  }

  protected isSelected(row: AerisTableData): boolean {
    return this.selectedKeySet().has(this.rowKey(row));
  }

  protected isExpanded(row: AerisTableData): boolean {
    return this.expandedKeySet().has(this.rowKey(row));
  }

  protected isContextMenuRow(row: AerisTableData): boolean {
    return this.contextMenuRowKey() === this.rowKey(row);
  }

  protected contextMenuRowDisabled(row: AerisTableData, rowIndex: number): boolean {
    const disabled = this.contextMenuDisabled();
    return typeof disabled === 'function' ? disabled(row, rowIndex) : disabled;
  }

  protected toggleSort(column: AerisTableColumn, originalEvent: Event): void {
    if (!column.sortable) return;
    const current = this.sort();
    const next =
      current?.field !== column.field
        ? { field: column.field, direction: 'asc' as const }
        : current.direction === 'asc'
          ? { field: column.field, direction: 'desc' as const }
          : null;
    this.sort.set(next);
    this.sorted.emit({ originalEvent, sort: next });
    this.emitLazyLoad();
  }

  protected ariaSort(column: AerisTableColumn): 'ascending' | 'descending' | null {
    const sort = this.sort();
    if (sort?.field !== column.field) return null;
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected sortLabel(column: AerisTableColumn): string {
    const sort = this.sort();
    if (sort?.field !== column.field) return `Sort by ${column.header}`;
    return sort.direction === 'asc'
      ? `Sort ${column.header} descending`
      : `Clear ${column.header} sorting`;
  }

  protected toggleRow(row: AerisTableData, originalEvent: Event): void {
    const key = this.rowKey(row);
    const next =
      this.selectionMode() === 'single'
        ? this.isSelected(row)
          ? []
          : [key]
        : this.isSelected(row)
          ? this.selectedKeys().filter((item) => item !== key)
          : [...this.selectedKeys(), key];
    const wasSelected = this.isSelected(row);
    this.selectedKeys.set(next);
    const event = { originalEvent, keys: next, row };
    this.selectionChanged.emit(event);
    if (wasSelected) {
      this.rowUnselected.emit(event);
    } else {
      this.rowSelected.emit(event);
    }
  }

  protected handleRowClick(row: AerisTableData, originalEvent: MouseEvent): void {
    if (!this.selectionMode() || this.selectionControl() !== 'row') return;
    if ((originalEvent.target as HTMLElement).closest('button,input,select,textarea,a')) return;
    this.toggleRow(row, originalEvent);
  }

  protected handleRowContextMenu(
    row: AerisTableData,
    rowIndex: number,
    originalEvent: MouseEvent,
  ): void {
    const menu = this.contextMenu();
    if (!menu || this.contextMenuRowDisabled(row, rowIndex)) return;

    const key = this.rowKey(row);
    this.contextMenuRow.set(row);
    this.contextMenuRowKey.set(key);
    this.contextMenuOpened.emit({ originalEvent, row, rowIndex, key });
    menu.show(originalEvent);
  }

  protected toggleVisibleRows(originalEvent: Event): void {
    const visibleKeys = this.pageRows().map((row) => this.rowKey(row));
    const visibleKeySet = new Set(visibleKeys);
    const selected = this.selectedKeys();
    const next = this.allVisibleRowsSelected()
      ? selected.filter((key) => !visibleKeySet.has(key))
      : Array.from(new Set([...selected, ...visibleKeys]));
    const checked = !this.allVisibleRowsSelected();
    this.selectedKeys.set(next);
    this.selectionChanged.emit({
      originalEvent,
      keys: next,
      row: this.pageRows()[0] ?? {},
    });
    this.visibleRowsToggled.emit({
      originalEvent,
      keys: next,
      rows: this.pageRows(),
      checked,
    });
  }

  protected toggleExpanded(row: AerisTableData): void {
    const key = this.rowKey(row);
    if (this.isExpanded(row)) {
      this.expandedKeys.set(this.expandedKeys().filter((item) => item !== key));
      this.rowCollapsed.emit(row);
    } else {
      this.expandedKeys.set([...this.expandedKeys(), key]);
      this.rowExpanded.emit(row);
    }
  }

  protected handleRowKeydown(event: KeyboardEvent, row: AerisTableData): void {
    if (event.key === 'Enter' && this.expandableRows()) {
      event.preventDefault();
      this.toggleExpanded(row);
    }
    if (event.key === ' ' && this.selectionMode()) {
      event.preventDefault();
      this.toggleRow(row, event);
    }
  }

  protected handleFilterInput(event: Event): void {
    this.filterValue.set((event.target as HTMLInputElement).value);
    this.first.set(0);
    this.emitFilterEvent(event);
    this.emitLazyLoad();
  }

  protected handleColumnFilterInput(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.columnFilters.set({
      ...this.columnFilters(),
      [field]: value,
    });
    this.first.set(0);
    this.emitFilterEvent(event);
    this.emitLazyLoad();
  }

  protected columnFilterValue(field: string): string {
    return this.columnFilters()[field] ?? '';
  }

  protected columnFilterPlaceholderText(column: AerisTableColumn): string {
    const placeholder = this.columnFilterPlaceholder();
    if (typeof placeholder === 'function') return placeholder(column);
    if (typeof placeholder === 'string') return placeholder;
    return placeholder[column.field] ?? '';
  }

  protected handlePage(event: AerisPaginatorPageEvent): void {
    this.pageChanged.emit(event);
    this.emitLazyLoad();
  }

  protected expandedRowFallback(row: AerisTableData): string {
    return JSON.stringify(row);
  }

  reset(): void {
    this.first.set(0);
    this.sort.set(null);
    this.filterValue.set('');
    this.columnFilters.set({});
    this.selectedKeys.set([]);
    this.expandedKeys.set([]);
    this.emitFilterEvent(null);
    this.emitLazyLoad();
  }

  clearSort(): void {
    this.sort.set(null);
    this.sorted.emit({ originalEvent: new Event('clear'), sort: null });
    this.emitLazyLoad();
  }

  clearFilters(): void {
    this.filterValue.set('');
    this.columnFilters.set({});
    this.first.set(0);
    this.emitFilterEvent(null);
    this.emitLazyLoad();
  }

  clearSelection(): void {
    this.selectedKeys.set([]);
  }

  clearContextMenuRow(): void {
    this.contextMenuRow.set(null);
    this.contextMenuRowKey.set('');
  }

  clearExpandedRows(): void {
    this.expandedKeys.set([]);
  }

  selectRows(keys: readonly string[]): void {
    const availableKeys = new Set(this.data().map((row) => this.rowKey(row)));
    this.selectedKeys.set(keys.filter((key) => availableKeys.has(key)));
  }

  expandRow(rowOrKey: AerisTableData | string): void {
    const key = typeof rowOrKey === 'string' ? rowOrKey : this.rowKey(rowOrKey);
    if (!this.expandedKeys().includes(key)) {
      this.expandedKeys.set([...this.expandedKeys(), key]);
    }
  }

  collapseRow(rowOrKey: AerisTableData | string): void {
    const key = typeof rowOrKey === 'string' ? rowOrKey : this.rowKey(rowOrKey);
    this.expandedKeys.set(this.expandedKeys().filter((item) => item !== key));
  }

  filter(value: string): void {
    this.filterValue.set(value);
    this.first.set(0);
    this.emitFilterEvent(null);
    this.emitLazyLoad();
  }

  filterColumn(field: string, value: string): void {
    this.columnFilters.set({ ...this.columnFilters(), [field]: value });
    this.first.set(0);
    this.emitFilterEvent(null);
    this.emitLazyLoad();
  }

  saveState(): AerisTableState {
    const state = this.currentState();
    this.stateSaved.emit(state);
    return state;
  }

  restoreState(state: AerisTableState): void {
    this.first.set(state.first);
    this.rows.set(state.rows);
    this.sort.set(state.sort);
    this.filterValue.set(state.filterValue);
    this.columnFilters.set(state.columnFilters);
    this.selectedKeys.set(state.selectedKeys);
    this.expandedKeys.set(state.expandedKeys);
    this.stateRestored.emit(state);
    this.emitLazyLoad();
  }

  exportCSV(options: AerisTableCsvExportOptions = {}): string {
    const normalized = this.normalizeCsvOptions(options);
    const rows = this.csvRows(normalized.rows);
    const columns = this.columns();
    const lines = rows.map((row) =>
      columns
        .map((column) => this.escapeCsvValue(this.displayValue(row, column.field)))
        .join(normalized.separator),
    );
    if (normalized.includeHeaders) {
      lines.unshift(
        columns.map((column) => this.escapeCsvValue(column.header)).join(normalized.separator),
      );
    }
    const csv = lines.join('\r\n');
    if (normalized.download) {
      this.downloadCsv(csv, normalized.filename);
    }
    this.csvExported.emit({ csv, rows, options: normalized });
    return csv;
  }

  private setColumnPairWidths(
    field: string,
    adjacentField: string,
    width: number,
    adjacentWidth: number,
  ): void {
    this.columns.set(
      aerisInternalSetColumnPairWidths(
        this.columns(),
        field,
        adjacentField,
        width,
        adjacentWidth,
      ),
    );
  }

  private clampResizeDelta(delta: number, width: number, adjacentWidth: number): number {
    return aerisInternalClampColumnResizeDelta(
      delta,
      width,
      adjacentWidth,
      this.minColumnWidth(),
    );
  }

  private columnWidthPixels(width: string | undefined): number {
    return aerisInternalColumnWidthPixels(width);
  }

  private lockMeasuredColumnWidths(header: HTMLElement | null): ReadonlyMap<string, number> {
    const measuredWidths = aerisInternalMeasureColumnWidths(header);
    if (!measuredWidths.size) return measuredWidths;
    this.columns.set(aerisInternalApplyMeasuredColumnWidths(this.columns(), measuredWidths));
    return measuredWidths;
  }

  private pixelWidth(width: number): string {
    return aerisInternalPixelWidth(width);
  }

  private resizeDirection(element: HTMLElement): 1 | -1 {
    return aerisInternalColumnResizeDirection(element);
  }

  private startResizeListeners(): void {
    this.stopResizeListeners();
    const move = (event: PointerEvent) => this.handleResizeMove(event);
    const end = (event: PointerEvent) => this.handleResizeEnd(event);
    const removeListeners = aerisInternalListenForColumnResize(this.document, move, end);
    this.resizeListenersCleanup = () => {
      removeListeners();
      this.resizeListenersCleanup = null;
    };
  }

  private stopResizeListeners(): void {
    this.resizeListenersCleanup?.();
  }

  private reorderColumn(sourceField: string, targetField: string, originalEvent: Event): void {
    const columns = [...this.columns()];
    const fromIndex = columns.findIndex((column) => column.field === sourceField);
    const targetIndex = columns.findIndex((column) => column.field === targetField);
    if (fromIndex < 0 || targetIndex < 0) return;
    const [column] = columns.splice(fromIndex, 1);
    if (!column) return;
    const targetAfterRemoval = columns.findIndex((item) => item.field === targetField);
    const toIndex = fromIndex < targetIndex ? targetAfterRemoval + 1 : targetAfterRemoval;
    columns.splice(toIndex, 0, column);
    this.columns.set(columns);
    this.columnReordered.emit({
      originalEvent,
      field: sourceField,
      fromIndex,
      toIndex,
      columns,
    });
  }

  private applyFilter(rows: readonly AerisTableData[]): readonly AerisTableData[] {
    const query = this.filterValue().trim().toLocaleLowerCase();
    const columnFilters = Object.entries(this.columnFilters())
      .map(([field, value]) => [field, value.trim().toLocaleLowerCase()] as const)
      .filter(([, value]) => value);
    const fields = this.columns()
      .filter((column) => column.filterable !== false)
      .map((column) => column.field);
    return rows.filter((row) => {
      const matchesGlobal =
        !this.globalFilter() ||
        !query ||
        fields.some((field) =>
          String(row[field] ?? '')
            .toLocaleLowerCase()
            .includes(query),
        );
      const matchesColumns = columnFilters.every(([field, value]) =>
        String(row[field] ?? '')
          .toLocaleLowerCase()
          .includes(value),
      );
      return matchesGlobal && matchesColumns;
    });
  }

  protected startCellEdit(
    row: AerisTableData,
    column: AerisTableColumn,
    originalEvent: MouseEvent,
  ): void {
    if (!this.editable()) return;
    originalEvent.stopPropagation();
    this.editingCell.set(`${this.rowKey(row)}:${column.field}`);
    this.editValue.set(this.displayValue(row, column.field));
    this.editStarted.emit({
      originalEvent,
      row,
      field: column.field,
      value: this.editValue(),
    });
  }

  protected isEditing(row: AerisTableData, field: string): boolean {
    return this.editingCell() === `${this.rowKey(row)}:${field}`;
  }

  protected handleEditKeydown(event: KeyboardEvent, row: AerisTableData, field: string): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitCellEdit(event, row, field);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.editCancelled.emit({
        originalEvent: event,
        row,
        field,
        value: this.editValue(),
      });
      this.editingCell.set('');
    }
  }

  protected commitCellEdit(originalEvent: Event, row: AerisTableData, field: string): void {
    if (!this.isEditing(row, field)) return;
    const event = {
      originalEvent,
      row,
      field,
      value: this.editValue(),
    };
    this.cellEdited.emit(event);
    this.editCompleted.emit(event);
    this.editingCell.set('');
  }

  protected handleRowDoubleClick(event: MouseEvent): void {
    if (this.editable()) {
      event.stopPropagation();
    }
  }

  private compareValues(left: unknown, right: unknown, direction: AerisTableSortDirection): number {
    const modifier = direction === 'asc' ? 1 : -1;
    if (typeof left === 'number' && typeof right === 'number') {
      return (left - right) * modifier;
    }
    return String(left ?? '').localeCompare(String(right ?? '')) * modifier;
  }

  private emitFilterEvent(originalEvent: Event | null): void {
    this.filtered.emit({
      originalEvent,
      filterValue: this.filterValue(),
      columnFilters: this.columnFilters(),
      rows: this.filteredSortedRows(),
    });
  }

  private emitLazyLoad(): void {
    if (!this.lazy()) return;
    this.lazyLoad.emit({
      first: this.first(),
      rows: this.rows(),
      sort: this.sort(),
      filterValue: this.filterValue(),
      columnFilters: this.columnFilters(),
    });
  }

  private currentState(): AerisTableState {
    return {
      first: this.first(),
      rows: this.rows(),
      sort: this.sort(),
      filterValue: this.filterValue(),
      columnFilters: this.columnFilters(),
      selectedKeys: this.selectedKeys(),
      expandedKeys: this.expandedKeys(),
    };
  }

  private normalizeCsvOptions(
    options: AerisTableCsvExportOptions,
  ): Required<AerisTableCsvExportOptions> {
    return {
      filename: options.filename ?? this.exportFilename(),
      separator: this.normalizeCsvSeparator(options.separator ?? this.csvSeparator()),
      includeHeaders: options.includeHeaders ?? true,
      rows: options.rows ?? 'filtered',
      download: options.download ?? true,
    };
  }

  private csvRows(rows: AerisTableCsvRows): readonly AerisTableData[] {
    if (rows === 'all') return this.data();
    if (rows === 'page') return this.pageRows();
    return this.filteredSortedRows();
  }

  private escapeCsvValue(value: string): string {
    const textValue = this.neutralizeCsvFormula(value);
    return `"${textValue.replace(/"/g, '""')}"`;
  }

  private downloadCsv(csv: string, filename: string): void {
    if (typeof Blob === 'undefined' || typeof globalThis.URL === 'undefined') return;
    const url = globalThis.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = this.safeDownloadFilename(filename);
    link.click();
    globalThis.URL.revokeObjectURL(url);
  }

  private neutralizeCsvFormula(value: string): string {
    const formulaPrefix = /^[\u0000-\u0020]*[=+\-@\uFF1D\uFF0B\uFF0D\uFF20]/u;
    return formulaPrefix.test(value) ? `'${value}` : value;
  }

  private normalizeCsvSeparator(separator: string): string {
    return separator.length === 1 && !/[\r\n"']/u.test(separator) ? separator : ',';
  }

  private safeDownloadFilename(filename: string): string {
    const normalized = filename
      .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/gu, '_')
      .replace(/^\.+|\.+$/gu, '')
      .trim()
      .slice(0, 180);
    return normalized || 'aeris-table.csv';
  }
}

export const AerisTableModule = [
  AerisTable,
  AerisTableHeaderTemplate,
  AerisTableCellTemplate,
  AerisTableExpansionTemplate,
  AerisTableEmptyTemplate,
  AerisTableLoadingTemplate,
] as const;

/** One-import convenience array for Table integrations that render an Aeris ContextMenu. */
export const AerisTableContextMenuModule = [
  AerisTable,
  AerisTableHeaderTemplate,
  AerisTableCellTemplate,
  AerisTableExpansionTemplate,
  AerisTableEmptyTemplate,
  AerisTableLoadingTemplate,
  AerisContextMenu,
  AerisContextMenuItemTemplate,
] as const;
