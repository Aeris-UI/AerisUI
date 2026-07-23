# Carousel

> Responsive item carousel with controlled paging, templates, autoplay, swipe, and keyboard navigation.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/carousel`
- Human-readable documentation: [https://aeris-ui.dev/components/carousel](https://aeris-ui.dev/components/carousel)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCarouselModule } from '@aeris-ui/core/carousel';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `readonly T[]` | `[]` | Items to render. |
| `numVisible` | `number` | `1` | Items visible in one page. |
| `numScroll` | `number` | `1` | Items advanced by navigation. |
| `responsiveOptions` | `readonly AerisCarouselResponsiveOption[]` | `[]` | Breakpoint-specific visible and scroll counts. |
| `circular` | `boolean` | `false` | Wraps navigation at either end. |
| `showNavigators` | `boolean` | `true` | Shows previous and next buttons. |
| `showIndicators` | `boolean` | `true` | Shows page indicators. |
| `autoplayInterval` | `number` | `0` | Milliseconds between automatic page changes; zero disables autoplay. |
| `pauseOnHover` | `boolean` | `true` | Pauses autoplay while the carousel is hovered or focused. |
| `orientation` | `'horizontal' &#124; 'vertical'` | `'horizontal'` | Track direction. |
| `verticalViewportHeight` | `string` | `'20rem'` | Viewport height in vertical mode. |
| `ariaLabel` | `string` | `'Carousel'` | Accessible name for the carousel region. |
| `indicatorAriaLabel` | `string` | `'Carousel pages'` | Accessible name for page indicators. |
| `previousAriaLabel` | `string` | `'Previous items'` | Previous navigator label. |
| `nextAriaLabel` | `string` | `'Next items'` | Next navigator label. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `0` | Current visible page. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pageChanged` | `AerisCarouselPageEvent` | `-` | Emitted for user, autoplay, and API page changes. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisCarouselItem` | `AerisCarouselItemContext&lt;T&gt;` | `Text item` | Renders each item. |
| `aerisCarouselHeader` | `none` | `-` | Renders content above the track. |
| `aerisCarouselFooter` | `none` | `-` | Renders content below indicators. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `next(reason?)` | `void` | `-` | Moves forward one page. |
| `previous(reason?)` | `void` | `-` | Moves backward one page. |
| `goToPage(page, reason?)` | `void` | `-` | Moves to a valid page. |
| `startAutoplay()` | `void` | `-` | Allows the configured autoplay timer to run. |
| `stopAutoplay()` | `void` | `-` | Pauses autoplay. |

## Interfaces and types

### Interfaces

```ts
type AerisCarouselOrientation = 'horizontal' | 'vertical';
type AerisCarouselChangeReason = 'next' | 'previous' | 'indicator' | 'keyboard' | 'swipe' | 'autoplay' | 'api';

interface AerisCarouselResponsiveOption {
  readonly breakpoint: string;
  readonly numVisible?: number;
  readonly numScroll?: number;
}

interface AerisCarouselItemContext<T = unknown> {
  readonly $implicit: T;
  readonly item: T;
  readonly index: number;
  readonly visible: boolean;
}

interface AerisCarouselPageEvent {
  readonly page: number;
  readonly first: number;
  readonly last: number;
  readonly reason: AerisCarouselChangeReason;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-carousel-gap` | `length` | `density gap × 1.5` | Space between carousel regions. |
| `--aeris-carousel-radius` | `length` | `--aeris-radius-lg` | Viewport corners. |
| `--aeris-carousel-item-gap` | `length` | `--aeris-density-gap` | Space between items. |
| `--aeris-carousel-transition-duration` | `time` | `260ms` | Track transition duration. |
| `--aeris-carousel-navigator-background` | `color` | `--aeris-surface` | Navigator button background. |
| `--aeris-carousel-indicator-background` | `color` | `--aeris-border-strong` | Inactive indicator color. |
| `--aeris-carousel-active-indicator-background` | `color` | `--aeris-primary` | Active indicator color. |

## Examples

### Basic

Render a collection with a custom item template and optional header and footer regions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCarouselModule } from '@aeris-ui/core/carousel';

interface Destination {
  readonly name: string;
  readonly detail: string;
  readonly tone: 'sage' | 'blue' | 'gold' | 'rose' | 'sky';
}

@Component({
  selector: 'app-carousel-basic-demo',
  imports: [AerisCarouselModule],
  templateUrl: './carousel-basic.demo.html',
  styleUrl: './carousel-basic.demo.scss'
})
export class CarouselBasicBasicDemo {
  protected readonly destinations: readonly Destination[] = [
    { name: 'Milo', detail: 'A curious explorer with a wagging tail.', tone: 'sage' },
    { name: 'Luna', detail: 'Always ready for a bright new adventure.', tone: 'blue' },
    { name: 'Biscuit', detail: 'Small paws, big heart, and endless naps.', tone: 'gold' },
    { name: 'Poppy', detail: 'A playful friend who loves every visitor.', tone: 'rose' },
    { name: 'Nova', detail: 'Gentle, clever, and quick to make friends.', tone: 'sky' },
  ];
}
```

#### HTML

```html
<div>
  <aeris-carousel [value]="destinations" [numVisible]="3" ariaLabel="Meet the puppies"
    ><ng-template aerisCarouselHeader
      ><div class="carousel-title">
        <strong>Meet the puppies</strong
        ><span>Five playful friends with big personalities.</span>
      </div></ng-template
    ><ng-template aerisCarouselItem let-item
      ><article class="destination-card" [attr.data-tone]="$any(item).tone">
        <strong>{{ $any(item).name }}</strong
        ><span>{{ $any(item).detail }}</span>
      </article></ng-template
    ><ng-template aerisCarouselFooter
      ><small class="carousel-footer"
        >Curated for unhurried weekends.</small
      ></ng-template
    ></aeris-carousel
  >
</div>
```

#### CSS

```css
.carousel-title {
  display: grid;
  gap: 0.2rem;
}

.carousel-title strong {
  font-size: 1rem;
}

.carousel-title span, .carousel-footer, .carousel-actions span {
  color: var(--aeris-text-2);
  font-size: 0.875rem;
}

.destination-card {
  position: relative;
  display: grid;
  align-content: end;
  min-height: 19rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-lg);
  background-color: var(--surface-2);
  background-position: center;
  background-size: cover;
  color: #fff;
  overflow: hidden;
}

.destination-card::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));
  content: '';
}

.destination-card strong,
.destination-card span { position: relative; display: block; }
.destination-card strong { font-size: 1.25rem; }
.destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }

.destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }
.destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }
.destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }
.destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }
.destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }
```

### Responsive

Adapt visible and scroll counts to the carousel’s available width.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCarouselModule, type AerisCarouselResponsiveOption } from '@aeris-ui/core/carousel';

@Component({
  selector: 'app-carousel-responsive-demo',
  imports: [AerisCarouselModule],
  template: `
    <div>
      <aeris-carousel
        [value]="destinations"
        [numVisible]="2"
        [responsiveOptions]="responsiveOptions"
        ariaLabel="Responsive puppies"
        ><ng-template aerisCarouselItem let-item
          ><article class="destination-card" [attr.data-tone]="$any(item).tone">
            <strong>{{ $any(item).name }}</strong
            ><span>{{ $any(item).detail }}</span>
          </article></ng-template
        ></aeris-carousel
      >
    </div>
  `,
  styles: `
    .destination-card {
      position: relative;
      display: grid;
      align-content: end;
      min-height: 19rem;
      padding: 1.25rem;
      border-radius: var(--aeris-radius-lg);
      background-color: var(--surface-2);
      background-position: center;
      background-size: cover;
      color: #fff;
      overflow: hidden;
    }
    
    .destination-card::before {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));
      content: '';
    }
    
    .destination-card strong,
    .destination-card span { position: relative; display: block; }
    .destination-card strong { font-size: 1.25rem; }
    .destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }
    
    .destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }
    .destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }
    .destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }
    .destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }
    .destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }
  `
})
export class CarouselResponsiveResponsiveDemo {
  protected readonly responsiveOptions: readonly AerisCarouselResponsiveOption[] = [
    { breakpoint: '56rem', numVisible: 2, numScroll: 1 },
    { breakpoint: '38rem', numVisible: 1, numScroll: 1 },
  ];
}
```

### Controlled

Bind page to application state and react to every page change.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCarouselModule, type AerisCarouselPageEvent } from '@aeris-ui/core/carousel';

@Component({
  selector: 'app-carousel-controlled-demo',
  imports: [AerisButton, AerisCarouselModule],
  templateUrl: './carousel-controlled.demo.html',
  styleUrl: './carousel-controlled.demo.scss'
})
export class CarouselControlledControlledDemo {
  protected readonly controlledPage = signal(0);
  protected readonly pageMessage = signal('Showing the first slide.');

  protected showFirst(): void {
    this.controlledPage.set(0);
    this.pageMessage.set('Showing slide 1.');
  }

  protected handlePage(event: AerisCarouselPageEvent): void {
    this.pageMessage.set(`Showing slide ${event.page + 1}.`);
  }
}
```

#### HTML

```html
<div>
  <div class="carousel-actions">
    <button aerisButton type="button" (click)="showFirst()">First slide</button
    ><span aria-live="polite">{{ pageMessage() }}</span>
  </div>
  <aeris-carousel
    [value]="destinations"
    [numVisible]="1"
    [(page)]="controlledPage"
    (pageChanged)="handlePage($event)"
    ariaLabel="Controlled puppy carousel"
    ><ng-template aerisCarouselItem let-item
      ><article class="destination-card" [attr.data-tone]="$any(item).tone">
        <strong>{{ $any(item).name }}</strong
        ><span>{{ $any(item).detail }}</span>
      </article></ng-template
    ></aeris-carousel
  >
</div>
```

#### CSS

```css
.carousel-title span, .carousel-footer, .carousel-actions span {
  color: var(--aeris-text-2);
  font-size: 0.875rem;
}

.carousel-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.destination-card {
  position: relative;
  display: grid;
  align-content: end;
  min-height: 19rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-lg);
  background-color: var(--surface-2);
  background-position: center;
  background-size: cover;
  color: #fff;
  overflow: hidden;
}

.destination-card::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));
  content: '';
}

.destination-card strong,
.destination-card span { position: relative; display: block; }
.destination-card strong { font-size: 1.25rem; }
.destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }

.destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }
.destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }
.destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }
.destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }
.destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }
```

### Circular and autoplay

Wrap continuously and advance automatically; hover or focus pauses the timer.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCarouselModule } from '@aeris-ui/core/carousel';

interface Destination {
  readonly name: string;
  readonly detail: string;
  readonly tone: 'sage' | 'blue' | 'gold' | 'rose' | 'sky';
}

@Component({
  selector: 'app-carousel-circular-demo',
  imports: [AerisCarouselModule],
  templateUrl: './carousel-circular.demo.html',
  styleUrl: './carousel-circular.demo.scss'
})
export class CarouselCircularCircularAndAutoplayDemo {
  protected readonly destinations: readonly Destination[] = [
    { name: 'Milo', detail: 'A curious explorer with a wagging tail.', tone: 'sage' },
    { name: 'Luna', detail: 'Always ready for a bright new adventure.', tone: 'blue' },
    { name: 'Biscuit', detail: 'Small paws, big heart, and endless naps.', tone: 'gold' },
    { name: 'Poppy', detail: 'A playful friend who loves every visitor.', tone: 'rose' },
    { name: 'Nova', detail: 'Gentle, clever, and quick to make friends.', tone: 'sky' },
  ];
}
```

#### HTML

```html
<div>
  <aeris-carousel
    [value]="destinations"
    [numVisible]="2"
    circular
    [autoplayInterval]="2200"
    ariaLabel="Autoplay puppies"
    ><ng-template aerisCarouselItem let-item
      ><article class="destination-card" [attr.data-tone]="$any(item).tone">
        <strong>{{ $any(item).name }}</strong
        ><span>{{ $any(item).detail }}</span>
      </article></ng-template
    ></aeris-carousel
  >
</div>
```

#### CSS

```css
.destination-card {
  position: relative;
  display: grid;
  align-content: end;
  min-height: 19rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-lg);
  background-color: var(--surface-2);
  background-position: center;
  background-size: cover;
  color: #fff;
  overflow: hidden;
}

.destination-card::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));
  content: '';
}

.destination-card strong,
.destination-card span { position: relative; display: block; }
.destination-card strong { font-size: 1.25rem; }
.destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }

.destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }
.destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }
.destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }
.destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }
.destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }
```

### Vertical

Browse one puppy slide at a time with indicators between the slide and down control.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCarouselModule } from '@aeris-ui/core/carousel';

interface Destination {
  readonly name: string;
  readonly detail: string;
  readonly tone: 'sage' | 'blue' | 'gold' | 'rose' | 'sky';
}

@Component({
  selector: 'app-carousel-vertical-demo',
  imports: [AerisCarouselModule],
  template: `
    <div>
      <aeris-carousel
        [value]="destinations"
        orientation="vertical"
        verticalViewportHeight="19rem"
        ariaLabel="Vertical puppy carousel"
        ><ng-template aerisCarouselItem let-item
          ><article class="destination-card" [attr.data-tone]="$any(item).tone">
            <strong>{{ $any(item).name }}</strong
            ><span>{{ $any(item).detail }}</span>
          </article></ng-template
        ></aeris-carousel
      >
    </div>
  `,
  styles: `
    .destination-card {
      position: relative;
      display: grid;
      align-content: end;
      min-height: 19rem;
      padding: 1.25rem;
      border-radius: var(--aeris-radius-lg);
      background-color: var(--surface-2);
      background-position: center;
      background-size: cover;
      color: #fff;
      overflow: hidden;
    }
    
    .destination-card::before {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));
      content: '';
    }
    
    .destination-card strong,
    .destination-card span { position: relative; display: block; }
    .destination-card strong { font-size: 1.25rem; }
    .destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }
    
    .destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }
    .destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }
    .destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }
    .destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }
    .destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }
  `
})
export class CarouselVerticalVerticalDemo {
  protected readonly destinations: readonly Destination[] = [
    { name: 'Milo', detail: 'A curious explorer with a wagging tail.', tone: 'sage' },
    { name: 'Luna', detail: 'Always ready for a bright new adventure.', tone: 'blue' },
    { name: 'Biscuit', detail: 'Small paws, big heart, and endless naps.', tone: 'gold' },
    { name: 'Poppy', detail: 'A playful friend who loves every visitor.', tone: 'rose' },
    { name: 'Nova', detail: 'Gentle, clever, and quick to make friends.', tone: 'sky' },
  ];
}
```

### Minimal

Hide navigators or indicators when adjacent controls already manage the collection.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCarouselModule } from '@aeris-ui/core/carousel';

interface Destination {
  readonly name: string;
  readonly detail: string;
  readonly tone: 'sage' | 'blue' | 'gold' | 'rose' | 'sky';
}

@Component({
  selector: 'app-carousel-minimal-demo',
  imports: [AerisCarouselModule],
  templateUrl: './carousel-minimal.demo.html',
  styleUrl: './carousel-minimal.demo.scss'
})
export class CarouselMinimalMinimalDemo {
  protected readonly destinations: readonly Destination[] = [
    { name: 'Milo', detail: 'A curious explorer with a wagging tail.', tone: 'sage' },
    { name: 'Luna', detail: 'Always ready for a bright new adventure.', tone: 'blue' },
    { name: 'Biscuit', detail: 'Small paws, big heart, and endless naps.', tone: 'gold' },
    { name: 'Poppy', detail: 'A playful friend who loves every visitor.', tone: 'rose' },
    { name: 'Nova', detail: 'Gentle, clever, and quick to make friends.', tone: 'sky' },
  ];
}
```

#### HTML

```html
<div>
  <aeris-carousel
    [value]="destinations"
    [numVisible]="2"
    [showNavigators]="false"
    [showIndicators]="false"
    ariaLabel="Minimal destinations"
    ><ng-template aerisCarouselItem let-item
      ><article class="destination-card" [attr.data-tone]="$any(item).tone">
        <strong>{{ $any(item).name }}</strong
        ><span>{{ $any(item).detail }}</span>
      </article></ng-template
    ></aeris-carousel
  >
</div>
```

#### CSS

```css
.destination-card {
  position: relative;
  display: grid;
  align-content: end;
  min-height: 19rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-lg);
  background-color: var(--surface-2);
  background-position: center;
  background-size: cover;
  color: #fff;
  overflow: hidden;
}

.destination-card::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 28%, rgb(0 0 0 / 68%));
  content: '';
}

.destination-card strong,
.destination-card span { position: relative; display: block; }
.destination-card strong { font-size: 1.25rem; }
.destination-card span { margin-top: 0.35rem; color: rgb(255 255 255 / 86%); line-height: 1.5; }

.destination-card[data-tone='sage'] { background-image: url('/puppies/puppy1.jpg'); }
.destination-card[data-tone='blue'] { background-image: url('/puppies/puppy2.jpg'); }
.destination-card[data-tone='gold'] { background-image: url('/puppies/puppy3.jpg'); }
.destination-card[data-tone='rose'] { background-image: url('/puppies/puppy4.jpg'); }
.destination-card[data-tone='sky'] { background-image: url('/puppies/puppy5.jpg'); }
```

## Accessibility

- The component exposes a named carousel region; items outside the active page are hidden from assistive technologies and removed from sequential focus.
- Navigation and indicators are native buttons with clear labels and current-page state.
- Autoplay pauses while the carousel is hovered or contains focus, and live announcements are disabled while it runs.
- Provide descriptive item content; Carousel does not invent labels for projected content.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves through navigators, the viewport, and page indicators. |
| `Arrow Right / Arrow Left` | Moves to the next or previous horizontal page; direction follows RTL. |
| `Arrow Down / Arrow Up` | Moves to the next or previous vertical page. |
| `Home / End` | Moves to the first or last page. |
| `Enter / Space` | Activates focused native navigator or indicator buttons. |
