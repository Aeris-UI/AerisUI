# Dialog

> Modal surface with focus management, dismissal rules, and responsive sizing.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/dialog`
- Human-readable documentation: [https://aeris-ui.dev/components/dialog](https://aeris-ui.dev/components/dialog)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisDialogModule } from '@aeris-ui/core/dialog';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | `''` | Default dialog title rendered in the header. |
| `role` | `AerisDialogRole` | `'dialog'` | Dialog landmark role. Use alertdialog only for interruptive confirmation-style surfaces. |
| `modal` | `boolean` | `true` | Enables modal semantics, focus handling, and optional scroll blocking. |
| `backdrop` | `boolean` | `true` | Shows the modal backdrop. Set false for a modal dialog without the visual mask. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the visible backdrop. |
| `backdropBlurAmount` | `string` | `''` | Overrides the backdrop blur radius for this dialog with a CSS length. |
| `dismissibleMask` | `boolean` | `false` | Closes the dialog when the mask itself is pressed. |
| `closeOnEscape` | `boolean` | `true` | Closes the dialog when Escape is pressed. |
| `closable` | `boolean` | `true` | Shows the close button in the header. |
| `maximizable` | `boolean` | `false` | Shows a header action that toggles maximized layout. |
| `draggable` | `boolean` | `false` | Allows pointer dragging from the header when not maximized. |
| `resizable` | `boolean` | `false` | Allows browser-native resizing of the dialog surface. |
| `blockScroll` | `boolean` | `true` | Prevents body scrolling while a modal dialog is open. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside the open dialog. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the previously focused element after close. |
| `autoFocus` | `boolean` | `true` | Moves focus into the dialog after it opens. |
| `initialFocus` | `string` | `''` | Optional selector for the first element to focus. |
| `position` | `AerisDialogPosition` | `'center'` | Places the dialog within the viewport. |
| `size` | `AerisDialogSize` | `'md'` | Controls the default dialog width. |
| `width` | `string` | `''` | Custom dialog width such as 42rem, 60vw, or min(40rem, 100%). |
| `minWidth` | `string` | `''` | Custom minimum dialog width. |
| `maxWidth` | `string` | `''` | Custom maximum dialog width. |
| `height` | `string` | `''` | Custom dialog height. |
| `maxHeight` | `string` | `''` | Custom maximum dialog height. |
| `mobileWidth` | `string` | `''` | Width used by the built-in narrow viewport media query. |
| `closeAriaLabel` | `string` | `'Close dialog'` | Accessible label for the close button. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title should label the dialog. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the dialog. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the dialog. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Controls whether the dialog is rendered. |
| `maximized` | `boolean` | `false` | Controls maximized layout state. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visibleChange` | `boolean` | `-` | Emitted by the visible model. |
| `maximizedChange` | `boolean` | `-` | Emitted by the maximized model. |
| `shown` | `AerisDialogVisibilityChangeEvent` | `-` | Emitted after the dialog opens. |
| `hidden` | `AerisDialogVisibilityChangeEvent` | `-` | Emitted after the dialog closes. |
| `visibilityChanged` | `AerisDialogVisibilityChangeEvent` | `-` | Emitted after either open or close. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisDialogHeader` | `AerisDialogTemplateContext` | `header input` | Custom header content rendered before header actions. |
| `aerisDialogFooter` | `AerisDialogTemplateContext` | `-` | Footer content with access to the close callback. |
| `aerisDialogCloseIcon` | `AerisDialogTemplateContext` | `built-in close icon` | Custom decorative close icon inside the close button. |
| `aerisDialogHeadless` | `AerisDialogTemplateContext` | `-` | Replaces the built-in header, body, and footer layout while preserving dialog semantics. |
| `default content` | `content projection` | `-` | Dialog body content. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(event?)` | `(Event &#124; null) =&gt; void` | `-` | Opens the dialog. |
| `hide(event?, reason?)` | `(Event &#124; null, AerisDialogCloseReason) =&gt; void` | `-` | Closes the dialog and records the close reason. |
| `toggle(event?)` | `(Event &#124; null) =&gt; void` | `-` | Opens or closes the dialog. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus to the initial focus target or first focusable control. |
| `toggleMaximized()` | `() =&gt; void` | `-` | Toggles maximized layout. |
| `maximize()` | `() =&gt; void` | `-` | Enters maximized layout. |
| `restore()` | `() =&gt; void` | `-` | Leaves maximized layout. |

## Interfaces and types

### Interfaces

```ts
type AerisDialogCloseReason = 'api' | 'close-button' | 'escape' | 'mask';
type AerisDialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
type AerisDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
type AerisDialogRole = 'dialog' | 'alertdialog';

interface AerisDialogVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisDialogCloseReason;
}

interface AerisDialogTemplateContext {
  readonly $implicit: AerisDialog;
  readonly close: (event?: Event) => void;
  readonly maximized: boolean;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-dialog-z-index` | `CSS custom property` | — | Overlay stacking context. |
| `--aeris-dialog-mask-background` | `CSS custom property` | — | Modal mask color. |
| `--aeris-dialog-backdrop-blur` | `CSS custom property` | — | Dialog backdrop blur radius. |
| `--aeris-backdrop-blur` | `CSS custom property` | — | Shared backdrop blur radius. |
| `--aeris-dialog-width` | `CSS custom property` | — | Custom panel width. |
| `--aeris-dialog-min-width` | `CSS custom property` | — | Minimum panel width. |
| `--aeris-dialog-max-width` | `CSS custom property` | — | Maximum viewport width. |
| `--aeris-dialog-height` | `CSS custom property` | — | Custom panel height. |
| `--aeris-dialog-max-height` | `CSS custom property` | — | Maximum viewport height. |
| `--aeris-dialog-mobile-width` | `CSS custom property` | — | Narrow viewport panel width. |
| `--aeris-dialog-viewport-padding` | `CSS custom property` | — | Overlay padding around the panel. |
| `--aeris-dialog-mobile-viewport-padding` | `CSS custom property` | — | Overlay padding on narrow viewports. |
| `--aeris-dialog-background` | `CSS custom property` | — | Panel surface. |
| `--aeris-dialog-color` | `CSS custom property` | — | Base text color. |
| `--aeris-dialog-body-color` | `CSS custom property` | — | Body text color. |
| `--aeris-dialog-border` | `CSS custom property` | — | Panel and section borders. |
| `--aeris-dialog-radius` | `CSS custom property` | — | Panel radius. |
| `--aeris-dialog-shadow` | `CSS custom property` | — | Panel shadow. |
| `--aeris-dialog-focus` | `CSS custom property` | — | Focus ring color. |
| `--aeris-dialog-header-padding` | `CSS custom property` | — | Header and footer padding. |
| `--aeris-dialog-body-padding` | `CSS custom property` | — | Body padding. |
| `--aeris-dialog-icon-color` | `CSS custom property` | — | Header action icon color. |

## Examples

### Basic

Open a modal dialog from application state. Dialog focuses the first available control and restores focus when closed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-basic-demo',
  imports: [AerisButton, AerisDialogModule],
  template: `
    <div>
      <button aerisButton type="button" (click)="basicOpen.set(true)">Open dialog</button>
      <aeris-dialog header="Project details" [(visible)]="basicOpen">
        <p>Review project ownership, milestone status, and pending approvals.</p>
      </aeris-dialog>
    </div>
  `
})
export class DialogBasicBasicDemo {
  protected readonly basicOpen = signal(false);
}
```

### Controlled state

Use the visible model and events when the application owns dialog state and needs close reasons.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule, type AerisDialogVisibilityChangeEvent } from '@aeris-ui/core/dialog';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-dialog-controlled-demo',
  imports: [AerisButton, AerisDialogModule, AerisInputText, AerisTextarea],
  templateUrl: './dialog-controlled.demo.html',
  styleUrl: './dialog-controlled.demo.scss'
})
export class DialogControlledControlledStateDemo {
  protected readonly controlledOpen = signal(false);
  protected readonly lastEvent = signal('Dialog is closed.');

  protected recordDialogEvent(event: AerisDialogVisibilityChangeEvent): void {
    this.lastEvent.set(
      event.visible
        ? 'Dialog opened.'
        : `Dialog closed by ${event.reason}.`,
    );
  }
}
```

#### HTML

```html
<div>
                <button aerisButton type="button" (click)="controlledOpen.set(true)">
                  Edit workspace
                </button>
                <aeris-dialog
                  header="Edit workspace"
                  [(visible)]="controlledOpen"
                  (visibilityChanged)="recordDialogEvent($event)"
                >
                  <form class="dialog-form">
                    <label>
                      Workspace name
                      <input aerisInputText type="text" value="Design System" />
                    </label>
                    <label>
                      Notes
                      <textarea aerisTextarea>
Shared component planning and release notes.</textarea>
                    </label>
                  </form>
                  <ng-template aerisDialogFooter let-close="close">
                    <div class="dialog-actions">
                      <button aerisButton type="button" (click)="close($event)">Cancel</button>
                      <button aerisButton type="button" (click)="close($event)">Save</button>
                    </div>
                  </ng-template>
                </aeris-dialog>
                <p class="dialog-status" aria-live="polite">{{ lastEvent() }}</p>
              </div>
```

#### CSS

```css
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--aeris-text-3);
  font-size: 0.8125rem;
}

.dialog-form {
  display: grid;
  gap: 0.75rem;
}

.dialog-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--aeris-text);
  font-weight: 700;
}

.dialog-form input,
.dialog-form textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-surface);
  color: var(--aeris-text);
  font: inherit;
}

.dialog-form input {
  min-height: 2.375rem;
  padding: 0 0.75rem;
}

.dialog-form textarea {
  min-height: 5rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}

@media (max-width: 42rem) {
  .dialog-controls,
    .dialog-actions {
      align-items: stretch;
      flex-direction: column;
    }
}

.dialog-form {
  display: grid;
  gap: 0.75rem;
}

.dialog-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--text);
  font-weight: 700;
}

.dialog-form input,
.dialog-form textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.dialog-form input {
  min-height: 2.375rem;
  padding: 0 0.75rem;
}

.dialog-form textarea {
  min-height: 5rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}

.dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Dismissal and backdrop

Backdrops are frosted by default. Set the blur strength per dialog, keep the backdrop without blur, or hide it while retaining modal behavior.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-dismissal-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-dismissal.demo.html',
  styleUrl: './dialog-dismissal.demo.scss'
})
export class DialogDismissalDismissalAndBackdropDemo {
  protected readonly dismissalOpen = signal(false);
  protected readonly noBackdropOpen = signal(false);
  protected readonly noBackdropBlurOpen = signal(false);
}
```

#### HTML

```html
<div>
  <div class="dialog-controls">
    <button aerisButton type="button" (click)="dismissalOpen.set(true)">
      Open strong blur
    </button>
    <button aerisButton type="button" (click)="noBackdropBlurOpen.set(true)">
      Open without blur
    </button>
    <button aerisButton type="button" (click)="noBackdropOpen.set(true)">
      Open without backdrop
    </button>
  </div>
  <aeris-dialog
    header="Dismissible dialog"
    dismissibleMask
    backdropBlurAmount="1rem"
    [(visible)]="dismissalOpen"
  >
    <p>This mask uses a 1rem blur. Press it outside the panel to dismiss.</p>
  </aeris-dialog>
  <aeris-dialog
    header="Backdrop without blur"
    [backdropBlur]="false"
    [(visible)]="noBackdropBlurOpen"
  >
    <p>The backdrop still dims the page without applying the frosted blur.</p>
  </aeris-dialog>
  <aeris-dialog header="No backdrop" [backdrop]="false" [(visible)]="noBackdropOpen">
    <p>This dialog remains modal, but the visual backdrop is not rendered.</p>
  </aeris-dialog>
</div>
```

#### CSS

```css
.dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Templates

Replace the header, footer, and close icon while Dialog keeps the dialog role and close button semantics.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-templates-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-templates.demo.html',
  styleUrl: './dialog-templates.demo.scss'
})
export class DialogTemplatesTemplatesDemo {
  protected readonly templateOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="templateOpen.set(true)">
    Open templated dialog
  </button>
  <aeris-dialog ariaLabel="Release dialog" [(visible)]="templateOpen">
    <ng-template aerisDialogHeader>
      <span class="dialog-title-stack">
        <span>Release checklist</span>
        <small>3 required tasks</small>
      </span>
    </ng-template>
    <ng-template aerisDialogCloseIcon>
      <span class="dialog-close-icon"></span>
    </ng-template>
    <p>Confirm changelog, owner approval, and rollout timing before publishing.</p>
    <ng-template aerisDialogFooter let-close="close">
      <div class="dialog-actions">
        <button aerisButton type="button" (click)="close($event)">Close</button>
      </div>
    </ng-template>
  </aeris-dialog>
</div>
```

#### CSS

```css
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-title-stack {
  display: grid;
  gap: 0.15rem;
}

.dialog-title-stack small {
  color: var(--aeris-text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.dialog-close-icon {
  position: relative;
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-block;
}

.dialog-close-icon::before,
.dialog-close-icon::after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  content: "";
}

.dialog-close-icon::before {
  transform: rotate(45deg);
}

.dialog-close-icon::after {
  transform: rotate(-45deg);
}

@media (max-width: 42rem) {
  .dialog-controls,
    .dialog-actions {
      align-items: stretch;
      flex-direction: column;
    }
}

.dialog-title-stack {
  display: grid;
  gap: 0.15rem;
}

.dialog-title-stack small {
  color: var(--text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.dialog-close-icon {
  position: relative;
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-block;
}

.dialog-close-icon::before,
.dialog-close-icon::after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.dialog-close-icon::before {
  transform: rotate(45deg);
}

.dialog-close-icon::after {
  transform: rotate(-45deg);
}

.dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Positions

Position the same dialog near viewport edges for contextual workflows.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-positions-demo',
  imports: [AerisButton, AerisDialogModule],
  template: `
    <div>
      <div class="dialog-controls">
        <button aerisButton type="button" (click)="openAt('center')">Center</button>
        <button aerisButton type="button" (click)="openAt('top-right')">Top right</button>
        <button aerisButton type="button" (click)="openAt('bottom')">Bottom</button>
      </div>
      <aeris-dialog
        header="Positioned dialog"
        [position]="currentPosition()"
        [(visible)]="positionOpen"
      >
        <p>This dialog opens at {{ currentPosition() }}.</p>
      </aeris-dialog>
    </div>
  `,
  styles: `
    .dialog-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    
    .dialog-status {
      margin-top: 0.875rem;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class DialogPositionsPositionsDemo {
  protected readonly positionOpen = signal(false);
  protected readonly currentPosition = signal<'center' | 'top-right' | 'bottom'>('center');

  protected openAt(position: 'center' | 'top-right' | 'bottom'): void {
    this.currentPosition.set(position);
    this.positionOpen.set(true);
  }
}
```

### Custom width

Set an exact panel width while preserving viewport-safe maximums.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-sizing-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-sizing.demo.html'
})
export class DialogSizingCustomWidthDemo {
  protected readonly sizingOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="sizingOpen.set(true)">
    Open custom-width dialog
  </button>
  <aeris-dialog
    header="Custom width"
    width="42rem"
    maxWidth="calc(100vw - 2rem)"
    [(visible)]="sizingOpen"
  >
    <p>
      The width input accepts any valid CSS length and still respects the viewport
      maximum.
    </p>
  </aeris-dialog>
</div>
```

### Responsive width

Use a desktop width with a narrow-viewport width for mobile layouts.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-responsive-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-responsive.demo.html'
})
export class DialogResponsiveResponsiveWidthDemo {
  protected readonly responsiveOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="responsiveOpen.set(true)">
    Open responsive dialog
  </button>
  <aeris-dialog
    header="Responsive dialog"
    width="44rem"
    maxWidth="calc(100vw - 2rem)"
    mobileWidth="calc(100vw - 1rem)"
    [(visible)]="responsiveOpen"
  >
    <p>
      The dialog uses the custom desktop width until the built-in narrow viewport
      query applies the mobile width.
    </p>
  </aeris-dialog>
</div>
```

### Long content

Constrain dialog height so lengthy body content scrolls while the header and footer remain available.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-long-content-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-long-content.demo.html',
  styleUrl: './dialog-long-content.demo.scss'
})
export class DialogLongContentLongContentDemo {
  protected readonly longContentOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="longContentOpen.set(true)">
    Open long content dialog
  </button>
  <aeris-dialog
    header="Release notes"
    width="38rem"
    maxHeight="26rem"
    [(visible)]="longContentOpen"
  >
    <p>
      Version 4.2 includes updates across component behavior, design tokens,
      documentation, and test coverage.
    </p>
    <p>
      Button, table, tree, and dialog examples now use complete Angular component code
      so copied examples can run without hidden context.
    </p>
    <p>
      Dialog keeps the header and footer visible while body content scrolls inside the
      constrained panel.
    </p>
    <p>
      Keyboard checks cover Escape dismissal, focus trapping, close-button semantics,
      and focus restoration after the dialog closes.
    </p>
    <p>
      Accessibility updates clarify when visible labels are generated automatically
      and when ariaLabel or ariaLabelledBy should be provided.
    </p>
    <p>
      Theme updates keep overlay, surface, border, focus, and text colors aligned
      across every palette in light and dark mode.
    </p>
    <p>
      Responsive behavior uses viewport-safe maximums by default and supports a
      dedicated mobileWidth value for narrow layouts.
    </p>
    <p>
      Consumers can opt out of the visual backdrop while retaining modal semantics,
      focus management, and scroll blocking.
    </p>
    <p>
      Headless composition is available for custom surfaces that still need the
      built-in dialog role and focus behavior.
    </p>
    <p>
      Long release notes, review checklists, and legal notices should set maxHeight so
      important actions remain reachable.
    </p>
    <p>
      The scrollable region is the dialog body. Footer actions remain fixed at the
      bottom of the dialog panel.
    </p>
    <p>
      This final paragraph confirms the body is long enough to require scrolling in
      the live example.
    </p>
    <ng-template aerisDialogFooter let-close="close">
      <div class="dialog-actions">
        <button aerisButton type="button" (click)="close($event)">Close</button>
      </div>
    </ng-template>
  </aeris-dialog>
</div>
```

#### CSS

```css
.dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Confirmation

Compose a focused confirmation flow by disabling incidental close affordances and providing explicit actions.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-confirmation-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-confirmation.demo.html',
  styleUrl: './dialog-confirmation.demo.scss'
})
export class DialogConfirmationConfirmationDemo {
  protected readonly confirmOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="confirmOpen.set(true)">
    Open confirmation
  </button>
  <aeris-dialog
    header="Archive workspace?"
    [closable]="false"
    [closeOnEscape]="false"
    initialFocus="#archive-cancel"
    [(visible)]="confirmOpen"
  >
    <p>
      This action moves the workspace out of active navigation. You can restore it
      later from settings.
    </p>
    <ng-template aerisDialogFooter let-close="close">
      <div class="dialog-actions">
        <button aerisButton id="archive-cancel" type="button" (click)="close($event)">
          Cancel
        </button>
        <button aerisButton type="button" (click)="close($event)">Archive</button>
      </div>
    </ng-template>
  </aeris-dialog>
</div>
```

#### CSS

```css
.dialog-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.dialog-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Headless

Replace the built-in layout when a workflow needs a fully custom surface while Dialog keeps focus and dialog semantics.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-headless-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-headless.demo.html',
  styleUrl: './dialog-headless.demo.scss'
})
export class DialogHeadlessHeadlessDemo {
  protected readonly headlessOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="headlessOpen.set(true)">
    Open headless dialog
  </button>
  <aeris-dialog
    ariaLabel="Custom notification"
    width="24rem"
    [(visible)]="headlessOpen"
  >
    <ng-template aerisDialogHeadless let-close="close">
      <div class="headless-dialog">
        <h3>Custom notification</h3>
        <p>
          Use headless mode when the default header, body, and footer layout should be
          replaced.
        </p>
        <button aerisButton type="button" (click)="close($event)">Close</button>
      </div>
    </ng-template>
  </aeris-dialog>
</div>
```

#### CSS

```css
.headless-dialog {
  padding: 1.25rem;
  border-radius: var(--aeris-dialog-radius, var(--aeris-radius-lg));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), transparent 55%),
    var(--surface);
  color: var(--text);
}

.headless-dialog h3 {
  margin: 0;
  font-size: 1.125rem;
}

.headless-dialog p {
  margin: 0.5rem 0 1rem;
  color: var(--text-2);
}
```

### Maximize, drag, and resize

Enable optional layout utilities for advanced editing surfaces.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDialogModule } from '@aeris-ui/core/dialog';

@Component({
  selector: 'app-dialog-utilities-demo',
  imports: [AerisButton, AerisDialogModule],
  templateUrl: './dialog-utilities.demo.html'
})
export class DialogUtilitiesMaximizeDragAndResizeDemo {
  protected readonly utilityOpen = signal(false);
  protected readonly maximized = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="utilityOpen.set(true)">
    Open utility dialog
  </button>
  <aeris-dialog
    header="Utility dialog"
    maximizable
    draggable
    resizable
    [(visible)]="utilityOpen"
    [(maximized)]="maximized"
  >
    <p>
      Drag from the header, resize from the panel edge, or maximize from the header
      action.
    </p>
  </aeris-dialog>
</div>
```

## Accessibility

- Dialog renders role="dialog" and sets aria-modal from the modal input. A visible header labels the dialog automatically unless ariaLabel or ariaLabelledBy is provided.
- When opened, focus moves to initialFocus, the first focusable control, or the dialog panel. Tab navigation is trapped while focusTrap is enabled, and focus is restored after close when restoreFocus is enabled.
- The backdrop input controls only the visible mask. The modal input controls modal semantics, scroll blocking, and focus behavior.
- Mask dismissal is opt-in. Escape dismissal is enabled by default and can be disabled with closeOnEscape.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to the next focusable item inside the dialog; wraps to the first item from the last item. |
| `Shift + Tab` | Moves to the previous focusable item inside the dialog; wraps to the last item from the first item. |
| `Escape` | Closes the dialog when closeOnEscape is enabled. |
| `Enter / Space` | Activates focused buttons, including the close and maximize controls. |
