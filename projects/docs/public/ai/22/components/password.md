# Password

> Password entry with visibility controls, strength feedback, and secure autofill semantics.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/password`
- Human-readable documentation: [https://aeris-ui.dev/components/password](https://aeris-ui.dev/components/password)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisPassword } from '@aeris-ui/core/password';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Password value with two-way binding and Forms support. |
| `visible` | `boolean (model)` | `false` | Controls whether the value is masked. |
| `inputId` | `string` | `''` | Native input ID. |
| `name` | `string` | `''` | Native form field name. |
| `placeholder` | `string` | `''` | Native placeholder text. |
| `autocomplete` | `string` | `'current-password'` | Password-manager and browser autofill hint. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label exists. |
| `ariaLabelledby` | `string` | `''` | IDs of visible elements that label the field. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |
| `size` | `AerisPasswordSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisPasswordAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `minLength` | `number` | `8` | Native minimum length and default feedback requirement. |
| `maxLength` | `number &#124; undefined` | `undefined` | Optional native maximum length. |
| `toggleMask` | `boolean` | `true` | Shows the visibility toggle. |
| `feedback` | `boolean` | `true` | Shows the strength panel while focus remains in the component. |
| `showRequirements` | `boolean` | `true` | Shows default requirement progress in the feedback panel. |
| `strengthEvaluator` | `AerisPasswordStrengthEvaluator` | `evaluateAerisPassword` | Replaces the default presentation-oriented strength policy. |
| `clearable` | `boolean` | `false` | Shows a clear suffix action while editable content exists. |
| `clearButtonAriaLabel` | `string` | `'Clear password'` | Accessible name for the clear action. |
| `showPasswordAriaLabel` | `string` | `localized label` | Accessible name for showing the password. |
| `hidePasswordAriaLabel` | `string` | `localized label` | Accessible name for hiding the password. |
| `disabled` | `boolean` | `false` | Disables interaction and native form submission. |
| `readonly` | `boolean` | `false` | Makes the native input read-only. |
| `required` | `boolean` | `false` | Exposes native required validation semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |

### Password outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange / valueInput | string | Model and explicit value-change notifications. |
| visibleChange / visibilityChanged | boolean | Model and explicit visibility notifications. |
| focused / blurred | FocusEvent | Native input focus lifecycle events. |
| touch | void | Emitted when focus leaves the complete component. |

### Password templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisPasswordHeader | none | Content before strength feedback. |
| aerisPasswordFeedback | result, value | Replaces the default meter and requirement list. |
| aerisPasswordFooter | none | Content after strength feedback. |

### Password methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the native input. |
| clear | () =&gt; void | Clears an editable value and restores focus. |
| show / hide | () =&gt; void | Controls password visibility. |
| toggleVisibility | () =&gt; void | Toggles masking and restores input focus. |
| evaluateAerisPassword | AerisPasswordStrengthEvaluator | Exported default evaluator for reuse or composition. |

## Interfaces and types

### Interfaces

```ts
type AerisPasswordSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisPasswordAppearance = 'outline' | 'filled';
type AerisPasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

interface AerisPasswordRequirement {
  readonly label: string;
  readonly met: boolean;
}

interface AerisPasswordStrengthResult {
  readonly score: 0 | 1 | 2 | 3;
  readonly strength: AerisPasswordStrength;
  readonly label: string;
  readonly requirements: readonly AerisPasswordRequirement[];
}

type AerisPasswordStrengthEvaluator = (
  value: string,
  minLength: number,
) => AerisPasswordStrengthResult;
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium control height. |
| `--aeris-radius-sm / --aeris-radius-md` | `CSS custom property` | — | Field and feedback corner radii. |
| `--aeris-surface / --aeris-surface-2` | `CSS custom property` | — | Field, panel, filled, and action surfaces. |
| `--aeris-border / --aeris-border-strong` | `CSS custom property` | — | Panel and field borders. |
| `--aeris-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-danger / --aeris-warning / --aeris-success` | `CSS custom property` | — | Invalid and strength meter states. |

## Examples

### Basic

Associate the internal native password input with a visible label and bind its signal model.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-basic-demo',
  imports: [AerisPassword],
  template: `
    <div class="field">
      <label for="account-password">Account password</label>
      <aeris-password
        inputId="account-password"
        [(value)]="password"
        placeholder="Enter password"
        fluid
      />
      <small>Use a unique password for this account.</small>
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
export class PasswordBasicBasicDemo {
  protected readonly password = signal('');
}
```

### Visibility toggle

The suffix button changes the native input type, updates aria-pressed, and restores focus to the field.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-visibility-demo',
  imports: [AerisPassword],
  template: `
    <div class="field">
      <label for="visible-password">Password</label>
      <aeris-password
        inputId="visible-password"
        [(value)]="visiblePassword"
        toggleMask
        [feedback]="false"
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
export class PasswordVisibilityVisibilityToggleDemo {
}
```

### Strength feedback

Focus the field to see a live meter and requirement progress based on the configured minimum length.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-feedback-demo',
  imports: [AerisPassword],
  template: `
    <div class="field">
      <label for="feedback-password">Create password</label>
      <aeris-password
        inputId="feedback-password"
        autocomplete="new-password"
        [minLength]="12"
        placeholder="At least 12 characters"
        fluid
      />
      <small>Feedback describes the entered value without exposing it.</small>
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
export class PasswordFeedbackStrengthFeedbackDemo {
}
```

### Custom strength policy

Replace the presentation policy with a pure evaluator that returns score, label, and requirement state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword, type AerisPasswordStrengthResult } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-policy-demo',
  imports: [AerisPassword],
  template: `
    <div class="field">
      <label for="policy-password">Workspace password</label>
      <aeris-password
        inputId="policy-password"
        autocomplete="new-password"
        [strengthEvaluator]="companyPolicy"
        [minLength]="10"
        fluid
      />
      <small>Example policy: begin with AER- and include a number.</small>
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
export class PasswordPolicyCustomStrengthPolicyDemo {
  protected readonly companyPolicy = (
    value: string,
    minLength: number,
  ): AerisPasswordStrengthResult => {
    const requirements = [
      { label: `At least ${minLength} characters`, met: value.length >= minLength },
      { label: 'Starts with AER-', met: value.startsWith('AER-') },
      { label: 'Contains a number', met: /\d/.test(value) },
    ];
    const met = requirements.filter((item) => item.met).length;
    const score = met === 3 ? 3 : met >= 2 ? 2 : value ? 1 : 0;
    const strength = score === 3 ? 'strong' : score === 2 ? 'medium' : score === 1 ? 'weak' : 'empty';
    return {
      score,
      strength,
      label: score === 3 ? 'Policy satisfied' : 'Policy requirements',
      requirements,
    };
  };
}
```

### Feedback templates

Customize the header, complete feedback body, and footer while Aeris retains focus, visibility, and status semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-templates-demo',
  imports: [AerisPassword],
  templateUrl: './password-templates.demo.html',
  styleUrl: './password-templates.demo.scss'
})
export class PasswordTemplatesFeedbackTemplatesDemo {
}
```

#### HTML

```html
<div class="field">
  <label for="template-password">API password</label>
  <aeris-password inputId="template-password" autocomplete="new-password" fluid>
    <ng-template aerisPasswordHeader><strong>Password quality</strong></ng-template>
    <ng-template aerisPasswordFeedback let-result>
      <span class="custom-feedback">
        <strong>{{ result.label }}</strong>
        <span>Strength score: {{ result.score }} of 3</span>
      </span>
    </ng-template>
    <ng-template aerisPasswordFooter
      ><small>Never reuse a production credential.</small></ng-template
    >
  </aeris-password>
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

.custom-feedback {
  display: grid;
  gap: 0.375rem;
}

.custom-feedback strong {
  color: var(--primary-text);
}
```

### Clear button

The optional clear action empties the model and restores focus without affecting visibility settings.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-clear-demo',
  imports: [AerisPassword],
  template: `
    <div class="field">
      <label for="clear-password">Temporary password</label>
      <aeris-password
        inputId="clear-password"
        [(value)]="clearablePassword"
        clearable
        [feedback]="false"
        fluid
      />
      <small aria-live="polite"
        >Value: {{ clearablePassword() ? 'Present' : 'Empty' }}</small
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
export class PasswordClearClearButtonDemo {
}
```

### Password manager autocomplete

Use native autocomplete values so browsers and password managers can distinguish sign-in from password creation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-autocomplete-demo',
  imports: [AerisPassword],
  templateUrl: './password-autocomplete.demo.html',
  styleUrl: './password-autocomplete.demo.scss'
})
export class PasswordAutocompletePasswordManagerAutocompleteDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="current-password">Current password</label
    ><aeris-password
      inputId="current-password"
      autocomplete="current-password"
      [feedback]="false"
      fluid
    />
  </div>
  <div class="field">
    <label for="new-password">New password</label
    ><aeris-password inputId="new-password" autocomplete="new-password" fluid />
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

Four sizes align Password with the Aeris form-control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-sizes-demo',
  imports: [AerisPassword],
  templateUrl: './password-sizes.demo.html',
  styleUrl: './password-sizes.demo.scss'
})
export class PasswordSizesSizesDemo {
}
```

#### HTML

```html
<div class="password-size-grid">
  <label
    ><span>Extra small</span
    ><aeris-password
      ariaLabel="Extra small password"
      value="Password1!"
      size="xs"
      [feedback]="false"
  /></label>
  <label
    ><span>Small</span
    ><aeris-password
      ariaLabel="Small password"
      value="Password1!"
      size="sm"
      [feedback]="false"
  /></label>
  <label
    ><span>Medium</span
    ><aeris-password
      ariaLabel="Medium password"
      value="Password1!"
      [feedback]="false"
  /></label>
  <label
    ><span>Large</span
    ><aeris-password
      ariaLabel="Large password"
      value="Password1!"
      size="lg"
      [feedback]="false"
  /></label>
</div>
```

#### CSS

```css
.password-size-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.password-size-grid label {
  min-width: 0;
  display: grid;
  gap: 0.4rem;
}

.password-size-grid label > span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .password-size-grid {
      grid-template-columns: 1fr;
    }
}
```

### Appearances and states

Filled, disabled, and read-only treatments retain native semantics and predictable suffix actions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-states-demo',
  imports: [AerisPassword],
  templateUrl: './password-states.demo.html',
  styleUrl: './password-states.demo.scss'
})
export class PasswordStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Filled</span
    ><aeris-password
      ariaLabel="Filled password"
      value="Password1!"
      appearance="filled"
      [feedback]="false"
      fluid
    />
  </div>
  <div class="field">
    <span>Disabled</span
    ><aeris-password
      ariaLabel="Disabled password"
      value="Password1!"
      disabled
      [feedback]="false"
      fluid
    />
  </div>
  <div class="field">
    <span>Read-only</span
    ><aeris-password
      ariaLabel="Read-only password"
      value="Password1!"
      readonly
      [feedback]="false"
      fluid
    />
  </div>
  <div class="field">
    <span>Without visibility action</span
    ><aeris-password
      ariaLabel="Password without visibility action"
      value="Password1!"
      [toggleMask]="false"
      [feedback]="false"
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

### Validation

Application validation controls invalid state and error text; the strength meter remains advisory.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-validation-demo',
  imports: [AerisPassword],
  templateUrl: './password-validation.demo.html',
  styleUrl: './password-validation.demo.scss'
})
export class PasswordValidationValidationDemo {
  protected readonly validatedPassword = signal('short');
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () =>
      this.validationTouched() &&
      this.validatedPassword().length < 12,
  );
}
```

#### HTML

```html
<div class="field">
  <label for="validated-password">New password</label>
  <aeris-password
    inputId="validated-password"
    autocomplete="new-password"
    [(value)]="validatedPassword"
    [minLength]="12"
    required
    [invalid]="validationInvalid()"
    ariaDescribedby="validated-password-message"
    (blurred)="validationTouched.set(true)"
    fluid
  />
  @if (validationInvalid()) {
    <small id="validated-password-message" class="error state-message"
      >Use at least 12 characters.</small
    >
  } @else {
    <small id="validated-password-message" class="state-message"
      >Use at least 12 characters.</small
    >
  }
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

.state-message {
  min-height: 1.25rem;
}
```

### Reactive and template-driven forms

Password implements ControlValueAccessor and synchronizes value, disabled state, and touched state.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisPassword } from '@aeris-ui/core/password';

@Component({
  selector: 'app-password-forms-demo',
  imports: [AerisPassword, FormsModule, ReactiveFormsModule],
  templateUrl: './password-forms.demo.html',
  styleUrl: './password-forms.demo.scss'
})
export class PasswordFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactivePassword =
    new FormControl('Reactive1!');

  protected templatePassword = 'Template1!';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-password">Reactive Forms</label>
    <aeris-password
      inputId="reactive-password"
      [formControl]="reactivePassword"
      [feedback]="false"
      fluid
    />
    <small>Value: {{ reactivePassword.value ? 'Present' : 'Empty' }}</small>
  </div>
  <div class="field">
    <label for="template-password-form">Template-driven forms</label>
    <aeris-password
      inputId="template-password-form"
      name="templatePassword"
      [(ngModel)]="templatePassword"
      [feedback]="false"
      fluid
    />
    <small>Value: {{ templatePassword ? 'Present' : 'Empty' }}</small>
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

- The editable control remains a native password input, preserving password managers, autofill, selection, and platform keyboard behavior.
- Associate a visible label through inputId, or provide ariaLabel only when no visible label exists.
- The visibility control is a native toggle button with a changing accessible name and synchronized aria-pressed.
- Feedback is connected through aria-describedby and announced politely without repeating or exposing the password value.
- Use ariaDescribedby for application help and errors. Required and invalid state are synchronized with native and ARIA semantics.
- Strength feedback is advisory. Authentication rules and compromised-password checks must also run on a trusted server.
- Disabled, read-only, touched, and value state synchronize with Reactive Forms and template-driven forms.
- Visible focus meets WCAG 2.2 AA expectations and transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves through the input, clear action, visibility action, and surrounding controls. |
| `Arrow Left / Arrow Right` | Moves the text caret using native input behavior. |
| `Home / End` | Moves the caret to the start or end of the value. |
| `Backspace / Delete` | Removes selected text or the character beside the caret. |
| `Ctrl / Command + A` | Selects the complete password through native platform behavior. |
| `Enter / Space` | Activates the clear or visibility button when focused. |
