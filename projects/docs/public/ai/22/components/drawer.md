# Drawer

> Edge-anchored overlay panel with modal behavior, templates, positions, and responsive sizing.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/drawer`
- Human-readable documentation: [https://aeris-ui.dev/components/drawer](https://aeris-ui.dev/components/drawer)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisDrawerModule } from '@aeris-ui/core/drawer';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | `''` | Default drawer title rendered in the header. |
| `position` | `AerisDrawerPosition` | `'right'` | Anchors the drawer to the left, right, top, or bottom viewport edge. |
| `size` | `AerisDrawerSize` | `'md'` | Applies preset width or height based on position. |
| `modal` | `boolean` | `true` | Enables modal semantics, focus handling, and optional scroll blocking. |
| `backdrop` | `boolean` | `true` | Shows the modal backdrop. Set false for a modal drawer without the visual mask. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the visible backdrop. |
| `backdropBlurAmount` | `string` | `''` | Overrides the backdrop blur radius for this drawer with a CSS length. |
| `dismissibleMask` | `boolean` | `false` | Closes the drawer when the mask itself is pressed. |
| `closeOnEscape` | `boolean` | `true` | Closes the drawer when Escape is pressed. |
| `closable` | `boolean` | `true` | Shows the close button in the header. |
| `maximizable` | `boolean` | `false` | Shows a header action that toggles full-screen drawer layout. |
| `blockScroll` | `boolean` | `true` | Locks body scroll while a modal drawer is open. |
| `focusTrap` | `boolean` | `true` | Cycles Tab and Shift + Tab inside the drawer while open. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the previously focused element after close. |
| `autoFocus` | `boolean` | `true` | Focuses the initial target or first focusable element after open. |
| `initialFocus` | `string` | `''` | CSS selector for the first element to focus inside the drawer. |
| `width` | `string` | `''` | Custom width for left and right drawers. |
| `height` | `string` | `''` | Custom height for top and bottom drawers. |
| `maxWidth` | `string` | `''` | Maximum drawer width. |
| `maxHeight` | `string` | `''` | Maximum drawer height. |
| `mobileWidth` | `string` | `''` | Width used by side drawers on narrow viewports. |
| `mobileHeight` | `string` | `''` | Height used by top or bottom drawers on narrow viewports. |
| `mobileFullScreen` | `boolean` | `false` | Makes the drawer full viewport below the built-in narrow breakpoint. |
| `closeAriaLabel` | `string` | `'Close drawer'` | Accessible label for the built-in close button. |
| `ariaLabel` | `string` | `''` | Accessible name used when no visible header labels the drawer. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the drawer. |
| `ariaDescribedBy` | `string` | `''` | IDs of elements that describe the drawer content. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Controls whether the drawer is rendered. |
| `maximized` | `boolean` | `false` | Controls whether the drawer fills the viewport. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `shown` | `AerisDrawerVisibilityChangeEvent` | `-` | Emits after the drawer becomes visible. |
| `hidden` | `AerisDrawerVisibilityChangeEvent` | `-` | Emits after the drawer is hidden. |
| `visibilityChanged` | `AerisDrawerVisibilityChangeEvent` | `-` | Emits for both open and close transitions. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisDrawerHeader` | `TemplateRef&lt;AerisDrawerTemplateContext&gt;` | `-` | Replaces the default header title area. |
| `aerisDrawerFooter` | `TemplateRef&lt;AerisDrawerTemplateContext&gt;` | `-` | Renders a footer below the scrollable body. |
| `aerisDrawerCloseIcon` | `TemplateRef&lt;AerisDrawerTemplateContext&gt;` | `-` | Replaces the built-in close icon inside the native close button. |
| `aerisDrawerHeadless` | `TemplateRef&lt;AerisDrawerTemplateContext&gt;` | `-` | Replaces all internal chrome while keeping drawer semantics and focus behavior. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(originalEvent)` | `void` | `originalEvent: null` | Opens the drawer. |
| `hide(originalEvent, reason)` | `void` | `reason: 'api'` | Closes the drawer and emits the close reason. |
| `toggle(originalEvent)` | `void` | `originalEvent: null` | Opens the drawer when closed or closes it when open. |
| `focus(options)` | `void` | `-` | Moves focus to the configured initial target or first focusable element. |
| `toggleMaximized()` | `void` | `-` | Toggles full-screen drawer layout. |
| `maximize()` | `void` | `-` | Sets the drawer to full-screen layout. |
| `restore()` | `void` | `-` | Restores the drawer to its configured edge size. |

## Interfaces and types

### Interfaces

```ts
type AerisDrawerCloseReason = 'api' | 'close-button' | 'escape' | 'mask';
type AerisDrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type AerisDrawerSize = 'sm' | 'md' | 'lg' | 'full';

interface AerisDrawerVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisDrawerCloseReason;
}

interface AerisDrawerTemplateContext {
  readonly $implicit: AerisDrawer;
  readonly close: (event?: Event) => void;
  readonly position: AerisDrawerPosition;
  readonly maximized: boolean;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-drawer-width` | `CSS custom property` | — | Side drawer width. |
| `--aeris-drawer-height` | `CSS custom property` | — | Top and bottom drawer height. |
| `--aeris-drawer-max-width` | `CSS custom property` | — | Maximum side drawer width. |
| `--aeris-drawer-max-height` | `CSS custom property` | — | Maximum top and bottom drawer height. |
| `--aeris-drawer-mobile-width` | `CSS custom property` | — | Side drawer width below the narrow breakpoint. |
| `--aeris-drawer-mobile-height` | `CSS custom property` | — | Top or bottom drawer height below the narrow breakpoint. |
| `--aeris-drawer-background` | `CSS custom property` | — | Panel background. |
| `--aeris-drawer-color` | `CSS custom property` | — | Base drawer text color. |
| `--aeris-drawer-body-color` | `CSS custom property` | — | Body text color. |
| `--aeris-drawer-border` | `CSS custom property` | — | Panel, header, and footer border color. |
| `--aeris-drawer-radius` | `CSS custom property` | — | Open-edge panel corner radius. |
| `--aeris-drawer-shadow` | `CSS custom property` | — | Panel elevation. |
| `--aeris-drawer-mask-background` | `CSS custom property` | — | Backdrop color. |
| `--aeris-drawer-backdrop-blur` | `CSS custom property` | — | Drawer backdrop blur radius. |
| `--aeris-backdrop-blur` | `CSS custom property` | — | Shared backdrop blur radius. |
| `--aeris-drawer-header-padding` | `CSS custom property` | — | Header and footer padding. |
| `--aeris-drawer-body-padding` | `CSS custom property` | — | Body padding. |
| `--aeris-drawer-focus` | `CSS custom property` | — | Focus outline color. |

## Examples

### Basic

Open a modal drawer from application state. Drawer focuses the first available control and restores focus when closed.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-basic-demo',
  imports: [AerisButton, AerisDrawerModule],
  template: `
    <div>
      <button aerisButton type="button" (click)="basicOpen.set(true)">Open drawer</button>
      <aeris-drawer header="Navigation" [(visible)]="basicOpen">
        <p>
          Use a drawer for navigation, filters, settings, and supporting workflows that
          should stay attached to a viewport edge.
        </p>
      </aeris-drawer>
    </div>
  `
})
export class DrawerBasicBasicDemo {
  protected readonly basicOpen = signal(false);
}
```

### Controlled state

Use the visible model and visibility events when application state owns the drawer lifecycle.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule, type AerisDrawerVisibilityChangeEvent } from '@aeris-ui/core/drawer';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-drawer-controlled-demo',
  imports: [AerisButton, AerisDrawerModule, AerisInputText, AerisTextarea],
  templateUrl: './drawer-controlled.demo.html',
  styleUrl: './drawer-controlled.demo.scss'
})
export class DrawerControlledControlledStateDemo {
  protected readonly controlledOpen = signal(false);
  protected readonly lastEvent = signal('Drawer is closed.');

  protected recordDrawerEvent(event: AerisDrawerVisibilityChangeEvent): void {
    this.lastEvent.set(
      event.visible
        ? 'Drawer opened.'
        : `Drawer closed by ${event.reason}.`,
    );
  }
}
```

#### HTML

```html
<div>
                <button aerisButton type="button" (click)="controlledOpen.set(true)">
                  Edit settings
                </button>
                <aeris-drawer
                  header="Workspace settings"
                  [(visible)]="controlledOpen"
                  (visibilityChanged)="recordDrawerEvent($event)"
                >
                  <form class="drawer-form">
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
                  <ng-template aerisDrawerFooter let-close="close">
                    <div class="drawer-actions">
                      <button aerisButton type="button" (click)="close($event)">Cancel</button>
                      <button aerisButton type="button" (click)="close($event)">Save</button>
                    </div>
                  </ng-template>
                </aeris-drawer>
                <p class="drawer-status" aria-live="polite">{{ lastEvent() }}</p>
              </div>
```

#### CSS

```css
.drawer-controls,
.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  justify-content: flex-end;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--aeris-text-3);
  font-size: 0.8125rem;
}

.drawer-form,
.drawer-stack {
  display: grid;
  gap: 0.75rem;
}

.drawer-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--aeris-text);
  font-weight: 700;
}

.drawer-form input,
.drawer-form textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--aeris-radius-sm);
  background: var(--aeris-surface);
  color: var(--aeris-text);
  font: inherit;
}

.drawer-form input {
  min-height: 2.375rem;
  padding: 0 0.75rem;
}

.drawer-form textarea {
  min-height: 5rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}

.drawer-form {
  display: grid;
  gap: 0.75rem;
}

.drawer-form label {
  display: grid;
  gap: 0.35rem;
  color: var(--text);
  font-weight: 700;
}

.drawer-form input,
.drawer-form textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
}

.drawer-form input {
  min-height: 2.375rem;
  padding: 0 0.75rem;
}

.drawer-form textarea {
  min-height: 5rem;
  padding: 0.625rem 0.75rem;
  resize: vertical;
}

.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Positions

Anchor the drawer to any viewport edge while keeping the same modal and focus behavior.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule, type AerisDrawerPosition } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-positions-demo',
  imports: [AerisButton, AerisDrawerModule],
  templateUrl: './drawer-positions.demo.html',
  styleUrl: './drawer-positions.demo.scss'
})
export class DrawerPositionsPositionsDemo {
  protected readonly positionOpen = signal(false);
  protected readonly currentPosition = signal<AerisDrawerPosition>('right');

  protected openDrawerAt(position: AerisDrawerPosition): void {
    this.currentPosition.set(position);
    this.positionOpen.set(true);
  }
}
```

#### HTML

```html
<div>
  <div class="drawer-controls">
    <button aerisButton type="button" (click)="openDrawerAt('left')">Left</button>
    <button aerisButton type="button" (click)="openDrawerAt('right')">Right</button>
    <button aerisButton type="button" (click)="openDrawerAt('top')">Top</button>
    <button aerisButton type="button" (click)="openDrawerAt('bottom')">Bottom</button>
  </div>
  <aeris-drawer
    header="Positioned drawer"
    [position]="currentPosition()"
    [(visible)]="positionOpen"
  >
    <p>This drawer opens from the {{ currentPosition() }} edge.</p>
  </aeris-drawer>
</div>
```

#### CSS

```css
.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Dismissal and backdrop

Backdrops are frosted by default. Enable outside-click dismissal, keep the backdrop without blur, or hide it while retaining modal behavior.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-dismissal-demo',
  imports: [AerisButton, AerisDrawerModule],
  templateUrl: './drawer-dismissal.demo.html',
  styleUrl: './drawer-dismissal.demo.scss'
})
export class DrawerDismissalDismissalAndBackdropDemo {
  protected readonly dismissibleOpen = signal(false);
  protected readonly noBackdropOpen = signal(false);
  protected readonly noBackdropBlurOpen = signal(false);
}
```

#### HTML

```html
<div>
  <div class="drawer-controls">
    <button aerisButton type="button" (click)="dismissibleOpen.set(true)">
      Open dismissible drawer
    </button>
    <button aerisButton type="button" (click)="noBackdropBlurOpen.set(true)">
      Open without blur
    </button>
    <button aerisButton type="button" (click)="noBackdropOpen.set(true)">
      Open without backdrop
    </button>
  </div>
  <aeris-drawer
    header="Dismissible drawer"
    dismissibleMask
    [(visible)]="dismissibleOpen"
  >
    <p>Press Escape, use the close button, or press the mask outside the panel.</p>
  </aeris-drawer>
  <aeris-drawer
    header="Backdrop without blur"
    [backdropBlur]="false"
    [(visible)]="noBackdropBlurOpen"
  >
    <p>The backdrop still dims the page without applying the frosted blur.</p>
  </aeris-drawer>
  <aeris-drawer header="No backdrop" [backdrop]="false" [(visible)]="noBackdropOpen">
    <p>This drawer remains modal, but the visual backdrop is not rendered.</p>
  </aeris-drawer>
</div>
```

#### CSS

```css
.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Templates

Replace the header, footer, and close icon while Drawer keeps the dialog role and close button semantics.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-templates-demo',
  imports: [AerisButton, AerisDrawerModule],
  templateUrl: './drawer-templates.demo.html',
  styleUrl: './drawer-templates.demo.scss'
})
export class DrawerTemplatesTemplatesDemo {
  protected readonly templateOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="templateOpen.set(true)">
    Open templated drawer
  </button>
  <aeris-drawer ariaLabel="Release drawer" [(visible)]="templateOpen">
    <ng-template aerisDrawerHeader let-position="position">
      <span class="drawer-title-stack">
        <span>Release checklist</span>
        <small>Opened from {{ position }}</small>
      </span>
    </ng-template>
    <ng-template aerisDrawerCloseIcon>
      <span class="drawer-close-icon"></span>
    </ng-template>
    <p>Confirm changelog, owner approval, and rollout timing before publishing.</p>
    <ng-template aerisDrawerFooter let-close="close">
      <div class="drawer-actions">
        <button aerisButton type="button" (click)="close($event)">Close</button>
      </div>
    </ng-template>
  </aeris-drawer>
</div>
```

#### CSS

```css
.drawer-controls,
.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  justify-content: flex-end;
}

.drawer-title-stack {
  display: grid;
  gap: 0.15rem;
}

.drawer-title-stack small {
  color: var(--aeris-text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.drawer-close-icon {
  position: relative;
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-block;
}

.drawer-close-icon::before,
.drawer-close-icon::after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  content: "";
}

.drawer-close-icon::before {
  transform: rotate(45deg);
}

.drawer-close-icon::after {
  transform: rotate(-45deg);
}

.drawer-title-stack {
  display: grid;
  gap: 0.15rem;
}

.drawer-title-stack small {
  color: var(--text-3);
  font-size: 0.75rem;
  font-weight: 600;
}

.drawer-close-icon {
  position: relative;
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  display: inline-block;
}

.drawer-close-icon::before,
.drawer-close-icon::after {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  content: '';
}

.drawer-close-icon::before {
  transform: rotate(45deg);
}

.drawer-close-icon::after {
  transform: rotate(-45deg);
}

.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Responsive sizing

Set desktop dimensions and opt into full-screen mobile layout for dense workflows.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-responsive-demo',
  imports: [AerisButton, AerisDrawerModule],
  templateUrl: './drawer-responsive.demo.html',
  styleUrl: './drawer-responsive.demo.scss'
})
export class DrawerResponsiveResponsiveSizingDemo {
  protected readonly responsiveOpen = signal(false);
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="responsiveOpen.set(true)">
    Open responsive drawer
  </button>
  <aeris-drawer
    class="settings-drawer"
    header="Responsive settings"
    width="30rem"
    mobileWidth="100vw"
    mobileFullScreen
    [(visible)]="responsiveOpen"
  >
    <p>
      The drawer uses a desktop width until the built-in narrow viewport query applies
      the full-screen mobile layout.
    </p>
  </aeris-drawer>
</div>
```

#### CSS

```css
.settings-drawer {
  --aeris-drawer-width: 28rem;
  --aeris-drawer-radius: 1.25rem;
  --aeris-drawer-header-background: color-mix(
    in srgb,
    var(--aeris-primary) 10%,
    var(--aeris-surface)
  );
}
```

### Full screen

Use a maximizable drawer when users should be able to expand an edge panel, or bind maximized when it should open full screen.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-fullscreen-demo',
  imports: [AerisButton, AerisDrawerModule],
  templateUrl: './drawer-fullscreen.demo.html',
  styleUrl: './drawer-fullscreen.demo.scss'
})
export class DrawerFullscreenFullScreenDemo {
  protected readonly maximizableOpen = signal(false);
  protected readonly fullscreenOpen = signal(false);
  protected readonly drawerMaximized = signal(false);
}
```

#### HTML

```html
<div>
  <div class="drawer-controls">
    <button aerisButton type="button" (click)="maximizableOpen.set(true)">
      Open maximizable drawer
    </button>
    <button aerisButton type="button" (click)="fullscreenOpen.set(true)">
      Open full-screen drawer
    </button>
  </div>
  <aeris-drawer
    header="Workspace panel"
    width="30rem"
    maximizable
    [(visible)]="maximizableOpen"
    [(maximized)]="drawerMaximized"
  >
    <div class="drawer-stack">
      <section class="drawer-card">
        <strong>Expandable workflow</strong>
        <p>
          Use the maximize button in the header to switch between edge and full-screen
          layouts.
        </p>
      </section>
      <section class="drawer-card">
        <strong>Current state</strong>
        <p>Maximized: {{ drawerMaximized() ? 'yes' : 'no' }}</p>
      </section>
    </div>
  </aeris-drawer>
  <aeris-drawer
    header="Full-screen review"
    [maximized]="true"
    [(visible)]="fullscreenOpen"
  >
    <div class="drawer-stack">
      <section class="drawer-card">
        <strong>Opened full screen</strong>
        <p>
          This drawer starts in full-screen layout without requiring a maximize
          action.
        </p>
      </section>
      <section class="drawer-card">
        <strong>Use case</strong>
        <p>
          Full-screen drawers work well for detailed mobile workflows, large forms,
          and focused review tasks.
        </p>
      </section>
    </div>
  </aeris-drawer>
</div>
```

#### CSS

```css
.drawer-controls,
.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-form,
.drawer-stack {
  display: grid;
  gap: 0.75rem;
}

.drawer-stack {
  gap: 0.875rem;
}

.drawer-card {
  padding: 0.875rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-md);
  background: var(--aeris-surface-2);
}

.drawer-card p {
  margin: 0.25rem 0 0;
}

.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}

.drawer-stack {
  display: grid;
  gap: 0.875rem;
}

.drawer-card {
  padding: 0.875rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface-2);
}

.drawer-card p {
  margin: 0.25rem 0 0;
}
```

### Long content

Drawer body content scrolls independently so the header and footer stay available.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-long-content-demo',
  imports: [AerisButton, AerisDrawerModule],
  templateUrl: './drawer-long-content.demo.html',
  styleUrl: './drawer-long-content.demo.scss'
})
export class DrawerLongContentLongContentDemo {
  protected readonly longContentOpen = signal(false);
  protected readonly filterGroups = [
    'Status',
    'Owner',
    'Priority',
    'Release',
    'Team',
    'Date range',
    'Tags',
    'Archived',
    'Created by',
    'Updated by',
    'Sprint',
    'Risk',
    'Customer',
    'Environment',
    'Review state',
    'Deployment window',
  ] as const;
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="longContentOpen.set(true)">
    Open long content drawer
  </button>
  <aeris-drawer header="Filters" width="26rem" [(visible)]="longContentOpen">
    <div class="drawer-stack">
      @for (group of filterGroups; track group) {
        <section class="drawer-card">
          <strong>{{ group }}</strong>
          <p>Filter options for {{ group.toLowerCase() }}.</p>
        </section>
      }
    </div>
    <ng-template aerisDrawerFooter let-close="close">
      <div class="drawer-actions">
        <button aerisButton type="button" (click)="close($event)">
          Apply filters
        </button>
      </div>
    </ng-template>
  </aeris-drawer>
</div>
```

#### CSS

```css
.drawer-controls,
.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  justify-content: flex-end;
}

.drawer-form,
.drawer-stack {
  display: grid;
  gap: 0.75rem;
}

.drawer-stack {
  gap: 0.875rem;
}

.drawer-card {
  padding: 0.875rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-md);
  background: var(--aeris-surface-2);
}

.drawer-card p {
  margin: 0.25rem 0 0;
}

.drawer-stack {
  display: grid;
  gap: 0.875rem;
}

.drawer-card {
  padding: 0.875rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface-2);
}

.drawer-card p {
  margin: 0.25rem 0 0;
}

.drawer-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.drawer-status {
  margin-top: 0.875rem;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Headless

Replace all internal chrome while Drawer keeps the role, focus trap, escape handling, and close callback.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule } from '@aeris-ui/core/drawer';

@Component({
  selector: 'app-drawer-headless-demo',
  imports: [AerisButton, AerisDrawerModule],
  template: `
    <div>
      <button aerisButton type="button" (click)="headlessOpen.set(true)">
        Open headless drawer
      </button>
      <aeris-drawer ariaLabel="Headless onboarding drawer" [(visible)]="headlessOpen">
        <ng-template aerisDrawerHeadless let-close="close">
          <div class="headless-drawer">
            <h3>Invite teammates</h3>
            <p>Share access with reviewers before the release goes live.</p>
            <button aerisButton type="button" (click)="close($event)">Done</button>
          </div>
        </ng-template>
      </aeris-drawer>
    </div>
  `,
  styles: `
    .headless-drawer {
      min-height: 100%;
      display: grid;
      align-content: center;
      gap: 1rem;
      padding: 1.25rem;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), transparent 55%),
        var(--surface);
      color: var(--text);
    }
    
    .headless-drawer h3,
    .headless-drawer p {
      margin: 0;
    }
    
    .headless-drawer p {
      color: var(--text-2);
    }
    
    .headless-drawer .aeris-button {
      justify-self: start;
    }
  `
})
export class DrawerHeadlessHeadlessDemo {
  protected readonly headlessOpen = signal(false);
}
```

## Accessibility

- Drawer renders a role="dialog" panel and sets aria-modal from the modal input.
- Visible headers automatically label the drawer. Use ariaLabel or ariaLabelledBy when no visible title is rendered.
- When opened, Drawer focuses initialFocus, then the first focusable element, then the drawer panel.
- Focus is trapped by default and returns to the previously focused element when the drawer closes.
- The close control is a native button with a configurable accessible label.
- Use dismissibleMask only when closing from outside the drawer cannot cause data loss.
- Use maximizable or bind maximized when the drawer should support full-screen workflows.
- Set mobileFullScreen for complex workflows that need more space on narrow screens.
- Drawer motion is disabled for users who request reduced motion.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to the next focusable element inside the drawer. From the last element, focus wraps to the first when focusTrap is enabled. |
| `Shift + Tab` | Moves focus to the previous focusable element inside the drawer. From the first element, focus wraps to the last when focusTrap is enabled. |
| `Escape` | Closes the drawer when closeOnEscape is true. |
| `Enter / Space` | Activates the focused native control, including the built-in close button and projected buttons. |
