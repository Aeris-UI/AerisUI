# MultiSelect

> Multiple selection with filtering, chips, groups, limits, and virtualization.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/multi-select`
- Human-readable documentation: [https://aeris-ui.dev/components/multi-select](https://aeris-ui.dev/components/multi-select)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisMultiSelect, type AerisSelectOption } from '@aeris-ui/core/multi-select';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `readonly AerisSelectOption[]` | `required` | Available options in display order. |
| `value` | `readonly string[] (model)` | `[]` | Selected option values with two-way binding and Forms support. |
| `inputId` | `string` | `''` | Visible-label association. |
| `name` | `string` | `''` | Optional HTML form field name. |
| `valueSeparator` | `string` | `','` | Separator used by the hidden HTML form value. |
| `placeholder` | `string` | `'Select options'` | Text displayed when no option is selected. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label exists. |
| `ariaLabelledby` | `string` | `''` | IDs of visible elements that label the field. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |
| `listboxAriaLabel` | `string` | `'Options'` | Accessible name for the multi-select listbox. |
| `size` | `AerisMultiSelectSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisMultiSelectAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `display` | `AerisMultiSelectDisplay` | `'summary'` | Displays a text summary or removable chips. |
| `selectedItemsLabel` | `string` | `'{0} items selected'` | Summary used after the visible label threshold. |
| `maxSelectedLabels` | `number` | `3` | Maximum labels or chips shown before a count is used. |
| `selectionLimit` | `number &#124; undefined` | `undefined` | Maximum number of selected values. |
| `selectionLimitMessage` | `string` | `'Selection limit reached'` | Status text shown when the limit is reached. |
| `showSelectAll` | `boolean` | `true` | Shows the filtered select-all action. |
| `selectAllLabel` | `string` | `'Select all'` | Visible label for the select-all action. |
| `clearable` | `boolean` | `false` | Shows the clear suffix button. |
| `clearButtonAriaLabel` | `string` | `'Clear selections'` | Accessible name for the clear suffix button. |
| `filter` | `boolean` | `false` | Adds a search field to the panel. |
| `filterValue` | `string (model)` | `''` | Controlled filter query. |
| `filterMatchMode` | `contains &#124; startsWith &#124; endsWith &#124; equals` | `'contains'` | Local matching strategy. |
| `filterFields` | `readonly ('label' &#124; 'description' &#124; 'group')[]` | `['label']` | Option fields included in filtering. |
| `filterLocale` | `string &#124; undefined` | `undefined` | Locale used for case normalization. |
| `filterPlaceholder` | `string` | `'Search options'` | Visible filter placeholder. |
| `filterAriaLabel` | `string` | `'Search options'` | Accessible name for the filter field. |
| `filterClearAriaLabel` | `string` | `'Clear search'` | Accessible name for clearing the filter. |
| `resetFilterOnClose` | `boolean` | `true` | Clears the filter when the panel closes. |
| `autofocusFilter` | `boolean` | `true` | Moves focus to the filter field when opened. |
| `emptyMessage` | `string` | `localized text` | Message shown when no options exist. |
| `emptyFilterMessage` | `string` | `localized text` | Message shown when filtering returns no matches. |
| `loading` | `boolean` | `false` | Shows a busy state. |
| `loadingMessage` | `string` | `'Loading options'` | Status text shown while loading. |
| `panelMaxHeight` | `string` | `'18rem'` | Maximum scrollable list height. |
| `virtualScroll` | `boolean` | `false` | Renders a window of a large flat option list. |
| `virtualItemSize` | `number` | `40` | Virtual row height. |
| `virtualBuffer` | `number` | `4` | Virtual overscan count. |
| `lazy` | `boolean` | `false` | Emits requested virtual viewport ranges. |
| `closeOnSelect` | `boolean` | `false` | Closes the panel after each selection. |
| `disabled` | `boolean` | `false` | Disables interaction and native form submission. |
| `required` | `boolean` | `false` | Exposes native required validation semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |

### MultiSelect outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange / valueInput | readonly string[] | Model and explicit value-change notifications. |
| changed | AerisMultiSelectChangeEvent | Option metadata and whether it was selected or removed. |
| filterChanged | AerisMultiSelectFilterEvent | Current filter query and native event. |
| lazyLoad | AerisMultiSelectLazyLoadEvent | Requested virtual range and query. |
| opened / closed / cleared / touch | void | Panel, clear, and touched lifecycle notifications. |
| focused / blurred | FocusEvent | Combobox focus lifecycle events. |

### MultiSelect templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisMultiSelectOption | option, selected, active | Custom option content. |
| aerisMultiSelectChip | option, remove | Custom selected chip content. |
| aerisMultiSelectHeader / Footer | none | Custom panel content around the list. |
| aerisMultiSelectEmpty | none | Custom empty-state content. |

### MultiSelect methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the combobox. |
| openPanel / toggle | () =&gt; void | Opens or toggles the enabled component. |
| closePanel | (restoreFocus?: boolean) =&gt; void | Closes the panel and optionally restores focus. |
| clear / reset | () =&gt; void | Clears values, with reset also clearing filter and panel state. |
| selectAll | () =&gt; void | Selects enabled options in the current filtered result. |

## Interfaces and types

### Interfaces

```ts
type AerisMultiSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisMultiSelectAppearance = 'outline' | 'filled';
type AerisMultiSelectDisplay = 'summary' | 'chips';

interface AerisSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisMultiSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: readonly string[];
  readonly option: AerisSelectOption | null;
  readonly selected: boolean;
}

interface AerisMultiSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface AerisMultiSelectLazyLoadEvent {
  readonly first: number;
  readonly last: number;
  readonly query: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-multi-select-panel-max-height` | `CSS custom property` | — | Scrollable option-list height. |
| `--aeris-surface` | `CSS custom property` | — | Control, chip checkbox, and panel surfaces. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled and interactive backgrounds. |
| `--aeris-border / --aeris-border-strong` | `CSS custom property` | — | Panel and control borders. |
| `--aeris-primary / --aeris-text` | `CSS custom property` | — | Selection controls and selected option text. |
| `--aeris-focus` | `CSS custom property` | — | Visible focus border and ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border. |

## Examples

### Basic

Bind an array of option values and associate the combobox with a visible label.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';
import { type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-multi-select-basic-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="skills-basic">Project skills</label>
      <aeris-multi-select
        inputId="skills-basic"
        [options]="skillOptions"
        [(value)]="skills"
        clearable
        fluid
        (changed)="recordChange($event)"
      />
      <small aria-live="polite"
        >{{ lastChange() }}. Values: {{ skills().join(', ') || 'None' }}</small
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
export class MultiSelectBasicBasicDemo {
  protected readonly skills =
    signal<readonly string[]>(['angular', 'typescript']);

  protected readonly skillOptions: readonly AerisSelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Accessibility', value: 'accessibility' },
    { label: 'Design systems', value: 'design-systems' },
    { label: 'Performance', value: 'performance' },
  ];
}
```

### Removable chips

Chip display keeps selected values visible. Each remove action is a labeled native button.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-chips-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="skills-chips">Review skills</label>
      <aeris-multi-select
        inputId="skills-chips"
        [options]="skillOptions"
        [(value)]="chipSkills"
        display="chips"
        [maxSelectedLabels]="4"
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
export class MultiSelectChipsRemovableChipsDemo {
}
```

### Filtering

Search labels while retaining every selected value. Select all applies to the current filtered result.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-filter-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="skills-filter">Skills</label>
      <aeris-multi-select
        inputId="skills-filter"
        [options]="skillOptions"
        [(value)]="skills"
        filter
        clearable
        filterPlaceholder="Search skills"
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
export class MultiSelectFilterFilteringDemo {
}
```

### Grouped options

Group metadata creates labeled sections while preserving source order.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';
import { type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-multi-select-groups-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="countries-grouped">Deployment countries</label>
      <aeris-multi-select
        inputId="countries-grouped"
        [options]="countryOptions"
        [(value)]="countries"
        filter
        display="chips"
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
export class MultiSelectGroupsGroupedOptionsDemo {
  protected readonly countries =
    signal<readonly string[]>(['rs', 'at']);

  protected readonly countryOptions: readonly AerisSelectOption[] = [
    { label: 'Austria', value: 'at', group: 'Europe' },
    { label: 'Serbia', value: 'rs', group: 'Europe' },
    { label: 'Canada', value: 'ca', group: 'North America' },
  ];
}
```

### Option descriptions

Descriptions are shown only when that optional metadata is present.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';
import { type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-multi-select-descriptions-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="teams-rich">Teams</label>
      <aeris-multi-select
        inputId="teams-rich"
        [options]="richOptions"
        [(value)]="teams"
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
export class MultiSelectDescriptionsOptionDescriptionsDemo {
  protected readonly richOptions:
    readonly AerisSelectOption[] = [
      {
        label: 'Design system',
        value: 'design',
        description: 'Builds shared UI foundations',
      },
    ];
}
```

### Option and chip templates

Customize consumer content without replacing Aeris selection and listbox behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';
import { type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-multi-select-templates-demo',
  imports: [AerisMultiSelect],
  templateUrl: './multi-select-templates.demo.html',
  styleUrl: './multi-select-templates.demo.scss'
})
export class MultiSelectTemplatesOptionAndChipTemplatesDemo {
  protected readonly richOptions:
    readonly AerisSelectOption[] = [
      {
        label: 'Design system',
        value: 'design',
        description: 'Builds shared UI foundations',
      },
    ];
}
```

#### HTML

```html
<div class="field">
  <label for="teams-template">Assigned teams</label>
  <aeris-multi-select
    inputId="teams-template"
    [options]="richOptions"
    [(value)]="teams"
    display="chips"
    fluid
  >
    <ng-template aerisMultiSelectOption let-option>
      <span class="team-option"
        ><strong>{{ option.label }}</strong
        ><small>{{ option.description }}</small></span
      >
    </ng-template>
    <ng-template aerisMultiSelectChip let-option>{{ option.label }}</ng-template>
    <ng-template aerisMultiSelectHeader
      ><strong>Product organization</strong></ng-template
    >
    <ng-template aerisMultiSelectFooter
      ><small>Choose every team that should be notified.</small></ng-template
    >
  </aeris-multi-select>
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

.team-option {
  display: grid;
  gap: 0.125rem;
}

.team-option small {
  color: var(--text-2);
}
```

### Select all

The panel action selects or clears enabled options, including only matching options when filtered.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-select-all-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="skills-all">Team capabilities</label>
      <aeris-multi-select
        inputId="skills-all"
        [options]="skillOptions"
        [(value)]="skills"
        filter
        showSelectAll
        selectAllLabel="Select visible skills"
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
export class MultiSelectSelectAllSelectAllDemo {
}
```

### Selection limit

Prevent additional selections after a configurable maximum while keeping selected options removable.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-limit-demo',
  imports: [AerisMultiSelect],
  template: `
    <div class="field">
      <label for="skills-limit">Primary skills</label>
      <aeris-multi-select
        inputId="skills-limit"
        [options]="skillOptions"
        [(value)]="limitedSkills"
        [selectionLimit]="3"
        selectionLimitMessage="Choose up to three skills"
        display="chips"
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
export class MultiSelectLimitSelectionLimitDemo {
}
```

### Virtual scrolling and lazy ranges

Large flat lists render a buffered viewport and can report each requested range.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisMultiSelect, type AerisMultiSelectLazyLoadEvent } from '@aeris-ui/core/multi-select';
import { type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-multi-select-virtual-demo',
  imports: [AerisMultiSelect],
  templateUrl: './multi-select-virtual.demo.html',
  styleUrl: './multi-select-virtual.demo.scss'
})
export class MultiSelectVirtualVirtualScrollingAndLazyRangesDemo {
  protected readonly virtualValues =
    signal<readonly string[]>([]);

  protected readonly largeOptions: readonly AerisSelectOption[] =
    Array.from({ length: 1000 }, (_, index) => ({
      label: `Workspace ${String(index + 1).padStart(4, '0')}`,
      value: `workspace-${index + 1}`,
    }));

  protected recordLazyRange(event: AerisMultiSelectLazyLoadEvent): void {
    this.virtualRange.set(`Requested ${event.first}-${event.last}`);
  }
}
```

#### HTML

```html
<div class="field">
  <label for="workspaces-virtual">Workspaces</label>
  <aeris-multi-select
    inputId="workspaces-virtual"
    [options]="largeOptions"
    [(value)]="virtualValues"
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

### Sizes

Four sizes align MultiSelect with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-sizes-demo',
  imports: [AerisMultiSelect],
  templateUrl: './multi-select-sizes.demo.html',
  styleUrl: './multi-select-sizes.demo.scss'
})
export class MultiSelectSizesSizesDemo {
}
```

#### HTML

```html
<div class="multi-select-size-grid">
  <label
    ><span>Extra small</span
    ><aeris-multi-select
      ariaLabel="Extra small skills"
      [options]="skillOptions"
      [value]="['angular']"
      size="xs"
  /></label>
  <label
    ><span>Small</span
    ><aeris-multi-select
      ariaLabel="Small skills"
      [options]="skillOptions"
      [value]="['angular']"
      size="sm"
  /></label>
  <label
    ><span>Medium</span
    ><aeris-multi-select
      ariaLabel="Medium skills"
      [options]="skillOptions"
      [value]="['angular']"
  /></label>
  <label
    ><span>Large</span
    ><aeris-multi-select
      ariaLabel="Large skills"
      [options]="skillOptions"
      [value]="['angular']"
      size="lg"
  /></label>
</div>
```

#### CSS

```css
.multi-select-size-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.multi-select-size-grid label {
  min-width: 0;
  display: grid;
  gap: 0.4rem;
}

.multi-select-size-grid label > span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .multi-select-size-grid {
      grid-template-columns: 1fr;
    }
}
```

### Appearances and states

Outlined, filled, required, invalid, disabled, loading, and empty states preserve semantics and layout.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-states-demo',
  imports: [AerisMultiSelect],
  templateUrl: './multi-select-states.demo.html',
  styleUrl: './multi-select-states.demo.scss'
})
export class MultiSelectStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Filled</span
    ><aeris-multi-select
      ariaLabel="Filled skills"
      [options]="skillOptions"
      [value]="['angular']"
      appearance="filled"
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <label for="skills-invalid">Required</label
    ><aeris-multi-select
      inputId="skills-invalid"
      [options]="skillOptions"
      [(value)]="invalidValues"
      required
      [invalid]="invalidValues().length === 0"
      ariaDescribedby="skills-error"
      fluid
    />
    @if (invalidValues().length === 0) {
      <small id="skills-error" class="error state-message"
        >Choose at least one skill.</small
      >
    } @else {
      <small class="state-message" aria-hidden="true">&nbsp;</small>
    }
  </div>
  <div class="field">
    <span>Disabled</span
    ><aeris-multi-select
      ariaLabel="Disabled skills"
      [options]="skillOptions"
      [value]="['angular']"
      disabled
      fluid
    /><small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <span>Loading</span
    ><aeris-multi-select
      ariaLabel="Loading skills"
      [options]="skillOptions"
      loading
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

.state-message {
  min-height: 1.25rem;
}
```

### Reactive and template-driven forms

MultiSelect implements ControlValueAccessor while retaining its signal model API.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisMultiSelect } from '@aeris-ui/core/multi-select';

@Component({
  selector: 'app-multi-select-forms-demo',
  imports: [AerisMultiSelect, FormsModule, ReactiveFormsModule],
  templateUrl: './multi-select-forms.demo.html',
  styleUrl: './multi-select-forms.demo.scss'
})
export class MultiSelectFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveSkills =
    new FormControl<readonly string[]>(['angular']);

  protected templateSkills: readonly string[] = ['typescript'];
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="skills-reactive">Reactive Forms</label>
    <aeris-multi-select
      inputId="skills-reactive"
      [options]="skillOptions"
      [formControl]="reactiveSkills"
      fluid
    />
    <small>Values: {{ reactiveSkills.value?.join(', ') || 'None' }}</small>
  </div>
  <div class="field">
    <label for="skills-template">Template-driven forms</label>
    <aeris-multi-select
      inputId="skills-template"
      name="templateSkills"
      [options]="skillOptions"
      [(ngModel)]="templateSkills"
      fluid
    />
    <small>Values: {{ templateSkills.join(', ') || 'None' }}</small>
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

- The focusable trigger follows the ARIA combobox pattern and controls a separate multi-select listbox.
- Options expose aria-selected; disabled options expose aria-disabled and are skipped during navigation.
- Use inputId with a visible label, or provide ariaLabel when no visible label exists.
- Connect help and validation text with ariaDescribedby. Required and invalid state are synchronized with ARIA.
- Chip remove and clear actions are native buttons with configurable accessible names.
- Filtering uses a labeled search field. Loading, empty, and selection-limit messages use status semantics.
- ControlValueAccessor synchronizes value, touched, and disabled state with Reactive Forms and template-driven forms.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Opens the panel or toggles the active option. |
| `Arrow Down / Arrow Up` | Opens the panel or moves between enabled options. |
| `Home / End` | Moves to the first or last enabled option while open. |
| `Backspace / Delete` | Removes the last value when chip display is active. |
| `Escape` | Closes the panel without changing selection. |
| `Tab` | Closes the panel and continues normal document navigation. |
