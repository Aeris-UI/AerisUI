# ContextMenu

> Right-click action menu with target or global triggers, nested submenus, templates, commands, and keyboard navigation.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/context-menu`
- Human-readable documentation: [https://aeris-ui.dev/components/context-menu](https://aeris-ui.dev/components/context-menu)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisContextMenuModule } from '@aeris-ui/core/context-menu';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Root menu ID used for menu and submenu relationships. |
| `model` | `readonly AerisContextMenuItem&lt;T&gt;[]` | `[]` | Menu item model including separators, disabled state, commands, links, and nested children. |
| `open` | `ModelSignal&lt;boolean&gt;` | `false` | Controlled visibility state. |
| `target` | `AerisContextMenuTarget` | `null` | Element that opens the menu on contextmenu. |
| `global` | `boolean` | `false` | Opens the menu from document-level contextmenu events. |
| `disabled` | `boolean` | `false` | Prevents target, global, and programmatic opening. |
| `size` | `AerisContextMenuSize` | `'md'` | Controls item density and icon sizing. |
| `width` | `string` | `''` | CSS width for the root menu panel. |
| `maxWidth` | `string` | `''` | CSS max-width for the root menu panel. |
| `viewportMargin` | `number` | `8` | Minimum spacing from viewport edges when positioning. |
| `hideOnOutsideClick` | `boolean` | `true` | Closes the menu when pointerdown occurs outside the panel. |
| `hideOnScroll` | `boolean` | `false` | Closes on window scroll instead of repositioning. |
| `closeOnEscape` | `boolean` | `true` | Closes the menu when Escape is pressed. |
| `autoFocus` | `boolean` | `true` | Moves focus to the first enabled item after opening. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the context target when the menu closes. |
| `useMenubarRole` | `boolean` | `false` | Uses role menubar for the root list when an application requires that pattern. |
| `ariaLabel` | `string` | `'Context menu'` | Accessible name for the root menu. |
| `ariaLabelledBy` | `string` | `''` | ID of visible text that labels the root menu. |
| `panelStyleClass` | `string` | `''` | Additional class applied to the floating panel. |
| `navigationHandler` | `AerisContextMenuNavigationHandler` | `undefined` | Handles routerLink items without coupling Aeris to Angular Router. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `shown` | `AerisContextMenuVisibilityEvent` | `-` | Emitted after the menu is requested open. |
| `hidden` | `AerisContextMenuVisibilityEvent` | `-` | Emitted after the menu closes. |
| `visibilityChanged` | `AerisContextMenuVisibilityEvent` | `-` | Emitted for both show and hide transitions. |
| `itemSelected` | `AerisContextMenuItemEvent&lt;T&gt;` | `-` | Emitted when an enabled leaf item is activated. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisContextMenuItem` | `AerisContextMenuItemTemplateContext&lt;T&gt;` | `default item row` | Customizes item content for every non-separator row. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(event)` | `MouseEvent &#124; PointerEvent =&gt; void` | `-` | Opens the menu at the event coordinates and prevents the native context menu. |
| `openAt(x, y, originalEvent?)` | `number, number, Event &#124; null =&gt; void` | `-` | Opens the menu at explicit viewport coordinates. |
| `hide(event?, reason?, restoreFocus?)` | `Event &#124; null, AerisContextMenuCloseReason, boolean =&gt; void` | `-` | Closes the menu. |
| `toggle(event)` | `MouseEvent &#124; PointerEvent =&gt; void` | `-` | Toggles visibility at the event coordinates. |
| `focus()` | `() =&gt; void` | `-` | Moves focus to the active menu item. |
| `reposition()` | `() =&gt; void` | `-` | Recomputes panel placement inside the viewport. |

## Interfaces and types

### Interfaces

```ts
type AerisContextMenuSize = 'sm' | 'md' | 'lg';
type AerisContextMenuCloseReason = 'api' | 'escape' | 'outside' | 'scroll' | 'select' | 'target';
type AerisContextMenuTarget = Element | EventTarget | null | undefined;

interface AerisContextMenuItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly badge?: string | number;
  readonly shortcut?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top' | string;
  readonly rel?: string;
  readonly items?: readonly AerisContextMenuItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisContextMenuItemEvent<T>) => void;
}

interface AerisContextMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisContextMenuItem<T>;
  readonly path: readonly number[];
  readonly target: Element | null;
}

interface AerisContextMenuVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisContextMenuCloseReason;
  readonly target: Element | null;
}

interface AerisContextMenuItemTemplateContext<T = unknown> {
  readonly $implicit: AerisContextMenuItem<T>;
  readonly item: AerisContextMenuItem<T>;
  readonly path: readonly number[];
  readonly level: number;
  readonly active: boolean;
  readonly open: boolean;
  readonly disabled: boolean;
  readonly hasSubmenu: boolean;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-context-menu-z-index` | `number` | `1060` | Floating layer z-index. |
| `--aeris-context-menu-width` | `length` | `14rem` | Default panel width. |
| `--aeris-context-menu-max-width` | `length` | `min(22rem, calc(100vw - 1rem))` | Panel max width. |
| `--aeris-context-menu-max-height` | `length` | `min(26rem, calc(100vh - 1rem))` | Root menu max height. |
| `--aeris-context-menu-padding` | `length` | `0.375rem` | Panel padding. |
| `--aeris-context-menu-border` | `color` | `--aeris-border` | Panel border color. |
| `--aeris-context-menu-radius` | `length` | `--aeris-radius-lg` | Panel radius. |
| `--aeris-context-menu-background` | `color` | `--aeris-surface` | Panel background. |
| `--aeris-context-menu-color` | `color` | `--aeris-text` | Panel text color. |
| `--aeris-context-menu-shadow` | `shadow` | `overlay shadow` | Panel and submenu shadow. |
| `--aeris-context-menu-item-gap` | `length` | `0.625rem` | Gap inside item rows. |
| `--aeris-context-menu-item-min-height` | `length` | `2.25rem` | Default item height. |
| `--aeris-context-menu-item-radius` | `length` | `--aeris-radius-sm` | Item radius. |
| `--aeris-context-menu-item-hover-background` | `color` | `primary mix` | Hover and active item background. |
| `--aeris-context-menu-icon-size` | `length` | `1.125rem` | Default icon box size. |
| `--aeris-context-menu-disabled-opacity` | `number` | `0.52` | Disabled item opacity. |
| `--aeris-context-menu-separator-color` | `color` | `--aeris-border` | Separator color. |
| `--aeris-context-menu-submenu-width` | `length` | `14rem` | Submenu width. |

## Examples

### Basic

Attach the menu to a target element and open it with the native contextmenu gesture.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisContextMenuModule, type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

@Component({
  selector: 'app-context-menu-basic-demo',
  imports: [AerisContextMenuModule],
  template: `
    <div>
      <div #basicTarget class="context-menu-target" tabindex="0">
        Right-click this surface
      </div>
      <aeris-context-menu
        [target]="basicTarget"
        [model]="basicItems"
        ariaLabel="File actions"
      />
    </div>
  `,
  styles: `
    .context-menu-target {
      display: grid;
      gap: 0.75rem;
      place-items: center;
      min-height: 9rem;
      border: 1px dashed var(--border);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
      color: var(--text-2);
      font-weight: 700;
      text-align: center;
    }
  `
})
export class ContextMenuBasicBasicDemo {
  protected readonly basicItems: readonly AerisContextMenuItem[] = [
    { label: 'Open' },
    { label: 'Rename' },
    { separator: true },
    { label: 'Archive', badge: 3 },
  ];
}
```

### Submenus

Nest items to expose related commands without overloading the root menu.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisContextMenuModule, type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

@Component({
  selector: 'app-context-menu-submenus-demo',
  imports: [AerisContextMenuModule],
  template: `
    <div>
      <div #submenuTarget class="context-menu-target" tabindex="0">
        Right-click for nested actions
      </div>
      <aeris-context-menu
        [target]="submenuTarget"
        [model]="submenuItems"
        ariaLabel="Project actions"
      />
    </div>
  `,
  styles: `
    .context-menu-target {
      display: grid;
      gap: 0.75rem;
      place-items: center;
      min-height: 9rem;
      border: 1px dashed var(--border);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
      color: var(--text-2);
      font-weight: 700;
      text-align: center;
    }
  `
})
export class ContextMenuSubmenusSubmenusDemo {
  protected readonly submenuItems: readonly AerisContextMenuItem[] = [
    {
      label: 'New',
      items: [
        { label: 'Component' },
        { label: 'Directive' },
        { label: 'Service' },
      ],
    },
    {
      label: 'Move to',
      items: [
        { label: 'Backlog' },
        { label: 'In progress' },
        { label: 'Done', disabled: true },
      ],
    },
    { separator: true },
    { label: 'Duplicate' },
  ];
}
```

### Global

Use global mode when the page itself owns the context menu behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisContextMenuModule, type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

@Component({
  selector: 'app-context-menu-global-demo',
  imports: [AerisButton, AerisContextMenuModule],
  template: `
    <div>
      <div class="context-menu-target" tabindex="0">
        <button aerisButton type="button" (click)="globalActive = !globalActive">
          {{ globalActive ? 'Disable' : 'Enable' }} global menu
        </button>
        <span>When enabled, right-click anywhere on this page.</span>
      </div>
      <aeris-context-menu
        [global]="globalActive"
        [model]="globalItems"
        ariaLabel="Page actions"
      />
    </div>
  `,
  styles: `
    .context-menu-target {
      display: grid;
      gap: 0.75rem;
      place-items: center;
      min-height: 9rem;
      border: 1px dashed var(--border);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
      color: var(--text-2);
      font-weight: 700;
      text-align: center;
    }
  `
})
export class ContextMenuGlobalGlobalDemo {
  protected readonly globalItems: readonly AerisContextMenuItem[] = [
    { label: 'Refresh view' },
    { label: 'Copy page link' },
    { separator: true },
    { label: 'Inspect tokens' },
  ];

  protected globalActive = false;
}
```

### Template

Customize item rows while keeping menu semantics and keyboard behavior.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisContextMenuModule, type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

@Component({
  selector: 'app-context-menu-template-demo',
  imports: [AerisBadgeModule, AerisContextMenuModule],
  templateUrl: './context-menu-template.demo.html',
  styleUrl: './context-menu-template.demo.scss'
})
export class ContextMenuTemplateTemplateDemo {
  protected readonly templateItems: readonly AerisContextMenuItem[] = [
    { label: 'Aeris Button', badge: 'New' },
    { label: 'Aeris ContextMenu', badge: 'New' },
    { label: 'Aeris Icons', badge: 'Planned', disabled: true },
  ];

  protected readonly templateTones: Readonly<Record<string, string>> = {
    'Aeris Button': 'success',
    'Aeris ContextMenu': 'info',
    'Aeris Icons': 'neutral',
  };
}
```

#### HTML

```html
<div>
  <div #templateTarget class="context-menu-target" tabindex="0">
    Right-click component list
  </div>
  <aeris-context-menu
    [target]="templateTarget"
    [model]="templateItems"
    ariaLabel="Component actions"
  >
    <ng-template aerisContextMenuItem let-item let-active="active">
      <span class="context-menu-custom-item" [attr.data-active]="active || null">
        <span>{{ item.label }}</span>
        <aeris-badge
          [value]="item.badge"
          [severity]="$any(templateTones[item.label])"
          size="sm"
          variant="soft"
        />
      </span>
    </ng-template>
  </aeris-context-menu>
</div>
```

#### CSS

```css
.context-menu-target {
  display: grid;
  gap: 0.75rem;
  place-items: center;
  min-height: 9rem;
  border: 1px dashed var(--aeris-border);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
  color: var(--aeris-text-2);
  font-weight: 700;
  text-align: center;
}

.context-menu-custom-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.context-menu-custom-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}


.context-menu-target {
  display: grid;
  gap: 0.75rem;
  place-items: center;
  min-height: 9rem;
  border: 1px dashed var(--border);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
  color: var(--text-2);
  font-weight: 700;
  text-align: center;
}
```

### Command

Attach command callbacks to leaf items and react to the selected item event.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisContextMenuModule, type AerisContextMenuItem, type AerisContextMenuItemEvent } from '@aeris-ui/core/context-menu';

@Component({
  selector: 'app-context-menu-command-demo',
  imports: [AerisContextMenuModule],
  template: `
    <div>
      <div #commandTarget class="context-menu-target" tabindex="0">
        Right-click for command actions
      </div>
      <aeris-context-menu
        [target]="commandTarget"
        [model]="commandItems"
        ariaLabel="Editor actions"
      />
      <p class="context-menu-status" aria-live="polite">
        Last action: {{ selectedAction }}
      </p>
    </div>
  `,
  styles: `
    .context-menu-target {
      display: grid;
      gap: 0.75rem;
      place-items: center;
      min-height: 9rem;
      border: 1px dashed var(--aeris-border);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
      color: var(--aeris-text-2);
      font-weight: 700;
      text-align: center;
    }
    
    .context-menu-status {
      margin: 0.75rem 0 0;
      color: var(--aeris-text-2);
      font-size: 0.8125rem;
    }
    
    .context-menu-target {
      display: grid;
      gap: 0.75rem;
      place-items: center;
      min-height: 9rem;
      border: 1px dashed var(--border);
      border-radius: 1rem;
      background: color-mix(in srgb, var(--aeris-primary) 8%, transparent);
      color: var(--text-2);
      font-weight: 700;
      text-align: center;
    }
    
    .context-menu-status {
      margin: 0.75rem 0 0;
      color: var(--text-2);
      font-size: 0.8125rem;
    }
  `
})
export class ContextMenuCommandCommandDemo {
  protected selectedAction = 'None';

  protected readonly commandItems: readonly AerisContextMenuItem[] = [
    { label: 'Copy', shortcut: 'Ctrl C', command: (event) => this.recordAction(event) },
    { label: 'Paste', shortcut: 'Ctrl V', command: (event) => this.recordAction(event) },
    { separator: true },
    { label: 'Delete', shortcut: 'Del', command: (event) => this.recordAction(event) },
  ];

  protected recordAction(event: AerisContextMenuItemEvent): void {
    this.selectedAction = event.item.label ?? 'Unnamed action';
  }
}
```

### Programmatic

Open the menu from a button, pointer event, or custom trigger when right-click is not the only entry point.

#### TS

```ts
import { Component, viewChild } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisContextMenu, AerisContextMenuModule, type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

@Component({
  selector: 'app-context-menu-programmatic-demo',
  imports: [AerisButton, AerisContextMenuModule],
  template: `
    <div>
      <button aerisButton type="button" (click)="openManualMenu($event)">
        Open menu
      </button>
      <aeris-context-menu #manualMenu [model]="manualItems" ariaLabel="Manual actions" />
    </div>
  `
})
export class ContextMenuProgrammaticProgrammaticDemo {
  protected readonly manualMenu = viewChild<AerisContextMenu>('manualMenu');

  protected readonly manualItems: readonly AerisContextMenuItem[] = [
    { label: 'Preview' },
    { label: 'Share' },
    { label: 'Export' },
  ];

  protected openManualMenu(event: MouseEvent): void {
    this.manualMenu()?.show(event);
  }
}
```

## Accessibility

- The root list uses role="menu" by default with vertical orientation. useMenubarRole is available for applications that require a menubar root.
- Each actionable item uses role="menuitem". Separators use role="separator".
- Disabled items are removed from roving focus and expose disabled state through native disabled buttons or aria-disabled links.
- Submenu triggers expose aria-haspopup, aria-expanded, and aria-controls.
- Provide a specific ariaLabel or ariaLabelledBy when several context menus appear on the same page.

### Keyboard support

| Key | Function |
| --- | --- |
| `Context menu gesture` | Configured target or document |
| `Arrow Down` | Menu item |
| `Arrow Up` | Menu item |
| `Arrow Right` | Submenu trigger |
| `Arrow Left` | Submenu item |
| `Home` | Menu item |
| `End` | Menu item |
| `Enter` | Menu item |
| `Space` | Menu item |
| `Escape` | Open menu |
| `Tab` | Open menu |
