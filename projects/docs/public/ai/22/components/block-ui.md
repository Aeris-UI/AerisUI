# BlockUI

> Temporarily block a content region or the full viewport with a dark interaction-blocking layer.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/block-ui`
- Human-readable documentation: [https://aeris-ui.dev/components/block-ui](https://aeris-ui.dev/components/block-ui)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisBlockUIModule } from '@aeris-ui/core/block-ui';
```

## API

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `blocked` | `boolean` | `false` | Two-way state controlling whether the blocking layer is visible. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `fullScreen` | `boolean` | `false` | Blocks the full viewport instead of only the projected element. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur to the blocking layer. |
| `backdropBlurAmount` | `string` | `''` | Overrides the blocking layer blur radius with a CSS length. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `blockedChange` | `boolean` | `-` | Implicit model output emitted whenever blocked changes. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | The element content covered and made inert while blocked. |

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-block-ui-backdrop` | `CSS custom property` | — | Dark blocking-layer color. |
| `--aeris-block-ui-backdrop-blur` | `CSS custom property` | — | Blocking-layer blur radius. |
| `--aeris-backdrop-blur` | `CSS custom property` | — | Shared backdrop blur radius. |
| `--aeris-block-ui-z-index` | `CSS custom property` | — | Element overlay stacking level. |
| `--aeris-block-ui-fullscreen-z-index` | `CSS custom property` | — | Fullscreen overlay stacking level. |
| `--aeris-block-ui-duration` | `CSS custom property` | — | Blocking-layer entrance duration. |

## Examples

### Element

Project an element into BlockUI and control the dark blocking layer with the blocked model.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisBlockUIModule } from '@aeris-ui/core/block-ui';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-block-ui-element-demo',
  imports: [AerisBlockUIModule, AerisButton],
  templateUrl: './block-ui-element.demo.html',
  styleUrl: './block-ui-element.demo.scss'
})
export class BlockUiElementElementDemo {
  protected readonly elementBlocked = signal(false);
}
```

#### HTML

```html
<div>
  <div class="block-ui-actions">
    <button aerisButton type="button" (click)="elementBlocked.set(true)">
      Block
    </button>
    <button
      aerisButton
      variant="secondary"
      type="button"
      (click)="elementBlocked.set(false)"
    >
      Unblock
    </button>
  </div>
  <aeris-block-ui [(blocked)]="elementBlocked">
    <section class="block-ui-panel">
      <h4>Account overview</h4>
      <p>
        Profile information and recent activity are unavailable while this element is
        blocked.
      </p>
    </section>
  </aeris-block-ui>
</div>
```

#### CSS

```css
.block-ui-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.block-ui-panel {
  min-height: 12rem;
  padding: 1.25rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
  background: var(--aeris-surface);
}

.block-ui-panel h4 {
  margin: 0 0 0.5rem;
}

.block-ui-panel p {
  margin: 0;
  color: var(--aeris-text-2);
  line-height: 1.65;
}
```

### Full screen

Set fullScreen to cover the viewport. This example unblocks automatically after two seconds.

#### TS

```ts
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AerisBlockUIModule } from '@aeris-ui/core/block-ui';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-block-ui-screen-demo',
  imports: [AerisBlockUIModule, AerisButton],
  template: `
    <div>
      <button aerisButton type="button" (click)="blockScreen()">Block screen</button>
      <aeris-block-ui fullScreen [(blocked)]="screenBlocked" />
    </div>
  `
})
export class BlockUiScreenFullScreenDemo {
  private readonly destroyRef = inject(DestroyRef);
  private screenTimer: ReturnType<typeof setTimeout> | undefined;
  protected readonly screenBlocked = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.screenTimer) globalThis.clearTimeout(this.screenTimer);
    });
  }

  protected blockScreen(): void {
    this.screenBlocked.set(true);
    if (this.screenTimer) globalThis.clearTimeout(this.screenTimer);
    this.screenTimer = globalThis.setTimeout(
      () => this.screenBlocked.set(false),
      2000,
    );
  }
}
```

## Accessibility

- The host and projected content expose aria-busy while blocked.
- Projected content receives native inert, preventing pointer, keyboard, and assistive-technology interaction.
- If focus is inside an element when it becomes blocked, it moves to the blocking layer and returns after unblocking.
- Fullscreen mode contains keyboard focus and locks scrolling with scrollbar compensation.
- The blocking layer is decorative and hidden from assistive technology.
- The entrance animation is removed when reduced motion is requested.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Blocked content is skipped. Fullscreen blocking keeps focus on the blocking layer. |
| `Enter / Space` | No BlockUI action. State is controlled by the application. |
| `Escape` | No built-in action. The application controls when blocking ends. |
