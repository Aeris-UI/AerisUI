# Select

> Keyboard-first selection control with searchable, grouped, and templated options.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/select`
- Human-readable documentation: [https://aeris-ui.dev/components/select](https://aeris-ui.dev/components/select)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `readonly AerisSelectOption[]` | `required` | Available options in display order. |
| `value` | `string &#124; null (model)` | `null` | Selected option value with two-way binding and Forms support. |
| `inputId` | `string` | `generated` | ID assigned to the combobox trigger for visible labels. |
| `name` | `string` | `''` | Creates a hidden native form value when a selection exists. |
| `placeholder` | `string` | `'Select an option'` | Text displayed without a selection. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label is associated. |
| `ariaLabelledby` | `string` | `''` | IDs of elements that label the combobox. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |
| `listboxAriaLabel` | `string` | `'Options'` | Accessible name for the options list. |
| `size` | `AerisSelectSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisSelectAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `disabled` | `boolean` | `false` | Disables opening, selection, clearing, and Forms interaction. |
| `required` | `boolean` | `false` | Exposes aria-required for validation. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |
| `checkmark` | `boolean` | `true` | Shows a selection mark beside the selected option. |
| `editable` | `boolean` | `false` | Allows free-form values in addition to listed options. |
| `filter` | `boolean` | `false` | Adds an accessible search field to the options panel. |
| `filterValue` | `string (model)` | `''` | Controlled filter query with two-way binding. |
| `filterMatchMode` | `AerisSelectFilterMatchMode` | `'contains'` | Matching strategy for local filtering. |
| `filterFields` | `readonly ('label' &#124; 'description' &#124; 'group')[]` | `['label']` | Option fields included in local filtering. |
| `filterLocale` | `string &#124; undefined` | `undefined` | Locale used for case normalization. |
| `filterPlaceholder` | `string` | `'Search options'` | Visible filter placeholder. |
| `filterAriaLabel` | `string` | `'Search options'` | Accessible name for the filter field. |
| `showFilterClear` | `boolean` | `false` | Shows a button that clears the current filter query. |
| `filterClearAriaLabel` | `string` | `'Clear search'` | Accessible name for filter clearing. |
| `resetFilterOnClose` | `boolean` | `true` | Resets the filter whenever the panel closes. |
| `autofocusFilter` | `boolean` | `true` | Moves focus to the filter when the panel opens. |
| `emptyMessage` | `string` | `'No options available'` | Message displayed when options is empty. |
| `emptyFilterMessage` | `string` | `'No matching options'` | Message displayed when filtering has no matches. |
| `clearable` | `boolean` | `false` | Shows a suffix button when a selection can be cleared. |
| `clearButtonAriaLabel` | `string` | `'Clear selection'` | Accessible name for the clear button. |
| `loading` | `boolean` | `false` | Shows busy state and prevents option rendering. |
| `loadingMessage` | `string` | `'Loading options'` | Live status text during loading. |
| `panelMaxHeight` | `string` | `'18rem'` | Maximum scrollable list height as a CSS length. |
| `panelClass` | `string` | `''` | Additional class applied to the options panel. |
| `focusOnHover` | `boolean` | `true` | Updates the active option when the pointer moves over it. |
| `selectOnFocus` | `boolean` | `false` | Updates value whenever active option focus changes. |
| `autoOptionFocus` | `boolean` | `true` | Activates the selected or first enabled option on open. |
| `autoDisplayFirst` | `boolean` | `false` | Selects the first enabled option when opening an empty Select. |
| `virtualScroll` | `boolean` | `false` | Renders only the visible range for large flat option sets. |
| `virtualItemSize` | `number` | `40` | Fixed option height in pixels used by virtualization. |
| `virtualBuffer` | `number` | `4` | Extra options rendered above and below the viewport. |
| `lazy` | `boolean` | `false` | Emits lazyLoad ranges while a virtualized list scrolls. |

### Select outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange | string &#124; null | Emitted automatically by the value model. |
| valueInput | string &#124; null | Emitted when selection, clear, or public methods change the value. |
| changed | AerisSelectChangeEvent | Native event, selected value, and option metadata. |
| filterChanged | AerisSelectFilterEvent | Emitted whenever the filter query changes. |
| lazyLoad | AerisSelectLazyLoadEvent | Requested virtual viewport range and active query. |
| opened / closed | void | Emitted when the options panel changes visibility. |
| cleared | void | Emitted after the clear action succeeds. |
| focused / blurred | FocusEvent | Combobox focus lifecycle events. |
| touch | void | Emitted when focus leaves the component. |

### Select templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisSelectOption | option, selected, active | Custom content for each listbox option. |
| aerisSelectSelected | option | Custom content for the selected trigger value. |
| aerisSelectGroup | group | Custom group heading content. |
| aerisSelectHeader / aerisSelectFooter | none | Custom content around the listbox. |
| aerisSelectEmpty / aerisSelectEmptyFilter | none | Custom empty-state content. |
| aerisSelectDropdownIcon / aerisSelectClearIcon | none | Custom trigger action icons. |
| aerisSelectFilterIcon / aerisSelectLoadingIcon | none | Custom filter and loading indicators. |

### Select methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the combobox trigger. |
| openPanel | () =&gt; void | Opens an enabled Select and initializes active option state. |
| closePanel | (restoreFocus?: boolean) =&gt; void | Closes the panel and optionally restores trigger focus. |
| toggle | () =&gt; void | Toggles panel visibility. |
| clear | () =&gt; void | Clears a clearable enabled selection and restores focus. |
| reset | () =&gt; void | Clears value, query, and panel state. |
| clearFilter | () =&gt; void | Clears the controlled filter query and restores filter focus. |

## Interfaces and types

### Interfaces

```ts
type AerisSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisSelectAppearance = 'outline' | 'filled';
type AerisSelectFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals';

interface AerisSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly option: AerisSelectOption;
}

interface AerisSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface AerisSelectLazyLoadEvent {
  readonly first: number;
  readonly last: number;
  readonly query: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-select-text` | `CSS custom property` | — | Selected value text. |
| `--aeris-select-border` | `CSS custom property` | — | Outlined trigger border. |
| `--aeris-select-background` | `CSS custom property` | — | Trigger and filter background. |
| `--aeris-select-filled-background` | `CSS custom property` | — | Filled appearance background. |
| `--aeris-select-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-select-panel-background` | `CSS custom property` | — | Options panel surface. |
| `--aeris-select-panel-border` | `CSS custom property` | — | Options panel border. |
| `--aeris-select-panel-shadow` | `CSS custom property` | — | Floating panel elevation. |
| `--aeris-select-option-hover` | `CSS custom property` | — | Active and hovered option background. |
| `--aeris-select-selected-text` | `CSS custom property` | — | Selected option text. |

## Examples

### Basic

Associate a visible label through inputId and provide a placeholder for the empty state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-basic-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="basic-role">Project role</label>
      <aeris-select
        inputId="basic-role"
        [options]="roles"
        placeholder="Choose a role"
        [(value)]="role"
        fluid
      />
      <small aria-live="polite">Value: {{ role() ?? 'None' }}</small>
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
export class SelectBasicBasicDemo {
  protected readonly role = signal<string | null>('engineer');

  protected readonly roles: readonly AerisSelectOption[] = [
    { label: 'Product designer', value: 'designer' },
    { label: 'Software engineer', value: 'engineer' },
    { label: 'Product manager', value: 'manager' },
  ];
}
```

### Signal model and events

Use the value model for local state and the typed changed output when option metadata is needed.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-model-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="event-role">Assigned role</label>
      <aeris-select
        inputId="event-role"
        [options]="roles"
        [(value)]="role"
        (changed)="recordChange($event)"
        fluid
      />
      <small aria-live="polite">{{ lastChange() }}.</small>
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
export class SelectModelSignalModelAndEventsDemo {
}
```

### Selection mark

Show or hide the selected-option mark independently from selection styling.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-checkmark-demo',
  imports: [AerisSelect],
  templateUrl: './select-checkmark.demo.html',
  styleUrl: './select-checkmark.demo.scss'
})
export class SelectCheckmarkSelectionMarkDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>With mark</span
    ><aeris-select
      ariaLabel="Role with selection mark"
      [options]="roles"
      value="engineer"
      fluid
    />
  </div>
  <div class="field">
    <span>Without mark</span
    ><aeris-select
      ariaLabel="Role without selection mark"
      [options]="roles"
      value="engineer"
      [checkmark]="false"
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

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

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### Editable value

Accept a listed option or a free-form value through a native editable combobox.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-editable-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="editable-role">Specialty</label>
      <aeris-select
        inputId="editable-role"
        [options]="roles"
        [(value)]="editableRole"
        editable
        clearable
        fluid
      />
      <small aria-live="polite">Value: {{ editableRole() ?? 'None' }}</small>
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
export class SelectEditableEditableValueDemo {
}
```

### Filtering

The optional search field filters option labels without changing the selected value.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-filter-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="role-filter">Role</label>
      <aeris-select
        inputId="role-filter"
        [options]="roles"
        [(value)]="role"
        filter
        placeholder="Choose a role"
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
export class SelectFilterFilteringDemo {
}
```

### Filter options

Control the query, matching strategy, searched fields, clear action, locale, autofocus, and reset behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-filter-options-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="advanced-filter">Role</label>
      <aeris-select
        inputId="advanced-filter"
        [options]="roles"
        filter
        showFilterClear
        filterMatchMode="startsWith"
        [filterFields]="['label']"
        [resetFilterOnClose]="false"
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
export class SelectFilterOptionsFilterOptionsDemo {
}
```

### Grouped options

Assign a group label to options. Groups keep their source order.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-groups-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="grouped-country">Deployment region</label>
      <aeris-select
        inputId="grouped-country"
        [options]="countries"
        [(value)]="country"
        placeholder="Choose a country"
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
export class SelectGroupsGroupedOptionsDemo {
  protected readonly country =
    signal<string | null>(null);

  protected readonly countries: readonly AerisSelectOption[] = [
    { label: 'Austria', value: 'at', group: 'Europe' },
    { label: 'Canada', value: 'ca', group: 'North America' },
    { label: 'Japan', value: 'jp', group: 'Asia Pacific' },
  ];
}
```

### Rich option descriptions

Descriptions are opt-in option metadata and appear only when provided.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-descriptions-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="described-role">Role and responsibility</label>
      <aeris-select
        inputId="described-role"
        [options]="richRoles"
        filter
        [filterFields]="['label', 'description']"
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
export class SelectDescriptionsRichOptionDescriptionsDemo {
  protected readonly richRoles:
    readonly AerisSelectOption[] = [
      {
        label: 'Product designer',
        value: 'designer',
        description: 'Designs product workflows and interfaces',
      },
    ];
}
```

### Option and selected-value templates

Projected Angular templates customize consumer content while Aeris retains interaction and accessibility semantics.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-templates-demo',
  imports: [AerisSelect],
  templateUrl: './select-templates.demo.html',
  styleUrl: './select-templates.demo.scss'
})
export class SelectTemplatesOptionAndSelectedValueTemplatesDemo {
  protected readonly team =
    signal<string | null>('design');

  protected readonly teams: readonly AerisSelectOption[] = [
    { label: 'Design system', value: 'design' },
    { label: 'Web platform', value: 'platform' },
    { label: 'Accessibility', value: 'a11y' },
  ];
}
```

#### HTML

```html
<div class="field">
  <label for="team-template">Team</label>
  <aeris-select inputId="team-template" [options]="teams" [(value)]="team" fluid>
    <ng-template aerisSelectSelected let-option>
      <span class="selected-team">
        <span class="team-mark" [attr.data-team]="option.value"></span>
        {{ option.label }}
      </span>
    </ng-template>
    <ng-template aerisSelectOption let-option>
      <span class="team-option">
        <span class="team-mark" [attr.data-team]="option.value"></span>
        <strong>{{ option.label }}</strong>
      </span>
    </ng-template>
  </aeris-select>
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

.team-mark {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: var(--primary);
}

.team-mark[data-team='platform'] {
  background: #80939b;
}

.team-mark[data-team='a11y'] {
  background: #8f5b34;
}

.selected-team,
.team-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
```

### Panel content and state templates

Customize group headings, panel header and footer, and empty states without replacing listbox semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-panel-content-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="panel-content">Country</label>
      <aeris-select inputId="panel-content" [options]="countries" filter fluid>
        <ng-template aerisSelectHeader><strong>Available regions</strong></ng-template>
        <ng-template aerisSelectGroup let-group
          ><span>{{ group }}</span></ng-template
        >
        <ng-template aerisSelectFooter
          ><small>Use search to narrow the list.</small></ng-template
        >
        <ng-template aerisSelectEmpty>No countries are configured.</ng-template>
        <ng-template aerisSelectEmptyFilter>No countries match this search.</ng-template>
      </aeris-select>
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
export class SelectPanelContentPanelContentAndStateTemplatesDemo {
}
```

### Virtual scrolling and lazy ranges

Large flat lists render only the visible range. Lazy mode reports each requested viewport range.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectLazyLoadEvent, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-virtual-scroll-demo',
  imports: [AerisSelect],
  templateUrl: './select-virtual-scroll.demo.html',
  styleUrl: './select-virtual-scroll.demo.scss'
})
export class SelectVirtualScrollVirtualScrollingAndLazyRangesDemo {
  protected readonly virtualRole =
    signal<string | null>(null);

  protected readonly largeOptions: readonly AerisSelectOption[] =
    Array.from({ length: 1000 }, (_, index) => ({
      label: `Workspace ${String(index + 1).padStart(4, '0')}`,
      value: `workspace-${index + 1}`,
    }));

  protected recordLazyRange(event: AerisSelectLazyLoadEvent): void {
    this.virtualRange.set(
      `Requested ${event.first}–${event.last}`,
    );
  }
}
```

#### HTML

```html
<div class="field">
  <label for="virtual-workspace">Workspace</label>
  <aeris-select
    inputId="virtual-workspace"
    [options]="largeOptions"
    [(value)]="virtualRole"
    filter
    virtualScroll
    [virtualItemSize]="40"
    [virtualBuffer]="5"
    lazy
    (lazyLoad)="recordLazyRange($event)"
    fluid
  />
  <small aria-live="polite">{{ virtualRange() }}</small>
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
```

### Clear button

A separate accessible suffix button clears the model and restores focus to the combobox.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-clearable-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="clearable-role">Role</label>
      <aeris-select
        inputId="clearable-role"
        [options]="roles"
        [(value)]="clearableRole"
        clearable
        fluid
      />
      <small aria-live="polite">Value: {{ clearableRole() ?? 'None' }}</small>
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
export class SelectClearableClearButtonDemo {
}
```

### Sizes

Four sizes align Select with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-sizes-demo',
  imports: [AerisSelect],
  templateUrl: './select-sizes.demo.html',
  styleUrl: './select-sizes.demo.scss'
})
export class SelectSizesSizesDemo {
}
```

#### HTML

```html
<div class="select-size-grid">
  <label
    ><span>Extra small</span
    ><aeris-select
      ariaLabel="Extra small role"
      [options]="roles"
      value="designer"
      size="xs"
  /></label>
  <label
    ><span>Small</span
    ><aeris-select
      ariaLabel="Small role"
      [options]="roles"
      value="designer"
      size="sm"
  /></label>
  <label
    ><span>Medium</span
    ><aeris-select ariaLabel="Medium role" [options]="roles" value="designer"
  /></label>
  <label
    ><span>Large</span
    ><aeris-select
      ariaLabel="Large role"
      [options]="roles"
      value="designer"
      size="lg"
  /></label>
</div>
```

#### CSS

```css
.select-size-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.select-size-grid label {
  min-width: 0;
  display: grid;
  gap: 0.4rem;
}

.select-size-grid label > span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .select-size-grid {
      grid-template-columns: 1fr;
    }
}
```

### Appearances and states

Outlined, filled, invalid, required, and disabled states preserve clear contrast and semantics.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-states-demo',
  imports: [AerisSelect],
  templateUrl: './select-states.demo.html',
  styleUrl: './select-states.demo.scss'
})
export class SelectStatesAppearancesAndStatesDemo {
  protected readonly invalidRole =
    signal<string | null>(null);

  protected readonly roleInvalid = computed(
    () => this.invalidRole() === null,
  );
}
```

#### HTML

```html
<div class="field-grid select-state-grid">
  <div class="field">
    <label for="select-outline">Outlined</label
    ><aeris-select
      inputId="select-outline"
      [options]="roles"
      value="designer"
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <label for="select-filled">Filled</label
    ><aeris-select
      inputId="select-filled"
      [options]="roles"
      value="engineer"
      appearance="filled"
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <label for="select-invalid">Required</label
    ><aeris-select
      inputId="select-invalid"
      [options]="roles"
      [(value)]="invalidRole"
      required
      [invalid]="roleInvalid()"
      ariaDescribedby="select-error"
      fluid
    />
    @if (roleInvalid()) {
      <small id="select-error" class="error state-message">Choose a role.</small>
    } @else {
      <small class="state-message" aria-hidden="true">&nbsp;</small>
    }
  </div>
  <div class="field">
    <label for="select-disabled">Disabled</label
    ><aeris-select
      inputId="select-disabled"
      [options]="roles"
      value="manager"
      disabled
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

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

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}

.field small.error {
  color: var(--aeris-danger);
}

.select-state-grid {
  align-items: start;
}

.state-message {
  min-height: 1.25rem;
}
```

### Loading and empty states

Busy and empty messages are announced as status updates inside the options panel.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-feedback-demo',
  imports: [AerisSelect],
  templateUrl: './select-feedback.demo.html',
  styleUrl: './select-feedback.demo.scss'
})
export class SelectFeedbackLoadingAndEmptyStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Loading</span
    ><aeris-select ariaLabel="Loading roles" [options]="roles" loading fluid />
  </div>
  <div class="field">
    <span>Empty</span
    ><aeris-select
      ariaLabel="Empty role list"
      [options]="[]"
      emptyMessage="No roles have been created"
      fluid
    />
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

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

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

### HTML form submission

For a browser-submitted HTML form, name mirrors the selected value into FormData. Angular applications can use the Forms integration shown next instead.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-native-form-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="native-role">Role</label>
      <aeris-select
        inputId="native-role"
        name="role"
        [options]="roles"
        value="engineer"
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
export class SelectNativeFormHTMLFormSubmissionDemo {
}
```

### Reactive and template-driven forms

Select implements ControlValueAccessor while retaining its signal model API.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisSelect } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-angular-forms-demo',
  imports: [AerisSelect, FormsModule, ReactiveFormsModule],
  templateUrl: './select-angular-forms.demo.html',
  styleUrl: './select-angular-forms.demo.scss'
})
export class SelectAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveRole =
    new FormControl<string | null>('engineer');

  protected templateRole: string | null = 'designer';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-role">Reactive Forms</label>
    <aeris-select
      inputId="reactive-role"
      [options]="roles"
      [formControl]="reactiveRole"
      fluid
    />
    <small>Value: {{ reactiveRole.value ?? 'None' }}</small>
  </div>
  <div class="field">
    <label for="template-role">Template-driven forms</label>
    <aeris-select
      inputId="template-role"
      name="templateRole"
      [options]="roles"
      [(ngModel)]="templateRole"
      fluid
    />
    <small>Value: {{ templateRole ?? 'None' }}</small>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

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

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
```

## Accessibility

- The trigger follows the ARIA combobox pattern and controls a separate listbox with active-descendant focus management.
- Enter or Space opens and selects. Arrow keys navigate enabled options. Home and End move to boundaries.
- Escape closes without changing selection. Tab closes and continues normal document navigation.
- Without filtering, printable characters provide typeahead selection. With filtering, focus moves to a labeled search field.
- Disabled options expose aria-disabled and are skipped by keyboard navigation.
- Associate visible labels through inputId, or use ariaLabel only when no visible label exists.
- Connect help and error messages through ariaDescribedby. Required and invalid state are synchronized with ARIA.
- The clear action is a separate native button with a configurable accessible name and focus restoration.
- ControlValueAccessor synchronizes value, touched, and disabled state with Reactive Forms and template-driven forms.
- Loading and empty messages use status semantics, focus remains predictable, and motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Opens the closed panel or selects the active option. |
| `Arrow Down` | Opens the panel or moves to the next enabled option. |
| `Arrow Up` | Opens the panel or moves to the previous enabled option. |
| `Home` | Moves to the first enabled option while the panel is open. |
| `End` | Moves to the last enabled option while the panel is open. |
| `Escape` | Closes the panel without changing the current selection. |
| `Tab` | Closes the panel and continues normal document navigation. |
| `Printable characters` | Searches options by typeahead when filtering and editable mode are disabled. |
