import { Component, viewChild } from '@angular/core';
import { AerisBadge } from '@aeris-ui/core/badge';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisContextMenu,
  AerisContextMenuModule,
  type AerisContextMenuItem,
  type AerisContextMenuItemEvent,
} from '@aeris-ui/core/context-menu';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

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
  selector: 'app-context-menu-page',
  imports: [
    AerisBadge,
    AerisButton,
    AerisContextMenuModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './context-menu.page.html',
  styleUrl: './context-menu.page.scss',
})
export class ContextMenuPage {
  protected readonly manualMenu = viewChild<AerisContextMenu>('manualMenu');

  protected readonly basicItems: readonly AerisContextMenuItem[] = [
    { label: 'Open' },
    { label: 'Rename' },
    { separator: true },
    { label: 'Archive', badge: 3 },
  ];

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

  protected readonly globalItems: readonly AerisContextMenuItem[] = [
    { label: 'Refresh view' },
    { label: 'Copy page link' },
    { separator: true },
    { label: 'Inspect tokens' },
  ];

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

  protected selectedAction = 'None';
  protected globalActive = false;

  protected readonly commandItems: readonly AerisContextMenuItem[] = [
    { label: 'Copy', shortcut: 'Ctrl C', command: (event) => this.recordAction(event) },
    { label: 'Paste', shortcut: 'Ctrl V', command: (event) => this.recordAction(event) },
    { separator: true },
    { label: 'Delete', shortcut: 'Del', command: (event) => this.recordAction(event) },
  ];

  protected readonly manualItems: readonly AerisContextMenuItem[] = [
    { label: 'Preview' },
    { label: 'Share' },
    { label: 'Export' },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'context-menu-import', label: 'Import' },
    { id: 'context-menu-basic', label: 'Basic' },
    { id: 'context-menu-submenus', label: 'Submenus' },
    { id: 'context-menu-global', label: 'Global' },
    { id: 'context-menu-template', label: 'Template' },
    { id: 'context-menu-command', label: 'Command' },
    { id: 'context-menu-programmatic', label: 'Programmatic' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'context-menu-import', label: 'Import' },
    { id: 'context-menu-api-inputs', label: 'Inputs' },
    { id: 'context-menu-api-outputs', label: 'Outputs' },
    { id: 'context-menu-api-templates', label: 'Templates' },
    { id: 'context-menu-api-methods', label: 'Methods' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'context-menu-import', label: 'Import' },
    { id: 'context-menu-interfaces-code', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'context-menu-import', label: 'Import' },
    { id: 'context-menu-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'context-menu-import', label: 'Import' },
    { id: 'context-menu-a11y-semantics', label: 'Semantics' },
    { id: 'context-menu-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly importCode = `import { AerisContextMenuModule } from '@aeris-ui/core/context-menu';`;

  protected readonly basicTsCode = `import { type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

protected readonly basicItems: readonly AerisContextMenuItem[] = [
  { label: 'Open' },
  { label: 'Rename' },
  { separator: true },
  { label: 'Archive', badge: 3 },
];`;

  protected readonly submenuTsCode = `import { type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

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
];`;

  protected readonly globalTsCode = `import { type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

protected readonly globalItems: readonly AerisContextMenuItem[] = [
  { label: 'Refresh view' },
  { label: 'Copy page link' },
  { separator: true },
  { label: 'Inspect tokens' },
];

protected globalActive = false;`;

  protected readonly templateTsCode = `import { type AerisContextMenuItem } from '@aeris-ui/core/context-menu';

protected readonly templateItems: readonly AerisContextMenuItem[] = [
  { label: 'Aeris Button', badge: 'New' },
  { label: 'Aeris ContextMenu', badge: 'New' },
  { label: 'Aeris Icons', badge: 'Planned', disabled: true },
];

protected readonly templateTones: Readonly<Record<string, string>> = {
  'Aeris Button': 'success',
  'Aeris ContextMenu': 'info',
  'Aeris Icons': 'neutral',
};`;

  protected readonly commandTsCode = `import {
  type AerisContextMenuItem,
  type AerisContextMenuItemEvent,
} from '@aeris-ui/core/context-menu';

protected selectedAction = 'None';

protected readonly commandItems: readonly AerisContextMenuItem[] = [
  { label: 'Copy', shortcut: 'Ctrl C', command: (event) => this.recordAction(event) },
  { label: 'Paste', shortcut: 'Ctrl V', command: (event) => this.recordAction(event) },
  { separator: true },
  { label: 'Delete', shortcut: 'Del', command: (event) => this.recordAction(event) },
];

protected recordAction(event: AerisContextMenuItemEvent): void {
  this.selectedAction = event.item.label ?? 'Unnamed action';
}`;

  protected readonly programmaticTsCode = `import { Component, viewChild } from '@angular/core';
import {
  AerisContextMenu,
  type AerisContextMenuItem,
} from '@aeris-ui/core/context-menu';

protected readonly manualMenu = viewChild<AerisContextMenu>('manualMenu');

protected readonly manualItems: readonly AerisContextMenuItem[] = [
  { label: 'Preview' },
  { label: 'Share' },
  { label: 'Export' },
];

protected openManualMenu(event: MouseEvent): void {
  this.manualMenu()?.show(event);
}`;

  protected readonly targetCssCode = `.context-menu-target {
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
}`;

  protected readonly statusCssCode = `.context-menu-status {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}`;

  protected readonly templateCssCode = `.context-menu-custom-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}
`;

  protected readonly interfacesCode = `type AerisContextMenuSize = 'sm' | 'md' | 'lg';
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
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Root menu ID used for menu and submenu relationships.' },
    { name: 'model', type: 'readonly AerisContextMenuItem<T>[]', defaultValue: '[]', description: 'Menu item model including separators, disabled state, commands, links, and nested children.' },
    { name: 'open', type: 'ModelSignal<boolean>', defaultValue: 'false', description: 'Controlled visibility state.' },
    { name: 'target', type: 'AerisContextMenuTarget', defaultValue: 'null', description: 'Element that opens the menu on contextmenu.' },
    { name: 'global', type: 'boolean', defaultValue: 'false', description: 'Opens the menu from document-level contextmenu events.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevents target, global, and programmatic opening.' },
    { name: 'size', type: 'AerisContextMenuSize', defaultValue: "'md'", description: 'Controls item density and icon sizing.' },
    { name: 'width', type: 'string', defaultValue: "''", description: 'CSS width for the root menu panel.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'CSS max-width for the root menu panel.' },
    { name: 'viewportMargin', type: 'number', defaultValue: '8', description: 'Minimum spacing from viewport edges when positioning.' },
    { name: 'hideOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Closes the menu when pointerdown occurs outside the panel.' },
    { name: 'hideOnScroll', type: 'boolean', defaultValue: 'false', description: 'Closes on window scroll instead of repositioning.' },
    { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Closes the menu when Escape is pressed.' },
    { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: 'Moves focus to the first enabled item after opening.' },
    { name: 'restoreFocus', type: 'boolean', defaultValue: 'true', description: 'Returns focus to the context target when the menu closes.' },
    { name: 'useMenubarRole', type: 'boolean', defaultValue: 'false', description: 'Uses role menubar for the root list when an application requires that pattern.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Context menu'", description: 'Accessible name for the root menu.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the root menu.' },
    { name: 'panelStyleClass', type: 'string', defaultValue: "''", description: 'Additional class applied to the floating panel.' },
    { name: 'navigationHandler', type: 'AerisContextMenuNavigationHandler', defaultValue: 'undefined', description: 'Handles routerLink items without coupling Aeris to Angular Router.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'shown', type: 'AerisContextMenuVisibilityEvent', defaultValue: '-', description: 'Emitted after the menu is requested open.' },
    { name: 'hidden', type: 'AerisContextMenuVisibilityEvent', defaultValue: '-', description: 'Emitted after the menu closes.' },
    { name: 'visibilityChanged', type: 'AerisContextMenuVisibilityEvent', defaultValue: '-', description: 'Emitted for both show and hide transitions.' },
    { name: 'itemSelected', type: 'AerisContextMenuItemEvent<T>', defaultValue: '-', description: 'Emitted when an enabled leaf item is activated.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisContextMenuItem', type: 'AerisContextMenuItemTemplateContext<T>', defaultValue: 'default item row', description: 'Customizes item content for every non-separator row.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'show(event)', type: 'MouseEvent | PointerEvent => void', defaultValue: '-', description: 'Opens the menu at the event coordinates and prevents the native context menu.' },
    { name: 'openAt(x, y, originalEvent?)', type: 'number, number, Event | null => void', defaultValue: '-', description: 'Opens the menu at explicit viewport coordinates.' },
    { name: 'hide(event?, reason?, restoreFocus?)', type: 'Event | null, AerisContextMenuCloseReason, boolean => void', defaultValue: '-', description: 'Closes the menu.' },
    { name: 'toggle(event)', type: 'MouseEvent | PointerEvent => void', defaultValue: '-', description: 'Toggles visibility at the event coordinates.' },
    { name: 'focus()', type: '() => void', defaultValue: '-', description: 'Moves focus to the active menu item.' },
    { name: 'reposition()', type: '() => void', defaultValue: '-', description: 'Recomputes panel placement inside the viewport.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-context-menu-z-index', type: 'number', defaultValue: '1060', description: 'Floating layer z-index.' },
    { name: '--aeris-context-menu-width', type: 'length', defaultValue: '14rem', description: 'Default panel width.' },
    { name: '--aeris-context-menu-max-width', type: 'length', defaultValue: 'min(22rem, calc(100vw - 1rem))', description: 'Panel max width.' },
    { name: '--aeris-context-menu-max-height', type: 'length', defaultValue: 'min(26rem, calc(100vh - 1rem))', description: 'Root menu max height.' },
    { name: '--aeris-context-menu-padding', type: 'length', defaultValue: '0.375rem', description: 'Panel padding.' },
    { name: '--aeris-context-menu-border', type: 'color', defaultValue: '--aeris-border', description: 'Panel border color.' },
    { name: '--aeris-context-menu-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Panel radius.' },
    { name: '--aeris-context-menu-background', type: 'color', defaultValue: '--aeris-surface', description: 'Panel background.' },
    { name: '--aeris-context-menu-color', type: 'color', defaultValue: '--aeris-text', description: 'Panel text color.' },
    { name: '--aeris-context-menu-shadow', type: 'shadow', defaultValue: 'overlay shadow', description: 'Panel and submenu shadow.' },
    { name: '--aeris-context-menu-item-gap', type: 'length', defaultValue: '0.625rem', description: 'Gap inside item rows.' },
    { name: '--aeris-context-menu-item-min-height', type: 'length', defaultValue: '2.25rem', description: 'Default item height.' },
    { name: '--aeris-context-menu-item-radius', type: 'length', defaultValue: '--aeris-radius-sm', description: 'Item radius.' },
    { name: '--aeris-context-menu-item-hover-background', type: 'color', defaultValue: 'primary mix', description: 'Hover and active item background.' },
    { name: '--aeris-context-menu-icon-size', type: 'length', defaultValue: '1.125rem', description: 'Default icon box size.' },
    { name: '--aeris-context-menu-disabled-opacity', type: 'number', defaultValue: '0.52', description: 'Disabled item opacity.' },
    { name: '--aeris-context-menu-separator-color', type: 'color', defaultValue: '--aeris-border', description: 'Separator color.' },
    { name: '--aeris-context-menu-submenu-width', type: 'length', defaultValue: '14rem', description: 'Submenu width.' },
  ];

  protected recordAction(event: AerisContextMenuItemEvent): void {
    this.selectedAction = event.item.label ?? 'Unnamed action';
  }

  protected openManualMenu(event: MouseEvent): void {
    this.manualMenu()?.show(event);
  }
}
