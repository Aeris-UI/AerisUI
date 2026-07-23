# Textarea

> Accessible textarea component for Angular.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/textarea`
- Human-readable documentation: [https://aeris-ui.dev/components/textarea](https://aeris-ui.dev/components/textarea)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTextarea } from '@aeris-ui/core/textarea';
```

## API

### Directive Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `AerisTextareaSize` | `'md'` | Sets the padding, font size, and minimum height. |
| `appearance` | `AerisTextareaAppearance` | `'outline'` | Selects the outlined or filled surface treatment. |
| `resize` | `AerisTextareaResize` | `'vertical'` | Controls the native browser resize handle. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Expands the textarea to its container width. |

### Wrapper Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | Current value with two-way binding support. |
| `inputId` | `string` | `generated` | ID assigned to the internal native textarea. |
| `name` | `string` | `''` | Native form control name. |
| `placeholder` | `string` | `''` | Native placeholder text. |
| `autocomplete` | `string` | `'off'` | Native autocomplete hint. |
| `rows` | `number` | `3` | Initial visible row count. |
| `cols` | `number &#124; undefined` | `undefined` | Native suggested column count. |
| `wrap` | `'soft' &#124; 'hard' &#124; 'off'` | `'soft'` | Controls native line wrapping and submitted values. |
| `minLength` | `number &#124; undefined` | `undefined` | Native minimum character constraint. |
| `maxLength` | `number &#124; undefined` | `undefined` | Native maximum character constraint. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label is available. |
| `ariaLabelledby` | `string` | `''` | IDs of elements that label the textarea. |
| `ariaDescribedby` | `string` | `''` | IDs of help or validation messages. |
| `size` | `AerisTextareaSize` | `'md'` | Sets the padding, font size, and minimum height. |
| `appearance` | `AerisTextareaAppearance` | `'outline'` | Selects the outlined or filled surface treatment. |
| `resize` | `AerisTextareaResize` | `'vertical'` | Controls the native browser resize handle. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Expands the textarea to its container width. |
| `disabled` | `boolean` | `false` | Disables editing and the clear action. |
| `readonly` | `boolean` | `false` | Allows focus and selection without editing. |
| `required` | `boolean` | `false` | Exposes native required semantics. |
| `autoResize` | `boolean` | `false` | Grows the control vertically with its content. |
| `minRows` | `number` | `3` | Minimum rows used by automatic resizing. |
| `maxRows` | `number &#124; undefined` | `undefined` | Maximum rows before vertical scrolling begins. |
| `showCount` | `boolean` | `false` | Displays the current character count. |
| `countLive` | `boolean` | `false` | Announces counter changes through a polite live region. |
| `clearable` | `boolean` | `false` | Shows an accessible clear button while a value exists. |
| `clearButtonAriaLabel` | `string` | `'Clear text'` | Accessible name for the clear button. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueChange` | `string` | `-` | Emits for two-way value model changes. |
| `valueInput` | `string` | `-` | Emits whenever user input changes the value. |
| `focused` | `FocusEvent` | `-` | Emits when the internal textarea receives focus. |
| `blurred` | `FocusEvent` | `-` | Emits when the internal textarea loses focus. |
| `scrolled` | `Event` | `-` | Emits when textarea content scrolls. |
| `touch` | `void` | `-` | Emits when blur marks the control as touched. |
| `cleared` | `void` | `-` | Emits after the clear action succeeds. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `void` | `-` | Moves focus to the native textarea. |
| `clear()` | `void` | `-` | Clears an editable value and restores focus. |
| `reset()` | `void` | `-` | Sets the value to an empty string. |
| `resizeToContent()` | `void` | `-` | Recalculates height when autoResize is enabled. |

### Textarea native API

| Category | Examples | Behavior |
| --- | --- | --- |
| Attributes | rows, cols, wrap, placeholder, name | Remain available on the native textarea. |
| Constraints | required, minlength, maxlength, disabled, readonly | Use native browser and Angular Forms semantics. |
| Events | input, change, focus, blur, keydown, scroll | Bind native DOM events directly. |

## Interfaces and types

### Interfaces

```ts
type AerisTextareaSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg';

type AerisTextareaAppearance =
  | 'outline'
  | 'filled';

type AerisTextareaResize =
  | 'none'
  | 'vertical'
  | 'horizontal'
  | 'both';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-radius-sm` | `CSS custom property` | — | Corner radius. |
| `--aeris-surface` | `CSS custom property` | — | Outlined background. |
| `--aeris-surface-2` | `CSS custom property` | — | Filled and read-only background. |
| `--aeris-border-strong` | `CSS custom property` | — | Default border. |
| `--aeris-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-danger` | `CSS custom property` | — | Invalid border and ring. |
| `--aeris-text` | `CSS custom property` | — | Entered text. |
| `--aeris-text-2` | `CSS custom property` | — | Placeholder, counter, and clear action. |

## Examples

### Basic

Apply the directive to a native textarea and associate it with a visible label.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-basic-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-basic-example">Project description</label>
      <textarea
        id="textarea-basic-example"
        aerisTextarea
        fluid
        rows="4"
        placeholder="Describe the project goals"
        aria-describedby="textarea-basic-help"
      ></textarea>
      <small id="textarea-basic-help">Include the audience and intended outcome.</small>
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
export class TextareaBasicBasicDemo {
}
```

### Signal value

The wrapper exposes a model input for concise signal-based two-way binding.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-signal-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-signal-example">Release notes</label>
      <aeris-textarea inputId="textarea-signal-example" fluid [(value)]="notes" />
      <small aria-live="polite">{{ notes().length }} characters</small>
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
export class TextareaSignalSignalValueDemo {
  protected readonly notes = signal(
    'Aeris keeps multiline content comfortable to read and edit.',
  );
}
```

### Auto resize

The wrapper grows vertically as content wraps, removing the manual resize handle.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-auto-resize-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-auto-example">Meeting notes</label>
      <aeris-textarea
        inputId="textarea-auto-example"
        placeholder="Add another line to see the field grow"
        autoResize
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
export class TextareaAutoResizeAutoResizeDemo {
}
```

### Auto resize bounds

Set minimum and maximum rows. Content scrolls after reaching the maximum height.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-auto-resize-bounds-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-bounded-example">Implementation details</label>
      <aeris-textarea
        inputId="textarea-bounded-example"
        autoResize
        [minRows]="2"
        [maxRows]="6"
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
export class TextareaAutoResizeBoundsAutoResizeBoundsDemo {
}
```

### Character counter

Display the current count with an optional native maximum length.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-counter-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-counter-example">Short summary</label>
      <aeris-textarea
        inputId="textarea-counter-example"
        [(value)]="summary"
        [maxLength]="120"
        showCount
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
export class TextareaCounterCharacterCounterDemo {
}
```

### Sizes

Four sizes align the textarea with the Aeris control density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-sizes-demo',
  imports: [AerisTextarea],
  template: `
    <div class="textarea-size-grid">
      <label
        >Extra small<textarea aerisTextarea size="xs" rows="2" fluid></textarea>
      </label>
      <label>Small<textarea aerisTextarea size="sm" rows="2" fluid></textarea></label>
      <label>Medium<textarea aerisTextarea size="md" rows="3" fluid></textarea></label>
      <label>Large<textarea aerisTextarea size="lg" rows="3" fluid></textarea></label>
    </div>
  `,
  styles: `
    .textarea-size-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      align-items: start;
    }
    
    .textarea-size-grid label {
      display: grid;
      gap: 0.4rem;
      color: var(--aeris-text);
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    @media (max-width: 42rem) {
      .textarea-size-grid {
          grid-template-columns: 1fr;
        }
    }
  `
})
export class TextareaSizesSizesDemo {
}
```

### Appearances

Choose an outlined field or a quieter filled surface.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-appearances-demo',
  imports: [AerisTextarea],
  templateUrl: './textarea-appearances.demo.html',
  styleUrl: './textarea-appearances.demo.scss'
})
export class TextareaAppearancesAppearancesDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="textarea-outline">Outline</label>
    <textarea
      id="textarea-outline"
      aerisTextarea
      appearance="outline"
      fluid
    ></textarea>
  </div>
  <div class="field">
    <label for="textarea-filled">Filled</label>
    <textarea id="textarea-filled" aerisTextarea appearance="filled" fluid></textarea>
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

### Resize directions

Choose the browser resize behavior that fits the surrounding layout.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-resize-demo',
  imports: [AerisTextarea],
  templateUrl: './textarea-resize.demo.html',
  styleUrl: './textarea-resize.demo.scss'
})
export class TextareaResizeResizeDirectionsDemo {
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="textarea-resize-none">None</label>
    <textarea id="textarea-resize-none" aerisTextarea resize="none" fluid></textarea>
  </div>
  <div class="field">
    <label for="textarea-resize-vertical">Vertical</label>
    <textarea
      id="textarea-resize-vertical"
      aerisTextarea
      resize="vertical"
      fluid
    ></textarea>
  </div>
  <div class="field">
    <label for="textarea-resize-horizontal">Horizontal</label>
    <textarea
      id="textarea-resize-horizontal"
      aerisTextarea
      resize="horizontal"
      fluid
    ></textarea>
  </div>
  <div class="field">
    <label for="textarea-resize-both">Both</label>
    <textarea id="textarea-resize-both" aerisTextarea resize="both" fluid></textarea>
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

State inputs preserve native focus, editing, submission, and assistive technology behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-states-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field-grid">
                    <div class="field">
                      <label for="textarea-disabled">Disabled</label>
                      <textarea id="textarea-disabled" aerisTextarea fluid disabled>
    Unavailable content</textarea>
                    </div>
                    <div class="field">
                      <label for="textarea-readonly">Read-only</label>
                      <textarea id="textarea-readonly" aerisTextarea fluid readonly>
    Approved content</textarea>
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
export class TextareaStatesDisabledAndReadOnlyDemo {
}
```

### Validation

Invalid styling is paired with aria-invalid and a stable, described error region.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-validation-demo',
  imports: [AerisTextarea],
  templateUrl: './textarea-validation.demo.html',
  styleUrl: './textarea-validation.demo.scss'
})
export class TextareaValidationValidationDemo {
  protected readonly feedback = signal('');
  protected readonly feedbackTouched = signal(false);
  protected readonly feedbackInvalid = computed(
    () =>
      this.feedbackTouched() &&
      this.feedback().trim().length < 10,
  );
}
```

#### HTML

```html
<div class="field">
  <label for="textarea-feedback">Feedback</label>
  <textarea
    id="textarea-feedback"
    aerisTextarea
    fluid
    required
    [value]="feedback()"
    [invalid]="feedbackInvalid()"
    aria-describedby="textarea-feedback-error"
    (input)="updateFeedback($event)"
    (blur)="feedbackTouched.set(true)"
  ></textarea>
  <small
    id="textarea-feedback-error"
    class="validation-message"
    [class.error]="feedbackInvalid()"
    aria-live="polite"
    >{{
      feedbackInvalid() ? 'Enter at least 10 characters.' : 'Minimum 10 characters.'
    }}</small
  >
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

.validation-message {
  min-height: 1.25rem;
}
```

### Fluid layout

Fluid textareas fill their parent and adapt cleanly to narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-fluid-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-fluid-example">Additional context</label>
      <textarea id="textarea-fluid-example" aerisTextarea fluid></textarea>
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
export class TextareaFluidFluidLayoutDemo {
}
```

### Clear button

The wrapper provides an accessible suffix action that clears the value and returns focus.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-clear-demo',
  imports: [AerisTextarea],
  template: `
    <div class="field">
      <label for="textarea-clear-example">Draft message</label>
      <aeris-textarea
        inputId="textarea-clear-example"
        value="This draft can be cleared."
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
export class TextareaClearClearButtonDemo {
}
```

### Reactive and template-driven forms

The native directive uses Angular's built-in textarea accessor, while the wrapper provides its own ControlValueAccessor.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-textarea-angular-forms-demo',
  imports: [AerisTextarea, FormsModule, ReactiveFormsModule],
  templateUrl: './textarea-angular-forms.demo.html',
  styleUrl: './textarea-angular-forms.demo.scss'
})
export class TextareaAngularFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveText =
    new FormControl('Reactive form value');

  protected templateText = 'Template-driven value';
}
```

#### HTML

```html
<div class="field-grid">
  <div class="field">
    <label for="textarea-reactive">Reactive Forms</label>
    <textarea
      id="textarea-reactive"
      aerisTextarea
      fluid
      [formControl]="reactiveText"
    ></textarea>
    <small>Value: {{ reactiveText.value || 'Empty' }}</small>
  </div>
  <div class="field">
    <label for="textarea-template">Template-driven forms</label>
    <aeris-textarea
      inputId="textarea-template"
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

- The native directive preserves textarea semantics, keyboard editing, selection, resizing, and form submission.
- Associate a visible label using matching for and id values. Do not rely on placeholder text as the accessible name.
- Use aria-describedby for help text and validation messages. The invalid input synchronizes aria-invalid.
- Use aria-live conservatively. Enable countLive only when announcing every character count change is useful.
- The clear button has a configurable accessible name, is keyboard operable, and returns focus to the textarea.
- Automatic resizing does not move focus or alter the text cursor. A maximum row count restores internal scrolling for long content.
- Both the native directive and wrapper support Reactive Forms and template-driven forms. The value model also supports signal-based state.
- Focus styles meet WCAG 2.2 AA contrast requirements and visual transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the textarea and any clear action. |
| `Arrow keys` | Moves the text caret through lines and characters. |
| `Enter` | Inserts a new line at the caret. |
| `Home / End` | Moves the caret to the start or end of the current line. |
| `Ctrl / Command + Home / End` | Moves to the start or end of the complete value using native platform behavior. |
| `Backspace / Delete` | Removes selected text or the character beside the caret. |
| `Enter / Space` | Activates the clear button when that button is focused. |
