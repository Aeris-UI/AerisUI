# Toolbar

> Dedicated actions, toggles, selection groups, and menu triggers with attached and vertical layouts.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/toolbar`
- Human-readable documentation: [https://aeris-ui.dev/components/toolbar](https://aeris-ui.dev/components/toolbar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `floating` | `boolean` | `false` | Floats on a surfaced, elevated background instead of participating in document flow. Non-modal: no backdrop, focus trap, or automatic focus on opening. |
| `visible` | `boolean` | `true` | Controls visibility. Hidden toolbars are inert and excluded from accessibility navigation immediately; floating toolbars animate their entrance and exit. Keep the toolbar mounted while changing this input to allow the exit animation. |
| `position` | `'top' &#124; 'bottom'` | `'bottom'` | Centered floating placement. Options: top, bottom. Has no effect on inline toolbars. |
| `floatingScope` | `'viewport' &#124; 'container'` | `'viewport'` | Viewport mounts the toolbar under document.body to avoid ancestor clipping and transforms and follows the visual viewport. Container uses absolute positioning inside the nearest positioned ancestor; use aerisToolbarContainer on that region. Options: viewport, container. |
| `restoreFocusTo` | `HTMLElement &#124; null` | `null` | Optional focus destination when the toolbar hides while focus is inside it. Otherwise restores the element focused when it appeared. Does not move focus if the user has already focused another control. The target must be connected, focusable, and not hidden or inert. |
| `id` | `string` | `''` | Optional host ID. |
| `variant` | `'plain' &#124; 'outlined' &#124; 'filled' &#124; 'elevated'` | `'plain'` | Surface treatment. Plain is transparent unless attached is enabled. |
| `attached` | `boolean` | `false` | Places controls on a unified, subtly bordered surface. |
| `size` | `'sm' &#124; 'md' &#124; 'lg'` | `'md'` | Sets the dedicated control height, padding, and spacing. |
| `orientation` | `'horizontal' &#124; 'vertical'` | `'horizontal'` | Layout and keyboard navigation axis. Separators automatically use the perpendicular orientation. |
| `align` | `'start' &#124; 'center' &#124; 'end' &#124; 'stretch'` | `'center'` | Cross-axis alignment of projected content. |
| `wrap` | `boolean` | `false` | Wraps controls instead of scrolling. Non-wrapping content shows directional overflow fades. |
| `fluid` | `boolean` | `false` | Fills the available inline size; otherwise fits its content, bounded by its container. |
| `disabled` | `boolean` | `false` | Disables dedicated controls and makes the entire subtree inert. |
| `role` | `'toolbar' &#124; 'group' &#124; null` | `'toolbar'` | Toolbar enables coordinated navigation. Group or null preserves normal tab stops. |
| `ariaLabel` | `string` | `''` | Accessible name; required when no visible label is referenced. |
| `ariaLabelledBy` | `string` | `''` | ID of a visible label. |
| `ariaDescribedBy` | `string` | `''` | ID of supplementary instructions. |

### Item Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Disables this native button; toolbar and group disabled states are also respected. |
| `iconOnly` | `boolean` | `false` | Square geometry for an icon-only control. Supply an aria-label. |
| `pressed` | `boolean &#124; null` | `null` | Two-way model. Null is an action; false or true opts into an independent toggle. Selection groups own their item states instead. |
| `pressedChange` | `boolean &#124; null` | `—` | Model output emitted when the independent toggle changes. |
| `value` | `string &#124; null` | `null` | Unique key within a selection group; not needed for standalone actions or toggles. |
| `menu` | `boolean` | `false` | Exposes menu-trigger semantics. ArrowDown opens horizontal triggers through their native click handler. |
| `expanded` | `boolean` | `false` | Controlled menu visibility. Synchronize it with the menu opened and closed events. |
| `ariaControls` | `string` | `''` | ID of the controlled menu, when applicable. |
| `focus(options?)` | `(options?: FocusOptions) =&gt; void` | `—` | Focuses this item without activating it. |

### Group Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionMode` | `'none' &#124; 'single' &#124; 'multiple'` | `'none'` | None groups actions; single selects one keyed item; multiple toggles keyed items independently. Arrow navigation does not change selection. |
| `value` | `AerisToolbarValue` | `null` | Two-way selection model: string or null for single, readonly string[] for multiple. |
| `valueChange` | `AerisToolbarValue` | `—` | Model output emitted when group selection changes. |
| `allowEmpty` | `boolean` | `false` | Allows the selected item in a single-selection group to be toggled off. Multiple selection always permits an empty array. |
| `attached` | `boolean` | `false` | Joins group controls with a common outline and stationary internal separators. |
| `disabled` | `boolean` | `false` | Disables the group controls while leaving other groups available. |
| `ariaLabel` | `string` | `''` | Accessible group name. |
| `ariaLabelledBy` | `string` | `''` | ID of a visible group label. |

### Slots

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisToolbarItem` | `button directive` | `—` | Dedicated toolbar action, toggle, selection item, or menu trigger. Does not require aerisButton. |
| `aerisToolbarGroup` | `attribute directive` | `—` | Semantic group with optional selection and attached styling. |
| `aerisToolbarSeparator` | `attribute directive` | `—` | Non-focusable separator; its orientation follows the toolbar. |
| `aerisToolbarContainer` | `attribute directive` | `—` | Establishes a positioned, isolated region for container-scoped floating toolbars. Place scrollable content inside this region to keep the toolbar anchored to its visible frame. |
| `aerisToolbarLabel` | `attribute directive` | `—` | Visually hides action text below 40rem while keeping the accessible button name. Use alongside a decorative icon; never apply to an iconless action. |
| `aerisToolbarStart` | `attribute directive` | `—` | Leading content section. |
| `aerisToolbarCenter` | `attribute directive` | `—` | Middle content section. |
| `aerisToolbarEnd` | `attribute directive` | `—` | Trailing content section. |
| `aerisToolbarSpacer` | `attribute directive` | `—` | Flexible space between controls or groups. |
| `default content` | `content projection` | `—` | Controls and custom content; projected inputs retain native editing and normal tab stops. |
| `focus(options?)` | `(options?: FocusOptions) =&gt; void` | `—` | Toolbar method: focuses the last available item, or the first enabled item initially. |

## Interfaces and types

### Interface

```ts
type AerisToolbarVariant = 'plain' | 'outlined' | 'filled' | 'elevated';
type AerisToolbarSize = 'sm' | 'md' | 'lg';
type AerisToolbarOrientation = 'horizontal' | 'vertical';
type AerisToolbarAlign = 'start' | 'center' | 'end' | 'stretch';
type AerisToolbarRole = 'toolbar' | 'group' | null;
type AerisToolbarSelectionMode = 'none' | 'single' | 'multiple';
type AerisToolbarValue = string | readonly string[] | null;
type AerisToolbarPosition = 'top' | 'bottom';
type AerisToolbarFloatingScope = 'viewport' | 'container';
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-toolbar-floating-offset` | `CSS length` | `1rem` | Distance from the selected edge and minimum inline clearance. Viewport placement also respects safe-area insets. Increase to accommodate fixed headers or bottom navigation. |
| `--aeris-toolbar-floating-radius` | `CSS value` | `--aeris-radius-control` | Floating surface corner radius. Wrapping surfaces derive their radius from item corners, size, padding and border width. |
| `--aeris-toolbar-floating-shadow` | `CSS value` | `--aeris-shadow-md` | Floating surface elevation. |
| `--aeris-toolbar-floating-z-index` | `CSS value` | `1000` | Container stacking order. Viewport mounting uses the shared Aeris overlay stacking order. |
| `--aeris-toolbar-font-size` | `CSS value` | `--aeris-body-font-size` | Toolbar and dedicated-control text size. |
| `--aeris-toolbar-background` | `CSS value` | `--aeris-surface` | Attached, outlined and elevated surface; also the overflow fade color. |
| `--aeris-toolbar-color` | `CSS value` | `--aeris-text` | Text and icon color. |
| `--aeris-toolbar-border` | `CSS value` | `--aeris-border` | Surface and attached group outlines. |
| `--aeris-toolbar-border-width` | `CSS value` | `1px` | Surface border width. |
| `--aeris-toolbar-radius` | `CSS value` | `--aeris-radius-control` | Surface corner radius. When wrap is enabled, the default is the rendered item radius plus the surrounding padding and border width, keeping nested corners aligned. |
| `--aeris-toolbar-shadow` | `CSS value` | `none` | Optional toolbar shadow. |
| `--aeris-toolbar-filled-background` | `CSS value` | `--aeris-surface-2` | Filled variant surface. |
| `--aeris-toolbar-elevated-shadow` | `CSS value` | `--aeris-shadow-md` | Elevated variant shadow. |
| `--aeris-toolbar-padding-block` | `CSS value` | `--aeris-overlay-padding` | Default block padding. |
| `--aeris-toolbar-padding-inline` | `CSS value` | `--aeris-overlay-padding` | Default inline padding. |
| `--aeris-toolbar-gap` | `CSS value` | `0.625rem` | Space between groups or standalone controls. |
| `--aeris-toolbar-section-gap` | `CSS value` | `0.25rem` | Space within groups and sections. |
| `--aeris-toolbar-item-size` | `CSS value` | `--aeris-control-height-sm` | Dedicated item size; sm subtracts 0.25rem, lg uses --aeris-control-height. Coarse pointers keep a 44px minimum. |
| `--aeris-toolbar-item-gap` | `CSS value` | `0.5rem` | Space between an item icon and its label. |
| `--aeris-toolbar-item-padding` | `CSS value` | `0.625rem` | Item inline padding. |
| `--aeris-toolbar-item-radius` | `CSS value` | `--aeris-radius-control` | Item corner radius. |
| `--aeris-toolbar-icon-size` | `CSS value` | `--aeris-icon-size` | Projected SVG icon dimensions. |
| `--aeris-toolbar-item-hover-background` | `CSS value` | `7% text mix` | Fine-pointer hover background. |
| `--aeris-toolbar-item-pressed-background` | `CSS value` | `--aeris-surface-3` | Pressed, selected and expanded item background. |
| `--aeris-toolbar-item-pressed-color` | `CSS value` | `--aeris-text` | Pressed, selected and expanded item foreground. |
| `--aeris-toolbar-separator-color` | `CSS value` | `--aeris-border` | Separator color. |
| `--aeris-toolbar-min-height` | `CSS value` | `auto` | Minimum content-row height. |
| `--aeris-toolbar-max-height` | `CSS value` | `none` | Maximum viewport height, useful for scrollable vertical palettes. |
| `--aeris-toolbar-spacer-min-size` | `CSS value` | `1rem` | Minimum flexible-spacer size. |
| `--aeris-toolbar-disabled-opacity` | `CSS value` | `0.62` | Disabled toolbar opacity. |
| `--aeris-toolbar-padding-block-sm` | `CSS value` | `0.25rem` | sm block padding. |
| `--aeris-toolbar-padding-inline-sm` | `CSS value` | `0.25rem` | sm inline padding. |
| `--aeris-toolbar-gap-sm` | `CSS value` | `0.5rem` | sm inter-group gap. |
| `--aeris-toolbar-section-gap-sm` | `CSS value` | `0.125rem` | sm intra-group gap. |
| `--aeris-toolbar-padding-block-lg` | `CSS value` | `0.5rem` | lg block padding. |
| `--aeris-toolbar-padding-inline-lg` | `CSS value` | `0.5rem` | lg inline padding. |
| `--aeris-toolbar-gap-lg` | `CSS value` | `0.75rem` | lg inter-group gap. |
| `--aeris-toolbar-section-gap-lg` | `CSS value` | `0.375rem` | lg intra-group gap. |

## Examples

### Actions

Toolbar actions use their own compact controls, not Aeris Button.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-basic-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-basic.demo.html',
  styleUrl: './toolbar-basic.demo.scss'
})
export class ToolbarBasicDemo {
  protected readonly minusIcon = LucideMinus;

  protected readonly plusIcon = LucidePlus;

  protected readonly resetIcon = LucideRotateCcw;

  protected readonly zoom = signal(100);

  protected zoomOut(): void {
      this.zoom.update((value) => Math.max(50, value - 10));
    }

  protected zoomIn(): void {
      this.zoom.update((value) => Math.min(150, value + 10));
    }
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar attached ariaLabel="Zoom controls">
      <button
        aerisToolbarItem
        iconOnly
        aria-label="Zoom out"
        [disabled]="zoom() <= 50"
        (click)="zoomOut()"
      >
        <svg [lucideIcon]="minusIcon" aria-hidden="true"></svg>
      </button>
      <output class="toolbar-reading" aria-live="polite">{{ zoom() }}%</output>
      <button
        aerisToolbarItem
        iconOnly
        aria-label="Zoom in"
        [disabled]="zoom() >= 150"
        (click)="zoomIn()"
      >
        <svg [lucideIcon]="plusIcon" aria-hidden="true"></svg>
      </button>
      <span aerisToolbarSeparator></span>
      <button aerisToolbarItem iconOnly aria-label="Reset zoom" (click)="zoom.set(100)">
        <svg [lucideIcon]="resetIcon" aria-hidden="true"></svg>
      </button>
    </aeris-toolbar>
    <p class="toolbar-note">Zoom range: 50–150%.</p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}

.toolbar-reading {
  min-inline-size: 3.5rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
```

### Independent toggles

Bind pressed to enable an independent toggle.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-toggles-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-toggles.demo.html',
  styleUrl: './toolbar-toggles.demo.scss'
})
export class ToolbarTogglesDemo {
  protected readonly boldIcon = LucideBold;

  protected readonly italicIcon = LucideItalic;

  protected readonly underlineIcon = LucideUnderline;

  protected readonly bold = signal(false);

  protected readonly italic = signal(false);

  protected readonly underline = signal(false);
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar ariaLabel="Text formatting">
      <button aerisToolbarItem iconOnly aria-label="Bold" [(pressed)]="bold">
        <svg [lucideIcon]="boldIcon" aria-hidden="true"></svg>
      </button>
      <button aerisToolbarItem iconOnly aria-label="Italic" [(pressed)]="italic">
        <svg [lucideIcon]="italicIcon" aria-hidden="true"></svg>
      </button>
      <button aerisToolbarItem iconOnly aria-label="Underline" [(pressed)]="underline">
        <svg [lucideIcon]="underlineIcon" aria-hidden="true"></svg>
      </button>
    </aeris-toolbar>
    <p
      class="toolbar-preview"
      [style.font-weight]="bold() ? 700 : 400"
      [style.font-style]="italic() ? 'italic' : 'normal'"
      [style.text-decoration]="underline() ? 'underline' : 'none'"
    >
      A little room for a better idea.
    </p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-preview {
  box-sizing: border-box;
  margin: 0;
  padding: 1.25rem;
  inline-size: 100%;
  border-radius: var(--aeris-radius-surface);
  background: var(--aeris-surface-2);
  line-height: 1.7;
}

.toolbar-vertical-demo .toolbar-preview {
  display: grid;
  place-items: center;
  min-inline-size: 0;
}
```

### Groups and selection

Single selection keeps one value; multiple selection maintains an array. Arrows move focus without selecting.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisToolbarModule, type AerisToolbarValue } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-groups-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-groups.demo.html',
  styleUrl: './toolbar-groups.demo.scss'
})
export class ToolbarGroupsDemo {
  protected readonly boldIcon = LucideBold;

  protected readonly italicIcon = LucideItalic;

  protected readonly underlineIcon = LucideUnderline;

  protected readonly leftIcon = LucideAlignLeft;

  protected readonly centerIcon = LucideAlignCenter;

  protected readonly rightIcon = LucideAlignRight;

  protected readonly bold = signal(false);

  protected readonly alignment = signal<AerisToolbarValue>('start');

  protected readonly alignmentStyle = computed(() => String(this.alignment() ?? 'start'));

  protected readonly formats = signal<AerisToolbarValue>(['bold']);
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar ariaLabel="Paragraph controls">
      <div
        aerisToolbarGroup
        selectionMode="single"
        [(value)]="alignment"
        ariaLabel="Alignment"
        attached
      >
        <button aerisToolbarItem iconOnly aria-label="Align start" value="start">
          <svg [lucideIcon]="leftIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Align center" value="center">
          <svg [lucideIcon]="centerIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Align end" value="end">
          <svg [lucideIcon]="rightIcon" aria-hidden="true"></svg>
        </button>
      </div>
      <span aerisToolbarSeparator></span>
      <div
        aerisToolbarGroup
        selectionMode="multiple"
        [(value)]="formats"
        ariaLabel="Formats"
      >
        <button aerisToolbarItem iconOnly aria-label="Bold" value="bold">
          <svg [lucideIcon]="boldIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Italic" value="italic">
          <svg [lucideIcon]="italicIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Underline" value="underline">
          <svg [lucideIcon]="underlineIcon" aria-hidden="true"></svg>
        </button>
      </div>
    </aeris-toolbar>
    <p class="toolbar-preview" [style.text-align]="alignmentStyle()">
      Alignment: {{ alignment() }}. Formats: {{ formats() }}.
    </p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-preview {
  box-sizing: border-box;
  margin: 0;
  padding: 1.25rem;
  inline-size: 100%;
  border-radius: var(--aeris-radius-surface);
  background: var(--aeris-surface-2);
  line-height: 1.7;
}

.toolbar-vertical-demo .toolbar-preview {
  display: grid;
  place-items: center;
  min-inline-size: 0;
}
```

### Attached surface

Attach the toolbar to give its controls a unified surface. Groups can also be attached independently.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-attached-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-attached.demo.html',
  styleUrl: './toolbar-attached.demo.scss'
})
export class ToolbarAttachedDemo {
  protected readonly boldIcon = LucideBold;

  protected readonly italicIcon = LucideItalic;

  protected readonly underlineIcon = LucideUnderline;

  protected readonly attachedBold = signal(true);

  protected readonly attachedItalic = signal(false);

  protected readonly attachedUnderline = signal(false);
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar attached ariaLabel="Attached formatting">
      <button aerisToolbarItem iconOnly aria-label="Bold" [(pressed)]="attachedBold">
        <svg [lucideIcon]="boldIcon" aria-hidden="true"></svg>
      </button>
      <button aerisToolbarItem iconOnly aria-label="Italic" [(pressed)]="attachedItalic">
        <svg [lucideIcon]="italicIcon" aria-hidden="true"></svg>
      </button>
      <button
        aerisToolbarItem
        iconOnly
        aria-label="Underline"
        [(pressed)]="attachedUnderline"
      >
        <svg [lucideIcon]="underlineIcon" aria-hidden="true"></svg>
      </button>
    </aeris-toolbar>
    <p
      class="toolbar-preview"
      [style.font-weight]="attachedBold() ? 700 : 400"
      [style.font-style]="attachedItalic() ? 'italic' : 'normal'"
      [style.text-decoration]="attachedUnderline() ? 'underline' : 'none'"
    >
      Everything in its place.
    </p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-preview {
  box-sizing: border-box;
  margin: 0;
  padding: 1.25rem;
  inline-size: 100%;
  border-radius: var(--aeris-radius-surface);
  background: var(--aeris-surface-2);
  line-height: 1.7;
}

.toolbar-vertical-demo .toolbar-preview {
  display: grid;
  place-items: center;
  min-inline-size: 0;
}
```

### Vertical

Up and Down navigate vertical controls. Separators automatically follow the layout.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule, type AerisToolbarValue } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-vertical-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-vertical.demo.html',
  styleUrl: './toolbar-vertical.demo.scss'
})
export class ToolbarVerticalDemo {
  protected readonly pointerIcon = LucideMousePointer;

  protected readonly pencilIcon = LucidePencil;

  protected readonly eraserIcon = LucideEraser;

  protected readonly resetIcon = LucideRotateCcw;

  protected readonly tool = signal<AerisToolbarValue>('select');
}
```

#### HTML

```html
<div>
  <div class="toolbar-vertical-demo">
    <aeris-toolbar attached orientation="vertical" ariaLabel="Drawing tools">
      <div aerisToolbarGroup selectionMode="single" [(value)]="tool" ariaLabel="Tool">
        <button aerisToolbarItem iconOnly aria-label="Select" value="select">
          <svg [lucideIcon]="pointerIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Draw" value="draw">
          <svg [lucideIcon]="pencilIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Erase" value="erase">
          <svg [lucideIcon]="eraserIcon" aria-hidden="true"></svg>
        </button>
      </div>
      <span aerisToolbarSeparator></span>
      <button
        aerisToolbarItem
        iconOnly
        aria-label="Reset tool"
        (click)="tool.set('select')"
      >
        <svg [lucideIcon]="resetIcon" aria-hidden="true"></svg>
      </button>
    </aeris-toolbar>
    <p class="toolbar-preview" aria-live="polite">Selected tool: {{ tool() }}.</p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-preview {
  box-sizing: border-box;
  margin: 0;
  padding: 1.25rem;
  inline-size: 100%;
  border-radius: var(--aeris-radius-surface);
  background: var(--aeris-surface-2);
  line-height: 1.7;
}

.toolbar-vertical-demo {
  display: flex;
  align-items: stretch;
  gap: 1.25rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-vertical-demo .toolbar-preview {
  display: grid;
  place-items: center;
  min-inline-size: 0;
}
```

### Menu trigger

Synchronize expanded with the menu events. Append floating content to body when its toolbar scrolls.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-menu-demo',
  imports: [AerisMenuModule, AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-menu.demo.html',
  styleUrl: './toolbar-menu.demo.scss'
})
export class ToolbarMenuDemo {
  protected readonly chevronIcon = LucideChevronDown;

  protected readonly downloadIcon = LucideDownload;

  protected readonly shareIcon = LucideShare2;

  protected readonly lastAction = signal('Choose an action.');

  protected readonly menuOpen = signal(false);

  protected readonly menuItems: readonly AerisMenuItem[] = [
      {
        id: 'pdf',
        label: 'PDF document',
        command: () => this.lastAction.set('PDF export selected.'),
      },
      {
        id: 'csv',
        label: 'CSV spreadsheet',
        command: () => this.lastAction.set('CSV export selected.'),
      },
    ];
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar attached ariaLabel="Document actions">
      <button
        aerisToolbarItem
        menu
        [expanded]="menuOpen()"
        [ariaControls]="actionMenu.id()"
        (click)="actionMenu.toggle($event)"
      >
        <svg [lucideIcon]="downloadIcon" aria-hidden="true"></svg>
        Export
        <svg [lucideIcon]="chevronIcon" aria-hidden="true"></svg>
      </button>
      <button aerisToolbarItem (click)="lastAction.set('Share link copied.')">
        <svg [lucideIcon]="shareIcon" aria-hidden="true"></svg>
        Share
      </button>
    </aeris-toolbar>
    <aeris-menu
      #actionMenu
      popup
      appendTo="body"
      [model]="menuItems"
      ariaLabel="Export format"
      (opened)="menuOpen.set(true)"
      (closed)="menuOpen.set(false)"
    />
    <p class="toolbar-note" aria-live="polite">{{ lastAction() }}</p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}
```

### Custom content

Projected inputs retain their own tab stops and text-editing keys.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-mixed-demo',
  imports: [AerisInputText, AerisToolbarModule],
  templateUrl: './toolbar-mixed.demo.html',
  styleUrl: './toolbar-mixed.demo.scss'
})
export class ToolbarMixedDemo {
  protected readonly query = signal('');

  protected readonly commands = ['Open', 'Save', 'Share'];

  protected readonly filteredCommands = computed(() =>
      this.commands.filter((command) => command.toLowerCase().includes(this.query().toLowerCase())),
    );

  protected setQuery(event: Event): void {
      if (event.target instanceof HTMLInputElement) this.query.set(event.target.value);
    }
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar attached ariaLabel="Command tools">
      <button aerisToolbarItem (click)="query.set('')">Reset</button>
      <span aerisToolbarSeparator></span>
      <input
        aerisInputText
        size="sm"
        class="toolbar-search"
        aria-label="Find commands"
        placeholder="Find commands"
        [value]="query()"
        (input)="setQuery($event)"
      />
    </aeris-toolbar>
    <p class="toolbar-note" aria-live="polite">
      Matches: {{ filteredCommands().join(', ') || 'No commands found' }}.
    </p>
  </div>
</div>
```

#### CSS

```css
.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}

.toolbar-search {
  inline-size: 11rem;
  min-inline-size: 0;
}
```

### Overflow and wrapping

Drag to scroll with a mouse, or swipe on touch screens. Activating a clipped item reveals it with a glimpse of the next item. Enable wrap to display actions on multiple lines.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

@Component({
  selector: 'app-toolbar-wrapping-demo',
  imports: [AerisToolbarModule],
  templateUrl: './toolbar-wrapping.demo.html',
  styleUrl: './toolbar-wrapping.demo.scss'
})
export class ToolbarWrappingDemo {
  protected readonly overflowActions = [
      'Select',
      'Pan',
      'Draw',
      'Text',
      'Shapes',
      'Arrange',
      'Export',
    ];

  protected readonly overflowAction = signal('Select');
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack toolbar-constrained">
    <p class="toolbar-note">Drag to scroll</p>
    <aeris-toolbar attached fluid ariaLabel="Scrollable actions">
      @for (action of overflowActions; track action) {
        <button aerisToolbarItem (click)="overflowAction.set(action)">
          {{ action }}
        </button>
      }
    </aeris-toolbar>
    <aeris-toolbar attached fluid wrap ariaLabel="Wrapping actions">
      @for (action of overflowActions; track action) {
        <button aerisToolbarItem (click)="overflowAction.set(action)">
          {{ action }}
        </button>
      }
    </aeris-toolbar>
    <p class="toolbar-note" aria-live="polite">Selected: {{ overflowAction() }}.</p>
  </div>
</div>
```

#### CSS

```css
.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}

.toolbar-constrained {
  max-inline-size: 25rem;
}
```

### Floating actions

Selection belongs to your application. Select table rows to reveal their toolbar inside this container. The bar does not steal focus or prevent further selection. Action labels become visually hidden on narrow screens but remain accessible.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTableModule, type AerisTableColumn } from '@aeris-ui/core/table';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-floating-demo',
  imports: [AerisButton, AerisTableModule, AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-floating.demo.html',
  styleUrl: './toolbar-floating.demo.scss'
})
export class ToolbarFloatingDemo {
  protected readonly archiveIcon = LucideArchive;

  protected readonly closeIcon = LucideX;

  protected readonly floatingFiles = signal([
      { id: 'report', name: 'Quarterly report.pdf', type: 'PDF' },
      { id: 'notes', name: 'Meeting notes.txt', type: 'Text' },
      { id: 'photo', name: 'Team photo.jpg', type: 'Image' },
    ]);

  protected readonly floatingColumns: readonly AerisTableColumn[] = [
      { field: 'name', header: 'File' },
      { field: 'type', header: 'Type', width: '6rem' },
    ];

  protected readonly floatingSelection = signal<readonly string[]>([]);

  protected readonly floatingMessage = signal('Select files to reveal their actions.');

  protected exportSelection(): void {
      this.floatingMessage.set(`Export requested for ${this.floatingSelection().length} files.`);
    }

  protected archiveSelection(): void {
      const keys = new Set(this.floatingSelection());
      this.floatingFiles.update((files) => files.filter((file) => !keys.has(file.id)));
      this.floatingMessage.set(`Archived ${keys.size} ${keys.size === 1 ? 'file' : 'files'}.`);
      this.floatingSelection.set([]);
    }

  protected resetFloatingFiles(): void {
      this.floatingFiles.set([
        { id: 'report', name: 'Quarterly report.pdf', type: 'PDF' },
        { id: 'notes', name: 'Meeting notes.txt', type: 'Text' },
        { id: 'photo', name: 'Team photo.jpg', type: 'Image' },
      ]);
      this.floatingSelection.set([]);
      this.floatingMessage.set('Select files to reveal their actions.');
    }

  protected readonly downloadIcon = LucideDownload;
}
```

#### HTML

```html
<div class="toolbar-stack">
  <div aerisToolbarContainer class="toolbar-selection-region">
    <div #fileRegion tabindex="-1" role="group" aria-label="Files and selection">
      <aeris-table
        caption="Files"
        [data]="floatingFiles()"
        [columns]="floatingColumns"
        selectionMode="multiple"
        [(selectedKeys)]="floatingSelection"
      />
    </div>
    <aeris-toolbar
      floating
      floatingScope="container"
      [visible]="floatingSelection().length > 0"
      [restoreFocusTo]="fileRegion"
      ariaLabel="Selected file actions"
    >
      <span class="toolbar-caption">{{ floatingSelection().length }} selected</span>
      <span aerisToolbarSeparator></span>
      <button aerisToolbarItem (click)="exportSelection()">
        <svg [lucideIcon]="downloadIcon" aria-hidden="true"></svg>
        <span aerisToolbarLabel>Export</span>
      </button>
      <button aerisToolbarItem (click)="archiveSelection()">
        <svg [lucideIcon]="archiveIcon" aria-hidden="true"></svg>
        <span aerisToolbarLabel>Archive</span>
      </button>
      <span aerisToolbarSeparator></span>
      <button
        aerisToolbarItem
        iconOnly
        aria-label="Clear selection"
        (click)="floatingSelection.set([])"
      >
        <svg [lucideIcon]="closeIcon" aria-hidden="true"></svg>
      </button>
    </aeris-toolbar>
  </div>
  <p class="toolbar-note" aria-live="polite">{{ floatingMessage() }}</p>
  <button aerisButton variant="outline" (click)="resetFloatingFiles()">
    Reset files
  </button>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-selection-region {
  inline-size: 100%;
  padding-block-end: 5.5rem;
}

.toolbar-selection-region > [tabindex="-1"]:focus-visible {
  outline: var(--aeris-focus-ring-width, 3px) solid var(--aeris-focus-ring-color);
  outline-offset: 0.25rem;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}

.toolbar-caption {
  padding-inline: var(--aeris-toolbar-item-padding, 0.625rem);
}
```

### Viewport positioning

Choose the top or bottom of the screen. The floating toolbar stays anchored while scrolling and follows the usable viewport on mobile. The offset token reserves space for fixed navigation. Close it to return focus to the button that opened it.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule, type AerisToolbarPosition } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-viewport-demo',
  imports: [AerisButton, AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-viewport.demo.html',
  styleUrl: './toolbar-viewport.demo.scss'
})
export class ToolbarViewportDemo {
  protected readonly closeIcon = LucideX;

  protected readonly viewportToolbarVisible = signal(false);

  protected readonly viewportToolbarPosition = signal<AerisToolbarPosition>('bottom');

  protected readonly viewportToolbarTrigger = signal<HTMLElement | null>(null);

  protected readonly viewportMessage = signal('The toolbar does not block or dim the page.');

  protected showViewportToolbar(position: AerisToolbarPosition, event: MouseEvent): void {
      this.viewportToolbarPosition.set(position);
      this.viewportToolbarTrigger.set(
        event.currentTarget instanceof HTMLElement ? event.currentTarget : null,
      );
      this.viewportToolbarVisible.set(true);
    }

  protected readonly shareIcon = LucideShare2;
}
```

#### HTML

```html
<div class="toolbar-stack">
  <div class="toolbar-launchers">
    <button aerisButton variant="outline" (click)="showViewportToolbar('top', $event)">
      Show at top
    </button>
    <button aerisButton variant="outline" (click)="showViewportToolbar('bottom', $event)">
      Show at bottom
    </button>
  </div>
  <aeris-toolbar
    floating
    [visible]="viewportToolbarVisible()"
    [position]="viewportToolbarPosition()"
    [restoreFocusTo]="viewportToolbarTrigger()"
    style="--aeris-toolbar-floating-offset: 5rem"
    ariaLabel="Viewport actions"
  >
    <button aerisToolbarItem (click)="viewportMessage.set('Share action selected.')">
      <svg [lucideIcon]="shareIcon" aria-hidden="true"></svg>
      <span aerisToolbarLabel>Share</span>
    </button>
    <span aerisToolbarSeparator></span>
    <button
      aerisToolbarItem
      iconOnly
      aria-label="Close toolbar"
      (click)="viewportToolbarVisible.set(false)"
    >
      <svg [lucideIcon]="closeIcon" aria-hidden="true"></svg>
    </button>
  </aeris-toolbar>
  <p class="toolbar-note" aria-live="polite">{{ viewportMessage() }}</p>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-launchers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}
```

### Full-width layout

Sections and spacers distribute application actions. The group role keeps normal tab stops.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-sections-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-sections.demo.html',
  styleUrl: './toolbar-sections.demo.scss'
})
export class ToolbarSectionsDemo {
  protected readonly shareIcon = LucideShare2;

  protected readonly sectionAction = signal('Choose an action.');
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    <aeris-toolbar fluid variant="filled" role="group" wrap ariaLabel="File actions">
      <div aerisToolbarStart>
        <strong class="toolbar-caption">Untitled document</strong>
      </div>
      <span aerisToolbarSpacer></span>
      <div aerisToolbarEnd>
        <button aerisToolbarItem (click)="sectionAction.set('Changes saved.')">
          Save
        </button>
        <button aerisToolbarItem (click)="sectionAction.set('Share link copied.')">
          <svg [lucideIcon]="shareIcon" aria-hidden="true"></svg>
          Share
        </button>
      </div>
    </aeris-toolbar>
    <p class="toolbar-note" aria-live="polite">{{ sectionAction() }}</p>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.toolbar-note {
  margin: 0;
  color: var(--aeris-text-muted);
  font-size: var(--aeris-body-font-size);
}

.toolbar-caption {
  padding-inline: var(--aeris-toolbar-item-padding, 0.625rem);
}
```

### Sizes and disabled state

Disable a toolbar, group, or individual item. Coarse pointers keep a 44px minimum target.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisToolbarModule, type AerisToolbarSize } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-states-demo',
  imports: [AerisButton, AerisToolbarModule, LucideDynamicIcon],
  templateUrl: './toolbar-states.demo.html',
  styleUrl: './toolbar-states.demo.scss'
})
export class ToolbarStatesDemo {
  protected readonly boldIcon = LucideBold;

  protected readonly italicIcon = LucideItalic;

  protected readonly bold = signal(false);

  protected readonly italic = signal(false);

  protected readonly toolsDisabled = signal(false);

  protected readonly sizes: readonly AerisToolbarSize[] = ['sm', 'md', 'lg'];
}
```

#### HTML

```html
<div>
  <div class="toolbar-stack">
    @for (size of sizes; track size) {
      <aeris-toolbar attached [size]="size" [ariaLabel]="'Formatting ' + size">
        <button aerisToolbarItem iconOnly aria-label="Bold" [(pressed)]="bold">
          <svg [lucideIcon]="boldIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Italic" [(pressed)]="italic">
          <svg [lucideIcon]="italicIcon" aria-hidden="true"></svg>
        </button>
        <span aerisToolbarSeparator></span>
        <button aerisToolbarItem disabled>Unavailable</button>
      </aeris-toolbar>
    }
    <button aerisButton variant="outline" (click)="toolsDisabled.set(!toolsDisabled())">
      {{ toolsDisabled() ? 'Enable toolbar' : 'Disable toolbar' }}
    </button>
    <aeris-toolbar
      attached
      [disabled]="toolsDisabled()"
      ariaLabel="Disableable formatting"
    >
      <button aerisToolbarItem iconOnly aria-label="Bold" [(pressed)]="bold">
        <svg [lucideIcon]="boldIcon" aria-hidden="true"></svg>
      </button>
      <button aerisToolbarItem iconOnly aria-label="Italic" [(pressed)]="italic">
        <svg [lucideIcon]="italicIcon" aria-hidden="true"></svg>
      </button>
    </aeris-toolbar>
  </div>
</div>
```

#### CSS

```css
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

.toolbar-stack {
  display: grid;
  justify-items: start;
  gap: 1rem;
  inline-size: 100%;
  min-inline-size: 0;
}
```

### Token customization

Override the surface and selected-state tokens without changing behavior.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';
import { LucideAlignCenter, LucideAlignLeft, LucideAlignRight, LucideArchive, LucideBold, LucideChevronDown, LucideDownload, LucideDynamicIcon, LucideEraser, LucideItalic, LucideMinus, LucideMousePointer, LucidePencil, LucidePlus, LucideRotateCcw, LucideShare2, LucideUnderline, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toolbar-custom-demo',
  imports: [AerisToolbarModule, LucideDynamicIcon],
  template: `
    <div>
      <aeris-toolbar class="brand-toolbar" attached ariaLabel="Customized tools">
        <button aerisToolbarItem iconOnly aria-label="Bold" [(pressed)]="bold">
          <svg [lucideIcon]="boldIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Italic" [(pressed)]="italic">
          <svg [lucideIcon]="italicIcon" aria-hidden="true"></svg>
        </button>
        <button aerisToolbarItem iconOnly aria-label="Underline" [(pressed)]="underline">
          <svg [lucideIcon]="underlineIcon" aria-hidden="true"></svg>
        </button>
      </aeris-toolbar>
    </div>
  `,
  styles: `
    svg:where([lucideIcon]) {
      width: var(--aeris-icon-size, 1rem);
      height: var(--aeris-icon-size, 1rem);
      flex-shrink: 0;
      stroke-width: 2;
    }

    .brand-toolbar {
      --aeris-toolbar-background: var(--aeris-primary-soft);
      --aeris-toolbar-item-pressed-background: var(--aeris-primary);
      --aeris-toolbar-item-pressed-color: var(--aeris-primary-contrast);
      --aeris-toolbar-padding-block: 0.625rem;
      --aeris-toolbar-padding-inline: 0.625rem;
    }
  `
})
export class ToolbarCustomDemo {
  protected readonly boldIcon = LucideBold;

  protected readonly italicIcon = LucideItalic;

  protected readonly underlineIcon = LucideUnderline;

  protected readonly bold = signal(false);

  protected readonly italic = signal(false);

  protected readonly underline = signal(false);
}
```

## Accessibility

- Floating toolbars are non-modal. Opening one does not move focus, create a backdrop, trap focus, or lock page scrolling. Hidden toolbars become inert and leave the accessibility tree immediately, even while the exit animation finishes. When hiding a focused toolbar, supply restoreFocusTo for a stable destination such as the selection region; otherwise Aeris uses the element focused when the bar appeared. Closing a toolbar does not itself clear application selection. Escape does not dismiss the toolbar; provide an explicit close or clear action. Use aerisToolbarLabel only on text accompanied by a decorative icon so compact actions retain their names.
- Supply ariaLabel or ariaLabelledBy. Dedicated items are native buttons. Icon-only items need an accessible name. Toggle and selection items expose aria-pressed; menu triggers expose aria-haspopup and controlled aria-expanded.
- Dedicated items share a roving tab stop. Disabled items are skipped. Groups can have accessible names. Projected inputs and other widgets keep their own tab stops and editing behavior. Use role="group" or a null role when coordinated navigation is not appropriate. Disabling a toolbar makes its subtree inert.
- Menu focus is handled by the menu component. Bind expanded to its opened and closed events. Transitions respect reduced motion; touch targets are at least 44px on coarse pointers.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Enters or leaves the remembered toolbar item. Projected inputs retain their own tab stops. |
| `Left / Right` | Moves between horizontal items, wrapping at either end. Direction follows RTL. |
| `Up / Down` | Moves between vertical items. Down opens a closed horizontal menu trigger. |
| `Home / End` | Focuses the first or last enabled item. |
| `Enter / Space` | Activates the focused native button. Selection changes only on activation. |
| `Input editing keys` | Remain native; projected inputs are not intercepted. |
