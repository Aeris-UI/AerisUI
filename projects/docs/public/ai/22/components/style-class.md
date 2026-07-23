# StyleClass

> Toggle application classes and coordinate enter or leave transitions declaratively.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/style-class`
- Human-readable documentation: [https://aeris-ui.dev/components/style-class](https://aeris-ui.dev/components/style-class)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisStyleClassModule } from '@aeris-ui/core/style-class';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisStyleClass` | `AerisStyleClassTarget` | `'@next'` | Target element, CSS selector, or supported relationship keyword. |
| `aerisStyleClassToggle` | `string` | `''` | Whitespace-separated classes added and removed in toggle mode. When present, this mode takes precedence over transition classes. |
| `aerisStyleClassEnterFrom` | `string` | `''` | Starting classes for an enter transition. |
| `aerisStyleClassEnterActive` | `string` | `''` | Classes retained for the complete enter transition. |
| `aerisStyleClassEnterTo` | `string` | `''` | Destination classes for an enter transition. |
| `aerisStyleClassLeaveFrom` | `string` | `''` | Starting classes for a leave transition. |
| `aerisStyleClassLeaveActive` | `string` | `''` | Classes retained for the complete leave transition. |
| `aerisStyleClassLeaveTo` | `string` | `''` | Destination classes for a leave transition. |
| `aerisStyleClassInitiallyVisible` | `boolean` | `false` | Starts a transition-mode target visible instead of hidden. |
| `aerisStyleClassDismissOnOutside` | `boolean` | `false` | Hides a shown target after pointer input outside the trigger and target. |
| `aerisStyleClassDismissOnEscape` | `boolean` | `false` | Hides a shown target when Escape is pressed. |
| `aerisStyleClassDismissOnResize` | `boolean` | `false` | Hides a shown target after its configured resize source changes. |
| `aerisStyleClassResizeTarget` | `AerisStyleClassResizeTarget` | `'window'` | Window, document, element, or CSS selector observed for resize dismissal. |
| `aerisStyleClassDisabled` | `boolean` | `false` | Disables trigger, method, dismissal, and resize behavior. |

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `Signal&lt;AerisStyleClassState&gt;` | `'hidden'` | Readonly lifecycle state: hidden, entering, shown, or leaving. |
| `visible` | `Signal&lt;boolean&gt;` | `false` | Readonly state that is true while entering or fully shown. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `shown` | `AerisStyleClassEvent` | `—` | Emits after toggle classes are added or an enter transition completes. |
| `hidden` | `AerisStyleClassEvent` | `—` | Emits after toggle classes are removed or a leave transition completes. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show()` | `() =&gt; boolean` | `—` | Shows the resolved target and reports whether a state change started. |
| `hide()` | `() =&gt; boolean` | `—` | Hides the resolved target and reports whether a state change started. |
| `toggle()` | `() =&gt; boolean` | `—` | Shows or hides the resolved target from its current state. |

## Interfaces and types

### Interfaces

```ts
export type AerisStyleClassRelationship =
  | '@self'
  | '@next'
  | '@previous'
  | '@parent'
  | '@grandparent';

export type AerisStyleClassTarget =
  | HTMLElement
  | AerisStyleClassRelationship
  | string;

export type AerisStyleClassResizeTarget =
  | HTMLElement
  | 'window'
  | 'document'
  | string;

export type AerisStyleClassState =
  | 'hidden'
  | 'entering'
  | 'shown'
  | 'leaving';

export type AerisStyleClassReason =
  | 'trigger'
  | 'api'
  | 'outside'
  | 'escape'
  | 'resize';

export interface AerisStyleClassEvent {
  readonly target: HTMLElement;
  readonly reason: AerisStyleClassReason;
  readonly originalEvent: Event | null;
}
```

## Examples

### Toggle classes

Add or remove one or more application classes on a related target.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStyleClassModule } from '@aeris-ui/core/style-class';

@Component({
  selector: 'app-style-class-toggle-demo',
  imports: [AerisButton, AerisStyleClassModule],
  templateUrl: './style-class-toggle.demo.html',
  styleUrl: './style-class-toggle.demo.scss'
})
export class StyleClassToggleToggleClassesDemo {
}
```

#### HTML

```html
<div>
  <div class="style-toggle-demo">
    <button
      aerisButton
      type="button"
      aerisStyleClass="@next"
      aerisStyleClassToggle="style-toggle-card--active"
    >
      Toggle emphasis
    </button>
    <article class="style-toggle-card">
      This card is styled by a class on the next sibling target.
    </article>
  </div>
</div>
```

#### CSS

```css
.style-toggle-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.style-toggle-card {
  width: min(100%, 34rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.style-toggle-card--active {
  border-color: var(--aeris-primary);
  background: var(--aeris-primary-soft);
  transform: translateY(-0.125rem);
}

@media (prefers-reduced-motion: reduce) {
  .style-toggle-card {
    transition: none;
  }
}
```

### Animation

Apply enter and leave phases, dismiss outside or with Escape, and honor reduced-motion preferences.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStyleClassModule } from '@aeris-ui/core/style-class';

@Component({
  selector: 'app-style-class-animation-demo',
  imports: [AerisButton, AerisStyleClassModule],
  templateUrl: './style-class-animation.demo.html',
  styleUrl: './style-class-animation.demo.scss'
})
export class StyleClassAnimationAnimationDemo {
}
```

#### HTML

```html
<div>
  <div class="style-animation-demo">
    <button
      #animationController="aerisStyleClass"
      aerisButton
      type="button"
      aerisStyleClass="@next"
      aerisStyleClassEnterFrom="style-enter-from"
      aerisStyleClassEnterActive="style-enter-active"
      aerisStyleClassEnterTo="style-enter-to"
      aerisStyleClassLeaveFrom="style-leave-from"
      aerisStyleClassLeaveActive="style-leave-active"
      aerisStyleClassLeaveTo="style-leave-to"
      aerisStyleClassDismissOnOutside
      aerisStyleClassDismissOnEscape
      aria-controls="style-animation-panel"
      [attr.aria-expanded]="animationController.visible()"
    >
      Toggle release notes
    </button>
    <section
      id="style-animation-panel"
      class="style-animation-panel"
      [attr.aria-hidden]="!animationController.visible()"
    >
      The transition classes are temporary. The directive uses the native hidden state
      after the leave phase completes.
    </section>
  </div>
</div>
```

#### CSS

```css
.style-animation-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.style-animation-panel {
  width: min(100%, 34rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
  opacity: 1;
  transform: translateY(0) scale(1);
}

.style-enter-from,
.style-leave-to {
  opacity: 0;
  transform: translateY(-0.625rem) scale(0.98);
}

.style-enter-active,
.style-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.style-enter-to,
.style-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .style-enter-active,
  .style-leave-active {
    transition: none;
  }
}
```

### Target selectors

Resolve next and previous siblings, ancestors, or remote targets through CSS selectors.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStyleClassModule } from '@aeris-ui/core/style-class';

@Component({
  selector: 'app-style-class-selectors-demo',
  imports: [AerisButton, AerisStyleClassModule],
  templateUrl: './style-class-selectors.demo.html',
  styleUrl: './style-class-selectors.demo.scss'
})
export class StyleClassSelectorsTargetSelectorsDemo {
}
```

#### HTML

```html
<div>
  <div class="style-selector-grid">
    <div class="style-selector-case">
      <button
        aerisButton
        type="button"
        variant="secondary"
        aerisStyleClass="@next"
        aerisStyleClassToggle="style-selector-target--selected"
      >
        Next sibling
      </button>
      <div class="style-selector-target">Next target</div>
    </div>
    <div class="style-selector-case">
      <div class="style-selector-target">Previous target</div>
      <button
        aerisButton
        type="button"
        variant="secondary"
        aerisStyleClass="@previous"
        aerisStyleClassToggle="style-selector-target--selected"
      >
        Previous sibling
      </button>
    </div>
    <div class="style-selector-target">
      <button
        aerisButton
        type="button"
        variant="secondary"
        aerisStyleClass="@parent"
        aerisStyleClassToggle="style-selector-target--selected"
      >
        Parent target
      </button>
    </div>
    <div class="style-selector-case">
      <button
        aerisButton
        type="button"
        variant="secondary"
        aerisStyleClass="#style-remote-target"
        aerisStyleClassToggle="style-selector-target--selected"
      >
        CSS selector
      </button>
      <div id="style-remote-target" class="style-selector-target">Remote target</div>
    </div>
  </div>
</div>
```

#### CSS

```css
.style-selector-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;
}

.style-selector-case,
.style-selector-target {
  display: grid;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.style-selector-target {
  background: var(--aeris-surface-2);
}

.style-selector-target--selected {
  border-color: var(--aeris-primary);
  background: var(--aeris-primary-soft);
}

@media (max-width: 40rem) {
  .style-selector-grid {
    grid-template-columns: 1fr;
  }
}
```

### Resize dismissal

Automatically hide responsive content when the browser or an observed element changes size.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStyleClassModule } from '@aeris-ui/core/style-class';

@Component({
  selector: 'app-style-class-resize-demo',
  imports: [AerisButton, AerisStyleClassModule],
  templateUrl: './style-class-resize.demo.html',
  styleUrl: './style-class-resize.demo.scss'
})
export class StyleClassResizeResizeDismissalDemo {
}
```

#### HTML

```html
<div>
  <div class="style-resize-demo">
    <button
      #resizeController="aerisStyleClass"
      aerisButton
      type="button"
      aerisStyleClass="@next"
      aerisStyleClassToggle="style-resize-panel--visible"
      aerisStyleClassDismissOnResize
      aria-controls="style-resize-panel"
      [attr.aria-expanded]="resizeController.visible()"
    >
      Show responsive details
    </button>
    <section
      id="style-resize-panel"
      class="style-resize-panel"
      [attr.aria-hidden]="!resizeController.visible()"
    >
      Resize the browser window while this panel is open to dismiss it.
    </section>
  </div>
</div>
```

#### CSS

```css
.style-resize-demo {
  display: grid;
  gap: 0.875rem;
  justify-items: start;
}

.style-resize-panel {
  display: none;
  width: min(100%, 34rem);
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.style-resize-panel--visible {
  display: block;
}
```

### Methods and events

Export the directive for imperative control and respond to completed state changes.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisStyleClassModule, type AerisStyleClassEvent } from '@aeris-ui/core/style-class';

@Component({
  selector: 'app-style-class-methods-demo',
  imports: [AerisButton, AerisStyleClassModule],
  templateUrl: './style-class-methods.demo.html',
  styleUrl: './style-class-methods.demo.scss'
})
export class StyleClassMethodsMethodsAndEventsDemo {
  protected readonly methodStatus = signal('The notice is hidden.');

  protected recordMethodShown(event: AerisStyleClassEvent): void {
    this.methodStatus.set(`Notice shown via ${event.reason}.`);
  }

  protected recordMethodHidden(event: AerisStyleClassEvent): void {
    this.methodStatus.set(`Notice hidden via ${event.reason}.`);
  }
}
```

#### HTML

```html
<div>
  <div class="style-method-demo">
    <div class="style-method-actions">
      <button
        #methodController="aerisStyleClass"
        aerisButton
        type="button"
        aerisStyleClass="#style-method-notice"
        aerisStyleClassToggle="style-method-notice--visible"
        aria-controls="style-method-notice"
        [attr.aria-expanded]="methodController.visible()"
        (shown)="recordMethodShown($event)"
        (hidden)="recordMethodHidden($event)"
      >
        Toggle notice</button
      ><button
        aerisButton
        type="button"
        variant="secondary"
        (click)="methodController.show()"
      >
        Show</button
      ><button
        aerisButton
        type="button"
        variant="secondary"
        (click)="methodController.hide()"
      >
        Hide
      </button>
    </div>
    <aside
      id="style-method-notice"
      class="style-method-notice"
      [attr.aria-hidden]="!methodController.visible()"
    >
      Deployment checks completed successfully.
    </aside>
    <p class="style-method-status" aria-live="polite">{{ methodStatus() }}</p>
  </div>
</div>
```

#### CSS

```css
.style-method-demo {
  display: grid;
  gap: 0.875rem;
}

.style-method-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

.style-method-notice {
  display: none;
  width: min(100%, 34rem);
  padding: 1rem;
  border-inline-start: 0.25rem solid var(--aeris-primary);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-primary-soft);
}

.style-method-notice--visible {
  display: block;
}

.style-method-status {
  margin: 0;
  color: var(--aeris-text-2);
}

@media (max-width: 30rem) {
  .style-method-actions > button {
    width: 100%;
  }
}
```

## Accessibility

- Use a native button as the trigger so Enter and Space activation work without additional scripting.
- StyleClass changes presentation only. Bind matching semantics such as aria-expanded, aria-controls, aria-hidden, live-region text, or native disabled state.
- Transition mode synchronizes the target's native hidden state after leave completes. Toggle-class mode leaves visibility and accessibility semantics to the application.
- Outside and Escape dismissal do not move or restore focus. Use the appropriate Aeris overlay component when full overlay focus management is required.
- Transition mode finishes immediately when reduced motion is requested.
- Invalid or unresolved selectors are ignored safely.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Activates a native button trigger through its normal click behavior. |
| `Escape` | Hides a shown target when aerisStyleClassDismissOnEscape is enabled. |
| `Tab / Shift + Tab` | Retains native document focus order; StyleClass does not trap or move focus. |
| `Other keys` | Not handled by the directive. |
