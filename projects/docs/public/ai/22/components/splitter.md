# Splitter

> Resizable panel layout with horizontal and vertical orientation, controlled sizes, constraints, and keyboard support.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/splitter`
- Human-readable documentation: [https://aeris-ui.dev/components/splitter](https://aeris-ui.dev/components/splitter)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisSplitterModule } from '@aeris-ui/core/splitter';
```

## API

### Splitter Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `AerisSplitterOrientation` | `'horizontal'` | Lays panels out left-to-right or top-to-bottom. |
| `variant` | `AerisSplitterVariant` | `'outlined'` | Applies outlined, filled, or plain surface treatment. |
| `size` | `AerisSplitterSize` | `'md'` | Controls panel padding and gutter density. |
| `divider` | `AerisSplitterDivider` | `'handle'` | Displays handle-only separators or full divider lines with handles. |
| `disabled` | `boolean` | `false` | Disables every resize handle. |
| `fluid` | `boolean` | `true` | Sets the host inline size to 100%. |
| `step` | `number` | `5` | Keyboard resize increment in percentage points. |
| `height` | `string` | `''` | CSS block size for the splitter root. |
| `minHeight` | `string` | `''` | Optional minimum block size for the splitter root. |
| `maxHeight` | `string` | `''` | Optional maximum block size for the splitter root. |
| `width` | `string` | `'100%'` | CSS inline size for the splitter root. |
| `maxWidth` | `string` | `''` | Optional maximum inline size for the splitter root. |
| `role` | `'group' &#124; 'region' &#124; null` | `'group'` | Semantic role for the splitter root. |
| `ariaLabel` | `string` | `'Resizable panels'` | Accessible name when no visible label is referenced. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the splitter. |
| `ariaDescribedBy` | `string` | `''` | ID of text that describes the splitter. |
| `separatorLabel` | `string` | `'Resize panels'` | Accessible name for each resize separator. |

### Panel Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number &#124; null` | `null` | Initial panel size in percentage when the splitter sizes model is empty. |
| `minSize` | `number` | `0` | Minimum panel size in percentage. The default allows full collapse. |
| `maxSize` | `number` | `100` | Maximum panel size in percentage. |
| `resizable` | `boolean` | `true` | Disables adjacent handles when false. |
| `ariaLabel` | `string` | `''` | Accessible name for the rendered panel section. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `sizes` | `readonly number[]` | `[]` | Controlled panel sizes in percentages. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `resizeStart` | `AerisSplitterResizeEvent` | `-` | Emitted when pointer resizing starts. |
| `resized` | `AerisSplitterResizeEvent` | `-` | Emitted when keyboard, pointer, or method resizing changes sizes. |
| `resizeEnd` | `AerisSplitterResizeEvent` | `-` | Emitted when pointer resizing ends. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aeris-splitter-panel` | `component` | `-` | Projected panel rendered by the splitter in source order. |
| `default panel content` | `content projection` | `-` | Content rendered inside each resizable panel. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `setSizes` | `(sizes: readonly number[], originalEvent?: Event &#124; null) =&gt; void` | `-` | Sets controlled sizes after normalizing them to the available panels. |
| `reset` | `(originalEvent?: Event &#124; null) =&gt; void` | `-` | Returns to panel input sizes, or equal sizes when none are set. |
| `focusHandle` | `(index: number, options?: FocusOptions) =&gt; void` | `-` | Moves focus to a resize separator by index. |

## Interfaces and types

### Interfaces

```ts
type AerisSplitterOrientation = 'horizontal' | 'vertical';
type AerisSplitterVariant = 'outlined' | 'filled' | 'plain';
type AerisSplitterSize = 'sm' | 'md' | 'lg';
type AerisSplitterDivider = 'handle' | 'line';

interface AerisSplitterResizeEvent {
  readonly originalEvent: Event | null;
  readonly sizes: readonly number[];
  readonly previousSizes: readonly number[];
  readonly index: number;
  readonly nextIndex: number;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-splitter-background` | `CSS custom property` | `--aeris-surface` | Root surface. |
| `--aeris-splitter-color` | `CSS custom property` | `--aeris-text` | Root text color. |
| `--aeris-splitter-border` | `CSS custom property` | `--aeris-border` | Root border color. |
| `--aeris-splitter-border-width` | `CSS custom property` | `1px` | Root border thickness. |
| `--aeris-splitter-radius` | `CSS custom property` | `--aeris-radius-lg` | Root corner radius. |
| `--aeris-splitter-shadow` | `CSS custom property` | `none` | Root elevation. |
| `--aeris-splitter-filled-background` | `CSS custom property` | `surface mix` | Filled variant surface. |
| `--aeris-splitter-panel-background` | `CSS custom property` | `transparent` | Panel surface. |
| `--aeris-splitter-panel-color` | `CSS custom property` | `--aeris-text-2` | Panel text color. |
| `--aeris-splitter-panel-padding` | `CSS custom property` | `1rem` | Panel padding. |
| `--aeris-splitter-gutter-size` | `CSS custom property` | `0.75rem` | Default gutter thickness. |
| `--aeris-splitter-gutter-background` | `CSS custom property` | `transparent` | Idle gutter surface. |
| `--aeris-splitter-gutter-hover-background` | `CSS custom property` | `primary mix` | Hover, focus, and drag gutter surface. |
| `--aeris-splitter-divider-color` | `CSS custom property` | `border mix` | Full divider line color. |
| `--aeris-splitter-divider-thickness` | `CSS custom property` | `1px` | Full divider line thickness. |
| `--aeris-splitter-handle-color` | `CSS custom property` | `text mix` | Idle handle color. |
| `--aeris-splitter-handle-hover-color` | `CSS custom property` | `--aeris-primary-text` | Hover, focus, and drag handle color. |
| `--aeris-splitter-handle-length` | `CSS custom property` | `2rem` | Visible handle length. |
| `--aeris-splitter-handle-thickness` | `CSS custom property` | `0.1875rem` | Visible handle thickness. |
| `--aeris-splitter-focus-ring` | `CSS custom property` | `--aeris-focus` | Keyboard focus ring. |

## Examples

### Basic

Create a horizontal splitter with two percentage-sized panels. With no constraints, either side can collapse fully to the edge handle.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-basic-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-basic.demo.html',
  styleUrl: './splitter-basic.demo.scss'
})
export class SplitterBasicBasicDemo {
}
```

#### HTML

```html
<div>
  <aeris-splitter height="16rem" ariaLabel="Basic workspace">
    <aeris-splitter-panel ariaLabel="Navigation" [size]="30">
      <div class="splitter-pane">
        <strong>Navigation</strong>
        <span>Drag to the edge to fully collapse this panel.</span>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Content" [size]="70">
      <div class="splitter-pane">
        <strong>Content</strong>
        <span>The handle remains available at the edge.</span>
      </div>
    </aeris-splitter-panel>
  </aeris-splitter>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Vertical

Stack panels vertically by changing the orientation.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-vertical-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-vertical.demo.html',
  styleUrl: './splitter-vertical.demo.scss'
})
export class SplitterVerticalVerticalDemo {
}
```

#### HTML

```html
<div>
  <aeris-splitter orientation="vertical" height="22rem" ariaLabel="Dashboard areas">
    <aeris-splitter-panel ariaLabel="Charts" [size]="58">
      <div class="dashboard-pane">
        <div class="dashboard-card">
          <strong>Revenue</strong><span>$42.8k this month</span>
        </div>
        <div class="dashboard-card">
          <strong>Conversion</strong><span>7.4% from active campaigns</span>
        </div>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Activity" [size]="42">
      <div class="dashboard-pane">
        <div class="dashboard-card">
          <strong>Activity</strong><span>12 reviews waiting for approval.</span>
        </div>
      </div>
    </aeris-splitter-panel>
  </aeris-splitter>
</div>
```

#### CSS

```css
.dashboard-pane {
  display: grid;
  gap: 0.75rem;
}

.dashboard-card {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}

.dashboard-card strong {
  display: block;
  color: var(--text);
}
```

### Divider

Use handle-only separators for minimal layouts or full divider lines when stronger separation is needed.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-divider-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-divider.demo.html',
  styleUrl: './splitter-divider.demo.scss'
})
export class SplitterDividerDividerDemo {
}
```

#### HTML

```html
<div>
  <div class="splitter-grid">
    <aeris-splitter height="10rem" ariaLabel="Handle-only splitter">
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Handle only</strong><span>Default minimal divider.</span>
        </div></aeris-splitter-panel
      >
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Panel</strong><span>Resize from the handle.</span>
        </div></aeris-splitter-panel
      >
    </aeris-splitter>
    <aeris-splitter height="10rem" divider="line" ariaLabel="Line splitter">
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Full line</strong><span>Divider line with centered handle.</span>
        </div></aeris-splitter-panel
      >
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Panel</strong><span>Useful for dense surfaces.</span>
        </div></aeris-splitter-panel
      >
    </aeris-splitter>
  </div>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--aeris-text);
}

.splitter-pane span {
  color: var(--aeris-text-2);
  font-size: 0.875rem;
}

.splitter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 52rem) {
  .splitter-grid {
      grid-template-columns: 1fr;
    }
}

.splitter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 52rem) {
  .splitter-grid {
    grid-template-columns: 1fr;
  }
}

.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Controlled

Bind the sizes model and update it from application controls or resize events.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisSplitterModule, type AerisSplitterResizeEvent } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-controlled-demo',
  imports: [AerisButton, AerisSplitterModule],
  templateUrl: './splitter-controlled.demo.html',
  styleUrl: './splitter-controlled.demo.scss'
})
export class SplitterControlledControlledDemo {
  protected controlledSizes = signal<readonly number[]>([30, 45, 25]);
  protected lastResize = '30 / 45 / 25';

  protected setBalancedLayout(): void {
    this.controlledSizes.set([33.333, 33.333, 33.334]);
  }

  protected setFocusLayout(): void {
    this.controlledSizes.set([20, 60, 20]);
  }

  protected recordResize(event: AerisSplitterResizeEvent): void {
    this.controlledSizes.set(event.sizes);
    this.lastResize = event.sizes.map((size) => Math.round(size)).join(' / ');
  }
}
```

#### HTML

```html
<div>
  <div class="splitter-actions">
    <button aerisButton type="button" size="sm" (click)="setBalancedLayout()">
      Balance
    </button>
    <button
      aerisButton
      type="button"
      size="sm"
      variant="secondary"
      (click)="setFocusLayout()"
    >
      Focus content
    </button>
  </div>
  <aeris-splitter
    height="15rem"
    [sizes]="controlledSizes()"
    (resized)="recordResize($event)"
    ariaLabel="Controlled workspace"
  >
    <aeris-splitter-panel ariaLabel="Folders">
      <div class="splitter-pane">
        <strong>Folders</strong><span>Inbox, review, archive.</span>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Message">
      <div class="splitter-pane">
        <strong>Message</strong><span>Resize events update the signal.</span>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Inspector">
      <div class="splitter-pane">
        <strong>Inspector</strong><span>Metadata and actions.</span>
      </div>
    </aeris-splitter-panel>
  </aeris-splitter>
  <p class="splitter-status" role="status" aria-live="polite">
    Sizes: {{ lastResize }}
  </p>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--aeris-text);
}

.splitter-pane span {
  color: var(--aeris-text-2);
  font-size: 0.875rem;
}

.splitter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 0.875rem;
}

.splitter-status {
  margin: 0.75rem 0 0;
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

.splitter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 0.875rem;
}

.splitter-status {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}

.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Constraints

Use panel min and max sizes to preserve useful space.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-constraints-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-constraints.demo.html',
  styleUrl: './splitter-constraints.demo.scss'
})
export class SplitterConstraintsConstraintsDemo {
}
```

#### HTML

```html
<div>
  <aeris-splitter height="14rem" ariaLabel="Constrained workspace">
    <aeris-splitter-panel
      ariaLabel="Navigation"
      [size]="25"
      [minSize]="20"
      [maxSize]="35"
    >
      <div class="splitter-pane">
        <strong>20-35%</strong><span>Navigation cannot collapse too far.</span>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Main area" [size]="75" [minSize]="45">
      <div class="splitter-pane">
        <strong>Minimum 45%</strong><span>Main content keeps readable width.</span>
      </div>
    </aeris-splitter-panel>
  </aeris-splitter>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Disabled handles

Disable every handle from the splitter or a specific adjacent panel.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-disabled-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-disabled.demo.html',
  styleUrl: './splitter-disabled.demo.scss'
})
export class SplitterDisabledDisabledHandlesDemo {
}
```

#### HTML

```html
<div>
  <aeris-splitter height="13rem" ariaLabel="Locked workspace">
    <aeris-splitter-panel
      ariaLabel="Locked navigation"
      [size]="35"
      [resizable]="false"
    >
      <div class="splitter-pane">
        <strong>Locked</strong><span>This panel disables the adjacent handle.</span>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Content" [size]="65">
      <div class="splitter-pane">
        <strong>Content</strong><span>The handle is exposed as disabled.</span>
      </div>
    </aeris-splitter-panel>
  </aeris-splitter>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Nested

Place a splitter inside a panel when a layout needs two resize axes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-nested-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-nested.demo.html',
  styleUrl: './splitter-nested.demo.scss'
})
export class SplitterNestedNestedDemo {
}
```

#### HTML

```html
<div>
  <aeris-splitter height="22rem" ariaLabel="Mail workspace">
    <aeris-splitter-panel ariaLabel="Message list" [size]="32">
      <div class="mail-pane">
        <div class="mail-row">
          <strong>Design review</strong><span>Today at 10:30</span>
        </div>
        <div class="mail-row">
          <strong>Release notes</strong><span>Yesterday at 16:20</span>
        </div>
        <div class="mail-row">
          <strong>QA report</strong><span>Monday at 09:15</span>
        </div>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Message detail" [size]="68">
      <aeris-splitter
        class="mail-detail-splitter"
        orientation="vertical"
        height="100%"
        variant="plain"
        ariaLabel="Message detail sections"
      >
        <aeris-splitter-panel ariaLabel="Message body" [size]="64">
          <div class="mail-pane">
            <strong>Message body</strong
            ><span>Review the latest component audit and screenshots.</span>
          </div>
        </aeris-splitter-panel>
        <aeris-splitter-panel ariaLabel="Thread notes" [size]="36">
          <div class="mail-pane">
            <strong>Thread notes</strong
            ><span>Three linked tasks and two approvals.</span>
          </div>
        </aeris-splitter-panel>
      </aeris-splitter>
    </aeris-splitter-panel>
  </aeris-splitter>
</div>
```

#### CSS

```css
.mail-pane {
  display: grid;
  gap: 0.625rem;
}

.mail-row {
  padding: 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}

.mail-row strong {
  display: block;
  color: var(--text);
}

.mail-detail-splitter {
  display: block;
  block-size: 100%;
}
```

### Variants

Match surrounding surfaces with outlined, filled, or plain variants.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-variants-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-variants.demo.html',
  styleUrl: './splitter-variants.demo.scss'
})
export class SplitterVariantsVariantsDemo {
}
```

#### HTML

```html
<div>
  <div class="splitter-grid">
    <aeris-splitter height="9rem" ariaLabel="Outlined splitter">
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Outlined</strong><span>Default border.</span>
        </div></aeris-splitter-panel
      >
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Panel</strong><span>Resizable.</span>
        </div></aeris-splitter-panel
      >
    </aeris-splitter>
    <aeris-splitter height="9rem" variant="filled" ariaLabel="Filled splitter">
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Filled</strong><span>Soft surface.</span>
        </div></aeris-splitter-panel
      >
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Panel</strong><span>Resizable.</span>
        </div></aeris-splitter-panel
      >
    </aeris-splitter>
    <aeris-splitter height="9rem" variant="plain" ariaLabel="Plain splitter">
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Plain</strong><span>No outer border.</span>
        </div></aeris-splitter-panel
      >
      <aeris-splitter-panel
        ><div class="splitter-pane">
          <strong>Panel</strong><span>Resizable.</span>
        </div></aeris-splitter-panel
      >
    </aeris-splitter>
  </div>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--aeris-text);
}

.splitter-pane span {
  color: var(--aeris-text-2);
  font-size: 0.875rem;
}

.splitter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 52rem) {
  .splitter-grid {
      grid-template-columns: 1fr;
    }
}

.splitter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 52rem) {
  .splitter-grid {
    grid-template-columns: 1fr;
  }
}

.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

### Token customization

Use component tokens to tune the surface, handle, gutter, and panel spacing.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisSplitterModule } from '@aeris-ui/core/splitter';

@Component({
  selector: 'app-splitter-tokens-demo',
  imports: [AerisSplitterModule],
  templateUrl: './splitter-tokens.demo.html',
  styleUrl: './splitter-tokens.demo.scss'
})
export class SplitterTokensTokenCustomizationDemo {
}
```

#### HTML

```html
<div>
  <aeris-splitter
    class="brand-splitter"
    height="14rem"
    divider="line"
    ariaLabel="Custom themed splitter"
  >
    <aeris-splitter-panel ariaLabel="Primary panel" [size]="38">
      <div class="splitter-pane">
        <strong>Branded surface</strong
        ><span>Custom border, radius, and handle.</span>
      </div>
    </aeris-splitter-panel>
    <aeris-splitter-panel ariaLabel="Secondary panel" [size]="62">
      <div class="splitter-pane">
        <strong>Resizable panel</strong
        ><span>The tokens follow palette and theme changes.</span>
      </div>
    </aeris-splitter-panel>
  </aeris-splitter>
</div>
```

#### CSS

```css
.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--aeris-text);
}

.splitter-pane span {
  color: var(--aeris-text-2);
  font-size: 0.875rem;
}

.brand-splitter {
  --aeris-splitter-background: color-mix(in srgb, var(--aeris-primary) 9%, var(--aeris-surface));
  --aeris-splitter-border-width: 2px;
  --aeris-splitter-border: color-mix(in srgb, var(--aeris-primary) 70%, var(--aeris-border));
  --aeris-splitter-radius: 1.5rem;
  --aeris-splitter-gutter-size: 1rem;
  --aeris-splitter-gutter-hover-background: color-mix(in srgb, var(--aeris-primary) 22%, transparent);
  --aeris-splitter-divider-color: color-mix(in srgb, var(--aeris-primary) 46%, transparent);
  --aeris-splitter-divider-thickness: 2px;
  --aeris-splitter-handle-color: color-mix(in srgb, var(--aeris-primary) 48%, transparent);
  --aeris-splitter-handle-hover-color: var(--aeris-primary-text);
  --aeris-splitter-handle-length: 3rem;
  --aeris-splitter-panel-padding: 1.25rem;
}

.brand-splitter {
  --aeris-splitter-background: color-mix(in srgb, var(--aeris-primary) 9%, var(--surface));
  --aeris-splitter-border-width: 2px;
  --aeris-splitter-border: color-mix(in srgb, var(--aeris-primary) 70%, var(--border));
  --aeris-splitter-radius: 1.5rem;
  --aeris-splitter-gutter-size: 1rem;
  --aeris-splitter-gutter-hover-background: color-mix(in srgb, var(--aeris-primary) 22%, transparent);
  --aeris-splitter-divider-color: color-mix(in srgb, var(--aeris-primary) 46%, transparent);
  --aeris-splitter-divider-thickness: 2px;
  --aeris-splitter-handle-color: color-mix(in srgb, var(--aeris-primary) 48%, transparent);
  --aeris-splitter-handle-hover-color: var(--aeris-primary-text);
  --aeris-splitter-handle-length: 3rem;
  --aeris-splitter-panel-padding: 1.25rem;
}

.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}
```

## Accessibility

- Splitter renders each handle with role="separator", aria-orientation, aria-valuemin, aria-valuemax, and aria-valuenow.
- Handles reference the adjacent panels with aria-controls.
- Pointer resizing and keyboard resizing update the same controlled sizes model and emit the same resize event payload.
- Keyboard resizing uses a predictable percentage step instead of animation so each key press has a clear, announced value change. Adjust step for finer or larger increments.
- Disabled splitters and non-resizable adjacent panels expose disabled separators and do not resize.
- Use ariaLabel or ariaLabelledBy when the splitter is a meaningful region or group.
- Motion is limited to subtle color transitions and respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus to resize separators and projected interactive content. |
| `Arrow Left` | Shrinks the panel before a horizontal separator by step. |
| `Arrow Right` | Expands the panel before a horizontal separator by step. |
| `Arrow Up` | Shrinks the panel before a vertical separator by step. |
| `Arrow Down` | Expands the panel before a vertical separator by step. |
| `Home` | Moves the separator to the minimum allowed value. |
| `End` | Moves the separator to the maximum allowed value. |
| `Escape` | No built-in behavior. |
