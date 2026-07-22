# TreeSelect

> Hierarchical selection with filtering, templates, checkbox mode, and forms integration.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/tree-select`
- Human-readable documentation: [https://aeris-ui.dev/components/tree-select](https://aeris-ui.dev/components/tree-select)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTreeSelect, type AerisTreeNode } from '@aeris-ui/core/tree-select';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` | `readonly AerisTreeNode[]` | `required` | Tree data rendered recursively in source order. Nesting depth is not limited by the component API. |
| `value` | `AerisTreeSelectValue (model)` | `null` | Selected value for single mode or selected value array for multiple and checkbox modes. |
| `selectionMode` | `AerisTreeSelectMode` | `'single'` | Selection behavior: single, multiple, or checkbox with optional descendant propagation. |
| `inputId` | `string` | `generated` | ID assigned to the combobox trigger for visible labels. |
| `name` | `string` | `''` | Creates a hidden native form value when a selection exists. |
| `valueSeparator` | `string` | `','` | Separator used for hidden native form values in multi-value modes. |
| `placeholder` | `string` | `'Select item'` | Text displayed when no node is selected. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label is associated. |
| `ariaLabelledby` | `string` | `''` | IDs of elements that label the combobox. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |
| `treeAriaLabel` | `string` | `'Tree options'` | Accessible name for the popup tree. |
| `size` | `AerisTreeSelectSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisTreeSelectAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `disabled` | `boolean` | `false` | Disables opening, selection, clearing, and forms interaction. |
| `required` | `boolean` | `false` | Exposes aria-required for validation. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |
| `clearable` | `boolean` | `false` | Shows a suffix clear button when a selection exists. |
| `filter` | `boolean` | `false` | Adds a search field to the panel. |
| `filterValue` | `string (model)` | `''` | Controlled filter query with two-way binding. |
| `filterPlaceholder` | `string` | `'Search tree'` | Visible filter placeholder. |
| `filterAriaLabel` | `string` | `'Search tree'` | Accessible name for the filter field. |
| `filterClearAriaLabel` | `string` | `'Clear search'` | Accessible name for the filter clear button. |
| `resetFilterOnClose` | `boolean` | `true` | Resets the filter whenever the panel closes. |
| `autofocusFilter` | `boolean` | `true` | Moves focus to the filter when the panel opens. |
| `emptyMessage` | `string` | `'No items available'` | Message displayed when the tree is empty. |
| `emptyFilterMessage` | `string` | `'No matching items'` | Message displayed when filtering has no matches. |
| `panelMaxHeight` | `string` | `'18rem'` | Maximum scrollable tree height as a CSS length. |
| `propagateSelection` | `boolean` | `true` | Checkbox mode selects or clears enabled descendants with the parent node. |
| `expandOnFilter` | `boolean` | `true` | Shows matching descendants while a filter query is active. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `AerisTreeSelectValue` | `-` | Emitted automatically by the value model. |
| `valueInput` | `AerisTreeSelectValue` | `-` | Explicit value-change notification. |
| `changed` | `AerisTreeSelectChangeEvent` | `-` | Selection change with node metadata. |
| `filterChanged` | `AerisTreeSelectFilterEvent` | `-` | Filter query changes. |
| `opened / closed / cleared` | `void` | `-` | Panel and clear lifecycle events. |
| `nodeExpanded / nodeCollapsed` | `AerisTreeNode` | `-` | Expansion lifecycle events. |
| `focused / blurred` | `FocusEvent` | `-` | Combobox focus lifecycle events. |
| `touch` | `void` | `-` | Touched-state integration on blur. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTreeSelectNode` | `node, level, selected, expanded, active` | `-` | Custom node content, including optional consumer-provided icons. |
| `aerisTreeSelectValue` | `nodes, value` | `-` | Custom selected-value display. |
| `aerisTreeSelectHeader` | `none` | `-` | Custom panel header. |
| `aerisTreeSelectFooter` | `none` | `-` | Custom panel footer. |
| `aerisTreeSelectEmpty` | `none` | `-` | Custom empty-state content. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the combobox trigger. |
| `openPanel() / closePanel()` | `void` | `-` | Controls panel visibility. |
| `toggle()` | `void` | `-` | Toggles panel visibility. |
| `clear() / reset()` | `void` | `-` | Clears selection, with reset also clearing filter and panel state. |
| `expandAll() / collapseAll()` | `void` | `-` | Expands or collapses every parent node at any depth. |

## Interfaces and types

### Interfaces

```ts
type AerisTreeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisTreeSelectAppearance = 'outline' | 'filled';
type AerisTreeSelectMode = 'single' | 'multiple' | 'checkbox';
type AerisTreeSelectValue = string | readonly string[] | null;

interface AerisTreeNode {
  readonly label: string;
  readonly value: string;
  readonly children?: readonly AerisTreeNode[];
  readonly disabled?: boolean;
  readonly selectable?: boolean;
  readonly expanded?: boolean;
}

interface AerisTreeSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisTreeSelectValue;
  readonly node: AerisTreeNode | null;
  readonly selected: boolean;
}

interface AerisTreeSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-tree-select-background` | `CSS custom property` | — | Control and filter background. |
| `--aeris-tree-select-panel-background` | `CSS custom property` | — | Popup panel surface. |
| `--aeris-tree-select-panel-max-height` | `CSS custom property` | — | Scrollable tree height. |
| `--aeris-tree-select-node-hover` | `CSS custom property` | — | Active node background. |
| `--aeris-tree-select-focus` | `CSS custom property` | — | Focus border and ring color. |

## Examples

### Basic

Bind a single node value. Expandable parent categories can be selected the same way as leaf nodes.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeNode } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-basic-demo',
  imports: [AerisTreeModule, AerisTreeSelect],
  template: `
    <div class="field">
      <label for="tree-basic">Workspace</label>
      <aeris-tree-select
        inputId="tree-basic"
        [nodes]="nodes"
        [(value)]="workspace"
        clearable
        fluid
        (changed)="recordChange($event)"
      />
      <small aria-live="polite"
        >{{ lastChange() }}. Value: {{ workspace() || 'None' }}</small
      >
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class TreeSelectBasicBasicDemo {
  protected readonly workspace =
    signal<string | null>('product');

  protected readonly nodes: readonly AerisTreeNode[] = [
    {
      label: 'Product',
      value: 'product',
      expanded: true,
      children: [
        { label: 'Roadmap', value: 'roadmap' },
        { label: 'Research', value: 'research' },
      ],
    },
    {
      label: 'Workspaces',
      value: 'workspaces',
      children: [
        {
          label: 'Design system',
          value: 'workspace-design',
          children: [
            { label: 'Tokens', value: 'workspace-design-tokens' },
          ],
        },
      ],
    },
  ];
}
```

### Checkbox selection

Checkbox mode stores an array of values. Parent selection can cascade to enabled descendants.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-checkbox-demo',
  imports: [AerisTreeModule, AerisTreeSelect],
  template: `
    <div class="field">
      <label for="tree-checkbox">Project areas</label>
      <aeris-tree-select
        inputId="tree-checkbox"
        [nodes]="nodes"
        selectionMode="checkbox"
        [(value)]="checkboxValues"
        clearable
        fluid
      />
      <small>Values: {{ checkboxValues().join(', ') || 'None' }}</small>
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class TreeSelectCheckboxCheckboxSelectionDemo {
  protected readonly checkboxValues =
    signal<readonly string[]>(['docs', 'roadmap']);
}
```

### Filtering

Filtering keeps matching branches visible and can focus the search field when the panel opens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-filter-demo',
  imports: [AerisTreeModule, AerisTreeSelect],
  template: `
    <div class="field">
      <label for="tree-filter">Searchable workspace</label>
      <aeris-tree-select
        inputId="tree-filter"
        [nodes]="nodes"
        [(value)]="filteredValue"
        filter
        filterPlaceholder="Search workspaces"
        clearable
        fluid
      />
    </div>
  `,
  styles: `
    .field {
      min-width: 0;
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.45rem;
    }
    
    .field > label,
    .field > span:first-child {
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.4;
    }
    
    .field small {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    .field small.error {
      color: var(--aeris-danger);
    }
  `
})
export class TreeSelectFilterFilteringDemo {
}
```

### Templates

Customize node rows and selected value display without replacing selection or keyboard behavior.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTreeModule, type AerisTreeNode } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-templates-demo',
  imports: [AerisTreeModule, AerisTreeSelect],
  templateUrl: './tree-select-templates.demo.html',
  styleUrl: './tree-select-templates.demo.scss'
})
export class TreeSelectTemplatesTemplatesDemo {
  protected readonly workspace =
    signal<string | null>('product');

  protected readonly nodes: readonly AerisTreeNode[] = [
    {
      label: 'Product',
      value: 'product',
      expanded: true,
      children: [
        { label: 'Roadmap', value: 'roadmap' },
        { label: 'Research', value: 'research' },
      ],
    },
    {
      label: 'Workspaces',
      value: 'workspaces',
      children: [
        {
          label: 'Design system',
          value: 'workspace-design',
          children: [
            { label: 'Tokens', value: 'workspace-design-tokens' },
          ],
        },
      ],
    },
  ];
}
```

#### HTML

```html
<div class="field">
  <label for="tree-template">Templated tree</label>
  <aeris-tree-select
    inputId="tree-template"
    [nodes]="nodes"
    [(value)]="templateValue"
    fluid
  >
    <ng-template aerisTreeSelectNode let-node let-level="level">
      <span class="tree-node-template">
        <span class="tree-node-dot" aria-hidden="true"></span>
        <span>{{ node.label }}</span>
        <small>Level {{ level + 1 }}</small>
      </span>
    </ng-template>
    <ng-template aerisTreeSelectValue let-nodes>
      <span class="tree-value-template">
        <span class="tree-node-dot" aria-hidden="true"></span>
        {{ nodes[0]?.label }}
      </span>
    </ng-template>
    <ng-template aerisTreeSelectHeader
      ><strong>Choose destination</strong></ng-template
    >
    <ng-template aerisTreeSelectFooter
      ><small>Disabled nodes remain visible but unavailable.</small></ng-template
    >
  </aeris-tree-select>
</div>
```

#### CSS

```css
.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

.tree-node-template,
.tree-value-template {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tree-node-template {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tree-node-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 999px;
  background: var(--primary);
}
```

### Sizes

Four sizes match the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-sizes-demo',
  imports: [AerisTreeModule, AerisTreeSelect],
  templateUrl: './tree-select-sizes.demo.html',
  styleUrl: './tree-select-sizes.demo.scss'
})
export class TreeSelectSizesSizesDemo {
}
```

#### HTML

```html
<div class="tree-size-grid">
  <label
    ><span>Extra small</span
    ><aeris-tree-select
      ariaLabel="Extra small tree select"
      [nodes]="nodes"
      [value]="'workspace-design'"
      size="xs"
  /></label>
  <label
    ><span>Small</span
    ><aeris-tree-select
      ariaLabel="Small tree select"
      [nodes]="nodes"
      [value]="'workspace-design'"
      size="sm"
  /></label>
  <label
    ><span>Medium</span
    ><aeris-tree-select
      ariaLabel="Medium tree select"
      [nodes]="nodes"
      [value]="'workspace-design'"
  /></label>
  <label
    ><span>Large</span
    ><aeris-tree-select
      ariaLabel="Large tree select"
      [nodes]="nodes"
      [value]="'workspace-design'"
      size="lg"
  /></label>
</div>
```

#### CSS

```css
.tree-size-grid,
.tree-state-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.tree-size-grid label,
.tree-state-grid .field {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 0.5rem;
}

.tree-size-grid label > span,
.tree-state-grid .field > span,
.tree-state-grid .field > label {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}

@media (max-width: 42rem) {
  .tree-size-grid,
    .tree-state-grid {
      grid-template-columns: 1fr;
    }
}
```

### Appearances and states

Outlined, filled, required, invalid, and disabled states preserve layout and ARIA state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-states-demo',
  imports: [AerisTreeModule, AerisTreeSelect],
  templateUrl: './tree-select-states.demo.html',
  styleUrl: './tree-select-states.demo.scss'
})
export class TreeSelectStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="tree-state-grid">
  <div class="field">
    <span>Filled</span
    ><aeris-tree-select
      ariaLabel="Filled tree select"
      [nodes]="nodes"
      [value]="'workspace-design'"
      appearance="filled"
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <label for="tree-invalid">Required</label
    ><aeris-tree-select
      inputId="tree-invalid"
      [nodes]="nodes"
      [(value)]="invalidValue"
      required
      [invalid]="invalidValue() === null"
      ariaDescribedby="tree-error"
      fluid
    />
    @if (invalidValue() === null) {
      <small id="tree-error" class="error state-message">Choose an item.</small>
    } @else {
      <small class="state-message" aria-hidden="true">&nbsp;</small>
    }
  </div>
  <div class="field">
    <span>Disabled</span
    ><aeris-tree-select
      ariaLabel="Disabled tree select"
      [nodes]="nodes"
      [value]="'workspace-design'"
      disabled
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <span>Empty</span
    ><aeris-tree-select
      ariaLabel="Empty tree select"
      [nodes]="[]"
      emptyMessage="No destinations yet"
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
</div>
```

#### CSS

```css
.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

.field small.error {
  color: var(--aeris-danger);
}

.tree-size-grid,
.tree-state-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.tree-size-grid label,
.tree-state-grid .field {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 0.5rem;
}

.tree-size-grid label > span,
.tree-state-grid .field > span,
.tree-state-grid .field > label {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}

.tree-state-grid .state-message {
  min-height: 1.125rem;
}

@media (max-width: 42rem) {
  .tree-size-grid,
    .tree-state-grid {
      grid-template-columns: 1fr;
    }
}
```

### Reactive and template-driven forms

TreeSelect implements ControlValueAccessor while retaining its signal model API.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisTreeModule } from '@aeris-ui/core/tree';
import { AerisTreeSelect } from '@aeris-ui/core/tree-select';

@Component({
  selector: 'app-tree-select-forms-demo',
  imports: [AerisTreeModule, AerisTreeSelect, FormsModule, ReactiveFormsModule],
  templateUrl: './tree-select-forms.demo.html',
  styleUrl: './tree-select-forms.demo.scss'
})
export class TreeSelectFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveValue =
    new FormControl<string | null>('workspace-design');

  protected templateDrivenValue: readonly string[] = ['docs'];
}
```

#### HTML

```html
<div class="tree-state-grid">
  <div class="field">
    <label for="tree-reactive">Reactive Forms</label>
    <aeris-tree-select
      inputId="tree-reactive"
      [nodes]="nodes"
      [formControl]="reactiveValue"
      fluid
    />
    <small>Value: {{ reactiveValue.value || 'None' }}</small>
  </div>
  <div class="field">
    <label for="tree-template-form">Template-driven forms</label>
    <aeris-tree-select
      inputId="tree-template-form"
      name="treeTemplate"
      [nodes]="nodes"
      selectionMode="checkbox"
      [(ngModel)]="templateDrivenValue"
      fluid
    />
    <small>Values: {{ templateDrivenValue.join(', ') || 'None' }}</small>
  </div>
</div>
```

#### CSS

```css
.field {
  min-width: 0;
  display: grid;
  align-content: start;
  grid-auto-rows: max-content;
  gap: 0.45rem;
}

.field > label,
.field > span:first-child {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.field small {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field small.error {
  color: var(--aeris-danger);
}

.tree-size-grid,
.tree-state-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.tree-size-grid label,
.tree-state-grid .field {
  min-width: 0;
  display: grid;
  align-content: start;
  gap: 0.5rem;
}

.tree-size-grid label > span,
.tree-state-grid .field > span,
.tree-state-grid .field > label {
  color: var(--aeris-text);
  font-size: 0.875rem;
  font-weight: 650;
}

.tree-state-grid .state-message {
  min-height: 1.125rem;
}

@media (max-width: 42rem) {
  .tree-size-grid,
    .tree-state-grid {
      grid-template-columns: 1fr;
    }
}
```

## Accessibility

- The trigger uses combobox semantics and controls a popup role="tree".
- Tree rows use role="treeitem", aria-level, and aria-expanded for parent nodes.
- Single and multiple modes expose aria-selected; checkbox mode exposes aria-checked, including mixed parent state.
- Use inputId with a visible label, or provide ariaLabel when no visible label exists.
- Connect help and validation text with ariaDescribedby. Required, invalid, disabled, and form disabled states are synchronized with ARIA and native form behavior.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Open the panel or select the active node. |
| `Arrow Down / Arrow Up` | Open the panel or move between visible enabled nodes. |
| `Arrow Right` | Expand the active parent node. |
| `Arrow Left` | Collapse the active parent node. |
| `Home / End` | Move to the first or last visible enabled node. |
| `Escape` | Close the panel and return focus to the trigger. |
| `Tab` | Close the panel and continue normal document navigation. |
