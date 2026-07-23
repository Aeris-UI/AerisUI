# Menubar

> Horizontal application menu with cascading submenus, templates, commands, links, and responsive collapse.

Aeris 22.0.0-alpha.1 is alpha software for Angular >=22.0.6 <23.0.0. It is not production ready.

- Package entry point: `@aeris-ui/core/menubar`
- Human-readable documentation: [https://aeris-ui.dev/components/menubar](https://aeris-ui.dev/components/menubar)
- Icons: Aeris accepts consumer-provided icons from any icon library; documentation examples use Lucide.

## Global styles

Load these styles once in the application global stylesheet:

```css
@import '@aeris-ui/core/styles/aeris.css';
@import '@aeris-ui/core/styles/controls.css';
```

## Import

```ts
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
```

## API

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `generated` | ID prefix for the menubar and generated submenu relationships. |
| `model` | `readonly AerisMenubarItem&lt;T&gt;[]` | `[]` | Nested item model for root items and cascading submenu items. |
| `openPath` | `string (model)` | `''` | Controlled path key for the open submenu branch. |
| `mobileOpen` | `boolean (model)` | `false` | Controlled responsive menu visibility. |
| `size` | `AerisMenubarSize` | `'md'` | Adjusts item height, text, and icon sizing. |
| `disabled` | `boolean` | `false` | Prevents activation and submenu opening. |
| `openOnHover` | `boolean` | `true` | Opens submenu branches when pointer users hover items. |
| `closeOnSelect` | `boolean` | `true` | Closes open menus after a leaf item is activated. |
| `hideOnOutsideClick` | `boolean` | `true` | Closes menus when pointer interaction starts outside the component. |
| `closeOnEscape` | `boolean` | `true` | Closes open menus when Escape is pressed. |
| `collapsible` | `boolean` | `true` | Shows a responsive disclosure button at narrow widths. |
| `ariaLabel` | `string` | `'Menubar'` | Accessible name for the menubar list. |
| `ariaLabelledBy` | `string` | `''` | Element IDs that label the menubar list. |
| `navAriaLabel` | `string` | `''` | Optional accessible name for the wrapping navigation landmark. |
| `navAriaLabelledBy` | `string` | `''` | Element IDs that label the wrapping navigation landmark. |
| `toggleAriaLabel` | `string` | `'Toggle navigation menu'` | Accessible label for the responsive toggle button. |
| `navigationHandler` | `AerisMenubarNavigationHandler` | `undefined` | Handles routerLink items without coupling Aeris to Angular Router. |

### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `openPathChange` | `string` | `-` | Emitted automatically by the openPath model. |
| `mobileOpenChange` | `boolean` | `-` | Emitted automatically by the mobileOpen model. |
| `opened` | `AerisMenubarVisibilityEvent&lt;T&gt;` | `-` | Emitted when a submenu branch opens through API or interaction. |
| `closed` | `AerisMenubarVisibilityEvent&lt;T&gt;` | `-` | Emitted when open menus close. |
| `itemSelected` | `AerisMenubarItemEvent&lt;T&gt;` | `-` | Emitted when an enabled leaf item is activated. |

### Templates

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `aerisMenubarItem` | `AerisMenubarItemTemplateContext&lt;T&gt;` | `default item row` | Customizes root and submenu item content. |
| `aerisMenubarStart` | `TemplateRef&lt;unknown&gt;` | `none` | Projects content before the menubar items. |
| `aerisMenubarEnd` | `TemplateRef&lt;unknown&gt;` | `none` | Projects content after the menubar items. |

### Methods

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `open(path, event?)` | `string &#124; readonly number[], Event &#124; null =&gt; void` | `-` | Opens a submenu branch by path key or path array. |
| `close(event?, reason?)` | `Event &#124; null, AerisMenubarCloseReason =&gt; void` | `-` | Closes open submenus. |
| `focus()` | `void` | `-` | Moves focus to the active or first enabled root item. |

## Interfaces and types

### Interfaces

```ts
type AerisMenubarSize = 'sm' | 'md' | 'lg';
type AerisMenubarCloseReason = 'api' | 'escape' | 'outside' | 'select';

interface AerisMenubarItem<T = unknown> {
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
  readonly items?: readonly AerisMenubarItem<T>[];
  readonly data?: T;
  readonly command?: (event: AerisMenubarItemEvent<T>) => void;
}

interface AerisMenubarItemEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisMenubarItem<T>;
  readonly path: readonly number[];
}
```

## Design tokens

| Token | Type | Default | Description |
| --- | --- | --- | --- |
| `--aeris-menubar-background` | `color` | `--aeris-surface` | Root surface background. |
| `--aeris-menubar-border` | `color` | `--aeris-border` | Root and separator border color. |
| `--aeris-menubar-radius` | `length` | `--aeris-radius-lg` | Root surface corner radius. |
| `--aeris-menubar-item-radius` | `length` | `--aeris-radius-control` | Hover and focus item corner radius. |
| `--aeris-menubar-item-height` | `length` | `--aeris-item-height` | Minimum item height. |
| `--aeris-menubar-submenu-width` | `length` | `15rem` | Minimum submenu panel width. |
| `--aeris-menubar-submenu-radius` | `length` | `--aeris-radius-lg` | Submenu panel corner radius. |
| `--aeris-menubar-icon-size` | `length` | `1.125rem` | Default icon and chevron size. |

## Examples

### Basic

Use nested items, separators, disabled entries, badges, and shortcuts in a horizontal menu.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { type AerisMenubarItem } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { LucideClipboard, LucideCopy, LucideDownload, LucideDynamicIcon, LucideExternalLink, LucideFileText, LucideFolderOpen, LucideHelpCircle, LucideHome, LucidePackage, LucideRefreshCw, LucideSave, LucideScissors, LucideSearch, LucideSettings, LucideUndo2, LucideUpload, LucideZoomIn, LucideZoomOut, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menubar-basic-demo',
  imports: [AerisBadgeModule, AerisMenubarModule, LucideDynamicIcon],
  templateUrl: './menubar-basic.demo.html',
  styleUrl: './menubar-basic.demo.scss'
})
export class MenubarBasicBasicDemo {
  protected readonly icons: Readonly<Record<string, LucideIconInput>> = {
    Clipboard: LucideClipboard,
    Copy: LucideCopy,
    Download: LucideDownload,
    ExternalLink: LucideExternalLink,
    FileText: LucideFileText,
    FolderOpen: LucideFolderOpen,
    HelpCircle: LucideHelpCircle,
    Home: LucideHome,
    Package: LucidePackage,
    RefreshCw: LucideRefreshCw,
    Save: LucideSave,
    Scissors: LucideScissors,
    Search: LucideSearch,
    Settings: LucideSettings,
    Undo2: LucideUndo2,
    Upload: LucideUpload,
    ZoomIn: LucideZoomIn,
    ZoomOut: LucideZoomOut,
  };

  protected readonly basicItems: readonly AerisMenubarItem[] = [
    {
      id: 'file',
      label: 'File',
      icon: 'FileText',
      items: [
        { id: 'new-document', label: 'New document', icon: 'FileText', shortcut: '⌘ + N' },
        { id: 'open', label: 'Open', icon: 'FolderOpen', shortcut: '⌘ + O' },
        { separator: true },
        { id: 'save', label: 'Save', icon: 'Save', shortcut: '⌘ + S' },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: 'Scissors',
      items: [
        { id: 'undo', label: 'Undo', icon: 'Undo2', shortcut: '⌘ + Z' },
        { id: 'copy', label: 'Copy', icon: 'Copy', shortcut: '⌘ + C' },
        { id: 'paste', label: 'Paste', icon: 'Clipboard', disabled: true },
      ],
    },
    { id: 'help', label: 'Help', icon: 'HelpCircle' },
  ];
}
```

#### HTML

```html
<div>
  <aeris-menubar
    [model]="basicItems"
    ariaLabel="Application actions"
    navAriaLabel="Application"
  >
    <ng-template
      aerisMenubarItem
      let-item
      let-root="root"
      let-open="open"
      let-hasSubmenu="hasSubmenu"
    >
      <span class="menubar-doc-item">
        @if (item.icon) {
          <svg [lucideIcon]="icons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menubar-doc-item__label">{{ item.label }}</span>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menubar-doc-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasSubmenu) {
          <svg
            class="menubar-doc-item__chevron"
            [attr.data-root]="root || null"
            [attr.data-open]="open || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path [attr.d]="root ? 'm6 8 4 4 4-4' : 'm7.5 4.5 5 5.5-5 5.5'" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menubar>
</div>
```

#### CSS

```css
.menubar-doc-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menubar-doc-item svg {
  width: 1rem;
  height: 1rem;
}

.menubar-doc-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menubar-doc-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Submenus

Nested item arrays create cascading submenu branches for deeper navigation.

#### TS

```ts
import { Component } from '@angular/core';
import { type AerisMenubarItem } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { LucideClipboard, LucideCopy, LucideDownload, LucideDynamicIcon, LucideExternalLink, LucideFileText, LucideFolderOpen, LucideHelpCircle, LucideHome, LucidePackage, LucideRefreshCw, LucideSave, LucideScissors, LucideSearch, LucideSettings, LucideUndo2, LucideUpload, LucideZoomIn, LucideZoomOut, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menubar-submenus-demo',
  imports: [AerisMenubarModule, LucideDynamicIcon],
  templateUrl: './menubar-submenus.demo.html',
  styleUrl: './menubar-submenus.demo.scss'
})
export class MenubarSubmenusSubmenusDemo {
  protected readonly icons: Readonly<Record<string, LucideIconInput>> = {
    Clipboard: LucideClipboard,
    Copy: LucideCopy,
    Download: LucideDownload,
    ExternalLink: LucideExternalLink,
    FileText: LucideFileText,
    FolderOpen: LucideFolderOpen,
    HelpCircle: LucideHelpCircle,
    Home: LucideHome,
    Package: LucidePackage,
    RefreshCw: LucideRefreshCw,
    Save: LucideSave,
    Scissors: LucideScissors,
    Search: LucideSearch,
    Settings: LucideSettings,
    Undo2: LucideUndo2,
    Upload: LucideUpload,
    ZoomIn: LucideZoomIn,
    ZoomOut: LucideZoomOut,
  };

  protected readonly nestedItems: readonly AerisMenubarItem[] = [
    {
      id: 'workspace',
      label: 'Workspace',
      icon: 'Package',
      items: [
        { id: 'home', label: 'Home', icon: 'Home' },
        {
          id: 'recent',
          label: 'Open recent',
          icon: 'FolderOpen',
          items: [
            { id: 'release-notes', label: 'release-notes.md', icon: 'FileText' },
            { id: 'roadmap', label: 'roadmap.md', icon: 'FileText' },
          ],
        },
        { id: 'settings', label: 'Settings', icon: 'Settings' },
      ],
    },
  ];
}
```

#### HTML

```html
<div>
  <aeris-menubar [model]="nestedItems" ariaLabel="Workspace navigation">
    <ng-template
      aerisMenubarItem
      let-item
      let-root="root"
      let-open="open"
      let-hasSubmenu="hasSubmenu"
    >
      <span class="menubar-doc-item">
        @if (item.icon) {
          <svg [lucideIcon]="icons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menubar-doc-item__label">{{ item.label }}</span>
        @if (hasSubmenu) {
          <svg
            class="menubar-doc-item__chevron"
            [attr.data-root]="root || null"
            [attr.data-open]="open || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path [attr.d]="root ? 'm6 8 4 4 4-4' : 'm7.5 4.5 5 5.5-5 5.5'" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menubar>
</div>
```

#### CSS

```css
.menubar-doc-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menubar-doc-item svg {
  width: 1rem;
  height: 1rem;
}

.menubar-doc-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menubar-doc-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Controlled and responsive

Bind openPath and mobileOpen when application state owns submenu and responsive menu visibility.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { type AerisMenubarItem } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { LucideClipboard, LucideCopy, LucideDownload, LucideDynamicIcon, LucideExternalLink, LucideFileText, LucideFolderOpen, LucideHelpCircle, LucideHome, LucidePackage, LucideRefreshCw, LucideSave, LucideScissors, LucideSearch, LucideSettings, LucideUndo2, LucideUpload, LucideZoomIn, LucideZoomOut, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menubar-controlled-demo',
  imports: [AerisButton, AerisMenubarModule, LucideDynamicIcon],
  templateUrl: './menubar-controlled.demo.html',
  styleUrl: './menubar-controlled.demo.scss'
})
export class MenubarControlledControlledAndResponsiveDemo {
  protected readonly icons: Readonly<Record<string, LucideIconInput>> = {
    Clipboard: LucideClipboard,
    Copy: LucideCopy,
    Download: LucideDownload,
    ExternalLink: LucideExternalLink,
    FileText: LucideFileText,
    FolderOpen: LucideFolderOpen,
    HelpCircle: LucideHelpCircle,
    Home: LucideHome,
    Package: LucidePackage,
    RefreshCw: LucideRefreshCw,
    Save: LucideSave,
    Scissors: LucideScissors,
    Search: LucideSearch,
    Settings: LucideSettings,
    Undo2: LucideUndo2,
    Upload: LucideUpload,
    ZoomIn: LucideZoomIn,
    ZoomOut: LucideZoomOut,
  };

  protected readonly openPath = signal('');
  protected readonly mobileOpen = signal(false);

  protected readonly nestedItems: readonly AerisMenubarItem[] = [
    {
      id: 'workspace',
      label: 'Workspace',
      icon: 'Package',
      items: [
        { id: 'home', label: 'Home', icon: 'Home' },
        { id: 'settings', label: 'Settings', icon: 'Settings' },
      ],
    },
  ];

  protected openWorkspace(): void {
    this.openPath.set('0');
  }

  protected closeMenubar(): void {
    this.openPath.set('');
    this.mobileOpen.set(false);
  }
}
```

#### HTML

```html
<div class="menubar-controlled">
  <div class="menubar-actions">
    <button aerisButton type="button" variant="secondary" (click)="openWorkspace()">
      Open Workspace
    </button>
    <button aerisButton type="button" variant="secondary" (click)="closeMenubar()">
      Close all
    </button>
  </div>
  <aeris-menubar
    [model]="nestedItems"
    [(openPath)]="openPath"
    [(mobileOpen)]="mobileOpen"
    ariaLabel="Controlled menubar"
  >
    <ng-template
      aerisMenubarItem
      let-item
      let-root="root"
      let-open="open"
      let-hasSubmenu="hasSubmenu"
    >
      <span class="menubar-doc-item">
        @if (item.icon) {
          <svg [lucideIcon]="icons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menubar-doc-item__label">{{ item.label }}</span>
        @if (hasSubmenu) {
          <svg
            class="menubar-doc-item__chevron"
            [attr.data-root]="root || null"
            [attr.data-open]="open || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path [attr.d]="root ? 'm6 8 4 4 4-4' : 'm7.5 4.5 5 5.5-5 5.5'" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menubar>
</div>
```

#### CSS

```css
.menubar-actions,
.menubar-controlled {
  display: grid;
  gap: 1rem;
}

.menubar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.menubar-doc-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menubar-doc-item svg {
  width: 1rem;
  height: 1rem;
}

.menubar-doc-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menubar-doc-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Command and links

Leaf items can emit commands, hand routerLink values to the app, or render native external links.

#### TS

```ts
import { Component, signal } from '@angular/core';
import { type AerisMenubarItem, type AerisMenubarItemEvent } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { LucideClipboard, LucideCopy, LucideDownload, LucideDynamicIcon, LucideExternalLink, LucideFileText, LucideFolderOpen, LucideHelpCircle, LucideHome, LucidePackage, LucideRefreshCw, LucideSave, LucideScissors, LucideSearch, LucideSettings, LucideUndo2, LucideUpload, LucideZoomIn, LucideZoomOut, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menubar-command-demo',
  imports: [AerisMenubarModule, LucideDynamicIcon],
  templateUrl: './menubar-command.demo.html',
  styleUrl: './menubar-command.demo.scss'
})
export class MenubarCommandCommandAndLinksDemo {
  protected readonly icons: Readonly<Record<string, LucideIconInput>> = {
    Clipboard: LucideClipboard,
    Copy: LucideCopy,
    Download: LucideDownload,
    ExternalLink: LucideExternalLink,
    FileText: LucideFileText,
    FolderOpen: LucideFolderOpen,
    HelpCircle: LucideHelpCircle,
    Home: LucideHome,
    Package: LucidePackage,
    RefreshCw: LucideRefreshCw,
    Save: LucideSave,
    Scissors: LucideScissors,
    Search: LucideSearch,
    Settings: LucideSettings,
    Undo2: LucideUndo2,
    Upload: LucideUpload,
    ZoomIn: LucideZoomIn,
    ZoomOut: LucideZoomOut,
  };

  protected readonly commandMessage = signal('No menubar action yet.');

  protected readonly commandItems: readonly AerisMenubarItem[] = [
    {
      id: 'actions',
      label: 'Actions',
      icon: 'Package',
      items: [
        { id: 'search', label: 'Search', icon: 'Search', command: (event) => this.recordAction(event) },
        { id: 'refresh', label: 'Refresh', icon: 'RefreshCw', command: (event) => this.recordAction(event) },
      ],
    },
    {
      id: 'links',
      label: 'Links',
      icon: 'ExternalLink',
      items: [
        { id: 'components', label: 'Components', icon: 'Package', routerLink: ['/components'] },
        { id: 'angular', label: 'Angular', icon: 'ExternalLink', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
      ],
    },
  ];

  protected recordAction(event: AerisMenubarItemEvent): void {
    this.commandMessage.set(`Activated ${event.item.label}`);
  }
}
```

#### HTML

```html
<div>
  <aeris-menubar
    [model]="commandItems"
    ariaLabel="Command menubar"
    (itemSelected)="recordAction($event)"
  >
    <ng-template
      aerisMenubarItem
      let-item
      let-root="root"
      let-open="open"
      let-hasSubmenu="hasSubmenu"
    >
      <span class="menubar-doc-item">
        @if (item.icon) {
          <svg [lucideIcon]="icons[item.icon]" aria-hidden="true"></svg>
        }
        <span class="menubar-doc-item__label">{{ item.label }}</span>
        @if (hasSubmenu) {
          <svg
            class="menubar-doc-item__chevron"
            [attr.data-root]="root || null"
            [attr.data-open]="open || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path [attr.d]="root ? 'm6 8 4 4 4-4' : 'm7.5 4.5 5 5.5-5 5.5'" />
          </svg>
        }
      </span>
    </ng-template>
  </aeris-menubar>
  <small aria-live="polite">{{ commandMessage() }}</small>
</div>
```

#### CSS

```css
.menubar-doc-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menubar-doc-item svg {
  width: 1rem;
  height: 1rem;
}

.menubar-doc-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menubar-doc-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}
```

### Template

Project brand and user content around the menubar and customize each item row.

#### TS

```ts
import { Component } from '@angular/core';
import { AerisBadgeModule } from '@aeris-ui/core/badge';
import { type AerisMenubarItem } from '@aeris-ui/core/menu';
import { AerisMenubarModule } from '@aeris-ui/core/menubar';
import { LucideClipboard, LucideCopy, LucideDownload, LucideDynamicIcon, LucideExternalLink, LucideFileText, LucideFolderOpen, LucideHelpCircle, LucideHome, LucidePackage, LucideRefreshCw, LucideSave, LucideScissors, LucideSearch, LucideSettings, LucideUndo2, LucideUpload, LucideZoomIn, LucideZoomOut, type LucideIconInput } from '@lucide/angular';

@Component({
  selector: 'app-menubar-template-demo',
  imports: [AerisBadgeModule, AerisMenubarModule, LucideDynamicIcon],
  templateUrl: './menubar-template.demo.html',
  styleUrl: './menubar-template.demo.scss'
})
export class MenubarTemplateTemplateDemo {
  protected readonly icons: Readonly<Record<string, LucideIconInput>> = {
    Clipboard: LucideClipboard,
    Copy: LucideCopy,
    Download: LucideDownload,
    ExternalLink: LucideExternalLink,
    FileText: LucideFileText,
    FolderOpen: LucideFolderOpen,
    HelpCircle: LucideHelpCircle,
    Home: LucideHome,
    Package: LucidePackage,
    RefreshCw: LucideRefreshCw,
    Save: LucideSave,
    Scissors: LucideScissors,
    Search: LucideSearch,
    Settings: LucideSettings,
    Undo2: LucideUndo2,
    Upload: LucideUpload,
    ZoomIn: LucideZoomIn,
    ZoomOut: LucideZoomOut,
  };

  protected readonly templateItems: readonly AerisMenubarItem[] = [
    {
      id: 'projects',
      label: 'Projects',
      icon: 'Package',
      badge: 3,
      items: [
        { id: 'core', label: 'Core', icon: 'Package', shortcut: '⌘ + 1' },
        { id: 'docs', label: 'Docs', icon: 'FileText', shortcut: '⌘ + 2' },
      ],
    },
    { id: 'search', label: 'Search', icon: 'Search' },
  ];
}
```

#### HTML

```html
<div>
  <aeris-menubar [model]="templateItems" ariaLabel="Template menubar">
    <ng-template aerisMenubarStart>
      <span class="menubar-brand"
        ><svg [lucideIcon]="icons['Package']" aria-hidden="true"></svg>Aeris</span
      >
    </ng-template>
    <ng-template
      aerisMenubarItem
      let-item
      let-root="root"
      let-open="open"
      let-hasSubmenu="hasSubmenu"
    >
      <span class="menubar-doc-item">
        @if (item.icon) {
          <svg [lucideIcon]="icons[item.icon]" aria-hidden="true"></svg>
        }
        <strong class="menubar-doc-item__label">{{ item.label }}</strong>
        @if (item.badge !== undefined && item.badge !== null) {
          <aeris-badge
            class="menubar-doc-item__badge"
            [value]="item.badge"
            size="sm"
            variant="soft"
          />
        }
        @if (item.shortcut) {
          <kbd>{{ item.shortcut }}</kbd>
        }
        @if (hasSubmenu) {
          <svg
            class="menubar-doc-item__chevron"
            [attr.data-root]="root || null"
            [attr.data-open]="open || null"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path [attr.d]="root ? 'm6 8 4 4 4-4' : 'm7.5 4.5 5 5.5-5 5.5'" />
          </svg>
        }
      </span>
    </ng-template>
    <ng-template aerisMenubarEnd>
      <span class="menubar-user"
        ><svg [lucideIcon]="icons['User']" aria-hidden="true"></svg>Admin</span
      >
    </ng-template>
  </aeris-menubar>
</div>
```

#### CSS

```css
.menubar-doc-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menubar-doc-item svg {
  width: 1rem;
  height: 1rem;
}

.menubar-doc-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item kbd {
  color: var(--aeris-text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menubar-doc-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.menubar-doc-item__chevron[data-root=true][data-open=true] {
  transform: rotate(180deg);
}

.menubar-brand,
.menubar-user {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 850;
}

.menubar-brand svg,
.menubar-user svg {
  width: 1rem;
  height: 1rem;
}

.menubar-user,
small[aria-live] {
  color: var(--aeris-text-2);
  font-size: 0.8125rem;
}

.menubar-doc-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.625rem;
  inline-size: 100%;
  min-inline-size: 0;
}

.menubar-doc-item svg {
  width: 1rem;
  height: 1rem;
}

.menubar-doc-item__label {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item__badge {
  max-inline-size: min(7rem, 36vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menubar-doc-item kbd {
  color: var(--text-2);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
}

.menubar-doc-item__chevron {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.menubar-brand,
.menubar-user {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 850;
}

.menubar-user {
  color: var(--text-2);
  font-size: 0.8125rem;
}
```

## Accessibility

- Menubar renders a navigation landmark, a root menubar, nested menu submenus, and menuitem controls. Submenu triggers expose expanded state and controls relationships.

### Keyboard support

| Key | Function |
| --- | --- |
| `Tab` | Moves focus through the page tab order and closes open menus when leaving the menubar. |
| `Enter` | Opens submenu items or activates leaf items. |
| `Space` | Opens submenu items or activates leaf items. |
| `Escape` | Closes open submenus and returns focus to the root item. |
| `Arrow Right` | Moves across root items or opens a nested submenu. |
| `Arrow Left` | Moves across root items or closes the current submenu. |
| `Arrow Down` | Opens a root submenu or moves to the next submenu item. |
| `Arrow Up` | Opens a root submenu at the last item or moves to the previous submenu item. |
| `Home` | Moves to the first enabled item in the current menu level. |
| `End` | Moves to the last enabled item in the current menu level. |
