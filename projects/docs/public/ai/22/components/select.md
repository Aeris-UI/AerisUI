# Select

> Searchable single-value selection with groups and templates, plus a lightweight native select directive.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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

### Native Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `controlSize` | `AerisNativeSelectSize: 'xs' &#124; 'sm' &#124; 'md' &#124; 'lg'` | `'md'` | Visual field size. This deliberately does not replace the native numeric size attribute, which controls visible option rows. |
| `appearance` | `AerisNativeSelectAppearance: 'outline' &#124; 'filled'` | `'outline'` | Closed-control surface. Options: outline, filled. The native browser picker and option rendering remain platform-owned. |
| `fluid` | `boolean` | `false` | Fills the available inline width. Also supported as a descendant of Aeris Fluid. |
| `invalid` | `boolean` | `false` | Explicit invalid state, synchronized with aria-invalid. Native required validation uses :user-invalid independently. |
| `touched` | `boolean &#124; null` | `null` | Null preserves immediate explicit invalid presentation; false defers it; true displays invalid state. Signal Forms supplies invalid and touched automatically. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `checkIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the check icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `filterClearIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Replaces only the filter clear icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `appendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `global config or 'self'` | Mounts the overlay locally by default and automatically moves it to document.body when a clipping ancestor is detected. Set 'self', 'body', or a DOM/template target explicitly to override detection. |
| `viewportMargin` | `number &#124; AerisOverlayCollisionPadding` | `8` | Keeps the options panel inside the visual viewport. Use per-edge values to reserve fixed headers or bottom navigation. |
| `options` | `readonly AerisSelectOption[]` | `required` | Available options in display order. |
| `value` | `string &#124; null (model)` | `null` | Selected option value with two-way binding and Forms support. |
| `inputId` | `string` | `generated` | ID assigned to the combobox trigger for visible labels. |
| `name` | `string` | `''` | Creates a hidden native form value when a selection exists. |
| `placeholder` | `string` | `'Select an option'` | Text displayed without a selection. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label is associated. |
| `ariaLabelledBy` | `string` | `''` | IDs of elements that label the combobox. |
| `ariaDescribedBy` | `string` | `''` | IDs of help and validation messages. |
| `listboxAriaLabel` | `string` | `'Options'` | Accessible name for the options list. |
| `size` | `AerisSelectSize` | `'md'` | Control height and typography size. Options: 'xs', 'sm', 'md', 'lg'. |
| `appearance` | `AerisSelectAppearance` | `'outline'` | Outlined or filled visual treatment. Options: 'outline', 'filled'. |
| `disabled` | `boolean` | `false` | Disables opening, selection, clearing, and Forms interaction. |
| `required` | `boolean` | `false` | Exposes aria-required for validation. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `touched` | `boolean &#124; null` | `null` | Controls when invalid presentation is shown. Null preserves immediate manual invalid state; false defers it; true displays it. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |
| `minWidth` | `string` | `''` | Optional CSS minimum inline size. The control can shrink to zero when this is omitted. |
| `checkmark` | `boolean` | `true` | Shows a selection mark beside the selected option. |
| `editable` | `boolean` | `false` | Allows free-form values in addition to listed options. |
| `filter` | `boolean` | `false` | Adds an accessible search field to the options panel. |
| `filterValue` | `string (model)` | `''` | Controlled filter query with two-way binding. |
| `filterMatchMode` | `AerisSelectFilterMatchMode` | `'contains'` | Matching strategy for local filtering. Options: 'contains', 'startsWith', 'endsWith', 'equals'. |
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
| valueChange | string &#124; null | Emitted when selection, clear, or public methods change the value. |
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
type AerisNativeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisNativeSelectAppearance = 'outline' | 'filled';
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
| `--aeris-select-min-width` | `CSS custom property` | — | Minimum inline size of the control. |
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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectBasicDemo {
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
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectChangeEvent, type AerisSelectOption } from '@aeris-ui/core/select';

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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectModelDemo {
  protected readonly role = signal<string | null>('engineer');

  protected readonly lastChange = signal('No interaction');

  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];

  protected recordChange(event: AerisSelectChangeEvent): void {
      this.lastChange.set(`Selected ${event.option.label}`);
    }
}
```

### Selection mark

Show or hide the selected-option mark independently from selection styling.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-checkmark-demo',
  imports: [AerisSelect],
  templateUrl: './select-checkmark.demo.html',
  styleUrl: './select-checkmark.demo.scss'
})
export class SelectCheckmarkDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>With mark</span>
    <aeris-select
      ariaLabel="Role with selection mark"
      [options]="roles"
      value="engineer"
      fluid
    />
  </div>
  <div class="field">
    <span>Without mark</span>
    <aeris-select
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 32rem);
}
```

### Editable value

Accept a listed option or a free-form value through a native editable combobox.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectEditableDemo {
  protected readonly editableRole = signal<string | null>('Custom specialist');

  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

### Filtering

The optional search field filters option labels without changing the selected value.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectFilterDemo {
  protected readonly role = signal<string | null>('engineer');

  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

### Filter options

Control the query, matching strategy, searched fields, clear action, locale, autofocus, and reset behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectFilterOptionsDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectGroupsDemo {
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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectDescriptionsDemo {
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
export class SelectTemplatesDemo {
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

.field {
  width: min(100%, 32rem);
}

.selected-team,
.team-option {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.team-option > span:last-child {
  min-width: 0;
  display: grid;
  gap: 0.125rem;
}

.team-option strong {
  color: var(--aeris-text);
  font-size: 0.8125rem;
}

.team-option small {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

.team-mark {
  width: 0.625rem;
  height: 0.625rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--aeris-primary);
}

.team-mark[data-team=platform] {
  background: #52685b;
}

.team-mark[data-team=a11y] {
  background: #343b37;
}
```

### Panel content and state templates

Customize group headings, panel header and footer, and empty states without replacing listbox semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-panel-content-demo',
  imports: [AerisSelect],
  template: `
    <div class="field">
      <label for="panel-content">Country</label>
      <aeris-select inputId="panel-content" [options]="countries" filter fluid>
        <ng-template aerisSelectHeader><strong>Available regions</strong></ng-template>
        <ng-template aerisSelectGroup let-group>
          <span>{{ group }}</span>
        </ng-template>
        <ng-template aerisSelectFooter>
          <small>Use search to narrow the list.</small>
        </ng-template>
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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectPanelContentDemo {
  protected readonly countries: readonly AerisSelectOption[] = [
      { label: 'Austria', value: 'at', group: 'Europe' },
      { label: 'Germany', value: 'de', group: 'Europe' },
      { label: 'Serbia', value: 'rs', group: 'Europe' },
      { label: 'Canada', value: 'ca', group: 'North America' },
      { label: 'Mexico', value: 'mx', group: 'North America' },
      { label: 'United States', value: 'us', group: 'North America' },
      { label: 'Japan', value: 'jp', group: 'Asia Pacific' },
      { label: 'New Zealand', value: 'nz', group: 'Asia Pacific' },
      { label: 'Singapore', value: 'sg', group: 'Asia Pacific' },
    ];
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
export class SelectVirtualScrollDemo {
  protected readonly virtualRange = signal('No range requested');

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

.field {
  width: min(100%, 32rem);
}
```

### Clear button

A separate accessible suffix button clears the model and restores focus to the combobox.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectClearableDemo {
  protected readonly clearableRole = signal<string | null>('designer');

  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

### Sizes

Four sizes align Select with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-sizes-demo',
  imports: [AerisSelect],
  templateUrl: './select-sizes.demo.html',
  styleUrl: './select-sizes.demo.scss'
})
export class SelectSizesDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

#### HTML

```html
<div class="select-size-grid">
  <label>
    <span>Extra small</span>
    <aeris-select
      ariaLabel="Extra small role"
      [options]="roles"
      value="designer"
      size="xs"
    />
  </label>
  <label>
    <span>Small</span>
    <aeris-select ariaLabel="Small role" [options]="roles" value="designer" size="sm" />
  </label>
  <label>
    <span>Medium</span>
    <aeris-select ariaLabel="Medium role" [options]="roles" value="designer" />
  </label>
  <label>
    <span>Large</span>
    <aeris-select ariaLabel="Large role" [options]="roles" value="designer" size="lg" />
  </label>
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
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-states-demo',
  imports: [AerisSelect],
  templateUrl: './select-states.demo.html',
  styleUrl: './select-states.demo.scss'
})
export class SelectStatesDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];

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
    <label for="select-outline">Outlined</label>
    <aeris-select inputId="select-outline" [options]="roles" value="designer" fluid />
    <small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <label for="select-filled">Filled</label>
    <aeris-select
      inputId="select-filled"
      [options]="roles"
      value="engineer"
      appearance="filled"
      fluid
    />
    <small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
  <div class="field">
    <label for="select-invalid">Required</label>
    <aeris-select
      inputId="select-invalid"
      [options]="roles"
      [(value)]="invalidRole"
      required
      [invalid]="roleInvalid()"
      ariaDescribedBy="select-error"
      fluid
    />
    @if (roleInvalid()) {
      <small id="select-error" class="error state-message">Choose a role.</small>
    } @else {
      <small class="state-message" aria-hidden="true">&nbsp;</small>
    }
  </div>
  <div class="field">
    <label for="select-disabled">Disabled</label>
    <aeris-select
      inputId="select-disabled"
      [options]="roles"
      value="manager"
      disabled
      fluid
    />
    <small class="state-message" aria-hidden="true">&nbsp;</small>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 32rem);
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
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-feedback-demo',
  imports: [AerisSelect],
  templateUrl: './select-feedback.demo.html',
  styleUrl: './select-feedback.demo.scss'
})
export class SelectFeedbackDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Loading</span>
    <aeris-select ariaLabel="Loading roles" [options]="roles" loading fluid />
  </div>
  <div class="field">
    <span>Empty</span>
    <aeris-select
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 32rem);
}
```

### HTML form submission

For a browser-submitted HTML form, name mirrors the selected value into FormData. Angular applications can use the Forms integration shown next instead.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

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

    .field {
      width: min(100%, 32rem);
    }
  `
})
export class SelectNativeFormDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];
}
```

### Reactive and template-driven forms

Select implements ControlValueAccessor while retaining its signal model API.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisSelect, type AerisSelectOption } from '@aeris-ui/core/select';

@Component({
  selector: 'app-select-angular-forms-demo',
  imports: [AerisSelect, FormsModule, ReactiveFormsModule],
  templateUrl: './select-angular-forms.demo.html',
  styleUrl: './select-angular-forms.demo.scss'
})
export class SelectAngularFormsDemo {
  protected readonly roles: readonly AerisSelectOption[] = [
      { label: 'Product designer', value: 'designer' },
      { label: 'Software engineer', value: 'engineer' },
      { label: 'Product manager', value: 'manager' },
      { label: 'Quality engineer', value: 'quality', disabled: true },
    ];

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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 32rem);
}
```

### Native select

Style a real select while retaining the browser's picker, options and optgroups. Its arrow, expanded choices and mobile picker remain platform-specific; no Aeris overlay is created.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisNativeSelect } from '@aeris-ui/core/select/native';

@Component({
  selector: 'app-select-native-demo',
  imports: [AerisNativeSelect],
  template: `
    <div class="field native-select-field">
      <label for="native-basic-region">Region</label>
      <select aerisNativeSelect id="native-basic-region" name="region">
        <option value="">Choose a region</option>
        <optgroup label="Europe">
          <option value="rs">Serbia</option>
          <option value="de">Germany</option>
        </optgroup>
        <optgroup label="Asia Pacific">
          <option value="jp">Japan</option>
          <option value="nz" disabled>New Zealand (unavailable)</option>
        </optgroup>
      </select>
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

    .field {
      width: min(100%, 32rem);
    }

    .native-select-field {
      max-inline-size: 22rem;
    }
  `
})
export class SelectNativeDemo {
}
```

### Native sizing and appearance

controlSize changes field geometry without replacing native size. Use appearance for the field surface and the native disabled attribute to prevent interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisNativeSelect } from '@aeris-ui/core/select/native';

@Component({
  selector: 'app-select-native-sizes-demo',
  imports: [AerisNativeSelect],
  templateUrl: './select-native-sizes.demo.html',
  styleUrl: './select-native-sizes.demo.scss'
})
export class SelectNativeSizesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="native-xs">Extra small</label>
    <select aerisNativeSelect id="native-xs" controlSize="xs">
      <option>Design</option>
      <option>Engineering</option>
    </select>
  </div>
  <div class="field">
    <label for="native-sm">Small</label>
    <select aerisNativeSelect id="native-sm" controlSize="sm">
      <option>Design</option>
      <option>Engineering</option>
    </select>
  </div>
  <div class="field">
    <label for="native-md">Medium</label>
    <select aerisNativeSelect id="native-md">
      <option>Design</option>
      <option>Engineering</option>
    </select>
  </div>
  <div class="field">
    <label for="native-lg">Large</label>
    <select aerisNativeSelect id="native-lg" controlSize="lg">
      <option>Design</option>
      <option>Engineering</option>
    </select>
  </div>
  <div class="field">
    <label for="native-filled">Filled</label>
    <select aerisNativeSelect id="native-filled" appearance="filled">
      <option>Design</option>
      <option>Engineering</option>
    </select>
  </div>
  <div class="field">
    <label for="native-disabled">Disabled</label>
    <select aerisNativeSelect id="native-disabled" disabled>
      <option>Design</option>
    </select>
  </div>
</div>
```

#### CSS

```css
.field-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
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

.field {
  width: min(100%, 32rem);
}
```

### Native multiple selection

Native multiple and size retain their browser behavior. Angular's built-in multiple-select value accessor handles the array; Aeris does not replace it.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisNativeSelect } from '@aeris-ui/core/select/native';

@Component({
  selector: 'app-select-native-multiple-demo',
  imports: [AerisNativeSelect, ReactiveFormsModule],
  templateUrl: './select-native-multiple.demo.html',
  styleUrl: './select-native-multiple.demo.scss'
})
export class SelectNativeMultipleDemo {
  protected readonly nativeMultiple = new FormControl(['design'], { nonNullable: true });
}
```

#### HTML

```html
<div class="field native-select-field">
  <label for="native-multiple">Teams</label>
  <select
    aerisNativeSelect
    id="native-multiple"
    name="teams"
    multiple
    size="4"
    [formControl]="nativeMultiple"
    aria-describedby="native-multiple-help"
  >
    <option value="design">Design</option>
    <option value="engineering">Engineering</option>
    <option value="operations">Operations</option>
    <option value="support">Support</option>
  </select>
  <small id="native-multiple-help">
    Use your platform's multiple-selection controls. Selected: {{ nativeMultiple.value }}
  </small>
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

.field {
  width: min(100%, 32rem);
}

.native-select-field {
  max-inline-size: 22rem;
}
```

### Native Signal Forms

Signal Forms supplies invalid and touched automatically. Pristine required fields stay neutral; blurring or submitting reveals invalid state. A valid selection clears it.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisNativeSelect } from '@aeris-ui/core/select/native';
import { FormField, form, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'app-select-native-forms-demo',
  imports: [AerisButton, AerisNativeSelect, FormField],
  templateUrl: './select-native-forms.demo.html',
  styleUrl: './select-native-forms.demo.scss'
})
export class SelectNativeFormsDemo {
  protected readonly nativeData = signal({ region: '' });

  protected readonly nativeFields = form(this.nativeData, (path) => required(path.region));

  protected readonly nativeSubmitted = signal(false);

  protected async validateNativeSelect(event: Event): Promise<void> {
      event.preventDefault();
      this.nativeSubmitted.set(await submit(this.nativeFields, async () => undefined));
    }
}
```

#### HTML

```html
<form
  class="field native-select-field"
  novalidate
  (submit)="validateNativeSelect($event)"
>
  <label for="native-required">Required region</label>
  <select
    aerisNativeSelect
    id="native-required"
    [formField]="nativeFields.region"
    aria-describedby="native-required-help"
  >
    <option value="">Choose a region</option>
    <option value="rs">Serbia</option>
    <option value="jp">Japan</option>
  </select>
  <small id="native-required-help" aria-live="polite">
    @if (nativeFields.region().touched() && nativeFields.region().invalid()) {
      Choose a region.
    } @else if (nativeSubmitted()) {
      Validation successful.
    } @else {
      Validate the empty field or select a region.
    }
  </small>
  <button aerisButton type="submit">Validate</button>
</form>
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

.field {
  width: min(100%, 32rem);
}

.native-select-field {
  max-inline-size: 22rem;
}
```

## Accessibility

- The trigger follows the ARIA combobox pattern and controls a separate listbox with active-descendant focus management.
- Enter or Space opens and selects. Arrow keys navigate enabled options. Home and End move to boundaries.
- Escape closes without changing selection. Tab closes and continues normal document navigation.
- Without filtering, printable characters provide typeahead selection. With filtering, focus moves to a labeled search field.
- Disabled options expose aria-disabled and are skipped by keyboard navigation.
- Associate visible labels through inputId, or use ariaLabel only when no visible label exists.
- Connect help and error messages through ariaDescribedBy. Required and invalid state are synchronized with ARIA.
- The clear action is a separate native button with a configurable accessible name and focus restoration.
- ControlValueAccessor synchronizes value, touched, and disabled state with Reactive Forms and template-driven forms.
- Loading and empty messages use status semantics, focus remains predictable, and motion respects reduced-motion preferences.
- The native directive reuses the same control border, surface, typography, density, corner, focus and invalid tokens as InputText. Its browser-owned popup cannot be restyled or portaled with appendTo. The closed field uses the shared Aeris chevron, aligned to the inline end; forced-colors mode restores the browser arrow. Multiple and size-based listboxes have no chevron. Native required controls use :user-invalid; explicit invalid/touched state stays synchronized with aria-invalid. Label native selects with a real label/for pair and native aria-describedby.

### Keyboard support

| Key | Function |
| --- | --- |
| `Native select: Tab, arrows, typing, Space/Enter, Escape and multiple-selection modifiers` | Browser and operating-system behavior is preserved without interception. Tab focuses the native control; opening, typeahead, selection and dismissal vary by platform. Numeric size and multiple use the browser's listbox behavior. |
| `Enter / Space` | Opens the closed panel or selects the active option. |
| `Arrow Down` | Opens the panel or moves to the next enabled option. |
| `Arrow Up` | Opens the panel or moves to the previous enabled option. |
| `Home` | Moves to the first enabled option while the panel is open. |
| `End` | Moves to the last enabled option while the panel is open. |
| `Escape` | Closes the panel without changing the current selection. |
| `Tab` | Closes the panel and continues normal document navigation. |
| `Printable characters` | Searches options by typeahead when filtering and editable mode are disabled. |
