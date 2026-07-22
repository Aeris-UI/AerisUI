# Breadcrumb

> Hierarchical navigation trail with links, actions, current-page semantics, templates, separators, and ellipsis collapsing.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/breadcrumb`
- Human-readable documentation: [https://aeris-ui.dev/components/breadcrumb](https://aeris-ui.dev/components/breadcrumb)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisBreadcrumbModule } from '@aeris-ui/core/breadcrumb';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Host ID. |
| `items` | `readonly AerisBreadcrumbItem[]` | `[]` | Breadcrumb trail items after the optional home item. |
| `home` | `AerisBreadcrumbItem &#124; null` | `null` | Optional first item for the root location. It can be icon-only when ariaLabel is provided. |
| `variant` | `AerisBreadcrumbVariant` | `'outlined'` | Outlined, filled, or plain surface treatment. |
| `size` | `AerisBreadcrumbSize` | `'md'` | Controls padding, separator size, and text density. |
| `separator` | `string` | `''` | Text separator. Empty value renders the default Aeris chevron. |
| `maxItems` | `number &#124; null` | `null` | Maximum visible items before middle items collapse behind an ellipsis. |
| `wrap` | `boolean` | `true` | Allows the breadcrumb trail to wrap when space is limited. |
| `fluid` | `boolean` | `true` | Makes the breadcrumb fill the available inline size. |
| `ariaLabel` | `string` | `'Breadcrumb'` | Accessible name for the internal navigation element. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the breadcrumb navigation. |
| `ariaDescribedBy` | `string` | `''` | ID of text that describes the breadcrumb navigation. |
| `ariaCurrent` | `AerisBreadcrumbAriaCurrent` | `'page'` | Value applied to the current item through aria-current. |
| `ellipsisLabel` | `string` | `'Show hidden breadcrumb items'` | Accessible name for the ellipsis button. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `itemSelected` | `AerisBreadcrumbItemEvent` | `-` | Emitted when a non-current, enabled item is selected. |
| `ellipsisSelected` | `AerisBreadcrumbEllipsisEvent` | `-` | Emitted when the ellipsis control is selected. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisBreadcrumbItem` | `AerisBreadcrumbItemTemplateContext` | `default anchor, button, or text item` | Custom content for each visible breadcrumb item. |
| `aerisBreadcrumbSeparator` | `AerisBreadcrumbSeparatorTemplateContext` | `Aeris chevron icon or separator text` | Custom separator rendered between items. |
| `aerisBreadcrumbEllipsis` | `AerisBreadcrumbEllipsisTemplateContext` | `ellipsis glyph` | Custom ellipsis content when middle items are collapsed. |

### Content Rows

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `default content` | `content projection` | `-` | Only template directives are consumed. Visual items come from the items and home inputs. |

## Interfaces and types

### Interfaces

```ts
type AerisBreadcrumbVariant = 'outlined' | 'filled' | 'plain';
type AerisBreadcrumbSize = 'sm' | 'md' | 'lg';
type AerisBreadcrumbAriaCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true';

interface AerisBreadcrumbItem {
  readonly label?: string;
  readonly icon?: string;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly target?: '_self' | '_blank' | '_parent' | '_top' | string;
  readonly rel?: string;
  readonly disabled?: boolean;
  readonly current?: boolean;
  readonly data?: unknown;
}

interface AerisBreadcrumbItemEvent {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisBreadcrumbItem;
  readonly index: number;
  readonly current: boolean;
}

interface AerisBreadcrumbEllipsisEvent {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}

interface AerisBreadcrumbItemTemplateContext {
  readonly $implicit: AerisBreadcrumbItem;
  readonly item: AerisBreadcrumbItem;
  readonly index: number;
  readonly current: boolean;
  readonly disabled: boolean;
}

interface AerisBreadcrumbSeparatorTemplateContext {
  readonly index: number;
  readonly item: AerisBreadcrumbItem;
  readonly nextItem: AerisBreadcrumbItem | null;
}

interface AerisBreadcrumbEllipsisTemplateContext {
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-breadcrumb-background` | `color` | `--aeris-surface` | Breadcrumb surface color. |
| `--aeris-breadcrumb-color` | `color` | `--aeris-text` | Default breadcrumb text color. |
| `--aeris-breadcrumb-muted-color` | `color` | `--aeris-text-2` | Non-current item color. |
| `--aeris-breadcrumb-current-color` | `color` | `--aeris-text` | Current item color. |
| `--aeris-breadcrumb-border` | `color` | `--aeris-border` | Breadcrumb border color. |
| `--aeris-breadcrumb-border-width` | `length` | `1px` | Breadcrumb border width. |
| `--aeris-breadcrumb-radius` | `length` | `--aeris-radius-lg` | Breadcrumb corner radius. |
| `--aeris-breadcrumb-shadow` | `shadow` | `none` | Breadcrumb shadow. |
| `--aeris-breadcrumb-padding-block` | `length` | `0.75rem` | Default block padding. |
| `--aeris-breadcrumb-padding-inline` | `length` | `0.875rem` | Default inline padding. |
| `--aeris-breadcrumb-gap` | `length` | `0.25rem` | Gap between list items. |
| `--aeris-breadcrumb-item-gap` | `length` | `0.375rem` | Gap inside each item. |
| `--aeris-breadcrumb-icon-size` | `length` | `1rem` | Default icon box size for item icon metadata. |
| `--aeris-breadcrumb-item-radius` | `length` | `--aeris-radius-sm` | Interactive item radius. |
| `--aeris-breadcrumb-item-hover-background` | `color` | `primary mix` | Hover background for links and buttons. |
| `--aeris-breadcrumb-separator-color` | `color` | `muted text mix` | Separator color. |
| `--aeris-breadcrumb-separator-size` | `length` | `1.25rem` | Default separator icon box size. |
| `--aeris-breadcrumb-disabled-opacity` | `number` | `0.54` | Disabled item opacity. |

## Examples

### Basic

Render a simple trail where the last item is marked as the current page.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-breadcrumb-basic-demo',
  imports: [AerisBreadcrumbModule],
  template: `
    <div>
      <aeris-breadcrumb [items]="productTrail" ariaLabel="Product path" />
    </div>
  `
})
export class BreadcrumbBasicBasicDemo {
  protected readonly productTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Products' },
    { label: 'Electronics' },
    { label: 'Laptops' },
    { label: 'Aeris Pro 14' },
  ];
}
```

### Icons

Use item icon and label metadata to render icon-only, label-only, or icon-and-label breadcrumbs.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';
import { LucideDynamicIcon, LucideEllipsis, LucideHome, LucideZap, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-breadcrumb-home-demo',
  imports: [AerisBreadcrumbModule, LucideDynamicIcon],
  templateUrl: './breadcrumb-home.demo.html',
  styleUrl: './breadcrumb-home.demo.scss'
})
export class BreadcrumbHomeIconsDemo {
  protected readonly breadcrumbIcons: Readonly<Record<string, LucideIconInput>> = {
    Ellipsis: LucideEllipsis,
    Home: LucideHome,
    Zap: LucideZap,
  };

  protected readonly iconHome: AerisBreadcrumbItem = { icon: 'Home', ariaLabel: 'Home' };

  protected readonly iconTrail: readonly AerisBreadcrumbItem[] = [
    { icon: 'Ellipsis', ariaLabel: 'More sections' },
    { label: 'Products' },
    { icon: 'Zap', label: 'Electronics' },
    { label: 'Laptops' },
    { label: 'Dell' },
  ];
}
```

#### HTML

```html
<div>
  <aeris-breadcrumb
    [home]="iconHome"
    [items]="iconTrail"
    ariaLabel="Product path with icons"
  >
    <ng-template aerisBreadcrumbItem let-item>
      <span class="breadcrumb-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="breadcrumbIcons[item.icon]"></svg>
        }
        @if (item.label) {
          <span>{{ item.label }}</span>
        }
      </span>
    </ng-template>
  </aeris-breadcrumb>
</div>
```

#### CSS

```css
.breadcrumb-icon-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.breadcrumb-icon-item svg {
  width: 1rem;
  height: 1rem;
}
```

### Links and actions

Items with href render as anchors, items without href render as buttons, and disabled or current items are not interactive.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem, type AerisBreadcrumbItemEvent } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-breadcrumb-actions-demo',
  imports: [AerisBreadcrumbModule],
  template: `
    <div>
      <aeris-breadcrumb
        [items]="adminTrail"
        ariaLabel="Admin path"
        (itemSelected)="recordSelection($event)"
      />
      <p class="breadcrumb-status" aria-live="polite">
        Last selected: {{ lastSelection }}
      </p>
    </div>
  `,
  styles: `
    .breadcrumb-status {
      margin: 0.75rem 0 0;
      color: var(--text-2);
      font-size: 0.8125rem;
    }
  `
})
export class BreadcrumbActionsLinksAndActionsDemo {
  protected readonly adminTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Admin' },
    { label: 'Users', disabled: true },
    { label: 'Ana Martin', current: true },
  ];

  protected lastSelection = 'None';

  protected recordSelection(event: AerisBreadcrumbItemEvent): void {
    this.lastSelection = event.item.label ?? event.item.ariaLabel ?? event.item.icon ?? 'Unnamed item';
  }
}
```

### Separator

Use text separators when a page needs a different visual rhythm from the default chevron.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-breadcrumb-separator-demo',
  imports: [AerisBreadcrumbModule],
  template: `
    <div>
      <aeris-breadcrumb
        [items]="productTrail"
        separator="/"
        ariaLabel="Slash separated product path"
      />
    </div>
  `
})
export class BreadcrumbSeparatorSeparatorDemo {
  protected readonly productTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Products' },
    { label: 'Electronics' },
    { label: 'Laptops' },
    { label: 'Aeris Pro 14' },
  ];
}
```

### Ellipsis

Collapse middle items when long paths need to fit compact spaces.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbEllipsisEvent, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-breadcrumb-ellipsis-demo',
  imports: [AerisBreadcrumbModule],
  template: `
    <div>
      <aeris-breadcrumb
        [items]="longTrail"
        [maxItems]="4"
        ariaLabel="Collapsed project path"
        (ellipsisSelected)="recordHiddenItems($event)"
      />
      <p class="breadcrumb-status" aria-live="polite">Hidden: {{ hiddenSummary }}</p>
    </div>
  `,
  styles: `
    .breadcrumb-status {
      margin: 0.75rem 0 0;
      color: var(--text-2);
      font-size: 0.8125rem;
    }
  `
})
export class BreadcrumbEllipsisEllipsisDemo {
  protected readonly longTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Workspace' },
    { label: 'Projects' },
    { label: 'Aeris UI' },
    { label: 'Components' },
    { label: 'Menu' },
    { label: 'Breadcrumb' },
  ];

  protected hiddenSummary = 'None';

  protected recordHiddenItems(event: AerisBreadcrumbEllipsisEvent): void {
    this.hiddenSummary = event.hiddenItems
      .map((item) => item.label ?? item.ariaLabel ?? item.icon ?? 'Unnamed item')
      .join(', ');
  }
}
```

### Item template

Customize visible item content while keeping the breadcrumb navigation semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-breadcrumb-template-demo',
  imports: [AerisBreadcrumbModule],
  template: `
    <div>
      <aeris-breadcrumb [items]="customTrail" ariaLabel="Catalog path">
        <ng-template aerisBreadcrumbItem let-item let-current="current">
          <span class="breadcrumb-custom-item" [attr.data-current]="current || null">
            <span>{{ item.label }}</span>
            @if (customCounts[item.label ?? '']; as count) {
              <span class="breadcrumb-count">{{ count }}</span>
            }
          </span>
        </ng-template>
      </aeris-breadcrumb>
    </div>
  `,
  styles: `
    .breadcrumb-custom-item {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }
    
    .breadcrumb-count {
      min-width: 1.375rem;
      padding: 0.125rem 0.375rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--aeris-primary) 16%, transparent);
      color: var(--aeris-primary-text);
      font-size: 0.75rem;
      font-weight: 800;
      text-align: center;
    }
  `
})
export class BreadcrumbTemplateItemTemplateDemo {
  protected readonly customTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Catalog' },
    { label: 'Laptops', data: { count: 42 } },
    { label: 'Aeris Pro 14', data: { count: 5 } },
  ];

  protected readonly customCounts: Readonly<Record<string, number>> = {
    Laptops: 42,
    'Aeris Pro 14': 5,
  };
}
```

### Variants and sizes

Choose outlined, filled, or plain surfaces and adjust density with size.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBreadcrumbModule, type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

@Component({
  selector: 'app-breadcrumb-variants-demo',
  imports: [AerisBreadcrumbModule],
  templateUrl: './breadcrumb-variants.demo.html',
  styleUrl: './breadcrumb-variants.demo.scss'
})
export class BreadcrumbVariantsVariantsAndSizesDemo {
  protected readonly productTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Products' },
    { label: 'Electronics' },
    { label: 'Laptops' },
    { label: 'Aeris Pro 14' },
  ];
}
```

#### HTML

```html
<div>
  <div class="breadcrumb-grid">
    <aeris-breadcrumb
      [items]="productTrail"
      size="sm"
      ariaLabel="Small outlined breadcrumb"
    />
    <aeris-breadcrumb
      [items]="productTrail"
      variant="filled"
      ariaLabel="Filled breadcrumb"
    />
    <aeris-breadcrumb
      [items]="productTrail"
      variant="plain"
      size="lg"
      ariaLabel="Large plain breadcrumb"
    />
  </div>
</div>
```

#### CSS

```css
.breadcrumb-grid {
  display: grid;
  gap: 1rem;
}
```

## Accessibility

- Breadcrumb renders an internal nav landmark containing an ordered list.
- Provide ariaLabel or ariaLabelledBy so assistive technologies can identify the navigation region.
- The current item is the last item by default, or the first item with current: true.
- The current item receives aria-current and is rendered as non-interactive text.
- Items with href render as native anchors. Items without href render as native buttons unless they are disabled or current.
- Separators are decorative and marked with aria-hidden.
- Use the item template for router links or richer labels when the default anchor, button, or text rendering is not enough.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Links, action items, and ellipsis |
| `Shift + Tab` | Links, action items, and ellipsis |
| `Enter` | Focused link, action item, or ellipsis |
| `Space` | Focused button or ellipsis |
| `Arrow keys` | Breadcrumb |
