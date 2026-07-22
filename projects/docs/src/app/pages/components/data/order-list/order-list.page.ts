import { Component, signal } from '@angular/core';
import {
  AerisOrderListModule,
  type AerisOrderListReorderEvent,
  type AerisOrderListSelectionEvent,
} from '@aeris-ui/core/order-list';
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
  readonly stock: string;
}

@Component({
  selector: 'app-order-list-page',
  imports: [
    AerisOrderListModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './order-list.page.html',
  styleUrl: './order-list.page.scss',
})
export class OrderListPage {
  protected readonly basicProducts = signal<readonly Product[]>(this.createProducts());
  protected readonly selectedBasic = signal<readonly string[]>(['keyboard']);
  protected readonly templateProducts = signal<readonly Product[]>(this.createProducts());
  protected readonly selectedTemplate = signal<readonly string[]>(['monitor', 'keyboard']);
  protected readonly manyProducts = signal<readonly Product[]>(this.createManyProducts());
  protected readonly selectedMany = signal<readonly string[]>(['item-6']);
  protected readonly eventText = signal('No reorder event yet.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'order-list-basic', label: 'Basic' },
    { id: 'order-list-selection', label: 'Multiple selection' },
    { id: 'order-list-template', label: 'Item template' },
    { id: 'order-list-scrolling', label: 'Scrolling' },
    { id: 'order-list-states', label: 'States' },
    { id: 'order-list-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'order-list-api-inputs', label: 'Inputs' },
    { id: 'order-list-api-models', label: 'Models' },
    { id: 'order-list-api-outputs', label: 'Outputs' },
    { id: 'order-list-api-templates', label: 'Templates' },
    { id: 'order-list-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisOrderListModule } from '@aeris-ui/core/order-list';`;

  protected readonly basicTsCode = `interface Product {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly stock: string;
}

protected readonly products = signal<readonly Product[]>([
  { id: 'monitor', label: 'Monitor', category: 'Hardware', stock: 'In stock' },
  { id: 'keyboard', label: 'Keyboard', category: 'Hardware', stock: 'Low stock' },
  { id: 'desk', label: 'Desk', category: 'Furniture', stock: 'In stock' },
]);`;

  protected readonly eventsTsCode = `protected readonly products = signal<readonly Product[]>(this.createProducts());
protected readonly selected = signal<readonly string[]>(['keyboard']);
protected readonly eventText = signal('No reorder event yet.');

protected handleReorder(event: AerisOrderListReorderEvent): void {
  this.eventText.set(\`First item is now \${this.eventItemLabel(event.items[0])}.\`);
}

protected handleSelection(event: AerisOrderListSelectionEvent): void {
  this.eventText.set(\`\${event.selectedItems.length} item selected.\`);
}

protected eventItemLabel(item: object | undefined): string {
  if (!item || !Object.prototype.hasOwnProperty.call(item, 'label')) return 'none';
  return String((item as Record<string, unknown>)['label']);
}`;

  protected readonly templateCssCode = `.product-row {
  display: grid;
  gap: 0.2rem;
}

.product-row small {
  color: var(--text-3);
}`;

  protected readonly templateHtmlCode = `<aeris-order-list
  header="Inventory"
  ariaLabel="Inventory order"
  multiple
  [(items)]="products"
  [(selectedKeys)]="selectedKeys"
>
  <ng-template aerisOrderListItem let-product>
    <span class="product-row">
      <strong>{{ product.label }}</strong>
      <small>{{ product.category }} - {{ product.stock }}</small>
    </span>
  </ng-template>
</aeris-order-list>`;

  protected readonly scrollingCssCode = `.scrolling-order-list {
  --aeris-order-list-max-height: 18rem;
}`;

  protected readonly interfacesCode = `type AerisOrderListItem = object;

interface AerisOrderListReorderEvent<TItem = AerisOrderListItem> {
  readonly items: readonly TItem[];
  readonly selectedKeys: readonly string[];
}

interface AerisOrderListSelectionEvent<TItem = AerisOrderListItem> {
  readonly originalEvent: Event;
  readonly selectedKeys: readonly string[];
  readonly selectedItems: readonly TItem[];
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'optionLabel', type: 'string', defaultValue: "'label'", description: 'Property used as the default visible item label.' },
    { name: 'dataKey', type: 'string', defaultValue: "'id'", description: 'Property used as the stable item identity.' },
    { name: 'header', type: 'string', defaultValue: "''", description: 'Optional list header text.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No items available'", description: 'Message shown when the list has no items.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Ordered list'", description: 'Accessible name for the listbox.' },
    { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allows selecting and moving more than one item.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables selection and reordering.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Makes the component fill the available width.' },
    { name: 'showControls', type: 'boolean', defaultValue: 'true', description: 'Shows or hides the reorder controls.' },
    { name: 'moveTopAriaLabel', type: 'string', defaultValue: "'Move selected items to top'", description: 'Accessible label for the move-to-top button.' },
    { name: 'moveUpAriaLabel', type: 'string', defaultValue: "'Move selected items up'", description: 'Accessible label for the move-up button.' },
    { name: 'moveDownAriaLabel', type: 'string', defaultValue: "'Move selected items down'", description: 'Accessible label for the move-down button.' },
    { name: 'moveBottomAriaLabel', type: 'string', defaultValue: "'Move selected items to bottom'", description: 'Accessible label for the move-to-bottom button.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'items', type: 'readonly TItem[]', defaultValue: '[]', description: 'Ordered item collection. Reorder operations update this model.' },
    { name: 'selectedKeys', type: 'readonly string[]', defaultValue: '[]', description: 'Selected item keys.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'selectionChanged', type: 'AerisOrderListSelectionEvent<TItem>', defaultValue: '-', description: 'Emitted when item selection changes.' },
    { name: 'reordered', type: 'AerisOrderListReorderEvent<TItem>', defaultValue: '-', description: 'Emitted after selected items are moved.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisOrderListItem', type: '{ $implicit, item, selected, index }', defaultValue: '-', description: 'Custom item content.' },
    { name: 'aerisOrderListEmpty', type: 'none', defaultValue: '-', description: 'Custom empty state.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'moveSelectedUp()', type: 'void', defaultValue: '-', description: 'Moves selected items one position up.' },
    { name: 'moveSelectedDown()', type: 'void', defaultValue: '-', description: 'Moves selected items one position down.' },
    { name: 'moveSelectedToTop()', type: 'void', defaultValue: '-', description: 'Moves selected items to the beginning.' },
    { name: 'moveSelectedToBottom()', type: 'void', defaultValue: '-', description: 'Moves selected items to the end.' },
  ];

  protected handleReorder(event: AerisOrderListReorderEvent): void {
    this.eventText.set(`First item is now ${this.eventItemLabel(event.items[0])}.`);
  }

  protected handleSelection(event: AerisOrderListSelectionEvent): void {
    this.eventText.set(`${event.selectedItems.length} item selected.`);
  }

  protected eventItemLabel(item: object | undefined): string {
    if (!item || !Object.prototype.hasOwnProperty.call(item, 'label')) return 'none';
    return String((item as Record<string, unknown>)['label']);
  }

  private createProducts(): readonly Product[] {
    return [
      { id: 'monitor', label: 'Monitor', category: 'Hardware', stock: 'In stock' },
      { id: 'keyboard', label: 'Keyboard', category: 'Hardware', stock: 'Low stock' },
      { id: 'desk', label: 'Desk', category: 'Furniture', stock: 'In stock' },
      { id: 'lamp', label: 'Desk lamp', category: 'Furniture', stock: 'In stock' },
      { id: 'dock', label: 'Docking station', category: 'Hardware', stock: 'Backordered' },
    ];
  }

  private createManyProducts(): readonly Product[] {
    return Array.from({ length: 28 }, (_, index) => ({
      id: `item-${index + 1}`,
      label: `Queue item ${index + 1}`,
      category: index % 2 === 0 ? 'Hardware' : 'Furniture',
      stock: index % 3 === 0 ? 'Low stock' : 'In stock',
    }));
  }
}
