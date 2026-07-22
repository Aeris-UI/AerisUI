# Card

> Composable content surface with media, semantic regions, responsive layouts, and theme tokens.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/card`
- Human-readable documentation: [https://aeris-ui.dev/components/card](https://aeris-ui.dev/components/card)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCardModule } from '@aeris-ui/core/card';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `AerisCardVariant` | `'outlined'` | Outlined, elevated, or filled surface treatment. |
| `orientation` | `AerisCardOrientation` | `'vertical'` | Stacks content vertically or places media beside the body. |
| `padding` | `AerisCardPadding` | `'md'` | Controls body padding without changing projected media. |
| `hoverable` | `boolean` | `false` | Adds a hover treatment for cards contained by a link or other native control. |
| `role` | `AerisCardRole &#124; null` | `null` | Optional semantic role for meaningful independent regions. |
| `ariaLabel` | `string` | `''` | Accessible name when visible title text is unavailable. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that names the card region. |
| `ariaDescribedBy` | `string` | `''` | ID of content that provides the card description. |

### Slots

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisCardMedia` | `attribute directive` | `-` | Media placed before the card body or beside it in horizontal orientation. |
| `aerisCardHeader` | `attribute directive` | `-` | Header content projected before the main card content. |
| `aerisCardTitle` | `attribute directive` | `-` | Applies card title typography while preserving the chosen heading element. |
| `aerisCardSubtitle` | `attribute directive` | `-` | Applies secondary heading text styles. |
| `default content` | `content projection` | `-` | Main card body content. |
| `aerisCardFooter` | `attribute directive` | `-` | Footer actions or metadata projected after the content. |

## Interfaces and types

### Interfaces

```ts
type AerisCardVariant =
  | 'outlined'
  | 'elevated'
  | 'filled';

type AerisCardOrientation = 'vertical' | 'horizontal';
type AerisCardPadding = 'none' | 'sm' | 'md' | 'lg';
type AerisCardRole = 'article' | 'region' | 'group';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-card-background` | `CSS custom property` | — | Default card background. |
| `--aeris-card-border` | `CSS custom property` | — | Default card border. |
| `--aeris-card-radius` | `CSS custom property` | — | Outer corner radius. |
| `--aeris-card-padding` | `CSS custom property` | — | Medium body padding. |
| `--aeris-card-gap` | `CSS custom property` | — | Space between projected regions. |
| `--aeris-card-title-color` | `CSS custom property` | — | Title text color. |
| `--aeris-card-content-color` | `CSS custom property` | — | Body text color. |
| `--aeris-card-media-width` | `CSS custom property` | — | Horizontal media column width. |
| `--aeris-card-hover-shadow` | `CSS custom property` | — | Hoverable card shadow. |

## Examples

### Basic

Compose a heading, supporting text, body content, status, and native actions without a rigid content model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-basic-demo',
  imports: [AerisBadgeModule, AerisButton, AerisCardModule],
  templateUrl: './card-basic.demo.html',
  styleUrl: './card-basic.demo.scss'
})
export class CardBasicBasicDemo {
}
```

#### HTML

```html
<div class="card-demo card-demo--single">
  <aeris-card
    role="article"
    ariaLabelledBy="project-card-title"
    ariaDescribedBy="project-card-description"
  >
    <header aerisCardHeader>
      <div>
        <h3 id="project-card-title" aerisCardTitle>Design system refresh</h3>
        <p aerisCardSubtitle>Updated 18 minutes ago</p>
      </div>
      <aeris-badge value="Active" severity="success" size="sm" variant="soft" />
    </header>
    <p id="project-card-description">
      Review the refreshed tokens, component states, and migration notes before the
      next release.
    </p>
    <footer aerisCardFooter>
      <button aerisButton size="sm">Open project</button>
      <button aerisButton size="sm" variant="secondary">Share</button>
    </footer>
  </aeris-card>
</div>
```

#### CSS

```css
.card-demo {
  width: 100%;
}

.card-demo--single {
  max-width: 31rem;
  margin-inline: auto;
}
```

### Surface variants

Outlined is the quiet default, elevated adds depth, and filled separates grouped content without a border.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-variants-demo',
  imports: [AerisCardModule],
  template: `
    <div class="card-demo card-grid">
      <aeris-card variant="outlined"
        ><header aerisCardHeader><h3 aerisCardTitle>Outlined</h3></header>
        <p>Clear boundaries for structured layouts.</p></aeris-card
      >
      <aeris-card variant="elevated"
        ><header aerisCardHeader><h3 aerisCardTitle>Elevated</h3></header>
        <p>Depth for prominent or floating content.</p></aeris-card
      >
      <aeris-card variant="filled"
        ><header aerisCardHeader><h3 aerisCardTitle>Filled</h3></header>
        <p>Subtle grouping on open page surfaces.</p></aeris-card
      >
    </div>
  `,
  styles: `
    .card-demo {
      width: 100%;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      align-items: stretch;
    }
    
    .card-grid aeris-card {
      height: 100%;
    }
    
    @media (max-width: 52rem) {
      .card-grid {
          grid-template-columns: 1fr;
        }
    }
  `
})
export class CardVariantsSurfaceVariantsDemo {
}
```

### Padding

Four body-padding options support compact metadata, standard content, spacious features, and fully custom layouts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-padding-demo',
  imports: [AerisCardModule],
  templateUrl: './card-padding.demo.html',
  styleUrl: './card-padding.demo.scss'
})
export class CardPaddingPaddingDemo {
}
```

#### HTML

```html
<div class="card-demo card-grid card-grid--two">
  <aeris-card padding="sm"
    ><header aerisCardHeader><h3 aerisCardTitle>Small</h3></header>
    <p>Compact supporting content.</p></aeris-card
  >
  <aeris-card padding="md"
    ><header aerisCardHeader><h3 aerisCardTitle>Medium</h3></header>
    <p>The balanced default.</p></aeris-card
  >
  <aeris-card padding="lg"
    ><header aerisCardHeader><h3 aerisCardTitle>Large</h3></header>
    <p>More room for featured content.</p></aeris-card
  >
  <aeris-card padding="none"
    ><div class="custom-padding">
      <h3 aerisCardTitle>None</h3>
      <p>Bring your own internal layout.</p>
    </div></aeris-card
  >
</div>
```

#### CSS

```css
.card-demo {
  width: 100%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.card-grid aeris-card {
  height: 100%;
}

.card-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.custom-padding {
  padding: 0.875rem 1.25rem;
}

.custom-padding p {
  margin: 0.4rem 0 0;
}

@media (max-width: 52rem) {
  .card-grid {
      grid-template-columns: 1fr;
    }
}
```

### Media

The media slot stays outside body padding and accepts images, video, illustrations, or application-defined content.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-media-demo',
  imports: [AerisCardModule],
  templateUrl: './card-media.demo.html',
  styleUrl: './card-media.demo.scss'
})
export class CardMediaMediaDemo {
}
```

#### HTML

```html
<div class="card-demo card-demo--single">
  <aeris-card variant="elevated">
    <div aerisCardMedia class="card-art" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
    <header aerisCardHeader>
      <div>
        <h3 aerisCardTitle>Quiet workspace</h3>
        <p aerisCardSubtitle>Interface collection</p>
      </div>
    </header>
    <p>
      A soft visual header can establish context without changing the card's content
      structure.
    </p>
  </aeris-card>
</div>
```

#### CSS

```css
.card-demo {
  width: 100%;
}

.card-demo--single {
  max-width: 31rem;
  margin-inline: auto;
}

.card-art {
  position: relative;
  height: 10rem;
  background: radial-gradient(circle at 22% 35%, color-mix(in srgb, var(--aeris-accent) 72%, transparent) 0 12%, transparent 13%), radial-gradient(circle at 72% 70%, color-mix(in srgb, var(--aeris-secondary) 68%, transparent) 0 17%, transparent 18%), linear-gradient(135deg, var(--aeris-primary-soft), var(--aeris-surface-2));
  overflow: hidden;
}

.card-art span {
  position: absolute;
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid color-mix(in srgb, var(--aeris-primary) 35%, transparent);
  border-radius: 1.25rem;
  transform: rotate(28deg);
}

.card-art span:nth-child(1) {
  top: 1.5rem;
  left: 16%;
}

.card-art span:nth-child(2) {
  right: 18%;
  bottom: 1rem;
}

.card-art span:nth-child(3) {
  top: -2rem;
  right: 38%;
}
```

### Responsive horizontal card

Horizontal cards place media beside content and automatically stack on narrow screens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-horizontal-demo',
  imports: [AerisButton, AerisCardModule],
  templateUrl: './card-horizontal.demo.html',
  styleUrl: './card-horizontal.demo.scss'
})
export class CardHorizontalResponsiveHorizontalCardDemo {
}
```

#### HTML

```html
<div class="card-demo">
  <aeris-card orientation="horizontal">
    <div aerisCardMedia class="card-art card-art--horizontal" aria-hidden="true">
      <span></span><span></span>
    </div>
    <header aerisCardHeader>
      <div>
        <h3 aerisCardTitle>Component architecture</h3>
        <p aerisCardSubtitle>Engineering guide</p>
      </div>
    </header>
    <p>
      Keep public APIs focused, favor composition, and let semantic tokens carry
      visual consistency.
    </p>
    <footer aerisCardFooter>
      <button aerisButton size="sm" variant="secondary">Read guide</button>
    </footer>
  </aeris-card>
</div>
```

#### CSS

```css
.card-demo {
  width: 100%;
}

.card-art {
  position: relative;
  height: 10rem;
  background: radial-gradient(circle at 22% 35%, color-mix(in srgb, var(--aeris-accent) 72%, transparent) 0 12%, transparent 13%), radial-gradient(circle at 72% 70%, color-mix(in srgb, var(--aeris-secondary) 68%, transparent) 0 17%, transparent 18%), linear-gradient(135deg, var(--aeris-primary-soft), var(--aeris-surface-2));
  overflow: hidden;
}

.card-art span {
  position: absolute;
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid color-mix(in srgb, var(--aeris-primary) 35%, transparent);
  border-radius: 1.25rem;
  transform: rotate(28deg);
}

.card-art span:nth-child(1) {
  top: 1.5rem;
  left: 16%;
}

.card-art span:nth-child(2) {
  right: 18%;
  bottom: 1rem;
}

.card-art span:nth-child(3) {
  top: -2rem;
  right: 38%;
}

.card-art--horizontal {
  height: 100%;
  min-height: 13rem;
}
```

### Linked card

Keep Card non-interactive and wrap it with a native link when the complete surface represents one destination.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-link-demo',
  imports: [AerisCardModule],
  templateUrl: './card-link.demo.html',
  styleUrl: './card-link.demo.scss'
})
export class CardLinkLinkedCardDemo {
}
```

#### HTML

```html
<div class="card-demo card-demo--single">
  <a
    class="linked-card"
    href="https://github.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    <aeris-card hoverable>
      <header aerisCardHeader>
        <div>
          <h3 aerisCardTitle>Repository</h3>
          <p aerisCardSubtitle>Source and release history</p>
        </div>
      </header>
      <p>
        Explore implementation details, package entry points, and project changes.
      </p>
    </aeris-card>
  </a>
</div>
```

#### CSS

```css
.card-demo {
  width: 100%;
}

.card-demo--single {
  max-width: 31rem;
  margin-inline: auto;
}

.linked-card {
  display: block;
  color: inherit;
  text-decoration: none;
}

.linked-card:focus-visible {
  border-radius: var(--aeris-card-radius, var(--aeris-radius-lg));
  outline: 3px solid color-mix(in srgb, var(--aeris-focus) 44%, transparent);
  outline-offset: 3px;
}
```

### Token customization

Global semantic tokens provide defaults while card-specific tokens handle focused brand treatments.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCardModule } from '@aeris-ui/core/card';

@Component({
  selector: 'app-card-custom-demo',
  imports: [AerisCardModule],
  template: `
    <div class="card-demo card-demo--single">
      <aeris-card class="brand-card">
        <header aerisCardHeader>
          <div>
            <h3 aerisCardTitle>Custom surface</h3>
            <p aerisCardSubtitle>Scoped to this card</p>
          </div>
        </header>
        <p>Override only the card tokens you need while preserving theme switching.</p>
      </aeris-card>
    </div>
  `,
  styles: `
    .card-demo {
      width: 100%;
    }
    
    .card-demo--single {
      max-width: 31rem;
      margin-inline: auto;
    }
    
    .brand-card {
      --aeris-card-background: color-mix(
        in srgb,
        var(--aeris-primary) 9%,
        var(--aeris-surface)
      );
      --aeris-card-border: color-mix(
        in srgb,
        var(--aeris-primary) 42%,
        var(--aeris-border)
      );
      --aeris-card-radius: 1.5rem;
      --aeris-card-title-color: var(--aeris-primary-text);
    }
  `
})
export class CardCustomTokenCustomizationDemo {
}
```

## Accessibility

- Card is semantically neutral by default because not every visual card is an independent document region.
- Use role="article" for standalone content or role="region" with an accessible name for important page sections.
- Title directives preserve the developer-selected heading level and do not create incorrect document hierarchy.
- Card never simulates button or link behavior. Use native links and buttons for interactive content.
- Hover motion is disabled when the user requests reduced motion.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves to native links, buttons, and form controls projected inside the card. A non-interactive card is not added to the tab order. |
