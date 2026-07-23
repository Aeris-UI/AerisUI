# InputText

> Single-line text input with validation, adornments, and Signal Forms support.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/input-text`
- Human-readable documentation: [https://aeris-ui.dev/components/input-text](https://aeris-ui.dev/components/input-text)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisInputText } from '@aeris-ui/core/input-text';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `AerisInputTextSize` | `'md'` | Sets the input height, padding, and font size. |
| `appearance` | `AerisInputTextAppearance` | `'outline'` | Selects an outlined or filled surface treatment. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Expands the native input to fill its available inline space. |

### Component Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Text value with two-way binding and Signal Forms compatibility. |
| `inputId` | `string` | `generated` | ID assigned to the internal native input. |
| `type` | `string` | `'text'` | Native input type. |
| `name` | `string` | `''` | Native input name. |
| `placeholder` | `string` | `''` | Native placeholder text. |
| `autocomplete` | `string` | `'off'` | Native autocomplete hint. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when no visible label is associated. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of elements that label the input. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help or validation messages. |
| `size` | `AerisInputTextSize` | `'md'` | Sets the input height, padding, and font size. |
| `appearance` | `AerisInputTextAppearance` | `'outline'` | Selects an outlined or filled surface treatment. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Expands the native input to fill its available inline space. |
| `disabled` | `boolean` | `false` | Disables the input and clear action. |
| `readonly` | `boolean` | `false` | Allows focus and selection without editing. |
| `required` | `boolean` | `false` | Exposes native required semantics. |
| `clearable` | `boolean` | `false` | Shows an inline clear button while a value is present. |
| `clearButtonAriaLabel` | `string` | `'Clear value'` | Accessible name for the clear button. |

### InputText native API

| Category | Examples | Behavior |
| --- | --- | --- |
| Attributes | type, value, name, placeholder, autocomplete | Forwarded directly because InputText is applied to the native element. |
| State | disabled, readonly, required, minlength, maxlength | Uses native browser and form semantics. |
| Events | input, change, focus, blur, keydown | Bind native DOM events without library-specific emitters. |

## Interfaces and types

### Interfaces

```ts
type AerisInputTextSize = 'xs' | 'sm' | 'md' | 'lg';

type AerisInputTextAppearance = 'outline' | 'filled';

// Deprecated compatibility alias
type AerisControlSize = AerisInputTextSize;
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium input height and density baseline. |
| `--aeris-radius-sm` | `CSS custom property` | — | Input corner radius. |
| `--aeris-surface` | `CSS custom property` | — | Outlined input background. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled and read-only background. |
| `--aeris-border-strong` | `CSS custom property` | — | Default input border. |
| `--aeris-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border and focus ring. |

## Examples

### Basic

Associate every input with a visible label and use native attributes normally.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-basic-demo',
  imports: [AerisInputText],
  template: `
    <div class="field">
      <label for="basic-email">Email address</label>
      <input
        id="basic-email"
        aerisInputText
        type="email"
        placeholder="you@example.com"
        aria-describedby="basic-email-help"
      />
      <small id="basic-email-help">Used only for account notifications.</small>
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
export class InputBasicBasicDemo {
}
```

### Input types

The directive supports applicable native single-line input types without changing browser behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-types-demo',
  imports: [AerisInputText],
  templateUrl: './input-types.demo.html',
  styleUrl: './input-types.demo.scss'
})
export class InputTypesInputTypesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="input-text-type">Text</label>
    <input
      id="input-text-type"
      aerisInputText
      type="text"
      placeholder="Project name"
    />
  </div>
  <div class="field">
    <label for="input-email-type">Email</label>
    <input
      id="input-email-type"
      aerisInputText
      type="email"
      placeholder="team@example.com"
    />
  </div>
  <div class="field">
    <label for="input-search-type">Search</label>
    <input
      id="input-search-type"
      aerisInputText
      type="search"
      placeholder="Search projects"
    />
  </div>
  <div class="field">
    <label for="input-url-type">URL</label>
    <input
      id="input-url-type"
      aerisInputText
      type="url"
      placeholder="https://example.com"
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

Four sizes align InputText with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-sizes-demo',
  imports: [AerisInputText],
  templateUrl: './input-sizes.demo.html',
  styleUrl: './input-sizes.demo.scss'
})
export class InputSizesSizesDemo {
}
```

#### HTML

```html
<div class="field-row">
  <label class="size-sample">
    <span>Extra small</span>
    <input aerisInputText size="xs" value="Extra small" />
  </label>
  <label class="size-sample">
    <span>Small</span>
    <input aerisInputText size="sm" value="Small" />
  </label>
  <label class="size-sample">
    <span>Medium</span>
    <input aerisInputText value="Medium" />
  </label>
  <label class="size-sample">
    <span>Large</span>
    <input aerisInputText size="lg" value="Large" />
  </label>
</div>
```

#### CSS

```css
.field-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
}

.size-sample {
  display: grid;
  gap: 0.4rem;
}

.size-sample span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .field-row {
    align-items: stretch;
  }

  .size-sample,
  .field-row > input {
    width: 100%;
  }
}
```

### Appearances

Choose a crisp outline or a quieter filled surface while retaining the same focus treatment.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-appearances-demo',
  imports: [AerisInputText],
  templateUrl: './input-appearances.demo.html',
  styleUrl: './input-appearances.demo.scss'
})
export class InputAppearancesAppearancesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="input-outline">Outline</label>
    <input id="input-outline" aerisInputText fluid placeholder="Outline input" />
  </div>
  <div class="field">
    <label for="input-filled">Filled</label>
    <input
      id="input-filled"
      aerisInputText
      appearance="filled"
      fluid
      placeholder="Filled input"
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

### Disabled and read-only

Use native attributes so browser semantics, form submission, and assistive technology behavior remain correct.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-states-demo',
  imports: [AerisInputText],
  template: `
    <div class="field-grid">
      <div class="field">
        <label for="input-disabled">Disabled</label>
        <input id="input-disabled" aerisInputText fluid value="Unavailable" disabled />
      </div>
      <div class="field">
        <label for="input-readonly">Read-only</label>
        <input id="input-readonly" aerisInputText fluid value="AERIS-1042" readonly />
      </div>
    </div>
  `,
  styles: `
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
  `
})
export class InputStatesDisabledAndReadOnlyDemo {
}
```

### Validation

The invalid input synchronizes visual state with aria-invalid. Connect concise error text with aria-describedby.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-validation-demo',
  imports: [AerisInputText],
  templateUrl: './input-validation.demo.html',
  styleUrl: './input-validation.demo.scss'
})
export class InputValidationValidationDemo {
  protected readonly email = signal('alex@');
  protected readonly emailTouched = signal(false);
  protected readonly emailInvalid = computed(
    () =>
      this.emailTouched() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()),
  );
}
```

#### HTML

```html
<div class="field">
  <label for="validation-email">Work email</label>
  <input
    id="validation-email"
    aerisInputText
    type="email"
    fluid
    [value]="email()"
    [invalid]="emailInvalid()"
    aria-describedby="validation-email-error"
    (input)="updateEmail($event)"
    (blur)="emailTouched.set(true)"
  />
  <small id="validation-email-error" class="error" aria-live="polite">
    {{
      emailInvalid()
        ? 'Enter a complete email address.'
        : 'Use your organization email address.'
    }}
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

.field small.error {
  color: var(--aeris-danger);
}
```

### Fluid layout

Fluid inputs fill their parent and naturally adapt to narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-fluid-demo',
  imports: [AerisInputText],
  template: `
    <div class="field">
      <label for="input-fluid-example">Workspace name</label>
      <input id="input-fluid-example" aerisInputText fluid placeholder="aeris-design" />
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
export class InputFluidFluidLayoutDemo {
}
```

### Icons and affixes

Compose decorative icons and actions around the native input. Focus-within keeps the group visually unified.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { LucideDynamicIcon, LucideSearch, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-input-affixes-demo',
  imports: [AerisButton, AerisInputText, LucideDynamicIcon],
  templateUrl: './input-affixes.demo.html',
  styleUrl: './input-affixes.demo.scss'
})
export class InputAffixesIconsAndAffixesDemo {

  protected readonly icons = { Search: LucideSearch, X: LucideX };
}
```

#### HTML

```html
<div class="field">
  <label for="project-search">Search projects</label>
  <span class="input-affix">
    <svg [lucideIcon]="icons.Search"></svg>
    <input
      #searchInput
      id="project-search"
      aerisInputText
      type="search"
      placeholder="Search by name"
    />
    <button
      aerisButton
      variant="ghost"
      size="sm"
      iconOnly
      type="button"
      aria-label="Clear search"
      (click)="clearSearch(searchInput)"
    >
      <svg [lucideIcon]="icons.X"></svg>
    </button>
  </span>
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

.input-affix {
  display: flex;
  align-items: center;
  border: 1px solid var(--aeris-border-strong);
  border-radius: var(--aeris-radius-sm);
}

.input-affix:focus-within {
  border-color: var(--aeris-focus);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--aeris-focus) 18%, transparent);
}

.input-affix input {
  width: 100%;
  border: 0;
  background: transparent;
  box-shadow: none;
}
```

### Signal state

Native input events update signal state directly without a wrapper component or additional value accessor.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-signals-demo',
  imports: [AerisInputText],
  template: `
    <div class="field">
      <label for="signal-name">Display name</label>
      <input
        id="signal-name"
        aerisInputText
        fluid
        [value]="name()"
        (input)="updateName($event)"
      />
      <small aria-live="polite">Current value: {{ name() || 'Empty' }}</small>
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
export class InputSignalsSignalStateDemo {
  protected readonly name = signal('');

  protected updateName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }
}
```

### Clear button

The wrapper component adds an accessible suffix button that clears the value and restores focus to the input.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-clearable-demo',
  imports: [AerisInputText],
  template: `
    <div class="field">
      <label for="clearable-search">Search components</label>
      <aeris-input-text
        inputId="clearable-search"
        type="search"
        placeholder="Search components"
        clearable
        fluid
        [(value)]="search"
      />
      <small aria-live="polite">Current value: {{ search() || 'Empty' }}</small>
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
export class InputClearableClearButtonDemo {
}
```

### Reactive and template-driven forms

The native directive uses Angular's built-in value accessor. The wrapper component provides its own ControlValueAccessor for formControl and ngModel.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-input-angular-forms-demo',
  imports: [AerisInputText, FormsModule, ReactiveFormsModule],
  templateUrl: './input-angular-forms.demo.html',
  styleUrl: './input-angular-forms.demo.scss'
})
export class InputAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveText =
    new FormControl('Reactive value');

  protected templateText = 'Template value';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-text">Reactive Forms</label>
    <input id="reactive-text" aerisInputText fluid [formControl]="reactiveText" />
    <small>Value: {{ reactiveText.value || 'Empty' }}</small>
  </div>
  <div class="field">
    <label for="template-text">Template-driven forms</label>
    <aeris-input-text
      inputId="template-text"
      name="templateText"
      fluid
      [(ngModel)]="templateText"
    />
    <small>Value: {{ templateText || 'Empty' }}</small>
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

- InputText preserves native input semantics, keyboard behavior, autofill, selection, and form submission.
- Provide a visible label associated through matching for and id values.
- Use aria-describedby to connect help or validation text. Avoid placeholder-only labels.
- The invalid input automatically exposes aria-invalid="true".
- Prefer native disabled, readonly, required, and autocomplete attributes.
- Decorative icons are hidden from assistive technology. Interactive affixes require an accessible name and visible focus.
- The clear button has a configurable accessible name, appears only when usable, and returns focus to the input after clearing.
- Both the native directive and wrapper support Reactive Forms and template-driven forms; the wrapper also remains compatible with Angular 22 Signal Forms.
- Focus indicators meet the WCAG 2.2 focus appearance target and transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the input and any clear action. |
| `Arrow Left / Arrow Right` | Moves the text caret through the value. |
| `Home / End` | Moves the caret to the start or end of the value. |
| `Backspace / Delete` | Removes selected text or the character beside the caret. |
| `Ctrl / Command + A` | Selects the complete value using native platform behavior. |
| `Enter / Space` | Activates the clear button when that button is focused. |
