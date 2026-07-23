# SpeedDial

> Reveal contextual actions in animated linear and radial layouts.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/speed-dial`
- Human-readable documentation: [https://aeris-ui.dev/components/speed-dial](https://aeris-ui.dev/components/speed-dial)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSpeedDial, type AerisSpeedDialItem }
from '@aeris-ui/core/speed-dial';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `navigationHandler` | `AerisSpeedDialNavigationHandler &#124; undefined` | `undefined` | Optional framework-routing bridge for routerLink items. Native href navigation is used otherwise. |
| `id` | `string` | `generated` | Stable base ID for the trigger, menu, and items. |
| `model` | `readonly AerisSpeedDialItem&lt;T&gt;[]` | `[]` | Actions displayed by the menu. |
| `visible` | `boolean (model)` | `false` | Controls open state and supports two-way binding. |
| `direction` | `AerisSpeedDialDirection` | `'up'` | Direction used by linear and partial-circle layouts. |
| `type` | `AerisSpeedDialType` | `'linear'` | Linear, circle, semi-circle, or quarter-circle layout. |
| `maxItems` | `number &#124; undefined` | `layout limit` | Optionally lowers the limit. Linear and quarter-circle allow 5, semi-circle allows 7, and circle allows 8. |
| `radius` | `number` | `0` | Radial distance in pixels. Zero derives a radius from item count. |
| `transitionDelay` | `number` | `30` | Stagger interval between action animations in milliseconds. |
| `mask` | `boolean` | `false` | Displays a dismissible page mask while open. |
| `backdropBlur` | `boolean` | `true` | Applies the default frosted-glass blur when the mask is visible. |
| `backdropBlurAmount` | `string` | `''` | Overrides the mask blur radius with a CSS length. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `hideOnClickOutside` | `boolean` | `true` | Closes when focus is not required and a pointer clicks elsewhere. |
| `showIcon` | `string` | `'+'` | Default closed trigger glyph. |
| `hideIcon` | `string` | `''` | Optional open trigger glyph. |
| `rotateAnimation` | `boolean` | `true` | Rotates the show glyph when no hide glyph is supplied. |
| `ariaLabel` | `string` | `'Open actions'` | Accessible trigger and menu name. |
| `ariaLabelledBy` | `string &#124; undefined` | `undefined` | ID of visible text that labels the trigger and menu. |
| `buttonProps` | `AerisSpeedDialButtonProps` | `undefined` | Configures trigger title and size. |
| `buttonClass` | `string` | `''` | Additional trigger class. |
| `maskClass` | `string` | `''` | Additional mask class. |
| `buttonTemplate` | `TemplateRef` | `undefined` | Replaces the complete trigger. |
| `itemTemplate` | `TemplateRef` | `undefined` | Replaces action content. |
| `iconTemplate` | `TemplateRef` | `undefined` | Replaces the default trigger glyph. |

### Speed Dial outputs

| Name | Type | Description |
| --- | --- | --- |
| visibleChange | boolean | Emitted by the visible model whenever open state changes. |
| clicked | MouseEvent | Emitted when the default trigger is activated. |
| shown | Event | Emitted after the menu opens. |
| hidden | Event | Emitted after the menu closes. |
| itemSelected | AerisSpeedDialCommandEvent | Emitted when an enabled action is selected. |

## Interfaces and types

### Interfaces

```ts
type AerisSpeedDialDirection =
  | 'up' | 'down' | 'left' | 'right'
  | 'up-left' | 'up-right' | 'down-left' | 'down-right';

type AerisSpeedDialType =
  | 'linear' | 'circle' | 'semi-circle' | 'quarter-circle';

const AERIS_SPEED_DIAL_ITEM_LIMITS = {
  linear: 5,
  circle: 8,
  'semi-circle': 7,
  'quarter-circle': 5,
} as const;

interface AerisSpeedDialItem<T = unknown> {
  readonly id?: string;
  readonly label: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly rel?: string;
  readonly data?: T;
  readonly command?: (event: AerisSpeedDialCommandEvent<T>) => void;
}

type AerisSpeedDialNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisSpeedDialCommandEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisSpeedDialItem<T>;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-speed-dial-size` | `CSS custom property` | — | Trigger diameter. |
| `--aeris-speed-dial-item-size` | `CSS custom property` | — | Action diameter. |
| `--aeris-speed-dial-gap` | `CSS custom property` | — | Linear action spacing. |
| `--aeris-speed-dial-backdrop-blur` | `CSS custom property` | — | Mask blur radius. |
| `--aeris-backdrop-blur` | `CSS custom property` | — | Shared backdrop blur radius. |
| `--aeris-primary` | `CSS custom property` | — | Trigger background. |
| `--aeris-focus` | `CSS custom property` | — | Trigger and item focus ring. |

## Examples

### Linear

Place four Speed Dials at the edge centers so their actions open into the available canvas.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial, type AerisSpeedDialItem } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-linear-demo',
  imports: [AerisSpeedDial],
  templateUrl: './speed-dial-linear.demo.html',
  styleUrl: './speed-dial-linear.demo.scss'
})
export class SpeedDialLinearLinearDemo {
  protected readonly actions: readonly AerisSpeedDialItem[] = [
    { label: 'Edit', icon: 'edit', command: () => edit() },
    { label: 'Delete', icon: 'delete', command: () => remove() },
    { label: 'Save', icon: 'save', command: () => save() },
    { label: 'Copy', icon: 'copy', command: () => copy() },
    { label: 'Upload', icon: 'upload', command: () => upload() },
  ];
}
```

#### HTML

```html
<div class="placement-stage aeris-example-row">
  <aeris-speed-dial
    class="dial-position dial-position--top"
    ariaLabel="Actions opening down"
    [model]="actions"
    [itemTemplate]="actionIcon"
    direction="down"
  />
  <aeris-speed-dial
    class="dial-position dial-position--right"
    ariaLabel="Actions opening left"
    [model]="actions"
    [itemTemplate]="actionIcon"
    direction="left"
  />
  <aeris-speed-dial
    class="dial-position dial-position--bottom"
    ariaLabel="Actions opening up"
    [model]="actions"
    [itemTemplate]="actionIcon"
    direction="up"
  />
  <aeris-speed-dial
    class="dial-position dial-position--left"
    ariaLabel="Actions opening right"
    [model]="actions"
    [itemTemplate]="actionIcon"
    direction="right"
  />
</div>
```

#### CSS

```css
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

.placement-stage {
  position: relative;
  width: 100%;
  min-height: 31rem;
  overflow: clip;
  border: 1px solid var(--aeris-border);
  border-radius: 0.75rem;
  background: linear-gradient(90deg, transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), linear-gradient(transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 8%, transparent), transparent 56%), var(--aeris-surface-2);
}

.dial-position {
  position: absolute;
}

.dial-position--top {
  top: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
}

.dial-position--right {
  top: 50%;
  right: 1.75rem;
  transform: translateY(-50%);
}

.dial-position--bottom {
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
}

.dial-position--left {
  top: 50%;
  left: 1.75rem;
  transform: translateY(-50%);
}

@media (max-width: 40rem) {
  .placement-stage {
      min-height: 27rem;
    }
  
  .dial-position--top,
    .dial-position--top-left,
    .dial-position--top-right {
      top: 1rem;
    }
  
  .dial-position--right,
    .dial-position--top-right,
    .dial-position--bottom-right {
      right: 1rem;
    }
  
  .dial-position--bottom,
    .dial-position--bottom-right,
    .dial-position--bottom-left {
      bottom: 1rem;
    }
  
  .dial-position--left,
    .dial-position--top-left,
    .dial-position--bottom-left {
      left: 1rem;
    }
}

.speed-dial-stage {
  position: relative;
  min-height: 31rem;
}

.top { position: absolute; top: 1.75rem; left: 50%; transform: translateX(-50%); }
.right { position: absolute; top: 50%; right: 1.75rem; transform: translateY(-50%); }
.bottom { position: absolute; bottom: 1.75rem; left: 50%; transform: translateX(-50%); }
.left { position: absolute; top: 50%; left: 1.75rem; transform: translateY(-50%); }

.top-left { position: absolute; top: 1.75rem; left: 1.75rem; }
.top-right { position: absolute; top: 1.75rem; right: 1.75rem; }
.bottom-right { position: absolute; right: 1.75rem; bottom: 1.75rem; }
.bottom-left { position: absolute; bottom: 1.75rem; left: 1.75rem; }
```

### Semi-circle

The same four edge-center placements provide room for actions to fan inward around the trigger.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-semi-circle-demo',
  imports: [AerisSpeedDial],
  templateUrl: './speed-dial-semi-circle.demo.html',
  styleUrl: './speed-dial-semi-circle.demo.scss'
})
export class SpeedDialSemiCircleSemiCircleDemo {
}
```

#### HTML

```html
<div class="placement-stage aeris-example-row">
  <aeris-speed-dial
    class="dial-position dial-position--top"
    ariaLabel="Semi-circle opening down"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="semi-circle"
    direction="down"
    [radius]="86"
  />
  <aeris-speed-dial
    class="dial-position dial-position--right"
    ariaLabel="Semi-circle opening left"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="semi-circle"
    direction="left"
    [radius]="86"
  />
  <aeris-speed-dial
    class="dial-position dial-position--bottom"
    ariaLabel="Semi-circle opening up"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="semi-circle"
    direction="up"
    [radius]="86"
  />
  <aeris-speed-dial
    class="dial-position dial-position--left"
    ariaLabel="Semi-circle opening right"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="semi-circle"
    direction="right"
    [radius]="86"
  />
</div>
```

#### CSS

```css
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

.placement-stage {
  position: relative;
  width: 100%;
  min-height: 31rem;
  overflow: clip;
  border: 1px solid var(--aeris-border);
  border-radius: 0.75rem;
  background: linear-gradient(90deg, transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), linear-gradient(transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 8%, transparent), transparent 56%), var(--aeris-surface-2);
}

.dial-position {
  position: absolute;
}

.dial-position--top {
  top: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
}

.dial-position--right {
  top: 50%;
  right: 1.75rem;
  transform: translateY(-50%);
}

.dial-position--bottom {
  bottom: 1.75rem;
  left: 50%;
  transform: translateX(-50%);
}

.dial-position--left {
  top: 50%;
  left: 1.75rem;
  transform: translateY(-50%);
}

@media (max-width: 40rem) {
  .placement-stage {
      min-height: 27rem;
    }
  
  .dial-position--top,
    .dial-position--top-left,
    .dial-position--top-right {
      top: 1rem;
    }
  
  .dial-position--right,
    .dial-position--top-right,
    .dial-position--bottom-right {
      right: 1rem;
    }
  
  .dial-position--bottom,
    .dial-position--bottom-right,
    .dial-position--bottom-left {
      bottom: 1rem;
    }
  
  .dial-position--left,
    .dial-position--top-left,
    .dial-position--bottom-left {
      left: 1rem;
    }
}

.speed-dial-stage {
  position: relative;
  min-height: 31rem;
}

.top { position: absolute; top: 1.75rem; left: 50%; transform: translateX(-50%); }
.right { position: absolute; top: 50%; right: 1.75rem; transform: translateY(-50%); }
.bottom { position: absolute; bottom: 1.75rem; left: 50%; transform: translateX(-50%); }
.left { position: absolute; top: 50%; left: 1.75rem; transform: translateY(-50%); }

.top-left { position: absolute; top: 1.75rem; left: 1.75rem; }
.top-right { position: absolute; top: 1.75rem; right: 1.75rem; }
.bottom-right { position: absolute; right: 1.75rem; bottom: 1.75rem; }
.bottom-left { position: absolute; bottom: 1.75rem; left: 1.75rem; }
```

### Quarter-circle

Place one Speed Dial in every corner and direct each action arc toward the center.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-quarter-circle-demo',
  imports: [AerisSpeedDial],
  templateUrl: './speed-dial-quarter-circle.demo.html',
  styleUrl: './speed-dial-quarter-circle.demo.scss'
})
export class SpeedDialQuarterCircleQuarterCircleDemo {
}
```

#### HTML

```html
<div class="placement-stage aeris-example-row">
  <aeris-speed-dial
    class="dial-position dial-position--top-left"
    ariaLabel="Top-left corner actions"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="quarter-circle"
    direction="down-right"
    [radius]="90"
  />
  <aeris-speed-dial
    class="dial-position dial-position--top-right"
    ariaLabel="Top-right corner actions"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="quarter-circle"
    direction="down-left"
    [radius]="90"
  />
  <aeris-speed-dial
    class="dial-position dial-position--bottom-right"
    ariaLabel="Bottom-right corner actions"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="quarter-circle"
    direction="up-left"
    [radius]="90"
  />
  <aeris-speed-dial
    class="dial-position dial-position--bottom-left"
    ariaLabel="Bottom-left corner actions"
    [model]="actions"
    [itemTemplate]="actionIcon"
    type="quarter-circle"
    direction="up-right"
    [radius]="90"
  />
</div>
```

#### CSS

```css
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

.placement-stage {
  position: relative;
  width: 100%;
  min-height: 31rem;
  overflow: clip;
  border: 1px solid var(--aeris-border);
  border-radius: 0.75rem;
  background: linear-gradient(90deg, transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), linear-gradient(transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 8%, transparent), transparent 56%), var(--aeris-surface-2);
}

.dial-position {
  position: absolute;
}

.dial-position--top-left {
  top: 1.75rem;
  left: 1.75rem;
}

.dial-position--top-right {
  top: 1.75rem;
  right: 1.75rem;
}

.dial-position--bottom-right {
  right: 1.75rem;
  bottom: 1.75rem;
}

.dial-position--bottom-left {
  bottom: 1.75rem;
  left: 1.75rem;
}

@media (max-width: 40rem) {
  .placement-stage {
      min-height: 27rem;
    }
  
  .dial-position--top,
    .dial-position--top-left,
    .dial-position--top-right {
      top: 1rem;
    }
  
  .dial-position--right,
    .dial-position--top-right,
    .dial-position--bottom-right {
      right: 1rem;
    }
  
  .dial-position--bottom,
    .dial-position--bottom-right,
    .dial-position--bottom-left {
      bottom: 1rem;
    }
  
  .dial-position--left,
    .dial-position--top-left,
    .dial-position--bottom-left {
      left: 1rem;
    }
}

.speed-dial-stage {
  position: relative;
  min-height: 31rem;
}

.top { position: absolute; top: 1.75rem; left: 50%; transform: translateX(-50%); }
.right { position: absolute; top: 50%; right: 1.75rem; transform: translateY(-50%); }
.bottom { position: absolute; bottom: 1.75rem; left: 50%; transform: translateX(-50%); }
.left { position: absolute; top: 50%; left: 1.75rem; transform: translateY(-50%); }

.top-left { position: absolute; top: 1.75rem; left: 1.75rem; }
.top-right { position: absolute; top: 1.75rem; right: 1.75rem; }
.bottom-right { position: absolute; right: 1.75rem; bottom: 1.75rem; }
.bottom-left { position: absolute; bottom: 1.75rem; left: 1.75rem; }
```

### Circle

A centered trigger distributes its actions evenly around the full circumference.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-circle-demo',
  imports: [AerisSpeedDial],
  template: `
    <div class="placement-stage placement-stage--centered aeris-example-row">
      <aeris-speed-dial
        ariaLabel="Circular actions"
        [model]="actions"
        [itemTemplate]="actionIcon"
        type="circle"
        [radius]="88"
      />
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
    
    .placement-stage {
      position: relative;
      width: 100%;
      min-height: 31rem;
      overflow: clip;
      border: 1px solid var(--aeris-border);
      border-radius: 0.75rem;
      background: linear-gradient(90deg, transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), linear-gradient(transparent calc(50% - 0.5px), color-mix(in srgb, var(--aeris-border) 55%, transparent) 50%, transparent calc(50% + 0.5px)), radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 8%, transparent), transparent 56%), var(--aeris-surface-2);
    }
    
    .placement-stage--centered {
      min-height: 24rem;
    }
    
    .placement-stage--centered aeris-speed-dial {
      position: absolute;
      inset: 0;
      margin: auto;
    }
    
    @media (max-width: 40rem) {
      .placement-stage {
          min-height: 27rem;
        }
    }
  `
})
export class SpeedDialCircleCircleDemo {
}
```

### Controlled visibility

Use two-way model binding when application state controls whether the menu is open.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-controlled-demo',
  imports: [AerisSpeedDial],
  template: `
    <div class="dial-stage aeris-example-row">
      <aeris-speed-dial
        ariaLabel="Controlled actions"
        [model]="actions"
        [itemTemplate]="actionIcon"
        type="circle"
        [radius]="78"
        [(visible)]="controlledOpen"
      />
      <span class="status-line">Open: {{ controlledOpen() }}</span>
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
    
    .dial-stage {
      position: relative;
      width: 100%;
      min-height: 20rem;
      overflow: hidden;
      border-radius: 0.75rem;
      background: radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 9%, transparent), transparent 55%), var(--aeris-surface-2);
    }
    
    .dial-stage > aeris-speed-dial {
      position: absolute;
      inset: 0;
      margin: auto;
    }
    
    .status-line {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      color: var(--aeris-text-2);
      font-size: 0.875rem;
    }
    
    @media (max-width: 40rem) {
      .dial-stage {
          min-height: 18rem;
        }
    }
  `
})
export class SpeedDialControlledControlledVisibilityDemo {
  protected readonly open = signal(false);

  protected closeActions(): void {
    this.open.set(false);
  }
}
```

### Mask

A dismissible mask focuses attention on the available actions.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-mask-demo',
  imports: [AerisSpeedDial],
  template: `
    <div class="dial-stage aeris-example-row">
      <aeris-speed-dial
        ariaLabel="Masked actions"
        [model]="actions"
        [itemTemplate]="actionIcon"
        type="circle"
        [radius]="84"
        mask
      />
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
    
    .dial-stage {
      position: relative;
      width: 100%;
      min-height: 20rem;
      overflow: hidden;
      border-radius: 0.75rem;
      background: radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 9%, transparent), transparent 55%), var(--aeris-surface-2);
    }
    
    .dial-stage > aeris-speed-dial {
      position: absolute;
      inset: 0;
      margin: auto;
    }
    
    @media (max-width: 40rem) {
      .dial-stage {
          min-height: 18rem;
        }
    }
  `
})
export class SpeedDialMaskMaskDemo {
}
```

### States and links

Items can be disabled, hidden, command-driven, externally linked, or routed.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial, type AerisSpeedDialItem } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-states-demo',
  imports: [AerisSpeedDial],
  template: `
    <div class="dial-stage aeris-example-row">
      <aeris-speed-dial
        ariaLabel="Record actions"
        [model]="stateActions"
        [itemTemplate]="actionIcon"
        type="circle"
        [radius]="72"
      />
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
    
    .dial-stage {
      position: relative;
      width: 100%;
      min-height: 20rem;
      overflow: hidden;
      border-radius: 0.75rem;
      background: radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 9%, transparent), transparent 55%), var(--aeris-surface-2);
    }
    
    .dial-stage > aeris-speed-dial {
      position: absolute;
      inset: 0;
      margin: auto;
    }
    
    @media (max-width: 40rem) {
      .dial-stage {
          min-height: 18rem;
        }
    }
  `
})
export class SpeedDialStatesStatesAndLinksDemo {
  protected readonly stateActions:
    readonly AerisSpeedDialItem[] = [
      { label: 'Edit', icon: 'edit' },
      { label: 'Delete', icon: 'delete', disabled: true },
      {
        label: 'Copy repository URL',
        icon: 'copy',
        url: 'https://github.com',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    ];
}
```

### Templates

Customize the trigger icon or item content with typed template contexts.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-templates-demo',
  imports: [AerisSpeedDial],
  template: `
    <div class="dial-stage aeris-example-row">
      <ng-template #icon let-open="open"
        ><span aria-hidden="true">{{ open ? 'X' : '...' }}</span></ng-template
      >
      <aeris-speed-dial
        ariaLabel="Templated actions"
        [model]="actions"
        type="circle"
        [radius]="78"
        [iconTemplate]="icon"
        [itemTemplate]="actionIcon"
      />
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
    
    .dial-stage {
      position: relative;
      width: 100%;
      min-height: 20rem;
      overflow: hidden;
      border-radius: 0.75rem;
      background: radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 9%, transparent), transparent 55%), var(--aeris-surface-2);
    }
    
    .dial-stage > aeris-speed-dial {
      position: absolute;
      inset: 0;
      margin: auto;
    }
    
    @media (max-width: 40rem) {
      .dial-stage {
          min-height: 18rem;
        }
    }
  `
})
export class SpeedDialTemplatesTemplatesDemo {
}
```

### Animation

Transition delay controls the stagger. Reduced-motion preferences remove the stagger and movement.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSpeedDial } from '@aeris-ui/core/speed-dial';

@Component({
  selector: 'app-speed-dial-animation-demo',
  imports: [AerisSpeedDial],
  template: `
    <div class="dial-stage aeris-example-row">
      <aeris-speed-dial
        ariaLabel="Animated actions"
        [model]="actions"
        [itemTemplate]="actionIcon"
        type="circle"
        [radius]="78"
        [transitionDelay]="70"
      />
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
    
    .dial-stage {
      position: relative;
      width: 100%;
      min-height: 20rem;
      overflow: hidden;
      border-radius: 0.75rem;
      background: radial-gradient(circle at center, color-mix(in srgb, var(--aeris-primary) 9%, transparent), transparent 55%), var(--aeris-surface-2);
    }
    
    .dial-stage > aeris-speed-dial {
      position: absolute;
      inset: 0;
      margin: auto;
    }
    
    @media (max-width: 40rem) {
      .dial-stage {
          min-height: 18rem;
        }
    }
  `
})
export class SpeedDialAnimationAnimationDemo {
}
```

## Accessibility

- The trigger exposes aria-haspopup="menu", aria-expanded, and aria-controls.
- Use ariaLabel or ariaLabelledBy to provide a concise purpose for the action set.
- Arrow keys open the menu from the trigger and move through enabled actions with roving tabindex.
- Home and End move to the first and last enabled action. Escape closes and restores trigger focus.
- Disabled actions are skipped. Links preserve native link semantics and commands use native buttons.
- Every action receives its accessible name from label or the more specific item ariaLabel.
- Animation respects prefers-reduced-motion and does not delay keyboard availability.

### Keyboard support

| Key | Function |
| --- | --- |
| `Enter / Space` | Opens or closes the focused trigger and activates a focused action. |
| `Arrow Down / Arrow Right` | Opens from the trigger at the first enabled action, or moves to the next enabled action. |
| `Arrow Up / Arrow Left` | Opens from the trigger at the last enabled action, or moves to the previous enabled action. |
| `Home` | Moves focus to the first enabled action. |
| `End` | Moves focus to the last enabled action. |
| `Escape` | Closes the actions and restores focus to the trigger. |
