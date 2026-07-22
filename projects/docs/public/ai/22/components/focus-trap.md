# FocusTrap

> Contain forward and backward keyboard focus within dynamic interactive regions.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/focus-trap`
- Human-readable documentation: [https://aeris-ui.dev/components/focus-trap](https://aeris-ui.dev/components/focus-trap)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisFocusTrap` | `boolean` | `true` | Keeps forward and backward tab navigation within the host while enabled. |
| `aerisFocusTrapPreventScroll` | `boolean` | `true` | Prevents viewport movement when focus wraps or a focus method is called. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `focusFirst(options?)` | `(options?: FocusOptions) =&gt; boolean` | `—` | Focuses the first eligible descendant and reports whether focus succeeded. |
| `focusLast(options?)` | `(options?: FocusOptions) =&gt; boolean` | `—` | Focuses the last eligible descendant and reports whether focus succeeded. |

## Examples

### Basic

Tab through the form to see forward and backward focus wrap at its boundaries.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCheckbox } from '@aeris-ui/core/checkbox';
import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-focus-trap-basic-demo',
  imports: [AerisButton, AerisCheckbox, AerisFocusTrapModule, AerisInputText],
  template: `
    <div>
      <div class="focus-trap-flow">
        <button aerisButton type="button" variant="outline">Before trapped region</button>
        <section class="focus-trap-card" aerisFocusTrap aria-label="Profile preferences">
          <label for="focus-trap-name"
            >Display name<input id="focus-trap-name" aerisInputText autocomplete="name"
          /></label>
          <aeris-checkbox>Send product updates</aeris-checkbox>
          <button aerisButton type="button">Save preferences</button>
        </section>
        <button aerisButton type="button" variant="outline">After trapped region</button>
      </div>
    </div>
  `,
  styles: `
    .focus-trap-flow,
    .controlled-trap-demo,
    .focus-method-demo {
      display: grid;
      gap: 0.875rem;
    }
    
    .focus-trap-flow > button,
    .controlled-trap-demo > button {
      justify-self: start;
    }
    
    .focus-trap-card {
      display: grid;
      gap: 0.875rem;
      width: min(100%, 32rem);
      padding: 1rem;
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-lg);
      background: var(--aeris-surface-2);
    }
    
    .focus-trap-card:focus-within {
      border-color: var(--aeris-primary);
      box-shadow: 0 0 0 1px var(--aeris-primary-soft);
    }
    
    .focus-trap-card label {
      display: grid;
      gap: 0.5rem;
    }
    
    @media (max-width: 30rem) {
      .focus-trap-card {
          padding: 0.875rem;
        }
      
      .focus-trap-flow > button,
        .controlled-trap-demo > button,
        .dynamic-trap-actions > button,
        .focus-method-actions > button {
          width: 100%;
        }
    }
    
    .focus-trap-flow {
      display: grid;
      gap: 0.875rem;
    }
    
    .focus-trap-flow > button {
      justify-self: start;
    }
    
    .focus-trap-card {
      display: grid;
      gap: 0.875rem;
      width: min(100%, 32rem);
      padding: 1rem;
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-lg);
      background: var(--aeris-surface-2);
    }
    
    .focus-trap-card:focus-within {
      border-color: var(--aeris-primary);
      box-shadow: 0 0 0 1px var(--aeris-primary-soft);
    }
    
    .focus-trap-card label {
      display: grid;
      gap: 0.5rem;
    }
    
    @media (max-width: 30rem) {
      .focus-trap-card {
        padding: 0.875rem;
      }
    }
    
    
    @media (max-width: 30rem) {
      .focus-trap-flow > button {
        width: 100%;
      }
    }
  `
})
export class FocusTrapBasicBasicDemo {
}
```

### Controlled

Disable the boundary when a workflow no longer needs to contain keyboard focus.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-focus-trap-controlled-demo',
  imports: [AerisButton, AerisInputText],
  templateUrl: './focus-trap-controlled.demo.html',
  styleUrl: './focus-trap-controlled.demo.scss'
})
export class FocusTrapControlledControlledDemo {
  protected readonly trapEnabled = signal(true);

  protected toggleTrap(): void {
    this.trapEnabled.update((enabled) => !enabled);
  }
}
```

#### HTML

```html
<div>
  <div class="controlled-trap-demo">
    <button aerisButton type="button" variant="secondary" (click)="toggleTrap()">
      {{ trapEnabled() ? 'Disable focus trap' : 'Enable focus trap' }}
    </button>
    <section
      class="focus-trap-card"
      [aerisFocusTrap]="trapEnabled()"
      aria-label="Controlled sign-in region"
    >
      <label for="controlled-trap-email"
        >Email address<input
          id="controlled-trap-email"
          aerisInputText
          type="email"
          autocomplete="email"
      /></label>
      <button aerisButton type="button">Continue</button>
    </section>
    <p class="controlled-trap-status" aria-live="polite">
      Focus containment is {{ trapEnabled() ? 'enabled' : 'disabled' }}.
    </p>
  </div>
</div>
```

#### CSS

```css
.focus-trap-flow,
.controlled-trap-demo,
.focus-method-demo {
  display: grid;
  gap: 0.875rem;
}

.controlled-trap-demo,
.focus-method-demo {
  gap: 1rem;
}

.focus-trap-flow > button,
.controlled-trap-demo > button {
  justify-self: start;
}

.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

.controlled-trap-status {
  margin: 0;
  color: var(--aeris-text-2);
}

@media (max-width: 30rem) {
  .focus-trap-card {
      padding: 0.875rem;
    }
  
  .focus-trap-flow > button,
    .controlled-trap-demo > button,
    .dynamic-trap-actions > button,
    .focus-method-actions > button {
      width: 100%;
    }
}

.controlled-trap-demo {
  display: grid;
  gap: 1rem;
}

.controlled-trap-demo > button {
  justify-self: start;
}

.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

@media (max-width: 30rem) {
  .focus-trap-card {
    padding: 0.875rem;
  }
}

.controlled-trap-status {
  margin: 0;
  color: var(--aeris-text-2);
}

@media (max-width: 30rem) {
  .controlled-trap-demo > button {
    width: 100%;
  }
}
```

### Dynamic content

Focusable descendants are discovered as content is added, removed, disabled, or hidden.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-focus-trap-dynamic-demo',
  imports: [AerisButton, AerisFocusTrapModule, AerisInputText],
  templateUrl: './focus-trap-dynamic.demo.html',
  styleUrl: './focus-trap-dynamic.demo.scss'
})
export class FocusTrapDynamicDynamicContentDemo {
  protected readonly secondaryFieldVisible = signal(false);

  protected toggleSecondaryField(): void {
    this.secondaryFieldVisible.update((visible) => !visible);
  }
}
```

#### HTML

```html
<div>
  <section class="focus-trap-card" aerisFocusTrap aria-label="Team member form">
    <label for="dynamic-trap-name"
      >Name<input id="dynamic-trap-name" aerisInputText autocomplete="name"
    /></label>
    @if (secondaryFieldVisible()) {
      <label for="dynamic-trap-role"
        >Role<input
          id="dynamic-trap-role"
          aerisInputText
          autocomplete="organization-title"
      /></label>
    }
    <div class="dynamic-trap-actions">
      <button
        aerisButton
        type="button"
        variant="secondary"
        (click)="toggleSecondaryField()"
      >
        {{ secondaryFieldVisible() ? 'Remove role field' : 'Add role field' }}
      </button>
      <button aerisButton type="button">Save member</button>
    </div>
  </section>
</div>
```

#### CSS

```css
.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

.dynamic-trap-actions,
.focus-method-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 30rem) {
  .focus-trap-card {
      padding: 0.875rem;
    }
  
  .focus-trap-flow > button,
    .controlled-trap-demo > button,
    .dynamic-trap-actions > button,
    .focus-method-actions > button {
      width: 100%;
    }
}

.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

@media (max-width: 30rem) {
  .focus-trap-card {
    padding: 0.875rem;
  }
}

.dynamic-trap-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 30rem) {
  .dynamic-trap-actions > button {
    width: 100%;
  }
}
```

### Focus methods

Export the directive to focus either keyboard boundary from application controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFocusTrapModule } from '@aeris-ui/core/focus-trap';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-focus-trap-methods-demo',
  imports: [AerisButton, AerisFocusTrapModule, AerisInputText],
  templateUrl: './focus-trap-methods.demo.html',
  styleUrl: './focus-trap-methods.demo.scss'
})
export class FocusTrapMethodsFocusMethodsDemo {
}
```

#### HTML

```html
<div>
  <div class="focus-method-demo">
    <div class="focus-method-actions">
      <button
        aerisButton
        type="button"
        variant="outline"
        (click)="methodTrap.focusFirst()"
      >
        Focus first field
      </button>
      <button
        aerisButton
        type="button"
        variant="outline"
        (click)="methodTrap.focusLast()"
      >
        Focus last action
      </button>
    </div>
    <section
      #methodTrap="aerisFocusTrap"
      class="focus-trap-card"
      aerisFocusTrap
      aria-label="Method demonstration"
    >
      <label for="method-trap-project"
        >Project name<input id="method-trap-project" aerisInputText
      /></label>
      <button aerisButton type="button">Create project</button>
    </section>
  </div>
</div>
```

#### CSS

```css
.focus-trap-flow,
.controlled-trap-demo,
.focus-method-demo {
  display: grid;
  gap: 0.875rem;
}

.controlled-trap-demo,
.focus-method-demo {
  gap: 1rem;
}

.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

.dynamic-trap-actions,
.focus-method-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 30rem) {
  .focus-trap-card {
      padding: 0.875rem;
    }
  
  .focus-trap-flow > button,
    .controlled-trap-demo > button,
    .dynamic-trap-actions > button,
    .focus-method-actions > button {
      width: 100%;
    }
}

.focus-method-demo {
  display: grid;
  gap: 1rem;
}

.focus-trap-card {
  display: grid;
  gap: 0.875rem;
  width: min(100%, 32rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.focus-trap-card:focus-within {
  border-color: var(--aeris-primary);
  box-shadow: 0 0 0 1px var(--aeris-primary-soft);
}

.focus-trap-card label {
  display: grid;
  gap: 0.5rem;
}

@media (max-width: 30rem) {
  .focus-trap-card {
    padding: 0.875rem;
  }
}

.focus-method-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

@media (max-width: 30rem) {
  .focus-method-actions > button {
    width: 100%;
  }
}
```

## Accessibility

- Use a focus trap only while users must complete or dismiss a contained interaction.
- Provide a visible, clearly named way to close or deactivate modal workflows.
- The directive preserves native DOM tab order and ignores disabled, hidden, inert, and negative-tabindex descendants.
- Focusable descendants are recalculated on each boundary check, so dynamically rendered controls participate immediately.
- Nested traps are supported; the closest enabled trap owns the keyboard event.
- Focus is not moved when the directive becomes enabled. Use AutoFocus or focusFirst() when activation requires initial focus placement.
- The directive adds no role, accessible name, inert background, dismissal behavior, or focus restoration. The owning interaction must provide those semantics.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through native tab order and wraps from the last eligible descendant to the first. |
| `Shift + Tab` | Moves backward and wraps from the first eligible descendant to the last. |
| `Escape` | Not handled. The owning dialog, drawer, or workflow decides whether Escape dismisses it. |
| `Other keys` | Retain the focused control's native behavior. |
