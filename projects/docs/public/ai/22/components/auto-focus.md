# AutoFocus

> Move focus to newly rendered native controls with controlled activation and scroll-safe defaults.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/auto-focus`
- Human-readable documentation: [https://aeris-ui.dev/components/auto-focus](https://aeris-ui.dev/components/auto-focus)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisAutoFocusModule } from '@aeris-ui/core/auto-focus';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisAutoFocus` | `boolean` | `true` | Focuses the host after rendering and whenever the value changes from false to true. |
| `aerisAutoFocusPreventScroll` | `boolean` | `true` | Prevents the browser from scrolling while automatic focus is applied. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focus(options?)` | `(options?: FocusOptions) =&gt; boolean` | `—` | Focuses the host with optional native focus options and reports whether focus succeeded. |

## Examples

### Basic

Apply the directive to a focusable control to focus it automatically when the page renders.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAutoFocusModule } from '@aeris-ui/core/auto-focus';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-auto-focus-basic-demo',
  imports: [AerisAutoFocusModule, AerisInputText],
  template: `
    <div>
      <label class="auto-focus-field" for="auto-focus-name">
        Display name
        <input id="auto-focus-name" aerisInputText aerisAutoFocus autocomplete="name" />
      </label>
    </div>
  `,
  styles: `
    .auto-focus-field {
      width: min(100%, 24rem);
      display: grid;
      gap: 0.5rem;
    }
  `
})
export class AutoFocusBasicBasicDemo {
}
```

### Conditional content

Focus the first meaningful field when a form or workflow step is added to the DOM.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAutoFocusModule } from '@aeris-ui/core/auto-focus';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-auto-focus-conditional-demo',
  imports: [AerisAutoFocusModule, AerisButton, AerisInputText, AerisTextarea],
  templateUrl: './auto-focus-conditional.demo.html',
  styleUrl: './auto-focus-conditional.demo.scss'
})
export class AutoFocusConditionalConditionalContentDemo {
  protected readonly formVisible = signal(false);

  protected toggleForm(): void {
    this.formVisible.update((visible) => !visible);
  }
}
```

#### HTML

```html
<div>
  <div class="conditional-demo">
    <button aerisButton type="button" variant="secondary" (click)="toggleForm()">
      {{ formVisible() ? 'Remove account form' : 'Add account form' }}
    </button>
    @if (formVisible()) {
      <form class="conditional-form" (submit)="$event.preventDefault()">
        <label for="auto-focus-email"
          >Email address<input
            id="auto-focus-email"
            aerisInputText
            aerisAutoFocus
            type="email"
            autocomplete="email"
        /></label>
        <label for="auto-focus-note"
          >Account note<textarea
            id="auto-focus-note"
            aerisTextarea
            rows="3"
          ></textarea>
        </label>
        <button aerisButton type="submit">Continue</button>
      </form>
    }
  </div>
</div>
```

#### CSS

```css
.conditional-demo {
  display: grid;
  gap: 1rem;
}

.conditional-form {
  max-width: 28rem;
  display: grid;
  gap: 0.875rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.conditional-form label {
  display: grid;
  gap: 0.5rem;
}
```

### Controlled

Bind the directive to application state and re-enable it only when focus should move.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-auto-focus-controlled-demo',
  imports: [AerisButton, AerisInputText],
  templateUrl: './auto-focus-controlled.demo.html',
  styleUrl: './auto-focus-controlled.demo.scss'
})
export class AutoFocusControlledControlledDemo {
  protected readonly controlledFocus = signal(false);
  protected readonly controlledStatus = signal('Automatic focus is disabled.');

  protected focusSearch(): void {
    this.controlledFocus.set(false);
    this.controlledStatus.set('Preparing focus…');
    queueMicrotask(() => this.controlledFocus.set(true));
  }

  protected disableControlledFocus(): void {
    this.controlledFocus.set(false);
    this.controlledStatus.set('Automatic focus is disabled.');
  }

  protected recordControlledFocus(): void {
    this.controlledStatus.set('The search field received focus.');
  }
}
```

#### HTML

```html
<div>
  <div class="controlled-demo">
    <div class="auto-focus-actions">
      <button aerisButton type="button" (click)="focusSearch()">Focus search</button>
      <button
        aerisButton
        type="button"
        variant="secondary"
        (click)="disableControlledFocus()"
      >
        Disable automatic focus
      </button>
    </div>
    <label class="auto-focus-field" for="controlled-search"
      >Search documentation<input
        id="controlled-search"
        aerisInputText
        [aerisAutoFocus]="controlledFocus()"
        (focus)="recordControlledFocus()"
    /></label>
    <p class="auto-focus-status" aria-live="polite">{{ controlledStatus() }}</p>
  </div>
</div>
```

#### CSS

```css
.auto-focus-field {
  width: min(100%, 24rem);
  display: grid;
  gap: 0.5rem;
}

.auto-focus-status {
  margin: 0;
  color: var(--aeris-text-2);
}

.controlled-demo {
  display: grid;
  gap: 0.875rem;
}

.auto-focus-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}
```

### Focus method

Export the directive to focus its host manually with native FocusOptions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-auto-focus-method-demo',
  imports: [AerisButton, AerisTextarea],
  templateUrl: './auto-focus-method.demo.html',
  styleUrl: './auto-focus-method.demo.scss'
})
export class AutoFocusMethodFocusMethodDemo {
}
```

#### HTML

```html
<div>
  <div class="method-demo">
    <button aerisButton type="button" variant="outline" (click)="notesFocus.focus()">
      Focus notes without scrolling
    </button>
    <textarea
      #notesFocus="aerisAutoFocus"
      aerisTextarea
      [aerisAutoFocus]="false"
      aria-label="Project notes"
      rows="4"
      placeholder="Project notes"
    ></textarea>
  </div>
</div>
```

#### CSS

```css
.method-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.method-demo textarea {
  width: min(100%, 30rem);
}
```

## Accessibility

- Apply the directive only to elements that are already natively focusable.
- Use automatic focus when new content requires immediate interaction, not merely to draw attention.
- Avoid moving focus on initial page navigation because it can bypass headings and disorient screen-reader users.
- Disabled, hidden, inert, disconnected, and aria-hidden="true" hosts are not focused.
- Scroll is preserved by default to avoid unexpected viewport movement.
- The directive adds no roles, labels, or keyboard behavior; the host retains its native semantics.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Continues from the focused host through the document's native tab order. |
| `Other keys` | Handled by the focused native or Aeris control; AutoFocus intercepts no keyboard input. |
