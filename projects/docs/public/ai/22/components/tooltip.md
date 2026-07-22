# Tooltip

> Advisory target text with hover, focus, delays, templates, and accessible tooltip semantics.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/tooltip`
- Human-readable documentation: [https://aeris-ui.dev/components/tooltip](https://aeris-ui.dev/components/tooltip)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTooltip` | `AerisTooltipContent` | `''` | String or template content rendered in the tooltip. |
| `aerisTooltipPosition` | `AerisTooltipPosition` | `'top'` | Preferred edge around the target. |
| `aerisTooltipEvent` | `AerisTooltipEvent` | `'both'` | Trigger mode: pointer hover, focus, or both. |
| `aerisTooltipShowDelay` | `number` | `0` | Delay before opening in milliseconds. |
| `aerisTooltipHideDelay` | `number` | `0` | Delay before closing in milliseconds. |
| `aerisTooltipDisabled` | `boolean` | `false` | Prevents the tooltip from opening and closes an open tooltip. |
| `aerisTooltipAutoHide` | `boolean` | `true` | Closes when the pointer leaves the target. Set false when pointer text selection inside the tooltip is needed. |
| `aerisTooltipOffset` | `number` | `8` | Distance from the target in pixels. |
| `aerisTooltipViewportMargin` | `number` | `6` | Minimum viewport edge gap in pixels. |
| `aerisTooltipMaxWidth` | `string` | `''` | Custom maximum tooltip width. |
| `aerisTooltipStyleClass` | `string` | `''` | Additional CSS class applied to the tooltip panel. |
| `aerisTooltipTruncatedOnly` | `boolean` | `false` | Opens only when the target content overflows its visible dimensions. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTooltipShown` | `AerisTooltipVisibilityEvent` | `-` | Emitted after the tooltip becomes visible. |
| `aerisTooltipHidden` | `AerisTooltipVisibilityEvent` | `-` | Emitted after the tooltip closes. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(originalEvent?)` | `(Event &#124; null) =&gt; void` | `-` | Opens the tooltip programmatically using the configured delay. |
| `hide(originalEvent?, reason?)` | `(Event &#124; null, AerisTooltipCloseReason) =&gt; void` | `reason: 'api'` | Closes the tooltip programmatically using the configured delay. |

## Interfaces and types

### Interfaces

```ts
type AerisTooltipPosition = 'top' | 'right' | 'bottom' | 'left';
type AerisTooltipEvent = 'hover' | 'focus' | 'both';
type AerisTooltipCloseReason = 'api' | 'escape' | 'blur' | 'pointerleave' | 'disabled';
type AerisTooltipContent =
  | string
  | TemplateRef<AerisTooltipTemplateContext>
  | null
  | undefined;

interface AerisTooltipTemplateContext {
  readonly $implicit: string;
}

interface AerisTooltipVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisTooltipCloseReason | 'show';
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-tooltip-z-index` | `CSS custom property` | `1060` | Overlay stacking context. |
| `--aeris-tooltip-max-width` | `CSS custom property` | `18rem` | Tooltip maximum width. |
| `--aeris-tooltip-padding` | `CSS custom property` | `0.45rem 0.625rem` | Panel padding. |
| `--aeris-tooltip-radius` | `CSS custom property` | `var(--aeris-radius-sm)` | Panel radius. |
| `--aeris-tooltip-background` | `CSS custom property` | `var(--aeris-text)` | Panel background and arrow color. |
| `--aeris-tooltip-color` | `CSS custom property` | `var(--aeris-surface)` | Tooltip text color. |
| `--aeris-tooltip-shadow` | `CSS custom property` | `component shadow` | Panel elevation. |
| `--aeris-tooltip-font-size` | `CSS custom property` | `0.75rem` | Tooltip text size. |

## Examples

### Basic

Attach advisory text to a native interactive element.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTooltipModule, type AerisTooltipVisibilityEvent } from '@aeris-ui/core/tooltip';

@Component({
  selector: 'app-tooltip-basic-demo',
  imports: [AerisButton, AerisTooltipModule],
  template: `
    <div>
      <button
        aerisButton
        type="button"
        aerisTooltip="Saves the current workspace."
        (aerisTooltipShown)="recordTooltip($event)"
        (aerisTooltipHidden)="recordTooltip($event)"
      >
        Save changes
      </button>
      <p class="demo-status" aria-live="polite">{{ lastTooltipEvent() }}</p>
    </div>
  `,
  styles: `
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }
    
    .position-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.5rem;
      width: min(100%, 34rem);
    }
    
    .demo-status {
      width: 100%;
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class TooltipBasicBasicDemo {
  protected readonly lastTooltipEvent = signal('Tooltip has not opened yet.');

  protected recordTooltip(event: AerisTooltipVisibilityEvent): void {
    this.lastTooltipEvent.set(
      event.visible ? 'Tooltip opened.' : `Tooltip closed by ${event.reason}.`,
    );
  }
}
```

### Position

Choose the preferred edge around the target.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';

@Component({
  selector: 'app-tooltip-position-demo',
  imports: [AerisButton, AerisTooltipModule],
  templateUrl: './tooltip-position.demo.html',
  styleUrl: './tooltip-position.demo.scss'
})
export class TooltipPositionPositionDemo {
}
```

#### HTML

```html
<div>
  <div class="position-grid">
    <button
      aerisButton
      type="button"
      aerisTooltip="Top tooltip"
      aerisTooltipPosition="top"
    >
      Top
    </button>
    <button
      aerisButton
      type="button"
      aerisTooltip="Right tooltip"
      aerisTooltipPosition="right"
    >
      Right
    </button>
    <button
      aerisButton
      type="button"
      aerisTooltip="Bottom tooltip"
      aerisTooltipPosition="bottom"
    >
      Bottom
    </button>
    <button
      aerisButton
      type="button"
      aerisTooltip="Left tooltip"
      aerisTooltipPosition="left"
    >
      Left
    </button>
  </div>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 34rem);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Delay

Delay open and close timing for quieter interactions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';

@Component({
  selector: 'app-tooltip-delay-demo',
  imports: [AerisButton, AerisTooltipModule],
  templateUrl: './tooltip-delay.demo.html',
  styleUrl: './tooltip-delay.demo.scss'
})
export class TooltipDelayDelayDemo {
}
```

#### HTML

```html
<div>
  <div class="demo-actions">
    <button
      aerisButton
      type="button"
      aerisTooltip="Opens after 500ms."
      [aerisTooltipShowDelay]="500"
    >
      500ms open
    </button>
    <button
      aerisButton
      type="button"
      aerisTooltip="Closes after 800ms."
      [aerisTooltipHideDelay]="800"
    >
      800ms close
    </button>
  </div>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 34rem);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Events

Use hover, focus, or both depending on the target interaction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';

@Component({
  selector: 'app-tooltip-events-demo',
  imports: [AerisButton, AerisTooltipModule],
  templateUrl: './tooltip-events.demo.html',
  styleUrl: './tooltip-events.demo.scss'
})
export class TooltipEventsEventsDemo {
}
```

#### HTML

```html
<div>
  <div class="demo-actions">
    <button
      aerisButton
      type="button"
      aerisTooltip="Shown on hover only."
      aerisTooltipEvent="hover"
    >
      Hover only
    </button>
    <button
      aerisButton
      type="button"
      aerisTooltip="Shown while focused."
      aerisTooltipEvent="focus"
    >
      Focus only
    </button>
    <button
      aerisButton
      type="button"
      aerisTooltip="Shown on hover or focus."
      aerisTooltipEvent="both"
    >
      Hover or focus
    </button>
  </div>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 34rem);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Methods

Use the exported directive reference when a tooltip needs explicit controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';

@Component({
  selector: 'app-tooltip-methods-demo',
  imports: [AerisButton, AerisTooltipModule],
  templateUrl: './tooltip-methods.demo.html',
  styleUrl: './tooltip-methods.demo.scss'
})
export class TooltipMethodsMethodsDemo {
}
```

#### HTML

```html
<div>
  <div class="demo-actions">
    <button
      aerisButton
      #manualTooltip="aerisTooltip"
      type="button"
      aerisTooltip="Controlled from the buttons beside the target."
    >
      Manual target
    </button>
    <button aerisButton type="button" (click)="manualTooltip.show($event)">
      Show
    </button>
    <button aerisButton type="button" (click)="manualTooltip.hide($event)">
      Hide
    </button>
  </div>
</div>
```

#### CSS

```css
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 34rem);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}
```

### Template

Provide a template when the advisory content needs stronger structure.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-tooltip-template-demo',
  imports: [AerisButton],
  templateUrl: './tooltip-template.demo.html',
  styleUrl: './tooltip-template.demo.scss'
})
export class TooltipTemplateTemplateDemo {
}
```

#### HTML

```html
<div>
  <button
    aerisButton
    type="button"
    [aerisTooltip]="richTooltip"
    [aerisTooltipAutoHide]="false"
    aerisTooltipMaxWidth="16rem"
  >
    Deployment status
  </button>
  <ng-template #richTooltip>
    <span class="tooltip-card">
      <strong>Deployment healthy</strong>
      <p>Last check completed 2 minutes ago.</p>
    </span>
  </ng-template>
</div>
```

#### CSS

```css
.tooltip-card {
  display: grid;
  gap: 0.35rem;
}

.tooltip-card strong {
  color: var(--aeris-tooltip-color, currentColor);
}

.tooltip-card p {
  margin: 0;
}

.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  width: min(100%, 34rem);
}

.demo-status {
  width: 100%;
  margin: 0.875rem 0 0;
  color: var(--text-3);
  font-size: 0.8125rem;
}

.tooltip-card {
  display: grid;
  gap: 0.35rem;
}

.tooltip-card strong {
  color: var(--aeris-tooltip-color, currentColor);
}

.tooltip-card p {
  margin: 0;
}
```

### Options

Adjust spacing and maximum width with directive inputs.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTooltipModule } from '@aeris-ui/core/tooltip';

@Component({
  selector: 'app-tooltip-options-demo',
  imports: [AerisButton, AerisTooltipModule],
  template: `
    <div>
      <button
        aerisButton
        type="button"
        aerisTooltip="A wider tooltip can explain compact controls without changing the target layout."
        aerisTooltipMaxWidth="20rem"
        [aerisTooltipOffset]="12"
      >
        Styled tooltip
      </button>
    </div>
  `,
  styles: `
    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }
    
    .position-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.5rem;
      width: min(100%, 34rem);
    }
    
    .demo-status {
      width: 100%;
      margin: 0.875rem 0 0;
      color: var(--text-3);
      font-size: 0.8125rem;
    }
  `
})
export class TooltipOptionsOptionsDemo {
}
```

## Accessibility

- The overlay uses role="tooltip" and receives a generated ID.
- The target receives aria-describedby while the tooltip is visible, then the attribute is removed when it closes.
- Use tooltips for advisory information only. Required instructions and interactive workflows should be visible in the page or placed in a popover/dialog pattern.
- Use native focusable triggers such as button or a so keyboard users can discover the tooltip.
- Motion respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to the target and opens the tooltip when aerisTooltipEvent is focus or both. |
| `Shift + Tab` | Moves focus away from the target and closes focus-triggered tooltips. |
| `Escape` | Closes the visible tooltip when focus is on the target. |
| `Enter` | Activates the focused target if it is a native interactive element. |
| `Space` | Activates the focused target if it is a native button. |
