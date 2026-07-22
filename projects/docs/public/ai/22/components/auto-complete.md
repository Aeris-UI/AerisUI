# AutoComplete

> Text input with keyboard-first suggestions, filtering, grouping, and templates.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/auto-complete`
- Human-readable documentation: [https://aeris-ui.dev/components/auto-complete](https://aeris-ui.dev/components/auto-complete)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Current text value with two-way binding and Forms support. |
| `suggestions` | `readonly AerisAutoCompleteOption[]` | `[]` | Suggestion records used by local filtering and option rendering. |
| `inputId` | `string` | `generated` | ID assigned to the internal text input. |
| `name` | `string` | `''` | Native form field name submitted through a hidden input. |
| `placeholder` | `string` | `''` | Placeholder text shown while the value is empty. |
| `autocomplete` | `string` | `'off'` | Native browser autocomplete hint for the input. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when no visible label is available. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of visible elements that label the input. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `listboxAriaLabel` | `string` | `'Suggestions'` | Accessible name for the suggestion listbox. |
| `dropdownAriaLabel` | `string` | `'Show suggestions'` | Accessible name for the optional dropdown trigger. |
| `clearButtonAriaLabel` | `string` | `'Clear value'` | Accessible name for the clear button. |
| `emptyMessage` | `string` | `'No suggestions found'` | Message shown when filtering returns no enabled suggestions. |
| `loadingMessage` | `string` | `'Loading suggestions'` | Message shown while loading is true. |
| `size` | `AerisAutoCompleteSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisAutoCompleteAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `filterMatchMode` | `AerisAutoCompleteFilterMatchMode` | `'contains'` | Local filtering strategy applied to label, value, description, and group. |
| `minLength` | `number` | `1` | Minimum query length before suggestions are shown unless completeOnFocus is enabled. |
| `panelMaxHeight` | `string` | `'16rem'` | Maximum dropdown panel height. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `disabled` | `boolean` | `false` | Disables interaction and form submission. |
| `readonly` | `boolean` | `false` | Allows reading the value without editing. |
| `required` | `boolean` | `false` | Exposes required semantics to forms and assistive technology. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |
| `clearable` | `boolean` | `false` | Shows a clear action while a value exists. |
| `dropdown` | `boolean` | `false` | Shows a suffix button that opens and closes the suggestion panel. |
| `completeOnFocus` | `boolean` | `false` | Opens suggestions when the input receives focus. |
| `forceSelection` | `boolean` | `false` | Clears unmatched text on blur unless it matches a suggestion label or value. |
| `autoHighlight` | `boolean` | `true` | Highlights the first enabled suggestion when the panel opens. |
| `grouped` | `boolean` | `false` | Groups suggestions by the option group property. |
| `loading` | `boolean` | `false` | Shows the loading message or template instead of suggestions. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `string` | `-` | Emitted automatically by the value model. |
| `valueInput` | `string` | `-` | Emitted when user input changes the text value. |
| `completed` | `AerisAutoCompleteCompleteEvent` | `-` | Emitted when a query should be completed by local or remote suggestions. |
| `selected` | `AerisAutoCompleteSelectEvent` | `-` | Emitted after the user selects a suggestion. |
| `cleared` | `void` | `-` | Emitted after the clear action succeeds. |
| `opened` | `void` | `-` | Emitted when the suggestion panel opens. |
| `closed` | `void` | `-` | Emitted when the suggestion panel closes. |
| `focused` | `FocusEvent` | `-` | Emitted when the input receives focus. |
| `blurred` | `FocusEvent` | `-` | Emitted when the input loses focus. |
| `touch` | `void` | `-` | Emitted on blur for touched-state integration. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the internal text input. |
| `openPanel(event?)` | `void` | `-` | Opens the suggestion panel and emits completed. |
| `closePanel()` | `void` | `-` | Closes the suggestion panel. |
| `togglePanel(event)` | `void` | `-` | Toggles the suggestion panel from a user event. |
| `clear()` | `void` | `-` | Clears the value and restores focus. |
| `reset()` | `void` | `-` | Clears the value and closes the panel. |

### AutoComplete templates

| Name | Context | Default | Description |
| --- | --- | --- | --- |
| aerisAutoCompleteOption | option, selected, active | label and description | Custom suggestion option content. |
| aerisAutoCompleteGroup | group | group label | Custom group header content. |
| aerisAutoCompleteEmpty | none | emptyMessage | Custom empty state content. |
| aerisAutoCompleteLoading | none | loadingMessage | Custom loading state content. |

## Interfaces and types

### Interfaces

```ts
type AerisAutoCompleteSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisAutoCompleteAppearance = 'outline' | 'filled';
type AerisAutoCompleteFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals';

interface AerisAutoCompleteOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
  readonly description?: string;
  readonly group?: string;
}

interface AerisAutoCompleteCompleteEvent {
  readonly originalEvent: Event;
  readonly query: string;
}

interface AerisAutoCompleteSelectEvent {
  readonly originalEvent: Event;
  readonly value: string;
  readonly option: AerisAutoCompleteOption;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-auto-complete-background` | `CSS custom property` | `#fff` | Input background. |
| `--aeris-auto-complete-border` | `CSS custom property` | `#c7c9c0` | Input border color. |
| `--aeris-auto-complete-focus` | `CSS custom property` | `#536437` | Focus ring and active border color. |
| `--aeris-auto-complete-panel-background` | `CSS custom property` | `#fff` | Suggestion panel surface. |
| `--aeris-auto-complete-option-hover` | `CSS custom property` | `#f2f0ec` | Hover and active option background. |
| `--aeris-auto-complete-option-selected` | `CSS custom property` | `#e7eddc` | Selected option background. |
| `--aeris-auto-complete-option-selected-text` | `CSS custom property` | `#222222` | Selected option text. |

## Examples

### Basic

Pass suggestions and connect the input to a visible label.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete, type AerisAutoCompleteOption } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-basic-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-basic-input">Framework</label>
      <aeris-auto-complete
        inputId="autocomplete-basic-input"
        [suggestions]="frameworks"
        placeholder="Start typing a framework"
        ariaDescribedby="autocomplete-basic-help"
        fluid
      />
      <small id="autocomplete-basic-help">Try typing “an” or “vue”.</small>
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
export class AutocompleteBasicBasicDemo {
  protected readonly frameworks: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular' },
    { label: 'Astro', value: 'Astro' },
    { label: 'Next.js', value: 'Next.js' },
    { label: 'Nuxt', value: 'Nuxt' },
    { label: 'SvelteKit', value: 'SvelteKit' },
    { label: 'Vue', value: 'Vue' },
  ];
}
```

### Signal value

Bind the value model to a signal when the surrounding component owns the state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-signal-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-signal-input">Selected framework</label>
      <aeris-auto-complete
        inputId="autocomplete-signal-input"
        [(value)]="frameworkValue"
        [suggestions]="frameworks"
        clearable
        fluid
      />
      <small aria-live="polite">Value: {{ frameworkValue() || 'Empty' }}</small>
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
export class AutocompleteSignalSignalValueDemo {
  protected readonly frameworkValue = signal('');
}
```

### Dropdown trigger

Use dropdown with completeOnFocus when users should be able to browse all suggestions before typing.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-dropdown-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-dropdown-input">Skill</label>
      <aeris-auto-complete
        inputId="autocomplete-dropdown-input"
        [suggestions]="frameworks"
        dropdown
        completeOnFocus
        placeholder="Browse or type"
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
export class AutocompleteDropdownDropdownTriggerDemo {
}
```

### Force selection

Force selection clears unmatched text on blur so the value always comes from the suggestion list.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-force-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-force-input">Required skill</label>
      <aeris-auto-complete
        inputId="autocomplete-force-input"
        [(value)]="forcedValue"
        [suggestions]="frameworks"
        forceSelection
        dropdown
        completeOnFocus
        fluid
      />
      <small>Type a value that is not in the list and leave the field.</small>
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
export class AutocompleteForceForceSelectionDemo {
}
```

### Grouped suggestions

Group labels come from the option group property and remain separate from selectable options.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete, type AerisAutoCompleteOption } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-groups-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-groups-input">Capability</label>
      <aeris-auto-complete
        inputId="autocomplete-groups-input"
        [suggestions]="skills"
        grouped
        dropdown
        completeOnFocus
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
export class AutocompleteGroupsGroupedSuggestionsDemo {
  protected readonly skills: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular', group: 'Frontend' },
    { label: 'TypeScript', value: 'TypeScript', group: 'Frontend' },
    { label: 'Node.js', value: 'Node.js', group: 'Backend' },
    { label: 'Accessibility', value: 'Accessibility', group: 'Quality' },
  ];
}
```

### Option descriptions

Descriptions are optional and should only be used when extra context improves selection.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete, type AerisAutoCompleteOption } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-description-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-description-input">Topic</label>
      <aeris-auto-complete
        inputId="autocomplete-description-input"
        [suggestions]="describedOptions"
        dropdown
        completeOnFocus
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
export class AutocompleteDescriptionOptionDescriptionsDemo {
  protected readonly describedOptions: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular', description: 'Application framework' },
    { label: 'TypeScript', value: 'TypeScript', description: 'Typed JavaScript' },
    { label: 'A11y', value: 'A11y', description: 'Accessible product work' },
  ];
}
```

### Templates

Customize option and group content without changing the value contract.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete, type AerisAutoCompleteOption } from '@aeris-ui/core/auto-complete';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';

@Component({
  selector: 'app-autocomplete-templates-demo',
  imports: [AerisAutoComplete, AerisAvatarModule],
  templateUrl: './autocomplete-templates.demo.html',
  styleUrl: './autocomplete-templates.demo.scss'
})
export class AutocompleteTemplatesTemplatesDemo {
  protected readonly skills: readonly AerisAutoCompleteOption[] = [
    { label: 'Angular', value: 'Angular', group: 'Frontend' },
    { label: 'TypeScript', value: 'TypeScript', group: 'Frontend' },
    { label: 'Node.js', value: 'Node.js', group: 'Backend' },
    { label: 'Accessibility', value: 'Accessibility', group: 'Quality' },
  ];
}
```

#### HTML

```html
<div class="field">
  <label for="autocomplete-template-input">Specialist</label>
  <aeris-auto-complete
    inputId="autocomplete-template-input"
    [(value)]="skillValue"
    [suggestions]="skills"
    grouped
    dropdown
    completeOnFocus
    fluid
  >
    <ng-template aerisAutoCompleteGroup let-group="group">
      {{ group }} skills
    </ng-template>
    <ng-template aerisAutoCompleteOption let-option>
      <span class="option-template">
        <aeris-avatar
          [label]="option.label.slice(0, 2).toUpperCase()"
          size="sm"
          tone="info"
          decorative
        />
        <span class="option-copy">
          <strong>{{ option.label }}</strong>
          <small>{{ option.group }}</small>
        </span>
      </span>
    </ng-template>
  </aeris-auto-complete>
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

.option-template,
.selected-note {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.option-copy {
  min-width: 0;
  display: grid;
}

.option-copy strong {
  font-size: 0.875rem;
}

.option-copy small {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}
```

### Clear button

Clearable controls place the clear action inside the field before the optional dropdown button.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-clear-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-clear-input">Optional framework</label>
      <aeris-auto-complete
        inputId="autocomplete-clear-input"
        value="Angular"
        [suggestions]="frameworks"
        clearable
        dropdown
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
export class AutocompleteClearClearButtonDemo {
}
```

### Appearances and states

Filled, invalid, read-only, and disabled states keep the same keyboard and form semantics.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-states-demo',
  imports: [AerisAutoComplete],
  templateUrl: './autocomplete-states.demo.html',
  styleUrl: './autocomplete-states.demo.scss'
})
export class AutocompleteStatesAppearancesAndStatesDemo {
  protected readonly invalidValue = signal('');
  protected readonly touched = signal(false);
  protected readonly invalid = computed(
    () => this.touched() && this.invalidValue().trim().length === 0,
  );
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="autocomplete-filled-input">Filled</label>
    <aeris-auto-complete
      inputId="autocomplete-filled-input"
      [suggestions]="frameworks"
      appearance="filled"
      placeholder="Filled"
      fluid
    />
  </div>
  <div class="field">
    <label for="autocomplete-invalid-input">Invalid</label>
    <aeris-auto-complete
      inputId="autocomplete-invalid-input"
      [(value)]="invalidValue"
      [suggestions]="frameworks"
      [invalid]="invalid()"
      required
      clearable
      ariaDescribedby="autocomplete-invalid-message"
      (blurred)="touched.set(true)"
      fluid
    />
    <small
      id="autocomplete-invalid-message"
      [class.error]="invalid()"
      aria-live="polite"
    >
      {{ invalid() ? 'Choose a framework.' : 'Required.' }}
    </small>
  </div>
  <div class="field">
    <label for="autocomplete-readonly-input">Read-only</label>
    <aeris-auto-complete
      inputId="autocomplete-readonly-input"
      value="Angular"
      [suggestions]="frameworks"
      readonly
      fluid
    />
  </div>
  <div class="field">
    <label for="autocomplete-disabled-input">Disabled</label>
    <aeris-auto-complete
      inputId="autocomplete-disabled-input"
      value="Vue"
      [suggestions]="frameworks"
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

Four sizes align AutoComplete with the Aeris form density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-sizes-demo',
  imports: [AerisAutoComplete],
  templateUrl: './autocomplete-sizes.demo.html',
  styleUrl: './autocomplete-sizes.demo.scss'
})
export class AutocompleteSizesSizesDemo {
}
```

#### HTML

```html
<div class="field-stack">
  <aeris-auto-complete
    size="xs"
    placeholder="Extra small"
    [suggestions]="frameworks"
    dropdown
  />
  <aeris-auto-complete
    size="sm"
    placeholder="Small"
    [suggestions]="frameworks"
    dropdown
  />
  <aeris-auto-complete
    size="md"
    placeholder="Medium"
    [suggestions]="frameworks"
    dropdown
  />
  <aeris-auto-complete
    size="lg"
    placeholder="Large"
    [suggestions]="frameworks"
    dropdown
  />
</div>
```

#### CSS

```css
.field-stack {
  width: 100%;
  display: grid;
  gap: 1rem;
}
```

### Reactive and template-driven forms

AutoComplete implements ControlValueAccessor and works with Reactive Forms and template-driven forms.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisAutoComplete } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-forms-demo',
  imports: [AerisAutoComplete, FormsModule, ReactiveFormsModule],
  templateUrl: './autocomplete-forms.demo.html',
  styleUrl: './autocomplete-forms.demo.scss'
})
export class AutocompleteFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveSkill = new FormControl('Angular');
  protected templateSkill = 'TypeScript';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="autocomplete-reactive-input">Reactive Forms</label>
    <aeris-auto-complete
      inputId="autocomplete-reactive-input"
      [suggestions]="skills"
      [formControl]="reactiveSkill"
      fluid
    />
    <small>Value: {{ reactiveSkill.value }}</small>
  </div>
  <div class="field">
    <label for="autocomplete-template-form-input">Template-driven forms</label>
    <aeris-auto-complete
      inputId="autocomplete-template-form-input"
      name="templateSkill"
      [suggestions]="skills"
      [(ngModel)]="templateSkill"
      fluid
    />
    <small>Value: {{ templateSkill }}</small>
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

Use completed for remote search and selected for committed option selection.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAutoComplete, type AerisAutoCompleteCompleteEvent, type AerisAutoCompleteSelectEvent } from '@aeris-ui/core/auto-complete';

@Component({
  selector: 'app-autocomplete-events-demo',
  imports: [AerisAutoComplete],
  template: `
    <div class="field">
      <label for="autocomplete-events-input">Search event</label>
      <aeris-auto-complete
        inputId="autocomplete-events-input"
        [suggestions]="frameworks"
        dropdown
        clearable
        fluid
        (completed)="recordComplete($event)"
        (selected)="recordSelection($event)"
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
export class AutocompleteEventsEventsDemo {
  protected readonly lastEvent = signal('No selection yet');

  protected recordComplete(event: AerisAutoCompleteCompleteEvent): void {
    this.lastEvent.set(`Searching for "${event.query}"`);
  }

  protected recordSelection(event: AerisAutoCompleteSelectEvent): void {
    this.lastEvent.set(`Selected ${event.option.label}`);
  }
}
```

## Accessibility

- The input uses role="combobox", aria-expanded, aria-controls, and aria-activedescendant while the panel uses role="listbox".
- Suggestions expose role="option" and aria-selected; disabled suggestions are skipped by keyboard navigation.
- Use a visible label with inputId, or provide ariaLabel when a visible label is not possible.
- Validation messages should be connected with ariaDescribedby and updated with live-region text when the error changes.
- Reduced motion preferences are respected by removing transition timing from the control.

### Keyboard support

| Key | Function |
| --- | --- |
| `ArrowDown` | Opens the panel and moves to the next enabled suggestion. |
| `ArrowUp` | Opens the panel and moves to the previous enabled suggestion. |
| `Home` | Moves to the first enabled suggestion while the panel is open. |
| `End` | Moves to the last enabled suggestion while the panel is open. |
| `Enter` | Selects the active suggestion. |
| `Escape` | Closes the suggestion panel without changing the value. |
| `Tab` | Moves focus away and closes the suggestion panel. |
