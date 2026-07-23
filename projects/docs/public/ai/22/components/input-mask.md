# InputMask

> Accessible inputmask component for Angular.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/input-mask`
- Human-readable documentation: [https://aeris-ui.dev/components/input-mask](https://aeris-ui.dev/components/input-mask)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisInputMask } from '@aeris-ui/core/input-mask';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Formatted or raw value, depending on unmask. |
| `mask` | `string` | `required` | Mask grammar applied to user input. |
| `inputId` | `string` | `generated` | ID assigned to the internal input. |
| `name` | `string` | `''` | Native input name. |
| `placeholder` | `string` | `''` | Custom placeholder that overrides the generated mask placeholder. |
| `autocomplete` | `string` | `'off'` | Native autocomplete hint. |
| `inputMode` | `string` | `'text'` | Virtual keyboard hint such as tel or numeric. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name when no visible label is associated. |
| `ariaLabelledby` | `string &#124; undefined` | `undefined` | IDs of elements that label the input. |
| `ariaDescribedby` | `string &#124; undefined` | `undefined` | IDs of help and validation messages. |
| `slotChar` | `string` | `'_'` | Character used for empty mask slots. |
| `showMask` | `boolean` | `false` | Displays all literals and empty slots in the field. |
| `unmask` | `boolean` | `false` | Stores only accepted slot characters in the value model. |
| `autoClear` | `boolean` | `false` | Clears incomplete input when focus leaves the field. |
| `clearable` | `boolean` | `false` | Shows an inline clear button while a value is present. |
| `clearButtonAriaLabel` | `string` | `'Clear value'` | Accessible name for the clear button. |
| `size` | `AerisInputMaskSize` | `'md'` | Control height and typography size. |
| `appearance` | `AerisInputMaskAppearance` | `'outline'` | Outlined or filled visual treatment. |
| `disabled` | `boolean` | `false` | Disables input and clear interaction. |
| `readonly` | `boolean` | `false` | Allows focus and selection without editing. |
| `required` | `boolean` | `false` | Exposes native required semantics. |
| `invalid` | `boolean` | `false` | Applies invalid styling and aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |

### InputMask outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange | string | Emitted automatically by the value model. |
| valueInput | string | Emitted when user interaction changes the value. |
| completed | string | Emitted when every required mask slot becomes populated. |
| focused | FocusEvent | Emitted when the internal input receives focus. |
| blurred | FocusEvent | Emitted after optional auto-clear processing. |
| touch | void | Emitted on blur for Signal Forms integration. |

### InputMask methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | (options?: FocusOptions) =&gt; void | Moves focus to the internal input. |
| reset | () =&gt; void | Clears the value model. |
| clear | () =&gt; void | Clears an editable value and restores focus. |

### InputMask grammar

| Token | Accepts | Example |
| --- | --- | --- |
| 9 | Any Unicode decimal digit. | 999-999 |
| a | Any Unicode letter. | aaa-999 |
| * | Any Unicode letter or digit. | **-999 |
| \ | Treats the next token character as a literal. | \9-99 |

## Interfaces and types

### Interfaces

```ts
type AerisInputMaskSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisInputMaskAppearance = 'outline' | 'filled';

// Mask grammar
// 9  Unicode digit
// a  Unicode letter
// *  Unicode letter or digit
// \  Escape the next mask character
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-control-height` | `CSS custom property` | — | Medium field height. |
| `--aeris-radius-sm` | `CSS custom property` | — | Field and clear-button radius. |
| `--aeris-surface` | `CSS custom property` | — | Outlined field background. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled and read-only background. |
| `--aeris-border-strong` | `CSS custom property` | — | Default field border. |
| `--aeris-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border and focus ring. |

## Examples

### Basic

A phone mask accepts only characters allowed by each slot and inserts literals automatically.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-basic-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-phone">Phone number</label>
      <aeris-input-mask
        inputId="mask-phone"
        mask="+9 (999) 999-9999"
        inputMode="tel"
        [(value)]="phone"
        fluid
      />
      <small class="mask-result" aria-live="polite"
        >Value: {{ phone() || 'Empty' }}</small
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
    
    .mask-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }
  `
})
export class MaskBasicBasicDemo {
}
```

### Mask tokens

Combine digit, letter, alphanumeric, and escaped literal tokens into original application-specific patterns.

#### TS

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-mask-patterns-demo',
  imports: [],
  template: `
    9
  `,
  styles: `
    .mask-token-list {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }
    
    .mask-token-list div {
      display: grid;
      gap: 0.25rem;
      padding: 1rem;
      border: 1px solid var(--aeris-border);
      border-radius: 0.625rem;
      background: var(--aeris-surface-2);
    }
    
    .mask-token-list code {
      color: var(--aeris-primary-text);
      font-size: 1rem;
      font-weight: 700;
    }
    
    .mask-token-list span {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    
    @media (max-width: 42rem) {
      .mask-token-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
  `
})
export class MaskPatternsMaskTokensDemo {
}
```

### Placeholder and slots

Use a normal placeholder, or display the complete mask with a custom empty-slot character.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-placeholder-demo',
  imports: [AerisInputMask],
  templateUrl: './mask-placeholder.demo.html',
  styleUrl: './mask-placeholder.demo.scss'
})
export class MaskPlaceholderPlaceholderAndSlotsDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="mask-placeholder-custom">Postal code</label
    ><aeris-input-mask
      inputId="mask-placeholder-custom"
      mask="99999"
      placeholder="Enter postal code"
      fluid
    />
  </div>
  <div class="field">
    <label for="mask-placeholder-slots">Account code</label
    ><aeris-input-mask
      inputId="mask-placeholder-slots"
      mask="aa-9999"
      showMask
      slotChar="·"
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

### Unmasked value

Set unmask when the model should contain only accepted slot characters while the field remains formatted.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-unmasked-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-raw-phone">Phone number</label>
      <aeris-input-mask
        inputId="mask-raw-phone"
        mask="(999) 999-9999"
        inputMode="tel"
        unmask
        [(value)]="rawPhone"
        fluid
      />
      <small class="mask-result" aria-live="polite"
        >Raw value: {{ rawPhone() || 'Empty' }}</small
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
    
    .mask-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }
  `
})
export class MaskUnmaskedUnmaskedValueDemo {
}
```

### Completion

The completed output fires once when the final required slot is filled.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-complete-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-complete-code">Access code</label>
      <aeris-input-mask
        inputId="mask-complete-code"
        mask="999-999"
        (completed)="completedValue.set($event)"
        fluid
      />
      <small class="mask-result" aria-live="polite"
        >Completed: {{ completedValue() }}</small
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
    
    .mask-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }
  `
})
export class MaskCompleteCompletionDemo {
  protected readonly completedValue = signal('Not completed');

  protected handleComplete(value: string): void {
    this.completedValue.set(value);
  }
}
```

### Auto clear

Incomplete values can be cleared on blur when partial structured data is not useful.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-auto-clear-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-auto-clear-field">Verification code</label>
      <aeris-input-mask
        inputId="mask-auto-clear-field"
        mask="999-999"
        autoClear
        ariaDescribedby="mask-auto-clear-help"
        fluid
      />
      <small id="mask-auto-clear-help"
        >Enter all six digits before leaving the field.</small
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
export class MaskAutoClearAutoClearDemo {
}
```

### Clear button

An optional suffix button clears the value and restores focus to the field.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-clearable-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-clearable-field">Serial number</label>
      <aeris-input-mask
        inputId="mask-clearable-field"
        mask="aa99aa"
        clearable
        [(value)]="serial"
        fluid
      />
      <small class="mask-result" aria-live="polite"
        >Value: {{ serial() || 'Empty' }}</small
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
    
    .mask-result {
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }
  `
})
export class MaskClearableClearButtonDemo {
}
```

### Sizes

Four sizes align InputMask with the Aeris density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-sizes-demo',
  imports: [AerisInputMask],
  templateUrl: './mask-sizes.demo.html',
  styleUrl: './mask-sizes.demo.scss'
})
export class MaskSizesSizesDemo {
}
```

#### HTML

```html
<div class="field-row">
  <label class="size-sample"
    ><span>Extra small</span
    ><aeris-input-mask
      ariaLabel="Extra small code"
      mask="999-999"
      size="xs"
      [value]="'123456'"
  /></label>
  <label class="size-sample"
    ><span>Small</span
    ><aeris-input-mask
      ariaLabel="Small code"
      mask="999-999"
      size="sm"
      [value]="'123456'"
  /></label>
  <label class="size-sample"
    ><span>Medium</span
    ><aeris-input-mask ariaLabel="Medium code" mask="999-999" [value]="'123456'"
  /></label>
  <label class="size-sample"
    ><span>Large</span
    ><aeris-input-mask
      ariaLabel="Large code"
      mask="999-999"
      size="lg"
      [value]="'123456'"
  /></label>
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

### Appearances and states

Filled, invalid, read-only, and disabled states preserve clear semantics and contrast.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-states-demo',
  imports: [AerisInputMask],
  templateUrl: './mask-states.demo.html',
  styleUrl: './mask-states.demo.scss'
})
export class MaskStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="mask-filled">Filled</label
    ><aeris-input-mask
      inputId="mask-filled"
      mask="999-999"
      appearance="filled"
      [value]="'123456'"
      fluid
    />
  </div>
  <div class="field">
    <label for="mask-invalid">Invalid</label
    ><aeris-input-mask
      inputId="mask-invalid"
      mask="999-999"
      [value]="'123'"
      invalid
      ariaDescribedby="mask-error"
      fluid
    /><small id="mask-error" class="error">Enter the complete code.</small>
  </div>
  <div class="field">
    <label for="mask-readonly">Read-only</label
    ><aeris-input-mask
      inputId="mask-readonly"
      mask="aa-999"
      [value]="'AB123'"
      readonly
      fluid
    />
  </div>
  <div class="field">
    <label for="mask-disabled">Disabled</label
    ><aeris-input-mask
      inputId="mask-disabled"
      mask="aa-999"
      [value]="'AB123'"
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

.field small.error {
  color: var(--aeris-danger);
}
```

### Fluid layout

Fluid fields fill their parent and adapt to narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-fluid-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-fluid-field">International phone</label>
      <aeris-input-mask
        inputId="mask-fluid-field"
        mask="+999 99 999 9999"
        inputMode="tel"
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
export class MaskFluidFluidLayoutDemo {
}
```

### Signal Forms contract

The value model supports direct signal binding and structurally satisfies Angular 22 FormValueControl.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-signals-demo',
  imports: [AerisInputMask],
  template: `
    <div class="field">
      <label for="mask-signal-field">Phone</label>
      <aeris-input-mask
        inputId="mask-signal-field"
        mask="+9 (999) 999-9999"
        [(value)]="phone"
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
export class MaskSignalsSignalFormsContractDemo {
  protected readonly phone = signal('');

  // The value model structurally satisfies Angular 22 Signal Forms'
  // FormValueControl<string> contract.
}
```

### Reactive and template-driven forms

InputMask implements ControlValueAccessor while preserving formatted or unmasked model behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputMask } from '@aeris-ui/core/input-mask';

@Component({
  selector: 'app-mask-angular-forms-demo',
  imports: [AerisInputMask, FormsModule, ReactiveFormsModule],
  templateUrl: './mask-angular-forms.demo.html',
  styleUrl: './mask-angular-forms.demo.scss'
})
export class MaskAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveMask =
    new FormControl('123-456');

  protected templateMask = '987-654';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="reactive-mask">Reactive Forms</label>
    <aeris-input-mask
      inputId="reactive-mask"
      mask="999-999"
      [formControl]="reactiveMask"
      fluid
    />
    <small>Value: {{ reactiveMask.value || 'Empty' }}</small>
  </div>
  <div class="field">
    <label for="template-mask">Template-driven forms</label>
    <aeris-input-mask
      inputId="template-mask"
      name="templateMask"
      mask="999-999"
      [(ngModel)]="templateMask"
      fluid
    />
    <small>Value: {{ templateMask || 'Empty' }}</small>
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

- InputMask preserves native text-input semantics, keyboard editing, selection, paste, and autofill behavior.
- Associate a visible label through inputId, or provide ariaLabel when no visible label exists.
- Describe the expected format in visible help text connected through ariaDescribedby; do not rely on the mask alone.
- The invalid input synchronizes visual state with aria-invalid.
- Choose an appropriate inputMode to provide a useful mobile keyboard without restricting assistive input.
- The clear button has a configurable accessible name, appears only when usable, and restores focus after clearing.
- ControlValueAccessor support synchronizes values, touched state, and disabled state with Reactive Forms and template-driven forms.
- Slot characters are visual guidance rather than validation messages. Completion and errors should be communicated separately.
- Focus indicators meet the WCAG 2.2 target and transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the masked input and clear action. |
| `Arrow Left / Arrow Right` | Moves the caret through editable and literal mask positions. |
| `Home / End` | Moves to the start or end of the masked value. |
| `Backspace / Delete` | Removes editable characters while preserving mask literals. |
| `Ctrl / Command + V` | Pastes compatible content into the mask using native input behavior. |
| `Enter / Space` | Activates the clear button when that button is focused. |
