# Listbox

> Always-visible single or multiple selection with filtering, groups, templates, and forms support.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/listbox`
- Human-readable documentation: [https://aeris-ui.dev/components/listbox](https://aeris-ui.dev/components/listbox)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisListbox } from '@aeris-ui/core/listbox';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `readonly AerisListboxOption[]` | `[]` | Options with unique stable string values. Replace the array to update results. Missing selections remain in the controlled model; the control never silently discards them. |
| `selectionMode` | `'single' &#124; 'multiple'` | `'single'` | Single uses string or null; multiple uses a readonly string array. Set a matching value when changing mode. |
| `value` | `AerisListboxValue (model)` | `null` | Controlled selection. Filtering never clears selected values. Disabled choices cannot be changed by user interaction. |
| `filter` | `boolean` | `false` | Adds a search input. Case-insensitive contains matching across label, description and group. |
| `query` | `string (model)` | `''` | Filter query. Only applied when filter is enabled. For remote data, own cancellation and response ordering in the application and replace options. |
| `filterPlaceholder` | `string` | `'Search options'` | Search input placeholder. |
| `filterAriaLabel` | `string` | `'Filter options'` | Accessible name of the search input. |
| `emptyMessage` | `string` | `'No options available'` | Status when no options match. |
| `loadingMessage` | `string` | `'Loading options'` | Loading status text. |
| `loading` | `boolean` | `false` | Marks the list busy and prevents selection changes; existing options remain visible. |
| `disabled` | `boolean` | `false` | Disables filtering, selection and the list tab stop. |
| `required` | `boolean` | `false` | Exposes aria-required. Configure form validators separately; multiple selection may still be cleared. |
| `invalid` | `boolean` | `false` | Explicit invalid state; synchronized with aria-invalid. |
| `touched` | `boolean &#124; null` | `null` | Null preserves immediate manual invalid styling; false hides errors until interaction. Signal Forms forwards this automatically. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when no visible label is associated. |
| `ariaLabelledBy` | `string &#124; undefined` | `undefined` | Space-separated IDs of visible labels; preferred over ariaLabel. |
| `ariaDescribedBy` | `string &#124; undefined` | `undefined` | Space-separated help and visible error IDs. |
| `scrollHeight` | `string` | `'16rem'` | CSS maximum list height. Native scrolling supports variable-height descriptions and templates; every option stays mounted, without virtualization. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `AerisListboxValue` | `—` | Value model updates. Use two-way binding or handle controlled updates. |
| `queryChange` | `string` | `—` | Query model updates from the search input. |
| `changed` | `AerisListboxChangeEvent` | `—` | User selection event, selected value and matching options. Pure focus movement and external value updates do not emit it. |
| `touch` | `void` | `—` | Focus left the whole control, not merely the search input. Signal Forms uses this to mark touched. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisListboxOption` | `AerisListboxOptionContext` | `Label and description` | let-option, let-selected="selected", let-active="active". Decorative content only; no nested links, buttons or inputs. Keep the label represented in the content. |
| `aerisListboxGroup` | `AerisListboxGroupContext` | `Group label` | let-group is the group string. Keep the group name readable. |
| `aerisListboxEmpty` | `void` | `emptyMessage` | Custom content in the empty status region. |
| `aerisListboxLoading` | `void` | `loadingMessage` | Custom content in the loading status region. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `(options?: FocusOptions) =&gt; void` | `—` | Focus the list, preserving its active option. Does nothing when disabled. |

## Interfaces and types

### Interfaces

```ts
type AerisListboxSelectionMode = 'single' | 'multiple';
type AerisListboxValue = string | readonly string[] | null;

interface AerisListboxOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisListboxChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisListboxValue;
  readonly options: readonly AerisListboxOption[];
}

interface AerisListboxOptionContext {
  readonly $implicit: AerisListboxOption;
  readonly option: AerisListboxOption;
  readonly selected: boolean;
  readonly active: boolean;
}

interface AerisListboxGroupContext {
  readonly $implicit: string;
  readonly group: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-listbox-background` | `color` | `--aeris-surface` | Container background. |
| `--aeris-listbox-border` | `color` | `--aeris-border` | Container border. |
| `--aeris-listbox-radius` | `length` | `--aeris-radius-surface` | Container corners; options use the shared item radius. |
| `--aeris-listbox-padding` | `length` | `0.35rem` | List inset. |
| `--aeris-listbox-option-height` | `length` | `--aeris-item-height` | Minimum option height; content may grow. |
| `--aeris-listbox-selected-background` | `color` | `--aeris-primary-soft` | Selected background. |
| `--aeris-listbox-selected-color` | `color` | `--aeris-on-primary-soft` | Selected text color. |

## Examples

### Single selection

Click an option, or move focus with arrows and press Space or Enter. Disabled choices are skipped.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisListbox, type AerisListboxOption, type AerisListboxValue } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-basic-demo',
  imports: [AerisListbox],
  template: `
    <div class="listbox-demo">
      <aeris-listbox ariaLabel="Single selection" [options]="options" [(value)]="single" />
      <p>Selected: {{ single() || 'None' }}</p>
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxBasicDemo {
  protected readonly options: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
      { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
      { label: 'Research', value: 'research', description: 'Insights and discovery' },
      { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
    ];

  protected readonly single = signal<AerisListboxValue>('design');
}
```

### Multiple selection

Toggle independently without holding a modifier. Shift extends a range; Ctrl or Command + A toggles all enabled filtered options.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisListbox, type AerisListboxOption, type AerisListboxValue } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-multiple-demo',
  imports: [AerisListbox],
  template: `
    <div class="listbox-demo">
      <aeris-listbox
        ariaLabel="Multiple selection"
        selectionMode="multiple"
        [options]="options"
        [(value)]="multiple"
      />
      <p>Selected: {{ multiple() }}</p>
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxMultipleDemo {
  protected readonly options: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
      { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
      { label: 'Research', value: 'research', description: 'Insights and discovery' },
      { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
    ];

  protected readonly multiple = signal<AerisListboxValue>(['design']);
}
```

### Groups

A shared group string creates a labelled section. Groups retain their first-seen order.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisListbox, type AerisListboxOption } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-groups-demo',
  imports: [AerisListbox],
  template: `
    <div class="listbox-demo">
      <aeris-listbox ariaLabel="Grouped selection" [options]="groupedOptions" />
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxGroupsDemo {
  protected readonly groupedOptions: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', group: 'Product' },
      { label: 'Engineering', value: 'engineering', group: 'Product' },
      { label: 'Research', value: 'research', group: 'Discovery' },
      { label: 'Analytics', value: 'analytics', group: 'Discovery' },
    ];
}
```

### Templates

Customize option and group content while the component owns selection and accessibility. Keep templates non-interactive.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisListbox, type AerisListboxOption } from '@aeris-ui/core/listbox';
import { LucideDynamicIcon, LucidePalette } from '@lucide/angular';

@Component({
  selector: 'app-listbox-templates-demo',
  imports: [AerisListbox, LucideDynamicIcon],
  templateUrl: './listbox-templates.demo.html',
  styleUrl: './listbox-templates.demo.scss'
})
export class ListboxTemplatesDemo {
  protected readonly groupedOptions: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', group: 'Product' },
      { label: 'Engineering', value: 'engineering', group: 'Product' },
      { label: 'Research', value: 'research', group: 'Discovery' },
      { label: 'Analytics', value: 'analytics', group: 'Discovery' },
    ];

  protected readonly paletteIcon = LucidePalette;
}
```

#### HTML

```html
<div class="listbox-demo">
  <aeris-listbox ariaLabel="Templated selection" [options]="groupedOptions">
    <ng-template aerisListboxGroup let-group>
      <span>{{ group }} team</span>
    </ng-template>
    <ng-template aerisListboxOption let-option let-selected="selected">
      <span class="listbox-option">
        <svg [lucideIcon]="paletteIcon" aria-hidden="true"></svg>
        <span>{{ option.label }}</span>
        @if (selected) {
          <small>Selected</small>
        }
      </span>
    </ng-template>
  </aeris-listbox>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.listbox-demo {
  display: grid;
  gap: 1rem;
  inline-size: 100%;
  max-inline-size: 24rem;
  min-inline-size: 0;
}

.listbox-demo p {
  margin: 0;
  color: var(--aeris-text-2);
  overflow-wrap: anywhere;
}

.listbox-demo > button {
  justify-self: start;
}

.listbox-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-inline-size: 0;
}

.listbox-option svg {
  inline-size: var(--aeris-icon-size, 1rem);
  block-size: var(--aeris-icon-size, 1rem);
  flex: 0 0 auto;
}

.listbox-option small {
  margin-inline-start: auto;
}
```

### Filtering

Search labels, descriptions and groups. Hidden selected values remain selected; Arrow Down moves from the search field into the list.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisListbox, type AerisListboxOption } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-filter-demo',
  imports: [AerisListbox],
  template: `
    <div class="listbox-demo">
      <aeris-listbox
        ariaLabel="Filtered selection"
        selectionMode="multiple"
        [options]="groupedOptions"
        filter
        [value]="['design']"
      >
        <ng-template aerisListboxEmpty>No matching options.</ng-template>
      </aeris-listbox>
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxFilterDemo {
  protected readonly groupedOptions: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', group: 'Product' },
      { label: 'Engineering', value: 'engineering', group: 'Product' },
      { label: 'Research', value: 'research', group: 'Discovery' },
      { label: 'Analytics', value: 'analytics', group: 'Discovery' },
    ];
}
```

### States

Loading prevents selection while preserving results. Disabled controls leave the tab order; empty and loading content can be customized.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisListbox, type AerisListboxOption } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-states-demo',
  imports: [AerisButton, AerisListbox],
  templateUrl: './listbox-states.demo.html',
  styleUrl: './listbox-states.demo.scss'
})
export class ListboxStatesDemo {
  protected readonly options: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
      { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
      { label: 'Research', value: 'research', description: 'Insights and discovery' },
      { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
    ];

  protected readonly loading = signal(false);
}
```

#### HTML

```html
<div class="listbox-demo">
  <button aerisButton variant="outline" (click)="loading.set(!loading())">
    Toggle loading
  </button>
  <aeris-listbox ariaLabel="Loading selection" [options]="options" [loading]="loading()">
    <ng-template aerisListboxLoading>Fetching options…</ng-template>
  </aeris-listbox>
  <aeris-listbox
    ariaLabel="Disabled selection"
    [options]="options"
    disabled
    value="design"
  />
  <aeris-listbox ariaLabel="Empty selection" [options]="[]" />
</div>
```

#### CSS

```css
.listbox-demo {
  display: grid;
  gap: 1rem;
  inline-size: 100%;
  max-inline-size: 24rem;
  min-inline-size: 0;
}

.listbox-demo p {
  margin: 0;
  color: var(--aeris-text-2);
  overflow-wrap: anywhere;
}

.listbox-demo > button {
  justify-self: start;
}
```

### Controlled selection

Update the model externally and observe user selection events. Moving keyboard focus alone does not change the value.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisListbox, type AerisListboxChangeEvent, type AerisListboxOption, type AerisListboxValue } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-controlled-demo',
  imports: [AerisButton, AerisListbox],
  template: `
    <div class="listbox-demo">
      <button aerisButton variant="outline" (click)="controlled.set('research')">
        Select Research
      </button>
      <aeris-listbox
        #controlledList
        ariaLabel="Controlled selection"
        [options]="options"
        [(value)]="controlled"
        (changed)="recordChange($event)"
      />
      <button aerisButton variant="ghost" (click)="controlledList.focus()">Focus list</button>
      <p aria-live="polite">Last user selection: {{ lastChange() }}</p>
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxControlledDemo {
  protected readonly options: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
      { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
      { label: 'Research', value: 'research', description: 'Insights and discovery' },
      { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
    ];

  protected readonly controlled = signal<AerisListboxValue>('design');

  protected readonly lastChange = signal('No selection change');

  protected recordChange(event: AerisListboxChangeEvent): void {
      this.lastChange.set(event.options.map((option) => option.label).join(', ') || 'None');
    }
}
```

### Scrolling

A maximum height keeps long lists contained. Keyboard navigation scrolls only the list to reveal its active option. All options remain mounted.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisListbox, type AerisListboxOption } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-long-demo',
  imports: [AerisListbox],
  template: `
    <div class="listbox-demo">
      <aeris-listbox
        ariaLabel="Long selection"
        [options]="longOptions"
        scrollHeight="12rem"
      />
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxLongDemo {
  protected readonly longOptions: readonly AerisListboxOption[] = Array.from(
      { length: 60 },
      (_, index) => ({ value: `option-${index + 1}`, label: `Option ${index + 1}` }),
    );
}
```

### Signal Forms

Signal Forms forwards value, invalid, touched, required and disabled state. Errors stay hidden until touched.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisListbox, type AerisListboxOption, type AerisListboxValue } from '@aeris-ui/core/listbox';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { FormField, form, required } from '@angular/forms/signals';

@Component({
  selector: 'app-listbox-signal-forms-demo',
  imports: [AerisButton, AerisListbox, AerisMessageModule, FormField],
  templateUrl: './listbox-signal-forms.demo.html',
  styleUrl: './listbox-signal-forms.demo.scss'
})
export class ListboxSignalFormsDemo {
  protected readonly options: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
      { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
      { label: 'Research', value: 'research', description: 'Insights and discovery' },
      { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
    ];

  protected readonly selectionData = signal<{ choice: AerisListboxValue }>({ choice: null });

  protected readonly fields = form(this.selectionData, (schema) => required(schema.choice));

  protected readonly showError = computed(
      () => this.fields.choice().touched() && this.fields.choice().invalid(),
    );
}
```

#### HTML

```html
<div class="listbox-demo">
  <aeris-listbox
    ariaLabel="Required choice"
    [options]="options"
    [formField]="fields.choice"
    [ariaDescribedBy]="showError() ? 'listbox-error' : undefined"
  />
  <p>Selected: {{ selectionData().choice || 'None' }}</p>
  @if (showError()) {
    <aeris-message id="listbox-error" severity="danger">Choose an option.</aeris-message>
  }
  <button aerisButton variant="outline" (click)="fields.choice().markAsTouched()">
    Validate
  </button>
</div>
```

#### CSS

```css
.listbox-demo {
  display: grid;
  gap: 1rem;
  inline-size: 100%;
  max-inline-size: 24rem;
  min-inline-size: 0;
}

.listbox-demo p {
  margin: 0;
  color: var(--aeris-text-2);
  overflow-wrap: anywhere;
}

.listbox-demo > button {
  justify-self: start;
}
```

### Reactive Forms

Classic forms synchronize value, touched and disabled state through ControlValueAccessor.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisListbox, type AerisListboxOption, type AerisListboxValue } from '@aeris-ui/core/listbox';

@Component({
  selector: 'app-listbox-reactive-demo',
  imports: [AerisButton, AerisListbox, ReactiveFormsModule],
  template: `
    <div class="listbox-demo">
      <aeris-listbox
        ariaLabel="Reactive choices"
        selectionMode="multiple"
        [options]="options"
        [formControl]="reactive"
      />
      <p>Selected: {{ reactive.value }}</p>
      <button aerisButton variant="outline" (click)="reactive.reset([])">Reset</button>
    </div>
  `,
  styles: `
    .listbox-demo {
      display: grid;
      gap: 1rem;
      inline-size: 100%;
      max-inline-size: 24rem;
      min-inline-size: 0;
    }

    .listbox-demo p {
      margin: 0;
      color: var(--aeris-text-2);
      overflow-wrap: anywhere;
    }

    .listbox-demo > button {
      justify-self: start;
    }
  `
})
export class ListboxReactiveDemo {
  protected readonly options: readonly AerisListboxOption[] = [
      { label: 'Design', value: 'design', description: 'Interfaces and experiences' },
      { label: 'Engineering', value: 'engineering', description: 'Products and platforms' },
      { label: 'Research', value: 'research', description: 'Insights and discovery' },
      { label: 'Operations', value: 'operations', disabled: true, description: 'Unavailable' },
    ];

  protected readonly reactive = new FormControl<AerisListboxValue>(['design']);
}
```

## Accessibility

- Use ariaLabelledBy for a visible label or ariaLabel for an accessible name. The list is one focus stop using aria-activedescendant. Arrow movement changes the active option, not selection. Selected and active styling are distinct. Disabled options are skipped. Group labels and descriptions are associated automatically.
- Option templates must not contain interactive children: Listbox is a selection control, not a menu of actions. Loading is announced and blocks selection; empty content has a status region. Supply translated messages and filter labels as needed. Associate help and visible validation errors with ariaDescribedBy. Native form submission does not serialize this custom control: use Angular forms or your controlled value.
- In multiple mode, Shift range selection replaces enabled visible selections within the range while retaining hidden or disabled selections. Ctrl or Command + A toggles enabled filtered options only. Removing an option does not mutate the value; the application owns reconciliation. RTL preserves vertical Up/Down behavior. Motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Enter or leave the search field and list; selected option is the initial active target. |
| `Arrow Up / Down` | Move active focus, skipping disabled options and wrapping at the ends. Down from search focuses the list. |
| `Home / End` | Focus the first or last enabled option. |
| `Space / Enter` | Select the active option; multiple mode toggles it. |
| `Printable characters` | Typeahead focuses matching labels; repeated characters cycle matches. Search input retains normal text editing. |
| `Shift + arrows / Home / End; Shift + click` | Select a range in multiple mode. |
| `Ctrl / Command + A` | Toggle selection of enabled filtered options in multiple mode. |
