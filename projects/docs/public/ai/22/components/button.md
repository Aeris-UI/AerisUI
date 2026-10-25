# Button

> Trigger actions or opt into accessible toggles, with sizes, loading states, and icon support.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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

### Toggle Api

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisButtonToggle` | `directive` | `not applied` | Opt-in behavior on button[aerisButton] only. Sets type=button. Not supported on anchors or aeris-button wrappers; do not combine with aerisButtonGroupItem. |
| `checked` | `model&lt;boolean&gt;` | `false` | Controlled pressed state; Signal Forms discovers this model automatically. |
| `disabled` | `boolean` | `false` | Disables activation; also respects Button loading and forms-disabled state. |
| `invalid` | `boolean` | `false` | Invalid presentation, gated by touched when supplied. |
| `touched` | `boolean &#124; null` | `null` | false delays invalid presentation; true shows errors; null preserves explicit invalid behavior. |
| `checkedChange` | `output&lt;boolean&gt;` | `—` | Emits when the checked model changes. |
| `touch` | `output&lt;void&gt;` | `—` | Emits on blur; Signal Forms uses it to mark the field touched. |

### Directive Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `AerisButtonVariant` | `'solid'` | Presentation treatment independent of color. Options: 'solid', 'outline', 'ghost', 'link'. |
| `severity` | `AerisButtonSeverity` | `'primary'` | Semantic color applied to the selected variant. Options: 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral', 'contrast'. |
| `size` | `AerisButtonSize` | `'md'` | Control height and typography size. Options: 'xs', 'sm', 'md', 'lg'. |
| `iconPosition` | `AerisButtonIconPosition` | `'left'` | Sets icon layout direction. Native projected content follows DOM order; wrapper icon templates are positioned automatically. Options: 'left', 'right', 'top', 'bottom'. |
| `loading` | `boolean` | `false` | Displays progress and exposes aria-busy. |
| `disabled` | `boolean` | `false` | Disables native button activation or marks an anchor as unavailable. |
| `showSpinner` | `boolean` | `true` | Controls the built-in loading spinner. |
| `iconOnly` | `boolean` | `false` | Creates a square icon button. Requires an accessible name. |
| `raised` | `boolean` | `false` | Adds elevation. |
| `rounded` | `boolean` | `false` | Uses a pill-shaped radius. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |

### Component Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'button' &#124; 'submit' &#124; 'reset'` | `'button'` | Native button type. |
| `label` | `string` | `''` | Text rendered inside the button. |
| `badge` | `string &#124; undefined` | `undefined` | Optional badge value. |
| `badgeSeverity` | `AerisButtonSeverity` | `'secondary'` | Semantic badge color. Options: 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral', 'contrast'. |
| `ariaLabel` | `string &#124; undefined` | `undefined` | Accessible name, required for icon-only wrapper buttons. |
| `tabIndex` | `number &#124; undefined` | `undefined` | Native tabindex override. |
| `autofocus` | `boolean` | `false` | Requests focus when rendered. |
| `variant` | `AerisButtonVariant` | `'solid'` | Presentation treatment independent of color. Options: 'solid', 'outline', 'ghost', 'link'. |
| `severity` | `AerisButtonSeverity` | `'primary'` | Semantic color applied to the selected variant. Options: 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral', 'contrast'. |
| `size` | `AerisButtonSize` | `'md'` | Control height and typography size. Options: 'xs', 'sm', 'md', 'lg'. |
| `iconPosition` | `AerisButtonIconPosition` | `'left'` | Sets icon layout direction. Native projected content follows DOM order; wrapper icon templates are positioned automatically. Options: 'left', 'right', 'top', 'bottom'. |
| `loading` | `boolean` | `false` | Displays progress and exposes aria-busy. |
| `disabled` | `boolean` | `false` | Disables native button activation or marks an anchor as unavailable. |
| `showSpinner` | `boolean` | `true` | Controls the built-in loading spinner. |
| `iconOnly` | `boolean` | `false` | Creates a square icon button. Requires an accessible name. |
| `raised` | `boolean` | `false` | Adds elevation. |
| `rounded` | `boolean` | `false` | Uses a pill-shaped radius. |
| `fluid` | `boolean` | `false` | Fills the available inline width. |
| `contentTemplate` | `TemplateRef&lt;AerisButtonContentTemplateContext&gt;` | `undefined` | Replaces all default content and receives effective loading and disabled state. |
| `iconTemplate` | `TemplateRef&lt;AerisButtonIconTemplateContext&gt;` | `undefined` | Custom idle icon. |
| `loadingIconTemplate` | `TemplateRef&lt;AerisButtonIconTemplateContext&gt;` | `undefined` | Custom loading indicator. |

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
  | 'solid' | 'outline' | 'ghost' | 'link';

type AerisButtonSeverity =
  | 'primary' | 'secondary' | 'success' | 'info'
  | 'warning' | 'danger' | 'neutral' | 'contrast';

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
| `--aeris-button-selected-background` | `CSS custom property` | — | Selected toggle/group item background. |
| `--aeris-button-selected-color` | `CSS custom property` | — | Selected toggle/group item foreground. |
| `--aeris-button-selected-border` | `CSS custom property` | — | Selected toggle/group item boundary. |
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
| `--aeris-button-icon-size` | `CSS custom property` | — | Projected SVG, image, or marked custom icon size. |
| `--aeris-radius-control` | `CSS custom property` | — | Default button radius. |
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
      <button aerisButton>Save changes</button>
      <button aerisButton variant="solid" severity="secondary">Cancel</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
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
export class FeatureBasicDemo {
}
```

### Toggle state

Opt a native Aeris button into controlled pressed behavior. Keep its accessible label stable.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-toggle-demo',
  imports: [AerisButton],
  template: `
    <div class="aeris-example-row">
      <button aerisButton aerisButtonToggle variant="outline" [(checked)]="toggled">
        Bold
      </button>
      <button aerisButton aerisButtonToggle variant="outline" [checked]="true" disabled>
        Disabled toggle
      </button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
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
export class FeatureToggleDemo {
  protected readonly toggled = signal(false);
}
```

### Toggle forms

Signal Forms receives checked changes and touch events automatically using the normal AerisButton import.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { FormField, form } from '@angular/forms/signals';

@Component({
  selector: 'app-feature-toggle-forms-demo',
  imports: [AerisButton, FormField],
  template: `
    <div class="aeris-example-row">
      <button
        aerisButton
        aerisButtonToggle
        variant="outline"
        [formField]="toggleForm.enabled"
      >
        Enabled
      </button>
      <output>Checked: {{ toggleData().enabled }}</output>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
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
export class FeatureToggleFormsDemo {
  protected readonly toggleData = signal({ enabled: false });

  protected readonly toggleForm = form(this.toggleData);
}
```

### Reactive toggle

Use the optional AerisButtonForms import for classic forms. It includes Button and the toggle value accessor; no second Aeris import is needed.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisButtonForms } from '@aeris-ui/core/button/forms';

@Component({
  selector: 'app-feature-toggle-reactive-demo',
  imports: [AerisButtonForms, ReactiveFormsModule],
  template: `
    <div class="aeris-example-row">
      <button aerisButton aerisButtonToggle variant="outline" [formControl]="toggleControl">
        Enabled
      </button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
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
export class FeatureToggleReactiveDemo {
  protected readonly toggleControl = new FormControl(false, { nonNullable: true });
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
      <aeris-button label="Create project" (clicked)="createProject($event)" />
      <span class="result">Clicked {{ clickCount() }} times</span>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureWrapperDemo {
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
      <button aerisButton>Primary</button>
      <button aerisButton variant="solid" severity="secondary">Secondary</button>
      <button aerisButton variant="outline">Outline</button>
      <button aerisButton variant="ghost">Ghost</button>
      <button aerisButton variant="solid" severity="danger">Danger</button>
      <button aerisButton variant="link">Link</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureVariantsDemo {
}
```

### Severity

Each semantic tone supplies its own base, hover, active, and accessible foreground colors across filled, outline, and ghost variants.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton, type AerisButtonSeverity } from '@aeris-ui/core/button';

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
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureSeverityDemo {
  protected readonly severities: readonly AerisButtonSeverity[] = [
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'contrast',
  ];
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
      <button aerisButton size="xs">Extra small</button>
      <button aerisButton size="sm">Small</button>
      <button aerisButton>Medium</button>
      <button aerisButton size="lg">Large</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureSizesDemo {
}
```

### Icons and positions

Project icons as normal button content and control whether the icon appears before, after, or without visible text. Aeris normalizes projected SVG icons to its shared icon size.

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
      <button aerisButton>
        <svg [lucideIcon]="icons.Plus"></svg>
        Add item
      </button>
      <button aerisButton iconPosition="right">
        Continue
        <svg [lucideIcon]="icons.ChevronRight"></svg>
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
      flex-wrap: wrap;
      align-items: center;
    }

    .wrap {
      display: flex;
      gap: 0.5625rem;
      flex-wrap: wrap;
    }

    .align {
      align-items: center;
    }

    svg:where([lucideIcon]) {
      width: var(--aeris-icon-size, 1rem);
      height: var(--aeris-icon-size, 1rem);
      flex-shrink: 0;
      stroke-width: 2;
    }

    @media (max-width: 42rem) {
      .aeris-example-row {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
  `
})
export class FeatureIconsDemo {

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
        variant="solid"
        severity="secondary"
        [loading]="loading()"
        [disabled]="loading()"
        (click)="toggleLoading()"
      >
        Save asynchronously
      </button>
      <aeris-button label="Processing" loading />
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureLoadingDemo {
  protected readonly loading = signal(false);

  protected toggleLoading(): void {
    this.loading.set(true);
    globalThis.setTimeout(() => this.loading.set(false), 1600);
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
        <button aerisButton raised>Raised</button>
        <button aerisButton rounded>Rounded</button>
        <button aerisButton rounded iconOnly aria-label="Favorite">★</button>
      </div>
      <button aerisButton fluid>Full width</button>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureShapeDemo {
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
      <aeris-button label="Messages" badge="8" />
      <aeris-button
        label="Tasks"
        badge="3"
        badgeSeverity="success"
        variant="solid"
        severity="secondary"
      />
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
      align-items: center;
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
export class FeatureBadgeDemo {
}
```

### Custom templates

Typed TemplateRef inputs customize content, idle icons, and loading indicators.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';

@Component({
  selector: 'app-feature-templates-demo',
  imports: [AerisButton],
  template: `
    <div class="aeris-example-row">
      <ng-template #rocket let-loading="loading">
        <span aria-hidden="true">{{ loading ? '…' : '↑' }}</span>
      </ng-template>
      <aeris-button label="Deploy" [iconTemplate]="rocket" iconPosition="right" />
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
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
export class FeatureTemplatesDemo {
  protected readonly loading = signal(false);
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
      >
        Open GitHub
      </a>
    </div>
  `,
  styles: `
    .aeris-example-row {
      display: flex;
      gap: 0.5625rem;
      min-width: 0;
      flex-wrap: wrap;
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
export class FeatureLinksDemo {
}
```

## Accessibility

- With aerisButtonToggle, Enter or Space changes checked and aria-pressed. Disabled/loading toggles do not change state. Signal Forms receives invalid and touched automatically; pristine invalid fields remain neutral. A manual invalid=true remains immediate unless touched=false is supplied.
- Pressed colors follow the button's severity. Disabled and loading links keep their resting appearance and do not activate. Reduced motion removes hover displacement without suppressing pressed colors or keyboard focus.
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
