# Skeleton

> Compose responsive loading placeholders with text, rectangle, and circle shapes plus motion-safe animations.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/skeleton`
- Human-readable documentation: [https://aeris-ui.dev/components/skeleton](https://aeris-ui.dev/components/skeleton)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `shape` | `AerisSkeletonShape` | `'text'` | Sets text, rectangular, or circular geometry. |
| `animation` | `AerisSkeletonAnimation` | `'wave'` | Sets wave, pulse, or static presentation. |
| `width` | `string` | `'100%'` | Sets CSS inline size while remaining container-safe. |
| `height` | `string` | `''` | Overrides the shape-aware default block size. |
| `radius` | `string` | `''` | Overrides the theme-aware border radius. |

## Interfaces and types

### Interfaces

```ts
type AerisSkeletonShape = 'text' | 'rectangle' | 'circle';
type AerisSkeletonAnimation = 'wave' | 'pulse' | 'none';
```

## Examples

### Basic

Combine decorative placeholders and put loading semantics on their shared content container.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-basic-demo',
  imports: [AerisSkeletonModule],
  templateUrl: './skeleton-basic.demo.html',
  styleUrl: './skeleton-basic.demo.scss'
})
export class SkeletonBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <section
    class="skeleton-profile"
    aria-busy="true"
    aria-labelledby="profile-loading"
  >
    <span id="profile-loading" class="skeleton-status" role="status">
      Loading profile
    </span>
    <aeris-skeleton shape="circle" width="3rem" />
    <div class="skeleton-profile__lines">
      <aeris-skeleton width="65%" />
      <aeris-skeleton width="42%" height="0.625rem" />
    </div>
  </section>
</div>
```

#### CSS

```css
.skeleton-profile {
  max-width: 32rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
}

.skeleton-profile__lines {
  min-width: 0;
  display: grid;
  gap: 0.625rem;
}

.skeleton-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

### Shapes

Use text, rectangle, and circle geometry with CSS-compatible dimensions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-shapes-demo',
  imports: [AerisSkeletonModule],
  templateUrl: './skeleton-shapes.demo.html',
  styleUrl: './skeleton-shapes.demo.scss'
})
export class SkeletonShapesShapesDemo {
}
```

#### HTML

```html
<div>
  <div class="skeleton-shapes">
    <div class="skeleton-shape">
      <span>Text</span>
      <aeris-skeleton width="10rem" />
    </div>
    <div class="skeleton-shape">
      <span>Rectangle</span>
      <aeris-skeleton shape="rectangle" width="8rem" height="5rem" />
    </div>
    <div class="skeleton-shape">
      <span>Circle</span>
      <aeris-skeleton shape="circle" width="4rem" />
    </div>
    <div class="skeleton-shape">
      <span>Custom radius</span>
      <aeris-skeleton shape="rectangle" width="8rem" height="5rem" radius="1.5rem" />
    </div>
  </div>
</div>
```

#### CSS

```css
.skeleton-shapes {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1.5rem;
}

.skeleton-shape {
  display: grid;
  justify-items: start;
  gap: 0.5rem;
}

.skeleton-shape span {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}
```

### Animation

Choose a directional wave, subtle pulse, or static placeholder.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-animation-demo',
  imports: [AerisSkeletonModule],
  templateUrl: './skeleton-animation.demo.html',
  styleUrl: './skeleton-animation.demo.scss'
})
export class SkeletonAnimationAnimationDemo {
}
```

#### HTML

```html
<div>
  <div class="skeleton-animation-grid">
    <div>
      <span>Wave</span>
      <aeris-skeleton animation="wave" />
    </div>
    <div>
      <span>Pulse</span>
      <aeris-skeleton animation="pulse" />
    </div>
    <div>
      <span>None</span>
      <aeris-skeleton animation="none" />
    </div>
  </div>
</div>
```

#### CSS

```css
.skeleton-animation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.skeleton-animation-grid div {
  min-width: 0;
  display: grid;
  gap: 0.625rem;
}

.skeleton-animation-grid span {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

@media (max-width: 36rem) {
  .skeleton-animation-grid {
    grid-template-columns: 1fr;
  }
}
```

### Card

Mirror the final card hierarchy to minimize layout movement when content arrives.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-card-demo',
  imports: [AerisSkeletonModule],
  templateUrl: './skeleton-card.demo.html',
  styleUrl: './skeleton-card.demo.scss'
})
export class SkeletonCardCardDemo {
}
```

#### HTML

```html
<div>
  <article class="skeleton-card" aria-busy="true" aria-label="Loading article card">
    <aeris-skeleton shape="rectangle" height="10rem" />
    <div class="skeleton-card__header">
      <aeris-skeleton shape="circle" width="2.5rem" />
      <div class="skeleton-card__lines">
        <aeris-skeleton width="55%" />
        <aeris-skeleton width="35%" height="0.625rem" />
      </div>
    </div>
    <div class="skeleton-card__body">
      <aeris-skeleton />
      <aeris-skeleton width="92%" />
      <aeris-skeleton width="68%" />
    </div>
  </article>
</div>
```

#### CSS

```css
.skeleton-card {
  max-width: 24rem;
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface);
}

.skeleton-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.skeleton-card__lines,
.skeleton-card__body {
  min-width: 0;
  display: grid;
  gap: 0.625rem;
}
```

### Grid

Responsive grid cells retain their intended dimensions at narrow widths.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-grid-demo',
  imports: [AerisSkeletonModule],
  template: `
    <div>
      <div class="skeleton-grid" aria-busy="true" aria-label="Loading project grid">
        @for (item of [1, 2, 3]; track item) {
          <div class="skeleton-grid__card">
            <aeris-skeleton shape="rectangle" height="7rem" />
            <aeris-skeleton width="72%" />
            <aeris-skeleton width="48%" height="0.625rem" />
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
      gap: 1rem;
    }
    
    .skeleton-grid__card {
      min-width: 0;
      display: grid;
      gap: 0.75rem;
      padding: 0.875rem;
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-lg);
    }
  `
})
export class SkeletonGridGridDemo {
}
```

### List

Repeat compact rows while keeping each placeholder contained.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-list-demo',
  imports: [AerisSkeletonModule],
  template: `
    <div>
      <ul class="skeleton-list" aria-busy="true" aria-label="Loading conversations">
        @for (item of [1, 2, 3, 4]; track item) {
          <li>
            <aeris-skeleton shape="circle" width="2.75rem" />
            <div class="skeleton-list__lines">
              <aeris-skeleton width="45%" />
              <aeris-skeleton width="72%" height="0.625rem" />
            </div>
            <aeris-skeleton width="2.5rem" height="0.625rem" />
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .skeleton-list {
      display: grid;
      gap: 0;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    
    .skeleton-list li {
      min-width: 0;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 0.875rem;
      align-items: center;
      padding: 0.875rem 0;
      border-bottom: 1px solid var(--aeris-border);
    }
    
    .skeleton-list__lines {
      min-width: 0;
      display: grid;
      gap: 0.5rem;
    }
  `
})
export class SkeletonListListDemo {
}
```

### Table

Preserve real table semantics and contain dense layouts on mobile.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-table-demo',
  imports: [AerisSkeletonModule],
  templateUrl: './skeleton-table.demo.html',
  styleUrl: './skeleton-table.demo.scss'
})
export class SkeletonTableTableDemo {
}
```

#### HTML

```html
<div>
  <div class="skeleton-table-wrap">
    <table class="skeleton-table" aria-busy="true">
      <caption class="skeleton-status">
        Loading product inventory
      </caption>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        @for (item of [1, 2, 3]; track item) {
          <tr>
            <td><aeris-skeleton width="5rem" /></td>
            <td><aeris-skeleton width="9rem" /></td>
            <td><aeris-skeleton width="7rem" /></td>
            <td><aeris-skeleton width="3rem" /></td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>
```

#### CSS

```css
.skeleton-status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.skeleton-table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.skeleton-table {
  width: 100%;
  min-width: 34rem;
  border-collapse: collapse;
}

.skeleton-table th,
.skeleton-table td {
  padding: 0.875rem;
  border-bottom: 1px solid var(--aeris-border);
  text-align: start;
}

.skeleton-table th {
  color: var(--aeris-text-2);
  font-size: 0.75rem;
  text-transform: uppercase;
}
```

### Token customization

Create a clearly branded loading treatment with scoped color, radius, and timing tokens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSkeletonModule } from '@aeris-ui/core/skeleton';

@Component({
  selector: 'app-skeleton-tokens-demo',
  imports: [AerisSkeletonModule],
  template: `
    <div>
      <aeris-skeleton class="custom-skeleton" shape="rectangle" height="7rem" />
    </div>
  `,
  styles: `
    .custom-skeleton {
      --aeris-skeleton-background: color-mix(
        in srgb,
        var(--aeris-primary) 16%,
        var(--aeris-surface)
      );
      --aeris-skeleton-highlight: color-mix(
        in srgb,
        var(--aeris-primary) 36%,
        var(--aeris-surface)
      );
      --aeris-skeleton-rectangle-radius: 1.25rem;
      --aeris-skeleton-duration: 900ms;
    }
  `
})
export class SkeletonTokensTokenCustomizationDemo {
}
```

## Accessibility

- Every Skeleton is permanently hidden from assistive technology because its shape is decorative.
- Set aria-busy="true" on the content container being loaded, not on each placeholder.
- Provide concise loading status text when users need an announcement, then replace or remove it when loading finishes.
- Mirror the final content dimensions to reduce layout shifts without implying unavailable controls are interactive.
- Wave and pulse animations stop when reduced motion is requested.
- Width is constrained to the parent, preventing page overflow on narrow screens.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | Skeleton handles no keyboard input and never enters the tab order. |
