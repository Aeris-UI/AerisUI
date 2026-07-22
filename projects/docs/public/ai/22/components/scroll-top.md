# ScrollTop

> Floating action that returns long pages to the top with accessible controls.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/scroll-top`
- Human-readable documentation: [https://aeris-ui.dev/components/scroll-top](https://aeris-ui.dev/components/scroll-top)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `threshold` | `number` | `320` | Vertical scroll offset in pixels before the button is shown. |
| `behavior` | `AerisScrollTopBehavior` | `'smooth'` | Scroll behavior passed to the browser scroll API. |
| `position` | `AerisScrollTopPosition` | `'bottom-right'` | Fixed viewport placement. |
| `size` | `AerisScrollTopSize` | `'md'` | Button size. |
| `strategy` | `AerisScrollTopStrategy` | `'fixed'` | CSS positioning strategy. Use absolute when embedding ScrollTop inside a contained preview. |
| `ariaLabel` | `string` | `'Scroll to top'` | Accessible name for the button. |
| `alwaysVisible` | `boolean` | `false` | Keeps the button visible regardless of scroll position. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `clicked` | `MouseEvent` | `-` | Emitted before the component scrolls to the top. |
| `visibilityChanged` | `boolean` | `-` | Emitted when the threshold visibility changes. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `handleScroll()` | `void` | `-` | Updates threshold visibility. Called automatically on window scroll. |
| `scrollToTop(event)` | `void` | `-` | Emits clicked and scrolls the window to the top. |

## Interfaces and types

### Interfaces

```ts
type AerisScrollTopBehavior = 'auto' | 'smooth';
type AerisScrollTopPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';
type AerisScrollTopSize = 'sm' | 'md' | 'lg';
type AerisScrollTopStrategy = 'fixed' | 'absolute';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-scroll-top-background` | `CSS custom property` | — | Button surface. |
| `--aeris-scroll-top-color` | `CSS custom property` | — | Icon color. |
| `--aeris-scroll-top-border` | `CSS custom property` | — | Button border. |
| `--aeris-scroll-top-offset-block` | `CSS custom property` | — | Vertical viewport offset. |
| `--aeris-scroll-top-offset-inline` | `CSS custom property` | — | Horizontal viewport offset. |

## Examples

### Basic

Show the button after the page passes a threshold. This demo keeps it visible so the placement is easy to inspect.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';

@Component({
  selector: 'app-scroll-top-basic-demo',
  imports: [AerisScrollTop],
  template: `
    <div class="scroll-top-preview">
      <aeris-scroll-top
        alwaysVisible
        strategy="absolute"
        position="bottom-right"
        ariaLabel="Scroll preview to top"
      />
      <span>Bottom right</span>
    </div>
  `,
  styles: `
    .scroll-top-preview,
    .scroll-top-position-grid > div,
    .scroll-top-size-row > span {
      position: relative;
      min-height: 8rem;
      display: grid;
      place-items: center;
      padding: 1rem;
      border: 1px solid var(--aeris-border);
      border-radius: 0.875rem;
      background: var(--aeris-surface-2);
      overflow: hidden;
    }
    
    .scroll-top-preview aeris-scroll-top,
    .scroll-top-position-grid aeris-scroll-top,
    .scroll-top-size-row aeris-scroll-top {
      --aeris-scroll-top-z-index: 1;
      --aeris-scroll-top-offset-block: 0.875rem;
      --aeris-scroll-top-offset-inline: 0.875rem;
    }
  `
})
export class ScrollTopBasicBasicDemo {
}
```

### Positions

Choose the viewport corner that avoids product navigation or chat widgets.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';

@Component({
  selector: 'app-scroll-top-positions-demo',
  imports: [AerisScrollTop],
  templateUrl: './scroll-top-positions.demo.html',
  styleUrl: './scroll-top-positions.demo.scss'
})
export class ScrollTopPositionsPositionsDemo {
}
```

#### HTML

```html
<div class="scroll-top-position-grid">
  <div>
    <aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      position="bottom-right"
      ariaLabel="Bottom right scroll top"
    /><span>Bottom right</span>
  </div>
  <div>
    <aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      position="bottom-left"
      ariaLabel="Bottom left scroll top"
    /><span>Bottom left</span>
  </div>
  <div>
    <aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      position="top-right"
      ariaLabel="Top right scroll top"
    /><span>Top right</span>
  </div>
  <div>
    <aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      position="top-left"
      ariaLabel="Top left scroll top"
    /><span>Top left</span>
  </div>
</div>
```

#### CSS

```css
.scroll-top-preview,
.scroll-top-position-grid > div,
.scroll-top-size-row > span {
  position: relative;
  min-height: 8rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.875rem;
  background: var(--aeris-surface-2);
  overflow: hidden;
}

.scroll-top-preview aeris-scroll-top,
.scroll-top-position-grid aeris-scroll-top,
.scroll-top-size-row aeris-scroll-top {
  --aeris-scroll-top-z-index: 1;
  --aeris-scroll-top-offset-block: 0.875rem;
  --aeris-scroll-top-offset-inline: 0.875rem;
}

.scroll-top-position-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 42rem) {
  .scroll-top-position-grid {
      grid-template-columns: 1fr;
    }
}
```

### Sizes

Three sizes follow the same compact control scale used by the rest of Aeris.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';

@Component({
  selector: 'app-scroll-top-sizes-demo',
  imports: [AerisScrollTop],
  templateUrl: './scroll-top-sizes.demo.html',
  styleUrl: './scroll-top-sizes.demo.scss'
})
export class ScrollTopSizesSizesDemo {
}
```

#### HTML

```html
<div class="scroll-top-size-row">
  <span
    ><aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      size="sm"
      ariaLabel="Small scroll top"
    />Small</span
  >
  <span
    ><aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      ariaLabel="Medium scroll top"
    />Medium</span
  >
  <span
    ><aeris-scroll-top
      alwaysVisible
      strategy="absolute"
      size="lg"
      ariaLabel="Large scroll top"
    />Large</span
  >
</div>
```

#### CSS

```css
.scroll-top-preview,
.scroll-top-position-grid > div,
.scroll-top-size-row > span {
  position: relative;
  min-height: 8rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: 0.875rem;
  background: var(--aeris-surface-2);
  overflow: hidden;
}

.scroll-top-preview aeris-scroll-top,
.scroll-top-position-grid aeris-scroll-top,
.scroll-top-size-row aeris-scroll-top {
  --aeris-scroll-top-z-index: 1;
  --aeris-scroll-top-offset-block: 0.875rem;
  --aeris-scroll-top-offset-inline: 0.875rem;
}

.scroll-top-size-row {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.scroll-top-size-row > span {
  width: min(10rem, 100%);
}
```

### Events

Use visibilityChanged for analytics or to coordinate overlapping floating UI.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisScrollTop } from '@aeris-ui/core/scroll-top';

@Component({
  selector: 'app-scroll-top-events-demo',
  imports: [AerisScrollTop],
  template: `
    <div class="field">
      <aeris-scroll-top
        alwaysVisible
        strategy="absolute"
        behavior="auto"
        ariaLabel="Event demo scroll top"
        (visibilityChanged)="recordVisibility($event)"
      />
      <small aria-live="polite">{{ visibilityLog() }}</small>
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
  `
})
export class ScrollTopEventsEventsDemo {
  protected readonly visibilityLog = signal(
    'Visibility has not changed in this demo yet.',
  );

  protected recordVisibility(visible: boolean): void {
    this.visibilityLog.set(
      visible ? 'ScrollTop is visible.' : 'ScrollTop is hidden.',
    );
  }
}
```

## Accessibility

- ScrollTop renders a native button, so activation and focus behavior are provided by the platform.
- Always provide an ariaLabel that describes the destination, especially when multiple scroll containers exist.
- The button has a visible focus state and respects reduced motion for its own hover transition.
- The component scrolls the window. It does not move keyboard focus after scrolling, avoiding unexpected focus jumps.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Activates the button and scrolls to the top. |
| `Tab` | Moves focus to and away from the button in document order. |
