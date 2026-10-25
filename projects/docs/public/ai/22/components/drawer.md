# Drawer

> Edge-anchored overlay panel with modal behavior, templates, positions, and responsive sizing.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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
| `snapPoints` | `readonly AerisDrawerSnapPoint[]` | `[]` | Bottom-drawer heights: numbers in (0, 1] are fractions of available height; strings such as 320px are pixels. Sorted by resolved height, duplicates removed, invalid values ignored, pixels capped to the available viewport/container. Ignored for other edges, size full, maximized or mobileFullScreen. Snap sizing replaces height, mobileHeight and maxHeight; express the maximum through the largest point instead. An empty valid set retains ordinary sizing. |
| `snapAriaLabel` | `string` | `'Resize drawer'` | Accessible name for the optional snap-point slider shown by swipeHandle. |
| `swipeToClose` | `boolean` | `false` | Allows swiping non-interactive drawer content toward its physical screen edge. Scrollable content keeps the gesture when it can scroll in that direction. Inputs, buttons, links and nested interactive controls do not start dismissal. Disabled while maximized. |
| `swipeHandle` | `boolean` | `false` | Shows an optional handle with no reserved space when false. With snap points it is a keyboard-operable height slider, not a close button. Otherwise swipeToClose makes it a draggable close button that closes on tap, Enter or Space. Hidden while maximized. |
| `swipeThreshold` | `number` | `0.35` | Without snap points, the fraction of drawer width/height required to dismiss (clamped to 0.1–1); a recent flick of at least 32px at 0.5px/ms also dismisses. With snap points, this threshold is replaced by settling: projected release height below half the smallest point dismisses only when swipeToClose is true. Both use physical edges, including in RTL. |
| `closeIconTemplate` | `TemplateRef&lt;AerisDrawerTemplateContext&gt; &#124; undefined` | `undefined` | Optional close artwork. Takes precedence over the projected close-icon template; Aeris keeps the close button and its accessible name. |
| `maximizeIconTemplate` | `TemplateRef&lt;AerisDrawerTemplateContext&gt; &#124; undefined` | `undefined` | Replaces only the maximize icon artwork. Keep the icon decorative and non-interactive; Aeris retains the control behavior. |
| `appendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `global config or 'body'` | Mounts the drawer overlay locally, in document.body, or in the supplied DOM/template target. |
| `header` | `string` | `''` | Default drawer title rendered in the header. |
| `position` | `AerisDrawerPosition` | `'right'` | Anchors the drawer to the left, right, top, or bottom viewport edge. |
| `size` | `AerisDrawerSize` | `'md'` | Applies preset width or height based on position. Options: 'sm', 'md', 'lg', 'full'. |
| `modal` | `boolean` | `true` | Enables modal semantics, focus handling, and optional scroll blocking. |
| `backdrop` | `boolean` | `true` | Shows the modal backdrop. Set false for a modal drawer without the visual mask. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the visible backdrop. |
| `backdropBlurAmount` | `string` | `''` | Overrides the backdrop blur radius for this drawer with a CSS length. |
| `closeOnBackdropClick` | `boolean` | `false` | Closes the drawer when the mask itself is pressed. |
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
| `footerLayout` | `AerisDrawerFooterLayout` | `'responsive'` | Controls projected footer actions. Responsive wraps when needed and stacks on narrow screens. Options: 'responsive', 'wrap', 'stack', 'inline'. |
| `closeAriaLabel` | `string` | `'Close drawer'` | Accessible label for the built-in close button. |
| `ariaLabel` | `string` | `''` | Accessible name used when no visible header labels the drawer. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the drawer. |
| `ariaDescribedBy` | `string` | `''` | IDs of elements that describe the drawer content. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeSnapPoint` | `AerisDrawerSnapPoint &#124; null` | `null` | Requested configured point. Null or unavailable values display the smallest valid point without rewriting consumer state. Bind an initial point to select the opening height. Drag, keyboard and snapTo update the model; closing retains it. |
| `visible` | `boolean` | `false` | Controls whether the drawer is rendered. |
| `maximized` | `boolean` | `false` | Controls whether the drawer fills the viewport. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeSnapPointChange` | `AerisDrawerSnapPoint &#124; null` | `-` | Model output emitted when a user gesture, slider key or snapTo selects a different point. Viewport resizing and fallback resolution do not emit. |
| `opened` | `AerisDrawerVisibilityChangeEvent` | `-` | Emits after the drawer becomes visible. |
| `closed` | `AerisDrawerVisibilityChangeEvent` | `-` | Emits after the drawer closes. |

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
| `snapTo(point)` | `void` | `point: AerisDrawerSnapPoint` | Selects a configured bottom-drawer point and cancels any active drag. Equivalent pixel/fraction heights resolve to the normalized point. Invalid requests or unsupported drawer configurations do nothing. |
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
type AerisDrawerCloseReason = 'api' | 'close-button' | 'escape' | 'mask' | 'swipe';
type AerisDrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type AerisDrawerSize = 'sm' | 'md' | 'lg' | 'full';
type AerisDrawerFooterLayout = 'responsive' | 'wrap' | 'stack' | 'inline';
type AerisDrawerSnapPoint = number | `${number}px`;

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
| `--aeris-drawer-swipe-handle-color` | `CSS custom property` | — | Swipe handle color. |
| `--aeris-drawer-swipe-handle-space` | `CSS custom property` | — | Reserved space at the draggable edge. |
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
          Use a drawer for navigation, filters, settings, and supporting workflows that should
          stay attached to a viewport edge.
        </p>
      </aeris-drawer>
    </div>
  `
})
export class DrawerBasicDemo {
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
export class DrawerControlledDemo {
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
    (opened)="recordDrawerEvent($event)"
    (closed)="recordDrawerEvent($event)"
  >
    <form class="drawer-form">
      <label>
        Workspace name
        <input aerisInputText type="text" value="Design System" />
      </label>
      <label>
        Notes
        <textarea aerisTextarea>Shared component planning and release notes.</textarea>
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
  border: 1px solid var(--aeris-border);
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
export class DrawerPositionsDemo {
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
  color: var(--aeris-text-3);
  font-size: 0.8125rem;
}

.drawer-controls,
.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
export class DrawerDismissalDemo {
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
    closeOnBackdropClick
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
  color: var(--aeris-text-3);
  font-size: 0.8125rem;
}

.drawer-controls,
.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
export class DrawerTemplatesDemo {
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
```

### Snap points

Bottom drawers can settle at configured heights. Drag the header or optional resize handle, use its arrow keys, or choose a height with the buttons. Resizing does not dismiss unless swipeToClose is explicitly enabled.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule, type AerisDrawerSnapPoint } from '@aeris-ui/core/drawer';
import { AerisInputText } from '@aeris-ui/core/input-text';

@Component({
  selector: 'app-drawer-snap-demo',
  imports: [AerisButton, AerisDrawerModule, AerisInputText],
  templateUrl: './drawer-snap.demo.html',
  styleUrl: './drawer-snap.demo.scss'
})
export class DrawerSnapDemo {
  protected readonly snapOpen = signal(false);

  protected readonly snapPoint = signal<AerisDrawerSnapPoint | null>(0.6);

  protected readonly snapPoints = [0.35, 0.6, 0.9] as const;

  protected readonly snapNotes = [
      'Review the workspace details and choose a height that leaves enough room for the task.',
      'At a smaller height, the drawer body scrolls independently while the header and actions stay available.',
      'Drag the header or resize handle upward to expand. At the largest height, upward gestures in the body scroll the content.',
      'Scrolling content keeps downward gestures until it reaches its top. Start a new gesture there to collapse the drawer.',
      'Form controls, links and buttons keep their usual interaction and do not initiate a drag.',
      'The selected point is retained when the drawer closes. Fractional points adapt to the available viewport height.',
    ];
}
```

#### HTML

```html
<div>
  <button aerisButton (click)="snapOpen.set(true)">Open snap drawer</button>
  <aeris-drawer
    #snapDrawer
    header="Project details"
    position="bottom"
    [snapPoints]="snapPoints"
    [(activeSnapPoint)]="snapPoint"
    [(visible)]="snapOpen"
    swipeHandle
  >
    <div class="drawer-form">
      <label>
        Project name
        <input aerisInputText value="Workspace refresh" />
      </label>
      @for (note of snapNotes; track note) {
        <p>{{ note }}</p>
      }
    </div>
    <ng-template aerisDrawerFooter>
      <div class="drawer-controls">
        @for (point of snapPoints; track point) {
          <button
            aerisButton
            [variant]="snapPoint() === point ? 'solid' : 'outline'"
            [attr.aria-pressed]="snapPoint() === point"
            (click)="snapDrawer.snapTo(point)"
          >
            {{ point * 100 }}%
          </button>
        }
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
  border: 1px solid var(--aeris-border);
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
```

### Swipe dismissal

Swipe non-interactive content toward the drawer's screen edge. Scrolling and form controls keep their normal behavior. Short and cancelled drags return to the resting position.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisDrawerModule, type AerisDrawerPosition, type AerisDrawerVisibilityChangeEvent } from '@aeris-ui/core/drawer';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTextarea } from '@aeris-ui/core/textarea';

@Component({
  selector: 'app-drawer-swipe-demo',
  imports: [AerisButton, AerisDrawerModule, AerisInputText, AerisTextarea],
  templateUrl: './drawer-swipe.demo.html',
  styleUrl: './drawer-swipe.demo.scss'
})
export class DrawerSwipeDemo {
  protected readonly swipeOpen = signal(false);

  protected readonly swipePosition = signal<AerisDrawerPosition>('bottom');

  protected readonly swipeStatus = signal(
      'Open a drawer and swipe its content toward the screen edge.',
    );

  protected readonly swipePositions: readonly AerisDrawerPosition[] = [
      'left',
      'right',
      'top',
      'bottom',
    ];

  protected readonly swipeItems = [
      'Release notes describe the new workflow, including the changes that team members will notice first.',
      'Owners review access, delivery dates, and dependencies before the project moves into the next stage.',
      'The activity feed keeps decisions visible so collaborators can pick up work without losing context.',
      'After the final review, the team can publish the project and follow its progress from the workspace.',
    ];

  protected openSwipeDrawer(position: AerisDrawerPosition): void {
      this.swipePosition.set(position);
      this.swipeOpen.set(true);
    }

  protected recordSwipeClose(event: AerisDrawerVisibilityChangeEvent): void {
      this.swipeStatus.set(`Drawer closed by ${event.reason}.`);
    }
}
```

#### HTML

```html
<div>
  <div class="drawer-controls">
    @for (edge of swipePositions; track edge) {
      <button aerisButton variant="outline" type="button" (click)="openSwipeDrawer(edge)">
        {{ edge }} drawer
      </button>
    }
  </div>
  <p class="drawer-status" role="status">{{ swipeStatus() }}</p>
  <aeris-drawer
    header="Swipe to close"
    [(visible)]="swipeOpen"
    [position]="swipePosition()"
    height="28rem"
    swipeToClose
    (closed)="recordSwipeClose($event)"
  >
    <p>
      Swipe this content toward the screen edge to close. Scrollable content must be at
      its dismissal boundary first. The close button is always available.
    </p>
    <div class="drawer-form">
      <label>
        <span>Project name</span>
        <input aerisInputText value="Summer launch" />
      </label>
      <label>
        <span>Notes</span>
        <textarea aerisTextarea rows="3">
Form controls keep their normal interaction.</textarea>
      </label>
    </div>
    @for (item of swipeItems; track item) {
      <p>{{ item }}</p>
    }
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
  border: 1px solid var(--aeris-border);
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
export class DrawerResponsiveDemo {
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
      The drawer uses a desktop width until the built-in narrow viewport query applies the
      full-screen mobile layout.
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
export class DrawerFullscreenDemo {
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
          This drawer starts in full-screen layout without requiring a maximize action.
        </p>
      </section>
      <section class="drawer-card">
        <strong>Use case</strong>
        <p>
          Full-screen drawers work well for detailed mobile workflows, large forms, and
          focused review tasks.
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
export class DrawerLongContentDemo {
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
        <button aerisButton type="button" (click)="close($event)">Apply filters</button>
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
      background: linear-gradient(135deg, color-mix(in srgb, var(--aeris-primary) 14%, transparent), transparent 55%), var(--aeris-surface);
      color: var(--aeris-text);
    }

    .headless-drawer h3,
    .headless-drawer p {
      margin: 0;
    }

    .headless-drawer p {
      color: var(--aeris-text-2);
    }

    .headless-drawer .aeris-button {
      justify-self: start;
    }
  `
})
export class DrawerHeadlessDemo {
  protected readonly headlessOpen = signal(false);
}
```

## Accessibility

- With swipeToClose, non-interactive content can start dismissal. A scroll container keeps the gesture when it can scroll in that direction; start a new gesture at the boundary to dismiss. Inputs, buttons, links, editable content and nested interactive controls are excluded. Add data-aeris-swipe-ignore to a custom gesture surface to exclude it too. Selected text is preserved. The standard close button and Escape remain available. The optional swipeHandle is a native button named by closeAriaLabel; tap, Enter or Space closes it. A swipe closes toward the physical left, right, top or bottom edge; RTL does not swap these positions. The handle is hidden while maximized. Short, perpendicular, interrupted or cancelled drags do not dismiss. Reduced motion removes the return and exit animation, not direct pointer tracking.
- Drawer renders a role="dialog" panel and sets aria-modal from the modal input.
- Visible headers automatically label the drawer. Use ariaLabel or ariaLabelledBy when no visible title is rendered.
- When opened, Drawer focuses initialFocus, then the first focusable element, then the drawer panel.
- Focus is trapped by default and returns to the previously focused element when the drawer closes.
- The close control is a native button with a configurable accessible label.
- Use closeOnBackdropClick only when closing from outside the drawer cannot cause data loss.
- Use maximizable or bind maximized when the drawer should support full-screen workflows.
- Set mobileFullScreen for complex workflows that need more space on narrow screens.
- Drawer motion is disabled for users who request reduced motion.
- For snap points, enable swipeHandle to expose the height slider, or provide buttons that call snapTo(point). The example provides both. Points use the available visual viewport, so the sheet stays above an on-screen keyboard; its body scrolls to keep a focused form field visible. The largest snap point defines the maximum height instead of maxHeight. Choose points that leave room for your header and footer. Nested overlays retain their own gestures; only the topmost drawer can be dragged.

### Keyboard support

| Key | Function |
| --- | --- |
| `Arrow Up / Page Up on resize handle` | Selects the next larger snap point without closing. |
| `Arrow Down / Page Down on resize handle` | Selects the next smaller snap point without closing. |
| `Home / End on resize handle` | Selects the smallest / largest snap point. |
| `Tab` | Moves focus to the next focusable element inside the drawer. From the last element, focus wraps to the first when focusTrap is enabled. |
| `Shift + Tab` | Moves focus to the previous focusable element inside the drawer. From the first element, focus wraps to the last when focusTrap is enabled. |
| `Escape` | Closes the drawer when closeOnEscape is true. |
| `Enter / Space on swipe handle` | Closes without dragging, when swipeToClose and swipeHandle are enabled and snap points are not active. |
| `Enter / Space` | Activates the focused native control, including the built-in close button and projected buttons. |
