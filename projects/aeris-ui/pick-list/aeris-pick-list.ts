import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
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

export type AerisPickListItem = object;
export type AerisPickListSide = 'source' | 'target';
export type AerisPickListDirection = 'to-source' | 'to-target';
export type AerisPickListFilterMatchMode = 'contains' | 'startsWith';

export interface AerisPickListSelectionEvent<TItem = AerisPickListItem> {
  readonly originalEvent: Event;
  readonly side: AerisPickListSide;
  readonly selectedKeys: readonly string[];
  readonly selectedItems: readonly TItem[];
}

export interface AerisPickListTransferEvent<TItem = AerisPickListItem> {
  readonly originalEvent: Event | null;
  readonly direction: AerisPickListDirection;
  readonly items: readonly TItem[];
  readonly source: readonly TItem[];
  readonly target: readonly TItem[];
}

export interface AerisPickListReorderEvent<TItem = AerisPickListItem> {
  readonly originalEvent: Event | null;
  readonly side: AerisPickListSide;
  readonly items: readonly TItem[];
  readonly selectedKeys: readonly string[];
}

export interface AerisPickListFilterEvent {
  readonly originalEvent: Event;
  readonly side: AerisPickListSide;
  readonly value: string;
}

export interface AerisPickListDragEvent<TItem = AerisPickListItem> {
  readonly originalEvent: DragEvent;
  readonly side: AerisPickListSide;
  readonly item: TItem;
  readonly key: string;
  readonly selectedKeys: readonly string[];
}

interface AerisPickListItemContext<TItem = AerisPickListItem> {
  readonly $implicit: TItem;
  readonly item: TItem;
  readonly side: AerisPickListSide;
  readonly selected: boolean;
  readonly index: number;
}

interface AerisPickListEmptyContext {
  readonly side: AerisPickListSide;
  readonly filtering: boolean;
}

interface AerisPickListEntry<TItem> {
  readonly item: TItem;
  readonly key: string;
  readonly index: number;
  readonly optionId: string;
}

interface AerisPickListDragState<TItem> {
  readonly side: AerisPickListSide;
  readonly item: TItem;
  readonly key: string;
  readonly keys: readonly string[];
}

interface AerisPickListDropTarget {
  readonly side: AerisPickListSide;
  readonly beforeKey: string | null;
}

@Directive({ selector: 'ng-template[aerisPickListItem]' })
export class AerisPickListItemTemplate<TItem = AerisPickListItem> {
  readonly template = inject<TemplateRef<AerisPickListItemContext<TItem>>>(TemplateRef);

  static ngTemplateContextGuard<TItem>(
    _directive: AerisPickListItemTemplate<TItem>,
    context: unknown,
  ): context is AerisPickListItemContext<TItem> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisPickListEmpty]' })
export class AerisPickListEmptyTemplate {
  readonly template = inject<TemplateRef<AerisPickListEmptyContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: AerisPickListEmptyTemplate,
    context: unknown,
  ): context is AerisPickListEmptyContext {
    return true;
  }
}

let nextPickListId = 0;

@Component({
  selector: 'aeris-pick-list',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-pick-list"
      role="group"
      [attr.aria-label]="ariaLabel()"
      [attr.data-disabled]="disabled() || null"
      [attr.data-fluid]="fluid() || null"
    >
      <ng-template #reorderControls let-controlSide>
        <div class="aeris-pick-list__reorder-controls" [attr.aria-label]="paneHeader(controlSide) + ' reorder controls'">
          <button type="button" [disabled]="!canReorder(controlSide, 'top')" [attr.aria-label]="'Move selected ' + paneHeader(controlSide) + ' items to top'" (click)="moveSelectedToTop(controlSide, $event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M4 4h12M5 12l5-5 5 5" /></svg>
          </button>
          <button type="button" [disabled]="!canReorder(controlSide, 'up')" [attr.aria-label]="'Move selected ' + paneHeader(controlSide) + ' items up'" (click)="moveSelectedUp(controlSide, $event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M5 12l5-5 5 5" /></svg>
          </button>
          <button type="button" [disabled]="!canReorder(controlSide, 'down')" [attr.aria-label]="'Move selected ' + paneHeader(controlSide) + ' items down'" (click)="moveSelectedDown(controlSide, $event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" /></svg>
          </button>
          <button type="button" [disabled]="!canReorder(controlSide, 'bottom')" [attr.aria-label]="'Move selected ' + paneHeader(controlSide) + ' items to bottom'" (click)="moveSelectedToBottom(controlSide, $event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5M4 16h12" /></svg>
          </button>
        </div>
      </ng-template>

      <ng-template #pane let-side>
        <section class="aeris-pick-list__pane" [attr.aria-label]="paneHeader(side)">
          <header class="aeris-pick-list__header">
            <strong>{{ paneHeader(side) }}</strong>
            <span>{{ collection(side).length }}</span>
          </header>

          @if (showFilter()) {
            <label class="aeris-pick-list__filter">
              <span class="aeris-pick-list__visually-hidden">{{ filterAriaLabel(side) }}</span>
              <span class="aeris-pick-list__search-icon" aria-hidden="true"></span>
              <input
                type="search"
                autocomplete="off"
                [disabled]="disabled()"
                [placeholder]="filterPlaceholder(side)"
                [value]="filterValue(side)"
                (input)="updateFilter(side, $event)"
              />
            </label>
          }

          <div class="aeris-pick-list__pane-body" [attr.data-side]="side">
            @if (side === 'source' && showReorderControls(side)) {
              <ng-container [ngTemplateOutlet]="reorderControls" [ngTemplateOutletContext]="{ $implicit: side }" />
            }

            <div
              class="aeris-pick-list__viewport"
              role="listbox"
              aria-multiselectable="true"
              [attr.aria-label]="paneAriaLabel(side)"
              [attr.aria-activedescendant]="activeDescendant(side)"
              [attr.tabindex]="disabled() ? null : 0"
              (keydown)="handleListKeydown(side, $event)"
              (dragover)="handleViewportDragOver(side, $event)"
              (drop)="handleDrop(side, null, $event)"
            >
              @for (entry of filteredEntries(side); track entry.key) {
                <div
                  class="aeris-pick-list__item"
                  role="option"
                  [id]="entry.optionId"
                  [attr.aria-selected]="isSelected(side, entry.key)"
                  [attr.data-selected]="isSelected(side, entry.key) || null"
                  [attr.data-active]="isActive(side, entry.key) || null"
                  [attr.data-dragging]="isDragging(side, entry.key) || null"
                  [attr.data-drop-target]="isDropTarget(side, entry.key) || null"
                  [draggable]="dragDrop() && !disabled()"
                  (click)="toggleItem(side, entry, $event)"
                  (dblclick)="handleItemDoubleClick(side, entry, $event)"
                  (dragstart)="handleDragStart(side, entry, $event)"
                  (dragover)="handleItemDragOver(side, entry.key, $event)"
                  (drop)="handleDrop(side, entry.key, $event)"
                  (dragend)="handleDragEnd($event)"
                >
                  @if (itemTemplate(); as customItem) {
                    <ng-container
                      [ngTemplateOutlet]="customItem.template"
                      [ngTemplateOutletContext]="{
                        $implicit: entry.item,
                        item: entry.item,
                        side,
                        selected: isSelected(side, entry.key),
                        index: entry.index
                      }"
                    />
                  } @else {
                    <span>{{ itemLabel(entry.item) }}</span>
                  }
                </div>
              } @empty {
                <div class="aeris-pick-list__empty" role="status">
                  @if (emptyTemplate(); as customEmpty) {
                    <ng-container
                      [ngTemplateOutlet]="customEmpty.template"
                      [ngTemplateOutletContext]="{ side, filtering: isFiltering(side) }"
                    />
                  } @else {
                    {{ emptyText(side) }}
                  }
                </div>
              }
            </div>

            @if (side === 'target' && showReorderControls(side)) {
              <ng-container [ngTemplateOutlet]="reorderControls" [ngTemplateOutletContext]="{ $implicit: side }" />
            }
          </div>
        </section>
      </ng-template>

      <ng-container [ngTemplateOutlet]="pane" [ngTemplateOutletContext]="{ $implicit: 'source' }" />

      @if (showTransferControls()) {
        <div class="aeris-pick-list__transfer-controls" aria-label="Transfer controls">
          <button type="button" [disabled]="!canTransfer('to-target', false)" [attr.aria-label]="moveToTargetAriaLabel()" (click)="moveSelectedToTarget($event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" /></svg>
          </button>
          <button type="button" [disabled]="!canTransfer('to-target', true)" [attr.aria-label]="moveAllToTargetAriaLabel()" (click)="moveAllToTarget($event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5M16 4v12" /></svg>
          </button>
          <button type="button" [disabled]="!canTransfer('to-source', false)" [attr.aria-label]="moveToSourceAriaLabel()" (click)="moveSelectedToSource($event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M13 5l-5 5 5 5" /></svg>
          </button>
          <button type="button" [disabled]="!canTransfer('to-source', true)" [attr.aria-label]="moveAllToSourceAriaLabel()" (click)="moveAllToSource($event)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20"><path d="M13 5l-5 5 5 5M4 4v12" /></svg>
          </button>
        </div>
      }

      <ng-container [ngTemplateOutlet]="pane" [ngTemplateOutletContext]="{ $implicit: 'target' }" />
      <span class="aeris-pick-list__visually-hidden" role="status" aria-live="polite">{{ announcement() }}</span>
    </div>
  `,
  styleUrl: './aeris-pick-list.scss',
})
export class AerisPickList<TItem extends AerisPickListItem = AerisPickListItem> {
  private readonly componentId = `aeris-pick-list-${++nextPickListId}`;
  private readonly activeSourceKey = signal<string | null>(null);
  private readonly activeTargetKey = signal<string | null>(null);
  private readonly sourceSelectionAnchor = signal<string | null>(null);
  private readonly targetSelectionAnchor = signal<string | null>(null);
  private readonly dragState = signal<AerisPickListDragState<TItem> | null>(null);
  private readonly dropTarget = signal<AerisPickListDropTarget | null>(null);

  readonly source = model<readonly TItem[]>([]);
  readonly target = model<readonly TItem[]>([]);
  readonly sourceSelectedKeys = model<readonly string[]>([]);
  readonly targetSelectedKeys = model<readonly string[]>([]);
  readonly sourceFilter = model('');
  readonly targetFilter = model('');

  readonly optionLabel = input('label');
  readonly dataKey = input('id');
  readonly filterBy = input('label');
  readonly filterMatchMode = input<AerisPickListFilterMatchMode>('contains');
  readonly sourceHeader = input('Available');
  readonly targetHeader = input('Selected');
  readonly sourceAriaLabel = input('Available items');
  readonly targetAriaLabel = input('Selected items');
  readonly ariaLabel = input('Item transfer');
  readonly sourceFilterPlaceholder = input('Filter available items');
  readonly targetFilterPlaceholder = input('Filter selected items');
  readonly sourceFilterAriaLabel = input('Filter available items');
  readonly targetFilterAriaLabel = input('Filter selected items');
  readonly sourceEmptyMessage = input('No available items');
  readonly targetEmptyMessage = input('No selected items');
  readonly sourceFilterEmptyMessage = input('No available items match the filter');
  readonly targetFilterEmptyMessage = input('No selected items match the filter');
  readonly showFilter = input(false, { transform: booleanAttribute });
  readonly showSourceControls = input(true, { transform: booleanAttribute });
  readonly showTargetControls = input(true, { transform: booleanAttribute });
  readonly showTransferControls = input(true, { transform: booleanAttribute });
  readonly transferOnDoubleClick = input(false, { transform: booleanAttribute });
  readonly dragDrop = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly targetLimit = input<number | null>(null);
  readonly moveToTargetAriaLabel = input('Move selected items to selected list');
  readonly moveAllToTargetAriaLabel = input('Move all items to selected list');
  readonly moveToSourceAriaLabel = input('Move selected items to available list');
  readonly moveAllToSourceAriaLabel = input('Move all items to available list');

  readonly selectionChanged = output<AerisPickListSelectionEvent<TItem>>();
  readonly transferred = output<AerisPickListTransferEvent<TItem>>();
  readonly movedToTarget = output<AerisPickListTransferEvent<TItem>>();
  readonly movedToSource = output<AerisPickListTransferEvent<TItem>>();
  readonly reordered = output<AerisPickListReorderEvent<TItem>>();
  readonly sourceReordered = output<AerisPickListReorderEvent<TItem>>();
  readonly targetReordered = output<AerisPickListReorderEvent<TItem>>();
  readonly filterChanged = output<AerisPickListFilterEvent>();
  readonly dragStarted = output<AerisPickListDragEvent<TItem>>();
  readonly dragEnded = output<AerisPickListDragEvent<TItem>>();

  protected readonly itemTemplate = contentChild(AerisPickListItemTemplate<TItem>);
  protected readonly emptyTemplate = contentChild(AerisPickListEmptyTemplate);
  protected readonly announcement = signal('');
  protected readonly filterProperties = computed(() =>
    this.filterBy()
      .split(',')
      .map((property) => property.trim())
      .filter(Boolean),
  );
  protected readonly sourceEntries = computed(() => this.createEntries('source', this.source()));
  protected readonly targetEntries = computed(() => this.createEntries('target', this.target()));
  protected readonly filteredSourceEntries = computed(() =>
    this.filterEntries(this.sourceEntries(), this.sourceFilter()),
  );
  protected readonly filteredTargetEntries = computed(() =>
    this.filterEntries(this.targetEntries(), this.targetFilter()),
  );

  protected collection(side: AerisPickListSide): readonly TItem[] {
    return side === 'source' ? this.source() : this.target();
  }

  protected filteredEntries(side: AerisPickListSide): readonly AerisPickListEntry<TItem>[] {
    return side === 'source' ? this.filteredSourceEntries() : this.filteredTargetEntries();
  }

  protected paneHeader(side: AerisPickListSide): string {
    return side === 'source' ? this.sourceHeader() : this.targetHeader();
  }

  protected paneAriaLabel(side: AerisPickListSide): string {
    return side === 'source' ? this.sourceAriaLabel() : this.targetAriaLabel();
  }

  protected filterPlaceholder(side: AerisPickListSide): string {
    return side === 'source' ? this.sourceFilterPlaceholder() : this.targetFilterPlaceholder();
  }

  protected filterAriaLabel(side: AerisPickListSide): string {
    return side === 'source' ? this.sourceFilterAriaLabel() : this.targetFilterAriaLabel();
  }

  protected filterValue(side: AerisPickListSide): string {
    return side === 'source' ? this.sourceFilter() : this.targetFilter();
  }

  protected isFiltering(side: AerisPickListSide): boolean {
    return Boolean(this.filterValue(side));
  }

  protected showReorderControls(side: AerisPickListSide): boolean {
    return side === 'source' ? this.showSourceControls() : this.showTargetControls();
  }

  protected itemLabel(item: TItem): string {
    const value = this.propertyValue(item, this.optionLabel());
    return value == null ? '' : String(value);
  }

  protected isSelected(side: AerisPickListSide, key: string): boolean {
    return this.selection(side).includes(key);
  }

  protected isActive(side: AerisPickListSide, key: string): boolean {
    return this.activeKey(side)() === key;
  }

  protected isDragging(side: AerisPickListSide, key: string): boolean {
    const state = this.dragState();
    return state?.side === side && state.keys.includes(key);
  }

  protected isDropTarget(side: AerisPickListSide, key: string): boolean {
    const target = this.dropTarget();
    return target?.side === side && target.beforeKey === key;
  }

  protected activeDescendant(side: AerisPickListSide): string | null {
    const entries = this.filteredEntries(side);
    const activeKey = this.activeKey(side)();
    return entries.find((entry) => entry.key === activeKey)?.optionId ?? entries[0]?.optionId ?? null;
  }

  protected emptyText(side: AerisPickListSide): string {
    const filtering = Boolean(this.filterValue(side));
    if (side === 'source') {
      return filtering ? this.sourceFilterEmptyMessage() : this.sourceEmptyMessage();
    }
    return filtering ? this.targetFilterEmptyMessage() : this.targetEmptyMessage();
  }

  protected updateFilter(side: AerisPickListSide, originalEvent: Event): void {
    const value = (originalEvent.target as HTMLInputElement).value;
    this.filterModel(side).set(value);
    this.activeKey(side).set(null);
    this.filterChanged.emit({ originalEvent, side, value });
  }

  protected toggleItem(
    side: AerisPickListSide,
    entry: AerisPickListEntry<TItem>,
    originalEvent: MouseEvent,
  ): void {
    if (this.disabled()) return;
    this.activeKey(side).set(entry.key);
    const current = this.selection(side);

    if (originalEvent.shiftKey && this.selectionAnchor(side)()) {
      const entries = this.filteredEntries(side);
      const anchorIndex = entries.findIndex((item) => item.key === this.selectionAnchor(side)());
      const entryIndex = entries.findIndex((item) => item.key === entry.key);
      if (anchorIndex >= 0 && entryIndex >= 0) {
        const start = Math.min(anchorIndex, entryIndex);
        const end = Math.max(anchorIndex, entryIndex);
        this.selectionModel(side).set([
          ...new Set([...current, ...entries.slice(start, end + 1).map((item) => item.key)]),
        ]);
      }
    } else {
      this.selectionAnchor(side).set(entry.key);
      this.selectionModel(side).set(
        current.includes(entry.key)
          ? current.filter((key) => key !== entry.key)
          : [...current, entry.key],
      );
    }

    this.emitSelection(side, originalEvent);
  }

  protected handleItemDoubleClick(
    side: AerisPickListSide,
    entry: AerisPickListEntry<TItem>,
    originalEvent: MouseEvent,
  ): void {
    if (!this.transferOnDoubleClick() || this.disabled()) return;
    this.transferKeys(side === 'source' ? 'to-target' : 'to-source', [entry.key], originalEvent);
  }

  protected handleDragStart(
    side: AerisPickListSide,
    entry: AerisPickListEntry<TItem>,
    originalEvent: DragEvent,
  ): void {
    if (!this.dragDrop() || this.disabled()) {
      originalEvent.preventDefault();
      return;
    }

    let keys = this.selection(side);
    if (!keys.includes(entry.key)) {
      keys = [entry.key];
      this.selectionModel(side).set(keys);
      this.emitSelection(side, originalEvent);
    }
    this.activeKey(side).set(entry.key);
    this.dragState.set({ side, item: entry.item, key: entry.key, keys });
    originalEvent.dataTransfer?.setData('text/plain', entry.key);
    if (originalEvent.dataTransfer) {
      originalEvent.dataTransfer.effectAllowed = 'move';
    }
    this.dragStarted.emit({
      originalEvent,
      side,
      item: entry.item,
      key: entry.key,
      selectedKeys: keys,
    });
  }

  protected handleItemDragOver(
    side: AerisPickListSide,
    beforeKey: string,
    originalEvent: DragEvent,
  ): void {
    if (!this.dragState() || this.disabled()) return;
    originalEvent.preventDefault();
    originalEvent.stopPropagation();
    if (originalEvent.dataTransfer) {
      originalEvent.dataTransfer.dropEffect = 'move';
    }
    this.dropTarget.set({ side, beforeKey });
  }

  protected handleViewportDragOver(side: AerisPickListSide, originalEvent: DragEvent): void {
    if (!this.dragState() || this.disabled()) return;
    originalEvent.preventDefault();
    if (originalEvent.dataTransfer) {
      originalEvent.dataTransfer.dropEffect = 'move';
    }
    this.dropTarget.set({ side, beforeKey: null });
  }

  protected handleDrop(
    side: AerisPickListSide,
    beforeKey: string | null,
    originalEvent: DragEvent,
  ): void {
    const state = this.dragState();
    if (!state || this.disabled()) return;
    originalEvent.preventDefault();
    originalEvent.stopPropagation();

    if (state.side === side) {
      if (!beforeKey || !state.keys.includes(beforeKey)) {
        this.reorderKeysBefore(side, state.keys, beforeKey, originalEvent);
      }
    } else {
      this.transferKeys(
        state.side === 'source' ? 'to-target' : 'to-source',
        state.keys,
        originalEvent,
        beforeKey,
      );
    }
    this.dropTarget.set(null);
  }

  protected handleDragEnd(originalEvent: DragEvent): void {
    const state = this.dragState();
    if (state) {
      this.dragEnded.emit({
        originalEvent,
        side: state.side,
        item: state.item,
        key: state.key,
        selectedKeys: state.keys,
      });
    }
    this.dragState.set(null);
    this.dropTarget.set(null);
  }

  protected handleListKeydown(side: AerisPickListSide, event: KeyboardEvent): void {
    if (this.disabled()) return;

    if (event.altKey) {
      if (event.key === 'ArrowRight' && side === 'source') {
        event.preventDefault();
        this.moveSelectedToTarget(event);
      } else if (event.key === 'ArrowLeft' && side === 'target') {
        event.preventDefault();
        this.moveSelectedToSource(event);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.moveSelectedUp(side, event);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.moveSelectedDown(side, event);
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.moveSelectedToTop(side, event);
      } else if (event.key === 'End') {
        event.preventDefault();
        this.moveSelectedToBottom(side, event);
      }
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      const keys = this.filteredEntries(side).map((entry) => entry.key);
      this.selectionModel(side).set([...new Set([...this.selection(side), ...keys])]);
      this.emitSelection(side, event);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActive(side, event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.moveActiveToEdge(side, event.key === 'Home' ? 'start' : 'end');
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleActive(side, event);
    }
  }

  protected canTransfer(direction: AerisPickListDirection, all: boolean): boolean {
    if (this.disabled()) return false;
    const side: AerisPickListSide = direction === 'to-target' ? 'source' : 'target';
    const count = all ? this.collection(side).length : this.selection(side).length;
    if (!count) return false;
    return direction !== 'to-target' || this.availableTargetSlots() > 0;
  }

  protected canReorder(side: AerisPickListSide, position: 'top' | 'up' | 'down' | 'bottom'): boolean {
    if (this.disabled()) return false;
    const indexes = this.selectedIndexes(side);
    if (!indexes.length) return false;
    return position === 'top' || position === 'up'
      ? Math.min(...indexes) > 0
      : Math.max(...indexes) < this.collection(side).length - 1;
  }

  moveSelectedToTarget(originalEvent: Event | null = null): void {
    this.transfer('to-target', false, originalEvent);
  }

  moveAllToTarget(originalEvent: Event | null = null): void {
    this.transfer('to-target', true, originalEvent);
  }

  moveSelectedToSource(originalEvent: Event | null = null): void {
    this.transfer('to-source', false, originalEvent);
  }

  moveAllToSource(originalEvent: Event | null = null): void {
    this.transfer('to-source', true, originalEvent);
  }

  moveSelectedUp(side: AerisPickListSide, originalEvent: Event | null = null): void {
    if (!this.canReorder(side, 'up')) return;
    this.reorderByStep(side, -1, originalEvent);
  }

  moveSelectedDown(side: AerisPickListSide, originalEvent: Event | null = null): void {
    if (!this.canReorder(side, 'down')) return;
    this.reorderByStep(side, 1, originalEvent);
  }

  moveSelectedToTop(side: AerisPickListSide, originalEvent: Event | null = null): void {
    if (!this.canReorder(side, 'top')) return;
    this.reorderToEdge(side, 'top', originalEvent);
  }

  moveSelectedToBottom(side: AerisPickListSide, originalEvent: Event | null = null): void {
    if (!this.canReorder(side, 'bottom')) return;
    this.reorderToEdge(side, 'bottom', originalEvent);
  }

  clearFilters(): void {
    this.sourceFilter.set('');
    this.targetFilter.set('');
  }

  private createEntries(
    side: AerisPickListSide,
    items: readonly TItem[],
  ): readonly AerisPickListEntry<TItem>[] {
    return items.map((item, index) => ({
      item,
      key: this.itemKey(item, index),
      index,
      optionId: `${this.componentId}-${side}-option-${index}`,
    }));
  }

  private filterEntries(
    entries: readonly AerisPickListEntry<TItem>[],
    filter: string,
  ): readonly AerisPickListEntry<TItem>[] {
    const query = filter.trim().toLocaleLowerCase();
    if (!query) return entries;

    return entries.filter((entry) =>
      this.filterProperties().some((property) => {
        const value = this.propertyValue(entry.item, property);
        if (value == null) return false;
        const candidate = String(value).toLocaleLowerCase();
        return this.filterMatchMode() === 'startsWith'
          ? candidate.startsWith(query)
          : candidate.includes(query);
      }),
    );
  }

  private itemKey(item: TItem, index: number): string {
    const value = this.propertyValue(item, this.dataKey());
    return value == null ? String(index) : String(value);
  }

  private selection(side: AerisPickListSide): readonly string[] {
    return side === 'source' ? this.sourceSelectedKeys() : this.targetSelectedKeys();
  }

  private selectionModel(side: AerisPickListSide) {
    return side === 'source' ? this.sourceSelectedKeys : this.targetSelectedKeys;
  }

  private filterModel(side: AerisPickListSide) {
    return side === 'source' ? this.sourceFilter : this.targetFilter;
  }

  private activeKey(side: AerisPickListSide) {
    return side === 'source' ? this.activeSourceKey : this.activeTargetKey;
  }

  private selectionAnchor(side: AerisPickListSide) {
    return side === 'source' ? this.sourceSelectionAnchor : this.targetSelectionAnchor;
  }

  private moveActive(side: AerisPickListSide, direction: -1 | 1): void {
    const entries = this.filteredEntries(side);
    if (!entries.length) return;
    const currentIndex = entries.findIndex((entry) => entry.key === this.activeKey(side)());
    const nextIndex = currentIndex < 0
      ? direction === 1 ? 0 : entries.length - 1
      : Math.max(0, Math.min(entries.length - 1, currentIndex + direction));
    this.activeKey(side).set(entries[nextIndex]?.key ?? null);
  }

  private moveActiveToEdge(side: AerisPickListSide, edge: 'start' | 'end'): void {
    const entries = this.filteredEntries(side);
    const entry = edge === 'start' ? entries[0] : entries[entries.length - 1];
    this.activeKey(side).set(entry?.key ?? null);
  }

  private toggleActive(side: AerisPickListSide, originalEvent: Event): void {
    const entries = this.filteredEntries(side);
    const activeKey = this.activeKey(side)() ?? entries[0]?.key;
    if (!activeKey) return;
    this.activeKey(side).set(activeKey);
    const selected = this.selection(side);
    this.selectionModel(side).set(
      selected.includes(activeKey)
        ? selected.filter((key) => key !== activeKey)
        : [...selected, activeKey],
    );
    this.selectionAnchor(side).set(activeKey);
    this.emitSelection(side, originalEvent);
  }

  private transfer(
    direction: AerisPickListDirection,
    all: boolean,
    originalEvent: Event | null,
  ): void {
    if (!this.canTransfer(direction, all)) return;
    const fromSide: AerisPickListSide = direction === 'to-target' ? 'source' : 'target';
    const entries = all
      ? this.collection(fromSide).map((item, index) => ({ item, key: this.itemKey(item, index) }))
      : this.collection(fromSide)
          .map((item, index) => ({ item, key: this.itemKey(item, index) }))
          .filter((entry) => this.selection(fromSide).includes(entry.key));
    const allowedEntries = direction === 'to-target'
      ? entries.slice(0, this.availableTargetSlots())
      : entries;
    this.transferKeys(direction, allowedEntries.map((entry) => entry.key), originalEvent);
  }

  private transferKeys(
    direction: AerisPickListDirection,
    keys: readonly string[],
    originalEvent: Event | null,
    beforeKey: string | null = null,
  ): void {
    if (this.disabled() || !keys.length) return;
    const fromSide: AerisPickListSide = direction === 'to-target' ? 'source' : 'target';
    const keySet = new Set(keys);
    const fromEntries = this.collection(fromSide).map((item, index) => ({
      item,
      key: this.itemKey(item, index),
    }));
    let movedEntries = fromEntries.filter((entry) => keySet.has(entry.key));
    if (direction === 'to-target') {
      movedEntries = movedEntries.slice(0, this.availableTargetSlots());
    }
    if (!movedEntries.length) return;

    const movedKeys = new Set(movedEntries.map((entry) => entry.key));
    const moved = movedEntries.map((entry) => entry.item);
    const remaining = fromEntries
      .filter((entry) => !movedKeys.has(entry.key))
      .map((entry) => entry.item);
    const destination = direction === 'to-target' ? this.target() : this.source();
    const destinationEntries = destination.map((item, index) => ({
      item,
      key: this.itemKey(item, index),
    }));
    const requestedIndex = beforeKey == null
      ? destinationEntries.length
      : destinationEntries.findIndex((entry) => entry.key === beforeKey);
    const insertionIndex = requestedIndex < 0 ? destinationEntries.length : requestedIndex;
    const nextDestination = [
      ...destination.slice(0, insertionIndex),
      ...moved,
      ...destination.slice(insertionIndex),
    ];

    if (direction === 'to-target') {
      this.source.set(remaining);
      this.target.set(nextDestination);
      this.sourceSelectedKeys.set(this.sourceSelectedKeys().filter((key) => !movedKeys.has(key)));
      this.activeSourceKey.set(null);
    } else {
      this.target.set(remaining);
      this.source.set(nextDestination);
      this.targetSelectedKeys.set(this.targetSelectedKeys().filter((key) => !movedKeys.has(key)));
      this.activeTargetKey.set(null);
    }

    const event: AerisPickListTransferEvent<TItem> = {
      originalEvent,
      direction,
      items: moved,
      source: this.source(),
      target: this.target(),
    };
    this.transferred.emit(event);
    if (direction === 'to-target') {
      this.movedToTarget.emit(event);
    } else {
      this.movedToSource.emit(event);
    }
    this.announcement.set(`${moved.length} item${moved.length === 1 ? '' : 's'} moved to ${direction === 'to-target' ? this.targetHeader() : this.sourceHeader()}.`);
  }

  private availableTargetSlots(): number {
    const limit = this.targetLimit();
    return limit == null ? Number.MAX_SAFE_INTEGER : Math.max(0, limit - this.target().length);
  }

  private selectedIndexes(side: AerisPickListSide): readonly number[] {
    const selected = new Set(this.selection(side));
    return this.collection(side)
      .map((item, index) => selected.has(this.itemKey(item, index)) ? index : -1)
      .filter((index) => index >= 0);
  }

  private reorderKeysBefore(
    side: AerisPickListSide,
    keys: readonly string[],
    beforeKey: string | null,
    originalEvent: Event | null,
  ): void {
    const keySet = new Set(keys);
    const entries = this.collection(side).map((item, index) => ({
      item,
      key: this.itemKey(item, index),
    }));
    const moving = entries.filter((entry) => keySet.has(entry.key));
    if (!moving.length) return;
    const remaining = entries.filter((entry) => !keySet.has(entry.key));
    const requestedIndex = beforeKey == null
      ? remaining.length
      : remaining.findIndex((entry) => entry.key === beforeKey);
    const insertionIndex = requestedIndex < 0 ? remaining.length : requestedIndex;
    const next = [
      ...remaining.slice(0, insertionIndex),
      ...moving,
      ...remaining.slice(insertionIndex),
    ].map((entry) => entry.item);
    this.setReordered(side, next, originalEvent);
  }

  private reorderByStep(
    side: AerisPickListSide,
    direction: -1 | 1,
    originalEvent: Event | null,
  ): void {
    const selected = new Set(this.selection(side));
    const next = [...this.collection(side)];
    const indexes = direction === -1
      ? this.selectedIndexes(side)
      : [...this.selectedIndexes(side)].sort((left, right) => right - left);

    for (const index of indexes) {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) continue;
      if (selected.has(this.itemKey(next[targetIndex], targetIndex))) continue;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    }
    this.setReordered(side, next, originalEvent);
  }

  private reorderToEdge(
    side: AerisPickListSide,
    edge: 'top' | 'bottom',
    originalEvent: Event | null,
  ): void {
    const selected = new Set(this.selection(side));
    const chosen = this.collection(side).filter((item, index) => selected.has(this.itemKey(item, index)));
    const remaining = this.collection(side).filter((item, index) => !selected.has(this.itemKey(item, index)));
    this.setReordered(side, edge === 'top' ? [...chosen, ...remaining] : [...remaining, ...chosen], originalEvent);
  }

  private setReordered(
    side: AerisPickListSide,
    items: readonly TItem[],
    originalEvent: Event | null,
  ): void {
    if (side === 'source') {
      this.source.set(items);
    } else {
      this.target.set(items);
    }
    const event: AerisPickListReorderEvent<TItem> = {
      originalEvent,
      side,
      items,
      selectedKeys: this.selection(side),
    };
    this.reordered.emit(event);
    if (side === 'source') {
      this.sourceReordered.emit(event);
    } else {
      this.targetReordered.emit(event);
    }
    this.announcement.set(`Selected ${this.paneHeader(side)} items reordered.`);
  }

  private emitSelection(side: AerisPickListSide, originalEvent: Event): void {
    const selected = new Set(this.selection(side));
    this.selectionChanged.emit({
      originalEvent,
      side,
      selectedKeys: this.selection(side),
      selectedItems: this.collection(side).filter((item, index) => selected.has(this.itemKey(item, index))),
    });
  }

  private propertyValue(item: TItem, property: string): unknown {
    return Object.prototype.hasOwnProperty.call(item, property)
      ? (item as Record<string, unknown>)[property]
      : undefined;
  }
}

export const AerisPickListModule = [
  AerisPickList,
  AerisPickListItemTemplate,
  AerisPickListEmptyTemplate,
] as const;
