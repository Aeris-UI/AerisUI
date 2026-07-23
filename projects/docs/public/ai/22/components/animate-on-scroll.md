# AnimateOnScroll

> Reveal content on viewport entry with motion-safe effects, replay controls, timing, and intersection events.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/animate-on-scroll`
- Human-readable documentation: [https://aeris-ui.dev/components/animate-on-scroll](https://aeris-ui.dev/components/animate-on-scroll)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisAnimateOnScroll` | `AerisAnimateOnScrollEffect` | `'fade-up'` | Selects the built-in reveal effect. |
| `threshold` | `number` | `0.2` | Visible proportion required to enter, clamped from 0 to 1. |
| `rootMargin` | `string` | `'0px 0px -10% 0px'` | IntersectionObserver margin used to tune the reveal boundary. |
| `once` | `boolean` | `true` | Keeps the element visible and stops observation after its first entrance. |
| `disabled` | `boolean` | `false` | Reveals immediately and skips observation. |
| `duration` | `number` | `480` | Transition duration in milliseconds, clamped from 0 to 60000. |
| `delay` | `number` | `0` | Transition delay in milliseconds, clamped from 0 to 60000. |
| `easing` | `string` | `'cubic-bezier(0.22, 1, 0.36, 1)'` | CSS timing function used by opacity and transform. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `entered` | `AerisAnimateOnScrollEvent` | `—` | Emits when the host enters the configured boundary. |
| `left` | `AerisAnimateOnScrollEvent` | `—` | Emits after a visible host leaves when once is false. |

## Interfaces and types

### Interfaces

```ts
export type AerisAnimateOnScrollEffect =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'slide-start'
  | 'slide-end'
  | 'scale';

export interface AerisAnimateOnScrollEvent {
  readonly element: HTMLElement;
  readonly entry: IntersectionObserverEntry | null;
}
```

## Examples

### Scroll showcase

Scroll through a complete composition. Every element resets after leaving so the sequence can be replayed in either direction.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';

@Component({
  selector: 'app-animate-on-scroll-basic-demo',
  imports: [AerisAnimateOnScrollModule],
  templateUrl: './animate-on-scroll-basic.demo.html',
  styleUrl: './animate-on-scroll-basic.demo.scss'
})
export class AnimateOnScrollBasicScrollShowcaseDemo {
}
```

#### HTML

```html
<div>
  <div class="reveal-story" tabindex="0" aria-label="Scrollable animation showcase">
    <header class="story-hero">
      <span>Aeris motion</span>
      <h3>Interfaces with a sense of arrival.</h3>
      <p>
        Scroll to see content enter naturally, then return to the top to replay every
        reveal.
      </p>
      <span aria-hidden="true">Scroll down ↓</span>
    </header>

    <section class="story-chapter">
      <div
        class="story-copy"
        aerisAnimateOnScroll="slide-start"
        [once]="false"
        [threshold]="0.35"
      >
        <h4>Motion that supports hierarchy</h4>
        <p>
          Logical directions follow the reading flow and make related content feel
          connected.
        </p>
      </div>
      <div
        class="story-window"
        aerisAnimateOnScroll="slide-end"
        [once]="false"
        [threshold]="0.35"
      >
        <div class="story-dashboard">
          <div class="story-metric">
            <strong>84%</strong><span>Accessibility coverage</span>
          </div>
          <div class="story-metric"><strong>32</strong><span>Patterns</span></div>
          <div class="story-metric"><strong>6</strong><span>Palettes</span></div>
        </div>
      </div>
    </section>

    <section class="story-stat-grid" aria-label="Animation qualities">
      <article
        class="story-stat"
        aerisAnimateOnScroll="scale"
        [once]="false"
        [delay]="0"
      >
        <strong>Fast</strong><span>Observer driven</span>
      </article>
      <article
        class="story-stat"
        aerisAnimateOnScroll="scale"
        [once]="false"
        [delay]="100"
      >
        <strong>Calm</strong><span>Purposeful easing</span>
      </article>
      <article
        class="story-stat"
        aerisAnimateOnScroll="scale"
        [once]="false"
        [delay]="200"
      >
        <strong>Inclusive</strong><span>Motion aware</span>
      </article>
    </section>

    <footer
      class="story-finale"
      aerisAnimateOnScroll="fade-up"
      [once]="false"
      [threshold]="0.4"
    >
      <span>Ready to replay</span>
      <h4>Scroll back to the beginning.</h4>
      <p>
        Each section returns to its initial state after it leaves the visible area.
      </p>
    </footer>
  </div>
</div>
```

#### CSS

```css
.reveal-story {
  height: min(34rem, 72vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-xl);
  background:
    radial-gradient(circle at 82% 8%, var(--aeris-primary-soft), transparent 24rem),
    var(--aeris-surface-2);
}

.story-hero,
.story-chapter,
.story-finale {
  min-height: 30rem;
  padding: clamp(1.25rem, 5vw, 3.5rem);
}

.story-hero,
.story-finale {
  display: grid;
  align-content: center;
}

.story-hero h3,
.story-hero p,
.story-copy h4,
.story-copy p,
.story-finale h4,
.story-finale p {
  margin: 0;
}

.story-hero h3 {
  max-width: 12ch;
  margin-top: 0.75rem;
  font-size: clamp(2rem, 7vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.story-hero p,
.story-copy p,
.story-finale p {
  max-width: 38rem;
  margin-top: 0.75rem;
  color: var(--aeris-text-2);
  line-height: 1.65;
}

.story-chapter {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(14rem, 1.1fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
}

.story-window {
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-xl);
  background: var(--aeris-surface);
}

.story-dashboard {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}

.story-metric,
.story-stat {
  min-width: 0;
  padding: 1rem;
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.story-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: clamp(1.25rem, 5vw, 3.5rem);
}

@media (max-width: 42rem) {
  .story-chapter {
    grid-template-columns: 1fr;
  }

  .story-stat-grid {
    grid-template-columns: 1fr;
  }
}
```

### Effects

Choose opacity, directional, or scale motion while keeping one consistent interaction model.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';

@Component({
  selector: 'app-animate-on-scroll-effects-demo',
  imports: [AerisAnimateOnScrollModule],
  templateUrl: './animate-on-scroll-effects.demo.html',
  styleUrl: './animate-on-scroll-effects.demo.scss'
})
export class AnimateOnScrollEffectsEffectsDemo {
}
```

#### HTML

```html
<div>
  <div class="effect-grid">
    <article class="effect-card" aerisAnimateOnScroll="fade" [once]="false">
      Fade
    </article>
    <article class="effect-card" aerisAnimateOnScroll="fade-down" [once]="false">
      Fade down
    </article>
    <article class="effect-card" aerisAnimateOnScroll="slide-start" [once]="false">
      Slide start
    </article>
    <article class="effect-card" aerisAnimateOnScroll="slide-end" [once]="false">
      Slide end
    </article>
    <article class="effect-card" aerisAnimateOnScroll="scale" [once]="false">
      Scale
    </article>
  </div>
</div>
```

#### CSS

```css
.effect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
  gap: 0.875rem;
}

.effect-card {
  min-width: 0;
  padding: 1.25rem 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
  text-align: center;
  font-weight: 700;
}
```

### Enter and leave

Set once to false to replay the effect and respond to both intersection changes.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisAnimateOnScrollModule, type AerisAnimateOnScrollEvent } from '@aeris-ui/core/animate-on-scroll';

@Component({
  selector: 'app-animate-on-scroll-replay-demo',
  imports: [AerisAnimateOnScrollModule],
  templateUrl: './animate-on-scroll-replay.demo.html',
  styleUrl: './animate-on-scroll-replay.demo.scss'
})
export class AnimateOnScrollReplayEnterAndLeaveDemo {
  protected readonly replayStatus = signal('Scroll the panel to reveal the card.');

  protected onEntered(event: AerisAnimateOnScrollEvent): void {
    this.replayStatus.set(`Entered: ${event.element.textContent?.trim() ?? 'card'}`);
  }

  protected onLeft(): void {
    this.replayStatus.set('The card left the visible area.');
  }
}
```

#### HTML

```html
<div>
  <div class="replay-demo">
    <div
      class="replay-viewport"
      tabindex="0"
      aria-label="Scrollable animation example"
    >
      <div class="replay-spacer">Scroll down</div>
      <article
        class="replay-card"
        aerisAnimateOnScroll="scale"
        [once]="false"
        [threshold]="0.6"
        (entered)="onEntered($event)"
        (left)="onLeft()"
      >
        Replay-ready card
      </article>
    </div>
    <p class="replay-status" aria-live="polite">{{ replayStatus() }}</p>
  </div>
</div>
```

#### CSS

```css
.replay-demo {
  display: grid;
  gap: 0.75rem;
}

.replay-viewport {
  height: 15rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface-2);
}

.replay-spacer {
  min-height: 18rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  color: var(--aeris-text-2);
}

.replay-card {
  margin: 0 1rem 8rem;
  padding: 1.25rem;
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-primary-soft);
  color: var(--aeris-primary-text);
  font-weight: 700;
  text-align: center;
}

.replay-status {
  margin: 0;
  color: var(--aeris-text-2);
}
```

### Timing

Combine duration and delay to create a small, readable stagger without scheduling application work.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';

@Component({
  selector: 'app-animate-on-scroll-timing-demo',
  imports: [AerisAnimateOnScrollModule],
  template: `
    <div>
      <div class="stagger-grid">
        <article aerisAnimateOnScroll [once]="false" [duration]="600">
          <strong>Discover</strong><span>0 ms delay</span>
        </article>
        <article aerisAnimateOnScroll [once]="false" [duration]="600" [delay]="120">
          <strong>Compose</strong><span>120 ms delay</span>
        </article>
        <article aerisAnimateOnScroll [once]="false" [duration]="600" [delay]="240">
          <strong>Ship</strong><span>240 ms delay</span>
        </article>
      </div>
    </div>
  `,
  styles: `
    .stagger-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.875rem;
    }
    
    .stagger-grid article {
      min-width: 0;
      padding: 1rem;
      border: 1px solid var(--aeris-border);
      border-radius: var(--aeris-radius-lg);
      background: var(--aeris-surface-2);
    }
    
    .stagger-grid strong,
    .stagger-grid span {
      display: block;
    }
    
    .stagger-grid span {
      margin-top: 0.25rem;
      color: var(--aeris-text-2);
    }
    
    @media (max-width: 36rem) {
      .stagger-grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class AnimateOnScrollTimingTimingDemo {
}
```

### Token customization

Scope motion distance and scale tokens on an individual host without changing global behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';

@Component({
  selector: 'app-animate-on-scroll-custom-demo',
  imports: [AerisAnimateOnScrollModule],
  template: `
    <div>
      <article
        class="custom-reveal"
        aerisAnimateOnScroll="scale"
        [once]="false"
        [duration]="700"
      >
        A deeper scale and a branded surface make this reveal distinct.
      </article>
    </div>
  `,
  styles: `
    .custom-reveal {
      --aeris-animate-on-scroll-distance: 3rem;
      --aeris-animate-on-scroll-scale: 0.88;
      padding: 1.5rem;
      border-radius: var(--aeris-radius-xl);
      background: linear-gradient(135deg, var(--aeris-primary-soft), var(--aeris-surface));
    }
  `
})
export class AnimateOnScrollCustomTokenCustomizationDemo {
}
```

### Disabled

Disable observation when content should render immediately, such as in print or application-specific reduced experiences.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisAnimateOnScrollModule } from '@aeris-ui/core/animate-on-scroll';

@Component({
  selector: 'app-animate-on-scroll-disabled-demo',
  imports: [AerisAnimateOnScrollModule],
  template: `
    <div>
      <div aerisAnimateOnScroll disabled>
        This content is visible immediately and is never observed.
      </div>
    </div>
  `
})
export class AnimateOnScrollDisabledDisabledDemo {
}
```

## Accessibility

- The directive adds no role, label, or interaction semantics; the host keeps its native meaning.
- Content remains in DOM and reading order while visually waiting to enter.
- When reduced motion is requested, content appears immediately without transition or transform.
- Do not animate essential error messages or the only route to a task; motion should add emphasis, not gate access.
- Directional effects follow logical start and end in RTL layouts.
- Interactive descendants retain their native keyboard behavior and visible Aeris focus treatment.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves through projected interactive elements using their native order; the directive itself is not focusable. |
| `Arrow keys` | Scroll a focused native scroll container, as demonstrated by the replay example. |
