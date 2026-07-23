# Compare

> Reveal differences between images or custom content with controlled, touch, hover, vertical, and keyboard interaction.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/compare`
- Human-readable documentation: [https://aeris-ui.dev/components/compare](https://aeris-ui.dev/components/compare)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisCompareModule } from '@aeris-ui/core/compare';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `number` | `0` | Minimum comparison value. |
| `max` | `number` | `100` | Maximum comparison value. |
| `step` | `number` | `1` | Pointer and keyboard increment. |
| `orientation` | `AerisCompareOrientation` | `'horizontal'` | Direction of the reveal and divider. |
| `slideOnHover` | `boolean` | `false` | Updates from mouse or pen hover without requiring a press. |
| `disabled` | `boolean` | `false` | Disables focus and all interaction. |
| `readonly` | `boolean` | `false` | Keeps the slider focusable while preventing changes. |
| `beforeSrc` | `string` | `''` | Source for the library-rendered before image. |
| `afterSrc` | `string` | `''` | Source for the library-rendered after image. |
| `beforeAlt` | `string` | `''` | Alternative text for the before image. |
| `afterAlt` | `string` | `''` | Alternative text for the after image. |
| `beforeLabel` | `string` | `'Before'` | Before label and empty-state text. |
| `afterLabel` | `string` | `'After'` | After label and empty-state text. |
| `showLabels` | `boolean` | `false` | Displays compact before and after labels. |
| `objectFit` | `AerisCompareObjectFit` | `'cover'` | Fit used by built-in images. |
| `aspectRatio` | `string` | `'16 / 9'` | CSS aspect ratio of the comparison surface. |
| `loading` | `'eager' &#124; 'lazy'` | `'lazy'` | Loading behavior for built-in images. |
| `name` | `string` | `''` | Native range name for form submission. |
| `inputId` | `string` | `Generated` | ID assigned to the native range input. |
| `ariaLabel` | `string` | `'Comparison position'` | Accessible name when ariaLabelledby is not used. |
| `ariaLabelledby` | `string` | `''` | IDs of elements that label the range. |
| `ariaDescribedby` | `string` | `''` | IDs of elements that describe the range. |
| `valueText` | `((value: number) =&gt; string) &#124; null` | `null` | Formats the announced aria-valuetext. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `50` | Controlled comparison value with valueChange output. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `valueInput` | `AerisCompareInputEvent` | `—` | Emits during drag, hover, or keyboard updates. |
| `changed` | `AerisCompareInputEvent` | `—` | Emits when a native change commits, a keyboard command runs, or setValue emits. |
| `focused` | `FocusEvent` | `—` | Emits when the native range receives focus. |
| `blurred` | `FocusEvent` | `—` | Emits when the native range loses focus. |
| `touch` | `void` | `—` | Emits when the control is marked touched. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisCompareBefore` | `AerisCompareContentContext` | `Built-in image or label` | Replaces the before layer. |
| `aerisCompareAfter` | `AerisCompareContentContext` | `Built-in image or label` | Replaces the after layer. |
| `aerisCompareHandle` | `AerisCompareHandleContext` | `Aeris bidirectional icon` | Replaces the handle content while retaining the accessible range. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `setValue(value, emitChange?)` | `void` | `emitChange = true` | Clamps, aligns, and updates the comparison value. |
| `focus()` | `void` | `—` | Moves focus to the native range. |

## Interfaces and types

### Interfaces

```ts
export type AerisCompareOrientation = 'horizontal' | 'vertical';
export type AerisCompareObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface AerisCompareContentContext {
  readonly $implicit: number;
  readonly value: number;
  readonly percentage: number;
}

export interface AerisCompareHandleContext extends AerisCompareContentContext {
  readonly orientation: AerisCompareOrientation;
  readonly disabled: boolean;
}

export interface AerisCompareInputEvent {
  readonly originalEvent: Event;
  readonly value: number;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-compare-min-height` | `&lt;length&gt;` | `12rem` | Minimum comparison height. |
| `--aeris-compare-mobile-min-height` | `&lt;length&gt;` | `10rem` | Minimum height below 32rem. |
| `--aeris-compare-border-width` | `&lt;length&gt;` | `1px` | Surface border width. |
| `--aeris-compare-border` | `&lt;color&gt;` | `var(--aeris-border)` | Surface border color. |
| `--aeris-compare-radius` | `&lt;length&gt;` | `var(--aeris-radius-lg)` | Surface corner radius. |
| `--aeris-compare-background` | `&lt;color&gt;` | `var(--aeris-surface-2)` | Surface background. |
| `--aeris-compare-color` | `&lt;color&gt;` | `var(--aeris-text)` | Fallback content color. |
| `--aeris-compare-empty-padding` | `&lt;length&gt;` | `1.5rem` | Empty-layer padding. |
| `--aeris-compare-empty-background` | `&lt;color&gt;` | `var(--aeris-surface-2)` | After empty-layer background. |
| `--aeris-compare-before-empty-background` | `&lt;color&gt;` | `Primary surface mix` | Before empty-layer background. |
| `--aeris-compare-muted-color` | `&lt;color&gt;` | `var(--aeris-text-2)` | Empty-layer text color. |
| `--aeris-compare-divider-size` | `&lt;length&gt;` | `2px` | Divider thickness. |
| `--aeris-compare-divider-color` | `&lt;color&gt;` | `#fff` | Divider color. |
| `--aeris-compare-divider-shadow` | `&lt;shadow&gt;` | `Soft dark shadow` | Divider shadow. |
| `--aeris-compare-handle-size` | `&lt;length&gt;` | `2.25rem` | Handle width and height. |
| `--aeris-compare-mobile-handle-size` | `&lt;length&gt;` | `2rem` | Handle size below 32rem. |
| `--aeris-compare-handle-border-width` | `&lt;length&gt;` | `2px` | Handle border width. |
| `--aeris-compare-handle-border` | `&lt;color&gt;` | `#fff` | Handle border color. |
| `--aeris-compare-handle-radius` | `&lt;length&gt;` | `999px` | Handle corner radius. |
| `--aeris-compare-handle-background` | `&lt;color&gt;` | `Translucent dark` | Handle background. |
| `--aeris-compare-handle-color` | `&lt;color&gt;` | `#fff` | Handle icon color. |
| `--aeris-compare-handle-shadow` | `&lt;shadow&gt;` | `Soft dark shadow` | Handle shadow. |
| `--aeris-compare-handle-hover-background` | `&lt;color&gt;` | `var(--aeris-compare-handle-background)` | Hover handle background. |
| `--aeris-compare-handle-focus-background` | `&lt;color&gt;` | `var(--aeris-compare-handle-background)` | Focus handle background. |
| `--aeris-compare-label-inset` | `&lt;length&gt;` | `0.75rem` | Label inset from edges. |
| `--aeris-compare-label-padding` | `&lt;length&gt;` | `0.35rem 0.625rem` | Label padding. |
| `--aeris-compare-label-border` | `&lt;color&gt;` | `Translucent white` | Label border color. |
| `--aeris-compare-label-radius` | `&lt;length&gt;` | `var(--aeris-radius-control)` | Label corner radius. |
| `--aeris-compare-label-background` | `&lt;color&gt;` | `Translucent dark` | Label background. |
| `--aeris-compare-label-color` | `&lt;color&gt;` | `#fff` | Label text color. |
| `--aeris-compare-label-font-size` | `&lt;length&gt;` | `0.75rem` | Label font size. |
| `--aeris-compare-focus-offset` | `&lt;length&gt;` | `3px` | Focus outline offset. |
| `--aeris-compare-disabled-opacity` | `&lt;number&gt;` | `0.52` | Disabled surface opacity. |

## Examples

### Basic

Compare two images with a draggable, touch-friendly divider, optional labels, and no consumer CSS.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-basic-compare-demo',
  imports: [AerisCompareModule],
  template: `
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      beforeLabel="Black and white"
      afterLabel="Color"
      showLabels
      ariaLabel="Car color comparison"
    />
  `,
})
export class BasicCompareDemo {}

@Component({
  selector: 'app-compare-basic-demo',
  imports: [],
  template: `
    <div>
      <aeris-compare
        beforeSrc="/car-bw.jpg"
        afterSrc="/car.jpg"
        beforeAlt="Car photographed in black and white"
        afterAlt="Car photographed in color"
        beforeLabel="Black and white"
        afterLabel="Color"
        showLabels
        ariaLabel="Car color comparison"
      />
    </div>
  `
})
export class CompareBasicBasicDemo {
}
```

### Controlled

Bind the position, react to committed changes, and move the divider through the public API.

#### TS

```ts
import { Component, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisCompare, AerisCompareModule, type AerisCompareInputEvent } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-controlled-compare-demo',
  imports: [AerisButton, AerisCompareModule],
  template: `
    <div class="compare-demo-controls" aria-label="Comparison presets">
      <button aerisButton type="button" (click)="setControlledValue(25)">25%</button>
      <button aerisButton type="button" (click)="setControlledValue(50)">50%</button>
      <button aerisButton type="button" (click)="setControlledValue(75)">75%</button>
    </div>
    <aeris-compare
      #controlledCompare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      [(value)]="controlledValue"
      (changed)="recordControlledChange($event)"
      ariaLabel="Controlled car comparison"
    />
    <p class="compare-demo-status" aria-live="polite">{{ controlledStatus() }}</p>
  `,
})
export class ControlledCompareDemo {
  readonly controlledValue = signal(42);
  readonly controlledStatus = signal('Comparison position: 42%.');
  readonly controlledCompare = viewChild.required<AerisCompare>('controlledCompare');

  setControlledValue(value: number): void {
    this.controlledCompare().setValue(value);
  }

  recordControlledChange(event: AerisCompareInputEvent): void {
    this.controlledStatus.set(`Comparison position: ${event.value}%.`);
  }
}

@Component({
  selector: 'app-compare-controlled-demo',
  imports: [AerisButton],
  templateUrl: './compare-controlled.demo.html',
  styleUrl: './compare-controlled.demo.scss'
})
export class CompareControlledControlledDemo {
}
```

#### HTML

```html
<div>
  <div class="compare-demo-controls" aria-label="Comparison presets">
    <button aerisButton type="button" (click)="setControlledValue(25)">25%</button>
    <button aerisButton type="button" (click)="setControlledValue(50)">50%</button>
    <button aerisButton type="button" (click)="setControlledValue(75)">75%</button>
  </div>
  <aeris-compare
    #controlledCompare
    beforeSrc="/car-bw.jpg"
    afterSrc="/car.jpg"
    beforeAlt="Car photographed in black and white"
    afterAlt="Car photographed in color"
    [(value)]="controlledValue"
    (changed)="recordControlledChange($event)"
    ariaLabel="Controlled car comparison"
  />
  <p class="compare-demo-status" aria-live="polite">
    {{ controlledStatus() }}
  </p>
</div>
```

#### CSS

```css
.compare-demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.compare-demo-status {
  margin: 0.75rem 0 0;
  color: var(--aeris-text-2);
}
```

### Hover

Let mouse and pen users preview positions by hovering while preserving drag, touch, and keyboard interaction.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-hover-compare-demo',
  imports: [AerisCompareModule],
  template: `
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      slideOnHover
      [(value)]="hoverValue"
      ariaLabel="Hover-controlled car comparison"
    />
  `,
})
export class HoverCompareDemo {
  readonly hoverValue = signal(50);
}

@Component({
  selector: 'app-compare-hover-demo',
  imports: [],
  template: `
    <div>
      <aeris-compare
        beforeSrc="/car-bw.jpg"
        afterSrc="/car.jpg"
        beforeAlt="Car photographed in black and white"
        afterAlt="Car photographed in color"
        slideOnHover
        [(value)]="hoverValue"
        ariaLabel="Hover-controlled car comparison"
      />
    </div>
  `
})
export class CompareHoverHoverDemo {
}
```

### Vertical

Switch the reveal axis for portrait media or stacked comparisons.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-vertical-compare-demo',
  imports: [AerisCompareModule],
  template: `
    <aeris-compare
      class="compare-vertical"
      orientation="vertical"
      aspectRatio="4 / 5"
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      ariaLabel="Vertical car comparison"
    />
  `,
})
export class VerticalCompareDemo {}

@Component({
  selector: 'app-compare-vertical-demo',
  imports: [],
  template: `
    <div>
      <aeris-compare
        class="compare-vertical"
        orientation="vertical"
        aspectRatio="4 / 5"
        beforeSrc="/car-bw.jpg"
        afterSrc="/car.jpg"
        beforeAlt="Car photographed in black and white"
        afterAlt="Car photographed in color"
        ariaLabel="Vertical car comparison"
      />
    </div>
  `,
  styles: `
    .compare-vertical {
      width: min(100%, 28rem);
      margin-inline: auto;
    }
  `
})
export class CompareVerticalVerticalDemo {
}
```

### Custom handle

Replace the handle content and adjust its Aeris tokens without changing slider behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';
import { LucideDynamicIcon, LucideMoveHorizontal } from '@lucide/angular';

@Component({
  selector: 'app-custom-handle-compare-demo',
  imports: [AerisCompareModule, LucideDynamicIcon],
  template: `
    <aeris-compare
      class="compare-accent-handle"
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      ariaLabel="Car comparison with custom handle"
    >
      <ng-template aerisCompareHandle>
        <svg class="compare-handle-icon" [lucideIcon]="moveHorizontalIcon"></svg>
      </ng-template>
    </aeris-compare>
  `,
})
export class CustomHandleCompareDemo {
  readonly moveHorizontalIcon = LucideMoveHorizontal;
}

@Component({
  selector: 'app-compare-handle-demo',
  imports: [LucideDynamicIcon],
  template: `
    <div>
      <aeris-compare
        class="compare-accent-handle"
        beforeSrc="/car-bw.jpg"
        afterSrc="/car.jpg"
        beforeAlt="Car photographed in black and white"
        afterAlt="Car photographed in color"
        ariaLabel="Car comparison with custom handle"
      >
        <ng-template aerisCompareHandle>
          <svg class="compare-handle-icon" [lucideIcon]="moveHorizontalIcon"></svg>
        </ng-template>
      </aeris-compare>
    </div>
  `,
  styles: `
    .compare-accent-handle {
      --aeris-compare-handle-background: var(--aeris-primary);
      --aeris-compare-handle-color: var(--aeris-primary-contrast);
      --aeris-compare-handle-border: var(--aeris-surface);
    }
    
    .compare-handle-icon {
      width: 1.2rem;
      height: 1.2rem;
    }
  `
})
export class CompareHandleCustomHandleDemo {
}
```

### Templates

Render complete custom before and after layers while keeping the Aeris divider and native range.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-template-compare-demo',
  imports: [AerisCompareModule],
  templateUrl: './template-compare-demo.html',
  styleUrl: './template-compare-demo.css',
})
export class TemplateCompareDemo {}

@Component({
  selector: 'app-compare-template-demo',
  imports: [],
  templateUrl: './compare-template.demo.html',
  styleUrl: './compare-template.demo.scss'
})
export class CompareTemplateTemplatesDemo {
}
```

#### HTML

```html
<div>
  <aeris-compare ariaLabel="Workflow comparison">
    <ng-template aerisCompareBefore>
      <div class="compare-template-layer compare-template-layer--manual">
        <p>Manual workflow</p>
        <strong>46 min</strong>
        <span>Average delivery time</span>
        <ul>
          <li>Seven handoffs</li>
          <li>Three review cycles</li>
        </ul>
      </div>
    </ng-template>
    <ng-template aerisCompareAfter>
      <div class="compare-template-layer compare-template-layer--automated">
        <p>Automated workflow</p>
        <strong>8 min</strong>
        <span>Average delivery time</span>
        <ul>
          <li>One coordinated handoff</li>
          <li>Continuous validation</li>
        </ul>
      </div>
    </ng-template>
  </aeris-compare>
</div>
```

#### CSS

```css
.compare-template-layer {
  display: grid;
  width: 100%;
  height: 100%;
  align-content: center;
  gap: 0.35rem;
  padding: clamp(1.25rem, 5vw, 3rem);
}

.compare-template-layer--manual {
  background: linear-gradient(145deg, #282c34, #15171c);
  color: #f6f7f9;
}

.compare-template-layer--automated {
  background: linear-gradient(145deg, #e7f8cf, #c8ecad);
  color: #17200d;
}

.compare-template-layer p,
.compare-template-layer span,
.compare-template-layer ul {
  margin: 0;
}

.compare-template-layer p {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.compare-template-layer strong {
  font-size: clamp(2rem, 7vw, 4rem);
  letter-spacing: -0.06em;
  line-height: 1;
}

.compare-template-layer span {
  opacity: 0.72;
}

.compare-template-layer ul {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.compare-template-layer li::before {
  margin-inline-end: 0.45rem;
  content: '—';
}
```

### States

Disabled comparisons are unavailable; readonly comparisons remain focusable and announced without allowing changes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-compare-states-demo',
  imports: [AerisCompareModule],
  templateUrl: './compare-states-demo.html',
  styleUrl: './compare-states-demo.css',
})
export class CompareStatesDemo {}

@Component({
  selector: 'app-compare-states-demo',
  imports: [],
  templateUrl: './compare-states.demo.html',
  styleUrl: './compare-states.demo.scss'
})
export class CompareStatesStatesDemo {
}
```

#### HTML

```html
<div class="compare-state-grid">
  <section>
    <h4>Disabled</h4>
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      disabled
      ariaLabel="Disabled car comparison"
    />
  </section>
  <section>
    <h4>Readonly</h4>
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      readonly
      ariaLabel="Readonly car comparison"
    />
  </section>
</div>
```

#### CSS

```css
.compare-state-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.compare-state-grid h4 {
  margin: 0 0 0.625rem;
}

@media (max-width: 40rem) {
  .compare-state-grid {
    grid-template-columns: 1fr;
  }
}
```

### Forms

Use Compare with typed reactive forms; validation, disabled state, and touched state flow through the native control contract.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisCompareModule } from '@aeris-ui/core/compare';

@Component({
  selector: 'app-compare-forms-demo',
  imports: [AerisCompareModule, ReactiveFormsModule],
  template: `
    <aeris-compare
      beforeSrc="/car-bw.jpg"
      afterSrc="/car.jpg"
      beforeAlt="Car photographed in black and white"
      afterAlt="Car photographed in color"
      [formControl]="formPosition"
      ariaLabel="Form-controlled car comparison"
    />
    <p class="compare-demo-status">Form value: {{ formPosition.value }}%</p>
  `,
})
export class CompareFormsDemo {
  readonly formPosition = new FormControl(35, { nonNullable: true });
}

@Component({
  selector: 'app-compare-forms-demo',
  imports: [ReactiveFormsModule],
  template: `
    <div>
      <aeris-compare
        beforeSrc="/car-bw.jpg"
        afterSrc="/car.jpg"
        beforeAlt="Car photographed in black and white"
        afterAlt="Car photographed in color"
        [formControl]="formPosition"
        ariaLabel="Form-controlled car comparison"
      />
      <p class="compare-demo-status">Form value: {{ formPosition.value }}%</p>
    </div>
  `,
  styles: `
    .compare-demo-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.625rem;
      margin-bottom: 1rem;
    }
    
    .compare-demo-status {
      margin: 0.75rem 0 0;
      color: var(--aeris-text-2);
    }
  `
})
export class CompareFormsFormsDemo {
}
```

## Accessibility

- Compare uses a native input[type='range'] for pointer, touch, form, and assistive-technology support. The visible handle follows that control.
- Provide ariaLabel or ariaLabelledby and meaningful alt text for informative built-in images. Use empty alt text only for decorative images.
- aria-valuemin, aria-valuemax, and aria-valuenow come from the native range. Use valueText when a percentage does not describe the comparison clearly.
- Hover mode is supplementary. Drag, touch, and complete keyboard interaction remain available, and touch movement never depends on hover.
- Readonly comparisons remain focusable and expose aria-readonly while preventing changes. Disabled comparisons use the native disabled state.
- Custom layer templates should remain presentational. Do not place controls inside them because the range intentionally owns pointer interaction across the surface.
- Focus is visibly drawn around the complete surface. Motion is subtle and removed when reduced motion is requested.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to or away from the comparison range. |
| `Arrow Right / Arrow Up` | Increases the value by one configured step. |
| `Arrow Left / Arrow Down` | Decreases the value by one configured step. |
| `Page Up / Page Down` | Increases or decreases the value by ten configured steps. |
| `Home / End` | Moves directly to the minimum or maximum value. |
