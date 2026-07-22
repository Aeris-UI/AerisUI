# RadioButton

> Single-choice control designed for accessible grouped selection.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/radio-button`
- Human-readable documentation: [https://aeris-ui.dev/components/radio-button](https://aeris-ui.dev/components/radio-button)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisRadioButton } from '@aeris-ui/core/radio-button';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selected` | `string &#124; null (model)` | `null` | Selected value shared by every radio in a group. |
| `value` | `string` | `required` | Value selected and submitted by this option. |
| `name` | `string` | `''` | Native radio group name. Use the same value for related options. |
| `inputId` | `string` | `generated` | ID assigned to the native radio input. |
| `label` | `string` | `''` | Optional text label. Projected label content is also supported. |
| `size` | `AerisRadioButtonSize` | `'md'` | Control and label size. |
| `labelPosition` | `AerisRadioButtonLabelPosition` | `'end'` | Places the visible label before or after the control. |
| `disabled` | `boolean` | `false` | Disables native interaction and form participation. |
| `required` | `boolean` | `false` | Applies native required validation to the group. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `ariaLabel` | `string` | `''` | Accessible name for an option without visible label content. |
| `ariaLabelledby` | `string` | `''` | IDs of external labeling elements. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |

### Radio Button outputs

| Name | Type | Description |
| --- | --- | --- |
| selectedChange | string &#124; null | Emitted automatically by the selected model. |
| selectedInput | string | Emitted when user or public method interaction selects this option. |
| changed | AerisRadioButtonChangeEvent | Native change event and the selected value. |
| focused | FocusEvent | Emitted when the native radio receives focus. |
| blurred | FocusEvent | Emitted when the native radio loses focus. |
| touch | void | Emitted on blur and synchronized with Angular Forms touched state. |

### Radio Button methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the native radio input. |
| select | () =&gt; void | Selects and focuses an enabled option. |

## Interfaces and types

### Interfaces

```ts
type AerisRadioButtonSize =
  'xs' | 'sm' | 'md' | 'lg';

type AerisRadioButtonLabelPosition = 'start' | 'end';

interface AerisRadioButtonChangeEvent {
  readonly originalEvent: Event;
  readonly value: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-radio-label-color` | `CSS custom property` | — | Option label color. |
| `--aeris-radio-border` | `CSS custom property` | — | Unselected border. |
| `--aeris-radio-background` | `CSS custom property` | — | Unselected background. |
| `--aeris-radio-selected-color` | `CSS custom property` | — | Selected ring color. |
| `--aeris-radio-focus-ring` | `CSS custom property` | — | Visible keyboard focus ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border. |
| `--aeris-disabled-opacity` | `CSS custom property` | — | Disabled control opacity. |

## Examples

### Basic group

Use a fieldset and legend to give the group an accessible question.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-basic-demo',
  imports: [AerisRadioButton],
  template: `
    <div>
      <fieldset class="radio-group">
        <legend>Workspace visibility</legend>
        <aeris-radio-button name="visibility" value="private" [(selected)]="visibility"
          >Private</aeris-radio-button
        >
        <aeris-radio-button name="visibility" value="team" [(selected)]="visibility"
          >Team members</aeris-radio-button
        >
        <aeris-radio-button name="visibility" value="public" [(selected)]="visibility"
          >Public</aeris-radio-button
        >
      </fieldset>
    </div>
  `,
  styles: `
    .radio-stack,
    .radio-group,
    .radio-card-group {
      width: 100%;
      display: grid;
      gap: 0.75rem;
    }
    
    .radio-group,
    .radio-card-group {
      margin: 0;
      padding: 0;
      border: 0;
    }
    
    .radio-group legend,
    .radio-card-group legend,
    .radio-group > strong {
      margin-bottom: 0.125rem;
      color: var(--aeris-text);
      font-size: 0.9375rem;
      font-weight: 650;
    }
  `
})
export class RadioBasicBasicGroupDemo {
  protected readonly visibility = signal<string | null>('private');
}
```

### Signal model

Bind every option to one writable signal and observe detailed user changes when needed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-model-demo',
  imports: [AerisRadioButton],
  templateUrl: './radio-model.demo.html',
  styleUrl: './radio-model.demo.scss'
})
export class RadioModelSignalModelDemo {
  protected readonly notificationChannel = signal<string | null>('email');
}
```

#### HTML

```html
<div class="radio-stack">
  <fieldset class="radio-group">
    <legend>Notification channel</legend>
    <aeris-radio-button
      name="channel"
      value="email"
      [(selected)]="notificationChannel"
      (changed)="recordChange($event)"
      >Email</aeris-radio-button
    >
    <aeris-radio-button
      name="channel"
      value="push"
      [(selected)]="notificationChannel"
      (changed)="recordChange($event)"
      >Push notification</aeris-radio-button
    >
    <aeris-radio-button
      name="channel"
      value="none"
      [(selected)]="notificationChannel"
      (changed)="recordChange($event)"
      >None</aeris-radio-button
    >
  </fieldset>
  <span class="radio-result" aria-live="polite">
    Value: {{ notificationChannel() }}. {{ lastChange() }}.
  </span>
</div>
```

#### CSS

```css
.radio-stack,
.radio-group,
.radio-card-group {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

.radio-group,
.radio-card-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-group legend,
.radio-card-group legend,
.radio-group > strong {
  margin-bottom: 0.125rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}

.radio-option-content small,
.radio-result {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}
```

### Rich options

Projected content supports a title and description while the whole option remains clickable.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

interface Plan {
  readonly value: string;
  readonly label: string;
  readonly description: string;
}

@Component({
  selector: 'app-radio-rich-options-demo',
  imports: [AerisRadioButton],
  templateUrl: './radio-rich-options.demo.html',
  styleUrl: './radio-rich-options.demo.scss'
})
export class RadioRichOptionsRichOptionsDemo {
  protected readonly selectedPlan = signal<string | null>('team');
  protected readonly plans: readonly Plan[] = [
    { value: 'starter', label: 'Starter', description: 'Essential controls.' },
    { value: 'team', label: 'Team', description: 'Shared configuration.' },
    { value: 'scale', label: 'Scale', description: 'Design-system governance.' },
  ];
}
```

#### HTML

```html
<div>
  <fieldset class="radio-card-group">
    <legend>Choose a plan</legend>
    @for (plan of plans; track plan.value) {
      <div
        class="radio-card"
        [class.radio-card--selected]="selectedPlan() === plan.value"
      >
        <aeris-radio-button
          name="plan"
          [value]="plan.value"
          [(selected)]="selectedPlan"
        >
          <span class="radio-option-content">
            <strong>{{ plan.label }}</strong>
            <small>{{ plan.description }}</small>
          </span>
        </aeris-radio-button>
      </div>
    }
  </fieldset>
</div>
```

#### CSS

```css
.radio-stack,
.radio-group,
.radio-card-group {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

.radio-group,
.radio-card-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-group legend,
.radio-card-group legend,
.radio-group > strong {
  margin-bottom: 0.125rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}

.radio-card-group {
  width: min(100%, 38rem);
}

.radio-card {
  padding: 0.875rem 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.75rem;
  background: var(--aeris-surface);
  transition: border-color 150ms ease, background-color 150ms ease;
}

.radio-option-content {
  display: inline-grid;
  gap: 0.125rem;
}

.radio-option-content strong {
  color: var(--aeris-text);
  font-size: 0.875rem;
}

.radio-option-content small,
.radio-result {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

@media (prefers-reduced-motion: reduce) {
  .radio-card {
      transition: none;
    }
}
```

### Sizes

Four sizes align Radio Button with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-sizes-demo',
  imports: [AerisRadioButton],
  template: `
    <div class="field-row">
      <aeris-radio-button name="size-xs" value="xs" selected="xs" size="xs"
        >Extra small</aeris-radio-button
      >
      <aeris-radio-button name="size-sm" value="sm" selected="sm" size="sm"
        >Small</aeris-radio-button
      >
      <aeris-radio-button name="size-md" value="md" selected="md"
        >Medium</aeris-radio-button
      >
      <aeris-radio-button name="size-lg" value="lg" selected="lg" size="lg"
        >Large</aeris-radio-button
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
  `
})
export class RadioSizesSizesDemo {
}
```

### Label position

Place label content after or before the control without changing its native association.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-label-position-demo',
  imports: [AerisRadioButton],
  template: `
    <div class="field-row">
      <aeris-radio-button name="label-end" value="end" selected="end"
        >Label at end</aeris-radio-button
      >
      <aeris-radio-button
        name="label-start"
        value="start"
        selected="start"
        labelPosition="start"
        >Label at start</aeris-radio-button
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
  `
})
export class RadioLabelPositionLabelPositionDemo {
}
```

### Required, invalid, and disabled

State is synchronized with the internal native input and exposed to assistive technology.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-states-demo',
  imports: [AerisRadioButton],
  templateUrl: './radio-states.demo.html',
  styleUrl: './radio-states.demo.scss'
})
export class RadioStatesRequiredInvalidAndDisabledDemo {
}
```

#### HTML

```html
<div class="radio-stack">
  <fieldset class="radio-group" aria-describedby="delivery-error">
    <legend>Delivery speed</legend>
    <aeris-radio-button
      name="delivery"
      value="standard"
      required
      invalid
      ariaDescribedby="delivery-error"
      >Standard</aeris-radio-button
    >
    <aeris-radio-button
      name="delivery"
      value="express"
      required
      invalid
      ariaDescribedby="delivery-error"
      >Express</aeris-radio-button
    >
  </fieldset>
  <small id="delivery-error" class="error">Choose a delivery speed.</small>
  <aeris-radio-button name="disabled-demo" value="disabled" disabled
    >Unavailable option</aeris-radio-button
  >
  <aeris-radio-button
    name="disabled-selected"
    value="selected"
    selected="selected"
    disabled
    >Selected and unavailable</aeris-radio-button
  >
</div>
```

#### CSS

```css
.field small.error {
  color: var(--aeris-danger);
}

.radio-stack,
.radio-group,
.radio-card-group {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

.radio-group,
.radio-card-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-group legend,
.radio-card-group legend,
.radio-group > strong {
  margin-bottom: 0.125rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}

.error {
  color: var(--aeris-danger);
  font-size: 0.8125rem;
}
```

### Native form values

Name and value are forwarded to native radio inputs for standard browser submission.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-native-form-demo',
  imports: [AerisRadioButton],
  template: `
    <div>
      <form class="radio-group">
        <strong>Billing cycle</strong>
        <aeris-radio-button name="billing" value="monthly" selected="monthly"
          >Monthly</aeris-radio-button
        >
        <aeris-radio-button name="billing" value="annual" selected="monthly"
          >Annual</aeris-radio-button
        >
      </form>
    </div>
  `,
  styles: `
    .radio-stack,
    .radio-group,
    .radio-card-group {
      width: 100%;
      display: grid;
      gap: 0.75rem;
    }
    
    .radio-group,
    .radio-card-group {
      margin: 0;
      padding: 0;
      border: 0;
    }
    
    .radio-group legend,
    .radio-card-group legend,
    .radio-group > strong {
      margin-bottom: 0.125rem;
      color: var(--aeris-text);
      font-size: 0.9375rem;
      font-weight: 650;
    }
  `
})
export class RadioNativeFormNativeFormValuesDemo {
}
```

### Reactive and template-driven forms

Radio Button implements ControlValueAccessor and synchronizes value, touched, and disabled state.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisRadioButton } from '@aeris-ui/core/radio-button';

@Component({
  selector: 'app-radio-angular-forms-demo',
  imports: [AerisRadioButton, FormsModule, ReactiveFormsModule],
  templateUrl: './radio-angular-forms.demo.html',
  styleUrl: './radio-angular-forms.demo.scss'
})
export class RadioAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactivePlan =
    new FormControl<string | null>('team');

  protected templatePlan: string | null = 'starter';
}
```

#### HTML

```html
<div class="field-grid">
  <fieldset class="radio-group">
    <legend>Reactive Forms</legend>
    <aeris-radio-button
      name="reactive-plan"
      value="starter"
      [formControl]="reactivePlan"
      >Starter</aeris-radio-button
    >
    <aeris-radio-button name="reactive-plan" value="team" [formControl]="reactivePlan"
      >Team</aeris-radio-button
    >
    <small>Value: {{ reactivePlan.value }}</small>
  </fieldset>
  <fieldset class="radio-group">
    <legend>Template-driven forms</legend>
    <aeris-radio-button
      name="template-plan"
      value="starter"
      [(ngModel)]="templatePlan"
      >Starter</aeris-radio-button
    >
    <aeris-radio-button name="template-plan" value="team" [(ngModel)]="templatePlan"
      >Team</aeris-radio-button
    >
    <small>Value: {{ templatePlan }}</small>
  </fieldset>
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

@media (max-width: 42rem) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}

.radio-stack,
.radio-group,
.radio-card-group {
  width: 100%;
  display: grid;
  gap: 0.75rem;
}

.radio-group,
.radio-card-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.radio-group legend,
.radio-card-group legend,
.radio-group > strong {
  margin-bottom: 0.125rem;
  color: var(--aeris-text);
  font-size: 0.9375rem;
  font-weight: 650;
}
```

## Accessibility

- Radio Button uses a native input type="radio", preserving browser, keyboard, form, and assistive-technology behavior.
- Wrap related options in a fieldset with a legend, and give every option the same name.
- Tab enters or leaves a group. Arrow keys move and select within it, and Space selects the focused option.
- Projected content and the label input create a native clickable label with a larger pointer target.
- Use visible option text whenever possible. Use ariaLabel or ariaLabelledby only when native visible labeling is unavailable.
- Connect instructions and errors with ariaDescribedby. The invalid input synchronizes aria-invalid.
- ControlValueAccessor support synchronizes value, touched, and disabled state with Reactive Forms and template-driven forms.
- Focus indicators meet WCAG 2.2 requirements and selection animation respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus into or out of the radio group. |
| `Arrow Right / Arrow Down` | Moves to and selects the next enabled radio option. |
| `Arrow Left / Arrow Up` | Moves to and selects the previous enabled radio option. |
| `Space` | Selects the focused radio option. |
