# ProgressSpinner

> Communicate determinate or indeterminate process status with responsive circular progress and accessible value text.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/progress-spinner`
- Human-readable documentation: [https://aeris-ui.dev/components/progress-spinner](https://aeris-ui.dev/components/progress-spinner)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number &#124; null` | `null` | Numeric progress value; null selects indeterminate mode. |
| `min` | `number` | `0` | Minimum determinate value. |
| `max` | `number` | `100` | Maximum determinate value. |
| `size` | `AerisProgressSpinnerSize` | `'md'` | Sets small, medium, or large diameter. |
| `tone` | `AerisProgressSpinnerTone` | `'primary'` | Sets the palette-aware indicator tone. |
| `strokeWidth` | `number` | `4` | Sets SVG stroke width, clamped from 1 through 12. |
| `showTrack` | `boolean` | `true` | Shows the background progress track. |
| `showValue` | `boolean` | `true` | Shows centered determinate value text except at small size. |
| `rounded` | `boolean` | `true` | Uses rounded or square indicator line caps. |
| `ariaLabel` | `string` | `'Loading'` | Accessible name for the progressbar. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the progressbar. |
| `ariaValueText` | `string` | `''` | Overrides generated determinate value text. |
| `valueFormatter` | `((context: AerisProgressSpinnerValueContext) =&gt; string) &#124; null` | `null` | Formats the default visible and accessible value text. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisProgressSpinnerValue` | `TemplateRef&lt;AerisProgressSpinnerValueContext&gt;` | `-` | Custom centered content for determinate mode. |

## Interfaces and types

### Interfaces

```ts
type AerisProgressSpinnerSize = 'sm' | 'md' | 'lg';
type AerisProgressSpinnerTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

interface AerisProgressSpinnerValueContext {
  readonly $implicit: number;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
}
```

## Examples

### Indeterminate

Omit value when progress cannot be measured yet.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-indeterminate-demo',
  imports: [AerisProgressSpinnerModule],
  template: `
    <div>
      <aeris-progress-spinner ariaLabel="Loading dashboard" />
    </div>
  `
})
export class ProgressSpinnerIndeterminateIndeterminateDemo {
}
```

### Determinate

Provide a numeric value to render progress against the configured range.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-determinate-demo',
  imports: [AerisProgressSpinnerModule],
  template: `
    <div>
      <aeris-progress-spinner ariaLabel="Upload progress" [value]="75" />
    </div>
  `
})
export class ProgressSpinnerDeterminateDeterminateDemo {
}
```

### Dynamic

Bind changing application state; ProgressSpinner clamps updates to the configured range.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-dynamic-demo',
  imports: [AerisButton, AerisProgressSpinnerModule],
  templateUrl: './progress-spinner-dynamic.demo.html',
  styleUrl: './progress-spinner-dynamic.demo.scss'
})
export class ProgressSpinnerDynamicDynamicDemo {
  protected readonly progress = signal(35);

  protected decreaseProgress(): void {
    this.progress.update((value) => Math.max(0, value - 10));
  }

  protected increaseProgress(): void {
    this.progress.update((value) => Math.min(100, value + 10));
  }

  protected resetProgress(): void {
    this.progress.set(0);
  }
}
```

#### HTML

```html
<div>
  <div class="spinner-dynamic">
    <aeris-progress-spinner
      ariaLabel="Processing progress"
      [value]="progress()"
      size="lg"
    />
    <div class="spinner-actions">
      <button
        aerisButton
        variant="secondary"
        type="button"
        (click)="decreaseProgress()"
      >
        Decrease
      </button>
      <button aerisButton type="button" (click)="increaseProgress()">Increase</button>
      <button aerisButton variant="outline" type="button" (click)="resetProgress()">
        Reset
      </button>
    </div>
  </div>
</div>
```

#### CSS

```css
.spinner-dynamic {
  display: grid;
  justify-items: start;
  gap: 1rem;
}

.spinner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}
```

### Sizes

Use compact, default, or prominent spinner geometry.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-sizes-demo',
  imports: [AerisProgressSpinnerModule],
  template: `
    <div>
      <div class="spinner-row">
        <aeris-progress-spinner ariaLabel="Small loading indicator" size="sm" />
        <aeris-progress-spinner ariaLabel="Medium loading indicator" />
        <aeris-progress-spinner ariaLabel="Large loading indicator" size="lg" />
      </div>
    </div>
  `,
  styles: `
    .spinner-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
    }
  `
})
export class ProgressSpinnerSizesSizesDemo {
}
```

### Tones

Palette-aware tones remain readable across every Aeris theme and mode.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-tones-demo',
  imports: [AerisProgressSpinnerModule],
  template: `
    <div>
      <div class="spinner-row">
        <aeris-progress-spinner ariaLabel="Primary loading" tone="primary" />
        <aeris-progress-spinner ariaLabel="Information loading" tone="info" />
        <aeris-progress-spinner ariaLabel="Successful loading" tone="success" />
        <aeris-progress-spinner ariaLabel="Warning loading" tone="warning" />
        <aeris-progress-spinner ariaLabel="Danger loading" tone="danger" />
        <aeris-progress-spinner ariaLabel="Neutral loading" tone="neutral" />
      </div>
    </div>
  `,
  styles: `
    .spinner-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.5rem;
    }
  `
})
export class ProgressSpinnerTonesTonesDemo {
}
```

### Customization

Combine inputs for stroke geometry with scoped tokens for diameter, color, and timing.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-custom-demo',
  imports: [AerisProgressSpinnerModule],
  template: `
    <div>
      <aeris-progress-spinner
        class="brand-spinner"
        ariaLabel="Customized loading state"
        [strokeWidth]="7"
        [showTrack]="false"
        [rounded]="false"
      />
    </div>
  `,
  styles: `
    .brand-spinner {
      --aeris-progress-spinner-size: 6rem;
      --aeris-progress-spinner-indicator: var(--aeris-info);
      --aeris-progress-spinner-track: color-mix(
        in srgb,
        var(--aeris-info) 18%,
        transparent
      );
      --aeris-progress-spinner-value-color: var(--aeris-info);
      --aeris-progress-spinner-value-font-size: 0.875rem;
      --aeris-progress-spinner-duration: 800ms;
    }
  `
})
export class ProgressSpinnerCustomCustomizationDemo {
}
```

### Value template

Replace centered determinate content while a formatter supplies concise assistive text.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule, type AerisProgressSpinnerValueContext } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-template-demo',
  imports: [AerisProgressSpinnerModule],
  templateUrl: './progress-spinner-template.demo.html',
  styleUrl: './progress-spinner-template.demo.scss'
})
export class ProgressSpinnerTemplateValueTemplateDemo {
  protected readonly fileFormatter = (
    context: AerisProgressSpinnerValueContext,
  ): string => `${context.value} of ${context.max} files processed`;
}
```

#### HTML

```html
<div>
  <aeris-progress-spinner
    ariaLabel="File processing progress"
    [value]="42"
    size="lg"
    [valueFormatter]="fileFormatter"
  >
    <ng-template aerisProgressSpinnerValue let-percent="percent">
      <span class="spinner-value-template">
        <strong>{{ percent }}%</strong>
        <small>Files</small>
      </span>
    </ng-template>
  </aeris-progress-spinner>
</div>
```

#### CSS

```css
.spinner-value-template {
  display: grid;
  place-items: center;
  gap: 0.125rem;
  line-height: 1;
}

.spinner-value-template strong {
  font-size: 0.875rem;
}

.spinner-value-template small {
  color: var(--aeris-text-2);
  font-size: 0.5625rem;
  text-transform: uppercase;
}
```

### Token customization

Scope theme tokens to one instance without changing progress semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';

@Component({
  selector: 'app-progress-spinner-tokens-demo',
  imports: [AerisProgressSpinnerModule],
  template: `
    <div>
      <aeris-progress-spinner
        class="token-spinner"
        ariaLabel="Deployment progress"
        [value]="68"
        [strokeWidth]="5"
      />
    </div>
  `,
  styles: `
    .token-spinner {
      --aeris-progress-spinner-size: 5.5rem;
      --aeris-progress-spinner-indicator: var(--aeris-success);
      --aeris-progress-spinner-track: color-mix(
        in srgb,
        var(--aeris-success) 22%,
        transparent
      );
      --aeris-progress-spinner-value-color: var(--aeris-success);
      --aeris-progress-spinner-value-font-size: 0.875rem;
    }
  `
})
export class ProgressSpinnerTokensTokenCustomizationDemo {
}
```

## Accessibility

- ProgressSpinner exposes progressbar semantics and an accessible name.
- Indeterminate mode omits numeric range attributes because the current value is unknown.
- Determinate mode exposes clamped minimum, maximum, current value, and formatted value text.
- The decorative SVG and centered duplicate text are hidden from assistive technology.
- The component is non-interactive and never enters the tab order.
- Reduced-motion mode stops rotation and retains a static arc so loading remains visually indicated.

### Keyboard support

| Key | Function |
| --- | --- |
| `Any key` | ProgressSpinner handles no keyboard input because it is a read-only status indicator. |
