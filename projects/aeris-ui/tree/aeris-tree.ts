import { NgTemplateOutlet } from '@angular/common';
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

export type AerisTreeSelectionMode = 'single' | 'multiple' | 'checkbox';
export type AerisTreeDropPosition = 'before' | 'inside' | 'after';

export interface AerisTreeNode<TData = unknown> {
  readonly key: string;
  readonly label: string;
  readonly children?: readonly AerisTreeNode<TData>[];
  readonly data?: TData;
  readonly leaf?: boolean;
  readonly disabled?: boolean;
  readonly selectable?: boolean;
  readonly draggable?: boolean;
  readonly droppable?: boolean;
}

export interface AerisTreeNodeEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
}

export interface AerisTreeSelectionEvent<TData = unknown> extends AerisTreeNodeEvent<TData> {
  readonly selected: boolean;
  readonly selectedKeys: readonly string[];
}

export interface AerisTreeFilterEvent {
  readonly originalEvent: Event;
  readonly value: string;
}

export interface AerisTreeDropEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
  readonly target: AerisTreeNode<TData>;
  readonly targetKey: string;
  readonly position: AerisTreeDropPosition;
  readonly value: readonly AerisTreeNode<TData>[];
}

export interface AerisTreeNodeContext<TData = unknown> {
  readonly $implicit: AerisTreeNode<TData>;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
  readonly level: number;
  readonly selected: boolean;
  readonly partial: boolean;
  readonly expanded: boolean;
  readonly leaf: boolean;
  readonly active: boolean;
  readonly loading: boolean;
  readonly dragging: boolean;
  readonly dropPosition: AerisTreeDropPosition | null;
}

interface TreeStructureEntry<TData> {
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
  readonly level: number;
  readonly parentKey: string | null;
  readonly position: number;
  readonly setSize: number;
  readonly expanded: boolean;
  readonly expandable: boolean;
}

interface TreeSelectionState {
  readonly selected: boolean;
  readonly partial: boolean;
}

interface TreeRenderedEntry<TData> extends TreeStructureEntry<TData> {
  readonly id: string;
  readonly active: boolean;
  readonly disabled: boolean;
  readonly selected: boolean;
  readonly partial: boolean;
  readonly loading: boolean;
  readonly draggable: boolean;
  readonly dragging: boolean;
  readonly dropPosition: AerisTreeDropPosition | null;
  readonly tabIndex: 0 | -1;
  readonly context: AerisTreeNodeContext<TData>;
}

@Directive({ selector: 'ng-template[aerisTreeNode]' })
export class AerisTreeNodeTemplate<TData = unknown> {
  readonly template = inject<TemplateRef<AerisTreeNodeContext<TData>>>(TemplateRef);

  static ngTemplateContextGuard<TData>(
    _directive: AerisTreeNodeTemplate<TData>,
    context: unknown,
  ): context is AerisTreeNodeContext<TData> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisTreeEmpty]' })
export class AerisTreeEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTreeLoading]' })
export class AerisTreeLoadingTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let treeId = 0;

@Component({
  selector: 'aeris-tree',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-tree"
      [attr.data-disabled]="disabled() || null"
      [attr.data-fluid]="fluid() || null"
      [attr.aria-busy]="loading() || null"
    >
      @if (filter()) {
        <div class="aeris-tree__filter-wrap">
          <span class="aeris-tree__search" aria-hidden="true"></span>
          <input
            #filterInput
            class="aeris-tree__filter"
            type="search"
            autocomplete="off"
            [value]="filterValue()"
            [placeholder]="filterPlaceholder()"
            [attr.aria-label]="filterAriaLabel()"
            [attr.aria-controls]="resolvedTreeId"
            [disabled]="disabled()"
            (input)="handleFilterInput($event)"
            (keydown)="handleFilterKeydown($event)"
          />
          @if (filterValue() && !disabled()) {
            <button
              class="aeris-tree__filter-clear"
              type="button"
              [attr.aria-label]="filterClearAriaLabel()"
              (click)="clearFilter($event)"
            >
              <span aria-hidden="true"></span>
            </button>
          }
        </div>
      }

      @if (loading()) {
        <div class="aeris-tree__message" role="status">
          @if (loadingTemplate(); as customLoading) {
            <ng-container [ngTemplateOutlet]="customLoading.template" />
          } @else {
            <span class="aeris-tree__spinner" aria-hidden="true"></span>
            {{ loadingMessage() }}
          }
        </div>
      } @else if (renderedNodes().length) {
        @if (dragDrop()) {
          <p class="aeris-tree__visually-hidden" [id]="dragHelpId">
            Reorder the focused node with Alt plus Arrow Up or Arrow Down. Use Alt plus Arrow Right
            to move it into the previous branch, or Alt plus Arrow Left to move it out of its
            parent.
          </p>
        }
        <div
          class="aeris-tree__items"
          role="tree"
          [id]="resolvedTreeId"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-describedby]="dragDrop() ? dragHelpId : null"
          [attr.aria-multiselectable]="
            selectionMode() === 'multiple' || selectionMode() === 'checkbox' ? true : null
          "
        >
          @for (entry of renderedNodes(); track entry.key) {
            <div
              #treeItem
              class="aeris-tree__node"
              role="treeitem"
              [id]="entry.id"
              [attr.tabindex]="entry.tabIndex"
              [attr.data-tree-key]="entry.key"
              [attr.data-active]="entry.active || null"
              [attr.data-selected]="entry.selected || null"
              [attr.data-disabled]="entry.disabled || null"
              [attr.data-loading]="entry.loading || null"
              [attr.data-dragging]="entry.dragging || null"
              [attr.data-drop-position]="entry.dropPosition"
              [draggable]="entry.draggable"
              [attr.aria-level]="entry.level"
              [attr.aria-posinset]="entry.position"
              [attr.aria-setsize]="entry.setSize"
              [attr.aria-expanded]="entry.expandable ? entry.expanded : null"
              [attr.aria-selected]="
                selectionMode() && selectionMode() !== 'checkbox' ? entry.selected : null
              "
              [attr.aria-checked]="
                selectionMode() === 'checkbox' ? (entry.partial ? 'mixed' : entry.selected) : null
              "
              [attr.aria-disabled]="entry.disabled || null"
              [attr.aria-busy]="entry.loading || null"
              [style.--aeris-tree-level]="entry.level - 1"
              (click)="handleNodeClick($event, entry)"
              (focus)="activate(entry.key)"
              (keydown)="handleNodeKeydown($event, entry)"
              (dragstart)="handleDragStart($event, entry)"
              (dragover)="handleDragOver($event, entry)"
              (dragleave)="handleDragLeave($event, entry)"
              (drop)="handleDrop($event, entry)"
              (dragend)="handleDragEnd()"
            >
              <span
                class="aeris-tree__toggle"
                [attr.data-expandable]="entry.expandable || null"
                [attr.data-expanded]="entry.expanded || null"
                aria-hidden="true"
              >
                @if (entry.loading) {
                  <span class="aeris-tree__spinner"></span>
                } @else {
                  <span class="aeris-tree__chevron"></span>
                }
              </span>

              @if (selectionMode() === 'checkbox') {
                <span
                  class="aeris-tree__box"
                  [attr.data-checked]="entry.selected || null"
                  [attr.data-mixed]="entry.partial || null"
                  aria-hidden="true"
                  ><span></span
                ></span>
              }

              <span class="aeris-tree__content">
                @if (nodeTemplate(); as customNode) {
                  <ng-container
                    [ngTemplateOutlet]="customNode.template"
                    [ngTemplateOutletContext]="entry.context"
                  />
                } @else {
                  {{ entry.node.label }}
                }
              </span>
            </div>
          }
        </div>
        @if (dragDrop()) {
          <p class="aeris-tree__visually-hidden" aria-live="polite">
            {{ dragAnnouncement() }}
          </p>
        }
      } @else {
        <div class="aeris-tree__message" role="status">
          @if (emptyTemplate(); as customEmpty) {
            <ng-container [ngTemplateOutlet]="customEmpty.template" />
          } @else {
            {{ filterValue() ? emptyFilterMessage() : emptyMessage() }}
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-tree.scss',
})
export class AerisTree<TData = unknown> {
  private readonly destroyRef = inject(DestroyRef);
  readonly value = model<readonly AerisTreeNode<TData>[]>([]);
  readonly selectionMode = input<AerisTreeSelectionMode | null>(null);
  readonly selectionKeys = model<readonly string[]>([]);
  readonly expandedKeys = model<readonly string[]>([]);
  readonly filterValue = model('');
  readonly filter = input(false, { transform: booleanAttribute });
  readonly propagateSelection = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingKeys = input<readonly string[]>([]);
  readonly dragDrop = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Tree');
  readonly filterPlaceholder = input('Search tree');
  readonly filterAriaLabel = input('Search tree');
  readonly filterClearAriaLabel = input('Clear search');
  readonly emptyMessage = input('No tree nodes available');
  readonly emptyFilterMessage = input('No matching nodes');
  readonly loadingMessage = input('Loading tree');

  readonly selectionChanged = output<AerisTreeSelectionEvent<TData>>();
  readonly nodeSelected = output<AerisTreeSelectionEvent<TData>>();
  readonly nodeUnselected = output<AerisTreeSelectionEvent<TData>>();
  readonly nodeExpanded = output<AerisTreeNodeEvent<TData>>();
  readonly nodeCollapsed = output<AerisTreeNodeEvent<TData>>();
  readonly filterChanged = output<AerisTreeFilterEvent>();
  readonly nodeDropped = output<AerisTreeDropEvent<TData>>();

  protected readonly nodeTemplate = contentChild(AerisTreeNodeTemplate<TData>);
  protected readonly emptyTemplate = contentChild(AerisTreeEmptyTemplate);
  protected readonly loadingTemplate = contentChild(AerisTreeLoadingTemplate);
  private readonly treeItems = viewChildren<ElementRef<HTMLElement>>('treeItem');
  private readonly filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');
  private readonly activeKey = signal<string | null>(null);
  private readonly draggingKey = signal<string | null>(null);
  private readonly dropTarget = signal<{
    readonly key: string;
    readonly position: AerisTreeDropPosition;
  } | null>(null);
  protected readonly dragAnnouncement = signal('');
  protected readonly resolvedTreeId = `aeris-tree-${++treeId}`;
  protected readonly dragHelpId = `${this.resolvedTreeId}-drag-help`;

  private readonly structure = computed(() =>
    this.buildStructure(this.value(), this.filterValue().trim().toLocaleLowerCase()),
  );
  private readonly resolvedActiveKey = computed(() => {
    const nodes = this.structure();
    const activeKey = this.activeKey();
    return nodes.some((entry) => entry.key === activeKey) ? activeKey : (nodes[0]?.key ?? null);
  });
  private readonly selectionStates = computed(() => this.buildSelectionStates(this.value()));
  protected readonly renderedNodes = computed<readonly TreeRenderedEntry<TData>[]>(() => {
    const activeKey = this.resolvedActiveKey();
    const selectionStates = this.selectionStates();
    const loadingKeys = new Set(this.loadingKeys());

    return this.structure().map((entry, index) => {
      const state = selectionStates.get(entry.key) ?? { selected: false, partial: false };
      const active = entry.key === activeKey;
      const loading = loadingKeys.has(entry.key);
      const dragging = this.draggingKey() === entry.key;
      const dropPosition =
        this.dropTarget()?.key === entry.key ? (this.dropTarget()?.position ?? null) : null;
      const context: AerisTreeNodeContext<TData> = {
        $implicit: entry.node,
        node: entry.node,
        key: entry.key,
        level: entry.level,
        selected: state.selected,
        partial: state.partial,
        expanded: entry.expanded,
        leaf: !entry.expandable,
        active,
        loading,
        dragging,
        dropPosition,
      };

      return {
        ...entry,
        id: `${this.resolvedTreeId}-node-${index}`,
        active,
        disabled: this.disabled() || entry.node.disabled === true,
        selected: state.selected,
        partial: state.partial,
        loading,
        draggable:
          this.dragDrop() &&
          !this.disabled() &&
          entry.node.disabled !== true &&
          entry.node.draggable !== false,
        dragging,
        dropPosition,
        tabIndex: active && !this.disabled() ? 0 : -1,
        context,
      };
    });
  });

  private typeahead = '';
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
    });
  }

  public focus(key?: string): void {
    const targetKey = key ?? this.resolvedActiveKey();
    if (!targetKey || this.disabled()) return;
    this.activeKey.set(targetKey);
    this.focusKey(targetKey);
  }

  public expandAll(): void {
    this.expandedKeys.set(this.collectExpandableKeys(this.value()));
  }

  public collapseAll(): void {
    this.expandedKeys.set([]);
  }

  protected activate(key: string): void {
    this.activeKey.set(key);
  }

  protected handleFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue.set(value);
    this.filterChanged.emit({ originalEvent: event, value });
  }

  protected clearFilter(event: Event): void {
    this.filterValue.set('');
    this.filterChanged.emit({ originalEvent: event, value: '' });
    queueMicrotask(() => this.filterInput()?.nativeElement.focus());
  }

  protected handleFilterKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' || !this.renderedNodes().length) return;
    event.preventDefault();
    this.focus(this.renderedNodes()[0]?.key);
  }

  protected handleNodeClick(event: MouseEvent, entry: TreeRenderedEntry<TData>): void {
    this.activeKey.set(entry.key);
    (event.currentTarget as HTMLElement).focus();
    if (entry.disabled) return;

    if ((event.target as HTMLElement).closest('.aeris-tree__toggle') && entry.expandable) {
      this.toggleExpansion(entry, event);
      return;
    }
    if (this.selectionMode() && entry.node.selectable !== false) {
      this.toggleSelection(entry, event);
    }
  }

  protected handleNodeKeydown(event: KeyboardEvent, entry: TreeRenderedEntry<TData>): void {
    const nodes = this.renderedNodes();
    const index = nodes.findIndex((node) => node.key === entry.key);

    if (event.altKey && this.dragDrop() && !entry.disabled && entry.node.draggable !== false) {
      if (this.handleKeyboardMove(event, entry)) return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusKey(nodes[Math.min(index + 1, nodes.length - 1)]?.key);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.focusKey(nodes[Math.max(index - 1, 0)]?.key);
        return;
      case 'ArrowRight':
        if (!entry.expandable) return;
        event.preventDefault();
        if (!entry.expanded) {
          this.toggleExpansion(entry, event);
        } else {
          this.focusKey(nodes.find((node) => node.parentKey === entry.key)?.key);
        }
        return;
      case 'ArrowLeft':
        event.preventDefault();
        if (entry.expandable && entry.expanded) {
          this.toggleExpansion(entry, event);
        } else {
          this.focusKey(entry.parentKey ?? entry.key);
        }
        return;
      case 'Home':
        event.preventDefault();
        this.focusKey(nodes[0]?.key);
        return;
      case 'End':
        event.preventDefault();
        this.focusKey(nodes[nodes.length - 1]?.key);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!entry.disabled && this.selectionMode() && entry.node.selectable !== false) {
          this.toggleSelection(entry, event);
        } else if (!entry.disabled && entry.expandable) {
          this.toggleExpansion(entry, event);
        }
        return;
      default:
        this.handleTypeahead(event, index);
    }
  }

  protected handleDragStart(originalEvent: DragEvent, entry: TreeRenderedEntry<TData>): void {
    if (!entry.draggable) {
      originalEvent.preventDefault();
      return;
    }
    this.draggingKey.set(entry.key);
    this.dropTarget.set(null);
    if (originalEvent.dataTransfer) {
      originalEvent.dataTransfer.effectAllowed = 'move';
      originalEvent.dataTransfer.setData('text/plain', entry.key);
    }
    this.dragAnnouncement.set(`Moving ${entry.node.label}.`);
  }

  protected handleDragOver(originalEvent: DragEvent, entry: TreeRenderedEntry<TData>): void {
    const sourceKey = this.draggingKey();
    if (!sourceKey || !this.canDrop(sourceKey, entry.key)) return;
    const position = this.pointerDropPosition(originalEvent, entry);
    if (position === 'inside' && !this.canReceiveChildren(entry.node)) return;
    originalEvent.preventDefault();
    originalEvent.stopPropagation();
    if (originalEvent.dataTransfer) originalEvent.dataTransfer.dropEffect = 'move';
    this.dropTarget.set({ key: entry.key, position });
  }

  protected handleDragLeave(originalEvent: DragEvent, entry: TreeRenderedEntry<TData>): void {
    if (
      this.dropTarget()?.key === entry.key &&
      !(originalEvent.currentTarget as HTMLElement).contains(originalEvent.relatedTarget as Node)
    ) {
      this.dropTarget.set(null);
    }
  }

  protected handleDrop(originalEvent: DragEvent, entry: TreeRenderedEntry<TData>): void {
    const sourceKey = this.draggingKey();
    const target = this.dropTarget();
    if (!sourceKey || target?.key !== entry.key) return;
    originalEvent.preventDefault();
    originalEvent.stopPropagation();
    this.commitMove(sourceKey, entry.key, target.position, originalEvent);
    this.handleDragEnd();
  }

  protected handleDragEnd(): void {
    this.draggingKey.set(null);
    this.dropTarget.set(null);
  }

  private toggleExpansion(entry: TreeRenderedEntry<TData>, originalEvent: Event): void {
    if (entry.loading) return;
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

  private handleKeyboardMove(event: KeyboardEvent, entry: TreeRenderedEntry<TData>): boolean {
    const location = this.findLocation(this.value(), entry.key);
    if (!location) return false;
    let targetKey: string | undefined;
    let position: AerisTreeDropPosition | undefined;

    if (event.key === 'ArrowUp') {
      targetKey = location.siblings[location.index - 1]?.key;
      position = 'before';
    } else if (event.key === 'ArrowDown') {
      targetKey = location.siblings[location.index + 1]?.key;
      position = 'after';
    } else if (event.key === 'ArrowRight') {
      const previous = location.siblings[location.index - 1];
      if (previous && this.canReceiveChildren(previous)) {
        targetKey = previous.key;
        position = 'inside';
      }
    } else if (event.key === 'ArrowLeft' && location.parentKey) {
      targetKey = location.parentKey;
      position = 'after';
    } else {
      return false;
    }

    event.preventDefault();
    if (targetKey && position) {
      this.commitMove(entry.key, targetKey, position, event);
      this.activeKey.set(entry.key);
    }
    return true;
  }

  private commitMove(
    sourceKey: string,
    targetKey: string,
    position: AerisTreeDropPosition,
    originalEvent: Event,
  ): void {
    if (!this.canDrop(sourceKey, targetKey)) return;
    const source = this.findNode(this.value(), sourceKey);
    const target = this.findNode(this.value(), targetKey);
    if (!source || !target || (position === 'inside' && !this.canReceiveChildren(target))) return;

    const removed = this.removeNode(this.value(), sourceKey);
    if (!removed) return;
    const movedValue = this.insertNode(removed.value, targetKey, removed.node, position);
    if (!movedValue) return;

    this.value.set(movedValue);
    if (position === 'inside' && !this.expandedKeys().includes(targetKey)) {
      this.expandedKeys.set([...this.expandedKeys(), targetKey]);
    }
    this.dragAnnouncement.set(`${source.label} moved ${position} ${target.label}.`);
    this.nodeDropped.emit({
      originalEvent,
      node: source,
      key: sourceKey,
      target,
      targetKey,
      position,
      value: movedValue,
    });
  }

  private canDrop(sourceKey: string, targetKey: string): boolean {
    return sourceKey !== targetKey && !this.isDescendant(sourceKey, targetKey);
  }

  private canReceiveChildren(node: AerisTreeNode<TData>): boolean {
    return node.leaf !== true && node.droppable !== false && node.disabled !== true;
  }

  private pointerDropPosition(
    originalEvent: DragEvent,
    entry: TreeRenderedEntry<TData>,
  ): AerisTreeDropPosition {
    const rect = (originalEvent.currentTarget as HTMLElement).getBoundingClientRect();
    const ratio = rect.height > 0 ? (originalEvent.clientY - rect.top) / rect.height : 0.5;
    if (!this.canReceiveChildren(entry.node)) return ratio < 0.5 ? 'before' : 'after';
    if (ratio < 0.25) return 'before';
    if (ratio > 0.75) return 'after';
    return 'inside';
  }

  private findNode(
    nodes: readonly AerisTreeNode<TData>[],
    key: string,
  ): AerisTreeNode<TData> | null {
    for (const node of nodes) {
      if (node.key === key) return node;
      const child = this.findNode(node.children ?? [], key);
      if (child) return child;
    }
    return null;
  }

  private findLocation(
    nodes: readonly AerisTreeNode<TData>[],
    key: string,
    parentKey: string | null = null,
  ): {
    readonly parentKey: string | null;
    readonly siblings: readonly AerisTreeNode<TData>[];
    readonly index: number;
  } | null {
    const index = nodes.findIndex((node) => node.key === key);
    if (index >= 0) return { parentKey, siblings: nodes, index };
    for (const node of nodes) {
      const location = this.findLocation(node.children ?? [], key, node.key);
      if (location) return location;
    }
    return null;
  }

  private removeNode(
    nodes: readonly AerisTreeNode<TData>[],
    key: string,
  ): {
    readonly value: readonly AerisTreeNode<TData>[];
    readonly node: AerisTreeNode<TData>;
  } | null {
    const index = nodes.findIndex((node) => node.key === key);
    if (index >= 0) {
      const node = nodes[index];
      if (!node) return null;
      return {
        value: [...nodes.slice(0, index), ...nodes.slice(index + 1)],
        node,
      };
    }
    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
      const node = nodes[nodeIndex];
      if (!node) continue;
      const removed = this.removeNode(node.children ?? [], key);
      if (!removed) continue;
      const value = [...nodes];
      value[nodeIndex] = { ...node, children: removed.value };
      return { value, node: removed.node };
    }
    return null;
  }

  private insertNode(
    nodes: readonly AerisTreeNode<TData>[],
    targetKey: string,
    node: AerisTreeNode<TData>,
    position: AerisTreeDropPosition,
  ): readonly AerisTreeNode<TData>[] | null {
    const index = nodes.findIndex((candidate) => candidate.key === targetKey);
    if (index >= 0) {
      if (position === 'before') {
        return [...nodes.slice(0, index), node, ...nodes.slice(index)];
      }
      if (position === 'after') {
        return [...nodes.slice(0, index + 1), node, ...nodes.slice(index + 1)];
      }
      const target = nodes[index];
      if (!target) return null;
      const value = [...nodes];
      value[index] = { ...target, leaf: false, children: [...(target.children ?? []), node] };
      return value;
    }
    for (let nodeIndex = 0; nodeIndex < nodes.length; nodeIndex += 1) {
      const current = nodes[nodeIndex];
      if (!current) continue;
      const children = this.insertNode(current.children ?? [], targetKey, node, position);
      if (!children) continue;
      const value = [...nodes];
      value[nodeIndex] = { ...current, children };
      return value;
    }
    return null;
  }

  private isDescendant(sourceKey: string, targetKey: string): boolean {
    const source = this.findNode(this.value(), sourceKey);
    return source ? this.findNode(source.children ?? [], targetKey) !== null : false;
  }

  private toggleSelection(entry: TreeRenderedEntry<TData>, originalEvent: Event): void {
    const mode = this.selectionMode();
    if (!mode) return;
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
    } else if (selected) {
      keys.add(entry.key);
    } else {
      keys.delete(entry.key);
    }

    const selectedKeys = [...keys];
    this.selectionKeys.set(selectedKeys);
    const selectionEvent = {
      originalEvent,
      node: entry.node,
      key: entry.key,
      selected,
      selectedKeys,
    };
    this.selectionChanged.emit(selectionEvent);
    if (selected) this.nodeSelected.emit(selectionEvent);
    else this.nodeUnselected.emit(selectionEvent);
  }

  private buildStructure(
    nodes: readonly AerisTreeNode<TData>[],
    query: string,
  ): readonly TreeStructureEntry<TData>[] {
    if (query) return this.buildFilteredStructure(nodes, query, 1, null).entries;
    return this.buildExpandedStructure(nodes, 1, null, new Set(this.expandedKeys()));
  }

  private buildExpandedStructure(
    nodes: readonly AerisTreeNode<TData>[],
    level: number,
    parentKey: string | null,
    expandedKeys: ReadonlySet<string>,
  ): readonly TreeStructureEntry<TData>[] {
    const entries: TreeStructureEntry<TData>[] = [];
    nodes.forEach((node, index) => {
      const expandable = this.isExpandable(node);
      const expanded = expandable && expandedKeys.has(node.key);
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
          ...this.buildExpandedStructure(node.children, level + 1, node.key, expandedKeys),
        );
      }
    });
    return entries;
  }

  private buildFilteredStructure(
    nodes: readonly AerisTreeNode<TData>[],
    query: string,
    level: number,
    parentKey: string | null,
  ): { readonly matched: boolean; readonly entries: readonly TreeStructureEntry<TData>[] } {
    const matches = nodes
      .map((node) => {
        const childResult = this.buildFilteredStructure(
          node.children ?? [],
          query,
          level + 1,
          node.key,
        );
        const matched = node.label.toLocaleLowerCase().includes(query) || childResult.matched;
        return { node, childResult, matched };
      })
      .filter((result) => result.matched);

    const entries: TreeStructureEntry<TData>[] = [];
    matches.forEach(({ node, childResult }, index) => {
      const expandable = this.isExpandable(node);
      entries.push({
        node,
        key: node.key,
        level,
        parentKey,
        position: index + 1,
        setSize: matches.length,
        expanded: childResult.entries.length > 0,
        expandable,
      });
      entries.push(...childResult.entries);
    });
    return { matched: matches.length > 0, entries };
  }

  private buildSelectionStates(
    nodes: readonly AerisTreeNode<TData>[],
  ): ReadonlyMap<string, TreeSelectionState> {
    const result = new Map<string, TreeSelectionState>();
    const selectedKeys = new Set(this.selectionKeys());
    const checkbox = this.selectionMode() === 'checkbox' && this.propagateSelection();

    const visit = (node: AerisTreeNode<TData>): { selected: number; selectable: number } => {
      let selectable = node.disabled || node.selectable === false ? 0 : 1;
      let selected = selectable && selectedKeys.has(node.key) ? 1 : 0;
      for (const child of node.children ?? []) {
        const childState = visit(child);
        selectable += childState.selectable;
        selected += childState.selected;
      }
      result.set(
        node.key,
        checkbox
          ? {
              selected: selectable > 0 && selected === selectable,
              partial: selected > 0 && selected < selectable,
            }
          : { selected: selectedKeys.has(node.key), partial: false },
      );
      return { selected, selectable };
    };

    nodes.forEach(visit);
    return result;
  }

  private collectSelectableKeys(node: AerisTreeNode<TData>): readonly string[] {
    const keys: string[] = [];
    if (!node.disabled && node.selectable !== false) keys.push(node.key);
    for (const child of node.children ?? []) keys.push(...this.collectSelectableKeys(child));
    return keys;
  }

  private collectExpandableKeys(nodes: readonly AerisTreeNode<TData>[]): readonly string[] {
    const keys: string[] = [];
    for (const node of nodes) {
      if (this.isExpandable(node)) keys.push(node.key);
      if (node.children?.length) keys.push(...this.collectExpandableKeys(node.children));
    }
    return keys;
  }

  private isExpandable(node: AerisTreeNode<TData>): boolean {
    return Boolean(node.children?.length) || node.leaf === false;
  }

  private focusKey(key: string | undefined): void {
    if (!key) return;
    this.activeKey.set(key);
    this.treeItems()
      .find((item) => item.nativeElement.dataset['treeKey'] === key)
      ?.nativeElement.focus();
  }

  private handleTypeahead(event: KeyboardEvent, currentIndex: number): void {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    this.typeahead += event.key.toLocaleLowerCase();
    if (this.typeaheadTimer) clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => {
      this.typeahead = '';
    }, 500);

    const nodes = this.renderedNodes();
    const ordered = [...nodes.slice(currentIndex + 1), ...nodes.slice(0, currentIndex + 1)];
    const match = ordered.find((entry) =>
      entry.node.label.toLocaleLowerCase().startsWith(this.typeahead),
    );
    if (match) {
      event.preventDefault();
      this.focusKey(match.key);
    }
  }
}

export const AerisTreeModule = [
  AerisTree,
  AerisTreeNodeTemplate,
  AerisTreeEmptyTemplate,
  AerisTreeLoadingTemplate,
] as const;
