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
  imports: [NgTemplateOutlet],
  template: `
    <div class="aeris-organization-chart" [attr.data-fluid]="fluid() || null">
      @if (value().length) {
        <div class="aeris-organization-chart__viewport" tabindex="0">
          <ng-template
            #nodeTemplate
            let-node
            let-key="key"
            let-level="level"
          >
            <li class="aeris-organization-chart__branch">
              <div class="aeris-organization-chart__node-shell">
                <div
                  #nodeElement
                  class="aeris-organization-chart__node"
                  role="treeitem"
                  tabindex="0"
                  [attr.aria-label]="nodeAriaLabel(node)"
                  [attr.aria-selected]="selectionMode() ? isSelected(key) : null"
                  [attr.aria-expanded]="hasChildren(node) ? !isCollapsed(key) : null"
                  [attr.data-selected]="isSelected(key) || null"
                  [attr.data-selectable]="isNodeSelectable(node) || null"
                  [attr.data-type]="node.type || null"
                  [attr.data-aeris-key]="key"
                  [style.--aeris-org-level]="level"
                  (click)="selectNode(node, key, $event)"
                  (keydown)="handleNodeKeydown($event, node, key)"
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
                        level
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
                    [attr.aria-label]="isCollapsed(key) ? expandAriaLabel() : collapseAriaLabel()"
                    [attr.aria-expanded]="!isCollapsed(key)"
                    (click)="toggleNode(node, key, $event)"
                  >
                    <span aria-hidden="true"></span>
                  </button>
                }
              </div>

              @if (hasVisibleChildren(node, key)) {
                <ul role="group" class="aeris-organization-chart__children">
                  @for (child of visibleChildren(node, key); track nodeKey(child, childIndex); let childIndex = $index) {
                    <ng-container
                      [ngTemplateOutlet]="nodeTemplate"
                      [ngTemplateOutletContext]="{
                        $implicit: child,
                        key: nodeKey(child, key + '-' + childIndex),
                        level: level + 1
                      }"
                    />
                  }
                </ul>
              }
            </li>
          </ng-template>

          <ul class="aeris-organization-chart__tree" role="tree" [attr.aria-label]="ariaLabel()">
            @for (node of value(); track nodeKey(node, $index); let index = $index) {
              <ng-container
                [ngTemplateOutlet]="nodeTemplate"
                [ngTemplateOutletContext]="{
                  $implicit: node,
                  key: nodeKey(node, index),
                  level: 1
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

  protected readonly nodeTemplateDirective = contentChild(AerisOrganizationChartNodeTemplate<TData>);
  protected readonly emptyTemplate = contentChild(AerisOrganizationChartEmptyTemplate);
  private readonly nodeElements = viewChildren<ElementRef<HTMLElement>>('nodeElement');
  protected readonly renderedKeys = computed(() => this.collectRenderedKeys(this.value()));

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
    if (!this.hasChildren(node)) return;

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
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectNode(node, key, event);
    } else if (event.key === 'ArrowLeft' && this.hasChildren(node) && !this.isCollapsed(key)) {
      event.preventDefault();
      this.toggleNode(node, key, event);
    } else if (event.key === 'ArrowRight' && this.hasChildren(node) && this.isCollapsed(key)) {
      event.preventDefault();
      this.toggleNode(node, key, event);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.focusRenderedKey(this.renderedKeys()[0]);
    } else if (event.key === 'End') {
      event.preventDefault();
      const keys = this.renderedKeys();
      this.focusRenderedKey(keys[keys.length - 1]);
    }
  }

  private collectRenderedKeys(
    nodes: readonly AerisOrganizationChartNode<TData>[],
    parentKey = '',
  ): readonly string[] {
    const keys: string[] = [];
    nodes.forEach((node, index) => {
      const key = this.nodeKey(node, parentKey ? `${parentKey}-${index}` : String(index));
      keys.push(key);
      if (node.children?.length && !this.isCollapsed(key)) {
        keys.push(...this.collectRenderedKeys(node.children, key));
      }
    });
    return keys;
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
