# ScrollPanel

> Themeable native scroll container with styled scrollbars, overflow modes, fade masks, events, and scroll methods.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/scroll-panel`
- Human-readable documentation: [https://aeris-ui.dev/components/scroll-panel](https://aeris-ui.dev/components/scroll-panel)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Host ID used to derive the viewport ID. |
| `orientation` | `AerisScrollPanelOrientation` | `'vertical'` | Controls vertical, horizontal, or two-axis overflow. |
| `variant` | `AerisScrollPanelVariant` | `'auto'` | Adjusts scrollbar visibility styling. |
| `fade` | `boolean` | `false` | Adds visual fades at scroll edges when additional content exists. |
| `fluid` | `boolean` | `true` | Sets the host inline size to 100%. |
| `focusable` | `boolean` | `true` | Makes the scroll viewport keyboard-focusable. |
| `tabIndex` | `number` | `0` | Tab order for the scroll viewport when focusable. |
| `height` | `string` | `'14rem'` | Viewport block size as a CSS length. |
| `maxHeight` | `string` | `''` | Optional maximum block size. |
| `width` | `string` | `'100%'` | Viewport inline size as a CSS length. |
| `maxWidth` | `string` | `''` | Optional maximum inline size. |
| `role` | `AerisScrollPanelRole` | `'region'` | Semantic role for the viewport. |
| `ariaLabel` | `string` | `'Scrollable content'` | Accessible name when no visible label is referenced. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the scroll region. |
| `ariaDescribedBy` | `string` | `''` | ID of text that describes the scroll region. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `scrolled` | `AerisScrollPanelEvent` | `-` | Emitted whenever the viewport scrolls. |
| `reachedTop` | `AerisScrollPanelEvent` | `-` | Emitted when a scroll event occurs at the top edge. |
| `reachedBottom` | `AerisScrollPanelEvent` | `-` | Emitted when a scroll event occurs at the bottom edge. |
| `reachedStart` | `AerisScrollPanelEvent` | `-` | Emitted when a scroll event occurs at the horizontal start edge. |
| `reachedEnd` | `AerisScrollPanelEvent` | `-` | Emitted when a scroll event occurs at the horizontal end edge. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Scrollable content rendered inside the viewport. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `scrollTo` | `(options: ScrollToOptions) =&gt; void` | `-` | Scrolls the viewport to an absolute position. |
| `scrollBy` | `(options: ScrollToOptions) =&gt; void` | `-` | Scrolls the viewport by a relative amount. |
| `scrollToTop` | `(options?: ScrollOptions) =&gt; void` | `-` | Scrolls to the top edge. |
| `scrollToBottom` | `(options?: ScrollOptions) =&gt; void` | `-` | Scrolls to the bottom edge. |
| `scrollToStart` | `(options?: ScrollOptions) =&gt; void` | `-` | Scrolls to the horizontal start edge. |
| `scrollToEnd` | `(options?: ScrollOptions) =&gt; void` | `-` | Scrolls to the horizontal end edge. |
| `refresh` | `() =&gt; void` | `-` | Recalculates edge fade state after content or size changes. |

## Interfaces and types

### Interfaces

```ts
type AerisScrollPanelOrientation = 'vertical' | 'horizontal' | 'both';
type AerisScrollPanelVariant = 'auto' | 'hover' | 'always' | 'hidden';
type AerisScrollPanelRole = 'region' | 'group' | null;

interface AerisScrollPanelEvent {
  readonly originalEvent: Event | null;
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly scrollHeight: number;
  readonly scrollWidth: number;
  readonly clientHeight: number;
  readonly clientWidth: number;
  readonly atTop: boolean;
  readonly atBottom: boolean;
  readonly atStart: boolean;
  readonly atEnd: boolean;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-scroll-panel-background` | `CSS custom property` | `--aeris-surface` | Viewport surface. |
| `--aeris-scroll-panel-color` | `CSS custom property` | `--aeris-text` | Viewport text color inheritance. |
| `--aeris-scroll-panel-border` | `CSS custom property` | `--aeris-border` | Viewport border. |
| `--aeris-scroll-panel-border-width` | `CSS custom property` | `1px` | Viewport border thickness. |
| `--aeris-scroll-panel-radius` | `CSS custom property` | `--aeris-radius-lg` | Viewport corner radius. |
| `--aeris-scroll-panel-padding` | `CSS custom property` | `1rem` | Content padding. |
| `--aeris-scroll-panel-content-color` | `CSS custom property` | `--aeris-text-2` | Projected content text color. |
| `--aeris-scroll-panel-content-size` | `CSS custom property` | `0.875rem` | Projected content font size. |
| `--aeris-scroll-panel-scrollbar-size` | `CSS custom property` | `0.75rem` | Styled scrollbar thickness. |
| `--aeris-scroll-panel-thumb` | `CSS custom property` | `text color mix` | Default scrollbar thumb. |
| `--aeris-scroll-panel-thumb-hover` | `CSS custom property` | `stronger text mix` | Scrollbar thumb hover color. |
| `--aeris-scroll-panel-thumb-always` | `CSS custom property` | `stronger text mix` | Scrollbar thumb for the always variant. |
| `--aeris-scroll-panel-track` | `CSS custom property` | `transparent` | Default scrollbar track. |
| `--aeris-scroll-panel-track-always` | `CSS custom property` | `subtle text mix` | Scrollbar track for the always variant. |
| `--aeris-scroll-panel-fade-size` | `CSS custom property` | `2rem` | Edge fade size. |

## Examples

### Basic

Create a keyboard-focusable vertical scroll region with theme-aware scrollbars.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-basic-demo',
  imports: [AerisScrollPanelModule],
  template: `
    <div>
      <aeris-scroll-panel ariaLabel="Automobile inventory">
        <ul class="brand-list">
          @for (brand of brands; track brand.name) {
            <li>
              <span>{{ brand.name }}</span
              ><strong>{{ brand.count }}</strong>
            </li>
          }
        </ul>
      </aeris-scroll-panel>
    </div>
  `,
  styles: `
    .brand-list {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    
    .brand-list li {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0.625rem;
      border: 1px solid var(--border);
      border-radius: var(--aeris-radius-md);
      background: var(--surface);
    }
  `
})
export class ScrollPanelBasicBasicDemo {
}
```

### Horizontal

Use horizontal orientation for content that extends beyond the inline viewport.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-horizontal-demo',
  imports: [AerisScrollPanelModule],
  templateUrl: './scroll-panel-horizontal.demo.html',
  styleUrl: './scroll-panel-horizontal.demo.scss'
})
export class ScrollPanelHorizontalHorizontalDemo {
}
```

#### HTML

```html
<div>
  <aeris-scroll-panel
    orientation="horizontal"
    height="9rem"
    ariaLabel="Project cards"
  >
    <div class="horizontal-cards">
      <article class="horizontal-card">
        <strong>Design</strong><span>Tokens, states, and spacing.</span>
      </article>
      <article class="horizontal-card">
        <strong>Build</strong><span>Standalone Angular components.</span>
      </article>
      <article class="horizontal-card">
        <strong>Test</strong><span>API and accessibility coverage.</span>
      </article>
      <article class="horizontal-card">
        <strong>Ship</strong><span>Docs, examples, and migration notes.</span>
      </article>
    </div>
  </aeris-scroll-panel>
</div>
```

#### CSS

```css
.horizontal-cards {
  display: flex;
  gap: 0.75rem;
}

.horizontal-card {
  flex: 0 0 13rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-lg);
  background: var(--surface);
}

.horizontal-card strong {
  display: block;
  margin-bottom: 0.375rem;
  color: var(--text);
}
```

### Both axes

Enable both vertical and horizontal scrolling for dense content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-both-demo',
  imports: [AerisScrollPanelModule],
  templateUrl: './scroll-panel-both.demo.html',
  styleUrl: './scroll-panel-both.demo.scss'
})
export class ScrollPanelBothBothAxesDemo {
}
```

#### HTML

```html
<div>
  <aeris-scroll-panel orientation="both" height="13rem" ariaLabel="City statistics">
    <table class="city-table">
      <thead>
        <tr>
          <th>City</th>
          <th>State</th>
          <th>Population</th>
          <th>Area km²</th>
        </tr>
      </thead>
      <tbody>
        @for (city of cities; track city.city) {
          <tr>
            <td>{{ city.city }}</td>
            <td>{{ city.state }}</td>
            <td>{{ city.population }}</td>
            <td>{{ city.area }}</td>
          </tr>
        }
      </tbody>
    </table>
  </aeris-scroll-panel>
</div>
```

#### CSS

```css
.city-table {
  min-width: 42rem;
  width: 100%;
  border-collapse: collapse;
}

.city-table th,
.city-table td {
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  white-space: nowrap;
}

.city-table th {
  color: var(--text);
  font-size: 0.75rem;
  text-transform: uppercase;
}
```

### Scroll fade

Use fade masks to communicate that additional content continues beyond the visible area.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-fade-demo',
  imports: [AerisScrollPanelModule],
  template: `
    <div>
      <aeris-scroll-panel fade height="12rem" ariaLabel="Faded automobile inventory">
        <ul class="brand-list">
          @for (brand of brands; track brand.name) {
            <li>
              <span>{{ brand.name }}</span
              ><strong>{{ brand.count }}</strong>
            </li>
          }
        </ul>
      </aeris-scroll-panel>
    </div>
  `,
  styles: `
    .brand-list {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    
    .brand-list li {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0.625rem;
      border: 1px solid var(--border);
      border-radius: var(--aeris-radius-md);
      background: var(--surface);
    }
  `
})
export class ScrollPanelFadeScrollFadeDemo {
}
```

### Variants

Choose how visible the styled native scrollbars should be.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-variants-demo',
  imports: [AerisScrollPanelModule],
  templateUrl: './scroll-panel-variants.demo.html',
  styleUrl: './scroll-panel-variants.demo.scss'
})
export class ScrollPanelVariantsVariantsDemo {
}
```

#### HTML

```html
<div>
  <div class="scroll-panel-grid">
    <section>
      <h4>Auto</h4>
      <aeris-scroll-panel variant="auto" height="10rem" ariaLabel="Auto scrollbars"
        ><ul class="brand-list">
          @for (brand of brands; track brand.name) {
            <li>
              <span>{{ brand.name }}</span
              ><strong>{{ brand.count }}</strong>
            </li>
          }
        </ul></aeris-scroll-panel
      >
    </section>
    <section>
      <h4>Hover</h4>
      <aeris-scroll-panel variant="hover" height="10rem" ariaLabel="Hover scrollbars"
        ><ul class="brand-list">
          @for (brand of brands; track brand.name) {
            <li>
              <span>{{ brand.name }}</span
              ><strong>{{ brand.count }}</strong>
            </li>
          }
        </ul></aeris-scroll-panel
      >
    </section>
    <section>
      <h4>Always</h4>
      <aeris-scroll-panel
        variant="always"
        height="10rem"
        ariaLabel="Always scrollbars"
        ><ul class="brand-list">
          @for (brand of brands; track brand.name) {
            <li>
              <span>{{ brand.name }}</span
              ><strong>{{ brand.count }}</strong>
            </li>
          }
        </ul></aeris-scroll-panel
      >
    </section>
    <section>
      <h4>Hidden</h4>
      <aeris-scroll-panel
        variant="hidden"
        height="10rem"
        ariaLabel="Hidden scrollbars"
        ><ul class="brand-list">
          @for (brand of brands; track brand.name) {
            <li>
              <span>{{ brand.name }}</span
              ><strong>{{ brand.count }}</strong>
            </li>
          }
        </ul></aeris-scroll-panel
      >
    </section>
  </div>
</div>
```

#### CSS

```css
.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-md);
  background: var(--aeris-surface);
}

.scroll-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.scroll-panel-grid h4 {
  margin: 0 0 0.5rem;
}

@media (max-width: 42rem) {
  .scroll-panel-grid {
      grid-template-columns: 1fr;
    }
}

.scroll-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.scroll-panel-grid h4 {
  margin: 0 0 0.5rem;
}

@media (max-width: 42rem) {
  .scroll-panel-grid {
    grid-template-columns: 1fr;
  }
}

.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}
```

### Events and methods

Respond to scroll state and call public methods from native controls.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisScrollPanelModule, type AerisScrollPanelEvent } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-methods-demo',
  imports: [AerisButton, AerisScrollPanelModule],
  templateUrl: './scroll-panel-methods.demo.html',
  styleUrl: './scroll-panel-methods.demo.scss'
})
export class ScrollPanelMethodsEventsAndMethodsDemo {
  protected bottomReached = false;
  protected lastScrollPosition = '0px';

  protected handleScroll(event: AerisScrollPanelEvent): void {
    this.lastScrollPosition = `${Math.round(event.scrollTop)}px`;
  }

  protected markBottom(): void {
    this.bottomReached = true;
  }
}
```

#### HTML

```html
<div>
  <div class="scroll-actions">
    <button
      aerisButton
      type="button"
      size="sm"
      (click)="methodPanel.scrollToTop({ behavior: 'smooth' })"
    >
      Top
    </button>
    <button
      aerisButton
      type="button"
      size="sm"
      variant="secondary"
      (click)="methodPanel.scrollToBottom({ behavior: 'smooth' })"
    >
      Bottom
    </button>
  </div>
  <aeris-scroll-panel
    #methodPanel
    height="11rem"
    ariaLabel="Scrollable method demo"
    (scrolled)="handleScroll($event)"
    (reachedBottom)="markBottom()"
  >
    <ul class="brand-list">
      @for (brand of brands; track brand.name) {
        <li>
          <span>{{ brand.name }}</span
          ><strong>{{ brand.count }}</strong>
        </li>
      }
    </ul>
  </aeris-scroll-panel>
  <p class="scroll-status">
    Scroll top: {{ lastScrollPosition }} · Reached bottom:
    {{ bottomReached ? 'yes' : 'no' }}
  </p>
</div>
```

#### CSS

```css
.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-md);
  background: var(--aeris-surface);
}

.scroll-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 0.875rem;
}

.scroll-status {
  margin: 0.75rem 0 0;
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

.scroll-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 0.875rem;
}

.scroll-status {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}

.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}
```

### Token customization

Use component tokens to tune the surface, border, fades, and native scrollbar colors.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisScrollPanelModule } from '@aeris-ui/core/scroll-panel';

@Component({
  selector: 'app-scroll-panel-custom-demo',
  imports: [AerisScrollPanelModule],
  templateUrl: './scroll-panel-custom.demo.html',
  styleUrl: './scroll-panel-custom.demo.scss'
})
export class ScrollPanelCustomTokenCustomizationDemo {
}
```

#### HTML

```html
<div>
  <aeris-scroll-panel
    class="brand-scroll-panel"
    variant="always"
    fade
    height="12rem"
    ariaLabel="Custom themed inventory"
  >
    <ul class="brand-list">
      @for (brand of brands; track brand.name) {
        <li>
          <span>{{ brand.name }}</span
          ><strong>{{ brand.count }}</strong>
        </li>
      }
    </ul>
  </aeris-scroll-panel>
</div>
```

#### CSS

```css
.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-md);
  background: var(--aeris-surface);
}

.brand-scroll-panel {
  --aeris-scroll-panel-background: color-mix(in srgb, var(--aeris-primary) 10%, var(--aeris-surface));
  --aeris-scroll-panel-border-width: 2px;
  --aeris-scroll-panel-border: color-mix(in srgb, var(--aeris-primary) 72%, var(--aeris-border));
  --aeris-scroll-panel-radius: 1.5rem;
  --aeris-scroll-panel-thumb: var(--aeris-primary);
  --aeris-scroll-panel-thumb-hover: var(--aeris-primary-text);
  --aeris-scroll-panel-thumb-always: var(--aeris-primary);
  --aeris-scroll-panel-track: color-mix(in srgb, var(--aeris-primary) 16%, transparent);
  --aeris-scroll-panel-track-always: color-mix(in srgb, var(--aeris-primary) 18%, transparent);
  --aeris-scroll-panel-padding: 1.125rem;
  --aeris-scroll-panel-fade-size: 2.75rem;
}

.brand-scroll-panel {
  --aeris-scroll-panel-background: color-mix(in srgb, var(--aeris-primary) 10%, var(--surface));
  --aeris-scroll-panel-border-width: 2px;
  --aeris-scroll-panel-border: color-mix(in srgb, var(--aeris-primary) 72%, var(--border));
  --aeris-scroll-panel-radius: 1.5rem;
  --aeris-scroll-panel-thumb: var(--aeris-primary);
  --aeris-scroll-panel-thumb-hover: var(--aeris-primary-text);
  --aeris-scroll-panel-thumb-always: var(--aeris-primary);
  --aeris-scroll-panel-track: color-mix(in srgb, var(--aeris-primary) 16%, transparent);
  --aeris-scroll-panel-track-always: color-mix(in srgb, var(--aeris-primary) 18%, transparent);
  --aeris-scroll-panel-padding: 1.125rem;
  --aeris-scroll-panel-fade-size: 2.75rem;
}

.brand-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}
```

## Accessibility

- ScrollPanel uses a native scroll container, preserving browser, pointer, touch, and assistive technology behavior.
- The viewport is focusable by default so keyboard users can scroll overflow content.
- The viewport uses role="region" by default and exposes an accessible name with ariaLabel or ariaLabelledBy.
- The hidden scrollbar variant only hides the scrollbar visuals; scrolling remains available with keyboard, wheel, trackpad, and touch input.
- Edge fades are visual only and do not change the accessibility tree.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to the scroll viewport when focusable is true. |
| `Arrow keys` | Native browser scrolling while the viewport has focus. |
| `Page Up / Page Down` | Native page-sized scrolling while the viewport has focus. |
| `Home / End` | Native movement to the start or end of the focused scroll viewport. |
