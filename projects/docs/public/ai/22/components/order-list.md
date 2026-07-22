# OrderList

> Reorder a single item collection with accessible selection and templates.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/order-list`
- Human-readable documentation: [https://aeris-ui.dev/components/order-list](https://aeris-ui.dev/components/order-list)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisOrderListModule } from '@aeris-ui/core/order-list';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `optionLabel` | `string` | `'label'` | Property used as the default visible item label. |
| `dataKey` | `string` | `'id'` | Property used as the stable item identity. |
| `header` | `string` | `''` | Optional list header text. |
| `emptyMessage` | `string` | `'No items available'` | Message shown when the list has no items. |
| `ariaLabel` | `string` | `'Ordered list'` | Accessible name for the listbox. |
| `multiple` | `boolean` | `false` | Allows selecting and moving more than one item. |
| `disabled` | `boolean` | `false` | Disables selection and reordering. |
| `fluid` | `boolean` | `true` | Makes the component fill the available width. |
| `showControls` | `boolean` | `true` | Shows or hides the reorder controls. |
| `moveTopAriaLabel` | `string` | `'Move selected items to top'` | Accessible label for the move-to-top button. |
| `moveUpAriaLabel` | `string` | `'Move selected items up'` | Accessible label for the move-up button. |
| `moveDownAriaLabel` | `string` | `'Move selected items down'` | Accessible label for the move-down button. |
| `moveBottomAriaLabel` | `string` | `'Move selected items to bottom'` | Accessible label for the move-to-bottom button. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly TItem[]` | `[]` | Ordered item collection. Reorder operations update this model. |
| `selectedKeys` | `readonly string[]` | `[]` | Selected item keys. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionChanged` | `AerisOrderListSelectionEvent&lt;TItem&gt;` | `-` | Emitted when item selection changes. |
| `reordered` | `AerisOrderListReorderEvent&lt;TItem&gt;` | `-` | Emitted after selected items are moved. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisOrderListItem` | `{ $implicit, item, selected, index }` | `-` | Custom item content. |
| `aerisOrderListEmpty` | `none` | `-` | Custom empty state. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `moveSelectedUp()` | `void` | `-` | Moves selected items one position up. |
| `moveSelectedDown()` | `void` | `-` | Moves selected items one position down. |
| `moveSelectedToTop()` | `void` | `-` | Moves selected items to the beginning. |
| `moveSelectedToBottom()` | `void` | `-` | Moves selected items to the end. |

## Interfaces and types

### Interfaces

```ts
type AerisOrderListItem = object;

interface AerisOrderListReorderEvent<TItem = AerisOrderListItem> {
  readonly items: readonly TItem[];
  readonly selectedKeys: readonly string[];
}

interface AerisOrderListSelectionEvent<TItem = AerisOrderListItem> {
  readonly originalEvent: Event;
  readonly selectedKeys: readonly string[];
  readonly selectedItems: readonly TItem[];
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-surface` | `CSS custom property` | — | List and control surface. |
| `--aeris-surface-2` | `CSS custom property` | — | Header, hover, and controls rail surface. |
| `--aeris-border` | `CSS custom property` | — | Container and control borders. |
| `--aeris-primary-soft` | `CSS custom property` | — | Selected item background. |
| `--aeris-focus` | `CSS custom property` | — | Keyboard focus ring. |
| `--aeris-order-list-max-height` | `CSS custom property` | — | Scrollable viewport max height. |
| `--aeris-order-list-item-padding` | `CSS custom property` | — | List item padding. |

## Examples

### Basic

Select an item and use the controls to move it through the ordered list.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisOrderListModule } from '@aeris-ui/core/order-list';

interface Product {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly stock: string;
}

@Component({
  selector: 'app-order-list-basic-demo',
  imports: [AerisOrderListModule],
  template: `
    <div class="order-list-demo">
      <aeris-order-list
        header="Products"
        ariaLabel="Product order"
        [(items)]="basicProducts"
        [(selectedKeys)]="selectedBasic"
      />
    </div>
  `,
  styles: `
    .order-list-demo,
    .order-list-states {
      width: 100%;
    }
    
    .order-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrderListBasicBasicDemo {
  protected readonly products = signal<readonly Product[]>([
    { id: 'monitor', label: 'Monitor', category: 'Hardware', stock: 'In stock' },
    { id: 'keyboard', label: 'Keyboard', category: 'Hardware', stock: 'Low stock' },
    { id: 'desk', label: 'Desk', category: 'Furniture', stock: 'In stock' },
  ]);
}
```

### Multiple selection

When multiple is enabled, selected items move as a group while preserving their relative order.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrderListModule } from '@aeris-ui/core/order-list';

@Component({
  selector: 'app-order-list-selection-demo',
  imports: [AerisOrderListModule],
  template: `
    <div class="order-list-demo">
      <aeris-order-list
        header="Selected equipment"
        ariaLabel="Equipment order"
        multiple
        [(items)]="templateProducts"
        [(selectedKeys)]="selectedTemplate"
      />
    </div>
  `,
  styles: `
    .order-list-demo,
    .order-list-states {
      width: 100%;
    }
    
    .order-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrderListSelectionMultipleSelectionDemo {
}
```

### Item template

Templates keep the reorder behavior while allowing richer item content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrderListModule } from '@aeris-ui/core/order-list';

@Component({
  selector: 'app-order-list-template-demo',
  imports: [AerisOrderListModule],
  template: `
    <aeris-order-list
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
    </aeris-order-list>
  `,
  styles: `
    .product-row {
      display: grid;
      gap: 0.2rem;
    }
    
    .product-row small {
      color: var(--text-3);
    }
  `
})
export class OrderListTemplateItemTemplateDemo {
}
```

### Scrolling

Long lists scroll inside the viewport. Size the component with layout CSS or tokens instead of a component input.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrderListModule } from '@aeris-ui/core/order-list';

@Component({
  selector: 'app-order-list-scrolling-demo',
  imports: [AerisOrderListModule],
  template: `
    <div class="order-list-demo">
      <aeris-order-list
        class="scrolling-order-list"
        header="Long queue"
        ariaLabel="Long queue order"
        [(items)]="manyProducts"
        [(selectedKeys)]="selectedMany"
      />
    </div>
  `,
  styles: `
    .order-list-demo,
    .order-list-states {
      width: 100%;
    }
    
    .order-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
    
    .scrolling-order-list {
      --aeris-order-list-max-height: 18rem;
    }
  `
})
export class OrderListScrollingScrollingDemo {
}
```

### States

OrderList includes disabled and empty states with preserved semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrderListModule } from '@aeris-ui/core/order-list';

@Component({
  selector: 'app-order-list-states-demo',
  imports: [AerisOrderListModule],
  template: `
    <div class="order-list-states">
      <aeris-order-list
        header="Disabled"
        disabled
        [items]="basicProducts()"
        [selectedKeys]="['monitor']"
      />
      <aeris-order-list header="Empty" [items]="[]" emptyMessage="No products queued" />
    </div>
  `,
  styles: `
    .order-list-demo,
    .order-list-states {
      width: 100%;
    }
    
    .order-list-states {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }
    
    @media (max-width: 54rem) {
      .order-list-states {
          grid-template-columns: 1fr;
        }
    }
  `
})
export class OrderListStatesStatesDemo {
}
```

### Events

Use outputs to react to selection and reorder changes.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisOrderListModule, type AerisOrderListReorderEvent, type AerisOrderListSelectionEvent } from '@aeris-ui/core/order-list';

@Component({
  selector: 'app-order-list-events-demo',
  imports: [AerisOrderListModule],
  template: `
    <div class="order-list-demo order-list-demo--stack">
      <aeris-order-list
        header="Event demo"
        [(items)]="basicProducts"
        [(selectedKeys)]="selectedBasic"
        (selectionChanged)="handleSelection($event)"
        (reordered)="handleReorder($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .order-list-demo,
    .order-list-states {
      width: 100%;
    }
    
    .order-list-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .order-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrderListEventsEventsDemo {
  protected readonly products = signal<readonly Product[]>(this.createProducts());
  protected readonly selected = signal<readonly string[]>(['keyboard']);
  protected readonly eventText = signal('No reorder event yet.');

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
}
```

## Accessibility

- The list uses listbox and option semantics with configurable accessible naming.
- Multiple mode sets aria-multiselectable and each item exposes aria-selected.
- Reorder controls are native buttons with configurable labels.
- Disabled state removes the listbox from the tab order and disables all item and reorder controls.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus through reorder controls and list items. |
| `Enter / Space` | Selects or clears an item button. |
| `Alt + ArrowUp` | Moves selected items up when the listbox has focus. |
| `Alt + ArrowDown` | Moves selected items down when the listbox has focus. |
| `Alt + Home` | Moves selected items to the top. |
| `Alt + End` | Moves selected items to the bottom. |
