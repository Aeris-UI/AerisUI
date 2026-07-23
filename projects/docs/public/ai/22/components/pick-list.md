# PickList

> Transfer and reorder items across two collections with filtering and drag-and-drop.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/pick-list`
- Human-readable documentation: [https://aeris-ui.dev/components/pick-list](https://aeris-ui.dev/components/pick-list)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisPickListModule } from '@aeris-ui/core/pick-list';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `optionLabel` | `string` | `'label'` | Property rendered by the default item template. |
| `dataKey` | `string` | `'id'` | Property used as the stable item identity. |
| `filterBy` | `string` | `'label'` | Comma-separated properties searched by both filters. |
| `filterMatchMode` | `contains &#124; startsWith` | `'contains'` | Matching strategy used by pane filters. |
| `sourceHeader` | `string` | `'Available'` | Visible source pane heading. |
| `targetHeader` | `string` | `'Selected'` | Visible target pane heading. |
| `sourceAriaLabel` | `string` | `'Available items'` | Accessible name for the source listbox. |
| `targetAriaLabel` | `string` | `'Selected items'` | Accessible name for the target listbox. |
| `ariaLabel` | `string` | `'Item transfer'` | Accessible name for the complete PickList group. |
| `sourceFilterPlaceholder` | `string` | `'Filter available items'` | Source filter placeholder. |
| `targetFilterPlaceholder` | `string` | `'Filter selected items'` | Target filter placeholder. |
| `sourceFilterAriaLabel` | `string` | `'Filter available items'` | Accessible source filter label. |
| `targetFilterAriaLabel` | `string` | `'Filter selected items'` | Accessible target filter label. |
| `sourceEmptyMessage` | `string` | `'No available items'` | Source empty-state message. |
| `targetEmptyMessage` | `string` | `'No selected items'` | Target empty-state message. |
| `sourceFilterEmptyMessage` | `string` | `'No available items match the filter'` | Source filter-empty message. |
| `targetFilterEmptyMessage` | `string` | `'No selected items match the filter'` | Target filter-empty message. |
| `showFilter` | `boolean` | `false` | Shows a filter in each pane. |
| `showSourceControls` | `boolean` | `true` | Shows source reorder controls. |
| `showTargetControls` | `boolean` | `true` | Shows target reorder controls. |
| `showTransferControls` | `boolean` | `true` | Shows the central transfer controls. |
| `transferOnDoubleClick` | `boolean` | `false` | Transfers a double-clicked item to the opposite pane. |
| `dragDrop` | `boolean` | `true` | Enables pointer drag transfer and same-pane reordering. |
| `disabled` | `boolean` | `false` | Disables filtering, selection, transfer, reordering, and dragging. |
| `fluid` | `boolean` | `true` | Fills the available container width. |
| `targetLimit` | `number &#124; null` | `null` | Maximum number of items allowed in the target pane. |
| `moveToTargetAriaLabel` | `string` | `'Move selected items to selected list'` | Selected-to-target control label. |
| `moveAllToTargetAriaLabel` | `string` | `'Move all items to selected list'` | All-to-target control label. |
| `moveToSourceAriaLabel` | `string` | `'Move selected items to available list'` | Selected-to-source control label. |
| `moveAllToSourceAriaLabel` | `string` | `'Move all items to available list'` | All-to-source control label. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `readonly TItem[]` | `[]` | Items in the source pane. |
| `target` | `readonly TItem[]` | `[]` | Items in the target pane. |
| `sourceSelectedKeys` | `readonly string[]` | `[]` | Selected source item keys. |
| `targetSelectedKeys` | `readonly string[]` | `[]` | Selected target item keys. |
| `sourceFilter` | `string` | `''` | Controlled source filter value. |
| `targetFilter` | `string` | `''` | Controlled target filter value. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionChanged` | `AerisPickListSelectionEvent&lt;TItem&gt;` | `-` | Emitted when either selection changes. |
| `transferred` | `AerisPickListTransferEvent&lt;TItem&gt;` | `-` | Emitted after either transfer direction. |
| `movedToTarget` | `AerisPickListTransferEvent&lt;TItem&gt;` | `-` | Emitted after items enter the target pane. |
| `movedToSource` | `AerisPickListTransferEvent&lt;TItem&gt;` | `-` | Emitted after items return to the source pane. |
| `reordered` | `AerisPickListReorderEvent&lt;TItem&gt;` | `-` | Emitted after either pane is reordered. |
| `sourceReordered` | `AerisPickListReorderEvent&lt;TItem&gt;` | `-` | Emitted after source reordering. |
| `targetReordered` | `AerisPickListReorderEvent&lt;TItem&gt;` | `-` | Emitted after target reordering. |
| `filterChanged` | `AerisPickListFilterEvent` | `-` | Emitted when either controlled filter changes. |
| `dragStarted` | `AerisPickListDragEvent&lt;TItem&gt;` | `-` | Emitted when native dragging begins. |
| `dragEnded` | `AerisPickListDragEvent&lt;TItem&gt;` | `-` | Emitted when native dragging ends. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisPickListItem` | `{ $implicit, item, side, selected, index }` | `-` | Custom item content shared by both panes. |
| `aerisPickListEmpty` | `{ side, filtering }` | `-` | Custom empty or filter-empty content. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `moveSelectedToTarget()` | `void` | `-` | Moves selected source items to the target. |
| `moveAllToTarget()` | `void` | `-` | Moves every allowed source item to the target. |
| `moveSelectedToSource()` | `void` | `-` | Returns selected target items to the source. |
| `moveAllToSource()` | `void` | `-` | Returns every target item to the source. |
| `moveSelectedUp('source' &#124; 'target')` | `void` | `-` | Moves selected pane items up one position. |
| `moveSelectedDown('source' &#124; 'target')` | `void` | `-` | Moves selected pane items down one position. |
| `moveSelectedToTop('source' &#124; 'target')` | `void` | `-` | Moves selected pane items to the beginning. |
| `moveSelectedToBottom('source' &#124; 'target')` | `void` | `-` | Moves selected pane items to the end. |
| `clearFilters()` | `void` | `-` | Clears both controlled filter models. |

## Interfaces and types

### Interfaces

```ts
type AerisPickListItem = object;
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
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-pick-list-gap` | `CSS custom property` | — | Space between panes and transfer controls. |
| `--aeris-pick-list-border` | `CSS custom property` | — | Pane border color. |
| `--aeris-pick-list-radius` | `CSS custom property` | — | Pane corner radius. |
| `--aeris-pick-list-min-height` | `CSS custom property` | — | Minimum listbox viewport height. |
| `--aeris-pick-list-max-height` | `CSS custom property` | — | Maximum scrollable viewport height. |
| `--aeris-pick-list-item-padding` | `CSS custom property` | — | Item content padding. |
| `--aeris-pick-list-filter-height` | `CSS custom property` | — | Filter field height. |

## Examples

### Basic transfer and reordering

Select one or more items, transfer them between controlled collections, or reorder either pane with the adjacent controls.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

interface Product {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly status: string;
}

@Component({
  selector: 'app-pick-list-basic-demo',
  imports: [AerisPickListModule],
  template: `
    <div class="pick-list-demo">
      <aeris-pick-list
        sourceHeader="Available products"
        targetHeader="Workspace"
        sourceAriaLabel="Available products"
        targetAriaLabel="Workspace products"
        [(source)]="basicSource"
        [(target)]="basicTarget"
        [(sourceSelectedKeys)]="basicSourceSelection"
        [(targetSelectedKeys)]="basicTargetSelection"
      />
    </div>
  `,
  styles: `
    .pick-list-demo {
      width: 100%;
    }
    
    .pick-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PickListBasicBasicTransferAndReorderingDemo {
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
  protected readonly basicTargetSelection = signal<readonly string[]>([]);
}
```

### Filtering

Each pane can filter across one or more item properties with independently controlled values and placeholders.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

@Component({
  selector: 'app-pick-list-filtering-demo',
  imports: [AerisPickListModule],
  template: `
    <div class="pick-list-demo">
      <aeris-pick-list
        showFilter
        filterBy="label,category,status"
        sourceFilterPlaceholder="Find available products"
        targetFilterPlaceholder="Find workspace products"
        [(source)]="filterSource"
        [(target)]="filterTarget"
      />
    </div>
  `,
  styles: `
    .pick-list-demo {
      width: 100%;
    }
    
    .pick-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PickListFilteringFilteringDemo {
}
```

### Drag and drop

Drag one selected item or an existing selection between panes. Drop within the same pane to reorder. Buttons and keyboard shortcuts provide equivalent behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

@Component({
  selector: 'app-pick-list-drag-drop-demo',
  imports: [AerisPickListModule],
  template: `
    <div class="pick-list-demo">
      <aeris-pick-list
        dragDrop
        transferOnDoubleClick
        sourceHeader="Backlog"
        targetHeader="Current workspace"
        [(source)]="dragSource"
        [(target)]="dragTarget"
      />
    </div>
  `,
  styles: `
    .pick-list-demo {
      width: 100%;
    }
    
    .pick-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PickListDragDropDragAndDropDemo {
}
```

### Item template

One typed template renders both panes and receives the current side, selected state, and original item.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

@Component({
  selector: 'app-pick-list-template-demo',
  imports: [AerisPickListModule],
  templateUrl: './pick-list-template.demo.html',
  styleUrl: './pick-list-template.demo.scss'
})
export class PickListTemplateItemTemplateDemo {
}
```

#### HTML

```html
<aeris-pick-list
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
</aeris-pick-list>
```

#### CSS

```css
.product-row {
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
}
```

### Target limit

Limit target capacity while keeping source transfer controls and drag-and-drop behavior synchronized.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

@Component({
  selector: 'app-pick-list-limit-demo',
  imports: [AerisPickListModule],
  template: `
    <div class="pick-list-demo">
      <aeris-pick-list
        [targetLimit]="4"
        sourceHeader="Inventory"
        targetHeader="Bundle (maximum 4)"
        [(source)]="limitedSource"
        [(target)]="limitedTarget"
      />
    </div>
  `,
  styles: `
    .pick-list-demo {
      width: 100%;
    }
    
    .pick-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PickListLimitTargetLimitDemo {
}
```

### Scrolling

Long collections scroll inside each pane while headers, filters, and controls remain visible.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

@Component({
  selector: 'app-pick-list-scrolling-demo',
  imports: [AerisPickListModule],
  template: `
    <div class="pick-list-demo">
      <aeris-pick-list
        class="compact-pick-list"
        showFilter
        sourceHeader="Full inventory"
        targetHeader="Selected inventory"
        [(source)]="manySource"
        [(target)]="manyTarget"
      />
    </div>
  `,
  styles: `
    .pick-list-demo {
      width: 100%;
    }
    
    .pick-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
    
    .compact-pick-list {
      --aeris-pick-list-max-height: 17rem;
    }
  `
})
export class PickListScrollingScrollingDemo {
  protected readonly manySource = signal<readonly Product[]>(
    Array.from({ length: 24 }, (_, index) => ({
      id: `product-${index + 1}`,
      label: `Workspace item ${index + 1}`,
      category: index % 2 === 0 ? 'Hardware' : 'Furniture',
      status: index % 4 === 0 ? 'Low stock' : 'Ready',
    })),
  );
  protected readonly manyTarget = signal<readonly Product[]>([]);
}
```

### States

Disabled and empty states preserve listbox naming and clear status messages.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

interface Product {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly status: string;
}

@Component({
  selector: 'app-pick-list-states-demo',
  imports: [AerisPickListModule],
  templateUrl: './pick-list-states.demo.html',
  styleUrl: './pick-list-states.demo.scss'
})
export class PickListStatesStatesDemo {
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
  protected readonly basicTargetSelection = signal<readonly string[]>([]);
}
```

#### HTML

```html
<div class="pick-list-states">
  <aeris-pick-list
    disabled
    sourceHeader="Disabled"
    targetHeader="Unavailable"
    [source]="basicSource()"
    [target]="basicTarget()"
  />
  <aeris-pick-list
    sourceHeader="Empty source"
    targetHeader="Empty target"
    [source]="[]"
    [target]="[]"
  />
</div>
```

#### CSS

```css
.pick-list-states {
  width: 100%;
  display: grid;
  gap: 1rem;
}
```

### Events

Typed outputs cover selection, filtering, transfer, reordering, and drag lifecycle changes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPickListModule } from '@aeris-ui/core/pick-list';

@Component({
  selector: 'app-pick-list-events-demo',
  imports: [AerisPickListModule],
  template: `
    <div class="pick-list-demo pick-list-demo--stack">
      <aeris-pick-list
        showFilter
        [(source)]="eventSource"
        [(target)]="eventTarget"
        (selectionChanged)="handleSelection($event)"
        (transferred)="handleTransfer($event)"
        (reordered)="handleReorder($event)"
        (filterChanged)="handleFilter($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .pick-list-demo {
      width: 100%;
    }
    
    .pick-list-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .pick-list-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class PickListEventsEventsDemo {
}
```

## Accessibility

- Each pane is a named multi-select listbox using active-descendant focus management.
- Transfer and reorder controls are native buttons with descriptive accessible names.
- Drag-and-drop is supplementary: every transfer and reorder action has a keyboard and button equivalent.
- Transfer and reorder results are announced through a polite live region.
- Disabled state removes listboxes from the tab order and disables filters, buttons, and dragging.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through filters, reorder buttons, listboxes, and transfer buttons. |
| `ArrowUp / ArrowDown` | Moves the active option within the focused listbox. |
| `Home / End` | Moves the active option to the first or last filtered item. |
| `Enter / Space` | Toggles selection of the active option. |
| `Ctrl / Cmd + A` | Selects all currently filtered options. |
| `Alt + ArrowRight` | Transfers selected source items to the target. |
| `Alt + ArrowLeft` | Transfers selected target items to the source. |
| `Alt + ArrowUp / ArrowDown` | Reorders selected items by one position. |
| `Alt + Home / End` | Moves selected items to the beginning or end of their pane. |
