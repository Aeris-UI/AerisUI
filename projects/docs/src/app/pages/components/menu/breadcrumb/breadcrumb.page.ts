import { Component } from '@angular/core';
import {
  AerisBreadcrumbModule,
  type AerisBreadcrumbEllipsisEvent,
  type AerisBreadcrumbItem,
  type AerisBreadcrumbItemEvent,
} from '@aeris-ui/core/breadcrumb';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideDynamicIcon,
  LucideEllipsis,
  LucideHome,
  LucideZap,
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
  selector: 'app-breadcrumb-page',
  imports: [
    AerisBreadcrumbModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './breadcrumb.page.html',
  styleUrl: './breadcrumb.page.scss',
})
export class BreadcrumbPage {
  protected readonly productTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Products' },
    { label: 'Electronics' },
    { label: 'Laptops' },
    { label: 'Aeris Pro 14' },
  ];

  protected readonly breadcrumbIcons: Readonly<Record<string, LucideIconInput>> = {
    Ellipsis: LucideEllipsis,
    Home: LucideHome,
    Zap: LucideZap,
  };

  protected readonly iconHome: AerisBreadcrumbItem = { icon: 'Home', ariaLabel: 'Home' };

  protected readonly iconTrail: readonly AerisBreadcrumbItem[] = [
    { icon: 'Ellipsis', ariaLabel: 'More sections' },
    { label: 'Products' },
    { icon: 'Zap', label: 'Electronics' },
    { label: 'Laptops' },
    { label: 'Dell' },
  ];

  protected readonly adminTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Admin' },
    { label: 'Users', disabled: true },
    { label: 'Ana Martin', current: true },
  ];

  protected readonly longTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Workspace' },
    { label: 'Projects' },
    { label: 'Aeris UI' },
    { label: 'Components' },
    { label: 'Menu' },
    { label: 'Breadcrumb' },
  ];

  protected readonly customTrail: readonly AerisBreadcrumbItem[] = [
    { label: 'Catalog' },
    { label: 'Laptops', data: { count: 42 } },
    { label: 'Aeris Pro 14', data: { count: 5 } },
  ];
  protected readonly customCounts: Readonly<Record<string, number>> = {
    Laptops: 42,
    'Aeris Pro 14': 5,
  };

  protected lastSelection = 'None';
  protected hiddenSummary = 'None';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'breadcrumb-import', label: 'Import' },
    { id: 'breadcrumb-basic', label: 'Basic' },
    { id: 'breadcrumb-home', label: 'Icons' },
    { id: 'breadcrumb-actions', label: 'Links and actions' },
    { id: 'breadcrumb-separator', label: 'Separator' },
    { id: 'breadcrumb-ellipsis', label: 'Ellipsis' },
    { id: 'breadcrumb-template', label: 'Item template' },
    { id: 'breadcrumb-variants', label: 'Variants and sizes' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'breadcrumb-import', label: 'Import' },
    { id: 'breadcrumb-api-inputs', label: 'Inputs' },
    { id: 'breadcrumb-api-outputs', label: 'Outputs' },
    { id: 'breadcrumb-api-templates', label: 'Templates' },
    { id: 'breadcrumb-api-content', label: 'Content' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'breadcrumb-import', label: 'Import' },
    { id: 'breadcrumb-interfaces-code', label: 'Interfaces' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'breadcrumb-import', label: 'Import' },
    { id: 'breadcrumb-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'breadcrumb-import', label: 'Import' },
    { id: 'breadcrumb-a11y-semantics', label: 'Semantics' },
    { id: 'breadcrumb-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly importCode = `import { AerisBreadcrumbModule } from '@aeris-ui/core/breadcrumb';`;

  protected readonly basicTsCode = `import { type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

protected readonly productTrail: readonly AerisBreadcrumbItem[] = [
  { label: 'Products' },
  { label: 'Electronics' },
  { label: 'Laptops' },
  { label: 'Aeris Pro 14' },
];`;

  protected readonly homeTsCode = `import { type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';
import {
  LucideDynamicIcon,
  LucideEllipsis,
  LucideHome,
  LucideZap,
  type LucideIconInput,
} from '@lucide/angular';

protected readonly breadcrumbIcons: Readonly<Record<string, LucideIconInput>> = {
  Ellipsis: LucideEllipsis,
  Home: LucideHome,
  Zap: LucideZap,
};

protected readonly iconHome: AerisBreadcrumbItem = { icon: 'Home', ariaLabel: 'Home' };

protected readonly iconTrail: readonly AerisBreadcrumbItem[] = [
  { icon: 'Ellipsis', ariaLabel: 'More sections' },
  { label: 'Products' },
  { icon: 'Zap', label: 'Electronics' },
  { label: 'Laptops' },
  { label: 'Dell' },
];`;

  protected readonly actionsTsCode = `import {
  type AerisBreadcrumbItem,
  type AerisBreadcrumbItemEvent,
} from '@aeris-ui/core/breadcrumb';

protected readonly adminTrail: readonly AerisBreadcrumbItem[] = [
  { label: 'Admin' },
  { label: 'Users', disabled: true },
  { label: 'Ana Martin', current: true },
];

protected lastSelection = 'None';

protected recordSelection(event: AerisBreadcrumbItemEvent): void {
  this.lastSelection = event.item.label ?? event.item.ariaLabel ?? event.item.icon ?? 'Unnamed item';
}`;

  protected readonly ellipsisTsCode = `import {
  type AerisBreadcrumbEllipsisEvent,
  type AerisBreadcrumbItem,
} from '@aeris-ui/core/breadcrumb';

protected readonly longTrail: readonly AerisBreadcrumbItem[] = [
  { label: 'Workspace' },
  { label: 'Projects' },
  { label: 'Aeris UI' },
  { label: 'Components' },
  { label: 'Menu' },
  { label: 'Breadcrumb' },
];

protected hiddenSummary = 'None';

protected recordHiddenItems(event: AerisBreadcrumbEllipsisEvent): void {
  this.hiddenSummary = event.hiddenItems
    .map((item) => item.label ?? item.ariaLabel ?? item.icon ?? 'Unnamed item')
    .join(', ');
}`;

  protected readonly customTsCode = `import { type AerisBreadcrumbItem } from '@aeris-ui/core/breadcrumb';

protected readonly customTrail: readonly AerisBreadcrumbItem[] = [
  { label: 'Catalog' },
  { label: 'Laptops', data: { count: 42 } },
  { label: 'Aeris Pro 14', data: { count: 5 } },
];

protected readonly customCounts: Readonly<Record<string, number>> = {
  Laptops: 42,
  'Aeris Pro 14': 5,
};`;

  protected readonly actionsCssCode = `.breadcrumb-status {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}`;

  protected readonly iconCssCode = `.breadcrumb-icon-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.breadcrumb-icon-item svg {
  width: 1rem;
  height: 1rem;
}`;

  protected readonly templateCssCode = `.breadcrumb-custom-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.breadcrumb-count {
  min-width: 1.375rem;
  padding: 0.125rem 0.375rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--aeris-primary) 16%, transparent);
  color: var(--aeris-primary-text);
  font-size: 0.75rem;
  font-weight: 800;
  text-align: center;
}`;

  protected readonly variantCssCode = `.breadcrumb-grid {
  display: grid;
  gap: 1rem;
}`;

  protected readonly interfacesCode = `type AerisBreadcrumbVariant = 'outlined' | 'filled' | 'plain';
type AerisBreadcrumbSize = 'sm' | 'md' | 'lg';
type AerisBreadcrumbAriaCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true';

interface AerisBreadcrumbItem {
  readonly label?: string;
  readonly icon?: string;
  readonly ariaLabel?: string;
  readonly href?: string;
  readonly target?: '_self' | '_blank' | '_parent' | '_top' | string;
  readonly rel?: string;
  readonly disabled?: boolean;
  readonly current?: boolean;
  readonly data?: unknown;
}

interface AerisBreadcrumbItemEvent {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisBreadcrumbItem;
  readonly index: number;
  readonly current: boolean;
}

interface AerisBreadcrumbEllipsisEvent {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}

interface AerisBreadcrumbItemTemplateContext {
  readonly $implicit: AerisBreadcrumbItem;
  readonly item: AerisBreadcrumbItem;
  readonly index: number;
  readonly current: boolean;
  readonly disabled: boolean;
}

interface AerisBreadcrumbSeparatorTemplateContext {
  readonly index: number;
  readonly item: AerisBreadcrumbItem;
  readonly nextItem: AerisBreadcrumbItem | null;
}

interface AerisBreadcrumbEllipsisTemplateContext {
  readonly hiddenItems: readonly AerisBreadcrumbItem[];
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: 'generated id', description: 'Host ID.' },
    { name: 'items', type: 'readonly AerisBreadcrumbItem[]', defaultValue: '[]', description: 'Breadcrumb trail items after the optional home item.' },
    { name: 'home', type: 'AerisBreadcrumbItem | null', defaultValue: 'null', description: 'Optional first item for the root location. It can be icon-only when ariaLabel is provided.' },
    { name: 'variant', type: 'AerisBreadcrumbVariant', defaultValue: "'outlined'", description: 'Outlined, filled, or plain surface treatment.' },
    { name: 'size', type: 'AerisBreadcrumbSize', defaultValue: "'md'", description: 'Controls padding, separator size, and text density.' },
    { name: 'separator', type: 'string', defaultValue: "''", description: 'Text separator. Empty value renders the default Aeris chevron.' },
    { name: 'maxItems', type: 'number | null', defaultValue: 'null', description: 'Maximum visible items before middle items collapse behind an ellipsis.' },
    { name: 'wrap', type: 'boolean', defaultValue: 'true', description: 'Allows the breadcrumb trail to wrap when space is limited.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Makes the breadcrumb fill the available inline size.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Breadcrumb'", description: 'Accessible name for the internal navigation element.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the breadcrumb navigation.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of text that describes the breadcrumb navigation.' },
    { name: 'ariaCurrent', type: 'AerisBreadcrumbAriaCurrent', defaultValue: "'page'", description: 'Value applied to the current item through aria-current.' },
    { name: 'ellipsisLabel', type: 'string', defaultValue: "'Show hidden breadcrumb items'", description: 'Accessible name for the ellipsis button.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'itemSelected', type: 'AerisBreadcrumbItemEvent', defaultValue: '-', description: 'Emitted when a non-current, enabled item is selected.' },
    { name: 'ellipsisSelected', type: 'AerisBreadcrumbEllipsisEvent', defaultValue: '-', description: 'Emitted when the ellipsis control is selected.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisBreadcrumbItem', type: 'AerisBreadcrumbItemTemplateContext', defaultValue: 'default anchor, button, or text item', description: 'Custom content for each visible breadcrumb item.' },
    { name: 'aerisBreadcrumbSeparator', type: 'AerisBreadcrumbSeparatorTemplateContext', defaultValue: 'Aeris chevron icon or separator text', description: 'Custom separator rendered between items.' },
    { name: 'aerisBreadcrumbEllipsis', type: 'AerisBreadcrumbEllipsisTemplateContext', defaultValue: 'ellipsis glyph', description: 'Custom ellipsis content when middle items are collapsed.' },
  ];

  protected readonly contentRows: readonly ApiRow[] = [
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Only template directives are consumed. Visual items come from the items and home inputs.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-breadcrumb-background', type: 'color', defaultValue: '--aeris-surface', description: 'Breadcrumb surface color.' },
    { name: '--aeris-breadcrumb-color', type: 'color', defaultValue: '--aeris-text', description: 'Default breadcrumb text color.' },
    { name: '--aeris-breadcrumb-muted-color', type: 'color', defaultValue: '--aeris-text-2', description: 'Non-current item color.' },
    { name: '--aeris-breadcrumb-current-color', type: 'color', defaultValue: '--aeris-text', description: 'Current item color.' },
    { name: '--aeris-breadcrumb-border', type: 'color', defaultValue: '--aeris-border', description: 'Breadcrumb border color.' },
    { name: '--aeris-breadcrumb-border-width', type: 'length', defaultValue: '1px', description: 'Breadcrumb border width.' },
    { name: '--aeris-breadcrumb-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Breadcrumb corner radius.' },
    { name: '--aeris-breadcrumb-shadow', type: 'shadow', defaultValue: 'none', description: 'Breadcrumb shadow.' },
    { name: '--aeris-breadcrumb-padding-block', type: 'length', defaultValue: '0.75rem', description: 'Default block padding.' },
    { name: '--aeris-breadcrumb-padding-inline', type: 'length', defaultValue: '0.875rem', description: 'Default inline padding.' },
    { name: '--aeris-breadcrumb-gap', type: 'length', defaultValue: '0.25rem', description: 'Gap between list items.' },
    { name: '--aeris-breadcrumb-item-gap', type: 'length', defaultValue: '0.375rem', description: 'Gap inside each item.' },
    { name: '--aeris-breadcrumb-icon-size', type: 'length', defaultValue: '1rem', description: 'Default icon box size for item icon metadata.' },
    { name: '--aeris-breadcrumb-item-radius', type: 'length', defaultValue: '--aeris-radius-sm', description: 'Interactive item radius.' },
    { name: '--aeris-breadcrumb-item-hover-background', type: 'color', defaultValue: 'primary mix', description: 'Hover background for links and buttons.' },
    { name: '--aeris-breadcrumb-separator-color', type: 'color', defaultValue: 'muted text mix', description: 'Separator color.' },
    { name: '--aeris-breadcrumb-separator-size', type: 'length', defaultValue: '1.25rem', description: 'Default separator icon box size.' },
    { name: '--aeris-breadcrumb-disabled-opacity', type: 'number', defaultValue: '0.54', description: 'Disabled item opacity.' },
  ];

  protected recordSelection(event: AerisBreadcrumbItemEvent): void {
    this.lastSelection = event.item.label ?? event.item.ariaLabel ?? event.item.icon ?? 'Unnamed item';
  }

  protected recordHiddenItems(event: AerisBreadcrumbEllipsisEvent): void {
    this.hiddenSummary = event.hiddenItems
      .map((item) => item.label ?? item.ariaLabel ?? item.icon ?? 'Unnamed item')
      .join(', ');
  }

}
