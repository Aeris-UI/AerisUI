# CodeBlock

> Display syntax-highlighted code with source tabs, line numbers, focused lines, and accessible copy actions.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/code-block`
- Human-readable documentation: [https://aeris-ui.dev/components/code-block](https://aeris-ui.dev/components/code-block)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `copyIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Optional copy-button artwork; the native button retains its clipboard action and accessible name. |
| `copiedIconTemplate` | `TemplateRef&lt;void&gt; &#124; undefined` | `undefined` | Optional artwork displayed after a successful copy. |
| `code` | `string` | `''` | Source text for a single code block. Rendered as text, never executed or interpreted as HTML. |
| `language` | `string` | `text` | Case-insensitive language: html, typescript, javascript, css, scss, json, shell, or text. Aliases: ts, js, angular, xml, bash, sh. Unknown languages use plain text. |
| `label` | `string` | `''` | Single-source header label, such as a filename. Defaults to language. |
| `sources` | `readonly AerisCodeSource[]` | `[]` | Source files displayed as tabs. Non-empty sources take precedence over code, language, and label. Empty files are retained. |
| `highlight` | `boolean` | `true` | Enable Shiki syntax highlighting with lazily loaded grammars and light/dark themes. Plain text appears immediately while highlighting loads. Inputs over 100,000 characters use plain text. |
| `lineNumbers` | `boolean` | `false` | Display decorative line numbers. Clipboard output always excludes them. |
| `highlightLines` | `readonly number[]` | `[]` | One-based line numbers to emphasize. Invalid or out-of-range entries have no effect. |
| `wrap` | `boolean` | `false` | Wrap long lines rather than horizontally scrolling. |
| `maxHeight` | `string &#124; null` | `null` | Explicit CSS maximum height on every screen size. Default desktop height comes from the token; mobile expands vertically to preserve page scrolling. |
| `tabSize` | `number` | `2` | Displayed tab width, clamped to integers from 1 through 16. |
| `copyable` | `boolean` | `true` | Show the copy action and enable the copy() method. |
| `ariaLabel` | `string` | `Code example` | Accessible name for a single-source scroll region. |
| `copyLabel` | `string` | `Copy` | Visible copy action text; automatically icon-only on narrow screens. |
| `copiedLabel` | `string` | `Copied` | Visible success text. |
| `copyAriaLabel` | `string` | `Copy code` | Accessible name for the copy button, retained in icon-only mode. |
| `copiedMessage` | `string` | `Code copied to clipboard.` | Polite live announcement after a successful copy. |
| `copyErrorMessage` | `string` | `Unable to copy code. Select the code and copy it manually.` | Live announcement when clipboard access fails. |
| `sourceTabsLabel` | `string` | `Code source` | Accessible name for the source tab list. |
| `scrollHint` | `string` | `Swipe sideways for long lines` | Non-interactive mobile hint for unwrapped content; empty text hides it. |
| `scrollDescription` | `string` | `Scroll horizontally to view long lines.` | Accessible scroll guidance when wrapping is disabled; can be localized. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeSource` | `number` | `0` | Two-way active source index. Out-of-range values display the closest available source. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `highlightError` | `unknown` | `-` | Emits a highlighting failure. The original source remains visible and copyable as plain text. |
| `copied` | `AerisCodeCopyEvent` | `-` | Emits the exact source text, language, and index after clipboard success. |
| `copyError` | `unknown` | `-` | Emits the clipboard error. Source code is not included in error messages. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `copy()` | `Promise&lt;boolean&gt;` | `-` | Copy the currently displayed raw source. Resolves false when disabled, busy, unsupported, or unsuccessful. |
| `selectSource(index)` | `(index: number) =&gt; void` | `-` | Activate an existing source index; invalid indices are ignored. |

## Interfaces and types

### Interfaces

```ts
type AerisCodeLanguage = 'html' | 'typescript' | 'javascript' | 'css' | 'scss' | 'json' | 'shell' | 'text';

interface AerisCodeSource {
  readonly code: string;
  readonly language: string;
  readonly label: string;
}

interface AerisCodeCopyEvent {
  readonly code: string;
  readonly language: string;
  readonly index: number;
}
```

## Examples

### Basic

TypeScript coloring, a language label, and a copy action.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-basic-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div><aeris-code-block [code]="exampleCode" language="typescript" /></div>
  `
})
export class CodeBlockBasicBasicDemo {
}
```

### Source tabs

Group related files without hiding empty source files. Use left and right arrows, Home, or End to switch tabs.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-sources-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div><aeris-code-block [sources]="sourceFiles" /></div>
  `
})
export class CodeBlockSourcesSourceTabsDemo {
}
```

### Line numbers and focused lines

Decorative line numbers and selected-line backgrounds never alter the copied source.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-lines-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div>
      <aeris-code-block
        [code]="exampleCode"
        language="typescript"
        lineNumbers
        [highlightLines]="[3, 4, 5]"
      />
    </div>
  `
})
export class CodeBlockLinesLineNumbersAndFocusedLinesDemo {
}
```

### Wrapping

Wrap long lines to fit the available width.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-wrap-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div>
      <aeris-code-block [code]="longCode" language="typescript" wrap maxHeight="12rem" />
    </div>
  `
})
export class CodeBlockWrapWrappingDemo {
}
```

### Scrolling

An explicit maximum height provides a scroll region. Scroll at its boundary to continue through the page.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-scroll-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div>
      <aeris-code-block [code]="longCode" language="typescript" maxHeight="12rem" />
    </div>
  `
})
export class CodeBlockScrollScrollingDemo {
}
```

### Copy events and labels

Customize visible labels and react to successful or failed copies.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-copy-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div class="code-example">
      <aeris-code-block
        [code]="exampleCode"
        language="typescript"
        label="greeting.ts"
        copyLabel="Copy source"
        copiedLabel="Source copied"
        (copied)="onCopied($event)"
        (copyError)="onCopyError()"
      />
      <p aria-live="polite">{{ copyMessage() }}</p>
    </div>
  `,
  styles: `
    .code-example {
      display: grid;
      gap: 1rem;
      min-inline-size: 0;
    }
  `
})
export class CodeBlockCopyCopyEventsAndLabelsDemo {
}
```

### Plain text

Plain text can retain the label without syntax coloring or a copy button.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-plain-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div>
      <aeris-code-block
        code="Aeris keeps presentation separate from your source text."
        language="text"
        label="Notes"
        [copyable]="false"
      />
    </div>
  `
})
export class CodeBlockPlainPlainTextDemo {
}
```

### Token customization

Use component tokens for an intentional local exception.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCodeBlockModule } from '@aeris-ui/core/code-block';

@Component({
  selector: 'app-code-block-custom-demo',
  imports: [AerisCodeBlockModule],
  template: `
    <div>
      <aeris-code-block
        class="custom-code"
        [code]="exampleCode"
        language="typescript"
        [highlightLines]="[3]"
      />
    </div>
  `,
  styles: `
    .custom-code {
      --aeris-code-block-background: var(--aeris-surface);
      --aeris-code-block-font-size: 0.9375rem;
      --aeris-code-block-padding: 1.5rem;
      --aeris-code-block-line-highlight: var(--aeris-secondary-soft);
    }
  `
})
export class CodeBlockCustomTokenCustomizationDemo {
}
```

## Accessibility

- Code uses native pre and code elements. Syntax highlighting never changes the text or relies on color to communicate meaning.
- A single source has a named, focusable region. Multiple sources use labeled tabs and a linked tab panel with one tab stop.
- Copy success and failure are announced politely. Clipboard access can be rejected by the browser; text remains manually selectable.
- Line numbers are decorative and hidden from assistive technology. Line highlighting is visual emphasis, not a semantic error or selection.
- Source text stays left-to-right in RTL layouts, while navigation arrows follow the interface direction.
- Mobile copy actions retain their accessible name when their visible label is hidden. Default mobile blocks expand vertically; horizontal swipes reveal long lines without stopping page scrolling.
- Reduced motion disables button transitions. CodeBlock does not animate or execute source text.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Move through the active source tab, copy button, and scroll region. |
| `ArrowLeft / ArrowRight` | Focus and activate the adjacent source tab, wrapping at either end; reversed in RTL. |
| `Home / End` | Focus and activate the first / last source tab. |
| `Enter / Space` | Activate the focused native button. |
| `Arrow keys / PageUp / PageDown` | Scroll the focused code area using native browser behavior when it overflows. |
