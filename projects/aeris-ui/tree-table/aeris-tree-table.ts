import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  DestroyRef,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { AerisPaginator, type AerisPaginatorPageEvent } from '@aeris-ui/core/paginator';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
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

export type AerisTreeTableData = Readonly<Record<string, unknown>>;
export type AerisTreeTableSize = 'sm' | 'md' | 'lg';
export type AerisTreeTableSelectionMode = 'single' | 'multiple' | 'checkbox';
export type AerisTreeTableSortDirection = 'asc' | 'desc';
export type AerisTreeTableSortMode = 'single' | 'multiple';
export type AerisTreeTableFilterStrategy = 'subtree' | 'path';
export type AerisTreeTableResponsiveMode = 'scroll' | 'stack';

export interface AerisTreeTableNode<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly key: string;
  readonly data: TData;
  readonly children?: readonly AerisTreeTableNode<TData>[];
  readonly leaf?: boolean;
  readonly disabled?: boolean;
  readonly selectable?: boolean;
}

export interface AerisTreeTableColumn {
  readonly field: string;
  readonly header: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly editable?: boolean;
  readonly frozen?: boolean;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
}

export interface AerisTreeTableSort {
  readonly field: string;
  readonly direction: AerisTreeTableSortDirection;
}

export interface AerisTreeTableNodeEvent<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly originalEvent: Event;
  readonly node: AerisTreeTableNode<TData>;
  readonly key: string;
}

export interface AerisTreeTableSelectionEvent<
  TData extends AerisTreeTableData = AerisTreeTableData,
> extends AerisTreeTableNodeEvent<TData> {
  readonly selected: boolean;
  readonly selectedKeys: readonly string[];
}

export interface AerisTreeTableSortEvent {
  readonly originalEvent: Event;
  readonly sorts: readonly AerisTreeTableSort[];
}

export interface AerisTreeTableFilterEvent<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly originalEvent: Event | null;
  readonly globalValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly value: readonly AerisTreeTableNode<TData>[];
}

export interface AerisTreeTablePageEvent {
  readonly first: number;
  readonly rows: number;
  readonly page: number;
  readonly pageCount: number;
}

export interface AerisTreeTableLazyLoadEvent {
  readonly first: number;
  readonly rows: number;
  readonly sorts: readonly AerisTreeTableSort[];
  readonly globalValue: string;
  readonly columnFilters: Readonly<Record<string, string>>;
}

export interface AerisTreeTableCellEditEvent<
  TData extends AerisTreeTableData = AerisTreeTableData,
> extends AerisTreeTableNodeEvent<TData> {
  readonly field: string;
  readonly previousValue: unknown;
  readonly value: unknown;
}

export interface AerisTreeTableColumnResizeEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly width: string;
  readonly columns: readonly AerisTreeTableColumn[];
}

export interface AerisTreeTableColumnReorderEvent {
  readonly originalEvent: Event;
  readonly field: string;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly columns: readonly AerisTreeTableColumn[];
}

export interface AerisTreeTableHeaderContext {
  readonly $implicit: AerisTreeTableColumn;
  readonly column: AerisTreeTableColumn;
  readonly sort: AerisTreeTableSortDirection | null;
}

export interface AerisTreeTableCellContext<TData extends AerisTreeTableData = AerisTreeTableData> {
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

interface TreeTableStructureEntry<TData extends AerisTreeTableData> {
  readonly node: AerisTreeTableNode<TData>;
  readonly key: string;
  readonly level: number;
  readonly parentKey: string | null;
  readonly position: number;
  readonly setSize: number;
  readonly expanded: boolean;
  readonly expandable: boolean;
}

interface TreeTableSelectionState {
  readonly selected: boolean;
  readonly partial: boolean;
}

interface TreeTableRenderedColumn extends AerisTreeTableColumn {
  readonly frozenLeft: string | null;
}

interface TreeTableRenderedEntry<
  TData extends AerisTreeTableData,
> extends TreeTableStructureEntry<TData> {
  readonly id: string;
  readonly active: boolean;
  readonly disabled: boolean;
  readonly selected: boolean;
  readonly partial: boolean;
  readonly loading: boolean;
  readonly tabIndex: 0 | -1;
  readonly values: Readonly<Record<string, unknown>>;
}

interface TreeTableResizeState {
  readonly field: string;
  readonly adjacentField: string;
  readonly startX: number;
  readonly startWidth: number;
  readonly startAdjacentWidth: number;
  readonly direction: 1 | -1;
}

@Directive({ selector: 'ng-template[aerisTreeTableHeader]' })
export class AerisTreeTableHeaderTemplate {
  readonly template = inject<TemplateRef<AerisTreeTableHeaderContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisTreeTableHeaderTemplate,
    context: unknown,
  ): context is AerisTreeTableHeaderContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTreeTableCell]' })
export class AerisTreeTableCellTemplate<TData extends AerisTreeTableData = AerisTreeTableData> {
  readonly template = inject<TemplateRef<AerisTreeTableCellContext<TData>>>(TemplateRef);

  static ngTemplateContextGuard<TData extends AerisTreeTableData>(
    _directive: AerisTreeTableCellTemplate<TData>,
    context: unknown,
  ): context is AerisTreeTableCellContext<TData> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTreeTableEmpty]' })
export class AerisTreeTableEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTreeTableLoading]' })
export class AerisTreeTableLoadingTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let treeTableId = 0;

@Component({
  selector: 'aeris-tree-table',
  imports: [NgTemplateOutlet, AerisCheckbox, AerisPaginator, AerisTooltip],
  template: `
    <div
      class="aeris-tree-table"
      [attr.data-size]="size()"
      [attr.data-striped]="striped() || null"
      [attr.data-gridlines]="gridlines() || null"
      [attr.data-hoverable]="hoverable() || null"
      [attr.data-fluid]="fluid() || null"
      [attr.data-responsive]="responsiveMode()"
      [attr.aria-busy]="loading() || null"
      [style.--aeris-tree-table-scroll-height]="scrollHeight() || null"
      [style.--aeris-tree-table-min-width]="tableMinWidth() || null"
    >
      @if (caption()) {
        <div class="aeris-tree-table__caption">{{ caption() }}</div>
      }

      @if (globalFilter()) {
        <label class="aeris-tree-table__global-filter">
          <span>{{ globalFilterLabel() }}</span>
          <input
            type="search"
            [value]="globalFilterValue()"
            [placeholder]="globalFilterPlaceholder()"
            (input)="handleGlobalFilter($event)"
          />
        </label>
      }

      <div class="aeris-tree-table__frame">
        <div
          class="aeris-tree-table__viewport"
          tabindex="0"
          [attr.data-scrollable]="scrollable() || null"
        >
          <table
            role="treegrid"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-rowcount]="totalRowCount()"
            [attr.aria-colcount]="renderedColumns().length"
            [attr.aria-multiselectable]="
              selectionMode() === 'multiple' || selectionMode() === 'checkbox' ? true : null
            "
          >
            @if (caption()) {
              <caption>
                {{
                  caption()
                }}
              </caption>
            }
            <thead>
              <tr>
                @for (column of renderedColumns(); track column.field; let columnIndex = $index) {
                  <th
                    scope="col"
                    [attr.data-field]="column.field"
                    [attr.data-resizing-column]="resizingField() === column.field ? true : null"
                    [attr.data-frozen]="column.frozen || null"
                    [attr.data-align]="column.align || 'start'"
                    [attr.aria-sort]="ariaSort(column.field)"
                    [attr.draggable]="reorderableColumns() ? true : null"
                    [style.width]="column.width || null"
                    [style.left]="column.frozenLeft"
                    (dragstart)="handleColumnDragStart(column.field, $event)"
                    (dragover)="handleColumnDragOver($event)"
                    (drop)="handleColumnDrop(column.field, $event)"
                    (dragend)="handleColumnDragEnd()"
                  >
                    @if (column.sortable) {
                      <button
                        class="aeris-tree-table__sort"
                        type="button"
                        [attr.aria-label]="sortAriaLabel(column)"
                        (click)="toggleSort(column, $event)"
                        (keydown)="handleHeaderKeydown(column.field, $event)"
                      >
                        @if (headerTemplate(); as customHeader) {
                          <span
                            class="aeris-tree-table__header-label"
                            [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                            aerisTooltipEvent="hover"
                            aerisTooltipTruncatedOnly
                            [aerisTooltipShowDelay]="300"
                          >
                            <ng-container
                              [ngTemplateOutlet]="customHeader.template"
                              [ngTemplateOutletContext]="{
                                $implicit: column,
                                column,
                                sort: sortDirection(column.field),
                              }"
                            />
                          </span>
                        } @else {
                          <span
                            class="aeris-tree-table__header-label"
                            [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                            aerisTooltipEvent="hover"
                            aerisTooltipTruncatedOnly
                            [aerisTooltipShowDelay]="300"
                          >
                            {{ column.header }}
                          </span>
                        }
                        <span
                          class="aeris-tree-table__sort-mark"
                          [attr.data-direction]="sortDirection(column.field)"
                          aria-hidden="true"
                          ><span></span><span></span
                        ></span>
                      </button>
                    } @else {
                      <span
                        class="aeris-tree-table__header-label"
                        [attr.tabindex]="reorderableColumns() ? 0 : null"
                        [aerisTooltip]="showOverflowTooltip() ? column.header : ''"
                        aerisTooltipEvent="hover"
                        aerisTooltipTruncatedOnly
                        [aerisTooltipShowDelay]="300"
                        (keydown)="handleHeaderKeydown(column.field, $event)"
                      >
                        @if (headerTemplate(); as customHeader) {
                          <ng-container
                            [ngTemplateOutlet]="customHeader.template"
                            [ngTemplateOutletContext]="{
                              $implicit: column,
                              column,
                              sort: sortDirection(column.field),
                            }"
                          />
                        } @else {
                          {{ column.header }}
                        }
                      </span>
                    }
                    @if (resizableColumns() && columnIndex < renderedColumns().length - 1) {
                      <span
                        class="aeris-tree-table__resize"
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
                <tr class="aeris-tree-table__filter-row">
                  @for (column of renderedColumns(); track column.field) {
                    <th
                      scope="col"
                      [attr.data-frozen]="column.frozen || null"
                      [style.left]="column.frozenLeft"
                    >
                      @if (column.filterable !== false) {
                        <label>
                          <span class="aeris-tree-table__sr">Filter {{ column.header }}</span>
                          <input
                            type="search"
                            [value]="columnFilterValue(column.field)"
                            [placeholder]="columnFilterPlaceholderText(column)"
                            (input)="handleColumnFilter(column.field, $event)"
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
                    <div class="aeris-tree-table__message" role="status">
                      @if (loadingTemplate(); as customLoading) {
                        <ng-container [ngTemplateOutlet]="customLoading.template" />
                      } @else {
                        <span class="aeris-tree-table__spinner" aria-hidden="true"></span>
                        {{ loadingMessage() }}
                      }
                    </div>
                  </td>
                </tr>
              } @else if (!renderedRows().length) {
                <tr>
                  <td [attr.colspan]="columnSpan()">
                    <div class="aeris-tree-table__message" role="status">
                      @if (emptyTemplate(); as customEmpty) {
                        <ng-container [ngTemplateOutlet]="customEmpty.template" />
                      } @else {
                        {{ hasFilters() ? emptyFilterMessage() : emptyMessage() }}
                      }
                    </div>
                  </td>
                </tr>
              } @else {
                @for (entry of renderedRows(); track entry.key; let rowIndex = $index) {
                  <tr
                    #rowElement
                    [id]="entry.id"
                    [attr.tabindex]="entry.tabIndex"
                    [attr.data-row-key]="entry.key"
                    [attr.data-selected]="entry.selected || null"
                    [attr.data-disabled]="entry.disabled || null"
                    [attr.aria-level]="entry.level"
                    [attr.aria-posinset]="entry.position"
                    [attr.aria-setsize]="entry.setSize"
                    [attr.aria-expanded]="entry.expandable ? entry.expanded : null"
                    [attr.aria-selected]="selectionMode() ? entry.selected : null"
                    [attr.aria-disabled]="entry.disabled || null"
                    [attr.aria-busy]="entry.loading || null"
                    (focus)="activate(entry.key)"
                    (click)="handleRowClick(entry, $event)"
                    (keydown)="handleRowKeydown(entry, $event)"
                  >
                    @for (column of renderedColumns(); track column.field) {
                      <td
                        [attr.data-label]="column.header"
                        [attr.data-frozen]="column.frozen || null"
                        [attr.data-editable]="isCellEditable(entry, column) || null"
                        [attr.data-align]="column.align || 'start'"
                        [style.left]="column.frozenLeft"
                        (dblclick)="startCellEdit(entry, column, $event)"
                      >
                        <div
                          class="aeris-tree-table__cell"
                          [attr.data-tree-cell]="column.field === treeField() || null"
                          [style.--aeris-tree-table-level]="
                            column.field === treeField() ? entry.level - 1 : null
                          "
                        >
                          @if (column.field === treeField()) {
                            <button
                              class="aeris-tree-table__toggle"
                              type="button"
                              tabindex="-1"
                              [attr.aria-label]="
                                entry.expanded ? collapseAriaLabel() : expandAriaLabel()
                              "
                              [attr.aria-expanded]="entry.expandable ? entry.expanded : null"
                              [disabled]="!entry.expandable || entry.loading"
                              (click)="toggleNode(entry, $event)"
                            >
                              @if (entry.loading) {
                                <span class="aeris-tree-table__spinner" aria-hidden="true"></span>
                              } @else {
                                <span aria-hidden="true"></span>
                              }
                            </button>
                            @if (selectionMode() === 'checkbox') {
                              <aeris-checkbox
                                class="aeris-tree-table__checkbox"
                                size="sm"
                                [tabIndex]="-1"
                                [checked]="entry.selected"
                                [indeterminate]="entry.partial"
                                [ariaLabel]="selectRowAriaLabel()"
                                [disabled]="entry.disabled || entry.node.selectable === false"
                                (click)="$event.stopPropagation()"
                                (changed)="toggleSelection(entry, $event.originalEvent)"
                              />
                            }
                          }

                          @if (isEditing(entry.key, column.field)) {
                            <input
                              #cellEditor
                              class="aeris-tree-table__editor"
                              type="text"
                              [value]="editValue()"
                              [attr.aria-label]="'Edit ' + column.header"
                              (input)="editValue.set($any($event.target).value)"
                              (keydown)="handleEditKeydown(entry, column, $event)"
                              (blur)="commitEdit(entry, column, $event)"
                            />
                          } @else {
                            <div
                              class="aeris-tree-table__cell-content"
                              [aerisTooltip]="
                                showOverflowTooltip()
                                  ? displayValue(entry.values[column.field])
                                  : ''
                              "
                              aerisTooltipEvent="hover"
                              aerisTooltipTruncatedOnly
                              [aerisTooltipShowDelay]="300"
                            >
                              @if (cellTemplate(); as customCell) {
                                <ng-container
                                  [ngTemplateOutlet]="customCell.template"
                                  [ngTemplateOutletContext]="cellContext(entry, column, rowIndex)"
                                />
                              } @else {
                                <span class="aeris-tree-table__cell-value">
                                  {{ displayValue(entry.values[column.field]) }}
                                </span>
                              }
                            </div>
                          }
                        </div>
                      </td>
                    }
                  </tr>
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
          [totalRecords]="paginatorTotal()"
          [pageLinkSize]="pageLinkSize()"
          [rowsPerPageOptions]="rowsPerPageOptions()"
          (page)="handlePage($event)"
        />
      }
    </div>
  `,
  styleUrl: './aeris-tree-table.scss',
})
export class AerisTreeTable<TData extends AerisTreeTableData = AerisTreeTableData> {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  readonly value = model<readonly AerisTreeTableNode<TData>[]>([]);
  readonly columns = model<readonly AerisTreeTableColumn[]>([]);
  readonly expandedKeys = model<readonly string[]>([]);
  readonly selectionKeys = model<readonly string[]>([]);
  readonly sorts = model<readonly AerisTreeTableSort[]>([]);
  readonly globalFilterValue = model('');
  readonly columnFilters = model<Readonly<Record<string, string>>>({});
  readonly first = model(0);
  readonly rows = model(10);

  readonly treeColumn = input('');
  readonly caption = input('');
  readonly ariaLabel = input('Tree table');
  readonly size = input<AerisTreeTableSize>('md');
  readonly striped = input(false, { transform: booleanAttribute });
  readonly gridlines = input(false, { transform: booleanAttribute });
  readonly hoverable = input(true, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly responsiveMode = input<AerisTreeTableResponsiveMode>('scroll');
  readonly scrollable = input(true, { transform: booleanAttribute });
  readonly scrollHeight = input('');
  readonly tableMinWidth = input('42rem');
  readonly selectionMode = input<AerisTreeTableSelectionMode | null>(null);
  readonly propagateSelection = input(true, { transform: booleanAttribute });
  readonly sortMode = input<AerisTreeTableSortMode>('single');
  readonly removableSort = input(true, { transform: booleanAttribute });
  readonly globalFilter = input(false, { transform: booleanAttribute });
  readonly columnFilter = input(false, { transform: booleanAttribute });
  readonly filterStrategy = input<AerisTreeTableFilterStrategy>('path');
  readonly globalFilterLabel = input('Search');
  readonly globalFilterPlaceholder = input('Search rows');
  readonly columnFilterPlaceholder = input('');
  readonly paginator = input(false, { transform: booleanAttribute });
  readonly pageLinkSize = input(5);
  readonly rowsPerPageOptions = input<readonly number[]>([]);
  readonly lazy = input(false, { transform: booleanAttribute });
  readonly totalRecords = input(0);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingKeys = input<readonly string[]>([]);
  readonly loadingMessage = input('Loading rows');
  readonly emptyMessage = input('No rows available');
  readonly emptyFilterMessage = input('No matching rows');
  readonly editable = input(false, { transform: booleanAttribute });
  readonly resizableColumns = input(false, { transform: booleanAttribute });
  readonly reorderableColumns = input(false, { transform: booleanAttribute });
  readonly minColumnWidth = input(96);
  readonly showOverflowTooltip = input(false, { transform: booleanAttribute });
  readonly expandAriaLabel = input('Expand row');
  readonly collapseAriaLabel = input('Collapse row');
  readonly selectRowAriaLabel = input('Select row');
  readonly paginatorAriaLabel = input('Tree table pagination');

  readonly nodeExpanded = output<AerisTreeTableNodeEvent<TData>>();
  readonly nodeCollapsed = output<AerisTreeTableNodeEvent<TData>>();
  readonly selectionChanged = output<AerisTreeTableSelectionEvent<TData>>();
  readonly nodeSelected = output<AerisTreeTableSelectionEvent<TData>>();
  readonly nodeUnselected = output<AerisTreeTableSelectionEvent<TData>>();
  readonly sorted = output<AerisTreeTableSortEvent>();
  readonly filtered = output<AerisTreeTableFilterEvent<TData>>();
  readonly pageChanged = output<AerisTreeTablePageEvent>();
  readonly lazyLoad = output<AerisTreeTableLazyLoadEvent>();
  readonly editStarted = output<AerisTreeTableCellEditEvent<TData>>();
  readonly cellEdited = output<AerisTreeTableCellEditEvent<TData>>();
  readonly editCancelled = output<AerisTreeTableCellEditEvent<TData>>();
  readonly columnResized = output<AerisTreeTableColumnResizeEvent>();
  readonly columnReordered = output<AerisTreeTableColumnReorderEvent>();

  protected readonly headerTemplate = contentChild(AerisTreeTableHeaderTemplate);
  protected readonly cellTemplate = contentChild(AerisTreeTableCellTemplate<TData>);
  protected readonly emptyTemplate = contentChild(AerisTreeTableEmptyTemplate);
  protected readonly loadingTemplate = contentChild(AerisTreeTableLoadingTemplate);
  private readonly rowElements = viewChildren<ElementRef<HTMLTableRowElement>>('rowElement');
  private readonly cellEditor = viewChild<ElementRef<HTMLInputElement>>('cellEditor');
  private readonly activeKey = signal<string | null>(null);
  private readonly editingCell = signal<{ readonly key: string; readonly field: string } | null>(
    null,
  );
  protected readonly editValue = signal('');
  private readonly editPreviousValue = signal<unknown>(null);
  private readonly resizeState = signal<TreeTableResizeState | null>(null);
  protected readonly resizingField = computed(() => this.resizeState()?.field ?? null);
  private readonly draggedColumn = signal<string | null>(null);
  private readonly tableId = `aeris-tree-table-${++treeTableId}`;
  private resizeListenersCleanup: (() => void) | null = null;
  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
      this.stopResizeListeners();
    });
  }

  protected readonly treeField = computed(
    () => this.treeColumn() || this.columns()[0]?.field || '',
  );
  protected readonly hasFilters = computed(
    () =>
      Boolean(this.globalFilterValue().trim()) || Object.values(this.columnFilters()).some(Boolean),
  );
  private readonly filteredRoots = computed(() => {
    if (this.lazy()) return this.value();
    return this.filterNodes(this.value());
  });
  private readonly sortedRoots = computed(() =>
    this.lazy() ? this.filteredRoots() : this.sortNodes(this.filteredRoots(), this.sorts()),
  );
  private readonly pageRoots = computed(() => {
    if (!this.paginator() || this.lazy()) return this.sortedRoots();
    return this.sortedRoots().slice(this.first(), this.first() + this.rows());
  });
  private readonly structure = computed(() =>
    this.flattenNodes(this.pageRoots(), 1, null, this.hasFilters(), new Set(this.expandedKeys())),
  );
  private readonly resolvedActiveKey = computed(() => {
    const structure = this.structure();
    const activeKey = this.activeKey();
    return structure.some((entry) => entry.key === activeKey)
      ? activeKey
      : (structure.find((entry) => !entry.node.disabled)?.key ?? structure[0]?.key ?? null);
  });
  private readonly selectionStates = computed(() => this.buildSelectionStates(this.value()));
  protected readonly renderedColumns = computed<readonly TreeTableRenderedColumn[]>(() => {
    const frozenWidths: string[] = [];
    return this.columns().map((column) => {
      const frozenLeft = column.frozen
        ? frozenWidths.length
          ? `calc(${frozenWidths.join(' + ')})`
          : '0px'
        : null;
      if (column.frozen) frozenWidths.push(column.width ?? '12rem');
      return { ...column, frozenLeft };
    });
  });
  protected readonly renderedRows = computed<readonly TreeTableRenderedEntry<TData>[]>(() => {
    const selectionStates = this.selectionStates();
    const activeKey = this.resolvedActiveKey();
    const loadingKeys = new Set(this.loadingKeys());
    const fields = this.columns().map((column) => column.field);
    return this.structure().map((entry, index) => {
      const state = selectionStates.get(entry.key) ?? { selected: false, partial: false };
      const values = Object.fromEntries(fields.map((field) => [field, entry.node.data[field]]));
      const disabled = entry.node.disabled === true;
      return {
        ...entry,
        id: `${this.tableId}-row-${index}`,
        active: entry.key === activeKey,
        disabled,
        selected: state.selected,
        partial: state.partial,
        loading: loadingKeys.has(entry.key),
        tabIndex: entry.key === activeKey && !disabled ? 0 : -1,
        values,
      };
    });
  });
  protected readonly columnSpan = computed(() => Math.max(1, this.columns().length));
  protected readonly paginatorTotal = computed(() =>
    this.lazy() ? this.totalRecords() : this.sortedRoots().length,
  );
  protected readonly totalRowCount = computed(() =>
    this.lazy() && this.totalRecords() ? this.totalRecords() : this.countNodes(this.sortedRoots()),
  );

  public focus(key?: string): void {
    const target = key ?? this.resolvedActiveKey();
    if (target) this.focusKey(target);
  }

  public expandAll(): void {
    this.expandedKeys.set(this.collectExpandableKeys(this.value()));
  }

  public collapseAll(): void {
    this.expandedKeys.set([]);
  }

  public clearFilters(): void {
    this.globalFilterValue.set('');
    this.columnFilters.set({});
    this.first.set(0);
    this.emitFilter(null);
  }

  public startEdit(key: string, field: string): void {
    const entry = this.renderedRows().find((row) => row.key === key);
    const column = this.columns().find((item) => item.field === field);
    if (!entry || !column) return;
    this.beginEdit(entry, column, new Event('edit'));
  }

  protected activate(key: string): void {
    this.activeKey.set(key);
  }

  protected ariaSort(field: string): 'ascending' | 'descending' | null {
    const direction = this.sortDirection(field);
    return direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : null;
  }

  protected sortDirection(field: string): AerisTreeTableSortDirection | null {
    return this.sorts().find((sort) => sort.field === field)?.direction ?? null;
  }

  protected sortAriaLabel(column: AerisTreeTableColumn): string {
    const direction = this.sortDirection(column.field);
    return direction
      ? `${column.header}, sorted ${direction === 'asc' ? 'ascending' : 'descending'}`
      : `Sort by ${column.header}`;
  }

  protected toggleSort(column: AerisTreeTableColumn, originalEvent: Event): void {
    if (!column.sortable) return;
    const current = this.sortDirection(column.field);
    let next: AerisTreeTableSortDirection | null =
      current === null ? 'asc' : current === 'asc' ? 'desc' : null;
    if (!this.removableSort() && next === null) next = 'asc';
    let sorts =
      this.sortMode() === 'multiple'
        ? this.sorts().filter((sort) => sort.field !== column.field)
        : [];
    if (next) sorts = [...sorts, { field: column.field, direction: next }];
    this.sorts.set(sorts);
    this.first.set(0);
    this.sorted.emit({ originalEvent, sorts });
    this.emitLazyLoad();
  }

  protected handleGlobalFilter(originalEvent: Event): void {
    this.globalFilterValue.set((originalEvent.target as HTMLInputElement).value);
    this.first.set(0);
    this.emitFilter(originalEvent);
  }

  protected columnFilterValue(field: string): string {
    return this.columnFilters()[field] ?? '';
  }

  protected columnFilterPlaceholderText(column: AerisTreeTableColumn): string {
    return this.columnFilterPlaceholder() || `Filter ${column.header}`;
  }

  protected handleColumnFilter(field: string, originalEvent: Event): void {
    const value = (originalEvent.target as HTMLInputElement).value;
    this.columnFilters.set({ ...this.columnFilters(), [field]: value });
    this.first.set(0);
    this.emitFilter(originalEvent);
  }

  protected toggleNode(entry: TreeTableRenderedEntry<TData>, originalEvent: Event): void {
    originalEvent.stopPropagation();
    if (entry.disabled || !entry.expandable || entry.loading) return;
    const keys = new Set(this.expandedKeys());
    if (entry.expanded) {
      keys.delete(entry.key);
      this.expandedKeys.set([...keys]);
      this.nodeCollapsed.emit({ originalEvent, node: entry.node, key: entry.key });
    } else {
      keys.add(entry.key);
      this.expandedKeys.set([...keys]);
      this.nodeExpanded.emit({ originalEvent, node: entry.node, key: entry.key });
    }
  }

  protected handleRowClick(entry: TreeTableRenderedEntry<TData>, originalEvent: MouseEvent): void {
    this.activeKey.set(entry.key);
    (originalEvent.currentTarget as HTMLElement).focus();
    if (
      entry.disabled ||
      !this.selectionMode() ||
      this.selectionMode() === 'checkbox' ||
      entry.node.selectable === false ||
      (originalEvent.target as HTMLElement).closest('button,input,a,select,textarea')
    )
      return;
    this.toggleSelection(entry, originalEvent);
  }

  protected toggleSelection(entry: TreeTableRenderedEntry<TData>, originalEvent: Event): void {
    originalEvent.stopPropagation();
    const mode = this.selectionMode();
    if (!mode || entry.disabled || entry.node.selectable === false) return;
    const keys = new Set(this.selectionKeys());
    const selected = entry.partial || !entry.selected;
    if (mode === 'single') {
      keys.clear();
      if (selected) keys.add(entry.key);
    } else if (mode === 'checkbox' && this.propagateSelection()) {
      for (const key of this.collectSelectableKeys(entry.node)) {
        if (selected) keys.add(key);
        else keys.delete(key);
      }
    } else if (selected) keys.add(entry.key);
    else keys.delete(entry.key);
    const selectedKeys = [...keys];
    this.selectionKeys.set(selectedKeys);
    const event = { originalEvent, node: entry.node, key: entry.key, selected, selectedKeys };
    this.selectionChanged.emit(event);
    if (selected) this.nodeSelected.emit(event);
    else this.nodeUnselected.emit(event);
  }

  protected handleRowKeydown(
    entry: TreeTableRenderedEntry<TData>,
    originalEvent: KeyboardEvent,
  ): void {
    const rows = this.renderedRows();
    const index = rows.findIndex((row) => row.key === entry.key);
    switch (originalEvent.key) {
      case 'ArrowDown':
        originalEvent.preventDefault();
        this.focusKey(rows[Math.min(index + 1, rows.length - 1)]?.key);
        return;
      case 'ArrowUp':
        originalEvent.preventDefault();
        this.focusKey(rows[Math.max(index - 1, 0)]?.key);
        return;
      case 'ArrowRight':
        if (!entry.expandable) return;
        originalEvent.preventDefault();
        if (!entry.expanded) this.toggleNode(entry, originalEvent);
        else this.focusKey(rows.find((row) => row.parentKey === entry.key)?.key);
        return;
      case 'ArrowLeft':
        originalEvent.preventDefault();
        if (entry.expandable && entry.expanded) this.toggleNode(entry, originalEvent);
        else this.focusKey(entry.parentKey ?? entry.key);
        return;
      case 'Home':
        originalEvent.preventDefault();
        this.focusKey(rows[0]?.key);
        return;
      case 'End':
        originalEvent.preventDefault();
        this.focusKey(rows[rows.length - 1]?.key);
        return;
      case 'Enter':
      case ' ':
        originalEvent.preventDefault();
        if (this.selectionMode() && entry.node.selectable !== false) {
          this.toggleSelection(entry, originalEvent);
        } else if (entry.expandable) {
          this.toggleNode(entry, originalEvent);
        }
        return;
      default:
        if (
          (originalEvent.ctrlKey || originalEvent.metaKey) &&
          originalEvent.key.toLowerCase() === 'a'
        ) {
          this.selectVisibleRows(originalEvent);
          return;
        }
        this.handleTypeahead(originalEvent, index);
    }
  }

  protected displayValue(value: unknown): string {
    if (value == null) return '';
    if (value instanceof Date) return value.toLocaleDateString();
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

  protected cellContext(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
    rowIndex: number,
  ): AerisTreeTableCellContext<TData> {
    const value = entry.values[column.field];
    return {
      $implicit: value,
      value,
      node: entry.node,
      data: entry.node.data,
      column,
      rowIndex,
      level: entry.level,
      expanded: entry.expanded,
      selected: entry.selected,
      leaf: !entry.expandable,
    };
  }

  protected isEditing(key: string, field: string): boolean {
    const editing = this.editingCell();
    return editing?.key === key && editing.field === field;
  }

  protected isCellEditable(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
  ): boolean {
    return this.editable() && column.editable === true && !entry.disabled;
  }

  protected startCellEdit(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
    originalEvent: MouseEvent,
  ): void {
    if ((originalEvent.target as HTMLElement).closest('button,input,a,select,textarea')) return;
    this.beginEdit(entry, column, originalEvent);
  }

  protected handleEditKeydown(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
    originalEvent: KeyboardEvent,
  ): void {
    if (originalEvent.key === 'Enter') {
      originalEvent.preventDefault();
      this.commitEdit(entry, column, originalEvent);
    } else if (originalEvent.key === 'Escape') {
      originalEvent.preventDefault();
      this.cancelEdit(entry, column, originalEvent);
    }
  }

  protected commitEdit(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
    originalEvent: Event,
  ): void {
    if (!this.isEditing(entry.key, column.field)) return;
    const previousValue = this.editPreviousValue();
    const value = this.editValue();
    this.value.set(this.updateNodeData(this.value(), entry.key, column.field, value));
    this.editingCell.set(null);
    this.cellEdited.emit({
      originalEvent,
      node: entry.node,
      key: entry.key,
      field: column.field,
      previousValue,
      value,
    });
    queueMicrotask(() => this.focusKey(entry.key));
  }

  protected handlePage(event: AerisPaginatorPageEvent): void {
    const pageEvent = {
      first: event.first,
      rows: event.rows,
      page: event.page,
      pageCount: event.pageCount,
    };
    this.pageChanged.emit(pageEvent);
    this.emitLazyLoad();
  }

  protected handleResizeStart(
    field: string,
    columnIndex: number,
    originalEvent: PointerEvent,
  ): void {
    if (!this.resizableColumns()) return;
    const column = this.renderedColumns()[columnIndex];
    const adjacentColumn = this.renderedColumns()[columnIndex + 1];
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

  private beginEdit(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
    originalEvent: Event,
  ): void {
    if (!this.editable() || !column.editable || entry.disabled) return;
    const previousValue = entry.node.data[column.field];
    this.editPreviousValue.set(previousValue);
    this.editValue.set(this.displayValue(previousValue));
    this.editingCell.set({ key: entry.key, field: column.field });
    this.editStarted.emit({
      originalEvent,
      node: entry.node,
      key: entry.key,
      field: column.field,
      previousValue,
      value: previousValue,
    });
    queueMicrotask(() => this.cellEditor()?.nativeElement.focus());
  }

  private cancelEdit(
    entry: TreeTableRenderedEntry<TData>,
    column: AerisTreeTableColumn,
    originalEvent: Event,
  ): void {
    const previousValue = this.editPreviousValue();
    this.editingCell.set(null);
    this.editCancelled.emit({
      originalEvent,
      node: entry.node,
      key: entry.key,
      field: column.field,
      previousValue,
      value: previousValue,
    });
    queueMicrotask(() => this.focusKey(entry.key));
  }

  private filterNodes(
    nodes: readonly AerisTreeTableNode<TData>[],
  ): readonly AerisTreeTableNode<TData>[] {
    if (!this.hasFilters()) return nodes;
    const result: AerisTreeTableNode<TData>[] = [];
    for (const node of nodes) {
      const matches = this.nodeMatches(node);
      if (matches && this.filterStrategy() === 'subtree') {
        result.push(node);
        continue;
      }
      const children = this.filterNodes(node.children ?? []);
      if (matches || children.length) result.push({ ...node, children });
    }
    return result;
  }

  private nodeMatches(node: AerisTreeTableNode<TData>): boolean {
    const global = this.globalFilterValue().trim().toLocaleLowerCase();
    if (global) {
      const searchable = this.columns().filter((column) => column.filterable !== false);
      if (
        !searchable.some((column) =>
          this.displayValue(node.data[column.field]).toLocaleLowerCase().includes(global),
        )
      ) {
        return false;
      }
    }
    for (const [field, rawValue] of Object.entries(this.columnFilters())) {
      const query = rawValue.trim().toLocaleLowerCase();
      if (query && !this.displayValue(node.data[field]).toLocaleLowerCase().includes(query))
        return false;
    }
    return true;
  }

  private sortNodes(
    nodes: readonly AerisTreeTableNode<TData>[],
    sorts: readonly AerisTreeTableSort[],
  ): readonly AerisTreeTableNode<TData>[] {
    if (!sorts.length) return nodes;
    return [...nodes]
      .sort((left, right) => {
        for (const sort of sorts) {
          const compared = this.compare(left.data[sort.field], right.data[sort.field]);
          if (compared) return sort.direction === 'asc' ? compared : -compared;
        }
        return 0;
      })
      .map((node) =>
        node.children?.length ? { ...node, children: this.sortNodes(node.children, sorts) } : node,
      );
  }

  private compare(left: unknown, right: unknown): number {
    if (left == null && right == null) return 0;
    if (left == null) return -1;
    if (right == null) return 1;
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    return String(left).localeCompare(String(right), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  private flattenNodes(
    nodes: readonly AerisTreeTableNode<TData>[],
    level: number,
    parentKey: string | null,
    forceExpanded: boolean,
    expandedKeys: ReadonlySet<string>,
  ): readonly TreeTableStructureEntry<TData>[] {
    const entries: TreeTableStructureEntry<TData>[] = [];
    nodes.forEach((node, index) => {
      const expandable = Boolean(node.children?.length) || node.leaf === false;
      const expanded = expandable && (forceExpanded || expandedKeys.has(node.key));
      entries.push({
        node,
        key: node.key,
        level,
        parentKey,
        position: index + 1,
        setSize: nodes.length,
        expanded,
        expandable,
      });
      if (expanded && node.children?.length) {
        entries.push(
          ...this.flattenNodes(node.children, level + 1, node.key, forceExpanded, expandedKeys),
        );
      }
    });
    return entries;
  }

  private buildSelectionStates(
    nodes: readonly AerisTreeTableNode<TData>[],
  ): ReadonlyMap<string, TreeTableSelectionState> {
    const result = new Map<string, TreeTableSelectionState>();
    const keys = new Set(this.selectionKeys());
    const cascade = this.selectionMode() === 'checkbox' && this.propagateSelection();
    const visit = (node: AerisTreeTableNode<TData>): { selected: number; selectable: number } => {
      let selectable = node.disabled || node.selectable === false ? 0 : 1;
      let selected = selectable && keys.has(node.key) ? 1 : 0;
      for (const child of node.children ?? []) {
        const state = visit(child);
        selectable += state.selectable;
        selected += state.selected;
      }
      result.set(
        node.key,
        cascade
          ? {
              selected: selectable > 0 && selected === selectable,
              partial: selected > 0 && selected < selectable,
            }
          : { selected: keys.has(node.key), partial: false },
      );
      return { selected, selectable };
    };
    nodes.forEach(visit);
    return result;
  }

  private collectSelectableKeys(node: AerisTreeTableNode<TData>): readonly string[] {
    const keys: string[] = [];
    if (!node.disabled && node.selectable !== false) keys.push(node.key);
    for (const child of node.children ?? []) keys.push(...this.collectSelectableKeys(child));
    return keys;
  }

  private collectExpandableKeys(nodes: readonly AerisTreeTableNode<TData>[]): readonly string[] {
    const keys: string[] = [];
    for (const node of nodes) {
      if (node.children?.length || node.leaf === false) keys.push(node.key);
      if (node.children?.length) keys.push(...this.collectExpandableKeys(node.children));
    }
    return keys;
  }

  private selectVisibleRows(originalEvent: Event): void {
    if (this.selectionMode() !== 'multiple') return;
    originalEvent.preventDefault();
    const keys = this.renderedRows()
      .filter((row) => !row.disabled && row.node.selectable !== false)
      .map((row) => row.key);
    this.selectionKeys.set([...new Set([...this.selectionKeys(), ...keys])]);
  }

  private handleTypeahead(originalEvent: KeyboardEvent, currentIndex: number): void {
    if (
      originalEvent.ctrlKey ||
      originalEvent.metaKey ||
      originalEvent.altKey ||
      originalEvent.key.length !== 1
    )
      return;
    this.typeahead += originalEvent.key.toLocaleLowerCase();
    if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = '';
    }, 500);
    const rows = this.renderedRows();
    const ordered = [...rows.slice(currentIndex + 1), ...rows.slice(0, currentIndex + 1)];
    const match = ordered.find((row) =>
      this.displayValue(row.node.data[this.treeField()])
        .toLocaleLowerCase()
        .startsWith(this.typeahead),
    );
    if (match) {
      originalEvent.preventDefault();
      this.focusKey(match.key);
    }
  }

  private focusKey(key: string | undefined): void {
    if (!key) return;
    this.activeKey.set(key);
    this.rowElements()
      .find((row) => row.nativeElement.dataset['rowKey'] === key)
      ?.nativeElement.focus();
  }

  private emitFilter(originalEvent: Event | null): void {
    this.filtered.emit({
      originalEvent,
      globalValue: this.globalFilterValue(),
      columnFilters: this.columnFilters(),
      value: this.filteredRoots(),
    });
    this.emitLazyLoad();
  }

  private emitLazyLoad(): void {
    if (!this.lazy()) return;
    this.lazyLoad.emit({
      first: this.first(),
      rows: this.rows(),
      sorts: this.sorts(),
      globalValue: this.globalFilterValue(),
      columnFilters: this.columnFilters(),
    });
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

  private updateNodeData(
    nodes: readonly AerisTreeTableNode<TData>[],
    key: string,
    field: string,
    value: unknown,
  ): readonly AerisTreeTableNode<TData>[] {
    return nodes.map((node) => {
      if (node.key === key) return { ...node, data: { ...node.data, [field]: value } as TData };
      return node.children?.length
        ? { ...node, children: this.updateNodeData(node.children, key, field, value) }
        : node;
    });
  }

  private countNodes(nodes: readonly AerisTreeTableNode<TData>[]): number {
    return nodes.reduce((count, node) => count + 1 + this.countNodes(node.children ?? []), 0);
  }
}

export const AerisTreeTableModule = [
  AerisTreeTable,
  AerisTreeTableHeaderTemplate,
  AerisTreeTableCellTemplate,
  AerisTreeTableEmptyTemplate,
  AerisTreeTableLoadingTemplate,
] as const;
