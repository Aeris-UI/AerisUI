# Badge

> Compact status, count, and overlay indicator with severity, size, shape, and accessible semantics.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/badge`
- Human-readable documentation: [https://aeris-ui.dev/components/badge](https://aeris-ui.dev/components/badge)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisBadgeModule } from '@aeris-ui/core/badge';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string &#124; number &#124; null &#124; undefined` | `undefined` | Text or number rendered inside the badge. Projected content is used when no value is provided. |
| `severity` | `AerisBadgeSeverity` | `'primary'` | Sets the semantic color accent. |
| `size` | `AerisBadgeSize` | `'md'` | Controls badge height, padding, and font size. |
| `variant` | `AerisBadgeVariant` | `'solid'` | Sets solid, soft, or outline visual treatment. |
| `shape` | `AerisBadgeShape` | `'pill'` | Sets pill or rounded rectangle corners. |
| `max` | `number &#124; null` | `null` | Caps numeric values and appends a plus sign when the value is larger. |
| `dot` | `boolean` | `false` | Renders a compact status dot with no visible text. |
| `showZero` | `boolean` | `true` | Controls whether numeric zero is rendered. |
| `hidden` | `boolean` | `false` | Hides the badge visually and from assistive technology. |
| `decorative` | `boolean` | `false` | Marks a purely visual badge as hidden from assistive technology. |
| `role` | `AerisBadgeRole` | `''` | Optional ARIA role for standalone status or note badges. |
| `ariaLabel` | `string` | `''` | Accessible name for a meaningful badge that does not have enough visible text. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that names the badge. |

### Overlay Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string &#124; number &#124; null &#124; undefined` | `undefined` | Text or number rendered in the visual overlay badge. |
| `severity` | `AerisBadgeSeverity` | `'primary'` | Sets the overlay badge color accent. |
| `size` | `AerisBadgeSize` | `'md'` | Controls overlay badge size. |
| `variant` | `AerisBadgeVariant` | `'solid'` | Sets solid, soft, or outline treatment. |
| `shape` | `AerisBadgeShape` | `'pill'` | Sets pill or rounded overlay corners. |
| `max` | `number &#124; null` | `null` | Caps numeric overlay values and appends a plus sign. |
| `dot` | `boolean` | `false` | Renders the overlay as a compact status dot. |
| `showZero` | `boolean` | `true` | Controls whether zero is rendered in the overlay. |
| `hidden` | `boolean` | `false` | Hides the overlay badge. |
| `position` | `AerisBadgeOverlayPosition` | `'top-right'` | Places the overlay badge on one corner of the projected content. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default badge content` | `content projection` | `-` | Text or inline content rendered inside Badge when value is not provided. |
| `default overlay content` | `content projection` | `-` | Button, icon, avatar, or other content that receives a visual badge overlay. |

## Interfaces and types

### Interfaces

```ts
type AerisBadgeSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

type AerisBadgeSize = 'sm' | 'md' | 'lg';
type AerisBadgeVariant = 'solid' | 'soft' | 'outline';
type AerisBadgeShape = 'pill' | 'rounded';
type AerisBadgeRole = 'status' | 'note' | '';
type AerisBadgeOverlayPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-badge-size` | `CSS custom property` | — | Default badge height and minimum width. |
| `--aeris-badge-padding-inline` | `CSS custom property` | — | Default horizontal padding. |
| `--aeris-badge-font-size` | `CSS custom property` | — | Default badge font size. |
| `--aeris-badge-font-weight` | `CSS custom property` | — | Badge text weight. |
| `--aeris-badge-radius` | `CSS custom property` | — | Rounded shape corner radius. |
| `--aeris-badge-shadow` | `CSS custom property` | — | Solid badge shadow. |
| `--aeris-badge-dot-size` | `CSS custom property` | — | Default dot badge size. |
| `--aeris-badge-overlay-ring-size` | `CSS custom property` | — | Surface ring around overlay badges. |
| `--aeris-primary` | `CSS custom property` | — | Primary badge accent. |
| `--aeris-success` | `CSS custom property` | — | Success badge accent. |
| `--aeris-info` | `CSS custom property` | — | Info badge accent. |
| `--aeris-warning` | `CSS custom property` | — | Warning badge accent. |
| `--aeris-on-warning` | `CSS custom property` | — | Text on a solid warning badge. |
| `--aeris-danger` | `CSS custom property` | — | Danger badge accent. |
| `--aeris-surface` | `CSS custom property` | — | Neutral foreground, soft badge mix, and overlay ring surface. |
| `--aeris-text` | `CSS custom property` | — | Contrast badge accent. |
| `--aeris-text-3` | `CSS custom property` | — | Neutral badge accent. |

## Examples

### Basic

Use Badge for short labels and numeric counts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';

@Component({
  selector: 'app-badge-basic-demo',
  imports: [AerisBadgeModule],
  template: `
    <div>
      <aeris-badge value="New" />
    </div>
  `
})
export class BadgeBasicBasicDemo {
}
```

### Severity

Choose a severity color that matches the state being communicated.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';

@Component({
  selector: 'app-badge-severity-demo',
  imports: [AerisBadgeModule],
  template: `
    <div>
      <div class="badge-row">
        <aeris-badge value="Primary" />
        <aeris-badge value="Secondary" severity="secondary" />
        <aeris-badge value="Success" severity="success" />
        <aeris-badge value="Info" severity="info" />
        <aeris-badge value="Warning" severity="warning" />
        <aeris-badge value="Danger" severity="danger" />
        <aeris-badge value="Neutral" severity="neutral" />
        <aeris-badge value="Contrast" severity="contrast" />
      </div>
    </div>
  `,
  styles: `
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class BadgeSeveritySeverityDemo {
}
```

### Sizes and shapes

Use sizes and shapes to match nearby typography and control density.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';

@Component({
  selector: 'app-badge-sizes-demo',
  imports: [AerisBadgeModule],
  template: `
    <div>
      <div class="badge-row">
        <aeris-badge value="Small" size="sm" />
        <aeris-badge value="Medium" />
        <aeris-badge value="Large" size="lg" />
        <aeris-badge value="Rounded" shape="rounded" />
        <aeris-badge value="Soft" variant="soft" severity="info" />
        <aeris-badge value="Outline" variant="outline" severity="success" />
      </div>
    </div>
  `,
  styles: `
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class BadgeSizesSizesAndShapesDemo {
}
```

### Dot

Use dot badges for compact presence and status indicators. Provide an accessible name when the dot carries meaning.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';

@Component({
  selector: 'app-badge-dot-demo',
  imports: [AerisBadgeModule],
  templateUrl: './badge-dot.demo.html',
  styleUrl: './badge-dot.demo.scss'
})
export class BadgeDotDotDemo {
}
```

#### HTML

```html
<div>
  <div class="badge-status-grid">
    <span class="badge-status-item"
      ><aeris-badge dot severity="success" role="status" ariaLabel="Online" />
      Online</span
    >
    <span class="badge-status-item"
      ><aeris-badge dot severity="warning" role="status" ariaLabel="Away" />
      Away</span
    >
    <span class="badge-status-item"
      ><aeris-badge dot severity="danger" role="status" ariaLabel="Offline" />
      Offline</span
    >
  </div>
</div>
```

#### CSS

```css
.badge-status-grid {
  display: grid;
  gap: 0.75rem;
}

.badge-status-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
```

### Dynamic value

Bind numeric values, cap large counts, and hide zero when the absence of a badge is clearer.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-badge-dynamic-demo',
  imports: [AerisBadgeModule, AerisButton],
  templateUrl: './badge-dynamic.demo.html',
  styleUrl: './badge-dynamic.demo.scss'
})
export class BadgeDynamicDynamicValueDemo {
  protected readonly unreadCount = signal(128);
  protected readonly unreadLabel = computed(
    () => `Inbox, ${this.unreadCount()} unread messages`,
  );

  protected addUnread(): void {
    this.unreadCount.update((count) => count + 1);
  }

  protected clearUnread(): void {
    this.unreadCount.set(0);
  }
}
```

#### HTML

```html
<div>
  <div class="badge-dynamic-demo">
    <div class="badge-actions">
      <button aerisButton type="button" (click)="addUnread()">Add unread</button>
      <button aerisButton variant="secondary" type="button" (click)="clearUnread()">
        Clear
      </button>
    </div>
    <aeris-badge
      [value]="unreadCount()"
      [max]="99"
      role="status"
      [ariaLabel]="unreadLabel()"
    />
    <aeris-badge [value]="0" [showZero]="false" decorative />
  </div>
</div>
```

#### CSS

```css
.badge-dynamic-demo {
  display: grid;
  gap: 0.75rem;
}

.badge-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

### Overlay

Wrap a button, avatar, or icon with BadgeOverlay when the badge should sit on the content corner.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisAvatarModule } from '@aeris-ui/core/avatar';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-badge-overlay-demo',
  imports: [AerisAvatarModule, AerisBadgeModule, AerisButton],
  templateUrl: './badge-overlay.demo.html',
  styleUrl: './badge-overlay.demo.scss'
})
export class BadgeOverlayOverlayDemo {
  protected readonly unreadCount = signal(128);
  protected readonly unreadLabel = computed(
    () => `Inbox, ${this.unreadCount()} unread messages`,
  );
}
```

#### HTML

```html
<div>
  <div class="badge-overlay-row">
    <aeris-badge-overlay [value]="unreadCount()" [max]="99">
      <button aerisButton type="button" [attr.aria-label]="unreadLabel()">
        Inbox
      </button>
    </aeris-badge-overlay>
    <aeris-badge-overlay dot severity="success" position="bottom-right">
      <aeris-avatar label="JD" ariaLabel="Jordan is online" />
    </aeris-badge-overlay>
    <aeris-badge-overlay
      value="Beta"
      severity="info"
      variant="soft"
      position="top-left"
    >
      <button aerisButton variant="secondary" type="button">Preview</button>
    </aeris-badge-overlay>
  </div>
</div>
```

#### CSS

```css
.badge-overlay-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}
```

### Token customization

Scope token overrides to one badge when a product label needs custom emphasis.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';

@Component({
  selector: 'app-badge-custom-demo',
  imports: [AerisBadgeModule],
  template: `
    <div>
      <aeris-badge class="brand-badge" value="Release" severity="primary" />
    </div>
  `,
  styles: `
    .brand-badge {
      --aeris-badge-size: 1.5rem;
      --aeris-badge-padding-inline: 0.7rem;
      --aeris-badge-font-size: 0.6875rem;
      --aeris-badge-font-weight: 900;
      --aeris-badge-shadow: 0 6px 16px color-mix(
        in srgb,
        var(--aeris-primary) 22%,
        transparent
      );
    }
  `
})
export class BadgeCustomTokenCustomizationDemo {
}
```

## Accessibility

- Badge is non-interactive and does not add itself to the tab order.
- Visible badge text is exposed to assistive technology unless decorative or hidden is set.
- Use ariaLabel, ariaLabelledBy, and an explicit role when a standalone badge communicates status that is not clear from visible text.
- Dot badges have no visible text. Mark them decorative when nearby text already communicates the state, or provide an accessible name when the dot itself carries meaning.
- BadgeOverlay badges are visual only. Include the count or state in the projected control label when it is meaningful.
- Badge does not animate. Reduced-motion preferences are still respected for overlay style transitions.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Badge is skipped. Focus moves to native interactive elements projected inside BadgeOverlay, such as buttons or links. |
| `Enter / Space` | No badge behavior. Activates the focused projected native control when one is present. |
| `Escape` | No built-in behavior because Badge does not open, close, or capture focus. |
