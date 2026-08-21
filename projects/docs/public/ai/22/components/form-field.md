# FormField

> Compose labels, controls, hints, and validation messages with stable spacing and accessible relationships.

Aeris 22.0.0-alpha.4 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/form-field`
- Human-readable documentation: [https://aeris-ui.dev/components/form-field](https://aeris-ui.dev/components/form-field)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisFormField } from '@aeris-ui/core/form-field';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `controlId` | `string` | `generated` | ID shared by the label and control. Exposed as a signal for Aeris controls. |
| `invalid` | `boolean` | `false` | Shows the error, applies invalid presentation, and includes its ID in describedBy(). |
| `disabled` | `boolean` | `false` | Applies disabled field presentation. Disable the projected control separately. |
| `required` | `boolean` | `false` | Shows the required indicator and sets aria-required on native aerisFormControl elements. |
| `optional` | `boolean` | `false` | Shows an optional indicator unless required is also true. |
| `optionalText` | `string` | `'Optional'` | Text displayed by the optional indicator for localization. |
| `fluid` | `boolean` | `false` | Makes the field and native aerisFormControl element fill available inline space. |
| `reserveMessageSpace` | `boolean` | `false` | Reserves one message line so adjacent grid fields remain visually stable. |
| `ariaDescribedby` | `string` | `''` | Additional description IDs merged into the generated describedBy() value. |
| `errorLive` | `AerisFormErrorLive` | `'polite'` | Default error announcement behavior. Options: 'off', 'polite', 'assertive'. |

### Directive Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `''` | Overrides the generated label ID. |
| `for` | `string` | `''` | Overrides the generated label target. The TypeScript property name is forId. |
| `id` | `string` | `''` | Overrides the generated native or host-semantic control ID. |
| `aria-describedby` | `string` | `''` | Additional description IDs merged with the FormField IDs. The TypeScript property name is ariaDescribedby. |
| `id` | `string` | `''` | Overrides the generated hint ID. |
| `id` | `string` | `''` | Overrides the generated error ID. |
| `hideWhenValid` | `boolean` | `true` | Hides the projected error while FormField invalid is false. |
| `live` | `AerisFormErrorLive &#124; undefined` | `undefined` | Overrides the field announcement behavior. Options: 'off', 'polite', 'assertive', or undefined to inherit errorLive. |

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `labelId` | `Signal&lt;string&gt;` | `derived` | Generated label ID for ariaLabelledby on Aeris or custom controls. |
| `hintId` | `Signal&lt;string&gt;` | `derived` | Generated default hint ID. |
| `errorId` | `Signal&lt;string&gt;` | `derived` | Generated default error ID. |
| `describedBy` | `Signal&lt;string&gt;` | `derived` | Deduplicated hint, active error, and external description IDs for control binding. |

## Interfaces and types

### Interfaces

```ts
type AerisFormErrorLive = 'off' | 'polite' | 'assertive';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-form-field-gap` | `length` | `0.45rem` | Spacing between label, control, and support area. |
| `--aeris-form-field-color` | `color` | `--aeris-text` | Base field text color. |
| `--aeris-form-field-label-color` | `color` | `--aeris-text` | Label text color. |
| `--aeris-form-field-label-font-size` | `length` | `0.875rem` | Label font size. |
| `--aeris-form-field-label-font-weight` | `number` | `700` | Label font weight. |
| `--aeris-form-field-indicator-gap` | `length` | `0.25rem` | Gap before required or optional indicators. |
| `--aeris-form-field-required-color` | `color` | `--aeris-danger` | Required indicator color. |
| `--aeris-form-field-optional-color` | `color` | `--aeris-text-2` | Optional indicator color. |
| `--aeris-form-field-message-gap` | `length` | `0.25rem` | Gap between hint and error messages. |
| `--aeris-form-field-message-space` | `length` | `1.2rem` | Reserved support-area height. |
| `--aeris-form-field-message-font-size` | `length` | `0.8125rem` | Hint and error font size. |
| `--aeris-form-field-hint-color` | `color` | `--aeris-text-2` | Hint text color. |
| `--aeris-form-field-error-color` | `color` | `--aeris-danger-text` | Error text color. |
| `--aeris-form-field-disabled-opacity` | `number` | `0.52` | Disabled label and hint opacity. |

## Examples

### Native control

aerisFormControl automatically connects a native control to the generated label, hint, and field state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-form-field-basic-demo',
  imports: [AerisFormField, AerisInputText, FormsModule],
  templateUrl: './form-field-basic.demo.html',
  styleUrl: './form-field-basic.demo.scss'
})
export class FormFieldBasicNativeControlDemo {
  protected readonly email = signal('alex@example.com');
}
```

#### HTML

```html
<div class="form-field-example">
  <aeris-form-field required fluid>
    <label aerisFormLabel>Email address</label>
    <input
      aerisInputText
      aerisFormControl
      type="email"
      autocomplete="email"
      required
      fluid
      [(ngModel)]="email"
    />
    <small aerisFormHint>We use this address for account notifications.</small>
  </aeris-form-field>
</div>
```

#### CSS

```css
.form-field-example {
  width: min(100%, 28rem);
}
```

### Responsive profile form

Mix native and Aeris controls in a two-column form that collapses cleanly on small screens.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisDatePicker, type AerisDatePickerValue } from '@aeris-ui/core/date-picker';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisInputNumber } from '@aeris-ui/core/input-number';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisSelect } from '@aeris-ui/core/select';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-form-field-profile-demo',
  imports: [AerisDatePicker, AerisFormField, AerisInputNumber, AerisInputText, AerisSelect, AerisTextarea, FormsModule],
  templateUrl: './form-field-profile.demo.html',
  styleUrl: './form-field-profile.demo.scss'
})
export class FormFieldProfileResponsiveProfileFormDemo {
  protected readonly profileName = signal('Alex Morgan');
  protected readonly birthDate = signal<AerisDatePickerValue>(new Date(1994, 6, 12));
  protected readonly height = signal<number | null>(178);
  protected readonly role = signal<string | null>('designer');
  protected readonly biography = signal('Product designer focused on accessible workflows.');

  protected readonly roleOptions = [
    { label: 'Designer', value: 'designer' },
    { label: 'Engineer', value: 'engineer' },
    { label: 'Product manager', value: 'product-manager' },
  ] as const;
}
```

#### HTML

```html
<div class="profile-form">
  <aeris-form-field required fluid>
    <label aerisFormLabel>Display name</label>
    <input
      aerisInputText
      aerisFormControl
      autocomplete="name"
      required
      fluid
      [(ngModel)]="profileName"
    />
    <small aerisFormHint>Shown to other workspace members.</small>
  </aeris-form-field>

  <aeris-form-field #birthField optional fluid>
    <label aerisFormLabel>Birth date</label>
    <aeris-date-picker
      [inputId]="birthField.controlId()"
      [ariaLabelledby]="birthField.labelId()"
      [ariaDescribedby]="birthField.describedBy()"
      [(value)]="birthDate"
      fluid
    />
    <small aerisFormHint>Used only for age-based preferences.</small>
  </aeris-form-field>

  <aeris-form-field #heightField optional fluid>
    <label aerisFormLabel>Height</label>
    <aeris-input-number
      [inputId]="heightField.controlId()"
      [ariaLabelledby]="heightField.labelId()"
      [ariaDescribedby]="heightField.describedBy()"
      [(value)]="height"
      suffix=" cm"
      [min]="80"
      [max]="250"
      fluid
    />
    <small aerisFormHint>Used to calculate BMI.</small>
  </aeris-form-field>

  <aeris-form-field #roleField required fluid>
    <label aerisFormLabel>Role</label>
    <aeris-select
      [inputId]="roleField.controlId()"
      [ariaLabelledby]="roleField.labelId()"
      [ariaDescribedby]="roleField.describedBy()"
      [options]="roleOptions"
      [(value)]="role"
      placeholder="Choose a role"
      required
      fluid
    />
    <small aerisFormHint>Controls the defaults shown in your workspace.</small>
  </aeris-form-field>

  <aeris-form-field #bioField class="profile-form__wide" optional fluid>
    <label aerisFormLabel>Biography</label>
    <aeris-textarea
      [inputId]="bioField.controlId()"
      [ariaLabelledby]="bioField.labelId()"
      [ariaDescribedby]="bioField.describedBy()"
      [(value)]="biography"
      [rows]="3"
      fluid
    />
    <small aerisFormHint>Share a short introduction with your team.</small>
  </aeris-form-field>
</div>
```

#### CSS

```css
.profile-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.profile-form__wide {
  grid-column: 1 / -1;
}

@media (max-width: 42rem) {
  .profile-form {
    grid-template-columns: 1fr;
  }

  .profile-form__wide {
    grid-column: auto;
  }
}
```

### Validation and alignment

Reserve support space to keep adjacent fields stable while an error appears. Fields stay top-aligned even when one hint wraps.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-form-field-validation-demo',
  imports: [AerisButton, AerisFormField, AerisInputText, FormsModule],
  templateUrl: './form-field-validation.demo.html',
  styleUrl: './form-field-validation.demo.scss'
})
export class FormFieldValidationValidationAndAlignmentDemo {
  protected readonly validationEmail = signal('alex@');
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () =>
      this.validationTouched() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.validationEmail()),
  );
}
```

#### HTML

```html
<div class="validation-grid">
  <aeris-form-field
    required
    fluid
    reserveMessageSpace
    [invalid]="validationInvalid()"
  >
    <label aerisFormLabel>Work email</label>
    <input
      aerisInputText
      aerisFormControl
      type="email"
      required
      fluid
      [invalid]="validationInvalid()"
      [(ngModel)]="validationEmail"
      (blur)="validationTouched.set(true)"
    />
    <small aerisFormError>Enter a complete email address.</small>
  </aeris-form-field>

  <aeris-form-field optional fluid reserveMessageSpace>
    <label aerisFormLabel>Employee ID</label>
    <input aerisInputText aerisFormControl value="AE-1042" fluid />
    <small aerisFormHint>
      This longer help message does not stretch the neighboring label-to-control gap.
    </small>
  </aeris-form-field>

  <div class="validation-actions">
    <button aerisButton type="button" (click)="validateEmail()">Check email</button>
    <button aerisButton type="button" variant="secondary" (click)="resetValidation()">
      Reset
    </button>
  </div>
</div>
```

#### CSS

```css
.validation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.validation-actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 42rem) {
  .validation-grid {
    grid-template-columns: 1fr;
  }

  .validation-actions {
    grid-column: auto;
  }
}
```

### Required, optional, and disabled

Field indicators and presentation stay consistent while the projected controls retain their own native state.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisFormField } from '@aeris-ui/core/form-field';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisToggleSwitch } from '@aeris-ui/core/toggle-switch';

@Component({
  selector: 'app-form-field-states-demo',
  imports: [AerisFormField, AerisInputText, AerisToggleSwitch],
  templateUrl: './form-field-states.demo.html',
  styleUrl: './form-field-states.demo.scss'
})
export class FormFieldStatesRequiredOptionalAndDisabledDemo {
  protected readonly notifications = signal(true);
}
```

#### HTML

```html
<div class="field-state-stack">
  <aeris-form-field #notificationField required fluid>
    <label aerisFormLabel>Workspace notifications</label>
    <aeris-toggle-switch
      [inputId]="notificationField.controlId()"
      [ariaLabelledby]="notificationField.labelId()"
      [ariaDescribedby]="notificationField.describedBy()"
      [(checked)]="notifications"
      required
    />
    <small aerisFormHint>Receive updates about assigned work.</small>
  </aeris-form-field>

  <aeris-form-field optional optionalText="Not required" fluid>
    <label aerisFormLabel>Portfolio URL</label>
    <input aerisInputText aerisFormControl type="url" placeholder="https://" fluid />
  </aeris-form-field>

  <aeris-form-field disabled fluid>
    <label aerisFormLabel>Organization</label>
    <input aerisInputText aerisFormControl value="Aeris Labs" disabled fluid />
    <small aerisFormHint>Managed by your administrator.</small>
  </aeris-form-field>
</div>
```

#### CSS

```css
.field-state-stack {
  width: min(100%, 32rem);
  display: grid;
  gap: 1rem;
}
```

## Accessibility

- Use aerisFormControl for native controls. It applies the generated ID, aria-describedby, aria-invalid, and aria-required. For Aeris controls with an internal interactive element, bind controlId(), labelId(), and describedBy() to the control's existing accessibility inputs, as shown in the profile example.
- Errors are hidden while the field is valid and included in the control description only while invalid. The default polite live region avoids interrupting current speech. Use errorLive="off" when another form-level summary announces validation, or assertive only for time-sensitive feedback.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to the projected control according to its native or Aeris behavior. |
| `Shift + Tab` | Moves focus backward through the page tab order. |
| `Enter / Space` | Uses the projected control's documented behavior; FormField adds no competing keyboard handlers. |
| `Label click` | Focuses or activates the associated labelable control through the native label relationship. |
