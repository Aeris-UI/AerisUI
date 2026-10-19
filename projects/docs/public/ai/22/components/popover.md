# Popover

> Target-anchored overlay content with controlled visibility, templates, focus management, and responsive placement.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/popover`
- Human-readable documentation: [https://aeris-ui.dev/components/popover](https://aeris-ui.dev/components/popover)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisPopoverModule } from '@aeris-ui/core/popover';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `AerisPopoverTrigger` | `'manual'` | Options: 'manual', 'hover'. Hover binds pointer and keyboard-focus events to target. Buttons also toggle on click/tap; links keep normal navigation. Hover mode never autofocuses or traps focus. |
| `openDelay` | `number` | `200` | Pointer opening delay in milliseconds in hover mode. Keyboard focus opens immediately. Negative or non-finite values are treated as zero. |
| `closeDelay` | `number` | `150` | Closing delay in milliseconds after pointer and focus leave both regions in hover mode. Safe pointer travel across the gap is allowed first. Negative or non-finite values are treated as zero. |
| `closeIconTemplate` | `TemplateRef&lt;AerisPopoverTemplateContext&gt; &#124; undefined` | `undefined` | Optional close artwork. Takes precedence over the projected close-icon template; Aeris keeps the close button and its accessible name. |
| `appendTo` | `'self' &#124; 'body' &#124; HTMLElement &#124; ElementRef&lt;HTMLElement&gt; &#124; TemplateRef&lt;unknown&gt; &#124; null &#124; undefined` | `global config or 'body'` | Mounts the popover overlay locally, in document.body, or in the supplied DOM/template target. |
| `target` | `AerisPopoverTarget` | `null` | Element or trigger event used when visible is controlled directly. Required as a stable element reference for automatic hover/focus triggering. |
| `header` | `string` | `''` | Visible popover title. |
| `placement` | `AerisPopoverPlacement` | `'auto'` | Preferred placement around the target. Options: 'auto', 'top', 'right', 'bottom', 'left'. |
| `alignment` | `AerisPopoverAlignment` | `'center'` | Alignment along the target edge. Horizontal start/end follow the trigger's text direction. Options: 'start', 'center', 'end'. |
| `width` | `string` | `''` | Custom popover width. |
| `maxWidth` | `string` | `''` | Custom maximum width. |
| `offset` | `number` | `10` | Distance between target and popover in pixels. |
| `viewportMargin` | `number &#124; AerisOverlayCollisionPadding` | `8` | Minimum visual viewport gap. Per-edge values reserve fixed interface regions; preferred placements flip when they do not fit. |
| `closeOnOutsideClick` | `boolean` | `true` | Allows outside pointerdown to close. |
| `closeOnEscape` | `boolean` | `true` | Allows Escape to close. |
| `closable` | `boolean` | `false` | Shows the built-in close button. |
| `focusTrap` | `boolean` | `true` | Keeps Tab navigation inside a manual popover. Ignored in hover mode. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the trigger after close. In hover mode, only Escape or closing while focus is inside returns focus; pointer departure and outside clicks never steal focus. |
| `autoFocus` | `boolean` | `true` | Moves focus into a manual popover after open. Ignored in hover mode; Tab from the trigger enters its content. |
| `initialFocus` | `string` | `''` | Selector for the initial focus target. |
| `showArrow` | `boolean` | `true` | Shows the pointer arrow. |
| `closeAriaLabel` | `string` | `'Close popover'` | Accessible label for the close button. |
| `ariaLabel` | `string` | `''` | Accessible name when no visible title labels the popover. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the popover. |
| `ariaDescribedBy` | `string` | `''` | ID of content that describes the popover. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Controls whether the popover is open. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visibleChange` | `boolean` | `-` | Emitted by the visible model. |
| `opened` | `AerisPopoverVisibilityChangeEvent` | `-` | Emitted after the popover opens. |
| `closed` | `AerisPopoverVisibilityChangeEvent` | `-` | Emitted after the popover closes. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisPopoverHeader` | `AerisPopoverTemplateContext` | `header input` | Custom header content. |
| `aerisPopoverFooter` | `AerisPopoverTemplateContext` | `-` | Footer content with access to the close callback. |
| `aerisPopoverCloseIcon` | `AerisPopoverTemplateContext` | `built-in close icon` | Custom decorative close icon. |
| `aerisPopoverHeadless` | `AerisPopoverTemplateContext` | `-` | Replaces all built-in chrome while keeping positioning and focus behavior. |
| `default content` | `content projection` | `-` | Popover body content. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(targetOrEvent?, originalEvent?)` | `(AerisPopoverTarget, Event &#124; null) =&gt; void` | `-` | Opens the popover relative to a target. |
| `hide(event?, reason?)` | `(Event &#124; null, AerisPopoverCloseReason) =&gt; void` | `reason: 'api'` | Closes the popover and records the close reason. Options: 'api', 'close-button', 'escape', 'outside', 'interaction'. |
| `toggle(targetOrEvent?, originalEvent?)` | `(AerisPopoverTarget, Event &#124; null) =&gt; void` | `-` | Opens when closed or closes when open. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Moves focus to the configured initial focus target. |
| `reposition()` | `() =&gt; void` | `-` | Recalculates target-relative position. |

## Interfaces and types

### Interfaces

```ts
type AerisPopoverPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left';
type AerisPopoverAlignment = 'start' | 'center' | 'end';
type AerisPopoverTrigger = 'manual' | 'hover';
type AerisPopoverCloseReason = 'api' | 'close-button' | 'escape' | 'outside' | 'interaction';
type AerisPopoverTarget = Element | EventTarget | Event | null | undefined;

interface AerisPopoverVisibilityChangeEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisPopoverCloseReason;
  readonly target: Element | null;
}

interface AerisPopoverTemplateContext {
  readonly $implicit: AerisPopover;
  readonly close: (event?: Event) => void;
  readonly placement: Exclude<AerisPopoverPlacement, 'auto'>;
  readonly target: Element | null;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-popover-z-index` | `CSS custom property` | `1030` | Overlay stacking context. |
| `--aeris-popover-width` | `CSS custom property` | `min(22rem, calc(100vw - 1rem))` | Popover width. |
| `--aeris-popover-max-width` | `CSS custom property` | `calc(100vw - 1rem)` | Maximum popover width. |
| `--aeris-popover-background` | `CSS custom property` | `var(--aeris-surface)` | Popover surface. |
| `--aeris-popover-border` | `CSS custom property` | `var(--aeris-border)` | Popover border. |
| `--aeris-popover-radius` | `CSS custom property` | `var(--aeris-radius-overlay)` | Popover radius. |
| `--aeris-popover-shadow` | `CSS custom property` | `component shadow` | Popover elevation. |
| `--aeris-popover-focus` | `CSS custom property` | `var(--aeris-focus)` | Focus ring color. |
| `--aeris-popover-body-padding` | `CSS custom property` | `--aeris-surface-padding` | Body padding. |

## Examples

### Basic

Use a component reference to toggle the popover from a keyboard-focusable trigger.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-basic-demo',
  imports: [AerisButton, AerisPopoverModule],
  templateUrl: './popover-basic.demo.html',
  styleUrl: './popover-basic.demo.scss'
})
export class PopoverBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="basicPopover.toggle($event)">
    Show popover
  </button>
  <aeris-popover
    #basicPopover
    header="Flight details"
    initialFocus="#track-flight"
    closable
  >
    <div class="popover-card">
      <strong>Track Flight</strong>
      <p>Gate B12 Â· Boarding starts in 18 minutes.</p>
      <button aerisButton id="track-flight" type="button">Track updates</button>
    </div>
  </aeris-popover>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.popover-card {
  display: grid;
  gap: 0.5rem;
}

.popover-card strong {
  color: var(--text);
}

.popover-card p {
  margin: 0;
  color: var(--text-2);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Hover and focus

Hover or focus the button to preview content. On touch screens, tap to toggle.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-hover-demo',
  imports: [AerisButton, AerisPopoverModule],
  templateUrl: './popover-hover.demo.html'
})
export class PopoverHoverHoverAndFocusDemo {
}
```

#### HTML

```html
<div>
  <button #hoverButton aerisButton type="button">Preview content</button>
  <aeris-popover
    #hoverPopover
    trigger="hover"
    [target]="hoverTarget()?.nativeElement"
    [openDelay]="200"
    [closeDelay]="150"
    header="Content preview"
    closable
  >
    <p>Move from the trigger into this panel without closing it.</p>
    <button aerisButton type="button" (click)="hoverPopover.hide()">Done</button>
  </aeris-popover>
</div>
```

### Controlled

Bind visible and target when state belongs to the current component.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule, type AerisPopoverVisibilityChangeEvent } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-controlled-demo',
  imports: [AerisButton, AerisPopoverModule],
  templateUrl: './popover-controlled.demo.html',
  styleUrl: './popover-controlled.demo.scss'
})
export class PopoverControlledControlledDemo {
  protected readonly controlledOpen = signal(false);
  protected readonly controlledTarget = signal<EventTarget | null>(null);
  protected readonly lastEvent = signal('Popover is closed.');

  protected openControlled(event: Event): void {
    this.controlledTarget.set(event.currentTarget);
    this.controlledOpen.set(true);
  }

  protected recordEvent(event: AerisPopoverVisibilityChangeEvent): void {
    this.lastEvent.set(
      event.visible ? 'Popover opened.' : `Popover closed by ${event.reason}.`,
    );
  }
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="openControlled($event)">
    Open controlled popover
  </button>
  <aeris-popover
    [target]="controlledTarget()"
    header="Controlled popover"
    [(visible)]="controlledOpen"
    (opened)="recordEvent($event)"
    (closed)="recordEvent($event)"
  >
    <div class="popover-card">
      <strong>External state</strong>
      <p>The trigger and visible model are controlled by the host component.</p>
    </div>
  </aeris-popover>
  <p class="demo-status" aria-live="polite">{{ lastEvent() }}</p>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.popover-card {
  display: grid;
  gap: 0.5rem;
}

.popover-card strong {
  color: var(--text);
}

.popover-card p {
  margin: 0;
  color: var(--text-2);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Placement

Choose a preferred edge or use auto placement to fit available viewport space.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule, type AerisPopover, type AerisPopoverPlacement } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-placement-demo',
  imports: [AerisButton, AerisPopoverModule],
  templateUrl: './popover-placement.demo.html',
  styleUrl: './popover-placement.demo.scss'
})
export class PopoverPlacementPlacementDemo {
  protected readonly activePlacement = signal<AerisPopoverPlacement>('auto');

  protected openPlacement(
    popover: AerisPopover,
    event: MouseEvent,
    placement: AerisPopoverPlacement,
  ): void {
    this.activePlacement.set(placement);
    popover.show(event);
  }
}
```

#### HTML

```html
<div>
  <div class="placement-grid">
    <button
      aerisButton
      type="button"
      (click)="openPlacement(placementPopover, $event, 'auto')"
    >
      Auto
    </button>
    <button
      aerisButton
      type="button"
      (click)="openPlacement(placementPopover, $event, 'top')"
    >
      Top
    </button>
    <button
      aerisButton
      type="button"
      (click)="openPlacement(placementPopover, $event, 'right')"
    >
      Right
    </button>
    <button
      aerisButton
      type="button"
      (click)="openPlacement(placementPopover, $event, 'bottom')"
    >
      Bottom
    </button>
    <button
      aerisButton
      type="button"
      (click)="openPlacement(placementPopover, $event, 'left')"
    >
      Left
    </button>
  </div>
  <aeris-popover #placementPopover [placement]="activePlacement()" header="Placement">
    <div class="popover-card">
      <strong>Responsive placement</strong>
      <p>Use the placement input on each popover instance to prefer an edge.</p>
    </div>
  </aeris-popover>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.popover-card {
  display: grid;
  gap: 0.5rem;
}

.popover-card strong {
  color: var(--text);
}

.popover-card p {
  margin: 0;
  color: var(--text-2);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Templates

Customize header, footer, and close icon while retaining the built-in dialog shell.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-templates-demo',
  imports: [AerisButton, AerisPopoverModule],
  templateUrl: './popover-templates.demo.html',
  styleUrl: './popover-templates.demo.scss'
})
export class PopoverTemplatesTemplatesDemo {
  protected readonly selectedFlight = signal('Aeris 482');
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="templatePopover.toggle($event)">
    Open templated popover
  </button>
  <aeris-popover #templatePopover closable>
    <ng-template aerisPopoverHeader>
      <span class="popover-header"
        ><span class="popover-dot" aria-hidden="true"></span>
        {{ selectedFlight() }}</span>
    </ng-template>
    <ng-template aerisPopoverCloseIcon>
      <span aria-hidden="true">Ã—</span>
    </ng-template>
    <div class="popover-card">
      <strong>On time</strong>
      <p>Boarding begins after the current security sweep.</p>
    </div>
    <ng-template aerisPopoverFooter let-close="close">
      <div class="popover-footer">
        <button aerisButton type="button" (click)="close($event)">Done</button>
      </div>
    </ng-template>
  </aeris-popover>
</div>
```

#### CSS

```css
.popover-card,
.headless-popover {
  display: grid;
  gap: 0.5rem;
}

.popover-card strong,
.headless-popover strong {
  color: var(--aeris-text);
}

.popover-card p,
.headless-popover p {
  color: var(--aeris-text-2);
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.popover-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--success);
}

.popover-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
```

### Headless

Replace all built-in chrome while keeping target positioning, focus management, and dismissal.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-headless-demo',
  imports: [AerisButton, AerisPopoverModule],
  template: `
    <div>
      <button aerisButton type="button" (click)="headlessPopover.show($event)">
        Open headless popover
      </button>
      <aeris-popover #headlessPopover>
        <ng-template aerisPopoverHeadless let-close="close">
          <div class="headless-popover">
            <strong>Upgrade available</strong>
            <p>Review compatibility notes before switching the active channel.</p>
            <button aerisButton type="button" (click)="close($event)">Got it</button>
          </div>
        </ng-template>
      </aeris-popover>
    </div>
  `,
  styles: `
    .headless-popover {
      display: grid;
      gap: 0.75rem;
      min-width: 16rem;
    }

    .headless-popover strong {
      color: var(--text);
    }

    .headless-popover p {
      margin: 0;
      color: var(--text-2);
    }

    .headless-popover .aeris-button {
      justify-self: end;
    }
  `
})
export class PopoverHeadlessHeadlessDemo {
}
```

### Options

Disable outside dismissal, hide the arrow, and set a custom width when a popover needs a stricter interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisPopoverModule } from '@aeris-ui/core/popover';

@Component({
  selector: 'app-popover-options-demo',
  imports: [AerisButton, AerisPopoverModule],
  templateUrl: './popover-options.demo.html',
  styleUrl: './popover-options.demo.scss'
})
export class PopoverOptionsOptionsDemo {
}
```

#### HTML

```html
<div>
  <button aerisButton type="button" (click)="optionsPopover.toggle($event)">
    Open fixed popover
  </button>
  <aeris-popover
    #optionsPopover
    header="Pinned details"
    width="18rem"
    [closeOnOutsideClick]="false"
    [showArrow]="false"
    closable
  >
    <div class="popover-card">
      <strong>Outside click disabled</strong>
      <p>Use the close button or Escape to dismiss this popover.</p>
    </div>
  </aeris-popover>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.placement-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 34rem;
}

.popover-card {
  display: grid;
  gap: 0.5rem;
}

.popover-card strong {
  color: var(--text);
}

.popover-card p {
  margin: 0;
  color: var(--text-2);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

## Accessibility

- The popover uses role="dialog" and receives an accessible name from header, aerisPopoverHeader, ariaLabel, or ariaLabelledBy.
- The trigger receives aria-haspopup="dialog", aria-expanded, and aria-controls while the popover is open, then its previous values are restored.
- Manual popovers move focus into their content by default, trap Tab navigation, and return focus when closed. These settings are unchanged for existing click/API usage.
- With trigger="hover", supply a stable [target] element. Pointer entry waits for openDelay; keyboard focus opens immediately. Neither moves focus nor traps it. Tab from the trigger enters the panel; Shift + Tab from its first control returns to the trigger. Focus and pointer can move between the trigger and content, including owned portaled controls. Leaving both closes after closeDelay. Escape dismisses without reopening until a fresh interaction.
- Use a native button for a preview that must also work on touch: tapping toggles it. Links keep their navigation and are never intercepted for touch previews; provide a separate preview button or keep essential information available at the destination. Do not add a second click toggle handler to an automatically triggered button. The visible model and existing methods remain available in both modes.
- Use a native button or another keyboard-focusable element as the trigger.
- With nested overlays, only the topmost popover handles outside dismissal and focus trapping. Escape closes one eligible layer at a time; a descendant that handles Escape can keep its popover open.
- Motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through content. In hover mode, Tab from the trigger enters the panel and can leave without being trapped. |
| `Shift + Tab` | Moves backward. In hover mode, the first panel control returns to the trigger. |
| `Escape` | Closes the popover when closeOnEscape is enabled and restores trigger focus. |
| `Enter` | Activates the focused button or link. |
| `Space` | Activates the focused button. |
