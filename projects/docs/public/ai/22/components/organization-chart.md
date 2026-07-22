# OrganizationChart

> Hierarchical team chart with templates, selection, and collapsible branches.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/organization-chart`
- Human-readable documentation: [https://aeris-ui.dev/components/organization-chart](https://aeris-ui.dev/components/organization-chart)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `readonly AerisOrganizationChartNode&lt;TData&gt;[]` | `[]` | Root nodes rendered by the chart. |
| `selectionMode` | `'single' &#124; 'multiple' &#124; null` | `null` | Enables single or multiple node selection. |
| `collapsible` | `boolean` | `true` | Shows branch expand and collapse controls. |
| `fluid` | `boolean` | `true` | Makes the chart fill the available width while preserving horizontal scroll for wide trees. |
| `ariaLabel` | `string` | `'Organization chart'` | Accessible name for the tree. |
| `emptyMessage` | `string` | `'No organization chart data available'` | Message shown when value is empty. |
| `expandAriaLabel` | `string` | `'Expand node'` | Accessible label for collapsed branch controls. |
| `collapseAriaLabel` | `string` | `'Collapse node'` | Accessible label for expanded branch controls. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionKeys` | `readonly string[]` | `[]` | Selected node keys. |
| `collapsedKeys` | `readonly string[]` | `[]` | Collapsed branch keys. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionChanged` | `AerisOrganizationChartSelectionEvent&lt;TData&gt;` | `-` | Emitted whenever selection changes. |
| `nodeSelected` | `AerisOrganizationChartSelectionEvent&lt;TData&gt;` | `-` | Emitted when a node becomes selected. |
| `nodeUnselected` | `AerisOrganizationChartSelectionEvent&lt;TData&gt;` | `-` | Emitted when a selected node is cleared. |
| `nodeExpanded` | `AerisOrganizationChartNodeEvent&lt;TData&gt;` | `-` | Emitted when a branch expands. |
| `nodeCollapsed` | `AerisOrganizationChartNodeEvent&lt;TData&gt;` | `-` | Emitted when a branch collapses. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisOrganizationChartNode` | `{ $implicit, node, key, selected, expanded, leaf, level }` | `-` | Custom node content while Aeris keeps layout, selection, and collapse behavior. |
| `aerisOrganizationChartEmpty` | `none` | `-` | Custom empty state. |

## Interfaces and types

### Interfaces

```ts
type AerisOrganizationChartSelectionMode = 'single' | 'multiple';

interface AerisOrganizationChartNode<TData = unknown> {
  readonly key?: string;
  readonly label?: string;
  readonly type?: string;
  readonly data?: TData;
  readonly children?: readonly AerisOrganizationChartNode<TData>[];
  readonly selectable?: boolean;
}

interface AerisOrganizationChartNodeEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
}

interface AerisOrganizationChartSelectionEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly selectedKeys: readonly string[];
  readonly node: AerisOrganizationChartNode<TData>;
  readonly key: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-organization-chart-padding` | `CSS custom property` | — | Viewport padding. |
| `--aeris-organization-chart-level-gap` | `CSS custom property` | — | Vertical space between levels. |
| `--aeris-organization-chart-node-gap` | `CSS custom property` | — | Horizontal node gap. |
| `--aeris-organization-chart-node-min-width` | `CSS custom property` | — | Minimum node width. |
| `--aeris-organization-chart-connector` | `CSS custom property` | — | Connector line color. |

## Examples

### Basic

A chart renders one or more root nodes and recursively connects each child level.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrganizationChartModule, type AerisOrganizationChartNode } from '@aeris-ui/core/organization-chart';

interface Person {
  readonly name: string;
  readonly role: string;
  readonly team: string;
}

@Component({
  selector: 'app-organization-chart-basic-demo',
  imports: [AerisOrganizationChartModule],
  template: `
    <div class="chart-demo">
      <aeris-organization-chart ariaLabel="Company organization chart" [value]="chart" />
    </div>
  `,
  styles: `
    .chart-demo {
      width: 100%;
    }
    
    .chart-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrganizationChartBasicBasicDemo {
  protected readonly chart: readonly AerisOrganizationChartNode<Person>[] = [
    {
      key: 'ceo',
      label: 'Maya Chen',
      type: 'Chief Executive Officer',
      data: { name: 'Maya Chen', role: 'CEO', team: 'Leadership' },
      children: [
        { key: 'product', label: 'Noah Williams', type: 'Product' },
        { key: 'engineering', label: 'Sofia Rossi', type: 'Engineering' },
      ],
    },
  ];
}
```

### Selection

Single selection uses controlled selected keys and emits the selected node.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';

@Component({
  selector: 'app-organization-chart-selection-demo',
  imports: [AerisOrganizationChartModule],
  template: `
    <div class="chart-demo chart-demo--stack">
      <aeris-organization-chart
        ariaLabel="Selectable organization chart"
        selectionMode="single"
        [value]="chart"
        [(selectionKeys)]="selectedSingle"
        (selectionChanged)="handleSelection($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .chart-demo {
      width: 100%;
    }
    
    .chart-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .chart-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrganizationChartSelectionSelectionDemo {
}
```

### Multiple selection

Multiple selection keeps every selected node key in the selectionKeys model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';

@Component({
  selector: 'app-organization-chart-multiple-demo',
  imports: [AerisOrganizationChartModule],
  template: `
    <div class="chart-demo">
      <aeris-organization-chart
        ariaLabel="Multiple selection organization chart"
        selectionMode="multiple"
        [value]="chart"
        [(selectionKeys)]="selectedMultiple"
      />
    </div>
  `,
  styles: `
    .chart-demo {
      width: 100%;
    }
    
    .chart-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrganizationChartMultipleMultipleSelectionDemo {
}
```

### Collapsible

Collapsed branches are controlled with collapsedKeys so state can be saved or restored.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisOrganizationChartModule, type AerisOrganizationChartNodeEvent, type AerisOrganizationChartSelectionEvent } from '@aeris-ui/core/organization-chart';

@Component({
  selector: 'app-organization-chart-collapsible-demo',
  imports: [AerisOrganizationChartModule],
  template: `
    <div class="chart-demo chart-demo--stack">
      <aeris-organization-chart
        ariaLabel="Collapsible organization chart"
        [value]="chart"
        [(collapsedKeys)]="collapsed"
        (nodeCollapsed)="handleCollapse($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .chart-demo {
      width: 100%;
    }
    
    .chart-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .chart-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class OrganizationChartCollapsibleCollapsibleDemo {
  protected readonly selectedSingle = signal<readonly string[]>(['product']);
  protected readonly eventText = signal('No chart event yet.');

  protected handleSelection(event: AerisOrganizationChartSelectionEvent<Person>): void {
    this.eventText.set(`Selected ${event.node.label ?? event.key}.`);
  }

  protected handleCollapse(event: AerisOrganizationChartNodeEvent<Person>): void {
    this.eventText.set(`Collapsed ${event.node.label ?? event.key}.`);
  }
}
```

### Template

Custom node content can show richer people cards while Aeris keeps connectors, selection, and collapse behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';

@Component({
  selector: 'app-organization-chart-template-demo',
  imports: [AerisOrganizationChartModule],
  templateUrl: './organization-chart-template.demo.html',
  styleUrl: './organization-chart-template.demo.scss'
})
export class OrganizationChartTemplateTemplateDemo {
}
```

#### HTML

```html
<aeris-organization-chart
  class="people-chart"
  ariaLabel="Template organization chart"
  selectionMode="single"
  [value]="chart"
  [(selectionKeys)]="selectedSingle"
>
  <ng-template aerisOrganizationChartNode let-node let-selected="selected">
    <span class="person-card" [attr.data-tone]="node.data?.tone" [attr.data-selected]="selected || null">
      <span class="person-card__avatar">{{ initials(node.data?.name) }}</span>
      <span>
        <strong>{{ node.data?.name }}</strong>
        <small>{{ node.data?.role }}</small>
      </span>
    </span>
  </ng-template>
</aeris-organization-chart>
```

#### CSS

```css
.person-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.person-card__avatar {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary-text);
  font-size: 0.75rem;
  font-weight: 800;
}
```

### Scrolling

Wide charts keep their natural layout and scroll horizontally inside the component viewport.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisOrganizationChartModule } from '@aeris-ui/core/organization-chart';

@Component({
  selector: 'app-organization-chart-scrolling-demo',
  imports: [AerisOrganizationChartModule],
  template: `
    <div class="chart-demo">
      <aeris-organization-chart
        class="wide-chart"
        ariaLabel="Wide organization chart"
        [value]="wideChart"
      />
    </div>
  `,
  styles: `
    .chart-demo {
      width: 100%;
    }
    
    .chart-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
    
    .wide-chart {
      --aeris-organization-chart-node-min-width: 9rem;
      --aeris-organization-chart-node-gap: 0.5rem;
    }
  `
})
export class OrganizationChartScrollingScrollingDemo {
}
```

## Accessibility

- The chart uses tree and treeitem semantics with a configurable accessible name.
- Nodes expose selected state only when selection is enabled.
- Branch nodes expose expanded state and use native buttons for collapse controls.
- The viewport is horizontally scrollable for wide hierarchies without changing source order.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through chart nodes and branch controls. |
| `Enter / Space` | Selects or clears the focused node when selection is enabled. |
| `ArrowLeft` | Collapses an expanded branch node. |
| `ArrowRight` | Expands a collapsed branch node. |
| `Home` | Moves focus to the first rendered node. |
| `End` | Moves focus to the last rendered node. |
