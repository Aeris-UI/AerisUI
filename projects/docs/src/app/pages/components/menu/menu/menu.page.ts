import { Component, signal, viewChild } from '@angular/core';
import { AerisBadge } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisMenu,
  AerisMenuModule,
  type AerisMenuExpandedKeys,
  type AerisMenuItem,
  type AerisMenuItemEvent,
} from '@aeris-ui/core/menu';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideArchive,
  LucideBriefcaseBusiness,
  LucideChartColumn,
  LucideCopy,
  LucideCreditCard,
  LucideExternalLink,
  LucideFilePlus,
  LucideFolder,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMessageCircle,
  LucideRoute,
  LucideSearch,
  LucideSettings,
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
  selector: 'app-menu-page',
  imports: [
    AerisBadge,
    AerisButton,
    AerisMenuModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
    LucideDynamicIcon,
  ],
  templateUrl: './menu.page.html',
  styleUrl: './menu.page.scss',
})
export class MenuPage {
  protected readonly popupMenu = viewChild<AerisMenu>('popupMenu');
  protected readonly commandMessage = signal('No action selected yet.');
  protected readonly controlledKeys = signal<AerisMenuExpandedKeys>({ workspace: true });
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

  protected readonly popupItems: readonly AerisMenuItem[] = [
    { id: 'new-file', label: 'New file', icon: 'FilePlus', shortcut: '⌘ + N' },
    { id: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { separator: true },
    { id: 'archive', label: 'Archive', icon: 'Archive' },
  ];

  protected readonly commandItems: readonly AerisMenuItem[] = [
    { id: 'new', label: 'New', icon: 'FilePlus', command: (event) => this.recordAction(event) },
    { id: 'search', label: 'Search', icon: 'Search', command: (event) => this.recordAction(event) },
    { id: 'router', label: 'Router link', icon: 'Route', routerLink: ['/components', 'menu'] },
    { id: 'external', label: 'External URL', icon: 'ExternalLink', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
  ];

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

  protected readonly importCode = `import { AerisMenuModule } from '@aeris-ui/core/menu';`;

  private readonly iconImportsCode = `import {
  LucideArchive,
  LucideBriefcaseBusiness,
  LucideChartColumn,
  LucideCopy,
  LucideCreditCard,
  LucideExternalLink,
  LucideFilePlus,
  LucideFolder,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMessageCircle,
  LucideRoute,
  LucideSearch,
  LucideSettings,
  LucideUser,
  type LucideIconInput,
} from '@lucide/angular';`;

  private readonly iconMapCode = `protected readonly menuIcons: Readonly<Record<string, LucideIconInput>> = {
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
};`;

  protected readonly basicCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly popupCode = `${this.iconImportsCode}

${this.iconMapCode}

protected readonly popupItems: readonly AerisMenuItem[] = [
  { id: 'new-file', label: 'New file', icon: 'FilePlus', shortcut: '⌘ + N' },
  { id: 'duplicate', label: 'Duplicate', icon: 'Copy' },
  { separator: true },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
];`;

  protected readonly controlledCode = `${this.iconImportsCode}

${this.iconMapCode}

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
}`;

  protected readonly commandCode = `${this.iconImportsCode}

${this.iconMapCode}

protected readonly commandMessage =
  signal('No action selected yet.');

protected readonly commandItems: readonly AerisMenuItem[] = [
  { id: 'new', label: 'New', icon: 'FilePlus', command: (event) => this.recordAction(event) },
  { id: 'search', label: 'Search', icon: 'Search', command: (event) => this.recordAction(event) },
  { id: 'router', label: 'Router link', icon: 'Route', routerLink: ['/components', 'menu'] },
  { id: 'external', label: 'External URL', icon: 'ExternalLink', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
];

protected recordAction(event: AerisMenuItemEvent): void {
  this.commandMessage.set(\`Selected \${event.item.label}\`);
}`;

  protected readonly templateCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly itemTemplateCss = `.menu-icon-item {
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
}`;

  protected readonly templateCss = `${this.itemTemplateCss}

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
}`;

  protected readonly interfacesCode = `type AerisMenuSize = 'sm' | 'md' | 'lg';
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
}`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'menu-import', label: 'Import' },
    { id: 'menu-basic', label: 'Basic' },
    { id: 'menu-popup', label: 'Popup' },
    { id: 'menu-controlled', label: 'Controlled' },
    { id: 'menu-template', label: 'Template' },
    { id: 'menu-command', label: 'Command and links' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'menu-import', label: 'Import' },
    { id: 'menu-api-inputs', label: 'Inputs' },
    { id: 'menu-api-outputs', label: 'Outputs' },
    { id: 'menu-api-templates', label: 'Templates' },
    { id: 'menu-api-methods', label: 'Methods' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'menu-import', label: 'Import' },
    { id: 'menu-interfaces-code', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'menu-import', label: 'Import' },
    { id: 'menu-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'menu-import', label: 'Import' },
    { id: 'menu-a11y-semantics', label: 'Semantics' },
    { id: 'menu-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated', description: 'ID for the root panel.' },
    { name: 'model', type: 'readonly AerisMenuItem<T>[]', defaultValue: '[]', description: 'Menu item model with groups, separators, commands, links, and nested items.' },
    { name: 'expandedKeys', type: 'AerisMenuExpandedKeys (model)', defaultValue: '{}', description: 'Controlled expanded state keyed by item id or generated path.' },
    { name: 'open', type: 'boolean (model)', defaultValue: 'false', description: 'Controlled popup visibility.' },
    { name: 'popup', type: 'boolean', defaultValue: 'false', description: 'Renders the menu as a target-relative overlay opened with show or toggle.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents popup opening.' },
    { name: 'size', type: 'AerisMenuSize', defaultValue: "'md'", description: 'Controls item density and icon sizing.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'Sets --aeris-menu-width on the panel.' },
    { name: 'maxHeight', type: 'string', defaultValue: "''", description: 'Sets --aeris-menu-max-height on the panel.' },
    { name: 'viewportMargin', type: 'number', defaultValue: '8', description: 'Minimum popup distance from viewport edges.' },
    { name: 'hideOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Closes popup menus when pointer interaction starts outside the panel.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes popup menus when Escape is pressed.' },
    { name: 'closeOnSelect', type: 'boolean', defaultValue: 'true', description: 'Closes popup menus after an enabled leaf item is activated.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus to the first enabled item when a popup opens.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the popup trigger after close.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Menu'", description: 'Accessible name for the root menu.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'Element IDs that label the root menu.' },
    { name: 'panelStyleClass', type: 'string', defaultValue: "''", description: 'Additional class string applied to the panel.' },
    { name: 'navigationHandler', type: 'AerisMenuNavigationHandler', defaultValue: 'undefined', description: 'Handles routerLink items without coupling Aeris to Angular Router.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'expandedKeysChange', type: 'AerisMenuExpandedKeys', defaultValue: '-', description: 'Emitted automatically by the expandedKeys model.' },
    { name: 'openChange', type: 'boolean', defaultValue: '-', description: 'Emitted automatically by the open model.' },
    { name: 'shown', type: 'AerisMenuVisibilityEvent', defaultValue: '-', description: 'Emitted after popup opening is requested.' },
    { name: 'hidden', type: 'AerisMenuVisibilityEvent', defaultValue: '-', description: 'Emitted after popup close.' },
    { name: 'visibilityChanged', type: 'AerisMenuVisibilityEvent', defaultValue: '-', description: 'Emitted for both popup show and hide transitions.' },
    { name: 'itemSelected', type: 'AerisMenuItemEvent<T>', defaultValue: '-', description: 'Emitted when an enabled leaf item is activated.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisMenuItem', type: 'AerisMenuItemTemplateContext<T>', defaultValue: 'default item row', description: 'Customizes enabled, disabled, link, and toggleable item content.' },
    { name: 'aerisMenuHeader', type: 'AerisMenuHeaderTemplateContext<T>', defaultValue: 'default group header', description: 'Customizes non-toggleable group headers.' },
    { name: 'aerisMenuStart', type: 'TemplateRef<unknown>', defaultValue: 'none', description: 'Projects content before the menu list.' },
    { name: 'aerisMenuEnd', type: 'TemplateRef<unknown>', defaultValue: 'none', description: 'Projects content after the menu list.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(event)', type: 'MouseEvent | PointerEvent => void', defaultValue: '-', description: 'Opens a popup menu below the event currentTarget.' },
    { name: 'hide(event?, reason?, restoreFocus?)', type: 'Event | null, AerisMenuCloseReason, boolean => void', defaultValue: '-', description: 'Closes a popup menu.' },
    { name: 'toggle(event)', type: 'MouseEvent | PointerEvent => void', defaultValue: '-', description: 'Toggles popup visibility from a trigger event.' },
    { name: 'focus()', type: 'void', defaultValue: '-', description: 'Moves focus to the active or first enabled visible item.' },
    { name: 'expandAll()', type: 'void', defaultValue: '-', description: 'Expands all toggleable groups.' },
    { name: 'collapseAll()', type: 'void', defaultValue: '-', description: 'Collapses all toggleable groups.' },
    { name: 'reposition()', type: 'void', defaultValue: '-', description: 'Recalculates popup coordinates inside the viewport.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-menu-width', type: 'length', defaultValue: '16rem', description: 'Panel width.' },
    { name: '--aeris-menu-max-height', type: 'length', defaultValue: 'none / viewport in popup', description: 'Maximum scrollable panel height.' },
    { name: '--aeris-menu-background', type: 'color', defaultValue: '--aeris-surface', description: 'Panel background.' },
    { name: '--aeris-menu-border', type: 'color', defaultValue: '--aeris-border', description: 'Panel border.' },
    { name: '--aeris-menu-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Panel corner radius.' },
    { name: '--aeris-menu-shadow', type: 'shadow', defaultValue: 'overlay shadow', description: 'Panel elevation.' },
    { name: '--aeris-menu-item-min-height', type: 'length', defaultValue: '--aeris-item-height', description: 'Minimum item height.' },
    { name: '--aeris-menu-item-radius', type: 'length', defaultValue: '--aeris-radius-sm', description: 'Item corner radius.' },
    { name: '--aeris-menu-item-hover-background', type: 'color', defaultValue: 'primary mix', description: 'Hover and active item background.' },
    { name: '--aeris-menu-icon-size', type: 'length', defaultValue: '1.125rem', description: 'Icon and chevron box size.' },
    { name: '--aeris-menu-badge-max-width', type: 'length', defaultValue: 'min(7rem, 36vw)', description: 'Maximum badge width before ellipsis.' },
  ];

  protected recordAction(event: AerisMenuItemEvent): void {
    this.commandMessage.set(`Selected ${event.item.label}`);
  }

  protected expandControlled(): void {
    this.controlledKeys.set({ workspace: true, reports: true });
  }

  protected collapseControlled(): void {
    this.controlledKeys.set({});
  }
}
