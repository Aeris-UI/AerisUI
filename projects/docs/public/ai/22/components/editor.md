# Editor

> Rich text editing with optional Lexical peers, accessible toolbar controls, and Forms support.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/editor`
- Human-readable documentation: [https://aeris-ui.dev/components/editor](https://aeris-ui.dev/components/editor)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
npm install lexical @lexical/history @lexical/html @lexical/list @lexical/rich-text @lexical/selection

import { AerisEditor } from '@aeris-ui/core/editor';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string (model)` | `''` | HTML content value with two-way binding and Forms support. Incoming HTML is sanitized before Lexical imports supported nodes. |
| `inputId` | `string` | `''` | ID applied to the editable textbox. |
| `name` | `string` | `''` | Adds a hidden input for native form submission of the HTML value. |
| `placeholder` | `string` | `'Write something...'` | Placeholder text shown while the editor is empty and not focused. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible label exists. |
| `ariaLabelledby` | `string` | `''` | IDs of visible elements that label the editor. |
| `ariaDescribedby` | `string` | `''` | IDs of help and validation messages. |
| `toolbarAriaLabel` | `string` | `'Formatting tools'` | Accessible name for the toolbar. |
| `size` | `AerisEditorSize` | `'md'` | Controls editor typography and padding. |
| `appearance` | `AerisEditorAppearance` | `'outline'` | Outlined or filled surface treatment. |
| `minHeight` | `string` | `'12rem'` | Minimum content area height. |
| `formats` | `readonly AerisEditorFormat[]` | `AERIS_EDITOR_DEFAULT_FORMATS` | Controls which toolbar actions are rendered. Use AERIS_EDITOR_ALL_FORMATS for every built-in action. |
| `namespace` | `string` | `'AerisEditor'` | Lexical namespace used when creating the editor instance. |
| `lexicalTheme` | `EditorThemeClasses` | `{}` | Merges consumer Lexical theme classes over the Aeris editor theme. |
| `htmlConfig` | `HTMLConfig` | `{}` | Adds Lexical HTML import and export conversions for custom or third-party nodes. |
| `extensions` | `readonly AerisEditorExtension[]` | `[]` | Registers additional Lexical nodes, commands, transforms, listeners, and feature packages when the editor is created. |
| `showToolbar` | `boolean` | `true` | Shows or hides the formatting toolbar. |
| `disabled` | `boolean` | `false` | Disables editing, focus, and toolbar actions. |
| `readonly` | `boolean` | `false` | Prevents editing while keeping the content readable. |
| `required` | `boolean` | `false` | Adds required semantics for assistive technology. |
| `invalid` | `boolean` | `false` | Applies invalid styling and synchronizes aria-invalid. |
| `fluid` | `boolean` | `false` | Fills the available inline space. |

### Editor outputs

| Name | Type | Description |
| --- | --- | --- |
| valueChange | string | Model output emitted by two-way binding. |
| valueInput | string | Emits the current HTML value after editor updates. |
| changed | AerisEditorChangeEvent | Emits HTML and plain text content after editor updates. |
| focused | FocusEvent | Emits when the editable textbox receives focus. |
| blurred | FocusEvent | Emits when the editable textbox loses focus. |
| touch | void | Emits when focus leaves the complete editor component. |
| ready | LexicalEditor | Emits the created Lexical editor after built-in and consumer extensions are registered. |

### Editor methods

| Name | Signature | Description |
| --- | --- | --- |
| focus | () =&gt; void | Moves focus to the editable textbox. |
| clear | () =&gt; void | Clears editable content and restores focus. |
| reset | () =&gt; void | Alias for clearing editable content. |
| format | (format) =&gt; void | Toggles any supported Lexical text format on the current selection. |
| setBlock | (block) =&gt; void | Changes the current block to paragraph, heading, or quote. |
| toggleBulletList | () =&gt; void | Applies a bulleted list to the current selection. |
| toggleNumberedList | () =&gt; void | Applies a numbered list to the current selection. |
| toggleCheckList | () =&gt; void | Applies an interactive checklist to the current selection. |
| removeList | () =&gt; void | Removes list formatting from the current selection. |
| undo | () =&gt; void | Runs editor undo. |
| redo | () =&gt; void | Runs editor redo. |
| align | (alignment) =&gt; void | Aligns selected blocks using physical or RTL-aware logical alignment. |
| indent | () =&gt; void | Increases indentation for the current block or list item. |
| outdent | () =&gt; void | Decreases indentation for the current block or list item. |
| clearFormatting | () =&gt; void | Removes inline formats and inline styles from the current selection. |
| getLexicalEditor | () =&gt; LexicalEditor &#124; null | Returns the underlying editor for advanced command dispatch and state access. |

## Interfaces and types

### Interfaces

```ts
import type {
  LexicalEditor,
  LexicalNodeConfig,
} from 'lexical';

type AerisEditorSize = 'sm' | 'md' | 'lg';
type AerisEditorAppearance = 'outline' | 'filled';
type AerisEditorBlock =
  | 'paragraph'
  | 'heading'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'quote';

type AerisEditorAlignment =
  | 'left'
  | 'start'
  | 'center'
  | 'right'
  | 'end'
  | 'justify';

type AerisEditorFormat =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'highlight'
  | 'subscript'
  | 'superscript'
  | 'lowercase'
  | 'uppercase'
  | 'capitalize'
  | 'paragraph'
  | 'heading'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'quote'
  | 'bulletList'
  | 'numberedList'
  | 'checkList'
  | 'alignLeft'
  | 'alignStart'
  | 'alignCenter'
  | 'alignRight'
  | 'alignEnd'
  | 'alignJustify'
  | 'outdent'
  | 'indent'
  | 'clear'
  | 'undo'
  | 'redo';

interface AerisEditorExtension {
  readonly nodes?: readonly LexicalNodeConfig[];
  readonly setup?: (editor: LexicalEditor) => void | (() => void);
}

interface AerisEditorChangeEvent {
  readonly value: string;
  readonly textContent: string;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-surface / --aeris-surface-2` | `CSS custom property` | — | Editor surface, toolbar, and filled appearance. |
| `--aeris-border` | `CSS custom property` | — | Editor and toolbar borders. |
| `--aeris-primary / --aeris-primary-soft` | `CSS custom property` | — | Quote accent and active toolbar background. |
| `--aeris-warning` | `CSS custom property` | — | Text highlight color. |
| `--aeris-text / --aeris-text-muted` | `CSS custom property` | — | Editable content, placeholder, and quote text. |
| `--aeris-focus` | `CSS custom property` | — | Focus border and ring. |
| `--aeris-radius-sm / --aeris-radius-md` | `CSS custom property` | — | Toolbar buttons and editor radius. |

## Examples

### Basic

Bind the HTML value with a signal model and connect the editor to a visible label.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisEditor } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-basic-demo',
  imports: [AerisEditor],
  template: `
    <div class="field editor-field">
      <label for="product-notes">Product notes</label>
      <aeris-editor
        inputId="product-notes"
        [(value)]="content"
        placeholder="Write product notes..."
        fluid
      />
      <small>HTML length: {{ content().length }}</small>
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
    
    .editor-field {
      align-items: stretch;
    }
  `
})
export class EditorBasicBasicDemo {
  protected readonly content = signal(
    '<p>Write clear product notes with Aeris.</p>',
  );
}
```

### Toolbar formats

The default toolbar includes undo, redo, inline formatting, headings, quotes, and list actions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisEditor } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-toolbar-demo',
  imports: [AerisEditor],
  template: `
    <div class="field editor-field">
      <label for="release-notes">Release notes</label>
      <aeris-editor
        inputId="release-notes"
        value="&lt;h2&gt;Version notes&lt;/h2&gt;&lt;p&gt;Use the toolbar to format text.&lt;/p&gt;&lt;ul&gt;&lt;li&gt;Fast setup&lt;/li&gt;&lt;li&gt;Accessible controls&lt;/li&gt;&lt;/ul&gt;"
        minHeight="14rem"
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
    
    .editor-field {
      align-items: stretch;
    }
  `
})
export class EditorToolbarToolbarFormatsDemo {
}
```

### Complete toolbar

Enable every built-in Aeris editor action, including text transforms, six heading levels, checklists, logical and physical alignment, indentation, and clear formatting.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AERIS_EDITOR_ALL_FORMATS, AerisEditor } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-comprehensive-demo',
  imports: [AerisEditor],
  template: `
    <div class="field editor-field editor-comprehensive">
      <label for="comprehensive-editor">Product brief</label>
      <aeris-editor
        inputId="comprehensive-editor"
        [(value)]="comprehensiveContent"
        [formats]="allFormats"
        minHeight="20rem"
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
    
    .editor-field {
      align-items: stretch;
    }
    
    .editor-comprehensive {
      width: min(100%, 56rem);
    }
  `
})
export class EditorComprehensiveCompleteToolbarDemo {
  protected readonly allFormats = AERIS_EDITOR_ALL_FORMATS;
  protected readonly comprehensiveContent = signal(
    '<h1>Quarterly product brief</h1><p><strong>Use the complete toolbar</strong> to structure, emphasize, align, transform, and organize this document.</p><blockquote>Every visible action is backed by Lexical state and HTML serialization.</blockquote><ul><li>Shape the narrative</li><li>Review the checklist</li><li>Publish the update</li></ul>',
  );
}
```

### Lexical extensions

Register custom nodes and Lexical behavior during editor creation. This example listens to immutable editor-state updates and derives a live word count.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisEditor, type AerisEditorExtension } from '@aeris-ui/core/editor';
import { $getRoot } from 'lexical';

@Component({
  selector: 'app-editor-extensions-demo',
  imports: [AerisEditor],
  template: `
    <div class="field editor-field">
      <label for="extension-editor">Article draft</label>
      <aeris-editor
        inputId="extension-editor"
        [(value)]="extensionContent"
        [extensions]="wordCountExtension"
        fluid
      />
      <small aria-live="polite">{{ extensionWordCount() }} words</small>
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
    
    .editor-field {
      align-items: stretch;
    }
  `
})
export class EditorExtensionsLexicalExtensionsDemo {
  protected readonly extensionContent = signal(
    '<p>This example reads the immutable Lexical editor state through an Aeris extension.</p>',
  );
  protected readonly extensionWordCount = signal(0);

  protected readonly wordCountExtension: readonly AerisEditorExtension[] = [
    {
      setup: (editor) =>
        editor.registerUpdateListener(({ editorState }) => {
          editorState.read(() => {
            const text = $getRoot().getTextContent().trim();
            this.extensionWordCount.set(
              text ? text.split(/\s+/).length : 0,
            );
          });
        }),
    },
  ];
}
```

### Custom toolbar

Limit the toolbar to the actions that make sense for a specific field.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisEditor, type AerisEditorFormat } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-custom-toolbar-demo',
  imports: [AerisEditor],
  template: `
    <div class="field editor-field">
      <label for="short-summary">Short summary</label>
      <aeris-editor
        inputId="short-summary"
        [(value)]="compactContent"
        [formats]="inlineFormats"
        minHeight="8rem"
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
    
    .editor-field {
      align-items: stretch;
    }
  `
})
export class EditorCustomToolbarCustomToolbarDemo {
  protected readonly inlineFormats: readonly AerisEditorFormat[] = [
    'undo',
    'redo',
    'bold',
    'italic',
    'underline',
  ];
}
```

### Appearances and states

Filled, disabled, read-only, and toolbar-free states keep the same value and accessibility model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisEditor } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-states-demo',
  imports: [AerisEditor],
  templateUrl: './editor-states.demo.html',
  styleUrl: './editor-states.demo.scss'
})
export class EditorStatesAppearancesAndStatesDemo {
}
```

#### HTML

```html
<div class="field-grid editor-state-grid">
  <div class="field">
    <span>Filled</span>
    <aeris-editor
      ariaLabel="Filled editor"
      value="&lt;p&gt;Filled editor surface.&lt;/p&gt;"
      appearance="filled"
      minHeight="7rem"
      fluid
    />
  </div>
  <div class="field">
    <span>Read-only</span>
    <aeris-editor
      ariaLabel="Read-only editor"
      value="&lt;p&gt;Read-only rich text.&lt;/p&gt;"
      readonly
      minHeight="7rem"
      fluid
    />
  </div>
  <div class="field">
    <span>Disabled</span>
    <aeris-editor
      ariaLabel="Disabled editor"
      value="&lt;p&gt;Disabled content.&lt;/p&gt;"
      disabled
      minHeight="7rem"
      fluid
    />
  </div>
  <div class="field">
    <span>Without toolbar</span>
    <aeris-editor
      ariaLabel="Plain rich text editor"
      value="&lt;p&gt;Toolbar hidden.&lt;/p&gt;"
      [showToolbar]="false"
      minHeight="7rem"
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

.editor-state-grid {
  align-items: start;
}
```

### Validation

Application validation controls invalid state and help text; the editor synchronizes required and aria-invalid semantics.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisEditor } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-validation-demo',
  imports: [AerisEditor],
  templateUrl: './editor-validation.demo.html',
  styleUrl: './editor-validation.demo.scss'
})
export class EditorValidationValidationDemo {
  protected readonly validationContent = signal('');
  protected readonly validationTouched = signal(false);
  protected readonly validationInvalid = computed(
    () =>
      this.validationTouched() &&
      !this.validationContent().trim(),
  );
}
```

#### HTML

```html
<div class="field editor-field">
  <label for="validated-editor">Article body</label>
  <aeris-editor
    inputId="validated-editor"
    [(value)]="validationContent"
    required
    [invalid]="validationInvalid()"
    ariaDescribedby="validated-editor-message"
    (blurred)="validationTouched.set(true)"
    fluid
  />
  @if (validationInvalid()) {
    <small id="validated-editor-message" class="error state-message"
      >Article body is required.</small
    >
  } @else {
    <small id="validated-editor-message" class="state-message"
      >Use clear headings and concise paragraphs.</small
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

.editor-field {
  align-items: stretch;
}

.state-message {
  min-height: 1.25rem;
}
```

### Reactive and template-driven forms

Editor implements ControlValueAccessor and synchronizes HTML value, disabled state, and touched state.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AerisEditor } from '@aeris-ui/core/editor';

@Component({
  selector: 'app-editor-forms-demo',
  imports: [AerisEditor, FormsModule, ReactiveFormsModule],
  templateUrl: './editor-forms.demo.html',
  styleUrl: './editor-forms.demo.scss'
})
export class EditorFormsReactiveAndTemplateDrivenFormsDemo {
  protected readonly reactiveContent =
    new FormControl('<p>Reactive form content.</p>');

  protected templateContent = '<p>Template-driven form content.</p>';
}
```

#### HTML

```html
<div class="field-grid editor-state-grid">
  <div class="field">
    <label for="reactive-editor">Reactive Forms</label>
    <aeris-editor
      inputId="reactive-editor"
      [formControl]="reactiveContent"
      minHeight="8rem"
      fluid
    />
  </div>
  <div class="field">
    <label for="template-editor">Template-driven forms</label>
    <aeris-editor
      inputId="template-editor"
      name="templateEditor"
      [(ngModel)]="templateContent"
      minHeight="8rem"
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

.editor-state-grid {
  align-items: start;
}
```

## Accessibility

- The editable area uses role="textbox" with aria-multiline="true".
- Associate a visible label through inputId, or provide ariaLabel only when no visible label exists.
- The toolbar uses native buttons inside a labeled role="toolbar"; active inline formats expose aria-pressed.
- Checklist items expose Lexical's checkbox semantics and can be operated with a pointer or keyboard while editing.
- Consumer extensions are responsible for the semantics, keyboard behavior, focus management, and announcements of any custom nodes or controls they register.
- Use ariaDescribedby for help and validation messages. Required and invalid state are reflected with ARIA attributes.
- Disabled and read-only states prevent editing and keep the content understandable to assistive technology.
- Incoming HTML passes through Angular's HTML sanitizer before it is imported. Treat emitted HTML as untrusted again when it crosses a server or storage boundary.
- Visible focus states meet WCAG 2.2 AA expectations and transitions respect reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves between toolbar buttons, the editable area, and surrounding controls. |
| `Arrow keys` | Moves the caret through editable content using native rich-text behavior. |
| `Enter` | Creates a new paragraph or list item in the editable area. |
| `Arrow Up / Arrow Down` | Moves between checklist items when a checklist marker is active. |
| `Space` | Toggles the active checklist item. |
| `Backspace / Delete` | Removes selected content or adjacent characters. |
| `Ctrl / Command + B` | Toggles bold through Lexical rich-text shortcuts. |
| `Ctrl / Command + I` | Toggles italic through Lexical rich-text shortcuts. |
| `Ctrl / Command + U` | Toggles underline through Lexical rich-text shortcuts. |
| `Ctrl / Command + Z` | Undo. |
| `Ctrl / Command + Shift + Z` | Redo. |
| `Enter / Space` | Activates the focused toolbar button. |
