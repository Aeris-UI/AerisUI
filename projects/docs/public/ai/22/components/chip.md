# Chip

> Represent compact entities with labels, images, consumer icons, custom content, and accessible removal.

Aeris 22.0.0-alpha.10 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/chip`
- Human-readable documentation: [https://aeris-ui.dev/components/chip](https://aeris-ui.dev/components/chip)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisChipModule } from '@aeris-ui/core/chip';
```

## API

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Two-way visibility state. Accepted removal sets it to false when autoHide is true; otherwise the parent controls it. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Visible chip text and default accessible group name. |
| `imageSrc` | `string` | `''` | Optional leading image URL. |
| `imageAlt` | `string` | `''` | Alternative text used when the image is the chip’s only meaningful content. |
| `removable` | `boolean` | `false` | Shows the native remove button. |
| `autoHide` | `boolean` | `true` | Hides after accepted removal. Set false to let a parent update visible or remove the item from its data instead. |
| `disabled` | `boolean` | `false` | Disables removal while keeping the chip visible. |
| `size` | `AerisChipSize` | `'md'` | Sets chip height, padding, and typography. Options: 'sm', 'md', 'lg'. |
| `variant` | `AerisChipVariant` | `'soft'` | Sets a soft filled or outline appearance. |
| `tone` | `AerisChipTone` | `'neutral'` | Sets the palette-aware visual tone. Options: 'primary', 'neutral', 'success', 'info', 'warning', 'danger'. |
| `shape` | `AerisChipShape` | `'pill'` | Sets pill or rounded corners. |
| `removeAriaLabel` | `string` | `''` | Overrides the remove button accessible name. |
| `ariaLabel` | `string` | `''` | Accessible name for custom projected chip content. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels custom projected chip content. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `removing` | `AerisChipRemovingEvent` | `-` | Synchronous removal request. Call preventDefault() to keep the chip and suppress visibleChange and removed. Not emitted for disabled, hidden or non-removable chips. |
| `visibleChange` | `boolean` | `-` | Implicit model output emitted when visibility changes. |
| `removed` | `AerisChipRemoveEvent` | `-` | Emits once after accepted pointer, keyboard or API removal. With autoHide=false, the chip stays visible until its parent updates it. |

### Content

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Custom chip content rendered alongside image, leading content, and remove action. |
| `aerisChipLeading` | `attribute projection` | `-` | Marks a consumer-provided leading icon as decorative. |
| `aerisChipRemoveIcon` | `TemplateRef&lt;AerisChipRemoveIconContext&gt;` | `-` | Replaces the Aeris-owned default remove icon. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `remove(originalEvent?)` | `(Event &#124; null) =&gt; void` | `-` | Requests removal of a visible, removable, enabled chip. Runs removing, then visibleChange when autoHide is true, then removed unless cancelled. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `-` | Focuses the existing remove button. Does nothing for hidden, disabled or non-removable chips; never adds a host focus stop. |

## Interfaces and types

### Interfaces

```ts
type AerisChipSize = 'sm' | 'md' | 'lg';
type AerisChipVariant = 'soft' | 'outline';
type AerisChipTone =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
type AerisChipShape = 'pill' | 'rounded';

interface AerisChipRemoveEvent {
  readonly originalEvent: Event | null;
  readonly label: string;
}

interface AerisChipRemovingEvent extends AerisChipRemoveEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}

interface AerisChipRemoveIconContext {
  readonly $implicit: AerisChip;
  readonly disabled: boolean;
}
```

## Examples

### Basic

Use short labels to represent categories, filters, or compact entities.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-basic-demo',
  imports: [AerisChipModule],
  template: `
    <div>
      <div class="chip-row">
        <aeris-chip label="Angular" />
        <aeris-chip label="Design systems" />
        <aeris-chip label="Accessibility" />
      </div>
    </div>
  `,
  styles: `
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class ChipBasicBasicDemo {
}
```

### Icons

Project icons from any consumer-selected icon library and mark them with aerisChipLeading.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { LucideCamera, LucideCode2, LucideDynamicIcon, LucidePalette } from '@lucide/angular';

@Component({
  selector: 'app-chip-icons-demo',
  imports: [AerisChipModule, LucideDynamicIcon],
  template: `
    <div>
      <div class="chip-row">
        <aeris-chip label="Development" tone="primary">
          <svg aerisChipLeading [lucideIcon]="icons.Code2"></svg>
        </aeris-chip>
        <aeris-chip label="Design" tone="info">
          <svg aerisChipLeading [lucideIcon]="icons.Palette"></svg>
        </aeris-chip>
        <aeris-chip label="Photography" tone="success" removable>
          <svg aerisChipLeading [lucideIcon]="icons.Camera"></svg>
        </aeris-chip>
      </div>
    </div>
  `,
  styles: `
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class ChipIconsIconsDemo {

  protected readonly icons = { Camera: LucideCamera, Code2: LucideCode2, Palette: LucidePalette };
}
```

### Images

Add a leading image without consumer sizing or cropping styles.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-images-demo',
  imports: [AerisChipModule],
  template: `
    <div>
      <div class="chip-row">
        <aeris-chip label="Milo" imageSrc="/puppies/puppy1.jpg" imageAlt="Milo" />
        <aeris-chip label="Luna" imageSrc="/puppies/puppy2.jpg" imageAlt="Luna" />
        <aeris-chip
          label="Archie"
          imageSrc="/puppies/puppy3.jpg"
          imageAlt="Archie"
          removable
        />
      </div>
    </div>
  `,
  styles: `
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class ChipImagesImagesDemo {
}
```

### Sizes and styles

Match nearby density and emphasis with three sizes, two variants, semantic tones, and rounded or pill shapes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-styles-demo',
  imports: [AerisChipModule],
  template: `
    <div>
      <div class="chip-row">
        <aeris-chip label="Small" size="sm" />
        <aeris-chip label="Medium" tone="primary" />
        <aeris-chip label="Large" size="lg" tone="success" />
        <aeris-chip label="Outline" variant="outline" tone="info" />
        <aeris-chip label="Rounded" shape="rounded" tone="warning" />
      </div>
    </div>
  `,
  styles: `
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class ChipStylesSizesAndStylesDemo {
}
```

### Removable

The native remove button updates visible, emits removed, and supports Enter, Space, Delete, and Backspace.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-removable-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-removable.demo.html',
  styleUrl: './chip-removable.demo.scss'
})
export class ChipRemovableRemovableDemo {
}
```

#### HTML

```html
<div>
  <div class="chip-removable-demo">
    <aeris-chip
      label="Photography"
      removable
      [(visible)]="removableVisible"
      (removed)="recordRemoval($event)"
    />
    <button
      #restoreButton
      aerisButton
      variant="solid"
      severity="secondary"
      type="button"
      (click)="restoreChip()"
    >
      Restore chip
    </button>
    <p aria-live="polite">{{ removalStatus() }}</p>
  </div>
</div>
```

#### CSS

```css
.chip-removable-demo {
  display: grid;
  justify-items: start;
  gap: 0.875rem;
}

.chip-removable-demo p {
  margin: 0;
  color: var(--aeris-text-2);
}
```

### Cancellable removal

Call preventDefault() synchronously on removing to reject the request. A cancelled chip stays visible and keeps its focused remove button.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-cancel-removal-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-cancel-removal.demo.html',
  styleUrl: './chip-cancel-removal.demo.scss'
})
export class ChipCancelRemovalCancellableRemovalDemo {
}
```

#### HTML

```html
<div class="chip-removable-demo">
  <aeris-chip
    label="Protected category"
    removable
    [(visible)]="protectedVisible"
    (removing)="guardRemoval($event)"
  />
  <div class="chip-row">
    <button
      aerisButton
      variant="outline"
      type="button"
      [attr.aria-pressed]="removalAllowed()"
      (click)="removalAllowed.set(!removalAllowed())"
    >
      Allow removal
    </button>
    <button
      aerisButton
      variant="outline"
      type="button"
      (click)="protectedVisible.set(true)"
    >
      Restore category
    </button>
  </div>
  <p>Removal is {{ removalAllowed() ? 'allowed' : 'protected' }}.</p>
</div>
```

#### CSS

```css
.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.chip-removable-demo {
  display: grid;
  justify-items: start;
  gap: 0.875rem;
}

.chip-removable-demo p {
  margin: 0;
  color: var(--aeris-text-2);
}
```

### Parent-managed removal

Set autoHide to false to receive accepted requests without changing visible. The parent can confirm first, or remove the item from its collection.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-controlled-removal-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-controlled-removal.demo.html',
  styleUrl: './chip-controlled-removal.demo.scss'
})
export class ChipControlledRemovalParentManagedRemovalDemo {
}
```

#### HTML

```html
<div class="chip-removable-demo">
  <aeris-chip
    label="Saved filter"
    removable
    [autoHide]="false"
    [visible]="controlledVisible()"
    (removed)="requestControlledRemoval()"
  />
  <div class="chip-row">
    <button
      aerisButton
      type="button"
      [disabled]="!controlledRequested() || !controlledVisible()"
      (click)="acceptControlledRemoval()"
    >
      Confirm removal
    </button>
    <button
      #restoreControlledButton
      aerisButton
      variant="outline"
      type="button"
      (click)="
        controlledVisible.set(true);
        controlledRequested.set(false);
        controlledStatus.set('The parent controls visibility.')
      "
    >
      Restore filter
    </button>
  </div>
  <p role="status">{{ controlledStatus() }}</p>
</div>
```

#### CSS

```css
.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.chip-removable-demo {
  display: grid;
  justify-items: start;
  gap: 0.875rem;
}

.chip-removable-demo p {
  margin: 0;
  color: var(--aeris-text-2);
}
```

### Custom content

Project richer content and replace the remove icon while keeping the native remove button.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { LucideDynamicIcon, LucideXCircle } from '@lucide/angular';

@Component({
  selector: 'app-chip-content-demo',
  imports: [AerisChipModule, LucideDynamicIcon],
  templateUrl: './chip-content.demo.html',
  styleUrl: './chip-content.demo.scss'
})
export class ChipContentCustomContentDemo {

  protected readonly icons = { XCircle: LucideXCircle };
}
```

#### HTML

```html
<div>
  <aeris-chip
    ariaLabel="Enterprise plan"
    removable
    removeAriaLabel="Remove Enterprise plan"
  >
    <span class="chip-plan">
      <span>
        <strong>Enterprise</strong>
        <small>Unlimited projects</small>
      </span>
    </span>
    <ng-template aerisChipRemoveIcon>
      <svg [lucideIcon]="icons.XCircle" [size]="14"></svg>
    </ng-template>
  </aeris-chip>
</div>
```

#### CSS

```css
.chip-plan {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.chip-plan strong,
.chip-plan small {
  display: block;
}

.chip-plan small {
  color: var(--aeris-text-2);
  font-size: 0.6875rem;
}
```

### Token customization

Scope tokens to one chip while preserving palette, density, focus, and removal behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { LucideDynamicIcon, LucidePalette } from '@lucide/angular';

@Component({
  selector: 'app-chip-custom-demo',
  imports: [AerisChipModule, LucideDynamicIcon],
  template: `
    <div>
      <aeris-chip
        class="brand-chip"
        label="Aeris Pro"
        tone="primary"
        variant="outline"
        removable
      >
        <svg aerisChipLeading [lucideIcon]="icons.Palette"></svg>
      </aeris-chip>
    </div>
  `,
  styles: `
    .brand-chip {
      --aeris-chip-height: 2.75rem;
      --aeris-chip-padding-inline: 1rem;
      --aeris-chip-gap: 0.625rem;
      --aeris-chip-font-size: 0.875rem;
      --aeris-chip-font-weight: 800;
      --aeris-chip-icon-size: 1.125rem;
      --aeris-chip-remove-size: 1.5rem;
      --aeris-chip-remove-icon-size: 0.875rem;
    }
  `
})
export class ChipCustomTokenCustomizationDemo {

  protected readonly icons = { Palette: LucidePalette };
}
```

## Accessibility

- Chip is not a selectable item or a keyboard collection. Static chips do not receive focus, and removable chips expose only their native remove button. Keep projected content and custom remove artwork non-interactive.
- Cancellation leaves focus on the remove button. After accepted removal, choose a meaningful destination in the parent: the standalone example focuses its Restore button. A collection should focus the next enabled item, then the previous enabled item, then its entry control if empty. Wait until the updated collection is rendered before focusing a newly rendered item. Chip does not inspect sibling elements or choose that destination automatically; focus() lets the parent focus an existing removable chip.
- Static chips expose their visible label and projected content without entering the tab order.
- Removable chips use a semantic native button with an accessible name derived from the label, ariaLabel, ariaLabelledBy, or an explicit removeAriaLabel. Supply a name for projected-only content; otherwise the fallback is “Remove chip”.
- Consumer-provided leading icons marked with aerisChipLeading are decorative. Meaningful custom content can use ariaLabel or ariaLabelledBy.
- Images become decorative when a label or explicit accessible name already identifies the chip, preventing duplicate announcements.
- Disabled chips expose aria-disabled and disable their native remove button.
- Long labels are contained with an ellipsis and never create page-level horizontal overflow.
- Chip includes no required animation and respects reduced-motion preferences.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | Moves focus to or away from the native remove button. Static chips are skipped. |
| `Enter / Space` | Activates the focused native remove button. |
| `Delete / Backspace` | Requests removal while its remove button is focused. Cancellation and autoHide apply to keyboard removal too. |
