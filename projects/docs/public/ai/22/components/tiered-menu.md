# TieredMenu

> Vertical command menu with cascading submenu overlays, popup mode, templates, commands, links, and keyboard support.

Aeris 22.0.0-alpha.0 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/tiered-menu`
- Human-readable documentation: [https://aeris-ui.dev/components/tiered-menu](https://aeris-ui.dev/components/tiered-menu)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisTieredMenuModule } from '@aeris-ui/core/tiered-menu';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated id` | Panel ID used for menu and submenu relationships. |
| `model` | `readonly AerisTieredMenuItem&lt;T&gt;[]` | `[]` | Menu item model including separators, disabled state, commands, links, and nested children. |
| `open` | `boolean (model)` | `false` | Controlled popup visibility. |
| `popup` | `boolean` | `false` | Renders the menu as a target-relative overlay opened with show or toggle. |
| `disabled` | `boolean` | `false` | Prevents activation and popup opening. |
| `size` | `AerisTieredMenuSize` | `'md'` | Controls item density and icon sizing. |
| `width` | `string` | `''` | Sets --aeris-tiered-menu-width on the panel. |
| `maxWidth` | `string` | `''` | Sets --aeris-tiered-menu-max-width on the panel. |
| `viewportMargin` | `number` | `8` | Minimum popup distance from viewport edges. |
| `hideOnOutsideClick` | `boolean` | `true` | Closes open popup menus or visible submenus on outside pointer interaction. |
| `closeOnEscape` | `boolean` | `true` | Closes open popup menus or visible submenus when Escape is pressed. |
| `closeOnSelect` | `boolean` | `true` | Closes open overlays after an enabled leaf item is activated. |
| `autoFocus` | `boolean` | `true` | Moves focus to the first enabled item when a popup opens. |
| `restoreFocus` | `boolean` | `true` | Returns focus to the popup trigger after close. |
| `ariaLabel` | `string` | `'Tiered menu'` | Accessible name for the root menu. |
| `ariaLabelledBy` | `string` | `''` | Element IDs that label the root menu. |
| `panelStyleClass` | `string` | `''` | Additional class string applied to the panel. |
| `navigationHandler` | `AerisTieredMenuNavigationHandler` | `undefined` | Handles routerLink items without coupling Aeris to Angular Router. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `openChange` | `boolean` | `-` | Emitted automatically by the open model. |
| `shown` | `AerisTieredMenuVisibilityEvent` | `-` | Emitted after popup opening is requested. |
| `hidden` | `AerisTieredMenuVisibilityEvent` | `-` | Emitted after popup close. |
| `visibilityChanged` | `AerisTieredMenuVisibilityEvent` | `-` | Emitted for both popup show and hide transitions. |
| `itemSelected` | `AerisTieredMenuItemEvent&lt;T&gt;` | `-` | Emitted when an enabled leaf item is activated. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisTieredMenuItem` | `AerisTieredMenuItemTemplateContext&lt;T&gt;` | `default item row` | Customizes item content for every non-separator row. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `show(event)` | `MouseEvent &#124; PointerEvent =&gt; void` | `-` | Opens a popup menu below the event currentTarget. |
| `hide(event?, reason?, restoreFocus?)` | `Event &#124; null, AerisTieredMenuCloseReason, boolean =&gt; void` | `-` | Closes a popup menu and clears open submenus. |
| `toggle(event)` | `MouseEvent &#124; PointerEvent =&gt; void` | `-` | Toggles popup visibility from a trigger event. |
| `focus()` | `void` | `-` | Moves focus to the active or first enabled item. |
| `reposition()` | `void` | `-` | Recalculates popup coordinates inside the viewport. |

## Interfaces and types

### Interfaces

```ts
type AerisTieredMenuSize = 'sm' | 'md' | 'lg';
type AerisTieredMenuCloseReason = 'api' | 'escape' | 'outside' | 'select';

interface AerisTieredMenuItem<T = unknown> {
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
  readonly items?: readonly AerisTieredMenuItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisTieredMenuItemEvent<T>) => void;
}

interface AerisTieredMenuItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisTieredMenuItem<T>;
  readonly path: readonly number[];
  readonly target: Element | null;
}

interface AerisTieredMenuVisibilityEvent {
  readonly originalEvent: Event | null;
  readonly visible: boolean;
  readonly reason: AerisTieredMenuCloseReason;
  readonly target: Element | null;
}

interface AerisTieredMenuItemTemplateContext<T = unknown> {
  readonly $implicit: AerisTieredMenuItem<T>;
  readonly item: AerisTieredMenuItem<T>;
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
| `--aeris-tiered-menu-z-index` | `number` | `1060` | Floating popup z-index. |
| `--aeris-tiered-menu-width` | `length` | `14rem` | Root panel width. |
| `--aeris-tiered-menu-max-width` | `length` | `min(22rem, 100%)` | Root panel maximum width. |
| `--aeris-tiered-menu-max-height` | `length` | `min(26rem, calc(100vh - 1rem))` | Root list maximum height. |
| `--aeris-tiered-menu-padding` | `length` | `0.375rem` | Panel and submenu padding. |
| `--aeris-tiered-menu-border` | `color` | `--aeris-border` | Panel border color. |
| `--aeris-tiered-menu-radius` | `length` | `--aeris-radius-lg` | Panel and submenu radius. |
| `--aeris-tiered-menu-background` | `color` | `--aeris-surface` | Panel background. |
| `--aeris-tiered-menu-shadow` | `shadow` | `overlay shadow` | Panel and submenu elevation. |
| `--aeris-tiered-menu-item-gap` | `length` | `--aeris-density-gap` | Gap inside item rows. |
| `--aeris-tiered-menu-item-min-height` | `length` | `--aeris-item-height` | Default item height. |
| `--aeris-tiered-menu-item-radius` | `length` | `--aeris-radius-control` | Item hover and focus radius. |
| `--aeris-tiered-menu-item-hover-background` | `color` | `primary mix` | Hover, active, and open item background. |
| `--aeris-tiered-menu-icon-size` | `length` | `1.125rem` | Default icon box size. |
| `--aeris-tiered-menu-submenu-width` | `length` | `14rem` | Submenu panel width. |
| `--aeris-tiered-menu-submenu-offset` | `length` | `0.375rem` | Distance between parent and submenu panel. |

## Examples

### Basic

Use nested item models to show cascading submenu panels from a static menu.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisTieredMenuModule, type AerisTieredMenuItem } from '@aeris-ui/core/tiered-menu';
import { LucideArchive, LucideCopy, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideFolderOpen, LucideGlobe, LucideRefreshCw, LucideRoute, LucideSearch, LucideSend, LucideSettings, LucideShare2, LucideTrash2, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-tiered-menu-basic-demo',
  imports: [AerisBadgeModule, AerisTieredMenuModule, LucideDynamicIcon],
  templateUrl: './tiered-menu-basic.demo.html',
  styleUrl: './tiered-menu-basic.demo.scss'
})
export class TieredMenuBasicBasicDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    Copy: LucideCopy,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    FolderOpen: LucideFolderOpen,
    Globe: LucideGlobe,
    RefreshCw: LucideRefreshCw,
    Route: LucideRoute,
    Search: LucideSearch,
    Send: LucideSend,
    Settings: LucideSettings,
    Share2: LucideShare2,
    Trash2: LucideTrash2,
    User: LucideUser,
  };

  protected readonly basicItems: readonly AerisTieredMenuItem[] = [
    {
      label: 'File',
      icon: 'Folder',
      items: [
        { label: 'New file', icon: 'FilePlus', shortcut: '⌘ + N' },
        { label: 'Open recent', icon: 'FolderOpen', badge: 4 },
      ],
    },
    {
      label: 'Edit',
      icon: 'Settings',
      items: [
        { label: 'Copy', icon: 'Copy', shortcut: '⌘ + C' },
        { label: 'Archive', icon: 'Archive' },
        { label: 'Delete', icon: 'Trash2', disabled: true },
      ],
    },
    { separator: true },
    { label: 'Search', icon: 'Search', shortcut: '⌘ + S' },
  ];
}
```

#### HTML

```html
<div class="tiered-menu-basic-preview">
  <aeris-tiered-menu [model]="basicItems" ariaLabel="Workspace actions">
    <ng-template aerisTieredMenuItem let-item let-hasSubmenu="hasSubmenu">
      <span class="tiered-menu-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="tiered-menu-item__label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="tiered-menu-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasSubmenu) {
          <svg class="tiered-menu-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4.5 5 5.5-5 5.5" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-tiered-menu>
</div>
```

#### CSS

```css
.tiered-menu-template-preview,
.tiered-menu-basic-preview {
  min-block-size: 10rem;
  display: flex;
  align-items: flex-start;
}

.tiered-menu-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.tiered-menu-item svg {
  width: 1rem;
  height: 1rem;
}

.tiered-menu-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item kbd,
.tiered-menu-status {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.tiered-menu-chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Popup

Popup mode anchors the root tier to a trigger and restores focus when the popup closes.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTieredMenuModule, type AerisTieredMenuItem } from '@aeris-ui/core/tiered-menu';
import { LucideArchive, LucideCopy, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideFolderOpen, LucideGlobe, LucideRefreshCw, LucideRoute, LucideSearch, LucideSend, LucideSettings, LucideShare2, LucideTrash2, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-tiered-menu-popup-demo',
  imports: [AerisButton, AerisTieredMenuModule, LucideDynamicIcon],
  templateUrl: './tiered-menu-popup.demo.html',
  styleUrl: './tiered-menu-popup.demo.scss'
})
export class TieredMenuPopupPopupDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    Copy: LucideCopy,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    FolderOpen: LucideFolderOpen,
    Globe: LucideGlobe,
    RefreshCw: LucideRefreshCw,
    Route: LucideRoute,
    Search: LucideSearch,
    Send: LucideSend,
    Settings: LucideSettings,
    Share2: LucideShare2,
    Trash2: LucideTrash2,
    User: LucideUser,
  };

  protected readonly popupItems: readonly AerisTieredMenuItem[] = [
    {
      label: 'Share',
      icon: 'Share2',
      items: [
        { label: 'Send invite', icon: 'Send' },
        { label: 'Copy link', icon: 'Copy' },
      ],
    },
    { label: 'Refresh', icon: 'RefreshCw' },
    { separator: true },
    { label: 'Archive', icon: 'Archive' },
  ];
}
```

#### HTML

```html
<div class="tiered-menu-actions">
  <button aerisButton type="button" (click)="popupMenu.toggle($event)">
    Open actions
  </button>
  <aeris-tiered-menu #popupMenu popup [model]="popupItems" ariaLabel="Popup actions">
    <ng-template aerisTieredMenuItem let-item let-hasSubmenu="hasSubmenu">
      <span class="tiered-menu-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="tiered-menu-item__label">{{ item.label }}</span>
        @if (hasSubmenu) {
          <svg class="tiered-menu-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4.5 5 5.5-5 5.5" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-tiered-menu>
</div>
```

#### CSS

```css
.tiered-menu-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.tiered-menu-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.tiered-menu-item svg {
  width: 1rem;
  height: 1rem;
}

.tiered-menu-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item kbd,
.tiered-menu-status {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.tiered-menu-chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Template

Customize row content while TieredMenu keeps the menuitem semantics and submenu state.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { AerisTieredMenuModule, type AerisTieredMenuItem } from '@aeris-ui/core/tiered-menu';
import { LucideArchive, LucideCopy, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideFolderOpen, LucideGlobe, LucideRefreshCw, LucideRoute, LucideSearch, LucideSend, LucideSettings, LucideShare2, LucideTrash2, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-tiered-menu-template-demo',
  imports: [AerisBadgeModule, AerisTieredMenuModule, LucideDynamicIcon],
  templateUrl: './tiered-menu-template.demo.html',
  styleUrl: './tiered-menu-template.demo.scss'
})
export class TieredMenuTemplateTemplateDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    Copy: LucideCopy,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    FolderOpen: LucideFolderOpen,
    Globe: LucideGlobe,
    RefreshCw: LucideRefreshCw,
    Route: LucideRoute,
    Search: LucideSearch,
    Send: LucideSend,
    Settings: LucideSettings,
    Share2: LucideShare2,
    Trash2: LucideTrash2,
    User: LucideUser,
  };

  protected readonly templateItems: readonly AerisTieredMenuItem[] = [
    {
      label: 'Workspace',
      icon: 'Folder',
      badge: 'Team',
      items: [
        { label: 'Profile settings', icon: 'User' },
        { label: 'Public site', icon: 'Globe', badge: 'Live' },
      ],
    },
    {
      label: 'Automation',
      icon: 'RefreshCw',
      items: [
        { label: 'Sync now', icon: 'RefreshCw' },
        { label: 'Share report', icon: 'Share2' },
      ],
    },
  ];
}
```

#### HTML

```html
<div class="tiered-menu-template-preview">
  <aeris-tiered-menu [model]="templateItems" ariaLabel="Template tiered menu">
    <ng-template
      aerisTieredMenuItem
      let-item
      let-hasSubmenu="hasSubmenu"
      let-open="open"
    >
      <span class="tiered-menu-item" [attr.data-open]="open || null">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <strong class="tiered-menu-item__label">{{ item.label }}</strong>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="tiered-menu-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (hasSubmenu) {
          <svg class="tiered-menu-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4.5 5 5.5-5 5.5" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-tiered-menu>
</div>
```

#### CSS

```css
.tiered-menu-template-preview,
.tiered-menu-basic-preview {
  min-block-size: 10rem;
  display: flex;
  align-items: flex-start;
}

.tiered-menu-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.tiered-menu-item svg {
  width: 1rem;
  height: 1rem;
}

.tiered-menu-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item kbd,
.tiered-menu-status {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.tiered-menu-chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Command

Leaf items can run commands and emit itemSelected with the item and path.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTieredMenuModule, type AerisTieredMenuItem, type AerisTieredMenuItemEvent } from '@aeris-ui/core/tiered-menu';
import { LucideArchive, LucideCopy, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideFolderOpen, LucideGlobe, LucideRefreshCw, LucideRoute, LucideSearch, LucideSend, LucideSettings, LucideShare2, LucideTrash2, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-tiered-menu-command-demo',
  imports: [AerisTieredMenuModule, LucideDynamicIcon],
  templateUrl: './tiered-menu-command.demo.html',
  styleUrl: './tiered-menu-command.demo.scss'
})
export class TieredMenuCommandCommandDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    Copy: LucideCopy,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    FolderOpen: LucideFolderOpen,
    Globe: LucideGlobe,
    RefreshCw: LucideRefreshCw,
    Route: LucideRoute,
    Search: LucideSearch,
    Send: LucideSend,
    Settings: LucideSettings,
    Share2: LucideShare2,
    Trash2: LucideTrash2,
    User: LucideUser,
  };

  protected readonly commandMessage =
    signal('No action selected yet.');

  protected readonly commandItems: readonly AerisTieredMenuItem[] = [
    {
      label: 'Create',
      icon: 'FilePlus',
      items: [
        { label: 'New project', icon: 'Folder', command: (event) => this.recordAction(event) },
        { label: 'New report', icon: 'FilePlus', command: (event) => this.recordAction(event) },
      ],
    },
    { label: 'Search', icon: 'Search', command: (event) => this.recordAction(event) },
  ];

  protected recordAction(event: AerisTieredMenuItemEvent): void {
    this.commandMessage.set(`Selected ${event.item.label}`);
  }
}
```

#### HTML

```html
<div>
  <aeris-tiered-menu
    [model]="commandItems"
    ariaLabel="Command tiered menu"
    (itemSelected)="recordAction($event)"
  >
    <ng-template aerisTieredMenuItem let-item let-hasSubmenu="hasSubmenu">
      <span class="tiered-menu-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="tiered-menu-item__label">{{ item.label }}</span>
        @if (hasSubmenu) {
          <svg class="tiered-menu-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4.5 5 5.5-5 5.5" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-tiered-menu>
  <small class="tiered-menu-status" aria-live="polite">{{ commandMessage() }}</small>
</div>
```

#### CSS

```css
.tiered-menu-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.tiered-menu-item svg {
  width: 1rem;
  height: 1rem;
}

.tiered-menu-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item kbd,
.tiered-menu-status {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.tiered-menu-chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Router and URL

Use routerLink with an application-owned navigation handler, or native external URLs.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisTieredMenuModule, type AerisTieredMenuItem } from '@aeris-ui/core/tiered-menu';
import { LucideArchive, LucideCopy, LucideDynamicIcon, LucideExternalLink, LucideFilePlus, LucideFolder, LucideFolderOpen, LucideGlobe, LucideRefreshCw, LucideRoute, LucideSearch, LucideSend, LucideSettings, LucideShare2, LucideTrash2, LucideUser, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-tiered-menu-router-demo',
  imports: [AerisTieredMenuModule, LucideDynamicIcon],
  templateUrl: './tiered-menu-router.demo.html',
  styleUrl: './tiered-menu-router.demo.scss'
})
export class TieredMenuRouterRouterAndURLDemo {
  protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
    Archive: LucideArchive,
    Copy: LucideCopy,
    ExternalLink: LucideExternalLink,
    FilePlus: LucideFilePlus,
    Folder: LucideFolder,
    FolderOpen: LucideFolderOpen,
    Globe: LucideGlobe,
    RefreshCw: LucideRefreshCw,
    Route: LucideRoute,
    Search: LucideSearch,
    Send: LucideSend,
    Settings: LucideSettings,
    Share2: LucideShare2,
    Trash2: LucideTrash2,
    User: LucideUser,
  };

  protected readonly navigationMessage =
    signal('No navigation selected yet.');

  protected readonly routerItems: readonly AerisTieredMenuItem[] = [
    {
      label: 'Documentation',
      icon: 'Route',
      items: [
        { label: 'Menu overview', icon: 'Route', routerLink: ['/components', 'menu'] },
        { label: 'Angular site', icon: 'ExternalLink', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
      ],
    },
  ];

  protected navigate(link: string | readonly (string | number)[]): void {
    this.navigationMessage.set(
      typeof link === 'string' ? link : link.join('/')
    );
  }
}
```

#### HTML

```html
<div>
  <aeris-tiered-menu
    [model]="routerItems"
    [navigationHandler]="navigate"
    ariaLabel="Navigation tiered menu"
  >
    <ng-template aerisTieredMenuItem let-item let-hasSubmenu="hasSubmenu">
      <span class="tiered-menu-item">
        @if (item.icon) {
          <svg [lucideIcon]="menuIcons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="tiered-menu-item__label">{{ item.label }}</span>
        @if (hasSubmenu) {
          <svg class="tiered-menu-chevron" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m7.5 4.5 5 5.5-5 5.5" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-tiered-menu>
  <small class="tiered-menu-status" aria-live="polite">{{
    navigationMessage()
  }}</small>
</div>
```

#### CSS

```css
.tiered-menu-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.tiered-menu-item svg {
  width: 1rem;
  height: 1rem;
}

.tiered-menu-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tiered-menu-item kbd,
.tiered-menu-status {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.tiered-menu-chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

## Accessibility

- The root list uses role="menubar" with vertical orientation. Submenu lists use role="menu".
- Enabled rows use role="menuitem". Separators use role="separator".
- Items with children expose aria-haspopup, aria-expanded, and aria-controls.
- Disabled buttons use native disabled behavior. Disabled links use aria-disabled and remove href.
- Use ariaLabel or ariaLabelledBy to provide a clear menu name.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus into or out of the menu using native page tab order. |
| `Arrow Down` | Moves focus to the next enabled item in the current tier. |
| `Arrow Up` | Moves focus to the previous enabled item in the current tier. |
| `Home` | Moves focus to the first enabled item in the current tier. |
| `End` | Moves focus to the last enabled item in the current tier. |
| `Arrow Right` | In LTR, opens a submenu and moves focus to its first item. In RTL, closes the current submenu. |
| `Arrow Left` | In LTR, closes the current submenu. In RTL, opens a submenu and moves focus to its first item. |
| `Enter` | Activates the focused item or opens its submenu. |
| `Space` | Activates the focused item or opens its submenu. |
| `Escape` | Closes the current submenu, or closes the popup menu when focus is on the root tier. |
