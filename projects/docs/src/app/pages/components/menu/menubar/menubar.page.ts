import { Component, signal } from '@angular/core';
import { AerisBadge } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisMenubarModule,
  type AerisMenubarItem,
  type AerisMenubarItemEvent,
} from '@aeris-ui/core/menubar';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideClipboard,
  LucideCopy,
  LucideDownload,
  LucideExternalLink,
  LucideFileText,
  LucideFolderOpen,
  LucideHelpCircle,
  LucideHome,
  LucidePackage,
  LucideRefreshCw,
  LucideSave,
  LucideScissors,
  LucideSearch,
  LucideSettings,
  LucideUndo2,
  LucideUpload,
  LucideUser,
  LucideZoomIn,
  LucideZoomOut,
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
  selector: 'app-menubar-page',
  imports: [
    AerisBadge,
    AerisButton,
    AerisMenubarModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
    LucideDynamicIcon,
  ],
  templateUrl: './menubar.page.html',
  styleUrl: './menubar.page.scss',
})
export class MenubarPage {
  protected readonly commandMessage = signal('No menubar action yet.');
  protected readonly openPath = signal('');
  protected readonly mobileOpen = signal(false);
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
    User: LucideUser,
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
    {
      id: 'view',
      label: 'View',
      icon: 'ZoomIn',
      items: [
        { id: 'zoom-in', label: 'Zoom in', icon: 'ZoomIn' },
        { id: 'zoom-out', label: 'Zoom out', icon: 'ZoomOut' },
      ],
    },
    { id: 'help', label: 'Help', icon: 'HelpCircle' },
  ];

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
            {
              id: 'archive',
              label: 'Archive',
              icon: 'FolderOpen',
              items: [
                { id: 'q1', label: 'Q1 plan.md', icon: 'FileText' },
                { id: 'q2', label: 'Q2 plan.md', icon: 'FileText' },
              ],
            },
          ],
        },
        { separator: true },
        { id: 'settings', label: 'Settings', icon: 'Settings' },
      ],
    },
    {
      id: 'sync',
      label: 'Sync',
      icon: 'RefreshCw',
      items: [
        { id: 'import', label: 'Import', icon: 'Download' },
        { id: 'export', label: 'Export', icon: 'Upload' },
      ],
    },
  ];

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

  protected readonly importCode = `import { AerisMenubarModule } from '@aeris-ui/core/menubar';`;

  private readonly iconImportsCode = `import {
  LucideClipboard,
  LucideCopy,
  LucideDownload,
  LucideExternalLink,
  LucideFileText,
  LucideFolderOpen,
  LucideHelpCircle,
  LucideHome,
  LucidePackage,
  LucideRefreshCw,
  LucideSave,
  LucideScissors,
  LucideSearch,
  LucideSettings,
  LucideUndo2,
  LucideUpload,
  LucideZoomIn,
  LucideZoomOut,
  type LucideIconInput,
} from '@lucide/angular';`;

  private readonly iconMapCode = `protected readonly icons: Readonly<Record<string, LucideIconInput>> = {
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
};`;

  protected readonly basicCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly nestedCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly controlledCode = `${this.iconImportsCode}

${this.iconMapCode}

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
}`;

  protected readonly commandCode = `${this.iconImportsCode}

${this.iconMapCode}

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
  this.commandMessage.set(\`Activated \${event.item.label}\`);
}`;

  protected readonly templateCode = `${this.iconImportsCode}

${this.iconMapCode}

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
];`;

  protected readonly itemTemplateCss = `.menubar-doc-item {
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
}`;

  protected readonly templateCss = `${this.itemTemplateCss}

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
}`;

  protected readonly interfacesCode = `type AerisMenubarSize = 'sm' | 'md' | 'lg';
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
}`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'menubar-import', label: 'Import' },
    { id: 'menubar-basic', label: 'Basic' },
    { id: 'menubar-submenus', label: 'Submenus' },
    { id: 'menubar-controlled', label: 'Controlled' },
    { id: 'menubar-command', label: 'Command and links' },
    { id: 'menubar-template', label: 'Template' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'menubar-import', label: 'Import' },
    { id: 'menubar-api-inputs', label: 'Inputs' },
    { id: 'menubar-api-outputs', label: 'Outputs' },
    { id: 'menubar-api-templates', label: 'Templates' },
    { id: 'menubar-api-methods', label: 'Methods' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'menubar-import', label: 'Import' },
    { id: 'menubar-interfaces-code', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'menubar-import', label: 'Import' },
    { id: 'menubar-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'menubar-import', label: 'Import' },
    { id: 'menubar-a11y-semantics', label: 'Semantics' },
    { id: 'menubar-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated', description: 'ID prefix for the menubar and generated submenu relationships.' },
    { name: 'model', type: 'readonly AerisMenubarItem<T>[]', defaultValue: '[]', description: 'Nested item model for root items and cascading submenu items.' },
    { name: 'openPath', type: 'string (model)', defaultValue: "''", description: 'Controlled path key for the open submenu branch.' },
    { name: 'mobileOpen', type: 'boolean (model)', defaultValue: 'false', description: 'Controlled responsive menu visibility.' },
    { name: 'size', type: 'AerisMenubarSize', defaultValue: "'md'", description: 'Adjusts item height, text, and icon sizing.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents activation and submenu opening.' },
    { name: 'openOnHover', type: 'boolean', defaultValue: 'true', description: 'Opens submenu branches when pointer users hover items.' },
    { name: 'closeOnSelect', type: 'boolean', defaultValue: 'true', description: 'Closes open menus after a leaf item is activated.' },
    { name: 'hideOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Closes menus when pointer interaction starts outside the component.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes open menus when Escape is pressed.' },
    { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Shows a responsive disclosure button at narrow widths.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Menubar'", description: 'Accessible name for the menubar list.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'Element IDs that label the menubar list.' },
    { name: 'navAriaLabel', type: 'string', defaultValue: "''", description: 'Optional accessible name for the wrapping navigation landmark.' },
    { name: 'navAriaLabelledBy', type: 'string', defaultValue: "''", description: 'Element IDs that label the wrapping navigation landmark.' },
    { name: 'toggleAriaLabel', type: 'string', defaultValue: "'Toggle navigation menu'", description: 'Accessible label for the responsive toggle button.' },
    { name: 'navigationHandler', type: 'AerisMenubarNavigationHandler', defaultValue: 'undefined', description: 'Handles routerLink items without coupling Aeris to Angular Router.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'openPathChange', type: 'string', defaultValue: '-', description: 'Emitted automatically by the openPath model.' },
    { name: 'mobileOpenChange', type: 'boolean', defaultValue: '-', description: 'Emitted automatically by the mobileOpen model.' },
    { name: 'opened', type: 'AerisMenubarVisibilityEvent<T>', defaultValue: '-', description: 'Emitted when a submenu branch opens through API or interaction.' },
    { name: 'closed', type: 'AerisMenubarVisibilityEvent<T>', defaultValue: '-', description: 'Emitted when open menus close.' },
    { name: 'itemSelected', type: 'AerisMenubarItemEvent<T>', defaultValue: '-', description: 'Emitted when an enabled leaf item is activated.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisMenubarItem', type: 'AerisMenubarItemTemplateContext<T>', defaultValue: 'default item row', description: 'Customizes root and submenu item content.' },
    { name: 'aerisMenubarStart', type: 'TemplateRef<unknown>', defaultValue: 'none', description: 'Projects content before the menubar items.' },
    { name: 'aerisMenubarEnd', type: 'TemplateRef<unknown>', defaultValue: 'none', description: 'Projects content after the menubar items.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'open(path, event?)', type: 'string | readonly number[], Event | null => void', defaultValue: '-', description: 'Opens a submenu branch by path key or path array.' },
    { name: 'close(event?, reason?)', type: 'Event | null, AerisMenubarCloseReason => void', defaultValue: '-', description: 'Closes open submenus.' },
    { name: 'focus()', type: 'void', defaultValue: '-', description: 'Moves focus to the active or first enabled root item.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-menubar-background', type: 'color', defaultValue: '--aeris-surface', description: 'Root surface background.' },
    { name: '--aeris-menubar-border', type: 'color', defaultValue: '--aeris-border', description: 'Root and separator border color.' },
    { name: '--aeris-menubar-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Root surface corner radius.' },
    { name: '--aeris-menubar-item-radius', type: 'length', defaultValue: '--aeris-radius-control', description: 'Hover and focus item corner radius.' },
    { name: '--aeris-menubar-item-height', type: 'length', defaultValue: '--aeris-item-height', description: 'Minimum item height.' },
    { name: '--aeris-menubar-submenu-width', type: 'length', defaultValue: '15rem', description: 'Minimum submenu panel width.' },
    { name: '--aeris-menubar-submenu-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Submenu panel corner radius.' },
    { name: '--aeris-menubar-icon-size', type: 'length', defaultValue: '1.125rem', description: 'Default icon and chevron size.' },
  ];

  protected recordAction(event: AerisMenubarItemEvent): void {
    this.commandMessage.set(`Activated ${event.item.label}`);
  }

  protected openWorkspace(): void {
    this.openPath.set('0');
  }

  protected closeMenubar(): void {
    this.openPath.set('');
    this.mobileOpen.set(false);
  }
}
