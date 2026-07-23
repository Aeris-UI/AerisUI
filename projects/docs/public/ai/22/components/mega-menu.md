# MegaMenu

> Large navigation menu with grouped panels, horizontal or vertical orientation, templates, commands, and keyboard support.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/mega-menu`
- Human-readable documentation: [https://aeris-ui.dev/components/mega-menu](https://aeris-ui.dev/components/mega-menu)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisMegaMenuModule } from '@aeris-ui/core/mega-menu';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Base id used for menu item and panel relationships. |
| `model` | `readonly AerisMegaMenuItem&lt;T&gt;[]` | `[]` | Root menu items with optional grouped mega panels. |
| `orientation` | `horizontal &#124; vertical` | `'horizontal'` | Lays root items across or stacked. |
| `size` | `sm &#124; md &#124; lg` | `'md'` | Controls trigger and panel item density. |
| `ariaLabel` | `string` | `'Mega menu'` | Accessible name for the navigation region. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the navigation region. |
| `openOnHover` | `boolean` | `true` | Opens root panels on pointer hover. |
| `closeOnSelect` | `boolean` | `true` | Closes an open panel after activating a leaf item. |
| `navigationHandler` | `AerisMegaMenuNavigationHandler` | `undefined` | Handles routerLink items without coupling Aeris to Angular Router. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `itemSelected` | `AerisMegaMenuItemEvent&lt;T&gt;` | `-` | Emitted when an enabled item is activated. |
| `opened` | `AerisMegaMenuVisibilityEvent&lt;T&gt;` | `-` | Emitted when a root mega panel opens. |
| `closed` | `AerisMegaMenuVisibilityEvent&lt;T&gt;` | `-` | Emitted when a root mega panel closes. |

### MegaMenu templates

| Name | Context | Default | Description |
| --- | --- | --- | --- |
| aerisMegaMenuItem | AerisMegaMenuItemTemplateContext | default item content | Customizes root triggers and panel items. |

### MegaMenu methods

| Name | Signature | Default | Description |
| --- | --- | --- | --- |
| open(index, event?) | number, Event &#124; null =&gt; void | - | Opens a root panel by index. |
| close(event?, reason?) | Event &#124; null, reason =&gt; void | - | Closes the open panel. |
| toggle(index, event?) | number, Event &#124; null =&gt; void | - | Toggles a root panel by index. |
| focus() | () =&gt; void | - | Moves focus to the active or first root item. |

## Interfaces and types

### Interfaces

```ts
type AerisMegaMenuOrientation = 'horizontal' | 'vertical';
type AerisMegaMenuSize = 'sm' | 'md' | 'lg';
type AerisMegaMenuCloseReason = 'api' | 'escape' | 'outside' | 'select';

interface AerisMegaMenuItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly badge?: string | number;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: string;
  readonly rel?: string;
  readonly items?: readonly AerisMegaMenuItem<T>[];
  readonly groups?: readonly AerisMegaMenuGroup<T>[];
  readonly data?: T;
  readonly command?: (event: AerisMegaMenuItemEvent<T>) => void;
}

interface AerisMegaMenuGroup<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
  readonly items: readonly AerisMegaMenuItem<T>[];
}

interface AerisMegaMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisMegaMenuItem<T>;
  readonly path: readonly number[];
  readonly root: AerisMegaMenuItem<T>;
  readonly group: AerisMegaMenuGroup<T> | null;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-mega-menu-background` | `color` | `--aeris-surface` | Root surface background. |
| `--aeris-mega-menu-border` | `color` | `--aeris-border` | Root and nested separator border color. |
| `--aeris-mega-menu-panel-background` | `color` | `--aeris-surface` | Mega panel background. |
| `--aeris-mega-menu-panel-width` | `length` | `44rem` | Maximum panel width before viewport clamping. |
| `--aeris-mega-menu-item-hover-background` | `color` | `primary mix` | Hover and open trigger surface. |
| `--aeris-mega-menu-icon-size` | `length` | `1.125rem` | Default icon and chevron box. |

## Examples

### Basic

Use grouped items to organize wide navigation surfaces.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMegaMenuModule, type AerisMegaMenuItem } from '@aeris-ui/core/mega-menu';

@Component({
  selector: 'app-mega-menu-basic-demo',
  imports: [AerisMegaMenuModule],
  template: `
    <div>
      <aeris-mega-menu [model]="productMenu" ariaLabel="Product navigation" />
    </div>
  `
})
export class MegaMenuBasicBasicDemo {
  protected readonly productMenu: readonly AerisMegaMenuItem[] = [
    {
      label: 'Products',
      groups: [
        {
          label: 'Build',
          description: 'Component foundations',
          items: [
            { label: 'Components', routerLink: ['/components'] },
            { label: 'Design tokens' },
            { label: 'Accessibility' },
          ],
        },
        {
          label: 'Ship',
          items: [
            { label: 'Documentation' },
            { label: 'Migration plans', badge: 'New' },
            { label: 'Changelog', disabled: true },
          ],
        },
      ],
    },
  ];
}
```

### Vertical

Switch orientation when the menu belongs in a sidebar or narrow navigation region.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMegaMenuModule, type AerisMegaMenuItem } from '@aeris-ui/core/mega-menu';

@Component({
  selector: 'app-mega-menu-vertical-demo',
  imports: [AerisMegaMenuModule],
  template: `
    <div>
      <aeris-mega-menu
        orientation="vertical"
        [model]="productMenu"
        ariaLabel="Vertical product navigation"
      />
    </div>
  `
})
export class MegaMenuVerticalVerticalDemo {
  protected readonly productMenu: readonly AerisMegaMenuItem[] = [
    {
      label: 'Products',
      groups: [
        {
          label: 'Build',
          description: 'Component foundations',
          items: [
            { label: 'Components', routerLink: ['/components'] },
            { label: 'Design tokens' },
            { label: 'Accessibility' },
          ],
        },
        {
          label: 'Ship',
          items: [
            { label: 'Documentation' },
            { label: 'Migration plans', badge: 'New' },
            { label: 'Changelog', disabled: true },
          ],
        },
      ],
    },
  ];
}
```

### Template

Use the item template to customize root triggers and panel items without changing menu semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMegaMenuModule, type AerisMegaMenuItem } from '@aeris-ui/core/mega-menu';

@Component({
  selector: 'app-mega-menu-template-demo',
  imports: [AerisMegaMenuModule],
  template: `
    <div>
      <aeris-mega-menu [model]="productMenu" ariaLabel="Templated product navigation">
        <ng-template aerisMegaMenuItem let-item let-root="root" let-hasPanel="hasPanel">
          <span class="mega-menu-template-item">
            <strong>{{ item.label }}{{ hasPanel ? ' +' : '' }}</strong>
            @if (!root && item.description) {
              <small>{{ item.description }}</small>
            }
          </span>
        </ng-template>
      </aeris-mega-menu>
    </div>
  `,
  styles: `
    .mega-menu-template-item {
      display: grid;
      gap: 0.125rem;
    }
    
    .mega-menu-template-item strong {
      font-weight: 850;
    }
    
    .mega-menu-template-item small {
      color: var(--text-2);
    }
  `
})
export class MegaMenuTemplateTemplateDemo {
  protected readonly productMenu: readonly AerisMegaMenuItem[] = [
    {
      label: 'Products',
      groups: [
        {
          label: 'Build',
          description: 'Component foundations',
          items: [
            { label: 'Components', routerLink: ['/components'] },
            { label: 'Design tokens' },
            { label: 'Accessibility' },
          ],
        },
        {
          label: 'Ship',
          items: [
            { label: 'Documentation' },
            { label: 'Migration plans', badge: 'New' },
            { label: 'Changelog', disabled: true },
          ],
        },
      ],
    },
  ];
}
```

### Command and links

Items can run commands, use routerLink, or link to external URLs. Use navigationHandler for app-owned routing.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisMegaMenuModule, type AerisMegaMenuItem, type AerisMegaMenuItemEvent } from '@aeris-ui/core/mega-menu';

@Component({
  selector: 'app-mega-menu-command-demo',
  imports: [AerisMegaMenuModule],
  template: `
    <div>
      <aeris-mega-menu
        [model]="commandMenu"
        ariaLabel="Workspace navigation"
        (itemSelected)="recordAction($event)"
      />
      <small aria-live="polite">{{ lastAction() }}</small>
    </div>
  `
})
export class MegaMenuCommandCommandAndLinksDemo {
  protected readonly commandMenu: readonly AerisMegaMenuItem[] = [
    {
      label: 'Workspace',
      groups: [
        {
          label: 'Project',
          items: [
            { label: 'New page', command: (event) => this.recordAction(event) },
            { label: 'Duplicate', command: (event) => this.recordAction(event) },
          ],
        },
      ],
    },
  ];

  protected recordAction(event: AerisMegaMenuItemEvent): void {
    this.lastAction.set(`Activated ${event.item.label}`);
  }
}
```

## Accessibility

- The root list uses role="menubar" and exposes aria-orientation.
- Root items and panel items use role="menuitem".
- Root triggers with panels expose aria-haspopup, aria-expanded, and aria-controls.
- Panels use role="menu". Disabled items use native disabled buttons or aria-disabled links.
- Use ariaLabel or ariaLabelledBy to provide a clear navigation name.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Menu |
| `Arrow Right` | Horizontal root |
| `Arrow Left` | Horizontal root |
| `Arrow Down` | Root item with panel |
| `Arrow Up` | Horizontal root item with panel |
| `Arrow keys` | Panel item |
| `Home` | Root or panel |
| `End` | Root or panel |
| `Enter` | Menu item |
| `Space` | Menu item |
| `Escape` | Open panel |
