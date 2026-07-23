# Button

> Trigger actions with clear hierarchy, sizes, loading states, and icon support.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/button`
- Human-readable documentation: [https://aeris-ui.dev/components/button](https://aeris-ui.dev/components/button)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisButton } from '@aeris-ui/core/button';
```

## API

### Directive Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `AerisButtonVariant` | `'primary'` | Visual treatment of the button. |
| `severity` | `AerisButtonSeverity` | `'primary'` | Semantic color applied to the selected variant. |
| `size` | `AerisButtonSize` | `'md'` | Control height and typography size. |
| `iconPosition` | `AerisButtonIconPosition` | `'left'` | Sets icon layout direction. Native projected content follows DOM order; wrapper icon templates are positioned automatically. |
| `loading` | `boolean` | `false` | Displays progress and exposes aria-busy. |
| `showSpinner` | `boolean` | `true` | Controls the built-in loading spinner. |
| `iconOnly` | `boolean` | `false` | Creates a square icon button. Requires an accessible name. |
| `raised` | `boolean` | `false` | Adds elevation. |
| `rounded` | `boolean` | `false` | Uses a pill-shaped radius. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |
| `plain` | `boolean` | `false` | Overrides semantic colors with a neutral treatment. |
| `text` | `boolean` | `false` | Compatibility alias for variant='ghost'. |
| `outlined` | `boolean` | `false` | Compatibility alias for variant='outline'. |
| `link` | `boolean` | `false` | Compatibility alias for variant='link'. |

### Button emitters

| Name | Type | Description |
| --- | --- | --- |
| clicked | MouseEvent | Emits when the wrapper's native button is activated. |
| focused | FocusEvent | Emits when the internal button receives focus. |
| blurred | FocusEvent | Emits when the internal button loses focus. |

### Button templates

| Name | Context | Description |
| --- | --- | --- |
| contentTemplate | AerisButtonContentTemplateContext | Replaces label, icon, badge, and projected content. |
| iconTemplate | AerisButtonIconTemplateContext | Renders the idle icon. |
| loadingIconTemplate | AerisButtonIconTemplateContext | Replaces the default loading spinner. |

## Interfaces and types

### Interfaces

```ts
type AerisButtonVariant =
  | 'primary' | 'secondary' | 'outline'
  | 'ghost' | 'danger' | 'link';

type AerisButtonSeverity =
  | 'primary' | 'secondary' | 'success' | 'info'
  | 'warning' | 'danger' | 'contrast';

type AerisButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

interface AerisButtonIconTemplateContext {
  readonly loading: boolean;
}

interface AerisButtonContentTemplateContext {
  readonly loading: boolean;
  readonly disabled: boolean;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-primary` | `CSS custom property` | — | Primary button background. |
| `--aeris-primary-boundary` | `CSS custom property` | — | Solid and outline button boundary, independently configurable for inverse treatments. |
| `--aeris-primary-hover` | `CSS custom property` | — | Primary hover background, derived from the primary base. |
| `--aeris-primary-active` | `CSS custom property` | — | Primary pressed background. |
| `--aeris-on-primary` | `CSS custom property` | — | Contrasting foreground on the primary base. |
| `--aeris-on-primary-hover` | `CSS custom property` | — | Contrasting foreground on the primary hover background. |
| `--aeris-primary-text` | `CSS custom property` | — | Readable primary-colored text for outline, ghost, and link variants. |
| `--aeris-primary-soft` | `CSS custom property` | — | Low-emphasis primary background used by ghost hover states. |
| `--aeris-on-primary-soft` | `CSS custom property` | — | Readable foreground on the primary soft background. |
| `--aeris-success-* / --aeris-info-* / ...` | `CSS custom property` | — | The same state roles are available for secondary, success, info, warning, danger, and contrast. |
| `--aeris-control-height` | `CSS custom property` | — | Medium control height and density anchor. |
| `--aeris-radius-sm` | `CSS custom property` | — | Default button radius. |
| `--aeris-focus` | `CSS custom property` | — | Visible focus indicator. |

## Examples

### Basic

Use aerisButton on native buttons and anchors.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-basic-demo',
  imports: [AerisButton],
  template: `
    <div class="aeris-example-row">
      <button aerisButton>Save changes</button
      ><button aerisButton variant="secondary">Cancel</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureBasicBasicDemo {
}
```

### Wrapper component

Use the wrapper when inputs and emitted events are more convenient than projected native content.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-wrapper-demo',
  imports: [AerisButton],
  template: `
    <div class="aeris-example-row">
      <aeris-button label="Create project" (clicked)="createProject($event)" /><span
        class="result"
        >Clicked {{ clickCount() }} times</span
      >
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
    
    .result {
      align-self: center;
      color: var(--aeris-text-3);
      font-size: 0.8125rem;
    }
  `
})
export class FeatureWrapperWrapperComponentDemo {
  protected readonly clickCount = signal(0);

  protected createProject(event: MouseEvent): void {
    this.clickCount.update((count) => count + 1);
    // Create the project here.
  }
}
```

### Variants

Choose the visual treatment independently from semantic severity.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-variants-demo',
  imports: [AerisButton],
  template: `
    <div class="wrap aeris-example-row">
      <button aerisButton>Primary</button
      ><button aerisButton variant="secondary">Secondary</button
      ><button aerisButton variant="outline">Outline</button
      ><button aerisButton variant="ghost">Ghost</button
      ><button aerisButton variant="danger">Danger</button
      ><button aerisButton variant="link">Link</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureVariantsVariantsDemo {
}
```

### Severity

Each semantic tone supplies its own base, hover, active, and accessible foreground colors across filled, outline, and ghost variants.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-severity-demo',
  imports: [AerisButton],
  template: `
    <div class="wrap aeris-example-row">
      @for (severity of severities; track severity) {
        <button aerisButton [severity]="severity">{{ severity }}</button>
      }
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureSeveritySeverityDemo {
}
```

### Sizes

Four sizes share the active density scale.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-sizes-demo',
  imports: [AerisButton],
  template: `
    <div class="wrap align aeris-example-row">
      <button aerisButton size="xs">Extra small</button
      ><button aerisButton size="sm">Small</button><button aerisButton>Medium</button
      ><button aerisButton size="lg">Large</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    .align {
      align-items: center;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureSizesSizesDemo {
}
```

### Icons and positions

Project icons as normal button content and control whether the icon appears before, after, or without visible text.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { LucideChevronRight, LucideDynamicIcon, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-feature-icons-demo',
  imports: [AerisButton, LucideDynamicIcon],
  template: `
    <div class="wrap align aeris-example-row">
      <button aerisButton><svg [lucideIcon]="icons.Plus"></svg>Add item</button>
      <button aerisButton iconPosition="right">
        Continue<svg [lucideIcon]="icons.ChevronRight"></svg>
      </button>
      <button aerisButton iconOnly aria-label="Add item">
        <svg [lucideIcon]="icons.Plus"></svg>
      </button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    .align {
      align-items: center;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureIconsIconsAndPositionsDemo {

  protected readonly icons = { ChevronRight: LucideChevronRight, Plus: LucidePlus };
}
```

### Loading

Loading exposes aria-busy and the wrapper prevents repeated activation.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-loading-demo',
  imports: [AerisButton],
  template: `
    <div class="wrap aeris-example-row">
      <button
        aerisButton
        variant="secondary"
        [loading]="loading()"
        [disabled]="loading()"
        (click)="toggleLoading()"
      >
        Save asynchronously</button
      ><aeris-button label="Processing" loading />
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureLoadingLoadingDemo {
  protected readonly saving = signal(false);

  protected save(): void {
    this.saving.set(true);

    this.projectService.save().subscribe({
      complete: () => this.saving.set(false),
      error: () => this.saving.set(false),
    });
  }
}
```

### Raised, rounded, and fluid

Shape and layout modifiers compose with variants and severity.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-shape-demo',
  imports: [AerisButton],
  template: `
    <div class="stack aeris-example-row">
      <div class="wrap">
        <button aerisButton raised>Raised</button
        ><button aerisButton rounded>Rounded</button
        ><button aerisButton rounded iconOnly aria-label="Favorite">★</button>
      </div>
      <button aerisButton fluid>Full width</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    .stack {
      width: 100%;
      display: grid;
      gap: 0.75rem;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureShapeRaisedRoundedAndFluidDemo {
}
```

### Badge

The wrapper supports compact status and count badges.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-badge-demo',
  imports: [AerisButton],
  template: `
    <div class="wrap aeris-example-row">
      <aeris-button label="Messages" badge="8" /><aeris-button
        label="Tasks"
        badge="3"
        badgeSeverity="success"
        variant="secondary"
      />
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureBadgeBadgeDemo {
}
```

### Custom templates

Typed TemplateRef inputs customize content, idle icons, and loading indicators.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-templates-demo',
  imports: [AerisButton],
  template: `
    <div class="aeris-example-row">
      <ng-template #rocket let-loading="loading"
        ><span aria-hidden="true">{{ loading ? '…' : '↑' }}</span></ng-template
      >
      <aeris-button label="Deploy" [iconTemplate]="rocket" iconPosition="right" />
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureTemplatesCustomTemplatesDemo {
}
```

### Native links

The directive also styles anchors while preserving native navigation semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-links-demo',
  imports: [AerisButton],
  template: `
    <div class="aeris-example-row">
      <a
        aerisButton
        variant="outline"
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        >Open GitHub</a
      >
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
    }
    
    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureLinksNativeLinksDemo {
}
```

## Accessibility

- Native buttons activate with Enter and Space; anchors preserve link keyboard behavior.
- Icon-only buttons require aria-label or equivalent visible text.
- Loading sets aria-busy="true". The wrapper disables repeated activation while loading.
- Focus indicators meet WCAG 2.2 focus appearance expectations and remain visible in dark mode.
- Use type="button" for non-submit actions inside forms.
- Do not communicate meaning through severity color alone.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to the next or previous enabled button or link. |
| `Enter` | Activates a focused button or link. |
| `Space` | Activates a focused native button. Links retain native link behavior. |
