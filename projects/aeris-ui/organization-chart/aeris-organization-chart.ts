import { ɵAerisIcon } from '@aeris-ui/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  effect,
  linkedSignal,
  model,
  output,
  viewChildren,
} from '@angular/core';

export type AerisOrganizationChartSelectionMode = 'single' | 'multiple';

export interface AerisOrganizationChartNode<TData = unknown> {
  readonly key?: string;
  readonly label?: string;
  readonly type?: string;
  readonly data?: TData;
  readonly children?: readonly AerisOrganizationChartNode<TData>[];
  readonly selectable?: boolean;
  readonly expanded?: boolean;
}

interface OrganizationChartEntry<TData> {
  readonly key: string;
  readonly parentKey: string | null;
  readonly node: AerisOrganizationChartNode<TData>;
}

export interface AerisOrganizationChartNodeEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
}

export interface AerisOrganizationChartSelectionEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly selectedKeys: readonly string[];
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
}

interface AerisOrganizationChartNodeContext<TData = unknown> {
  readonly $implicit: AerisOrganizationChartNode<TData>;
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
  readonly selected: boolean;
  readonly expanded: boolean;
  readonly leaf: boolean;
  readonly level: number;
}

@Directive({ selector: 'ng-template[aerisOrganizationChartNode]' })
export class AerisOrganizationChartNodeTemplate<TData = unknown> {
  readonly template = inject<TemplateRef<AerisOrganizationChartNodeContext<TData>>>(TemplateRef);

  static ngTemplateContextGuard<TData>(
    _directive: AerisOrganizationChartNodeTemplate<TData>,
    context: unknown,
  ): context is AerisOrganizationChartNodeContext<TData> {
    return true;
  }
}

@Directive({ selector: 'ng-template[aerisOrganizationChartEmpty]' })
export class AerisOrganizationChartEmptyTemplate {
  readonly template = inject<TemplateRef<void>>(TemplateRef);
}

@Component({
  selector: 'aeris-organization-chart',
  imports: [ɵAerisIcon, NgTemplateOutlet],
  template: `
    <div class="aeris-organization-chart" [attr.data-fluid]="fluid() || null">
      @if (value().length) {
        <div class="aeris-organization-chart__viewport">
          <ng-template #nodeTemplate let-node let-key="key" let-level="level">
            <li
              #nodeElement
              class="aeris-organization-chart__branch"
              role="treeitem"
              [tabIndex]="activeKey() === key ? 0 : -1"
              [attr.aria-label]="nodeAriaLabel(node)"
              [attr.aria-selected]="selectionMode() ? isSelected(key) : null"
              [attr.aria-expanded]="hasChildren(node) ? !isCollapsed(key) : null"
              [attr.data-aeris-key]="key"
              (click)="selectNode(node, key, $event)"
              (keydown)="handleNodeKeydown($event, node, key)"
              (focusin)="handleNodeFocus($event, key)"
            >
              <div class="aeris-organization-chart__node-shell">
                <div
                  class="aeris-organization-chart__node"
                  [attr.data-selected]="isSelected(key) || null"
                  [attr.data-selectable]="isNodeSelectable(node) || null"
                  [attr.data-type]="node.type || null"
                  [style.--aeris-org-level]="level"
                >
                  @if (nodeTemplateDirective(); as customNode) {
                    <ng-container
                      [ngTemplateOutlet]="customNode.template"
                      [ngTemplateOutletContext]="{
                        $implicit: node,
                        node,
                        key,
                        selected: isSelected(key),
                        expanded: !isCollapsed(key),
                        leaf: !hasChildren(node),
                        level,
                      }"
                    />
                  } @else {
                    <span class="aeris-organization-chart__label">{{ nodeLabel(node) }}</span>
                    @if (node.type) {
                      <small>{{ node.type }}</small>
                    }
                  }
                </div>

                @if (collapsible() && hasChildren(node)) {
                  <button
                    class="aeris-organization-chart__toggle"
                    type="button"
                    tabindex="-1"
                    [attr.aria-label]="isCollapsed(key) ? expandAriaLabel() : collapseAriaLabel()"
                    [attr.aria-expanded]="!isCollapsed(key)"
                    (click)="toggleNode(node, key, $event)"
                  >
                    @if (toggleIconTemplate(); as customIcon) {
                      <span aria-hidden="true" data-aeris-custom-icon
                        ><ng-container [ngTemplateOutlet]="customIcon"
                      /></span>
                    } @else {
                      <span aerisInternalIcon="chevron" aria-hidden="true"></span>
                    }
                  </button>
                }
              </div>

              @if (hasVisibleChildren(node, key)) {
                <ul
                  role="group"
                  class="aeris-organization-chart__children"
                  animate.enter="aeris-organization-chart__children--enter"
                  animate.leave="aeris-organization-chart__children--leave"
                >
                  @for (
                    child of visibleChildren(node, key);
                    track nodeKey(child, childIndex);
                    let childIndex = $index
                  ) {
                    <ng-container
                      [ngTemplateOutlet]="nodeTemplate"
                      [ngTemplateOutletContext]="{
                        $implicit: child,
                        key: nodeKey(child, key + '-' + childIndex),
                        level: level + 1,
                      }"
                    />
                  }
                </ul>
              }
            </li>
          </ng-template>

          <ul
            class="aeris-organization-chart__tree"
            role="tree"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-multiselectable]="selectionMode() === 'multiple' ? true : null"
          >
            @for (node of value(); track nodeKey(node, $index); let index = $index) {
              <ng-container
                [ngTemplateOutlet]="nodeTemplate"
                [ngTemplateOutletContext]="{
                  $implicit: node,
                  key: nodeKey(node, index),
                  level: 1,
                }"
              />
            }
          </ul>
        </div>
      } @else {
        <div class="aeris-organization-chart__empty" role="status">
          @if (emptyTemplate(); as customEmpty) {
            <ng-container [ngTemplateOutlet]="customEmpty.template" />
          } @else {
            {{ emptyMessage() }}
          }
        </div>
      }
    </div>
  `,
  styleUrl: './aeris-organization-chart.scss',
})
export class AerisOrganizationChart<TData = unknown> {
  readonly toggleIconTemplate = input<TemplateRef<void>>();

  readonly value = input<readonly AerisOrganizationChartNode<TData>[]>([]);
  readonly selectionKeys = model<readonly string[]>([]);
  readonly collapsedKeys = model<readonly string[]>([]);
  readonly selectionMode = input<AerisOrganizationChartSelectionMode | null>(null);
  readonly collapsible = input(true, { transform: booleanAttribute });
  readonly fluid = input(true, { transform: booleanAttribute });
  readonly ariaLabel = input('Organization chart');
  readonly emptyMessage = input('No organization chart data available');
  readonly expandAriaLabel = input('Expand node');
  readonly collapseAriaLabel = input('Collapse node');

  readonly nodeSelected = output<AerisOrganizationChartSelectionEvent<TData>>();
  readonly nodeUnselected = output<AerisOrganizationChartSelectionEvent<TData>>();
  readonly selectionChanged = output<AerisOrganizationChartSelectionEvent<TData>>();
  readonly nodeExpanded = output<AerisOrganizationChartNodeEvent<TData>>();
  readonly nodeCollapsed = output<AerisOrganizationChartNodeEvent<TData>>();

  protected readonly nodeTemplateDirective = contentChild(
    AerisOrganizationChartNodeTemplate<TData>,
  );
  protected readonly emptyTemplate = contentChild(AerisOrganizationChartEmptyTemplate);
  private readonly nodeElements = viewChildren<ElementRef<HTMLElement>>('nodeElement');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderedEntries = computed(() => this.collectRenderedEntries(this.value()));
  protected readonly activeKey = linkedSignal<
    readonly OrganizationChartEntry<TData>[],
    string | null
  >({
    source: this.renderedEntries,
    computation: (entries, previous) => {
      let key = previous?.value ?? null;
      while (key !== null) {
        if (entries.some((entry) => entry.key === key)) return key;
        key = previous?.source.find((entry) => entry.key === key)?.parentKey ?? null;
      }
      return entries[0]?.key ?? null;
    },
  });

  constructor() {
    effect(() => {
      const key = this.activeKey();
      const active = this.host.nativeElement.ownerDocument.activeElement;
      if (!active || !this.host.nativeElement.contains(active)) return;
      const branch = active.closest('[data-aeris-key]');
      if (
        branch &&
        !this.renderedEntries().some((entry) => entry.key === branch.getAttribute('data-aeris-key'))
      )
        this.focusRenderedKey(key ?? undefined);
    });
  }

  protected handleNodeFocus(event: FocusEvent, key: string): void {
    if (
      event.target instanceof Element &&
      event.target.closest('[role="treeitem"]') === event.currentTarget
    )
      this.activeKey.set(key);
  }

  protected nodeKey(node: AerisOrganizationChartNode<TData>, fallback: string | number): string {
    return node.key ?? String(fallback);
  }

  protected nodeLabel(node: AerisOrganizationChartNode<TData>): string {
    return node.label ?? '';
  }

  protected nodeAriaLabel(node: AerisOrganizationChartNode<TData>): string {
    return this.nodeLabel(node) || node.type || 'Organization chart node';
  }

  protected hasChildren(node: AerisOrganizationChartNode<TData>): boolean {
    return Boolean(node.children?.length);
  }

  protected isCollapsed(key: string): boolean {
    return this.collapsedKeys().includes(key);
  }

  protected hasVisibleChildren(node: AerisOrganizationChartNode<TData>, key: string): boolean {
    return this.hasChildren(node) && !this.isCollapsed(key);
  }

  protected visibleChildren(
    node: AerisOrganizationChartNode<TData>,
    key: string,
  ): readonly AerisOrganizationChartNode<TData>[] {
    return this.hasVisibleChildren(node, key) ? (node.children ?? []) : [];
  }

  protected isSelected(key: string): boolean {
    return this.selectionKeys().includes(key);
  }

  protected isNodeSelectable(node: AerisOrganizationChartNode<TData>): boolean {
    return Boolean(this.selectionMode()) && node.selectable !== false;
  }

  protected selectNode(
    node: AerisOrganizationChartNode<TData>,
    key: string,
    originalEvent: Event,
  ): void {
    originalEvent.stopPropagation();
    this.activeKey.set(key);
    if (!this.isNodeSelectable(node)) return;

    const wasSelected = this.isSelected(key);
    const selectedKeys =
      this.selectionMode() === 'single'
        ? wasSelected
          ? []
          : [key]
        : wasSelected
          ? this.selectionKeys().filter((selectedKey) => selectedKey !== key)
          : [...this.selectionKeys(), key];

    this.selectionKeys.set(selectedKeys);
    const event = { originalEvent, selectedKeys, node, key };
    this.selectionChanged.emit(event);
    if (wasSelected) {
      this.nodeUnselected.emit(event);
    } else {
      this.nodeSelected.emit(event);
    }
  }

  protected toggleNode(
    node: AerisOrganizationChartNode<TData>,
    key: string,
    originalEvent: Event,
  ): void {
    originalEvent.stopPropagation();
    if (!this.collapsible() || !this.hasChildren(node)) return;

    if (this.isCollapsed(key)) {
      this.collapsedKeys.set(this.collapsedKeys().filter((item) => item !== key));
      this.nodeExpanded.emit({ originalEvent, node, key });
    } else {
      this.collapsedKeys.set([...this.collapsedKeys(), key]);
      this.nodeCollapsed.emit({ originalEvent, node, key });
    }
  }

  protected handleNodeKeydown(
    event: KeyboardEvent,
    node: AerisOrganizationChartNode<TData>,
    key: string,
  ): void {
    if (event.target !== event.currentTarget || event.isComposing) return;
    const entries = this.renderedEntries();
    const index = entries.findIndex((entry) => entry.key === key);
    const rtl =
      this.host.nativeElement.ownerDocument.defaultView?.getComputedStyle(this.host.nativeElement)
        .direction === 'rtl';
    const expandKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const collapseKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectNode(node, key, event);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusRenderedKey(entries[index + (event.key === 'ArrowDown' ? 1 : -1)]?.key);
    } else if (event.key === collapseKey) {
      event.preventDefault();
      if (this.collapsible() && this.hasChildren(node) && !this.isCollapsed(key))
        this.toggleNode(node, key, event);
      else this.focusRenderedKey(entries[index]?.parentKey ?? undefined);
    } else if (event.key === expandKey) {
      event.preventDefault();
      if (this.collapsible() && this.hasChildren(node) && this.isCollapsed(key))
        this.toggleNode(node, key, event);
      else this.focusRenderedKey(entries.find((entry) => entry.parentKey === key)?.key);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.focusRenderedKey(entries[0]?.key);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.focusRenderedKey(entries.at(-1)?.key);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const query = event.key.toLocaleLowerCase();
      const ordered = [...entries.slice(index + 1), ...entries.slice(0, index + 1)];
      const match = ordered.find((entry) =>
        this.nodeAriaLabel(entry.node).toLocaleLowerCase().startsWith(query),
      );
      if (match) {
        event.preventDefault();
        this.focusRenderedKey(match.key);
      }
    }
  }

  private collectRenderedEntries(
    nodes: readonly AerisOrganizationChartNode<TData>[],
    parentKey: string | null = null,
  ): readonly OrganizationChartEntry<TData>[] {
    const entries: OrganizationChartEntry<TData>[] = [];
    nodes.forEach((node, index) => {
      const key = this.nodeKey(node, parentKey ? `${parentKey}-${index}` : String(index));
      entries.push({ key, parentKey, node });
      if (node.children?.length && !this.isCollapsed(key)) {
        entries.push(...this.collectRenderedEntries(node.children, key));
      }
    });
    return entries;
  }

  private focusRenderedKey(key: string | undefined): void {
    if (!key) return;
    this.nodeElements()
      .find((element) => element.nativeElement.getAttribute('data-aeris-key') === key)
      ?.nativeElement.focus();
  }
}

export const AerisOrganizationChartModule = [
  AerisOrganizationChart,
  AerisOrganizationChartNodeTemplate,
  AerisOrganizationChartEmptyTemplate,
] as const;
