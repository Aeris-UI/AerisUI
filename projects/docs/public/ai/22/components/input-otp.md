# InputOtp

> Segmented one-time-code entry with paste, masking, and complete keyboard navigation.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/input-otp`
- Human-readable documentation: [https://aeris-ui.dev/components/input-otp](https://aeris-ui.dev/components/input-otp)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisInputOtp } from '@aeris-ui/core/input-otp';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Accepted OTP characters with two-way binding and Forms support. |
| `length` | `number` | `4` | Number of rendered character slots. |
| `mode` | `numeric &#124; alphanumeric` | `'numeric'` | Accepted character set and mobile keyboard hint. |
| `inputId` | `string` | `generated` | ID assigned to the first slot for optional direct label association. |
| `name` | `string` | `''` | Creates a hidden native form value containing the complete current string. |
| `autocomplete` | `string` | `'one-time-code'` | Autocomplete hint applied to the first slot. |
| `ariaLabel` | `string` | `''` | Accessible group name when no visible label exists. |
| `ariaLabelledby` | `string` | `''` | IDs of visible elements that label the complete group. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages for the group. |
| `slotAriaLabel` | `string` | `'Character {0} of {1}'` | Localized accessible label pattern for each slot. |
| `size` | `AerisInputOtpSize` | `'md'` | Slot dimensions and typography size. |
| `appearance` | `AerisInputOtpAppearance` | `'outline'` | Outlined or filled slot treatment. |
| `mask` | `boolean` | `false` | Masks each entered character using password input rendering. |
| `autoFocus` | `boolean` | `false` | Focuses the first slot after the component renders. |
| `selectOnFocus` | `boolean` | `true` | Selects an existing slot value when that slot receives focus. |
| `disabled` | `boolean` | `false` | Disables interaction and native form submission. |
| `readonly` | `boolean` | `false` | Makes the slots read-only. |
| `required` | `boolean` | `false` | Exposes native required validation semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |

### InputOtp outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange / valueInput | string | Model and explicit user value notifications. |
| completed | AerisInputOtpCompleteEvent | Emitted when every slot first becomes populated. |
| focused / blurred | FocusEvent | Individual slot focus lifecycle events. |
| touch | void | Emitted when focus leaves the complete group. |

### InputOtp templates

| Directive | Context | Description |
| --- | --- | --- |
| aerisInputOtpSeparator | index | Optional visual content between slots. The zero-based index identifies the preceding slot. |

### InputOtp methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (index?: number, options?: FocusOptions) =&gt; void | Moves focus to a clamped slot index. |
| clear | () =&gt; void | Clears an editable code and restores focus to the first slot. |

## Interfaces and types

### Interfaces

```ts
type AerisInputOtpSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputOtpAppearance = 'outline' | 'filled';
type AerisInputOtpMode = 'numeric' | 'alphanumeric';

interface AerisInputOtpCompleteEvent {
  readonly originalEvent: Event;
  readonly value: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium slot width and height. |
| `--aeris-radius-sm` | `CSS custom property` | — | Slot corner radius. |
| `--aeris-surface / --aeris-surface-2` | `CSS custom property` | — | Outlined, filled, disabled, and read-only surfaces. |
| `--aeris-border-strong` | `CSS custom property` | — | Default slot border. |
| `--aeris-primary` | `CSS custom property` | — | Hover border and caret color. |
| `--aeris-focus` | `CSS custom property` | — | Focused slot border and ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid slot border and focus ring. |

## Examples

### Basic

Provide a visible group label and bind the complete code through a single string model.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-basic-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="basic-otp-label">Verification code</span>
      <aeris-input-otp ariaLabelledby="basic-otp-label" [(value)]="code" />
      <small aria-live="polite">Value: {{ code() || 'Empty' }}</small>
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
export class OtpBasicBasicDemo {
  protected readonly code = signal('');
}
```

### Configurable length

Render the exact number of slots required by the verification flow.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-length-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="six-digit-label">Six-digit security code</span>
      <aeris-input-otp
        ariaLabelledby="six-digit-label"
        [length]="6"
        [(value)]="sixDigitCode"
      />
      <small>Enter all six digits from the authenticator.</small>
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
export class OtpLengthConfigurableLengthDemo {
}
```

### Alphanumeric codes

Alphanumeric mode accepts ASCII letters and digits while retaining the same navigation behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-alphanumeric-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="alpha-otp-label">Recovery code</span>
      <aeris-input-otp
        ariaLabelledby="alpha-otp-label"
        mode="alphanumeric"
        [length]="6"
        [(value)]="alphanumericCode"
      />
      <small aria-live="polite">Value: {{ alphanumericCode() || 'Empty' }}</small>
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
export class OtpAlphanumericAlphanumericCodesDemo {
}
```

### Masked entry

Mask sensitive access codes while preserving paste, navigation, and the complete string model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-mask-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="masked-otp-label">Private access code</span>
      <aeris-input-otp ariaLabelledby="masked-otp-label" mask [(value)]="maskedCode" />
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
export class OtpMaskMaskedEntryDemo {
}
```

### Separator template

Insert original visual grouping without changing the model or slot semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-separator-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="grouped-otp-label">Eight-digit backup code</span>
      <aeris-input-otp
        ariaLabelledby="grouped-otp-label"
        [length]="8"
        [(value)]="groupedCode"
      >
        <ng-template aerisInputOtpSeparator let-index>
          @if (index === 3) {
            <span class="otp-separator">-</span>
          }
        </ng-template>
      </aeris-input-otp>
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
    
    .otp-separator {
      color: var(--text-2);
      font-weight: 700;
    }
  `
})
export class OtpSeparatorSeparatorTemplateDemo {
}
```

### Paste and completion

Pasted compatible characters fill consecutive slots. Completion emits once when the final slot becomes populated.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInputOtp, type AerisInputOtpCompleteEvent } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-paste-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="paste-otp-label">Email code</span>
      <aeris-input-otp
        ariaLabelledby="paste-otp-label"
        [length]="6"
        (completed)="handleComplete($event)"
      />
      <small aria-live="polite">Completed: {{ completedValue() }}</small>
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
export class OtpPastePasteAndCompletionDemo {
  protected readonly completedValue =
    signal('Not completed');

  protected handleComplete(event: AerisInputOtpCompleteEvent): void {
    this.completedValue.set(event.value);
  }
}
```

### Focus behavior

Values advance automatically. Existing characters are selected on focus by default so replacement takes one keystroke.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-focus-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field-grid">
      <div class="field">
        <span id="select-focus-label">Select on focus</span>
        <aeris-input-otp ariaLabelledby="select-focus-label" value="1234" />
      </div>
      <div class="field">
        <span id="caret-focus-label">Keep caret behavior</span>
        <aeris-input-otp
          ariaLabelledby="caret-focus-label"
          value="5678"
          [selectOnFocus]="false"
        />
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
export class OtpFocusFocusBehaviorDemo {
}
```

### Sizes

Four sizes align InputOtp with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-sizes-demo',
  imports: [AerisInputOtp],
  templateUrl: './otp-sizes.demo.html',
  styleUrl: './otp-sizes.demo.scss'
})
export class OtpSizesSizesDemo {
}
```

#### HTML

```html
<div class="otp-size-grid">
  <div>
    <span>Extra small</span
    ><aeris-input-otp ariaLabel="Extra small code" value="1234" size="xs" />
  </div>
  <div>
    <span>Small</span
    ><aeris-input-otp ariaLabel="Small code" value="1234" size="sm" />
  </div>
  <div>
    <span>Medium</span><aeris-input-otp ariaLabel="Medium code" value="1234" />
  </div>
  <div>
    <span>Large</span
    ><aeris-input-otp ariaLabel="Large code" value="1234" size="lg" />
  </div>
</div>
```

#### CSS

```css
.otp-size-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.otp-size-grid > div {
  min-width: 0;
  display: grid;
  gap: 0.5rem;
}

.otp-size-grid span {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
}

@media (max-width: 42rem) {
  .otp-size-grid {
      grid-template-columns: 1fr;
    }
}
```

### Appearances and states

Filled, disabled, and read-only states preserve clear slot boundaries and native semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-states-demo',
  imports: [AerisInputOtp],
  templateUrl: './otp-states.demo.html',
  styleUrl: './otp-states.demo.scss'
})
export class OtpStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span>Filled</span
    ><aeris-input-otp ariaLabel="Filled code" value="1234" appearance="filled" />
  </div>
  <div class="field">
    <span>Disabled</span
    ><aeris-input-otp ariaLabel="Disabled code" value="1234" disabled />
  </div>
  <div class="field">
    <span>Read-only</span
    ><aeris-input-otp ariaLabel="Read-only code" value="1234" readonly />
  </div>
  <div class="field">
    <span>Fluid</span><aeris-input-otp ariaLabel="Fluid code" value="1234" fluid />
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

Application validation controls the invalid state and connected error message for the complete group.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-validation-demo',
  imports: [AerisInputOtp],
  templateUrl: './otp-validation.demo.html',
  styleUrl: './otp-validation.demo.scss'
})
export class OtpValidationValidationDemo {
  protected readonly invalidCode = signal('');
  protected readonly touched = signal(false);
  protected readonly codeInvalid = computed(
    () => this.touched() && this.invalidCode().length !== 4,
  );
}
```

#### HTML

```html
<div class="field">
  <span id="invalid-otp-label">Confirmation code</span>
  <aeris-input-otp
    ariaLabelledby="invalid-otp-label"
    ariaDescribedby="invalid-otp-message"
    [(value)]="invalidCode"
    required
    [invalid]="codeInvalid()"
    (touch)="touched.set(true)"
  />
  @if (codeInvalid()) {
    <small id="invalid-otp-message" class="error state-message"
      >Enter all four digits.</small
    >
  } @else {
    <small id="invalid-otp-message" class="state-message"
      >Four digits required.</small
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

### HTML form value

For browser-submitted forms, name serializes the current code through one hidden input.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-native-form-demo',
  imports: [AerisInputOtp],
  template: `
    <div class="field">
      <span id="native-otp-label">Authorization code</span>
      <aeris-input-otp
        ariaLabelledby="native-otp-label"
        name="authorizationCode"
        value="1234"
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
export class OtpNativeFormHTMLFormValueDemo {
}
```

### Reactive and template-driven forms

InputOtp implements ControlValueAccessor and synchronizes value, disabled state, and touched state.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputOtp } from '@aeris-ui/core/input-otp';

@Component({
  selector: 'app-otp-forms-demo',
  imports: [AerisInputOtp, FormsModule, ReactiveFormsModule],
  templateUrl: './otp-forms.demo.html',
  styleUrl: './otp-forms.demo.scss'
})
export class OtpFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveCode =
    new FormControl('1234');

  protected templateCode = '9876';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <span id="reactive-otp-label">Reactive Forms</span>
    <aeris-input-otp
      ariaLabelledby="reactive-otp-label"
      [formControl]="reactiveCode"
    />
    <small>Value: {{ reactiveCode.value || 'Empty' }}</small>
  </div>
  <div class="field">
    <span id="template-otp-label">Template-driven forms</span>
    <aeris-input-otp
      ariaLabelledby="template-otp-label"
      name="templateCode"
      [(ngModel)]="templateCode"
    />
    <small>Value: {{ templateCode || 'Empty' }}</small>
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

- The slots are native single-character inputs contained by one named group.
- Use ariaLabelledby to connect a visible label to the complete group. Each slot receives a localized position label.
- Connect format help and errors through ariaDescribedby. Required and invalid state are exposed on the group and slots.
- The first slot uses autocomplete="one-time-code" by default so supported browsers can offer received codes.
- Numeric mode requests a numeric mobile keyboard without preventing paste or assistive input.
- Masked mode hides visual characters but does not change storage or transport security.
- ControlValueAccessor synchronizes value, disabled state, and touched state with Reactive Forms and template-driven forms.
- Focus remains visible, paste is supported, and transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Accepted character` | Replaces the current slot and advances to the next slot. |
| `Arrow Left / Arrow Right` | Moves focus to the previous or next slot. |
| `Home / End` | Moves focus to the first or last slot. |
| `Backspace` | Clears the current character, or moves back and clears when the current slot is empty. |
| `Delete` | Clears the current character without moving focus. |
| `Ctrl / Command + V` | Distributes compatible pasted characters from the focused slot onward. |
| `Tab / Shift + Tab` | Moves through slots and then continues normal document navigation. |
