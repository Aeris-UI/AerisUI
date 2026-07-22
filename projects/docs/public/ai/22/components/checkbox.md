# Checkbox

> Binary and mixed-state selection with native form semantics.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/checkbox`
- Human-readable documentation: [https://aeris-ui.dev/components/checkbox](https://aeris-ui.dev/components/checkbox)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean (model)` | `false` | Boolean selection state and Angular Signal Forms checkbox contract. |
| `indeterminate` | `boolean (model)` | `false` | Mixed visual and native state. User activation clears it. |
| `inputId` | `string` | `generated` | ID assigned to the native checkbox. |
| `name` | `string` | `''` | Native form field name. |
| `value` | `string` | `'on'` | Value submitted by a native form when checked. |
| `label` | `string` | `''` | Optional text label. Projected label content is also supported. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name for a checkbox without visible label content. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of external labeling elements. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `size` | `AerisCheckboxSize` | `'md'` | Control and label size. |
| `labelPosition` | `AerisCheckboxLabelPosition` | `'end'` | Places the visible label before or after the control. |
| `tabIndex` | `number` | `0` | Native tab order value for composite widgets that manage focus. |
| `disabled` | `boolean` | `false` | Disables native interaction and form submission. |
| `required` | `boolean` | `false` | Exposes native required validation semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |

### Checkbox outputs

| Name | Type | Description |
| --- | --- | --- |
| checkedChange | boolean | Emitted automatically by the checked model. |
| indeterminateChange | boolean | Emitted automatically by the indeterminate model. |
| checkedInput | boolean | Emitted when user or public method interaction changes checked state. |
| changed | AerisCheckboxChangeEvent | Native event, checked state, mixed state, and submitted value. |
| focused | FocusEvent | Emitted when the native checkbox receives focus. |
| blurred | FocusEvent | Emitted when the native checkbox loses focus. |
| touch | void | Emitted on blur for Angular Signal Forms. |

### Checkbox methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the native checkbox. |
| toggle | () =&gt; void | Toggles an enabled checkbox and clears mixed state. |
| reset | () =&gt; void | Clears checked and indeterminate state. |

## Interfaces and types

### Interfaces

```ts
type AerisCheckboxSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisCheckboxLabelPosition = 'start' | 'end';

interface AerisCheckboxChangeEvent {
  readonly originalEvent: Event;
  readonly checked: boolean;
  readonly indeterminate: boolean;
  readonly value: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-primary` | `CSS custom property` | — | Selected and mixed control background. |
| `--aeris-on-primary` | `CSS custom property` | — | Selected icon color. |
| `--aeris-border-strong` | `CSS custom property` | — | Unchecked border. |
| `--aeris-surface` | `CSS custom property` | — | Unchecked background. |
| `--aeris-radius-sm` | `CSS custom property` | — | Control corner radius foundation. |
| `--aeris-focus` | `CSS custom property` | — | Visible keyboard focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border and focus ring. |

## Examples

### Basic

Projected content creates a native clickable label around the checkbox.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-basic-demo',
  imports: [AerisCheckbox],
  template: `
    <div>
      <aeris-checkbox>Remember this device</aeris-checkbox>
    </div>
  `
})
export class CheckboxBasicBasicDemo {
}
```

### Signal model

Use two-way binding for local state and the typed changed output when event details are needed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-model-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="checkbox-stack">
      <aeris-checkbox
        value="notifications"
        [(checked)]="notifications"
        (changed)="recordChange($event)"
      >
        Product notifications
      </aeris-checkbox>
      <span class="checkbox-result" aria-live="polite">
        Checked: {{ notifications() }}. Last change: {{ lastChange() }}.
      </span>
    </div>
  `,
  styles: `
    .checkbox-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }
    
    .checkbox-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }
  `
})
export class CheckboxModelSignalModelDemo {
  protected readonly notifications = signal(true);
}
```

### Indeterminate

Mixed state represents partial selection. Activating it clears mixed state and selects or clears the set.

#### TS

```ts
import { Component, computed } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-indeterminate-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="checkbox-stack">
      <aeris-checkbox
        [checked]="allSelected()"
        [indeterminate]="partiallySelected()"
        (checkedChange)="setAll($event)"
      >
        Select all interests
      </aeris-checkbox>
      <span class="checkbox-result">
        {{ selectedInterests().length }} of {{ interests.length }} selected
      </span>
    </div>
  `,
  styles: `
    .checkbox-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }
    
    .checkbox-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }
  `
})
export class CheckboxIndeterminateIndeterminateDemo {
  protected readonly allSelected = computed(
    () => this.selectedInterests().length === this.interests.length,
  );

  protected readonly partiallySelected = computed(
    () => this.selectedInterests().length > 0 && !this.allSelected(),
  );
}
```

### Selection group

Compose independent checkboxes in a semantic fieldset for multiple-choice data.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-group-demo',
  imports: [AerisCheckbox],
  templateUrl: './checkbox-group.demo.html',
  styleUrl: './checkbox-group.demo.scss'
})
export class CheckboxGroupSelectionGroupDemo {
  protected readonly selectedInterests =
    signal<readonly string[]>(['accessibility']);

  protected isInterestSelected(value: string): boolean {
    return this.selectedInterests().includes(value);
  }

  protected setInterest(value: string, checked: boolean): void {
    this.selectedInterests.update((current) =>
      checked
        ? [...current, value]
        : current.filter((item) => item !== value),
    );
  }
}
```

#### HTML

```html
<div>
  <fieldset class="checkbox-group">
    <legend>Topics of interest</legend>
    @for (interest of interests; track interest.value) {
      <div class="checkbox-option">
        <aeris-checkbox
          [value]="interest.value"
          [checked]="isInterestSelected(interest.value)"
          (checkedChange)="setInterest(interest.value, $event)"
        >
          <span class="checkbox-option__content">
            <strong>{{ interest.label }}</strong>
            <small>{{ interest.description }}</small>
          </span>
        </aeris-checkbox>
      </div>
    }
  </fieldset>
</div>
```

#### CSS

```css
.checkbox-group {
  width: min(100%, 36rem);
  display: grid;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.checkbox-group legend {
  margin-bottom: 0.75rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}

.checkbox-option {
  padding: 0.875rem 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.625rem;
  background: var(--aeris-surface);
}

.checkbox-option:has(aeris-checkbox[data-checked]),
.checkbox-option:has(aeris-checkbox[data-indeterminate]) {
  border-color: color-mix(in srgb, var(--aeris-primary) 55%, var(--aeris-border));
  background: color-mix(in srgb, var(--aeris-primary) 7%, var(--aeris-surface));
}

.checkbox-option__content {
  display: inline-grid;
  gap: 0.125rem;
}

.checkbox-option__content strong {
  color: var(--aeris-text);
  font-size: 0.875rem;
}

.checkbox-option__content small {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}
```

### Sizes

Four sizes align Checkbox with the active Aeris density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-sizes-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="field-row">
      <aeris-checkbox size="xs" [checked]="true">Extra small</aeris-checkbox>
      <aeris-checkbox size="sm" [checked]="true">Small</aeris-checkbox>
      <aeris-checkbox [checked]="true">Medium</aeris-checkbox>
      <aeris-checkbox size="lg" [checked]="true">Large</aeris-checkbox>
    </div>
  `,
  styles: `
    .field-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 1rem;
    }
    
    @media (max-width: 42rem) {
      .field-row {
        align-items: stretch;
      }
    }
  `
})
export class CheckboxSizesSizesDemo {
}
```

### Label position

Place label content after or before the control without changing native association.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-label-position-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="field-row checkbox-label-position">
      <aeris-checkbox [checked]="true">Label at end</aeris-checkbox>
      <aeris-checkbox [checked]="true" labelPosition="start"
        >Label at start</aeris-checkbox
      >
    </div>
  `,
  styles: `
    .field-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 1rem;
    }
    
    @media (max-width: 42rem) {
      .field-row {
        align-items: stretch;
      }
    }
    
    .checkbox-label-position {
      align-items: center;
    }
  `
})
export class CheckboxLabelPositionLabelPositionDemo {
}
```

### Rich label

Projected semantic content supports titles, descriptions, and inline links while preserving one native label.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-rich-label-demo',
  imports: [AerisCheckbox],
  template: `
    <div>
      <aeris-checkbox [(checked)]="termsAccepted">
        <span class="checkbox-rich-label">
          <strong>Accept the project terms</strong>
          <small>Required before publishing this workspace.</small>
        </span>
      </aeris-checkbox>
    </div>
  `,
  styles: `
    .checkbox-rich-label {
      display: inline-grid;
      gap: 0.15rem;
    }
    
    .checkbox-rich-label strong {
      color: var(--aeris-text);
    }
    
    .checkbox-rich-label small {
      color: var(--aeris-text-2);
      font-size: 0.75rem;
    }
  `
})
export class CheckboxRichLabelRichLabelDemo {
}
```

### Required, invalid, and disabled

Validation and disabled state are synchronized with the internal native checkbox.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-states-demo',
  imports: [AerisCheckbox],
  templateUrl: './checkbox-states.demo.html',
  styleUrl: './checkbox-states.demo.scss'
})
export class CheckboxStatesRequiredInvalidAndDisabledDemo {
}
```

#### HTML

```html
<div class="checkbox-stack">
  <aeris-checkbox
    inputId="required-terms"
    required
    invalid
    ariaDescribedby="required-terms-error"
  >
    Accept terms
  </aeris-checkbox>
  <small id="required-terms-error" class="error"
    >You must accept the terms to continue.</small
  >
  <aeris-checkbox disabled>Unavailable option</aeris-checkbox>
  <aeris-checkbox [checked]="true" disabled>Selected and unavailable</aeris-checkbox>
</div>
```

#### CSS

```css
.field small.error {
  color: var(--aeris-danger);
}

.checkbox-stack {
  width: 100%;
  display: grid;
  gap: 0.875rem;
}
```

### Native form values

Name and value are forwarded to the native checkbox for standard browser form submission.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-native-form-demo',
  imports: [AerisCheckbox],
  template: `
    <div class="checkbox-stack">
      <aeris-checkbox name="permissions" value="reports" [checked]="true">
        View reports
      </aeris-checkbox>
      <aeris-checkbox name="permissions" value="exports"> Export data </aeris-checkbox>
    </div>
  `,
  styles: `
    .checkbox-stack {
      width: 100%;
      display: grid;
      gap: 0.875rem;
    }
  `
})
export class CheckboxNativeFormNativeFormValuesDemo {
}
```

### Reactive and template-driven forms

Checkbox implements the Angular checkbox value-accessor contract while retaining checked signal binding.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';

@Component({
  selector: 'app-checkbox-angular-forms-demo',
  imports: [AerisCheckbox, FormsModule, ReactiveFormsModule],
  template: `
    <div class="field-grid">
      <div class="field">
        <span>Reactive Forms</span>
        <aeris-checkbox [formControl]="reactiveChecked">Enable analytics</aeris-checkbox>
        <small>Checked: {{ reactiveChecked.value }}</small>
      </div>
      <div class="field">
        <span>Template-driven forms</span>
        <aeris-checkbox name="templateChecked" [(ngModel)]="templateChecked">
          Receive release notes
        </aeris-checkbox>
        <small>Checked: {{ templateChecked }}</small>
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
export class CheckboxAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveChecked =
    new FormControl(false);

  protected templateChecked = true;
}
```

## Accessibility

- Checkbox uses a real native input type="checkbox", preserving browser, keyboard, form, and assistive-technology behavior.
- Projected content and the label input are wrapped in one native label, expanding the pointer target.
- Space toggles the focused checkbox. Native tab order and disabled behavior are preserved.
- Mixed state is applied through the native indeterminate property and announced as partially checked by supporting screen readers.
- Use a visible label whenever possible. For icon-only or externally labeled controls, use ariaLabel or ariaLabelledby.
- Connect help and error text through ariaDescribedby. The invalid input synchronizes aria-invalid.
- Selection groups should use a fieldset and legend to communicate their shared question.
- ControlValueAccessor support synchronizes checked, touched, and disabled state with Reactive Forms and template-driven forms.
- Focus indicators meet the WCAG 2.2 target and animations respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the checkbox. |
| `Space` | Toggles the focused checkbox between checked and unchecked. |
