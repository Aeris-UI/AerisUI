# Chip

> Compact labels, images and custom content, with accessible removal and optional grouped selection.

Aeris 22.0.0-alpha.11 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

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

### Group Api

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly AerisChipGroupItem[] (model)` | `[]` | Controlled collection with unique stable IDs. Accepted removal updates items; do not also remove in the removed handler. |
| `value` | `AerisChipGroupValue (model)` | `null` | Single string/null or multiple readonly string array. Ignored in none mode. Changing mode requires the corresponding value shape. |
| `selectionMode` | `'none' &#124; 'single' &#124; 'multiple'` | `'none'` | No selection, one pressed choice, or multiple pressed choices. Arrow keys move focus without changing value; pressing a selected choice clears it. |
| `removable` | `boolean` | `false` | Default remove-button visibility. Each item can override it. |
| `disabled` | `boolean` | `false` | Disables selection, removal and keyboard entry for the collection. |
| `orientation` | `'horizontal' &#124; 'vertical'` | `'horizontal'` | Horizontal wrapping uses logical Left/Right; vertical uses Up/Down. Both wrap at the ends. |
| `ariaLabel` | `string` | `'Chips'` | Accessible collection name; use a specific label. |
| `ariaLabelledBy` | `string` | `''` | ID of visible collection label; takes precedence over ariaLabel. |
| `ariaDescribedBy` | `string` | `''` | Space-separated IDs of help/error messages. |
| `emptyMessage` | `string` | `'No chips'` | Visible empty-state text. Empty or entirely non-interactive collections have a focusable entry target unless disabled. |
| `size` | `AerisChipSize` | `'md'` | Member size: 'sm', 'md', 'lg'. |
| `variant` | `AerisChipVariant` | `'soft'` | Member appearance: 'soft', 'outline'. |
| `tone` | `AerisChipTone` | `'neutral'` | Member tone: 'primary', 'neutral', 'success', 'info', 'warning', 'danger'. Selected state uses primary tokens. |
| `shape` | `AerisChipShape` | `'pill'` | Member shape: 'pill', 'rounded'. |
| `invalid` | `boolean` | `false` | Presented invalid state for selection modes, gated by touched when supplied. |
| `touched` | `boolean &#124; null` | `null` | Signal Forms supplies interaction state automatically. Null preserves immediate manual invalid presentation. |
| `itemsChange` | `readonly AerisChipGroupItem[]` | `—` | Model output after an accepted collection update. |
| `valueChange` | `AerisChipGroupValue` | `—` | Model output after selection changes or selected-item removal. |
| `changed` | `AerisChipGroupChangeEvent` | `—` | User selection change or selected-item removal. External model writes do not emit changed. |
| `removing` | `AerisChipGroupRemovingEvent` | `—` | Synchronous request. Call preventDefault() to preserve collection, value and focus. Do not mutate the collection here; accept normally or cancel. |
| `removed` | `AerisChipGroupRemoveEvent` | `—` | Once after accepted removal. The group already updated items and selection; use for notifications, not a second deletion. |
| `touch` | `void` | `—` | Emitted when focus leaves the collection; used by Signal Forms. |
| `focus(options?)` | `(FocusOptions) =&gt; void` | `—` | Focuses the current enabled entry or the host if there is no interactive item. Disabled groups do nothing. |
| `writeValue(value)` | `(AerisChipGroupValue) =&gt; void` | `—` | ControlValueAccessor value synchronization for Reactive Forms/ngModel. |
| `registerOnChange(fn)` | `((value: AerisChipGroupValue) =&gt; void) =&gt; void` | `—` | ControlValueAccessor change registration; applications normally use forms bindings. |
| `registerOnTouched(fn)` | `(() =&gt; void) =&gt; void` | `—` | ControlValueAccessor touched registration. |
| `setDisabledState(disabled)` | `(boolean) =&gt; void` | `—` | ControlValueAccessor disabled synchronization. |

### Models

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Two-way visibility state. Accepted removal sets it to false when autoHide is true; otherwise the parent controls it. |

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `removeTabIndex` | `number` | `0` | Native remove-button tab index. The optional ChipGroup manages it automatically for roving focus. |
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

### Group Interfaces

```ts
type AerisChipGroupSelectionMode = 'none' | 'single' | 'multiple';
type AerisChipGroupValue = string | readonly string[] | null;
interface AerisChipGroupItem {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly removable?: boolean;
}
interface AerisChipGroupChangeEvent {
  readonly originalEvent: Event | null;
  readonly value: AerisChipGroupValue;
}
interface AerisChipGroupRemoveEvent {
  readonly originalEvent: Event | null;
  readonly item: AerisChipGroupItem;
}
interface AerisChipGroupRemovingEvent extends AerisChipGroupRemoveEvent {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
}
```

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

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-chip-group-gap` | `CSS custom property` | `--aeris-density-gap` | Space between grouped chips. |
| `--aeris-chip-group-selected-border` | `CSS custom property` | `--aeris-primary` | Selected group-chip border. |
| `--aeris-chip-group-selected-background` | `CSS custom property` | `--aeris-primary-soft` | Selected group-chip background. |
| `--aeris-chip-height` | `CSS custom property` | `control height − 0.5rem` | Default chip height. |
| `--aeris-chip-sm-height` | `CSS custom property` | `control height − 0.875rem` | Small chip height. |
| `--aeris-chip-lg-height` | `CSS custom property` | `control height + 0.125rem` | Large chip height. |
| `--aeris-chip-padding-block` | `CSS custom property` | `0.25rem` | Vertical padding. |
| `--aeris-chip-padding-inline` | `CSS custom property` | `0.75rem` | Horizontal padding. |
| `--aeris-chip-gap` | `CSS custom property` | `density gap × 0.75` | Internal content gap. |
| `--aeris-chip-font-size` | `CSS custom property` | `0.8125rem` | Default label size. |
| `--aeris-chip-font-weight` | `CSS custom property` | `650` | Label weight. |
| `--aeris-chip-radius` | `CSS custom property` | `--aeris-radius-md` | Rounded shape radius. |
| `--aeris-chip-icon-size` | `CSS custom property` | `--aeris-icon-size` | Leading icon size. |
| `--aeris-chip-remove-size` | `CSS custom property` | `1.25rem` | Remove button dimensions. |
| `--aeris-chip-remove-icon-size` | `CSS custom property` | `0.75rem` | Default remove icon dimensions. |

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
export class ChipBasicDemo {
}
```

### Icons

Project icons from any consumer-selected icon library and mark them with aerisChipLeading.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisChipModule } from '@aeris-ui/core/chip';
import { LucideCamera, LucideCode2, LucideDynamicIcon, LucidePalette, LucideXCircle } from '@lucide/angular';

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
    svg:where([lucideIcon]) {
      width: var(--aeris-icon-size, 1rem);
      height: var(--aeris-icon-size, 1rem);
      flex-shrink: 0;
      stroke-width: 2;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
  `
})
export class ChipIconsDemo {
  protected readonly icons = {
      Camera: LucideCamera,
      Code2: LucideCode2,
      Palette: LucidePalette,
      XCircle: LucideXCircle,
    };
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
export class ChipImagesDemo {
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
export class ChipStylesDemo {
}
```

### Removable

The native remove button updates visible, emits removed, and supports Enter, Space, Delete, and Backspace.

#### TS

```ts
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipRemoveEvent } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-removable-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-removable.demo.html',
  styleUrl: './chip-removable.demo.scss'
})
export class ChipRemovableDemo {
  private readonly restoreElement = viewChild('restoreButton', {
      read: ElementRef<HTMLButtonElement>,
    });

  protected readonly removableVisible = signal(true);

  protected readonly removalStatus = signal('Photography is selected.');

  protected recordRemoval(event: AerisChipRemoveEvent): void {
      this.removalStatus.set(`Removed ${event.label}.`);
      this.restoreElement()?.nativeElement.focus();
    }

  protected restoreChip(): void {
      this.removableVisible.set(true);
      this.removalStatus.set('Photography is selected.');
    }
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
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipRemovingEvent } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-cancel-removal-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-cancel-removal.demo.html',
  styleUrl: './chip-cancel-removal.demo.scss'
})
export class ChipCancelRemovalDemo {
  protected readonly protectedVisible = signal(true);

  protected readonly removalAllowed = signal(false);

  protected guardRemoval(event: AerisChipRemovingEvent): void {
      if (!this.removalAllowed()) event.preventDefault();
    }
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
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-controlled-removal-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-controlled-removal.demo.html',
  styleUrl: './chip-controlled-removal.demo.scss'
})
export class ChipControlledRemovalDemo {
  private readonly restoreControlledElement = viewChild('restoreControlledButton', {
      read: ElementRef<HTMLButtonElement>,
    });

  protected readonly controlledVisible = signal(true);

  protected readonly controlledRequested = signal(false);

  protected readonly controlledStatus = signal('The parent controls visibility.');

  protected acceptControlledRemoval(): void {
      this.controlledVisible.set(false);
      this.controlledStatus.set('The parent accepted the request and hid the chip.');
      this.restoreControlledElement()?.nativeElement.focus();
    }

  protected requestControlledRemoval(): void {
      this.controlledRequested.set(true);
      this.controlledStatus.set('Removal requested. Confirm to hide the chip.');
    }
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
import { LucideCamera, LucideCode2, LucideDynamicIcon, LucidePalette, LucideXCircle } from '@lucide/angular';

@Component({
  selector: 'app-chip-content-demo',
  imports: [AerisChipModule, LucideDynamicIcon],
  templateUrl: './chip-content.demo.html',
  styleUrl: './chip-content.demo.scss'
})
export class ChipContentDemo {
  protected readonly icons = {
      Camera: LucideCamera,
      Code2: LucideCode2,
      Palette: LucidePalette,
      XCircle: LucideXCircle,
    };
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
svg:where([lucideIcon]) {
  width: var(--aeris-icon-size, 1rem);
  height: var(--aeris-icon-size, 1rem);
  flex-shrink: 0;
  stroke-width: 2;
}

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
import { LucideCamera, LucideCode2, LucideDynamicIcon, LucidePalette, LucideXCircle } from '@lucide/angular';

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
    svg:where([lucideIcon]) {
      width: var(--aeris-icon-size, 1rem);
      height: var(--aeris-icon-size, 1rem);
      flex-shrink: 0;
      stroke-width: 2;
    }

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
export class ChipCustomDemo {
  protected readonly icons = {
      Camera: LucideCamera,
      Code2: LucideCode2,
      Palette: LucidePalette,
      XCircle: LucideXCircle,
    };
}
```

### Single selection

One pressed choice at a time. Arrow keys move focus without selecting; activate again to clear. Controlled buttons use the same model.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipGroupItem, type AerisChipGroupValue } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-group-single-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-group-single.demo.html',
  styleUrl: './chip-group-single.demo.scss'
})
export class ChipGroupSingleDemo {
  protected readonly groupOptions: readonly AerisChipGroupItem[] = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second', disabled: true },
      { id: 'third', label: 'Third' },
      { id: 'fourth', label: 'Fourth' },
    ];

  protected readonly groupSingle = signal<AerisChipGroupValue>('first');
}
```

#### HTML

```html
<div>
  <div class="chip-removable-demo">
    <aeris-chip-group
      #singleGroup
      ariaLabel="Single choices"
      selectionMode="single"
      [items]="groupOptions"
      [(value)]="groupSingle"
    />
    <p>Selected: {{ groupSingle() || 'None' }}</p>
    <div class="chip-row">
      <button aerisButton variant="outline" (click)="groupSingle.set('fourth')">
        Select fourth
      </button>
      <button aerisButton variant="outline" (click)="singleGroup.focus()">
        Focus group
      </button>
      <button aerisButton variant="outline" type="button" (click)="groupSingle.set(null)">
        Clear selection
      </button>
    </div>
  </div>
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

### Multiple selection

Toggle choices independently without modifier keys. Disabled members are skipped. Chips wrap naturally when space is limited.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipGroupItem, type AerisChipGroupValue } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-group-multiple-demo',
  imports: [AerisButton, AerisChipModule],
  template: `
    <div>
      <div class="chip-removable-demo">
        <aeris-chip-group
          ariaLabel="Multiple choices"
          selectionMode="multiple"
          [items]="groupOptions"
          [(value)]="groupMultiple"
        />
        <p>Selected: {{ groupMultipleLabel() }}</p>
        <button aerisButton variant="outline" type="button" (click)="groupMultiple.set([])">
          Clear selection
        </button>
      </div>
    </div>
  `,
  styles: `
    .chip-removable-demo {
      display: grid;
      justify-items: start;
      gap: 0.875rem;
    }

    .chip-removable-demo p {
      margin: 0;
      color: var(--aeris-text-2);
    }
  `
})
export class ChipGroupMultipleDemo {
  protected readonly groupOptions: readonly AerisChipGroupItem[] = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second', disabled: true },
      { id: 'third', label: 'Third' },
      { id: 'fourth', label: 'Fourth' },
    ];

  protected readonly groupMultiple = signal<AerisChipGroupValue>(['first']);

  protected readonly groupMultipleLabel = computed(() => {
      const value = this.groupMultiple();
      return Array.isArray(value) && value.length ? value.join(', ') : 'None';
    });
}
```

### Grouped removal and cancellation

The group owns the collection and restores focus after removal. Cancel synchronous requests without changing data, or allow removal and empty the collection.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipGroupItem, type AerisChipGroupRemovingEvent } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-group-removal-demo',
  imports: [AerisButton, AerisChipModule],
  templateUrl: './chip-group-removal.demo.html',
  styleUrl: './chip-group-removal.demo.scss'
})
export class ChipGroupRemovalDemo {
  protected readonly initialGroupItems: readonly AerisChipGroupItem[] = [
      { id: 'first', label: 'First' },
      { id: 'protected', label: 'Protected' },
      { id: 'last', label: 'Last' },
    ];

  protected readonly groupItems = signal(this.initialGroupItems);

  protected readonly groupStatus = signal('Remove any chip except Protected.');

  protected readonly groupRemovalAllowed = signal(false);

  protected toggleGroupRemoval(): void {
      this.groupRemovalAllowed.update((allowed) => !allowed);
      this.groupStatus.set(
        this.groupRemovalAllowed() ? 'Protected can now be removed.' : 'Protected cannot be removed.',
      );
    }

  protected resetGroupRemoval(): void {
      this.groupItems.set(this.initialGroupItems);
      this.groupRemovalAllowed.set(false);
      this.groupStatus.set('Chips reset. Remove any chip except Protected.');
    }

  protected guardGroupRemoval(event: AerisChipGroupRemovingEvent): void {
      if (event.item.id === 'protected' && !this.groupRemovalAllowed()) {
        event.preventDefault();
        this.groupStatus.set('Protected cannot be removed.');
      }
    }
}
```

#### HTML

```html
<div>
  <div class="chip-removable-demo">
    <aeris-chip-group
      ariaLabel="Removable choices"
      removable
      [(items)]="groupItems"
      (removing)="guardGroupRemoval($event)"
      (removed)="groupStatus.set('Removed ' + $event.item.label + '.')"
    />
    <p role="status">{{ groupStatus() }}</p>
    <div class="chip-row">
      <button aerisButton variant="outline" type="button" (click)="toggleGroupRemoval()">
        {{
          groupRemovalAllowed() ? 'Disallow protected removal' : 'Allow protected removal'
        }}
      </button>
      <button aerisButton variant="outline" type="button" (click)="resetGroupRemoval()">
        Reset chips
      </button>
    </div>
  </div>
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

### Signal Forms

The selection value integrates with Signal Forms. Invalid styling stays neutral until touched, and the error message is associated with the group.

#### TS

```ts
import { Component, computed, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipGroupItem, type AerisChipGroupValue } from '@aeris-ui/core/chip';
import { AerisMessageModule } from '@aeris-ui/core/message';
import { FormField, form, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-chip-group-forms-demo',
  imports: [AerisButton, AerisChipModule, AerisMessageModule, FormField],
  templateUrl: './chip-group-forms.demo.html',
  styleUrl: './chip-group-forms.demo.scss'
})
export class ChipGroupFormsDemo {
  protected readonly groupOptions: readonly AerisChipGroupItem[] = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second', disabled: true },
      { id: 'third', label: 'Third' },
      { id: 'fourth', label: 'Fourth' },
    ];

  protected readonly groupData = signal<{ choices: AerisChipGroupValue }>({ choices: [] });

  protected readonly groupFields = form(this.groupData, (schema) =>
      validate(schema.choices, ({ value }) => {
        const choices = value();
        return Array.isArray(choices) && choices.length > 0
          ? undefined
          : { kind: 'required', message: 'Choose at least one item.' };
      }),
    );

  protected readonly groupError = computed(
      () => this.groupFields.choices().touched() && this.groupFields.choices().invalid(),
    );

  protected readonly groupValidated = signal(false);

  protected readonly groupValidationSuccess = computed(
      () => this.groupValidated() && !this.groupFields.choices().invalid(),
    );

  protected readonly groupFeedbackId = computed(() =>
      this.groupError()
        ? 'chip-group-error'
        : this.groupValidationSuccess()
          ? 'chip-group-success'
          : '',
    );

  protected validateGroup(): void {
      this.groupFields.choices().markAsTouched();
      this.groupValidated.set(true);
    }

  protected resetGroupForm(): void {
      this.groupFields.choices().reset([]);
      this.groupValidated.set(false);
    }
}
```

#### HTML

```html
<div>
  <div class="chip-removable-demo">
    <aeris-chip-group
      ariaLabel="Required choices"
      selectionMode="multiple"
      [items]="groupOptions"
      [formField]="groupFields.choices"
      [ariaDescribedBy]="groupFeedbackId()"
      (changed)="groupValidated.set(false)"
    />
    @if (groupError()) {
      <aeris-message id="chip-group-error" severity="danger">
        Choose at least one item.
      </aeris-message>
    } @else if (groupValidationSuccess()) {
      <aeris-message id="chip-group-success" severity="success">
        Selection is valid.
      </aeris-message>
    }
    <div class="chip-row">
      <button aerisButton variant="outline" type="button" (click)="validateGroup()">
        Validate group
      </button>
      <button aerisButton variant="outline" type="button" (click)="resetGroupForm()">
        Reset form
      </button>
    </div>
  </div>
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

### Reactive Forms

Classic forms synchronize the selection and disabled state through ControlValueAccessor.

#### TS

```ts
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipGroupItem, type AerisChipGroupValue } from '@aeris-ui/core/chip';

@Component({
  selector: 'app-chip-group-reactive-demo',
  imports: [AerisButton, AerisChipModule, ReactiveFormsModule],
  templateUrl: './chip-group-reactive.demo.html',
  styleUrl: './chip-group-reactive.demo.scss'
})
export class ChipGroupReactiveDemo {
  protected readonly groupOptions: readonly AerisChipGroupItem[] = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second', disabled: true },
      { id: 'third', label: 'Third' },
      { id: 'fourth', label: 'Fourth' },
    ];

  protected readonly groupControl = new FormControl<AerisChipGroupValue>('third');

  protected toggleGroupControl(): void {
      if (this.groupControl.disabled) this.groupControl.enable();
      else this.groupControl.disable();
    }
}
```

#### HTML

```html
<div>
  <div class="chip-removable-demo">
    <aeris-chip-group
      ariaLabel="Reactive choices"
      selectionMode="single"
      [items]="groupOptions"
      [formControl]="groupControl"
    />
    <p>Selected: {{ groupControl.value || 'None' }}</p>
    <div class="chip-row">
      <button aerisButton variant="outline" type="button" (click)="toggleGroupControl()">
        {{ groupControl.disabled ? 'Enable group' : 'Disable group' }}
      </button>
      <button
        aerisButton
        variant="outline"
        type="button"
        (click)="groupControl.reset({ value: 'third', disabled: false })"
      >
        Reset control
      </button>
    </div>
  </div>
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

## Accessibility

- Standalone Chip is not a selectable item or a keyboard collection. Static chips do not receive focus, and removable chips expose only their native remove button. Keep projected content and custom remove artwork non-interactive.
- Cancellation leaves focus on the remove button. After accepted removal, choose a meaningful destination in the parent: the standalone example focuses its Restore button. A collection should focus the next enabled item, then the previous enabled item, then its entry control if empty. Wait until the updated collection is rendered before focusing a newly rendered item. Chip does not inspect sibling elements or choose that destination automatically; focus() lets the parent focus an existing removable chip.
- Static chips expose their visible label and projected content without entering the tab order.
- Removable chips use a semantic native button with an accessible name derived from the label, ariaLabel, ariaLabelledBy, or an explicit removeAriaLabel. Supply a name for projected-only content; otherwise the fallback is “Remove chip”.
- Consumer-provided leading icons marked with aerisChipLeading are decorative. Meaningful custom content can use ariaLabel or ariaLabelledBy.
- Images become decorative when a label or explicit accessible name already identifies the chip, preventing duplicate announcements.
- Disabled chips expose aria-disabled and disable their native remove button.
- Long labels are contained with an ellipsis and never create page-level horizontal overflow.
- Chip includes no required animation and respects reduced-motion preferences.
- The optional ChipGroup owns collection behavior. No-selection groups use native remove buttons. Selectable groups are named toolbars of native pressed buttons, with separate sibling remove buttons rather than nested interactive controls. Single mode permits zero or one pressed item; multiple mode permits any number. Selection and focus are independent. Selected remove actions stay available by pointer and assistive-technology button navigation; Delete/Backspace offers the equivalent action from the focused choice.
- Grouped chips use autoHide=false internally. Accepted removal updates items and prunes that item's selected key once, then restores focus to the next enabled member, previous member, or the empty group. Cancel removing synchronously to retain the item and focus. External removal/disabled-state changes also repair focus while it remains in the group; the group does not steal focus after you leave. Hidden keys from unrelated external value updates are not automatically discarded. This is not a tag-entry field. Signal Forms and classic forms bind the selection value, not the collection; native form serialization is application-owned.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab / Shift + Tab` | One entry stop for the enabled collection; then leave it. Empty/static-only groups focus their entry target. |
| `Left / Right` | Previous/next enabled member in horizontal mode; reversed in RTL. Wraps across rows in item order. |
| `Up / Down` | Previous/next enabled member in vertical mode. |
| `Home / End` | First/last enabled member. |
| `Enter / Space` | Toggle the focused choice, or remove the focused member in no-selection mode. |
| `Delete / Backspace` | Request removal of the focused removable member. Cancellation preserves focus and state. |
