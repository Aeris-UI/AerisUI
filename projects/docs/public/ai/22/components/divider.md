# Divider

> Semantic separator for grouping content with horizontal, vertical, labelled, and decorative layouts.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/divider`
- Human-readable documentation: [https://aeris-ui.dev/components/divider](https://aeris-ui.dev/components/divider)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisDivider } from '@aeris-ui/core/divider';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `AerisDividerOrientation` | `'horizontal'` | Sets horizontal or vertical separator layout. |
| `align` | `AerisDividerAlign` | `'center'` | Places projected content near the start, center, or end of the separator. |
| `lineStyle` | `AerisDividerLineStyle` | `'solid'` | Sets the separator line to solid, dashed, or dotted. |
| `spacing` | `AerisDividerSpacing` | `'md'` | Controls outer spacing around the divider. |
| `decorative` | `boolean` | `false` | Removes separator semantics and hides the divider from assistive technology. |
| `ariaLabel` | `string` | `''` | Accessible name for a meaningful separator without visible naming text. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that names a meaningful separator. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Optional text, icon, or small label rendered between the separator lines. |

## Interfaces and types

### Interfaces

```ts
type AerisDividerOrientation = 'horizontal' | 'vertical';
type AerisDividerAlign = 'start' | 'center' | 'end';
type AerisDividerLineStyle = 'solid' | 'dashed' | 'dotted';
type AerisDividerSpacing = 'none' | 'sm' | 'md' | 'lg';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-divider-border` | `CSS custom property` | — | Separator line color. |
| `--aeris-divider-color` | `CSS custom property` | — | Base content color. |
| `--aeris-divider-content-color` | `CSS custom property` | — | Projected content color. |
| `--aeris-divider-content-font-size` | `CSS custom property` | — | Projected content font size. |
| `--aeris-divider-content-font-weight` | `CSS custom property` | — | Projected content font weight. |
| `--aeris-divider-content-gap` | `CSS custom property` | — | Space between content and lines. |
| `--aeris-divider-content-inline-gap` | `CSS custom property` | — | Space inside projected inline content. |
| `--aeris-divider-line-size` | `CSS custom property` | — | Separator line thickness. |
| `--aeris-divider-spacing` | `CSS custom property` | — | Outer spacing set by the spacing input. |
| `--aeris-divider-mobile-spacing` | `CSS custom property` | — | Horizontal spacing on narrow viewports. |
| `--aeris-divider-min-block-size` | `CSS custom property` | — | Minimum vertical divider height. |

## Examples

### Basic

Use Divider as a semantic separator between related sections.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-basic-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <p>Account details</p>
      <aeris-divider ariaLabel="Account and notification sections" />
      <p>Notification preferences</p>
    </div>
  `
})
export class DividerBasicBasicDemo {
}
```

### Content

Project a short label when the divider communicates a transition or alternative.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-content-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <p>Sign in with email</p>
      <aeris-divider ariaLabel="Alternative sign in option">or</aeris-divider>
      <p>Use single sign-on</p>
    </div>
  `
})
export class DividerContentContentDemo {
}
```

### Alignment

Place labelled content near the start, center, or end while retaining the same separator semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-alignment-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <aeris-divider align="start" ariaLabel="Start aligned metadata"
        >Metadata</aeris-divider
      >
      <aeris-divider align="center" ariaLabel="Centered metadata">Metadata</aeris-divider>
      <aeris-divider align="end" ariaLabel="End aligned metadata">Metadata</aeris-divider>
    </div>
  `
})
export class DividerAlignmentAlignmentDemo {
}
```

### Vertical

Use vertical orientation inside horizontal layouts where two regions need a visible boundary.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-vertical-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <div class="vertical-layout">
        <section class="vertical-panel" aria-label="Draft">
          <p>Draft</p>
        </section>
        <aeris-divider orientation="vertical" ariaLabel="Draft and published boundary"
          >to</aeris-divider
        >
        <section class="vertical-panel" aria-label="Published">
          <p>Published</p>
        </section>
      </div>
    </div>
  `,
  styles: `
    .vertical-layout {
      min-height: 7rem;
      display: flex;
      align-items: stretch;
      gap: 1rem;
    }
    
    .vertical-panel {
      min-width: 0;
      flex: 1;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: var(--aeris-radius-lg);
      background: var(--surface);
    }
  `
})
export class DividerVerticalVerticalDemo {
}
```

### Line style

Choose solid, dashed, or dotted line styles without changing layout.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-line-style-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <div class="line-style-stack">
        <aeris-divider lineStyle="solid" ariaLabel="Solid separator">Solid</aeris-divider>
        <aeris-divider lineStyle="dashed" ariaLabel="Dashed separator"
          >Dashed</aeris-divider
        >
        <aeris-divider lineStyle="dotted" ariaLabel="Dotted separator"
          >Dotted</aeris-divider
        >
      </div>
    </div>
  `,
  styles: `
    .line-style-stack {
      display: grid;
      gap: 1rem;
    }
  `
})
export class DividerLineStyleLineStyleDemo {
}
```

### Decorative

Hide purely visual dividers from assistive technology when surrounding structure already communicates the grouping.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-decorative-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <section class="decorative-section" aria-labelledby="decorative-section-title">
        <h3 id="decorative-section-title">Profile</h3>
        <aeris-divider decorative />
        <p>Decorative dividers should not be announced as separators.</p>
      </section>
    </div>
  `,
  styles: `
    .decorative-section {
      display: grid;
      gap: 0.75rem;
    }
  `
})
export class DividerDecorativeDecorativeDemo {
}
```

### Token customization

Customize line color, thickness, label color, and spacing with scoped design tokens.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisDivider } from '@aeris-ui/core/divider';

@Component({
  selector: 'app-divider-custom-demo',
  imports: [AerisDivider],
  template: `
    <div>
      <aeris-divider
        class="brand-divider"
        lineStyle="dashed"
        ariaLabel="Branded separator"
        >Release gate</aeris-divider
      >
    </div>
  `,
  styles: `
    .brand-divider {
      --aeris-divider-border: color-mix(
        in srgb,
        var(--aeris-primary) 54%,
        var(--aeris-border)
      );
      --aeris-divider-color: var(--aeris-primary-text);
      --aeris-divider-content-font-size: 0.75rem;
      --aeris-divider-content-gap: 1rem;
      --aeris-divider-line-size: 2px;
    }
  `
})
export class DividerCustomTokenCustomizationDemo {
}
```

## Accessibility

- Divider renders role="separator" by default and sets aria-orientation from the orientation input.
- Use ariaLabel or ariaLabelledBy when the separator communicates a meaningful boundary.
- Set decorative for purely visual separators so they are hidden from assistive technology.
- Projected divider content should be brief and non-interactive. Use native buttons or links outside the divider for actions.
- Divider does not animate and does not add focusable elements.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | Divider is non-interactive and is not included in the tab order. Keyboard behavior belongs to native interactive elements around it. |
