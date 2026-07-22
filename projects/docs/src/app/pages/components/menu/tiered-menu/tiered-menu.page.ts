import { Component, signal, viewChild } from '@angular/core';
import { AerisBadge } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  AerisTieredMenu,
  AerisTieredMenuModule,
  type AerisTieredMenuItem,
  type AerisTieredMenuItemEvent,
} from '@aeris-ui/core/tiered-menu';
import {
  LucideArchive,
  LucideCopy,
  LucideExternalLink,
  LucideFilePlus,
  LucideFolder,
  LucideFolderOpen,
  LucideGlobe,
  LucideRefreshCw,
  LucideRoute,
  LucideSearch,
  LucideSend,
  LucideSettings,
  LucideShare2,
  LucideTrash2,
  LucideUser,
  LucideDynamicIcon,
  type LucideIconInput,
} from '@lucide/angular';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../../form/shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-tiered-menu-page',
  imports: [
    AerisBadge,
    AerisButton,
    AerisTabsModule,
    AerisTieredMenuModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    LucideDynamicIcon,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './tiered-menu.page.html',
  styleUrl: './tiered-menu.page.scss',
})
export class TieredMenuPage {
  protected readonly popupMenu = viewChild<AerisTieredMenu>('popupMenu');
  protected readonly commandMessage = signal('No action selected yet.');
  protected readonly navigationMessage = signal('No navigation selected yet.');

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

  protected readonly importCode = `import { AerisTieredMenuModule } from '@aeris-ui/core/tiered-menu';`;

  private readonly iconImportsCode = `import {
  LucideArchive,
  LucideCopy,
  LucideExternalLink,
  LucideFilePlus,
  LucideFolder,
  LucideFolderOpen,
  LucideGlobe,
  LucideRefreshCw,
  LucideRoute,
  LucideSearch,
  LucideSend,
  LucideSettings,
  LucideShare2,
  LucideTrash2,
  LucideUser,
  type LucideIconInput,
} from '@lucide/angular';`;

  private readonly iconMapCode = `protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
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
};`;

  protected readonly basicCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly popupCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly templateCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly commandCode = `import { signal } from '@angular/core';

${this.iconImportsCode}

${this.iconMapCode}

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
  this.commandMessage.set(\`Selected \${event.item.label}\`);
}`;

  protected readonly routerCode = `import { signal } from '@angular/core';

${this.iconImportsCode}

${this.iconMapCode}

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
}`;

  protected readonly itemTemplateCss = `.tiered-menu-item {
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
}`;

  protected readonly interfacesCode = `type AerisTieredMenuSize = 'sm' | 'md' | 'lg';
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
}`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tiered-menu-import', label: 'Import' },
    { id: 'tiered-menu-basic', label: 'Basic' },
    { id: 'tiered-menu-popup', label: 'Popup' },
    { id: 'tiered-menu-template', label: 'Template' },
    { id: 'tiered-menu-command', label: 'Command' },
    { id: 'tiered-menu-router', label: 'Router and URL' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'tiered-menu-import', label: 'Import' },
    { id: 'tiered-menu-api-inputs', label: 'Inputs' },
    { id: 'tiered-menu-api-outputs', label: 'Outputs' },
    { id: 'tiered-menu-api-templates', label: 'Templates' },
    { id: 'tiered-menu-api-methods', label: 'Methods' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'tiered-menu-import', label: 'Import' },
    { id: 'tiered-menu-interfaces-code', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'tiered-menu-import', label: 'Import' },
    { id: 'tiered-menu-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'tiered-menu-import', label: 'Import' },
    { id: 'tiered-menu-a11y-semantics', label: 'Semantics' },
    { id: 'tiered-menu-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Panel ID used for menu and submenu relationships.' },
    { name: 'model', type: 'readonly AerisTieredMenuItem<T>[]', defaultValue: '[]', description: 'Menu item model including separators, disabled state, commands, links, and nested children.' },
    { name: 'open', type: 'boolean (model)', defaultValue: 'false', description: 'Controlled popup visibility.' },
    { name: 'popup', type: 'boolean', defaultValue: 'false', description: 'Renders the menu as a target-relative overlay opened with show or toggle.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents activation and popup opening.' },
    { name: 'size', type: 'AerisTieredMenuSize', defaultValue: "'md'", description: 'Controls item density and icon sizing.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Sets --aeris-tiered-menu-width on the panel.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Sets --aeris-tiered-menu-max-width on the panel.' },
    { name: 'viewportMargin', type: 'number', defaultValue: '8', description: 'Minimum popup distance from viewport edges.' },
    { name: 'hideOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Closes open popup menus or visible submenus on outside pointer interaction.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes open popup menus or visible submenus when Escape is pressed.' },
    { name: 'closeOnSelect', type: 'boolean', defaultValue: 'true', description: 'Closes open overlays after an enabled leaf item is activated.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus to the first enabled item when a popup opens.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the popup trigger after close.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Tiered menu'", description: 'Accessible name for the root menu.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'Element IDs that label the root menu.' },
    { name: 'panelStyleClass', type: 'string', defaultValue: "''", description: 'Additional class string applied to the panel.' },
    { name: 'navigationHandler', type: 'AerisTieredMenuNavigationHandler', defaultValue: 'undefined', description: 'Handles routerLink items without coupling Aeris to Angular Router.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'openChange', type: 'boolean', defaultValue: '-', description: 'Emitted automatically by the open model.' },
    { name: 'shown', type: 'AerisTieredMenuVisibilityEvent', defaultValue: '-', description: 'Emitted after popup opening is requested.' },
    { name: 'hidden', type: 'AerisTieredMenuVisibilityEvent', defaultValue: '-', description: 'Emitted after popup close.' },
    { name: 'visibilityChanged', type: 'AerisTieredMenuVisibilityEvent', defaultValue: '-', description: 'Emitted for both popup show and hide transitions.' },
    { name: 'itemSelected', type: 'AerisTieredMenuItemEvent<T>', defaultValue: '-', description: 'Emitted when an enabled leaf item is activated.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisTieredMenuItem', type: 'AerisTieredMenuItemTemplateContext<T>', defaultValue: 'default item row', description: 'Customizes item content for every non-separator row.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(event)', type: 'MouseEvent | PointerEvent => void', defaultValue: '-', description: 'Opens a popup menu below the event currentTarget.' },
    { name: 'hide(event?, reason?, restoreFocus?)', type: 'Event | null, AerisTieredMenuCloseReason, boolean => void', defaultValue: '-', description: 'Closes a popup menu and clears open submenus.' },
    { name: 'toggle(event)', type: 'MouseEvent | PointerEvent => void', defaultValue: '-', description: 'Toggles popup visibility from a trigger event.' },
    { name: 'focus()', type: 'void', defaultValue: '-', description: 'Moves focus to the active or first enabled item.' },
    { name: 'reposition()', type: 'void', defaultValue: '-', description: 'Recalculates popup coordinates inside the viewport.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-tiered-menu-z-index', type: 'number', defaultValue: '1060', description: 'Floating popup z-index.' },
    { name: '--aeris-tiered-menu-width', type: 'length', defaultValue: '14rem', description: 'Root panel width.' },
    { name: '--aeris-tiered-menu-max-width', type: 'length', defaultValue: 'min(22rem, 100%)', description: 'Root panel maximum width.' },
    { name: '--aeris-tiered-menu-max-height', type: 'length', defaultValue: 'min(26rem, calc(100vh - 1rem))', description: 'Root list maximum height.' },
    { name: '--aeris-tiered-menu-padding', type: 'length', defaultValue: '0.375rem', description: 'Panel and submenu padding.' },
    { name: '--aeris-tiered-menu-border', type: 'color', defaultValue: '--aeris-border', description: 'Panel border color.' },
    { name: '--aeris-tiered-menu-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Panel and submenu radius.' },
    { name: '--aeris-tiered-menu-background', type: 'color', defaultValue: '--aeris-surface', description: 'Panel background.' },
    { name: '--aeris-tiered-menu-shadow', type: 'shadow', defaultValue: 'overlay shadow', description: 'Panel and submenu elevation.' },
    { name: '--aeris-tiered-menu-item-gap', type: 'length', defaultValue: '--aeris-density-gap', description: 'Gap inside item rows.' },
    { name: '--aeris-tiered-menu-item-min-height', type: 'length', defaultValue: '--aeris-item-height', description: 'Default item height.' },
    { name: '--aeris-tiered-menu-item-radius', type: 'length', defaultValue: '--aeris-radius-control', description: 'Item hover and focus radius.' },
    { name: '--aeris-tiered-menu-item-hover-background', type: 'color', defaultValue: 'primary mix', description: 'Hover, active, and open item background.' },
    { name: '--aeris-tiered-menu-icon-size', type: 'length', defaultValue: '1.125rem', description: 'Default icon box size.' },
    { name: '--aeris-tiered-menu-submenu-width', type: 'length', defaultValue: '14rem', description: 'Submenu panel width.' },
    { name: '--aeris-tiered-menu-submenu-offset', type: 'length', defaultValue: '0.375rem', description: 'Distance between parent and submenu panel.' },
  ];

  protected recordAction(event: AerisTieredMenuItemEvent): void {
    this.commandMessage.set(`Selected ${event.item.label}`);
  }

  protected navigate(link: string | readonly (string | number)[]): void {
    this.navigationMessage.set(typeof link === 'string' ? link : link.join('/'));
  }
}
