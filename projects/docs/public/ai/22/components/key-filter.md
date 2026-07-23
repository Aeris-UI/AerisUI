# KeyFilter

> Directive for filtering native text input with presets, custom patterns, and paste handling.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/key-filter`
- Human-readable documentation: [https://aeris-ui.dev/components/key-filter](https://aeris-ui.dev/components/key-filter)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisKeyFilter` | `AerisKeyFilterPattern` | `'alphanum'` | Preset name or developer-authored RegExp/string pattern used to evaluate the full attempted value. Malformed and overlong string patterns reject safely. |
| `validateOnly` | `boolean` | `false` | Emits rejected events for invalid input without blocking or restoring the value. |
| `allowPaste` | `boolean` | `true` | Allows paste attempts when the pasted result satisfies the filter. Set false to block paste entirely. |

### KeyFilter outputs

| Name | Type | Description |
| --- | --- | --- |
| rejected | AerisKeyFilterRejectEvent | Emitted when a key, paste, or input fallback does not satisfy the active filter. |

### KeyFilter presets

| Preset | Allows | Notes |
| --- | --- | --- |
| int | Signed integers. | Allows a leading minus sign while typing. |
| pint | Positive integers. | Digits only. |
| num | Signed decimal numbers. | Allows dot or comma decimal separators. |
| pnum | Positive decimal numbers. | Allows dot or comma decimal separators. |
| hex | Hexadecimal characters. | Case-insensitive. |
| alpha | Unicode letters. | Uses Unicode property matching. |
| alphanum | Unicode letters and numbers. | Useful for compact identifiers. |
| email | Email-safe characters. | This is character filtering, not email validation. |

## Interfaces and types

### Interfaces

```ts
type AerisKeyFilterPreset =
  | 'int'
  | 'pint'
  | 'num'
  | 'pnum'
  | 'hex'
  | 'alpha'
  | 'alphanum'
  | 'email';

type AerisKeyFilterPattern =
  | AerisKeyFilterPreset
  | RegExp
  | string;

type AerisKeyFilterRejectReason =
  | 'key'
  | 'paste'
  | 'input';

interface AerisKeyFilterRejectEvent {
  readonly originalEvent: KeyboardEvent | ClipboardEvent | InputEvent | CompositionEvent;
  readonly reason: AerisKeyFilterRejectReason;
  readonly value: string;
  readonly attemptedValue: string;
}
```

## Examples

### Basic

Use a preset to block invalid characters before they enter the field.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';

@Component({
  selector: 'app-key-filter-basic-demo',
  imports: [AerisInputText, AerisKeyFilter],
  template: `
    <div class="field">
      <label for="key-filter-basic-field">Digits only</label>
      <input
        aerisInputText
        id="key-filter-basic-field"
        aerisKeyFilter="pint"
        inputmode="numeric"
        placeholder="12345"
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
export class KeyFilterBasicBasicDemo {
}
```

### Presets

Common filters cover integers, decimals, hexadecimal values, alphabetic text, alphanumeric text, and email-safe characters.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';

@Component({
  selector: 'app-key-filter-presets-demo',
  imports: [AerisInputText, AerisKeyFilter],
  templateUrl: './key-filter-presets.demo.html',
  styleUrl: './key-filter-presets.demo.scss'
})
export class KeyFilterPresetsPresetsDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="key-filter-int">Integer</label
    ><input
      aerisInputText
      id="key-filter-int"
      aerisKeyFilter="int"
      placeholder="-42"
      fluid
    />
  </div>
  <div class="field">
    <label for="key-filter-hex">Hex</label
    ><input
      aerisInputText
      id="key-filter-hex"
      aerisKeyFilter="hex"
      placeholder="8A9EA7"
      fluid
    />
  </div>
  <div class="field">
    <label for="key-filter-alpha">Letters</label
    ><input
      aerisInputText
      id="key-filter-alpha"
      aerisKeyFilter="alpha"
      placeholder="Aeris"
      fluid
    />
  </div>
  <div class="field">
    <label for="key-filter-email">Email characters</label
    ><input
      aerisInputText
      id="key-filter-email"
      aerisKeyFilter="email"
      placeholder="alex@example.com"
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

### Numbers

Signed and positive numeric presets allow partial values while the user types, such as a leading minus sign or decimal separator.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';

@Component({
  selector: 'app-key-filter-decimals-demo',
  imports: [AerisInputText, AerisKeyFilter],
  templateUrl: './key-filter-decimals.demo.html',
  styleUrl: './key-filter-decimals.demo.scss'
})
export class KeyFilterDecimalsNumbersDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="key-filter-num">Signed decimal</label
    ><input
      aerisInputText
      id="key-filter-num"
      aerisKeyFilter="num"
      inputmode="decimal"
      placeholder="-12.5"
      fluid
    />
  </div>
  <div class="field">
    <label for="key-filter-pnum">Positive decimal</label
    ><input
      aerisInputText
      id="key-filter-pnum"
      aerisKeyFilter="pnum"
      inputmode="decimal"
      placeholder="12.5"
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

### Custom pattern

Pass a RegExp when the allowed value shape is application-specific.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-key-filter-custom-demo',
  imports: [AerisInputText],
  template: `
    <div class="field">
      <label for="key-filter-uppercase">Uppercase code</label>
      <input
        aerisInputText
        id="key-filter-uppercase"
        [aerisKeyFilter]="uppercasePattern"
        placeholder="AERIS"
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
export class KeyFilterCustomCustomPatternDemo {
  protected readonly uppercasePattern = /^[A-Z]*$/;
}
```

### Validate only

Use validateOnly when you want to observe invalid attempts without blocking native editing.

#### TS

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisKeyFilter, type AerisKeyFilterRejectEvent } from '@aeris-ui/core/key-filter';

@Component({
  selector: 'app-key-filter-validate-only-demo',
  imports: [AerisInputText, AerisKeyFilter, FormsModule],
  template: `
    <div class="field">
      <label for="key-filter-validate">Observe letters</label>
      <input
        aerisInputText
        id="key-filter-validate"
        aerisKeyFilter="alpha"
        validateOnly
        [(ngModel)]="validateOnlyValue"
        (rejected)="recordRejected($event)"
        placeholder="Try typing 123"
        fluid
      />
      <small aria-live="polite">Rejected: {{ rejectedValue() }}</small>
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
export class KeyFilterValidateOnlyValidateOnlyDemo {
  protected validateOnlyValue = '';

  protected recordRejected(event: AerisKeyFilterRejectEvent): void {
    this.rejectedValue.set(`${event.reason}: ${event.attemptedValue || 'empty'}`);
  }
}
```

### Textarea

The directive also works on textarea elements for short constrained notes or codes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-key-filter-textarea-demo',
  imports: [AerisKeyFilter, AerisTextarea],
  template: `
    <div class="field">
      <label for="key-filter-textarea-field">Alphanumeric note</label>
      <textarea
        aerisTextarea
        id="key-filter-textarea-field"
        fluid
        aerisKeyFilter="alphanum"
        rows="3"
        placeholder="Letters and numbers only"
      ></textarea>
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
export class KeyFilterTextareaTextareaDemo {
}
```

### Reactive and template-driven forms

Because KeyFilter is a directive on the native control, the control keeps its normal Angular Forms behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisKeyFilter } from '@aeris-ui/core/key-filter';

@Component({
  selector: 'app-key-filter-forms-demo',
  imports: [AerisInputText, AerisKeyFilter, FormsModule, ReactiveFormsModule],
  templateUrl: './key-filter-forms.demo.html',
  styleUrl: './key-filter-forms.demo.scss'
})
export class KeyFilterFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveCode = new FormControl('');
  protected templateCode = '';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="key-filter-reactive">Reactive Forms</label>
    <input
      aerisInputText
      id="key-filter-reactive"
      aerisKeyFilter="hex"
      [formControl]="reactiveCode"
      fluid
    />
    <small>Value: {{ reactiveCode.value || 'Empty' }}</small>
  </div>
  <div class="field">
    <label for="key-filter-template">Template-driven forms</label>
    <input
      aerisInputText
      id="key-filter-template"
      name="templateCode"
      aerisKeyFilter="pint"
      [(ngModel)]="templateCode"
      fluid
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

- KeyFilter preserves native input and textarea semantics, including labels, selection, form submission, and browser autofill behavior.
- Use visible help text to describe the accepted format. Character filtering should not be the only validation feedback.
- The email preset filters characters only; still validate email addresses with Angular or server-side validators.
- Custom RegExp and string patterns are executable developer configuration. Do not construct them from untrusted input; malformed or overlong patterns reject input safely.
- IME composition is not blocked while composing text. Final input is checked after composition completes.
- Use validateOnly when blocking input could be disruptive for assistive technology or custom validation flows.

### Keyboard support

| Key | Function |
| --- | --- |
| `Printable keys` | Accepted when the attempted value matches the active filter; otherwise blocked unless validateOnly is enabled. |
| `Backspace / Delete` | Uses native editing behavior. |
| `Arrow keys` | Uses native caret movement and selection behavior. |
| `Ctrl / Command shortcuts` | Uses native copy, paste, cut, undo, redo, and select-all behavior. Paste is filtered as a full attempted value. |
