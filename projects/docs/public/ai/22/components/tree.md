# Tree

> Hierarchical data navigation with controlled expansion, selection, filtering, lazy loading, and drag-drop reordering.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/tree`
- Human-readable documentation: [https://aeris-ui.dev/components/tree](https://aeris-ui.dev/components/tree)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTreeModule } from '@aeris-ui/core/tree';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionMode` | `'single' &#124; 'multiple' &#124; 'checkbox' &#124; null` | `null` | Enables controlled node selection. |
| `filter` | `boolean` | `false` | Shows the built-in label filter. |
| `propagateSelection` | `boolean` | `true` | Cascades checkbox selection through selectable descendants and derives mixed parent state. |
| `disabled` | `boolean` | `false` | Disables filtering and removes tree nodes from the tab order. |
| `fluid` | `boolean` | `true` | Fills the available container width. |
| `loading` | `boolean` | `false` | Replaces the tree with its loading state. |
| `loadingKeys` | `readonly string[]` | `[]` | Branch keys currently loading lazy children. |
| `dragDrop` | `boolean` | `false` | Enables pointer dragging and keyboard node reordering. |
| `ariaLabel` | `string` | `'Tree'` | Accessible name for the tree. |
| `filterPlaceholder` | `string` | `'Search tree'` | Visible filter placeholder. |
| `filterAriaLabel` | `string` | `'Search tree'` | Accessible name for the filter field. |
| `filterClearAriaLabel` | `string` | `'Clear search'` | Accessible name for the filter clear button. |
| `emptyMessage` | `string` | `'No tree nodes available'` | Status text when value is empty. |
| `emptyFilterMessage` | `string` | `'No matching nodes'` | Status text when filtering has no result. |
| `loadingMessage` | `string` | `'Loading tree'` | Status text used by the default loading state. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `readonly AerisTreeNode&lt;TData&gt;[]` | `[]` | Root nodes. Keys must be unique; drag-drop writes an immutable reordered tree. |
| `selectionKeys` | `readonly string[]` | `[]` | Selected node keys. |
| `expandedKeys` | `readonly string[]` | `[]` | Expanded branch keys. |
| `filterValue` | `string` | `''` | Current label filter value. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionChanged` | `AerisTreeSelectionEvent&lt;TData&gt;` | `-` | Emitted whenever user selection changes. |
| `nodeSelected` | `AerisTreeSelectionEvent&lt;TData&gt;` | `-` | Emitted when a node or propagated branch becomes selected. |
| `nodeUnselected` | `AerisTreeSelectionEvent&lt;TData&gt;` | `-` | Emitted when a node or propagated branch becomes unselected. |
| `nodeExpanded` | `AerisTreeNodeEvent&lt;TData&gt;` | `-` | Emitted when a user expands a branch, including an unloaded lazy branch. |
| `nodeCollapsed` | `AerisTreeNodeEvent&lt;TData&gt;` | `-` | Emitted when a user collapses a branch. |
| `filterChanged` | `AerisTreeFilterEvent` | `-` | Emitted when the user changes or clears the built-in filter. |
| `nodeDropped` | `AerisTreeDropEvent&lt;TData&gt;` | `-` | Emitted after a pointer or keyboard move updates value. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTreeNode` | `AerisTreeNodeContext&lt;TData&gt;` | `Node label` | Custom node content rendered inside Aeris tree semantics and interaction. |
| `aerisTreeEmpty` | `none` | `emptyMessage / emptyFilterMessage` | Custom empty and no-results content. |
| `aerisTreeLoading` | `none` | `Spinner and loadingMessage` | Custom whole-tree loading content. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(key?: string)` | `void` | `-` | Focuses the requested visible node or the current active node. |
| `expandAll()` | `void` | `-` | Adds every branch key to expandedKeys. |
| `collapseAll()` | `void` | `-` | Clears expandedKeys. |

## Interfaces and types

### Interfaces

```ts
type AerisTreeSelectionMode = 'single' | 'multiple' | 'checkbox';

interface AerisTreeNode<TData = unknown> {
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

interface AerisTreeNodeEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
}

interface AerisTreeSelectionEvent<TData = unknown> extends AerisTreeNodeEvent<TData> {
  readonly selected: boolean;
  readonly selectedKeys: readonly string[];
}

interface AerisTreeFilterEvent {
  readonly originalEvent: Event;
  readonly value: string;
}

type AerisTreeDropPosition = 'before' | 'inside' | 'after';

interface AerisTreeDropEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
  readonly target: AerisTreeNode<TData>;
  readonly targetKey: string;
  readonly position: AerisTreeDropPosition;
  readonly value: readonly AerisTreeNode<TData>[];
}

interface AerisTreeNodeContext<TData = unknown> {
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
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-tree-min-width` | `CSS custom property` | — | Minimum tree width before responsive override. |
| `--aeris-tree-max-height` | `CSS custom property` | — | Maximum scrollable node viewport height. |
| `--aeris-tree-padding` | `CSS custom property` | — | Outer tree padding. |
| `--aeris-tree-border` | `CSS custom property` | — | Outer border color. |
| `--aeris-tree-radius` | `CSS custom property` | — | Outer corner radius. |
| `--aeris-tree-background` | `CSS custom property` | — | Tree surface color. |
| `--aeris-tree-color` | `CSS custom property` | — | Default node text color. |
| `--aeris-tree-indent` | `CSS custom property` | — | Indent added for each hierarchy level. |
| `--aeris-tree-indent-mobile` | `CSS custom property` | — | Hierarchy indent on narrow screens. |
| `--aeris-tree-node-height` | `CSS custom property` | — | Minimum node row height. |
| `--aeris-tree-node-padding` | `CSS custom property` | — | Node row padding. |
| `--aeris-tree-node-radius` | `CSS custom property` | — | Node row corner radius. |
| `--aeris-tree-node-hover` | `CSS custom property` | — | Hover and active node surface. |
| `--aeris-tree-node-selected` | `CSS custom property` | — | Selected node surface. |
| `--aeris-tree-drop-indicator` | `CSS custom property` | — | Drop line and inside-target outline. |
| `--aeris-tree-drop-background` | `CSS custom property` | — | Inside-target background. |

## Examples

### Basic

Tree renders unique-keyed nodes with controlled expansion and native hierarchical semantics.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeNode } from '@aeris-ui/core/tree';

interface FileDetails {
  readonly type: 'folder' | 'typescript' | 'image' | 'document';
  readonly detail: string;
}

@Component({
  selector: 'app-tree-basic-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo">
      <aeris-tree
        ariaLabel="Project files"
        [value]="files"
        [(expandedKeys)]="basicExpanded"
      />
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeBasicBasicDemo {
  protected readonly files: readonly AerisTreeNode<FileDetails>[] = [
    {
      key: 'workspace',
      label: 'Aeris workspace',
      data: { type: 'folder', detail: 'Project root' },
      children: [
        {
          key: 'source',
          label: 'Source',
          data: { type: 'folder', detail: 'Application code' },
          children: [
            { key: 'button', label: 'button.ts', leaf: true, data: { type: 'typescript', detail: '4 KB' } },
            { key: 'tokens', label: 'tokens.scss', leaf: true, data: { type: 'document', detail: '8 KB' } },
          ],
        },
        { key: 'readme', label: 'README.md', leaf: true, data: { type: 'document', detail: '12 KB' } },
      ],
    },
  ];

  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
}
```

### Controlled expansion

Keep expansion in application state and replace the complete key set to expand or collapse every branch.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTreeModule } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-controlled-demo',
  imports: [AerisButton, AerisTreeModule],
  template: `
    <div class="tree-demo tree-demo--stack">
      <div class="tree-controls" aria-label="Tree expansion controls">
        <button aerisButton type="button" (click)="expandControlled()">Expand all</button>
        <button aerisButton type="button" (click)="collapseControlled()">
          Collapse all
        </button>
      </div>
      <aeris-tree
        ariaLabel="Controlled project files"
        [value]="files"
        [(expandedKeys)]="controlledExpanded"
      />
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
    
    .tree-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
    }
  `
})
export class TreeControlledControlledExpansionDemo {
  protected readonly files = this.createFiles();
  protected readonly controlledExpanded = signal<readonly string[]>(['workspace']);

  protected expandControlled(): void {
    this.controlledExpanded.set(['workspace', 'source', 'assets']);
  }

  protected collapseControlled(): void {
    this.controlledExpanded.set([]);
  }
}
```

### Single selection

Single selection keeps one selected key and emits a typed event for selection and clearing.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { type AerisTreeSelectionEvent } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-single-selection-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo tree-demo--stack">
      <aeris-tree
        ariaLabel="Single-select project files"
        selectionMode="single"
        [value]="files"
        [expandedKeys]="basicExpanded()"
        [(selectionKeys)]="singleSelection"
        (selectionChanged)="handleSelection($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeSingleSelectionSingleSelectionDemo {
  protected readonly files = this.createFiles();
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
  protected readonly singleSelection = signal<readonly string[]>(['button']);
  protected readonly eventText = signal('No tree event yet.');

  protected handleSelection(event: AerisTreeSelectionEvent<FileDetails>): void {
    this.eventText.set(
      event.selected
        ? `Selected ${event.node.label}.`
        : `Cleared ${event.node.label}.`,
    );
  }
}
```

### Multiple selection

Multiple selection toggles independent nodes without changing branch expansion.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-multiple-selection-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo">
      <aeris-tree
        ariaLabel="Multiple-select project files"
        selectionMode="multiple"
        [value]="files"
        [expandedKeys]="basicExpanded()"
        [(selectionKeys)]="multipleSelection"
      />
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeMultipleSelectionMultipleSelectionDemo {
  protected readonly files = this.createFiles();
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
  protected readonly multipleSelection = signal<readonly string[]>(['button', 'tokens']);
}
```

### Checkbox selection

Checkbox mode cascades through selectable descendants and exposes mixed parent state when only part of a branch is selected.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-checkbox-selection-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo">
      <aeris-tree
        ariaLabel="Checkbox project files"
        selectionMode="checkbox"
        [value]="files"
        [expandedKeys]="['workspace', 'assets']"
        [(selectionKeys)]="checkboxSelection"
      />
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeCheckboxSelectionCheckboxSelectionDemo {
  protected readonly files = this.createFiles();
  protected readonly checkboxSelection = signal<readonly string[]>(['assets', 'logo', 'cover']);
}
```

### Filtering

The controlled filter finds node labels and preserves the ancestor path to every result.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeFilterEvent } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-filtering-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo tree-demo--stack">
      <aeris-tree
        filter
        ariaLabel="Filterable project files"
        filterPlaceholder="Find a file"
        [value]="files"
        [(expandedKeys)]="filterExpanded"
        [(filterValue)]="filterQuery"
        (filterChanged)="handleFilter($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeFilteringFilteringDemo {
  protected readonly files = this.createFiles();
  protected readonly filterExpanded = signal<readonly string[]>(['workspace']);
  protected readonly filterQuery = signal('');

  protected handleFilter(event: AerisTreeFilterEvent): void {
    this.eventText.set(event.value ? `Filtering by “${event.value}”.` : 'Filter cleared.');
  }
}
```

### Lazy loading

Mark an unloaded branch with leaf: false, respond to nodeExpanded, and identify loading branches until children arrive.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeNode, type AerisTreeNodeEvent } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-lazy-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo">
      <aeris-tree
        ariaLabel="Remote project files"
        [value]="lazyNodes()"
        [loadingKeys]="lazyLoadingKeys()"
        [(expandedKeys)]="lazyExpanded"
        (nodeExpanded)="handleLazyExpand($event)"
      />
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeLazyLazyLoadingDemo {
  protected readonly lazyNodes = signal<readonly AerisTreeNode<FileDetails>[]>([
    {
      key: 'remote',
      label: 'Remote workspace',
      leaf: false,
      data: { type: 'folder', detail: 'Load on expansion' },
    },
  ]);
  protected readonly lazyLoadingKeys = signal<readonly string[]>([]);
  protected readonly lazyExpanded = signal<readonly string[]>([]);

  protected handleLazyExpand(event: AerisTreeNodeEvent<FileDetails>): void {
    if (event.node.children || event.node.leaf !== false) return;
    this.lazyLoadingKeys.set([event.key]);
    loadRemoteNodes(event.key).then((children) => {
      this.lazyNodes.update((nodes) => nodes.map((node) =>
        node.key === event.key ? { ...node, children } : node,
      ));
      this.lazyLoadingKeys.set([]);
    });
  }
}
```

### Drag and drop

Reorder nodes before, inside, or after another node. The value model receives an immutable tree and keyboard commands provide equivalent moves.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeDropEvent, type AerisTreeNode } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-drag-drop-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo tree-demo--stack">
      <aeris-tree
        dragDrop
        ariaLabel="Reorder project files"
        [(value)]="dragFiles"
        [(expandedKeys)]="dragExpanded"
        (nodeDropped)="handleDrop($event)"
      />
      <small aria-live="polite">{{ dragEventText() }}</small>
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeDragDropDragAndDropDemo {
  protected readonly dragFiles = signal<readonly AerisTreeNode<FileDetails>[]>(
    this.createFiles(),
  );
  protected readonly dragExpanded = signal<readonly string[]>([
    'workspace',
    'source',
    'assets',
  ]);
  protected readonly dragEventText = signal('Drag a node or use Alt plus an arrow key.');

  protected handleDrop(event: AerisTreeDropEvent<FileDetails>): void {
    this.dragEventText.set(
      `Moved ${event.node.label} ${event.position} ${event.target.label}.`,
    );
  }
}
```

### Node template

This documentation example supplies Lucide icons through node data. Any icon component or SVG can be used without adding an icon dependency to Aeris.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { LucideDynamicIcon, LucideFileText, LucideFolder, LucideImage, type LucideIconInput } from '@lucide/angular';

interface FileDetails {
  readonly type: 'folder' | 'typescript' | 'image' | 'document';
  readonly detail: string;
  readonly icon: LucideIconInput;
}

@Component({
  selector: 'app-tree-template-demo',
  imports: [AerisTreeModule, LucideDynamicIcon],
  templateUrl: './tree-template.demo.html',
  styleUrl: './tree-template.demo.scss'
})
export class TreeTemplateNodeTemplateDemo {
  protected readonly files = this.createFiles();
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
}
```

#### HTML

```html
<aeris-tree
  ariaLabel="Project files with details"
  [value]="files"
  [(expandedKeys)]="basicExpanded"
>
  <ng-template aerisTreeNode let-node let-leaf="leaf">
    <span class="file-node">
      <svg [lucideIcon]="$any(node).data.icon"></svg>
      <span>
        <strong>{{ $any(node).label }}</strong>
        <small>{{ $any(node).data.detail }}</small>
      </span>
      @if (leaf) { <span class="file-node__type">{{ $any(node).data.type }}</span> }
    </span>
  </ng-template>
</aeris-tree>
```

#### CSS

```css
.file-node {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.file-node > svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: var(--primary-text);
}

.file-node strong,
.file-node small {
  display: block;
}

.file-node small {
  color: var(--text-3);
  font-size: 0.6875rem;
}

.file-node__type {
  margin-left: auto;
  color: var(--text-3);
  font-size: 0.6875rem;
}
```

### States

Loading, empty, and disabled states remain named and expose status text where content is unavailable.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';

@Component({
  selector: 'app-tree-states-demo',
  imports: [AerisTreeModule],
  templateUrl: './tree-states.demo.html',
  styleUrl: './tree-states.demo.scss'
})
export class TreeStatesStatesDemo {
}
```

#### HTML

```html
<div class="tree-state-grid">
  <section>
    <h3>Loading</h3>
    <aeris-tree loading ariaLabel="Loading files" [value]="files" />
  </section>
  <section>
    <h3>Empty</h3>
    <aeris-tree ariaLabel="Empty files" [value]="[]" />
  </section>
  <section>
    <h3>Disabled</h3>
    <aeris-tree
      disabled
      ariaLabel="Disabled files"
      [value]="files"
      [expandedKeys]="['workspace']"
    />
  </section>
</div>
```

#### CSS

```css
.tree-state-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.tree-state-grid section {
  min-width: 0;
}

.tree-state-grid h3 {
  margin: 0 0 0.625rem;
  font-size: 0.8125rem;
}

@media (max-width: 64rem) {
  .tree-state-grid {
      grid-template-columns: 1fr;
    }
}
```

### Events

Typed outputs report selection, expansion, collapse, filtering, and drops while models remain the source of truth.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeFilterEvent, type AerisTreeNodeEvent } from '@aeris-ui/core/tree';
import { type AerisTreeSelectionEvent } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-events-demo',
  imports: [AerisTreeModule],
  template: `
    <div class="tree-demo tree-demo--stack">
      <aeris-tree
        filter
        ariaLabel="Interactive event tree"
        selectionMode="single"
        [value]="files"
        [(expandedKeys)]="basicExpanded"
        [(selectionKeys)]="singleSelection"
        (selectionChanged)="handleSelection($event)"
        (nodeExpanded)="handleExpand($event)"
        (filterChanged)="handleFilter($event)"
      />
      <small aria-live="polite">{{ eventText() }}</small>
    </div>
  `,
  styles: `
    .tree-demo {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
    }
    
    .tree-demo--stack {
      display: grid;
      gap: 0.75rem;
    }
    
    .tree-demo small {
      color: var(--aeris-text-2);
      font-weight: 600;
    }
  `
})
export class TreeEventsEventsDemo {
  protected readonly files = this.createFiles();
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
  protected readonly singleSelection = signal<readonly string[]>(['button']);
  protected readonly eventText = signal('No tree event yet.');

  protected handleSelection(event: AerisTreeSelectionEvent<FileDetails>): void {
    this.eventText.set(event.selected ? `Selected ${event.node.label}.` : `Cleared ${event.node.label}.`);
  }

  protected handleExpand(event: AerisTreeNodeEvent<FileDetails>): void {
    this.eventText.set(`Expanded ${event.node.label}.`);
  }

  protected handleFilter(event: AerisTreeFilterEvent): void {
    this.eventText.set(event.value ? `Filtering by “${event.value}”.` : 'Filter cleared.');
  }
}
```

## Accessibility

- The component uses tree and treeitem semantics with level, position, set size, expanded, selected, checked, disabled, and busy states where applicable.
- Roving focus keeps one visible node in the tab order. Collapsing a branch removes hidden descendants from both the DOM and keyboard sequence.
- Checkbox parents expose aria-checked="mixed" when only part of their selectable subtree is selected.
- The filter is a named native search field. Empty, no-results, and loading content use polite status semantics.
- Lazy branches remain expandable before children exist; loadingKeys exposes per-node busy state while data loads.
- Custom node templates remain inside Aeris-managed tree items. Avoid adding nested interactive controls because the tree item owns focus and keyboard behavior.
- Drag-drop updates the controlled value model immutably. Pointer results and keyboard moves are announced through a polite live region.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the optional filter and then the active tree item; a second Tab leaves the tree. |
| `ArrowDown / ArrowUp` | Moves focus to the next or previous visible node. ArrowDown from the filter enters the tree. |
| `ArrowRight` | Expands a collapsed branch, then moves to its first child when already expanded. |
| `ArrowLeft` | Collapses an expanded branch, otherwise moves to its parent. |
| `Home / End` | Moves focus to the first or last visible node. |
| `Enter / Space` | Toggles selection when enabled; otherwise toggles the focused branch. |
| `Printable characters` | Moves focus to the next visible node whose label starts with the typed characters. |
| `Alt + ArrowUp / ArrowDown` | Moves the focused node before or after an adjacent sibling. |
| `Alt + ArrowRight` | Moves the focused node into its previous sibling when that node accepts children. |
| `Alt + ArrowLeft` | Moves the focused node out of its current parent. |
