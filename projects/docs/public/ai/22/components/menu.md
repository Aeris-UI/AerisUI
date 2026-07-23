# Menu

> Vertical command and navigation menu with grouped items, popup mode, controlled expansion, templates, commands, and links.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/menu`
- Human-readable documentation: [https://aeris-ui.dev/components/menu](https://aeris-ui.dev/components/menu)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisMenuModule } from '@aeris-ui/core/menu';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated` | ID for the root panel. |
| `model` | `readonly AerisMenuItem&lt;T&gt;[]` | `[]` | Menu item model with groups, separators, commands, links, and nested items. |
| `expandedKeys` | `AerisMenuExpandedKeys (model)` | `{}` | Controlled expanded state keyed by item id or generated path. |
| `open` | `boolean (model)` | `false` | Controlled popup visibility. |
| `popup` | `boolean` | `false` | Renders the menu as a target-relative overlay opened with show or toggle. |
| `disabled` | `boolean` | `false` | Prevents popup opening. |
| `size` | `AerisMenuSize` | `'md'` | Controls item density and icon sizing. |
| `width` | `string` | `''` | Sets --aeris-menu-width on the panel. |
| `maxHeight` | `string` | `''` | Sets --aeris-menu-max-height on the panel. |
| `viewportMargin` | `number` | `8` | Minimum popup distance from viewport edges. |
| `hideOnOutsideClick` | `boolean` | `true` | Closes popup menus when pointer interaction starts outside the panel. |
| `closeOnEscape` | `boolean` | `true` | Closes popup menus when Escape is pressed. |
| `closeOnSelect` | `boolean` | `true` | Closes popup menus after an enabled leaf item is activated. |
| `autoFocus` | `boolean` | `true` | Moves focus to the first enabled item when a popup opens. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the popup trigger after close. |
| `ariaLabel` | `string` | `'Menu'` | Accessible name for the root menu. |
| `ariaLabelledBy` | `string` | `''` | Element IDs that label the root menu. |
| `panelStyleClass` | `string` | `''` | Additional class string applied to the panel. |
| `navigationHandler` | `AerisMenuNavigationHandler` | `undefined` | Handles routerLink items without coupling Aeris to Angular Router. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `expandedKeysChange` | `AerisMenuExpandedKeys` | `-` | Emitted automatically by the expandedKeys model. |
| `openChange` | `boolean` | `-` | Emitted automatically by the open model. |
| `shown` | `AerisMenuVisibilityEvent` | `-` | Emitted after popup opening is requested. |
| `hidden` | `AerisMenuVisibilityEvent` | `-` | Emitted after popup close. |
| `visibilityChanged` | `AerisMenuVisibilityEvent` | `-` | Emitted for both popup show and hide transitions. |
| `itemSelected` | `AerisMenuItemEvent&lt;T&gt;` | `-` | Emitted when an enabled leaf item is activated. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisMenuItem` | `AerisMenuItemTemplateContext&lt;T&gt;` | `default item row` | Customizes enabled, disabled, link, and toggleable item content. |
| `aerisMenuHeader` | `AerisMenuHeaderTemplateContext&lt;T&gt;` | `default group header` | Customizes non-toggleable group headers. |
| `aerisMenuStart` | `TemplateRef&lt;unknown&gt;` | `none` | Projects content before the menu list. |
| `aerisMenuEnd` | `TemplateRef&lt;unknown&gt;` | `none` | Projects content after the menu list. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(event)` | `MouseEvent &#124; PointerEvent =&gt; void` | `-` | Opens a popup menu below the event currentTarget. |
| `hide(event?, reason?, restoreFocus?)` | `Event &#124; null, AerisMenuCloseReason, boolean =&gt; void` | `-` | Closes a popup menu. |
| `toggle(event)` | `MouseEvent &#124; PointerEvent =&gt; void` | `-` | Toggles popup visibility from a trigger event. |
| `focus()` | `void` | `-` | Moves focus to the active or first enabled visible item. |
| `expandAll()` | `void` | `-` | Expands all toggleable groups. |
| `collapseAll()` | `void` | `-` | Collapses all toggleable groups. |
| `reposition()` | `void` | `-` | Recalculates popup coordinates inside the viewport. |

## Interfaces and types

### Interfaces

```ts
type AerisMenuSize = 'sm' | 'md' | 'lg';
type AerisMenuCloseReason = 'api' | 'escape' | 'outside' | 'select';
type AerisMenuExpandedKeys = Readonly<Record<string, boolean>>;

interface AerisMenuItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly description?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly badge?: string | number;
  readonly shortcut?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: string;
  readonly rel?: string;
  readonly toggleable?: boolean;
  readonly expanded?: boolean;
  readonly items?: readonly AerisMenuItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisMenuItemEvent<T>) => void;
}

interface AerisMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisMenuItem<T>;
  readonly path: readonly number[];
  readonly target: Element | null;
}

interface AerisMenuVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisMenuCloseReason;
  readonly target: Element | null;
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-menu-width` | `length` | `16rem` | Panel width. |
| `--aeris-menu-max-height` | `length` | `none / viewport in popup` | Maximum scrollable panel height. |
| `--aeris-menu-background` | `color` | `--aeris-surface` | Panel background. |
| `--aeris-menu-border` | `color` | `--aeris-border` | Panel border. |
| `--aeris-menu-radius` | `length` | `--aeris-radius-lg` | Panel corner radius. |
| `--aeris-menu-shadow` | `shadow` | `overlay shadow` | Panel elevation. |
| `--aeris-menu-item-min-height` | `length` | `--aeris-item-height` | Minimum item height. |
| `--aeris-menu-item-radius` | `length` | `--aeris-radius-sm` | Item corner radius. |
| `--aeris-menu-item-hover-background` | `color` | `primary mix` | Hover and active item background. |
| `--aeris-menu-icon-size` | `length` | `1.125rem` | Icon and chevron box size. |
| `--aeris-menu-badge-max-width` | `length` | `min(7rem, 36vw)` | Maximum badge width before ellipsis. |

## Examples

### Basic

Use groups, separators, badges, shortcuts, and nested toggleable sections in one static menu.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { LucideArchive, LucideBriefcaseBusiness, LucideChartColumn, LucideCopy, LucideCreditCard, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideLayoutDashboard, LucideLogOut, LucideMessageCircle, LucideRoute, LucideSearch, LucideSettings, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menu-basic-demo',
  imports: [AerisBadgeModule, AerisMenuModule, LucideDynamicIcon],
  templateUrl: './menu-basic.demo.html',
  styleUrl: './menu-basic.demo.scss'
})
export class MenuBasicBasicDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    BriefcaseBusiness: LucideBriefcaseBusiness,
    ChartColumn: LucideChartColumn,
    Copy: LucideCopy,
    CreditCard: LucideCreditCard,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    LayoutDashboard: LucideLayoutDashboard,
    LogOut: LucideLogOut,
    MessageCircle: LucideMessageCircle,
    Route: LucideRoute,
    Search: LucideSearch,
    Settings: LucideSettings,
    User: LucideUser,
  };

  protected readonly basicItems: readonly AerisMenuItem[] = [
    {
      id: 'account',
      label: 'Account',
      icon: 'User',
      toggleable: false,
      items: [
        { id: 'profile', label: 'Profile', icon: 'User', badge: 'New' },
        { id: 'billing', label: 'Billing', icon: 'CreditCard', shortcut: '⌘ + B' },
        { separator: true },
        { id: 'sign-out', label: 'Sign out', icon: 'LogOut' },
      ],
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: 'BriefcaseBusiness',
      expanded: true,
      items: [
        { id: 'projects', label: 'Projects', icon: 'Folder' },
        { id: 'reports', label: 'Reports', icon: 'ChartColumn' },
      ],
    },
  ];
}
```

#### HTML

```html
<div>
  <aeris-menu [model]="basicItems" ariaLabel="Account and workspace actions">
    <ng-template aerisMenuHeader let-item>
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menu-icon-item__label">{{ item.label }}</span>
      </span>
    </ng-template>
    <ng-template
      aerisMenuItem
      let-item
      let-expanded="expanded"
      let-hasChildren="hasChildren"
    >
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menu-icon-item__label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menu-icon-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasChildren) {
          <svg
            class="menu-icon-item__chevron"
            [attr.data-expanded]="expanded || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="m6 8 4 4 4-4" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menu>
</div>
```

#### CSS

```css
.menu-icon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menu-icon-item svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.menu-icon-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menu-icon-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 160ms ease;
}

.menu-icon-item__chevron[data-expanded='true'] {
  transform: rotate(180deg);
}
```

### Popup

Popup mode anchors the menu to the triggering element and restores focus when closed.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { LucideArchive, LucideBriefcaseBusiness, LucideChartColumn, LucideCopy, LucideCreditCard, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideLayoutDashboard, LucideLogOut, LucideMessageCircle, LucideRoute, LucideSearch, LucideSettings, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menu-popup-demo',
  imports: [AerisBadgeModule, AerisButton, AerisMenuModule, LucideDynamicIcon],
  templateUrl: './menu-popup.demo.html',
  styleUrl: './menu-popup.demo.scss'
})
export class MenuPopupPopupDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    BriefcaseBusiness: LucideBriefcaseBusiness,
    ChartColumn: LucideChartColumn,
    Copy: LucideCopy,
    CreditCard: LucideCreditCard,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    LayoutDashboard: LucideLayoutDashboard,
    LogOut: LucideLogOut,
    MessageCircle: LucideMessageCircle,
    Route: LucideRoute,
    Search: LucideSearch,
    Settings: LucideSettings,
    User: LucideUser,
  };

  protected readonly popupItems: readonly AerisMenuItem[] = [
    { id: 'new-file', label: 'New file', icon: 'FilePlus', shortcut: '⌘ + N' },
    { id: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { separator: true },
    { id: 'archive', label: 'Archive', icon: 'Archive' },
  ];
}
```

#### HTML

```html
<div class="menu-actions">
  <button aerisButton type="button" (click)="popupMenu.toggle($event)">
    Open menu
  </button>
  <aeris-menu #popupMenu popup [model]="popupItems" ariaLabel="Popup actions">
    <ng-template
      aerisMenuItem
      let-item
      let-expanded="expanded"
      let-hasChildren="hasChildren"
    >
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menu-icon-item__label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menu-icon-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasChildren) {
          <svg
            class="menu-icon-item__chevron"
            [attr.data-expanded]="expanded || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="m6 8 4 4 4-4" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menu>
</div>
```

#### CSS

```css
.menu-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.menu-icon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menu-icon-item svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.menu-icon-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menu-icon-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 160ms ease;
}

.menu-icon-item__chevron[data-expanded='true'] {
  transform: rotate(180deg);
}
```

### Controlled

Bind expandedKeys when application state owns which groups are open.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisMenuModule, type AerisMenuExpandedKeys, type AerisMenuItem } from '@aeris-ui/core/menu';
import { LucideArchive, LucideBriefcaseBusiness, LucideChartColumn, LucideCopy, LucideCreditCard, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideLayoutDashboard, LucideLogOut, LucideMessageCircle, LucideRoute, LucideSearch, LucideSettings, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menu-controlled-demo',
  imports: [AerisBadgeModule, AerisButton, AerisMenuModule, LucideDynamicIcon],
  templateUrl: './menu-controlled.demo.html',
  styleUrl: './menu-controlled.demo.scss'
})
export class MenuControlledControlledDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    BriefcaseBusiness: LucideBriefcaseBusiness,
    ChartColumn: LucideChartColumn,
    Copy: LucideCopy,
    CreditCard: LucideCreditCard,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    LayoutDashboard: LucideLayoutDashboard,
    LogOut: LucideLogOut,
    MessageCircle: LucideMessageCircle,
    Route: LucideRoute,
    Search: LucideSearch,
    Settings: LucideSettings,
    User: LucideUser,
  };

  protected readonly controlledKeys =
    signal<AerisMenuExpandedKeys>({
      workspace: true,
    });

  protected readonly controlledItems: readonly AerisMenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: 'BriefcaseBusiness',
      items: [
        { id: 'projects', label: 'Projects', icon: 'Folder' },
        {
          id: 'reports',
          label: 'Reports',
          icon: 'ChartColumn',
          items: [
            { id: 'monthly', label: 'Monthly', icon: 'ChartColumn' },
            { id: 'yearly', label: 'Yearly', icon: 'ChartColumn' },
          ],
        },
      ],
    },
  ];

  protected expandControlled(): void {
    this.controlledKeys.set({ workspace: true, reports: true });
  }

  protected collapseControlled(): void {
    this.controlledKeys.set({});
  }
}
```

#### HTML

```html
<div class="menu-controlled">
  <div class="menu-actions">
    <button
      aerisButton
      type="button"
      variant="secondary"
      (click)="expandControlled()"
    >
      Expand all
    </button>
    <button
      aerisButton
      type="button"
      variant="secondary"
      (click)="collapseControlled()"
    >
      Collapse all
    </button>
  </div>
  <aeris-menu
    [model]="controlledItems"
    [(expandedKeys)]="controlledKeys"
    ariaLabel="Controlled workspace menu"
  >
    <ng-template
      aerisMenuItem
      let-item
      let-expanded="expanded"
      let-hasChildren="hasChildren"
    >
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menu-icon-item__label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menu-icon-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasChildren) {
          <svg
            class="menu-icon-item__chevron"
            [attr.data-expanded]="expanded || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="m6 8 4 4 4-4" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menu>
</div>
```

#### CSS

```css
.menu-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.menu-controlled {
  display: grid;
  gap: 1rem;
}

.menu-icon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menu-icon-item svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.menu-icon-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menu-icon-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 160ms ease;
}

.menu-icon-item__chevron[data-expanded='true'] {
  transform: rotate(180deg);
}
```

### Template

Customize item rows, group headers, and content before or after the menu without changing menu semantics.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisMenuModule, type AerisMenuItem } from '@aeris-ui/core/menu';
import { LucideArchive, LucideBriefcaseBusiness, LucideChartColumn, LucideCopy, LucideCreditCard, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideLayoutDashboard, LucideLogOut, LucideMessageCircle, LucideRoute, LucideSearch, LucideSettings, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menu-template-demo',
  imports: [AerisBadgeModule, AerisMenuModule, LucideDynamicIcon],
  templateUrl: './menu-template.demo.html',
  styleUrl: './menu-template.demo.scss'
})
export class MenuTemplateTemplateDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    BriefcaseBusiness: LucideBriefcaseBusiness,
    ChartColumn: LucideChartColumn,
    Copy: LucideCopy,
    CreditCard: LucideCreditCard,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    LayoutDashboard: LucideLayoutDashboard,
    LogOut: LucideLogOut,
    MessageCircle: LucideMessageCircle,
    Route: LucideRoute,
    Search: LucideSearch,
    Settings: LucideSettings,
    User: LucideUser,
  };

  protected readonly templateItems: readonly AerisMenuItem[] = [
    {
      id: 'documents',
      label: 'Documents',
      icon: 'Folder',
      toggleable: false,
      items: [
        { id: 'new-doc', label: 'New document', icon: 'FilePlus', shortcut: '⌘ + N' },
        { id: 'search-docs', label: 'Search', icon: 'Search', shortcut: '⌘ + S' },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      icon: 'User',
      toggleable: false,
      items: [
        { id: 'settings', label: 'Settings', icon: 'Settings', shortcut: '⌘ + ,' },
        { id: 'messages', label: 'Messages', icon: 'MessageCircle', badge: 2 },
      ],
    },
  ];
}
```

#### HTML

```html
<div>
  <aeris-menu [model]="templateItems" ariaLabel="Template menu">
    <ng-template aerisMenuStart>
      <span class="menu-template-brand">
        <strong>Aeris Workspace</strong>
        <small>Signed in as Admin</small>
      </span>
    </ng-template>
    <ng-template aerisMenuHeader let-item>
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menu-icon-item__label">{{ item.label }}</span>
      </span>
    </ng-template>
    <ng-template aerisMenuItem let-item>
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <strong class="menu-icon-item__label">{{ item.label }}</strong>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menu-icon-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
      </span>
    </ng-template>
    <ng-template aerisMenuEnd>
      <span class="menu-template-user">Storage synced just now.</span>
    </ng-template>
  </aeris-menu>
</div>
```

#### CSS

```css
.menu-icon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menu-icon-item svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.menu-icon-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item kbd {
  color: var(--aeris-text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menu-template-brand {
  display: grid;
  gap: 0.125rem;
}

.menu-template-brand strong {
  font-weight: 850;
}

.menu-template-brand small,
.menu-template-user,
small[aria-live] {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

.menu-icon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menu-icon-item svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.menu-icon-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menu-icon-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 160ms ease;
}

.menu-icon-item__chevron[data-expanded='true'] {
  transform: rotate(180deg);
}

.menu-template-brand {
  display: grid;
  gap: 0.125rem;
}

.menu-template-brand strong {
  font-weight: 850;
}

.menu-template-brand small,
.menu-template-user {
  color: var(--text-2);
  font-size: 0.8125rem;
}
```

### Command and links

Items can run commands, use routerLink with an app-owned navigation handler, or use native external URLs.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisMenuModule, type AerisMenuItem, type AerisMenuItemEvent } from '@aeris-ui/core/menu';
import { LucideArchive, LucideBriefcaseBusiness, LucideChartColumn, LucideCopy, LucideCreditCard, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideLayoutDashboard, LucideLogOut, LucideMessageCircle, LucideRoute, LucideSearch, LucideSettings, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menu-command-demo',
  imports: [AerisBadgeModule, AerisMenuModule, LucideDynamicIcon],
  templateUrl: './menu-command.demo.html',
  styleUrl: './menu-command.demo.scss'
})
export class MenuCommandCommandAndLinksDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    BriefcaseBusiness: LucideBriefcaseBusiness,
    ChartColumn: LucideChartColumn,
    Copy: LucideCopy,
    CreditCard: LucideCreditCard,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    LayoutDashboard: LucideLayoutDashboard,
    LogOut: LucideLogOut,
    MessageCircle: LucideMessageCircle,
    Route: LucideRoute,
    Search: LucideSearch,
    Settings: LucideSettings,
    User: LucideUser,
  };

  protected readonly commandMessage =
    signal('No action selected yet.');

  protected readonly commandItems: readonly AerisMenuItem[] = [
    { id: 'new', label: 'New', icon: 'FilePlus', command: (event) => this.recordAction(event) },
    { id: 'search', label: 'Search', icon: 'Search', command: (event) => this.recordAction(event) },
    { id: 'router', label: 'Router link', icon: 'Route', routerLink: ['/components', 'menu'] },
    { id: 'external', label: 'External URL', icon: 'ExternalLink', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
  ];

  protected recordAction(event: AerisMenuItemEvent): void {
    this.commandMessage.set(`Selected ${event.item.label}`);
  }
}
```

#### HTML

```html
<div>
  <aeris-menu
    [model]="commandItems"
    ariaLabel="Command menu"
    (itemSelected)="recordAction($event)"
  >
    <ng-template
      aerisMenuItem
      let-item
      let-expanded="expanded"
      let-hasChildren="hasChildren"
    >
      <span class="menu-icon-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menu-icon-item__label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menu-icon-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasChildren) {
          <svg
            class="menu-icon-item__chevron"
            [attr.data-expanded]="expanded || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="m6 8 4 4 4-4" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menu>
  <small aria-live="polite">{{ commandMessage() }}</small>
</div>
```

#### CSS

```css
.menu-icon-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menu-icon-item svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
}

.menu-icon-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-icon-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menu-icon-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  transition: transform 160ms ease;
}

.menu-icon-item__chevron[data-expanded='true'] {
  transform: rotate(180deg);
}
```

## Accessibility

- The root list uses role="menu". Enabled rows use role="menuitem".
- Separators use role="separator". Non-toggleable group labels are plain headers before grouped menuitems.
- Toggleable items expose aria-haspopup, aria-expanded, and aria-controls.
- Disabled buttons use native disabled behavior. Disabled links use aria-disabled and remove href.
- Use ariaLabel or ariaLabelledBy to provide a clear menu name.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus into or out of the menu using native page tab order. |
| `Arrow Down` | Moves focus to the next visible enabled menuitem. |
| `Arrow Up` | Moves focus to the previous visible enabled menuitem. |
| `Home` | Moves focus to the first visible enabled menuitem. |
| `End` | Moves focus to the last visible enabled menuitem. |
| `Arrow Right` | Expands a focused collapsed toggleable group. |
| `Arrow Left` | Collapses a focused expanded toggleable group or moves focus to its parent. |
| `Enter` | Activates the focused item or toggles a focused group. |
| `Space` | Activates the focused item or toggles a focused group. |
| `Escape` | Closes a popup menu and restores trigger focus when enabled. |
