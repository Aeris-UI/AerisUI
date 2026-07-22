import { Component, signal } from '@angular/core';
import {
  AerisMegaMenuModule,
  type AerisMegaMenuItem,
  type AerisMegaMenuItemEvent,
} from '@aeris-ui/core/mega-menu';
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
  selector: 'app-mega-menu-page',
  imports: [
    AerisMegaMenuModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './mega-menu.page.html',
  styleUrl: './mega-menu.page.scss',
})
export class MegaMenuPage {
  protected readonly lastAction = signal('No menu action yet');

  protected readonly productMenu: readonly AerisMegaMenuItem[] = [
    {
      label: 'Products',
      groups: [
        {
          label: 'Build',
          description: 'Component foundations',
          items: [
            { label: 'Components', description: 'Production Angular UI', routerLink: ['/components'] },
            { label: 'Design tokens', description: 'Theme surfaces and palettes' },
            { label: 'Accessibility', description: 'Patterns and keyboard support' },
          ],
        },
        {
          label: 'Ship',
          description: 'Release workflows',
          items: [
            { label: 'Documentation', description: 'Guides and examples' },
            { label: 'Migration plans', description: 'Adoption checklists', badge: 'New' },
            { label: 'Changelog', description: 'Version notes', disabled: true },
          ],
        },
      ],
    },
    {
      label: 'Resources',
      groups: [
        {
          label: 'Learn',
          items: [
            { label: 'Installation' },
            { label: 'Theming' },
            { label: 'Accessibility' },
          ],
        },
        {
          label: 'Community',
          items: [
            { label: 'Roadmap' },
            { label: 'Examples' },
            { label: 'Support' },
          ],
        },
      ],
    },
    { label: 'Pricing' },
  ];

  protected readonly commandMenu: readonly AerisMegaMenuItem[] = [
    {
      label: 'Workspace',
      groups: [
        {
          label: 'Project',
          items: [
            { label: 'New page', command: (event) => this.recordAction(event) },
            { label: 'Duplicate', command: (event) => this.recordAction(event) },
            { label: 'Archive', command: (event) => this.recordAction(event) },
          ],
        },
      ],
    },
    {
      label: 'Links',
      groups: [
        {
          label: 'Navigation',
          items: [
            { label: 'Components', routerLink: ['/components'] },
            { label: 'Angular', url: 'https://angular.dev', target: '_blank', rel: 'noreferrer' },
          ],
        },
      ],
    },
  ];

  protected readonly importCode = `import { AerisMegaMenuModule } from '@aeris-ui/core/mega-menu';`;

  protected readonly menuCode = `protected readonly productMenu: readonly AerisMegaMenuItem[] = [
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
];`;

  protected readonly commandCode = `protected readonly commandMenu: readonly AerisMegaMenuItem[] = [
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
  this.lastAction.set(\`Activated \${event.item.label}\`);
}`;

  protected readonly templateCss = `.mega-menu-template-item {
  display: grid;
  gap: 0.125rem;
}

.mega-menu-template-item strong {
  font-weight: 850;
}

.mega-menu-template-item small {
  color: var(--text-2);
}`;

  protected readonly interfacesCode = `type AerisMegaMenuOrientation = 'horizontal' | 'vertical';
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
}`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'mega-menu-import', label: 'Import' },
    { id: 'mega-menu-basic', label: 'Basic' },
    { id: 'mega-menu-vertical', label: 'Vertical' },
    { id: 'mega-menu-template', label: 'Template' },
    { id: 'mega-menu-command', label: 'Command and links' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'mega-menu-import', label: 'Import' },
    { id: 'mega-menu-api-inputs', label: 'Inputs' },
    { id: 'mega-menu-api-outputs', label: 'Outputs' },
    { id: 'mega-menu-api-templates', label: 'Templates' },
    { id: 'mega-menu-api-methods', label: 'Methods' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'mega-menu-import', label: 'Import' },
    { id: 'mega-menu-interfaces-code', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'mega-menu-import', label: 'Import' },
    { id: 'mega-menu-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'mega-menu-import', label: 'Import' },
    { id: 'mega-menu-a11y-semantics', label: 'Semantics' },
    { id: 'mega-menu-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Base id used for menu item and panel relationships.' },
    { name: 'model', type: 'readonly AerisMegaMenuItem<T>[]', defaultValue: '[]', description: 'Root menu items with optional grouped mega panels.' },
    { name: 'orientation', type: 'horizontal | vertical', defaultValue: "'horizontal'", description: 'Lays root items across or stacked.' },
    { name: 'size', type: 'sm | md | lg', defaultValue: "'md'", description: 'Controls trigger and panel item density.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Mega menu'", description: 'Accessible name for the navigation region.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the navigation region.' },
    { name: 'openOnHover', type: 'boolean', defaultValue: 'true', description: 'Opens root panels on pointer hover.' },
    { name: 'closeOnSelect', type: 'boolean', defaultValue: 'true', description: 'Closes an open panel after activating a leaf item.' },
    { name: 'navigationHandler', type: 'AerisMegaMenuNavigationHandler', defaultValue: 'undefined', description: 'Handles routerLink items without coupling Aeris to Angular Router.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'itemSelected', type: 'AerisMegaMenuItemEvent<T>', defaultValue: '-', description: 'Emitted when an enabled item is activated.' },
    { name: 'opened', type: 'AerisMegaMenuVisibilityEvent<T>', defaultValue: '-', description: 'Emitted when a root mega panel opens.' },
    { name: 'closed', type: 'AerisMegaMenuVisibilityEvent<T>', defaultValue: '-', description: 'Emitted when a root mega panel closes.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-mega-menu-background', type: 'color', defaultValue: '--aeris-surface', description: 'Root surface background.' },
    { name: '--aeris-mega-menu-border', type: 'color', defaultValue: '--aeris-border', description: 'Root and nested separator border color.' },
    { name: '--aeris-mega-menu-panel-background', type: 'color', defaultValue: '--aeris-surface', description: 'Mega panel background.' },
    { name: '--aeris-mega-menu-panel-width', type: 'length', defaultValue: '44rem', description: 'Maximum panel width before viewport clamping.' },
    { name: '--aeris-mega-menu-item-hover-background', type: 'color', defaultValue: 'primary mix', description: 'Hover and open trigger surface.' },
    { name: '--aeris-mega-menu-icon-size', type: 'length', defaultValue: '1.125rem', description: 'Default icon and chevron box.' },
  ];

  protected recordAction(event: AerisMegaMenuItemEvent): void {
    this.lastAction.set(`Activated ${event.item.label}`);
  }
}
