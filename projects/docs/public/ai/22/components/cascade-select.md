# CascadeSelect

> Hierarchical selection with cascading columns, templates, and Forms support.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/cascade-select`
- Human-readable documentation: [https://aeris-ui.dev/components/cascade-select](https://aeris-ui.dev/components/cascade-select)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string &#124; null (model)` | `null` | Selected option value with two-way binding and Forms support. |
| `options` | `readonly AerisCascadeSelectOption[]` | `[]` | Hierarchical option tree rendered by the cascading columns. |
| `inputId` | `string` | `generated` | ID assigned to the trigger button. |
| `name` | `string` | `''` | Native form field name submitted through a hidden input when a value is selected. |
| `placeholder` | `string` | `'Select an option'` | Text shown while no value is selected. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when no visible label is available. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of visible elements that label the trigger. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `clearButtonAriaLabel` | `string` | `'Clear value'` | Accessible name for the clear button. |
| `emptyMessage` | `string` | `'No options available'` | Message shown when the options tree is empty. |
| `size` | `AerisCascadeSelectSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisCascadeSelectAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `separator` | `string` | `' / '` | Text used between labels in the selected path. |
| `panelMaxHeight` | `string` | `'18rem'` | Maximum dropdown panel height. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `disabled` | `boolean` | `false` | Disables interaction and form submission. |
| `required` | `boolean` | `false` | Exposes required semantics to forms and assistive technology. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |
| `clearable` | `boolean` | `false` | Shows a clear action while a value exists. |
| `selectBranches` | `boolean` | `false` | Allows branch options with children to be selected instead of only opening the next level. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `string &#124; null` | `-` | Emitted automatically by the value model. |
| `changed` | `AerisCascadeSelectChangeEvent` | `-` | Emitted after selection or clearing changes the value. |
| `cleared` | `void` | `-` | Emitted after the clear action succeeds. |
| `opened` | `void` | `-` | Emitted when the panel opens. |
| `closed` | `void` | `-` | Emitted when the panel closes. |
| `focused` | `FocusEvent` | `-` | Emitted when the trigger receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when the trigger loses focus. |
| `touch` | `void` | `-` | Emitted on blur for touched-state integration. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the trigger button. |
| `openPanel()` | `void` | `-` | Opens the cascading panel and syncs the active path. |
| `closePanel()` | `void` | `-` | Closes the cascading panel. |
| `toggle()` | `void` | `-` | Toggles the panel. |
| `clear()` | `void` | `-` | Clears the selected value and restores focus. |
| `reset()` | `void` | `-` | Clears the value and closes the panel. |

### CascadeSelect templates

| Name | Context | Default | Description |
| --- | --- | --- | --- |
| aerisCascadeSelectOption | option, active, selected, level, hasChildren | label, description, chevron | Custom content for every option row. |
| aerisCascadeSelectEmpty | none | emptyMessage | Custom empty state content. |

## Interfaces and types

### Interfaces

```ts
type AerisCascadeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisCascadeSelectAppearance = 'outline' | 'filled';

interface AerisCascadeSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly children?: readonly AerisCascadeSelectOption[];
}

interface AerisCascadeSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: string | null;
  readonly option: AerisCascadeSelectOption | null;
  readonly path: readonly AerisCascadeSelectOption[];
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-cascade-select-background` | `CSS custom property` | `#fff` | Trigger background. |
| `--aeris-cascade-select-border` | `CSS custom property` | `#c7c9c0` | Trigger border color. |
| `--aeris-cascade-select-focus` | `CSS custom property` | `#536437` | Focus ring and active border color. |
| `--aeris-cascade-select-panel-background` | `CSS custom property` | `#fff` | Panel surface. |
| `--aeris-cascade-select-option-hover` | `CSS custom property` | `#f2f0ec` | Hover and active option background. |
| `--aeris-cascade-select-option-selected` | `CSS custom property` | `#e7eddc` | Selected option background. |
| `--aeris-cascade-select-option-selected-text` | `CSS custom property` | `#222222` | Selected option text. |

## Examples

### Basic

Select a leaf option from a hierarchical options tree.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCascadeSelect, type AerisCascadeSelectOption } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-basic-demo',
  imports: [AerisCascadeSelect],
  template: `
    <div class="field">
      <label for="cascade-basic-input">Location</label>
      <aeris-cascade-select
        inputId="cascade-basic-input"
        [options]="locations"
        placeholder="Choose a location"
        ariaDescribedby="cascade-basic-help"
        fluid
      />
      <small id="cascade-basic-help"
        >Open the panel, then move across the location hierarchy.</small
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
export class CascadeBasicBasicDemo {
  protected readonly locations: readonly AerisCascadeSelectOption[] = [
    {
      label: 'Europe',
      value: 'europe',
      children: [
        {
          label: 'Portugal',
          value: 'portugal',
          children: [
            { label: 'Lisbon', value: 'lisbon', description: 'Capital city' },
            { label: 'Porto', value: 'porto' },
          ],
        },
      ],
    },
  ];
}
```

### Signal value

Bind the selected value to a signal. The visible value shows the full selected path.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-signal-demo',
  imports: [AerisCascadeSelect],
  template: `
    <div class="field">
      <label for="cascade-signal-input">Office</label>
      <aeris-cascade-select
        inputId="cascade-signal-input"
        [(value)]="locationValue"
        [options]="locations"
        clearable
        fluid
      />
      <small aria-live="polite">Value: {{ locationValue() || 'Empty' }}</small>
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
export class CascadeSignalSignalValueDemo {
  protected readonly locationValue = signal<string | null>(null);
}
```

### Branch selection

By default branches open the next level. Enable selectBranches when branch records are valid values too.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-branches-demo',
  imports: [AerisCascadeSelect],
  template: `
    <div class="field">
      <label for="cascade-branches-input">Region or city</label>
      <aeris-cascade-select
        inputId="cascade-branches-input"
        [(value)]="branchValue"
        [options]="locations"
        selectBranches
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
export class CascadeBranchesBranchSelectionDemo {
}
```

### Templates

Use the option template to customize each row while preserving the same selection model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCascadeSelect, type AerisCascadeSelectOption } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-templates-demo',
  imports: [AerisCascadeSelect],
  templateUrl: './cascade-templates.demo.html',
  styleUrl: './cascade-templates.demo.scss'
})
export class CascadeTemplatesTemplatesDemo {
  protected readonly locations: readonly AerisCascadeSelectOption[] = [
    {
      label: 'Europe',
      value: 'europe',
      children: [
        {
          label: 'Portugal',
          value: 'portugal',
          children: [
            { label: 'Lisbon', value: 'lisbon', description: 'Capital city' },
            { label: 'Porto', value: 'porto' },
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
  <label for="cascade-template-input">Templated location</label>
  <aeris-cascade-select inputId="cascade-template-input" [options]="locations" fluid>
    <ng-template aerisCascadeSelectOption let-option let-level="level">
      <span class="cascade-option">
        <span class="cascade-option__mark" aria-hidden="true">{{ level + 1 }}</span>
        <span class="cascade-option__copy">
          <strong>{{ option.label }}</strong>
          <small>{{
            option.children?.length ? 'Open next level' : 'Select this value'
          }}</small>
        </span>
      </span>
    </ng-template>
  </aeris-cascade-select>
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

.cascade-option {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.cascade-option__mark {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 0.5rem;
  background: var(--primary-soft);
  color: var(--aeris-primary-text);
  font-size: 0.6875rem;
  font-weight: 800;
}

.cascade-option__copy {
  min-width: 0;
  display: grid;
}

.cascade-option__copy strong {
  font-size: 0.875rem;
}

.cascade-option__copy small {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}
```

### Clear button

Enable the clear action when an empty value is valid for the surrounding form.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-clear-demo',
  imports: [AerisCascadeSelect],
  template: `
    <div class="field">
      <label for="cascade-clear-input">Optional office</label>
      <aeris-cascade-select
        inputId="cascade-clear-input"
        value="lisbon"
        [options]="locations"
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
export class CascadeClearClearButtonDemo {
}
```

### Appearances and states

Filled, invalid, and disabled states preserve the same trigger and listbox semantics.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-states-demo',
  imports: [AerisCascadeSelect],
  templateUrl: './cascade-states.demo.html',
  styleUrl: './cascade-states.demo.scss'
})
export class CascadeStatesAppearancesAndStatesDemo {
  protected readonly invalidValue = signal<string | null>(null);
  protected readonly touched = signal(false);
  protected readonly invalid = computed(
    () => this.touched() && this.invalidValue() === null,
  );
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="cascade-filled-input">Filled</label>
    <aeris-cascade-select
      inputId="cascade-filled-input"
      [options]="locations"
      appearance="filled"
      fluid
    />
  </div>
  <div class="field">
    <label for="cascade-invalid-input">Invalid</label>
    <aeris-cascade-select
      inputId="cascade-invalid-input"
      [(value)]="invalidValue"
      [options]="locations"
      [invalid]="invalid()"
      required
      ariaDescribedby="cascade-invalid-message"
      (blurred)="touched.set(true)"
      fluid
    />
    <small id="cascade-invalid-message" [class.error]="invalid()" aria-live="polite">
      {{ invalid() ? 'Choose a location.' : 'Required.' }}
    </small>
  </div>
  <div class="field">
    <label for="cascade-disabled-input">Disabled</label>
    <aeris-cascade-select
      inputId="cascade-disabled-input"
      value="belgrade"
      [options]="locations"
      disabled
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

### Sizes

Four sizes align CascadeSelect with the Aeris form density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-sizes-demo',
  imports: [AerisCascadeSelect],
  template: `
    <div class="field-stack">
      <aeris-cascade-select size="xs" placeholder="Extra small" [options]="locations" />
      <aeris-cascade-select size="sm" placeholder="Small" [options]="locations" />
      <aeris-cascade-select size="md" placeholder="Medium" [options]="locations" />
      <aeris-cascade-select size="lg" placeholder="Large" [options]="locations" />
    </div>
  `,
  styles: `
    .field-stack {
      width: 100%;
      display: grid;
      gap: 1rem;
    }
  `
})
export class CascadeSizesSizesDemo {
}
```

### Reactive and template-driven forms

CascadeSelect implements ControlValueAccessor and works with Reactive Forms and template-driven forms.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisCascadeSelect } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-forms-demo',
  imports: [AerisCascadeSelect, FormsModule, ReactiveFormsModule],
  templateUrl: './cascade-forms.demo.html',
  styleUrl: './cascade-forms.demo.scss'
})
export class CascadeFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveLocation =
    new FormControl<string | null>('lisbon');

  protected templateLocation: string | null = 'belgrade';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="cascade-reactive-input">Reactive Forms</label>
    <aeris-cascade-select
      inputId="cascade-reactive-input"
      [options]="locations"
      [formControl]="reactiveLocation"
      fluid
    />
    <small>Value: {{ reactiveLocation.value }}</small>
  </div>
  <div class="field">
    <label for="cascade-template-form-input">Template-driven forms</label>
    <aeris-cascade-select
      inputId="cascade-template-form-input"
      name="templateLocation"
      [options]="locations"
      [(ngModel)]="templateLocation"
      fluid
    />
    <small>Value: {{ templateLocation }}</small>
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

### Events

Use changed when you need both the selected value and the full path metadata.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCascadeSelect, type AerisCascadeSelectChangeEvent } from '@aeris-ui/core/cascade-select';

@Component({
  selector: 'app-cascade-events-demo',
  imports: [AerisCascadeSelect],
  template: `
    <div class="field">
      <label for="cascade-events-input">Event location</label>
      <aeris-cascade-select
        inputId="cascade-events-input"
        [options]="locations"
        clearable
        fluid
        (changed)="recordChange($event)"
      />
      <small aria-live="polite">{{ lastEvent() }}</small>
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
export class CascadeEventsEventsDemo {
  protected readonly lastEvent = signal('No selection yet');

  protected recordChange(event: AerisCascadeSelectChangeEvent): void {
    const path = event.path.map((option) => option.label).join(' / ');
    this.lastEvent.set(path ? `Selected ${path}` : 'Selection cleared');
  }
}
```

## Accessibility

- The trigger uses role="combobox", aria-expanded, aria-controls, and aria-activedescendant.
- Each hierarchy column uses role="listbox"; each option uses role="option" and disabled options are skipped by keyboard movement.
- Branch options expose aria-expanded while their child column is active.
- Use a visible label with inputId, or provide ariaLabel when a visible label is not possible.
- Validation messages should be connected with ariaDescribedby and should not rely on color alone.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Opens the panel. When open, selects the active leaf option or opens the active branch. |
| `ArrowDown` | Opens the panel and moves to the next enabled option in the active column. |
| `ArrowUp` | Opens the panel and moves to the previous enabled option in the active column. |
| `ArrowRight` | Moves into the child column of the active branch. |
| `ArrowLeft` | Moves back to the parent column. |
| `Home` | Moves to the first enabled option in the active column. |
| `End` | Moves to the last enabled option in the active column. |
| `Escape` | Closes the panel without changing the value. |
| `Tab` | Moves focus away and closes the panel. |
