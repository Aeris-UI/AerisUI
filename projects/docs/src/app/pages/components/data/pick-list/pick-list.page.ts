import { Component, signal } from '@angular/core';
import {
  AerisPickListModule,
  type AerisPickListFilterEvent,
  type AerisPickListReorderEvent,
  type AerisPickListSelectionEvent,
  type AerisPickListTransferEvent,
} from '@aeris-ui/core/pick-list';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

interface Product {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly status: string;
}

@Component({
  selector: 'app-pick-list-page',
  imports: [
    AerisPickListModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './pick-list.page.html',
  styleUrl: './pick-list.page.scss',
})
export class PickListPage {
  protected readonly basicSource = signal<readonly Product[]>(this.availableProducts());
  protected readonly basicTarget = signal<readonly Product[]>(this.selectedProducts());
  protected readonly basicSourceSelection = signal<readonly string[]>(['keyboard', 'lamp']);
  protected readonly basicTargetSelection = signal<readonly string[]>([]);

  protected readonly filterSource = signal<readonly Product[]>(this.availableProducts());
  protected readonly filterTarget = signal<readonly Product[]>(this.selectedProducts());
  protected readonly dragSource = signal<readonly Product[]>(this.availableProducts());
  protected readonly dragTarget = signal<readonly Product[]>(this.selectedProducts());
  protected readonly templateSource = signal<readonly Product[]>(this.availableProducts());
  protected readonly templateTarget = signal<readonly Product[]>(this.selectedProducts());
  protected readonly limitedSource = signal<readonly Product[]>(this.availableProducts());
  protected readonly limitedTarget = signal<readonly Product[]>(this.selectedProducts());
  protected readonly manySource = signal<readonly Product[]>(this.manyProducts());
  protected readonly manyTarget = signal<readonly Product[]>([]);
  protected readonly eventSource = signal<readonly Product[]>(this.availableProducts());
  protected readonly eventTarget = signal<readonly Product[]>(this.selectedProducts());
  protected readonly eventText = signal('No PickList event yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'pick-list-basic', label: 'Basic' },
    { id: 'pick-list-filtering', label: 'Filtering' },
    { id: 'pick-list-drag-drop', label: 'Drag and drop' },
    { id: 'pick-list-template', label: 'Item template' },
    { id: 'pick-list-limit', label: 'Target limit' },
    { id: 'pick-list-scrolling', label: 'Scrolling' },
    { id: 'pick-list-states', label: 'States' },
    { id: 'pick-list-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'pick-list-api-inputs', label: 'Inputs' },
    { id: 'pick-list-api-models', label: 'Models' },
    { id: 'pick-list-api-outputs', label: 'Outputs' },
    { id: 'pick-list-api-templates', label: 'Templates' },
    { id: 'pick-list-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisPickListModule } from '@aeris-ui/core/pick-list';`;

  protected readonly basicTsCode = `interface Product {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly status: string;
}

protected readonly basicSource = signal<readonly Product[]>([
  { id: 'monitor', label: 'Monitor', category: 'Hardware', status: 'Ready' },
  { id: 'keyboard', label: 'Keyboard', category: 'Hardware', status: 'Ready' },
  { id: 'lamp', label: 'Desk lamp', category: 'Furniture', status: 'Low stock' },
  { id: 'chair', label: 'Task chair', category: 'Furniture', status: 'Ready' },
  { id: 'dock', label: 'Docking station', category: 'Hardware', status: 'Backordered' },
  { id: 'headset', label: 'Headset', category: 'Accessories', status: 'Ready' },
]);
protected readonly basicTarget = signal<readonly Product[]>([
  { id: 'desk', label: 'Standing desk', category: 'Furniture', status: 'Ready' },
  { id: 'mouse', label: 'Wireless mouse', category: 'Accessories', status: 'Ready' },
]);
protected readonly basicSourceSelection = signal<readonly string[]>(['keyboard', 'lamp']);
protected readonly basicTargetSelection = signal<readonly string[]>([]);`;

  protected readonly filterTsCode = this.collectionTsCode('filterSource', 'filterTarget');

  protected readonly dragTsCode = this.collectionTsCode('dragSource', 'dragTarget');

  protected readonly templateTsCode = this.collectionTsCode('templateSource', 'templateTarget');

  protected readonly limitedTsCode = this.collectionTsCode('limitedSource', 'limitedTarget');

  protected readonly scrollingTsCode = `protected readonly manySource = signal<readonly Product[]>(
  Array.from({ length: 24 }, (_, index) => ({
    id: \`product-\${index + 1}\`,
    label: \`Workspace item \${index + 1}\`,
    category: index % 2 === 0 ? 'Hardware' : 'Furniture',
    status: index % 4 === 0 ? 'Low stock' : 'Ready',
  })),
);
protected readonly manyTarget = signal<readonly Product[]>([]);`;

  protected readonly templateHtmlCode = `<aeris-pick-list
  showFilter
  filterBy="label,category"
  [(source)]="templateSource"
  [(target)]="templateTarget"
>
  <ng-template aerisPickListItem let-product let-side="side">
    <span class="product-row">
      <span class="product-row__marker" [attr.data-side]="side"></span>
      <span>
        <strong>{{ $any(product).label }}</strong>
        <small>{{ $any(product).category }} - {{ $any(product).status }}</small>
      </span>
    </span>
  </ng-template>
</aeris-pick-list>`;

  protected readonly templateCssCode = `.product-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-row__marker {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--aeris-secondary);
}

.product-row__marker[data-side='target'] {
  background: var(--aeris-primary);
}`;

  protected readonly eventsTsCode = `${this.collectionTsCode('eventSource', 'eventTarget')}
protected readonly eventText = signal('No PickList event yet.');

protected handleTransfer(event: AerisPickListTransferEvent<Product>): void {
  this.eventText.set(
    \`\${event.items.length} item(s) moved \${event.direction}.\`,
  );
}

protected handleSelection(event: AerisPickListSelectionEvent<Product>): void {
  this.eventText.set(
    \`\${event.selectedItems.length} \${event.side} item(s) selected.\`,
  );
}

protected handleReorder(event: AerisPickListReorderEvent<Product>): void {
  this.eventText.set(\`\${event.side} list reordered.\`);
}

protected handleFilter(event: AerisPickListFilterEvent): void {
  this.eventText.set(\`\${event.side} filter changed to \${event.value}.\`);
}`;

  protected readonly interfacesCode = `type AerisPickListItem = object;
type AerisPickListSide = 'source' | 'target';
type AerisPickListDirection = 'to-source' | 'to-target';
type AerisPickListFilterMatchMode = 'contains' | 'startsWith';

interface AerisPickListSelectionEvent<TItem> {
  readonly originalEvent: Event;
  readonly side: AerisPickListSide;
  readonly selectedKeys: readonly string[];
  readonly selectedItems: readonly TItem[];
}

interface AerisPickListTransferEvent<TItem> {
  readonly originalEvent: Event | null;
  readonly direction: AerisPickListDirection;
  readonly items: readonly TItem[];
  readonly source: readonly TItem[];
  readonly target: readonly TItem[];
}

interface AerisPickListReorderEvent<TItem> {
  readonly originalEvent: Event | null;
  readonly side: AerisPickListSide;
  readonly items: readonly TItem[];
  readonly selectedKeys: readonly string[];
}

interface AerisPickListFilterEvent {
  readonly originalEvent: Event;
  readonly side: AerisPickListSide;
  readonly value: string;
}

interface AerisPickListDragEvent<TItem> {
  readonly originalEvent: DragEvent;
  readonly side: AerisPickListSide;
  readonly item: TItem;
  readonly key: string;
  readonly selectedKeys: readonly string[];
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'optionLabel', type: 'string', defaultValue: "'label'", description: 'Property rendered by the default item template.' },
    { name: 'dataKey', type: 'string', defaultValue: "'id'", description: 'Property used as the stable item identity.' },
    { name: 'filterBy', type: 'string', defaultValue: "'label'", description: 'Comma-separated properties searched by both filters.' },
    { name: 'filterMatchMode', type: 'contains | startsWith', defaultValue: "'contains'", description: 'Matching strategy used by pane filters.' },
    { name: 'sourceHeader', type: 'string', defaultValue: "'Available'", description: 'Visible source pane heading.' },
    { name: 'targetHeader', type: 'string', defaultValue: "'Selected'", description: 'Visible target pane heading.' },
    { name: 'sourceAriaLabel', type: 'string', defaultValue: "'Available items'", description: 'Accessible name for the source listbox.' },
    { name: 'targetAriaLabel', type: 'string', defaultValue: "'Selected items'", description: 'Accessible name for the target listbox.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Item transfer'", description: 'Accessible name for the complete PickList group.' },
    { name: 'sourceFilterPlaceholder', type: 'string', defaultValue: "'Filter available items'", description: 'Source filter placeholder.' },
    { name: 'targetFilterPlaceholder', type: 'string', defaultValue: "'Filter selected items'", description: 'Target filter placeholder.' },
    { name: 'sourceFilterAriaLabel', type: 'string', defaultValue: "'Filter available items'", description: 'Accessible source filter label.' },
    { name: 'targetFilterAriaLabel', type: 'string', defaultValue: "'Filter selected items'", description: 'Accessible target filter label.' },
    { name: 'sourceEmptyMessage', type: 'string', defaultValue: "'No available items'", description: 'Source empty-state message.' },
    { name: 'targetEmptyMessage', type: 'string', defaultValue: "'No selected items'", description: 'Target empty-state message.' },
    { name: 'sourceFilterEmptyMessage', type: 'string', defaultValue: "'No available items match the filter'", description: 'Source filter-empty message.' },
    { name: 'targetFilterEmptyMessage', type: 'string', defaultValue: "'No selected items match the filter'", description: 'Target filter-empty message.' },
    { name: 'showFilter', type: 'boolean', defaultValue: 'false', description: 'Shows a filter in each pane.' },
    { name: 'showSourceControls', type: 'boolean', defaultValue: 'true', description: 'Shows source reorder controls.' },
    { name: 'showTargetControls', type: 'boolean', defaultValue: 'true', description: 'Shows target reorder controls.' },
    { name: 'showTransferControls', type: 'boolean', defaultValue: 'true', description: 'Shows the central transfer controls.' },
    { name: 'transferOnDoubleClick', type: 'boolean', defaultValue: 'false', description: 'Transfers a double-clicked item to the opposite pane.' },
    { name: 'dragDrop', type: 'boolean', defaultValue: 'true', description: 'Enables pointer drag transfer and same-pane reordering.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables filtering, selection, transfer, reordering, and dragging.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Fills the available container width.' },
    { name: 'targetLimit', type: 'number | null', defaultValue: 'null', description: 'Maximum number of items allowed in the target pane.' },
    { name: 'moveToTargetAriaLabel', type: 'string', defaultValue: "'Move selected items to selected list'", description: 'Selected-to-target control label.' },
    { name: 'moveAllToTargetAriaLabel', type: 'string', defaultValue: "'Move all items to selected list'", description: 'All-to-target control label.' },
    { name: 'moveToSourceAriaLabel', type: 'string', defaultValue: "'Move selected items to available list'", description: 'Selected-to-source control label.' },
    { name: 'moveAllToSourceAriaLabel', type: 'string', defaultValue: "'Move all items to available list'", description: 'All-to-source control label.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'source', type: 'readonly TItem[]', defaultValue: '[]', description: 'Items in the source pane.' },
    { name: 'target', type: 'readonly TItem[]', defaultValue: '[]', description: 'Items in the target pane.' },
    { name: 'sourceSelectedKeys', type: 'readonly string[]', defaultValue: '[]', description: 'Selected source item keys.' },
    { name: 'targetSelectedKeys', type: 'readonly string[]', defaultValue: '[]', description: 'Selected target item keys.' },
    { name: 'sourceFilter', type: 'string', defaultValue: "''", description: 'Controlled source filter value.' },
    { name: 'targetFilter', type: 'string', defaultValue: "''", description: 'Controlled target filter value.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'selectionChanged', type: 'AerisPickListSelectionEvent<TItem>', defaultValue: '-', description: 'Emitted when either selection changes.' },
    { name: 'transferred', type: 'AerisPickListTransferEvent<TItem>', defaultValue: '-', description: 'Emitted after either transfer direction.' },
    { name: 'movedToTarget', type: 'AerisPickListTransferEvent<TItem>', defaultValue: '-', description: 'Emitted after items enter the target pane.' },
    { name: 'movedToSource', type: 'AerisPickListTransferEvent<TItem>', defaultValue: '-', description: 'Emitted after items return to the source pane.' },
    { name: 'reordered', type: 'AerisPickListReorderEvent<TItem>', defaultValue: '-', description: 'Emitted after either pane is reordered.' },
    { name: 'sourceReordered', type: 'AerisPickListReorderEvent<TItem>', defaultValue: '-', description: 'Emitted after source reordering.' },
    { name: 'targetReordered', type: 'AerisPickListReorderEvent<TItem>', defaultValue: '-', description: 'Emitted after target reordering.' },
    { name: 'filterChanged', type: 'AerisPickListFilterEvent', defaultValue: '-', description: 'Emitted when either controlled filter changes.' },
    { name: 'dragStarted', type: 'AerisPickListDragEvent<TItem>', defaultValue: '-', description: 'Emitted when native dragging begins.' },
    { name: 'dragEnded', type: 'AerisPickListDragEvent<TItem>', defaultValue: '-', description: 'Emitted when native dragging ends.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisPickListItem', type: '{ $implicit, item, side, selected, index }', defaultValue: '-', description: 'Custom item content shared by both panes.' },
    { name: 'aerisPickListEmpty', type: '{ side, filtering }', defaultValue: '-', description: 'Custom empty or filter-empty content.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'moveSelectedToTarget()', type: 'void', defaultValue: '-', description: 'Moves selected source items to the target.' },
    { name: 'moveAllToTarget()', type: 'void', defaultValue: '-', description: 'Moves every allowed source item to the target.' },
    { name: 'moveSelectedToSource()', type: 'void', defaultValue: '-', description: 'Returns selected target items to the source.' },
    { name: 'moveAllToSource()', type: 'void', defaultValue: '-', description: 'Returns every target item to the source.' },
    { name: "moveSelectedUp('source' | 'target')", type: 'void', defaultValue: '-', description: 'Moves selected pane items up one position.' },
    { name: "moveSelectedDown('source' | 'target')", type: 'void', defaultValue: '-', description: 'Moves selected pane items down one position.' },
    { name: "moveSelectedToTop('source' | 'target')", type: 'void', defaultValue: '-', description: 'Moves selected pane items to the beginning.' },
    { name: "moveSelectedToBottom('source' | 'target')", type: 'void', defaultValue: '-', description: 'Moves selected pane items to the end.' },
    { name: 'clearFilters()', type: 'void', defaultValue: '-', description: 'Clears both controlled filter models.' },
  ];

  protected handleTransfer(event: AerisPickListTransferEvent<Product>): void {
    this.eventText.set(`${event.items.length} item(s) moved ${event.direction}.`);
  }

  protected handleSelection(event: AerisPickListSelectionEvent<Product>): void {
    this.eventText.set(`${event.selectedItems.length} ${event.side} item(s) selected.`);
  }

  protected handleReorder(event: AerisPickListReorderEvent<Product>): void {
    this.eventText.set(`${event.side} list reordered.`);
  }

  protected handleFilter(event: AerisPickListFilterEvent): void {
    this.eventText.set(`${event.side} filter changed to ${event.value}.`);
  }

  private availableProducts(): readonly Product[] {
    return [
      { id: 'monitor', label: 'Monitor', category: 'Hardware', status: 'Ready' },
      { id: 'keyboard', label: 'Keyboard', category: 'Hardware', status: 'Ready' },
      { id: 'lamp', label: 'Desk lamp', category: 'Furniture', status: 'Low stock' },
      { id: 'chair', label: 'Task chair', category: 'Furniture', status: 'Ready' },
      { id: 'dock', label: 'Docking station', category: 'Hardware', status: 'Backordered' },
      { id: 'headset', label: 'Headset', category: 'Accessories', status: 'Ready' },
    ];
  }

  private selectedProducts(): readonly Product[] {
    return [
      { id: 'desk', label: 'Standing desk', category: 'Furniture', status: 'Ready' },
      { id: 'mouse', label: 'Wireless mouse', category: 'Accessories', status: 'Ready' },
    ];
  }

  private manyProducts(): readonly Product[] {
    return Array.from({ length: 24 }, (_, index) => ({
      id: `product-${index + 1}`,
      label: `Workspace item ${index + 1}`,
      category: index % 2 === 0 ? 'Hardware' : 'Furniture',
      status: index % 4 === 0 ? 'Low stock' : 'Ready',
    }));
  }

  private collectionTsCode(sourceName: string, targetName: string): string {
    return `protected readonly ${sourceName} = signal<readonly Product[]>([
  { id: 'monitor', label: 'Monitor', category: 'Hardware', status: 'Ready' },
  { id: 'keyboard', label: 'Keyboard', category: 'Hardware', status: 'Ready' },
  { id: 'lamp', label: 'Desk lamp', category: 'Furniture', status: 'Low stock' },
  { id: 'chair', label: 'Task chair', category: 'Furniture', status: 'Ready' },
  { id: 'dock', label: 'Docking station', category: 'Hardware', status: 'Backordered' },
  { id: 'headset', label: 'Headset', category: 'Accessories', status: 'Ready' },
]);
protected readonly ${targetName} = signal<readonly Product[]>([
  { id: 'desk', label: 'Standing desk', category: 'Furniture', status: 'Ready' },
  { id: 'mouse', label: 'Wireless mouse', category: 'Accessories', status: 'Ready' },
]);`;
  }
}
