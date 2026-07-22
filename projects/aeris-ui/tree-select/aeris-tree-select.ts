import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type AerisTreeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type AerisTreeSelectAppearance = 'outline' | 'filled';
export type AerisTreeSelectMode = 'single' | 'multiple' | 'checkbox';
export type AerisTreeSelectValue = string | readonly string[] | null;

export interface AerisTreeNode {
  readonly label: string;
  readonly value: string;
  readonly children?: readonly AerisTreeNode[];
  readonly disabled?: boolean;
  readonly selectable?: boolean;
  readonly expanded?: boolean;
}

export interface AerisTreeSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisTreeSelectValue;
  readonly node: AerisTreeNode | null;
  readonly selected: boolean;
}

export interface AerisTreeSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface FlatTreeNode {
  readonly node: AerisTreeNode;
  readonly level: number;
  readonly parent: AerisTreeNode | null;
}

type TreeCheckboxState = 'true' | 'false' | 'mixed';

interface TreeSelectNodeContext {
  readonly $implicit: AerisTreeNode;
  readonly node: AerisTreeNode;
  readonly level: number;
  readonly selected: boolean;
  readonly expanded: boolean;
  readonly active: boolean;
}

interface TreeSelectValueContext {
  readonly $implicit: readonly AerisTreeNode[];
  readonly nodes: readonly AerisTreeNode[];
  readonly value: AerisTreeSelectValue;
}

@Directive({ selector: 'ng-template[aerisTreeSelectNode]' })
export class AerisTreeSelectNodeTemplate {
  readonly template = inject<TemplateRef<TreeSelectNodeContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTreeSelectValue]' })
export class AerisTreeSelectValueTemplate {
  readonly template = inject<TemplateRef<TreeSelectValueContext>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTreeSelectHeader]' })
export class AerisTreeSelectHeaderTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTreeSelectFooter]' })
export class AerisTreeSelectFooterTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Directive({ selector: 'ng-template[aerisTreeSelectEmpty]' })
export class AerisTreeSelectEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

let treeSelectId = 0;

@Component({
  selector: 'aeris-tree-select',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="aeris-tree-select"
      [attr.data-size]="size()"
      [attr.data-appearance]="appearance()"
      [attr.data-open]="open() || null"
      [attr.data-invalid]="invalid() || null"
      [attr.data-disabled]="effectiveDisabled() || null"
      [attr.data-fluid]="fluid() || null"
      (focusout)="handleFocusOut($event)"
    >
      @if (name() && serializedValue()) {
        <input type="hidden" [name]="name()" [value]="serializedValue()" />
      }

      <div class="aeris-tree-select__control">
        <button
          #trigger
          class="aeris-tree-select__trigger"
          type="button"
          role="combobox"
          aria-haspopup="tree"
          [id]="resolvedInputId()"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="panelId"
          [attr.aria-activedescendant]="open() ? activeNodeId() : null"
          [attr.aria-label]="ariaLabel() || null"
          [attr.aria-labelledby]="ariaLabelledby() || null"
          [attr.aria-describedby]="ariaDescribedby() || null"
          [attr.aria-required]="required() || null"
          [attr.aria-invalid]="invalid() || null"
          [disabled]="effectiveDisabled()"
          (click)="toggle()"
          (keydown)="handleTriggerKeydown($event)"
          (focus)="focused.emit($event)"
        >
          <span
            class="aeris-tree-select__value"
            [class.aeris-tree-select__placeholder]="!selectedNodes().length"
          >
            @if (selectedNodes().length) {
              @if (valueTemplate(); as selectedTemplate) {
                <ng-container
                  [ngTemplateOutlet]="selectedTemplate.template"
                  [ngTemplateOutletContext]="{
                    $implicit: selectedNodes(),
                    nodes: selectedNodes(),
                    value: value()
                  }"
                />
              } @else {
                {{ valueLabel() }}
              }
            } @else {
              {{ placeholder() }}
            }
          </span>
        </button>

        @if (showClearButton()) {
          <button
            class="aeris-tree-select__clear"
            type="button"
            [attr.aria-label]="clearButtonAriaLabel()"
            (click)="handleClearClick($event)"
          ><span aria-hidden="true"></span></button>
        }
        <span class="aeris-tree-select__chevron" aria-hidden="true"></span>
      </div>

      @if (open()) {
        <button
          class="aeris-tree-select__dismiss"
          type="button"
          tabindex="-1"
          aria-label="Close tree"
          (click)="closePanel(true)"
        ></button>

        <div
          class="aeris-tree-select__panel"
          [id]="panelId"
          [style.--aeris-tree-select-panel-max-height]="panelMaxHeight()"
        >
          @if (headerTemplate(); as header) {
            <div class="aeris-tree-select__header">
              <ng-container [ngTemplateOutlet]="header.template" />
            </div>
          }

          @if (filter()) {
            <div class="aeris-tree-select__filter-wrap">
              <span class="aeris-tree-select__search-mark" aria-hidden="true"></span>
              <input
                #filterInput
                class="aeris-tree-select__filter"
                type="search"
                role="searchbox"
                autocomplete="off"
                [value]="filterValue()"
                [placeholder]="filterPlaceholder()"
                [attr.aria-label]="filterAriaLabel()"
                [attr.aria-controls]="treeId"
                [attr.aria-activedescendant]="activeNodeId()"
                (input)="handleFilterInput($event)"
                (keydown)="handleTreeKeydown($event)"
              />
              @if (filterValue()) {
                <button
                  class="aeris-tree-select__filter-clear"
                  type="button"
                  [attr.aria-label]="filterClearAriaLabel()"
                  (click)="clearFilter()"
                ><span aria-hidden="true"></span></button>
              }
            </div>
          }

          <div
            class="aeris-tree-select__tree"
            [id]="treeId"
            role="tree"
            [attr.aria-label]="treeAriaLabel()"
            [attr.aria-multiselectable]="selectionMode() === 'single' ? null : true"
            (keydown)="handleTreeKeydown($event)"
          >
            @if (!visibleNodes().length) {
              <div class="aeris-tree-select__message" role="status">
                @if (emptyTemplate(); as empty) {
                  <ng-container [ngTemplateOutlet]="empty.template" />
                } @else {
                  {{ filterValue() ? emptyFilterMessage() : emptyMessage() }}
                }
              </div>
            } @else {
              @for (item of visibleNodes(); track item.node.value) {
                <div
                  class="aeris-tree-select__node"
                  role="treeitem"
                  [id]="nodeId(item.node)"
                  [attr.aria-level]="item.level + 1"
                  [attr.aria-expanded]="hasChildren(item.node) ? isExpanded(item.node) : null"
                  [attr.aria-selected]="selectionMode() === 'checkbox' ? null : isSelected(item.node)"
                  [attr.aria-checked]="selectionMode() === 'checkbox' ? checkboxState(item.node) : null"
                  [attr.aria-disabled]="nodeUnavailable(item.node) || null"
                  [attr.data-active]="activeValue() === item.node.value || null"
                  [attr.data-selected]="isSelected(item.node) || null"
                  [attr.data-disabled]="nodeUnavailable(item.node) || null"
                  [style.--aeris-tree-select-level]="item.level"
                  (mouseenter)="activate(item.node)"
                  (mousedown)="$event.preventDefault()"
                  (click)="selectNode(item.node, $event)"
                >
                  <button
                    class="aeris-tree-select__toggle"
                    type="button"
                    [attr.aria-label]="isExpanded(item.node) ? 'Collapse ' + item.node.label : 'Expand ' + item.node.label"
                    [attr.aria-hidden]="hasChildren(item.node) ? null : true"
                    [attr.tabindex]="-1"
                    [disabled]="!hasChildren(item.node)"
                    (click)="handleToggleClick(item.node, $event)"
                  >
                    <span aria-hidden="true"></span>
                  </button>

                  @if (selectionMode() !== 'single') {
                    <span
                      class="aeris-tree-select__box"
                      [attr.data-checked]="isSelected(item.node) || null"
                      [attr.data-mixed]="selectionMode() === 'checkbox' && isPartiallySelected(item.node) || null"
                      aria-hidden="true"
                    ><span></span></span>
                  }

                  <span class="aeris-tree-select__node-content">
                    @if (nodeTemplate(); as customNode) {
                      <ng-container
                        [ngTemplateOutlet]="customNode.template"
                        [ngTemplateOutletContext]="{
                          $implicit: item.node,
                          node: item.node,
                          level: item.level,
                          selected: isSelected(item.node),
                          expanded: isExpanded(item.node),
                          active: activeValue() === item.node.value
                        }"
                      />
                    } @else {
                      <span>{{ item.node.label }}</span>
                    }
                  </span>
                </div>
              }
            }
          </div>

          @if (footerTemplate(); as footer) {
            <div class="aeris-tree-select__footer">
              <ng-container [ngTemplateOutlet]="footer.template" />
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-tree-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AerisTreeSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-open]': 'open() || null',
    '[attr.data-disabled]': 'effectiveDisabled() || null',
    '[attr.data-fluid]': 'fluid() || null',
  },
})
export class AerisTreeSelectComponent implements ControlValueAccessor {
  readonly nodes = input.required<readonly AerisTreeNode[]>();
  readonly value = model<AerisTreeSelectValue>(null);
  readonly selectionMode = input<AerisTreeSelectMode>('single');
  readonly inputId = input('');
  readonly name = input('');
  readonly valueSeparator = input(',');
  readonly placeholder = input('Select item');
  readonly ariaLabel = input('');
  readonly ariaLabelledby = input('');
  readonly ariaDescribedby = input('');
  readonly treeAriaLabel = input('Tree options');
  readonly size = input<AerisTreeSelectSize>('md');
  readonly appearance = input<AerisTreeSelectAppearance>('outline');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly clearButtonAriaLabel = input('Clear selection');
  readonly filter = input(false, { transform: booleanAttribute });
  readonly filterValue = model('');
  readonly filterPlaceholder = input('Search tree');
  readonly filterAriaLabel = input('Search tree');
  readonly filterClearAriaLabel = input('Clear search');
  readonly resetFilterOnClose = input(true, { transform: booleanAttribute });
  readonly autofocusFilter = input(true, { transform: booleanAttribute });
  readonly emptyMessage = input('No items available');
  readonly emptyFilterMessage = input('No matching items');
  readonly panelMaxHeight = input('18rem');
  readonly propagateSelection = input(true, { transform: booleanAttribute });
  readonly expandOnFilter = input(true, { transform: booleanAttribute });

  readonly valueInput = output<AerisTreeSelectValue>();
  readonly changed = output<AerisTreeSelectChangeEvent>();
  readonly filterChanged = output<AerisTreeSelectFilterEvent>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();
  readonly nodeExpanded = output<AerisTreeNode>();
  readonly nodeCollapsed = output<AerisTreeNode>();
  readonly focused = output<FocusEvent>();
  readonly blurred = output<FocusEvent>();
  readonly touch = output<void>();

  protected readonly open = signal(false);
  protected readonly expandedValues = signal<ReadonlySet<string>>(new Set());
  private readonly expansionInitialized = signal(false);
  protected readonly activeValue = signal<string | null>(null);
  protected readonly formDisabled = signal(false);
  protected readonly effectiveDisabled = computed(
    () => this.disabled() || this.formDisabled(),
  );
  protected readonly allNodes = computed(() => flattenAll(this.nodes()));
  protected readonly selectedValues = computed(() => {
    const value = this.value();
    return new Set(Array.isArray(value) ? value : value ? [value] : []);
  });
  private readonly checkboxStates = computed(() =>
    this.createCheckboxStates(this.selectedValues()),
  );
  protected readonly selectedNodes = computed(() => {
    const values = this.selectedValues();
    return this.allNodes().filter((item) => values.has(item.node.value)).map((item) => item.node);
  });
  protected readonly valueLabel = computed(() => {
    const selected = this.selectedNodes();
    if (!selected.length) return '';
    if (this.selectionMode() === 'single') return selected[0]?.label ?? '';
    if (selected.length <= 2) return selected.map((node) => node.label).join(', ');
    return `${selected.length} items selected`;
  });
  protected readonly serializedValue = computed(() => {
    const value = this.value();
    if (Array.isArray(value)) return value.join(this.valueSeparator());
    return value ?? '';
  });
  protected readonly visibleNodes = computed(() => {
    const query = this.filterValue().trim().toLocaleLowerCase();
    if (query) {
      return flattenFiltered(this.nodes(), query);
    }
    return flattenVisible(this.nodes(), this.expandedValues());
  });
  protected readonly activeNodeId = computed(() => {
    const value = this.activeValue();
    return value ? `${this.treeId}-node-${cssSafe(value)}` : null;
  });
  protected readonly showClearButton = computed(
    () => this.clearable() && this.selectedNodes().length > 0 && !this.effectiveDisabled(),
  );

  protected readonly panelId = `aeris-tree-select-panel-${++treeSelectId}`;
  protected readonly treeId = `${this.panelId}-tree`;
  protected readonly resolvedInputId = computed(
    () => this.inputId() || `${this.panelId}-trigger`,
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly filterInput = viewChild<ElementRef<HTMLInputElement>>('filterInput');
  protected readonly nodeTemplate = contentChild(AerisTreeSelectNodeTemplate);
  protected readonly valueTemplate = contentChild(AerisTreeSelectValueTemplate);
  protected readonly headerTemplate = contentChild(AerisTreeSelectHeaderTemplate);
  protected readonly footerTemplate = contentChild(AerisTreeSelectFooterTemplate);
  protected readonly emptyTemplate = contentChild(AerisTreeSelectEmptyTemplate);
  private onChange: (value: AerisTreeSelectValue) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    if (Array.isArray(value)) {
      this.value.set([...new Set(value.map(String))]);
    } else {
      this.value.set(value == null || value === '' ? null : String(value));
    }
  }

  registerOnChange(callback: (value: AerisTreeSelectValue) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
    if (disabled) this.closePanel(false);
  }

  focus(options?: FocusOptions): void {
    this.trigger()?.nativeElement.focus(options);
  }

  openPanel(): void {
    if (this.effectiveDisabled() || this.open()) return;
    this.initializeExpansion();
    if (this.resetFilterOnClose()) this.filterValue.set('');
    this.activeValue.set(this.initialActiveValue());
    this.open.set(true);
    this.opened.emit();
    if (this.filter() && this.autofocusFilter()) {
      queueMicrotask(() => this.filterInput()?.nativeElement.focus());
    }
  }

  closePanel(restoreFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (this.resetFilterOnClose()) this.filterValue.set('');
    this.closed.emit();
    if (restoreFocus) queueMicrotask(() => this.focus());
  }

  toggle(): void {
    this.open() ? this.closePanel(false) : this.openPanel();
  }

  clear(): void {
    if (!this.showClearButton()) return;
    this.setValue(this.selectionMode() === 'single' ? null : []);
    this.cleared.emit();
    queueMicrotask(() => this.focus());
  }

  reset(): void {
    if (this.effectiveDisabled()) return;
    this.setValue(this.selectionMode() === 'single' ? null : []);
    this.filterValue.set('');
    this.closePanel(false);
  }

  expandAll(): void {
    this.expansionInitialized.set(true);
    this.expandedValues.set(new Set(this.allNodes().filter((item) => this.hasChildren(item.node)).map((item) => item.node.value)));
  }

  collapseAll(): void {
    this.expansionInitialized.set(true);
    this.expandedValues.set(new Set());
  }

  protected hasChildren(node: AerisTreeNode): boolean {
    return Boolean(node.children?.length);
  }

  protected isExpanded(node: AerisTreeNode): boolean {
    return this.filterValue() && this.expandOnFilter()
      ? this.hasChildren(node)
      : this.expandedValues().has(node.value);
  }

  protected isSelected(node: AerisTreeNode): boolean {
    if (this.selectionMode() === 'checkbox' && this.propagateSelection()) {
      return this.checkboxState(node) === 'true';
    }
    return this.selectedValues().has(node.value);
  }

  protected isPartiallySelected(node: AerisTreeNode): boolean {
    return this.checkboxState(node) === 'mixed';
  }

  protected checkboxState(node: AerisTreeNode): TreeCheckboxState {
    if (!this.propagateSelection()) {
      return this.selectedValues().has(node.value) ? 'true' : 'false';
    }
    return this.checkboxStates().get(node.value) ?? 'false';
  }

  protected nodeUnavailable(node: AerisTreeNode): boolean {
    return Boolean(node.disabled);
  }

  protected activate(node: AerisTreeNode): void {
    if (!this.nodeUnavailable(node)) this.activeValue.set(node.value);
  }

  protected selectNode(node: AerisTreeNode, event: Event): void {
    if (this.nodeUnavailable(node) || !this.nodeSelectable(node)) return;
    const selected = this.selectionMode() === 'checkbox'
      ? this.checkboxState(node) === 'true'
      : this.isSelected(node);
    if (this.selectionMode() === 'single') {
      this.setValue(node.value);
      this.changed.emit({ originalEvent: event, value: node.value, node, selected: true });
      this.closePanel(true);
      return;
    }

    const next = new Set(this.selectedValues());
    const targets = this.selectionMode() === 'checkbox' && this.propagateSelection()
      ? [node, ...flattenAll(node.children ?? []).map((item) => item.node)].filter((item) => this.nodeSelectable(item) && !item.disabled)
      : [node];

    for (const target of targets) {
      if (selected) next.delete(target.value);
      else next.add(target.value);
    }

    if (this.selectionMode() === 'checkbox' && this.propagateSelection()) {
      this.synchronizeParentValues(next);
    }

    const value = [...next];
    this.setValue(value);
    this.changed.emit({ originalEvent: event, value, node, selected: !selected });
  }

  protected handleToggleClick(node: AerisTreeNode, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleNode(node);
  }

  protected handleClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.clear();
  }

  protected handleTriggerKeydown(event: KeyboardEvent): void {
    if (this.effectiveDisabled()) return;
    if (event.key === 'Escape') {
      if (this.open()) {
        event.preventDefault();
        this.closePanel(false);
      }
      return;
    }
    if (event.key === 'Tab') {
      this.closePanel(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open()) this.openPanel();
      else this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open()) this.openPanel();
      else this.selectActive(event);
    }
  }

  protected handleTreeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel(true);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      const node = this.activeNode();
      if (node?.children?.length && !this.isExpanded(node)) this.toggleNode(node);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const node = this.activeNode();
      if (node?.children?.length && this.isExpanded(node)) this.toggleNode(node);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const nodes = this.availableNodes();
      this.activeValue.set(event.key === 'Home' ? nodes[0]?.node.value ?? null : nodes.at(-1)?.node.value ?? null);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectActive(event);
    }
  }

  protected handleFilterInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filterValue.set(query);
    this.activeValue.set(this.initialActiveValue());
    this.filterChanged.emit({ originalEvent: event, query });
  }

  protected clearFilter(): void {
    this.filterValue.set('');
    this.activeValue.set(this.initialActiveValue());
    queueMicrotask(() => this.filterInput()?.nativeElement.focus());
  }

  protected handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    if (next instanceof Node && this.host.nativeElement.contains(next)) return;
    this.closePanel(false);
    this.onTouched();
    this.touch.emit();
    this.blurred.emit(event);
  }

  protected nodeId(node: AerisTreeNode): string {
    return `${this.treeId}-node-${cssSafe(node.value)}`;
  }

  private nodeSelectable(node: AerisTreeNode): boolean {
    return node.selectable !== false;
  }

  private createCheckboxStates(
    selectedValues: ReadonlySet<string>,
  ): ReadonlyMap<string, TreeCheckboxState> {
    const states = new Map<string, TreeCheckboxState>();

    const visit = (node: AerisTreeNode): TreeCheckboxState | null => {
      const childStates = (node.children ?? [])
        .map((child) => visit(child))
        .filter((state): state is TreeCheckboxState => state !== null);

      let state: TreeCheckboxState | null;
      if (childStates.length) {
        if (childStates.every((childState) => childState === 'true')) state = 'true';
        else if (childStates.every((childState) => childState === 'false')) state = 'false';
        else state = 'mixed';
      } else if (this.nodeSelectable(node) && !this.nodeUnavailable(node)) {
        state = selectedValues.has(node.value) ? 'true' : 'false';
      } else {
        state = null;
      }

      if (state !== null) states.set(node.value, state);
      return state;
    };

    for (const node of this.nodes()) visit(node);
    return states;
  }

  private synchronizeParentValues(values: Set<string>): void {
    const states = this.createCheckboxStates(values);
    for (const { node } of this.allNodes()) {
      if (!node.children?.length || !this.nodeSelectable(node) || this.nodeUnavailable(node)) {
        continue;
      }
      if (states.get(node.value) === 'true') values.add(node.value);
      else values.delete(node.value);
    }
  }

  private toggleNode(node: AerisTreeNode): void {
    if (!this.hasChildren(node)) return;
    this.initializeExpansion();
    const next = new Set(this.expandedValues());
    if (next.has(node.value)) {
      next.delete(node.value);
      this.nodeCollapsed.emit(node);
    } else {
      next.add(node.value);
      this.nodeExpanded.emit(node);
    }
    this.expandedValues.set(next);
  }

  private activeNode(): AerisTreeNode | null {
    const value = this.activeValue();
    return this.visibleNodes().find((item) => item.node.value === value)?.node ?? null;
  }

  private selectActive(event: Event): void {
    const node = this.activeNode();
    if (node) this.selectNode(node, event);
  }

  private moveActive(direction: 1 | -1): void {
    const nodes = this.availableNodes();
    if (!nodes.length) {
      this.activeValue.set(null);
      return;
    }
    const index = nodes.findIndex((item) => item.node.value === this.activeValue());
    const nextIndex = index < 0 ? 0 : (index + direction + nodes.length) % nodes.length;
    this.activeValue.set(nodes[nextIndex]?.node.value ?? null);
  }

  private initialActiveValue(): string | null {
    const selected = this.visibleNodes().find((item) => this.isSelected(item.node) && !this.nodeUnavailable(item.node));
    return selected?.node.value ?? this.availableNodes()[0]?.node.value ?? null;
  }

  private availableNodes(): readonly FlatTreeNode[] {
    return this.visibleNodes().filter((item) => !this.nodeUnavailable(item.node));
  }

  private setValue(value: AerisTreeSelectValue): void {
    const normalized = Array.isArray(value) ? [...new Set(value)] : value;
    this.value.set(normalized);
    this.valueInput.emit(normalized);
    this.onChange(normalized);
  }

  private initializeExpansion(): void {
    if (this.expansionInitialized()) return;
    this.expandedValues.set(new Set(initialExpandedValues(this.nodes())));
    this.expansionInitialized.set(true);
  }
}

export const AerisTreeSelect = [
  AerisTreeSelectComponent,
  AerisTreeSelectNodeTemplate,
  AerisTreeSelectValueTemplate,
  AerisTreeSelectHeaderTemplate,
  AerisTreeSelectFooterTemplate,
  AerisTreeSelectEmptyTemplate,
] as const;

function initialExpandedValues(nodes: readonly AerisTreeNode[]): readonly string[] {
  const values: string[] = [];
  for (const node of nodes) {
    if (node.expanded) values.push(node.value);
    values.push(...initialExpandedValues(node.children ?? []));
  }
  return values;
}

function flattenAll(nodes: readonly AerisTreeNode[], level = 0, parent: AerisTreeNode | null = null): readonly FlatTreeNode[] {
  return nodes.flatMap((node) => [
    { node, level, parent },
    ...flattenAll(node.children ?? [], level + 1, node),
  ]);
}

function flattenVisible(nodes: readonly AerisTreeNode[], expanded: ReadonlySet<string>, level = 0, parent: AerisTreeNode | null = null): readonly FlatTreeNode[] {
  return nodes.flatMap((node) => [
    { node, level, parent },
    ...(expanded.has(node.value) ? flattenVisible(node.children ?? [], expanded, level + 1, node) : []),
  ]);
}

function flattenFiltered(nodes: readonly AerisTreeNode[], query: string, level = 0, parent: AerisTreeNode | null = null): readonly FlatTreeNode[] {
  const result: FlatTreeNode[] = [];
  for (const node of nodes) {
    const children = flattenFiltered(node.children ?? [], query, level + 1, node);
    if (node.label.toLocaleLowerCase().includes(query) || children.length) {
      result.push({ node, level, parent }, ...children);
    }
  }
  return result;
}

function cssSafe(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}
