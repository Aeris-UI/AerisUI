import { Component, signal } from '@angular/core';
import {
  AerisSplitButton,
  type AerisSplitButtonItem,
} from '@aeris-ui/core/split-button';
import { LucideDynamicIcon } from '@lucide/angular';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { ButtonDemoComponent } from '../shared/button-demo.component';
import { DOC_ICONS } from '../../../../shared/documentation/doc-icons';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-split-button-page',
  imports: [
    AerisSplitButton,
    LucideDynamicIcon,
    AerisTabsModule,
    ButtonDemoComponent,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './split-button.page.html',
  styleUrl: './split-button.page.scss',
})
export class SplitButtonPage {
  protected readonly icons = DOC_ICONS;
  protected readonly open = signal(false);
  protected readonly loading = signal(false);
  protected readonly lastAction = signal('None');
  protected readonly items: readonly AerisSplitButtonItem[] = [
    { label: 'Save draft', icon: 'save', command: () => this.lastAction.set('Save draft') },
    { label: 'Save a copy', icon: 'copy', command: () => this.lastAction.set('Save a copy') },
    { separator: true },
    { label: 'Export', icon: 'export', command: () => this.lastAction.set('Export') },
  ];
  protected readonly stateItems: readonly AerisSplitButtonItem[] = [
    { label: 'Edit', icon: 'edit' },
    { label: 'Delete', icon: 'delete', disabled: true },
    { label: 'Hidden', visible: false },
    { separator: true },
    {
      label: 'Open GitHub',
      icon: 'github',
      url: 'https://github.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'split-basic', label: 'Basic' },
    { id: 'split-severity', label: 'Severity' },
    { id: 'split-variants', label: 'Variants' },
    { id: 'split-sizes', label: 'Sizes' },
    { id: 'split-shape', label: 'Raised, rounded, fluid' },
    { id: 'split-states', label: 'Loading and disabled' },
    { id: 'split-controlled', label: 'Controlled popup' },
    { id: 'split-menu-items', label: 'Menu item states' },
    { id: 'split-props', label: 'Button properties' },
    { id: 'split-templates', label: 'Templates' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'split-api-inputs', label: 'Inputs' },
    { id: 'split-api-outputs', label: 'Outputs' },
    { id: 'split-api-templates', label: 'Templates' },
  ];

  protected readonly importCode =
    `import { AerisSplitButton, type AerisSplitButtonItem }\n  from '@aeris-ui/core/split-button';`;
  protected readonly modelCode = `protected readonly items: readonly AerisSplitButtonItem[] = [
  { label: 'Save draft', icon: 'save', command: () => saveDraft() },
  { label: 'Save a copy', icon: 'copy', command: () => saveCopy() },
  { separator: true },
  { label: 'Export', icon: 'export', command: () => exportFile() },
];

protected save(): void {
  // Run the primary action.
}`;
  protected readonly controlledCode = `protected readonly open = signal(false);

protected closeMenu(): void {
  this.open.set(false);
}`;
  protected readonly stateItemsCode = `protected readonly stateItems:
  readonly AerisSplitButtonItem[] = [
    { label: 'Edit', icon: 'edit' },
    { label: 'Delete', icon: 'delete', disabled: true },
    { label: 'Hidden', visible: false },
    { separator: true },
    {
      label: 'Open GitHub',
      icon: 'github',
      url: 'https://github.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ];`;
  protected readonly interfacesCode = `interface AerisSplitButtonItem<T = unknown> {
  readonly id?: string;
  readonly label?: string;
  readonly ariaLabel?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly separator?: boolean;
  readonly url?: string;
  readonly routerLink?: string | readonly (string | number)[];
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly rel?: string;
  readonly data?: T;
  readonly command?: (event: AerisSplitButtonCommandEvent<T>) => void;
}

type AerisSplitButtonNavigationHandler = (
  link: string | readonly (string | number)[],
  event: MouseEvent | KeyboardEvent,
) => void;

interface AerisSplitButtonCommandEvent<T = unknown> {
  readonly originalEvent: MouseEvent | KeyboardEvent;
  readonly item: AerisSplitButtonItem<T>;
}

interface AerisSplitButtonProps {
  readonly ariaLabel?: string;
  readonly title?: string;
  readonly tabIndex?: number;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'navigationHandler',
      type: 'AerisSplitButtonNavigationHandler | undefined',
      defaultValue: 'undefined',
      description: 'Optional framework-routing bridge for routerLink items. Native href navigation is used otherwise.',
    },
    { name: 'id', type: 'string', defaultValue: 'generated', description: 'Stable base ID for the popup relationship and menu items.' },
    { name: 'label', type: 'string', defaultValue: "''", description: 'Primary action label.' },
    { name: 'icon', type: 'string', defaultValue: "''", description: 'Optional primary action glyph when no icon template is supplied.' },
    { name: 'model', type: 'readonly AerisSplitButtonItem<T>[]', defaultValue: '[]', description: 'Popup menu commands, links, separators, and item states.' },
    { name: 'open', type: 'boolean (model)', defaultValue: 'false', description: 'Controls popup visibility and supports two-way binding.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", description: 'Native primary button type.' },
    { name: 'variant', type: 'AerisSplitButtonVariant', defaultValue: "'primary'", description: 'Visual treatment shared by both button segments.' },
    { name: 'severity', type: 'AerisSplitButtonSeverity', defaultValue: "'primary'", description: 'Semantic color shared by both segments.' },
    { name: 'size', type: 'AerisSplitButtonSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the primary action and popup trigger.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Shows primary progress and disables both segments.' },
    { name: 'raised', type: 'boolean', defaultValue: 'false', description: 'Adds elevation.' },
    { name: 'rounded', type: 'boolean', defaultValue: 'false', description: 'Uses connected pill-shaped corners.' },
    { name: 'outlined', type: 'boolean', defaultValue: 'false', description: 'Uses the outlined Button treatment.' },
    { name: 'text', type: 'boolean', defaultValue: 'false', description: 'Uses the ghost Button treatment.' },
    { name: 'plain', type: 'boolean', defaultValue: 'false', description: 'Uses a neutral treatment.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline width.' },
    { name: 'hideOnClickOutside', type: 'boolean', defaultValue: 'true', description: 'Closes when a pointer clicks outside the component.' },
    { name: 'menuAriaLabel', type: 'string', defaultValue: "'Additional actions'", description: 'Accessible name for the popup menu.' },
    { name: 'menuStyleClass', type: 'string', defaultValue: "''", description: 'Additional popup menu class.' },
    { name: 'buttonProps', type: 'AerisSplitButtonProps', defaultValue: 'undefined', description: 'Primary button ARIA label, title, and tabindex.' },
    { name: 'menuButtonProps', type: 'AerisSplitButtonProps', defaultValue: 'undefined', description: 'Popup trigger ARIA label, title, and tabindex.' },
    { name: 'contentTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces primary action content.' },
    { name: 'iconTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces the primary action icon.' },
    { name: 'loadingIconTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces the loading indicator.' },
    { name: 'dropdownIconTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces the popup trigger icon.' },
    { name: 'itemTemplate', type: 'TemplateRef', defaultValue: 'undefined', description: 'Replaces popup item content.' },
  ];

  protected save(): void {
    this.lastAction.set('Save');
  }

  protected simulateLoading(): void {
    this.loading.set(true);
    globalThis.setTimeout(() => this.loading.set(false), 1400);
  }
}
