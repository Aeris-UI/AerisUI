import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AerisTreeSelect,
  type AerisTreeNode,
  type AerisTreeSelectChangeEvent,
} from '@aeris-ui/core/tree-select';
import { AerisTabsModule } from '@aeris-ui/core/tabs';

import { CodeBlockComponent } from '../../../../shared/code-block.component';
import { ComponentPageHeaderComponent } from '../../../../shared/documentation/component-page-header/component-page-header.component';
import {
  PageTocComponent,
  type PageTocLink,
} from '../../../../shared/documentation/page-toc/page-toc.component';
import { ProjectedCode } from '../../../../shared/projected-code.directive';
import { FormDemoComponent } from '../shared/form-demo.component';

interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly defaultValue: string;
  readonly description: string;
}

@Component({
  selector: 'app-tree-select-page',
  imports: [
    AerisTreeSelect,
    FormsModule,
    ReactiveFormsModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './tree-select.page.html',
  styleUrl: './tree-select.page.scss',
})
export class TreeSelectPage {
  protected readonly workspace = signal<string | null>('product');
  protected readonly checkboxValues = signal<readonly string[]>(['docs', 'roadmap']);
  protected readonly filteredValue = signal<string | null>(null);
  protected readonly templateValue = signal<string | null>('workspace-web');
  protected readonly invalidValue = signal<string | null>(null);
  protected readonly lastChange = signal('No selection yet.');
  protected readonly reactiveValue = new FormControl<string | null>('workspace-design');
  protected templateDrivenValue: readonly string[] = ['docs'];

  protected readonly nodes: readonly AerisTreeNode[] = [
    {
      label: 'Product',
      value: 'product',
      expanded: true,
      children: [
        { label: 'Roadmap', value: 'roadmap' },
        { label: 'Research', value: 'research' },
      ],
    },
    {
      label: 'Workspaces',
      value: 'workspaces',
      expanded: true,
      children: [
        {
          label: 'Design system',
          value: 'workspace-design',
          children: [
            {
              label: 'Foundations',
              value: 'workspace-design-foundations',
              children: [
                { label: 'Tokens', value: 'workspace-design-tokens' },
                { label: 'Accessibility', value: 'workspace-design-a11y' },
              ],
            },
            { label: 'Components', value: 'workspace-design-components' },
          ],
        },
        { label: 'Web platform', value: 'workspace-web' },
        { label: 'Mobile app', value: 'workspace-mobile', disabled: true },
      ],
    },
    {
      label: 'Knowledge base',
      value: 'knowledge',
      children: [
        { label: 'Documentation', value: 'docs' },
        { label: 'Release notes', value: 'releases' },
      ],
    },
  ];

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tree-select-basic', label: 'Basic' },
    { id: 'tree-select-checkbox', label: 'Checkbox selection' },
    { id: 'tree-select-filter', label: 'Filtering' },
    { id: 'tree-select-templates', label: 'Templates' },
    { id: 'tree-select-sizes', label: 'Sizes' },
    { id: 'tree-select-states', label: 'Appearances and states' },
    { id: 'tree-select-forms', label: 'Angular Forms' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'tree-select-api-inputs', label: 'Inputs' },
    { id: 'tree-select-api-outputs', label: 'Outputs' },
    { id: 'tree-select-api-templates', label: 'Templates' },
    { id: 'tree-select-api-methods', label: 'Methods' },
  ];

  protected readonly importCode =
    `import { AerisTreeSelect, type AerisTreeNode } from '@aeris-ui/core/tree-select';`;

  protected readonly nodesCode = `protected readonly workspace =
  signal<string | null>('product');

protected readonly nodes: readonly AerisTreeNode[] = [
  {
    label: 'Product',
    value: 'product',
    expanded: true,
    children: [
      { label: 'Roadmap', value: 'roadmap' },
      { label: 'Research', value: 'research' },
    ],
  },
  {
    label: 'Workspaces',
    value: 'workspaces',
    children: [
      {
        label: 'Design system',
        value: 'workspace-design',
        children: [
          { label: 'Tokens', value: 'workspace-design-tokens' },
        ],
      },
    ],
  },
];`;

  protected readonly checkboxCode = `protected readonly checkboxValues =
  signal<readonly string[]>(['docs', 'roadmap']);`;

  protected readonly templateCssCode = `.tree-node-template {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tree-node-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 999px;
  background: var(--primary);
}`;

  protected readonly formsCode = `protected readonly reactiveValue =
  new FormControl<string | null>('workspace-design');

protected templateDrivenValue: readonly string[] = ['docs'];`;

  protected readonly interfacesCode = `type AerisTreeSelectSize = 'xs' | 'sm' | 'md' | 'lg';
type AerisTreeSelectAppearance = 'outline' | 'filled';
type AerisTreeSelectMode = 'single' | 'multiple' | 'checkbox';
type AerisTreeSelectValue = string | readonly string[] | null;

interface AerisTreeNode {
  readonly label: string;
  readonly value: string;
  readonly children?: readonly AerisTreeNode[];
  readonly disabled?: boolean;
  readonly selectable?: boolean;
  readonly expanded?: boolean;
}

interface AerisTreeSelectChangeEvent {
  readonly originalEvent: Event;
  readonly value: AerisTreeSelectValue;
  readonly node: AerisTreeNode | null;
  readonly selected: boolean;
}

interface AerisTreeSelectFilterEvent {
  readonly originalEvent: Event;
  readonly query: string;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'nodes', type: 'readonly AerisTreeNode[]', defaultValue: 'required', description: 'Tree data rendered recursively in source order. Nesting depth is not limited by the component API.' },
    { name: 'value', type: 'AerisTreeSelectValue (model)', defaultValue: 'null', description: 'Selected value for single mode or selected value array for multiple and checkbox modes.' },
    { name: 'selectionMode', type: 'AerisTreeSelectMode', defaultValue: "'single'", description: 'Selection behavior: single, multiple, or checkbox with optional descendant propagation.' },
    { name: 'inputId', type: 'string', defaultValue: 'generated', description: 'ID assigned to the combobox trigger for visible labels.' },
    { name: 'name', type: 'string', defaultValue: "''", description: 'Creates a hidden native form value when a selection exists.' },
    { name: 'valueSeparator', type: 'string', defaultValue: "','", description: 'Separator used for hidden native form values in multi-value modes.' },
    { name: 'placeholder', type: 'string', defaultValue: "'Select item'", description: 'Text displayed when no node is selected.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name when no visible label is associated.' },
    { name: 'ariaLabelledby', type: 'string', defaultValue: "''", description: 'IDs of elements that label the combobox.' },
    { name: 'ariaDescribedby', type: 'string', defaultValue: "''", description: 'IDs of help and validation messages.' },
    { name: 'treeAriaLabel', type: 'string', defaultValue: "'Tree options'", description: 'Accessible name for the popup tree.' },
    { name: 'size', type: 'AerisTreeSelectSize', defaultValue: "'md'", description: 'Control height and typography size.' },
    { name: 'appearance', type: 'AerisTreeSelectAppearance', defaultValue: "'outline'", description: 'Outlined or filled visual treatment.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables opening, selection, clearing, and forms interaction.' },
    { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Exposes aria-required for validation.' },
    { name: 'invalid', type: 'boolean', defaultValue: 'false', description: 'Applies invalid styling and aria-invalid.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'false', description: 'Fills the available inline width.' },
    { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a suffix clear button when a selection exists.' },
    { name: 'filter', type: 'boolean', defaultValue: 'false', description: 'Adds a search field to the panel.' },
    { name: 'filterValue', type: 'string (model)', defaultValue: "''", description: 'Controlled filter query with two-way binding.' },
    { name: 'filterPlaceholder', type: 'string', defaultValue: "'Search tree'", description: 'Visible filter placeholder.' },
    { name: 'filterAriaLabel', type: 'string', defaultValue: "'Search tree'", description: 'Accessible name for the filter field.' },
    { name: 'filterClearAriaLabel', type: 'string', defaultValue: "'Clear search'", description: 'Accessible name for the filter clear button.' },
    { name: 'resetFilterOnClose', type: 'boolean', defaultValue: 'true', description: 'Resets the filter whenever the panel closes.' },
    { name: 'autofocusFilter', type: 'boolean', defaultValue: 'true', description: 'Moves focus to the filter when the panel opens.' },
    { name: 'emptyMessage', type: 'string', defaultValue: "'No items available'", description: 'Message displayed when the tree is empty.' },
    { name: 'emptyFilterMessage', type: 'string', defaultValue: "'No matching items'", description: 'Message displayed when filtering has no matches.' },
    { name: 'panelMaxHeight', type: 'string', defaultValue: "'18rem'", description: 'Maximum scrollable tree height as a CSS length.' },
    { name: 'propagateSelection', type: 'boolean', defaultValue: 'true', description: 'Checkbox mode selects or clears enabled descendants with the parent node.' },
    { name: 'expandOnFilter', type: 'boolean', defaultValue: 'true', description: 'Shows matching descendants while a filter query is active.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'valueChange', type: 'AerisTreeSelectValue', defaultValue: '-', description: 'Emitted automatically by the value model.' },
    { name: 'valueInput', type: 'AerisTreeSelectValue', defaultValue: '-', description: 'Explicit value-change notification.' },
    { name: 'changed', type: 'AerisTreeSelectChangeEvent', defaultValue: '-', description: 'Selection change with node metadata.' },
    { name: 'filterChanged', type: 'AerisTreeSelectFilterEvent', defaultValue: '-', description: 'Filter query changes.' },
    { name: 'opened / closed / cleared', type: 'void', defaultValue: '-', description: 'Panel and clear lifecycle events.' },
    { name: 'nodeExpanded / nodeCollapsed', type: 'AerisTreeNode', defaultValue: '-', description: 'Expansion lifecycle events.' },
    { name: 'focused / blurred', type: 'FocusEvent', defaultValue: '-', description: 'Combobox focus lifecycle events.' },
    { name: 'touch', type: 'void', defaultValue: '-', description: 'Touched-state integration on blur.' },
  ];

  protected readonly templates: readonly ApiRow[] = [
    { name: 'aerisTreeSelectNode', type: 'node, level, selected, expanded, active', defaultValue: '-', description: 'Custom node content, including optional consumer-provided icons.' },
    { name: 'aerisTreeSelectValue', type: 'nodes, value', defaultValue: '-', description: 'Custom selected-value display.' },
    { name: 'aerisTreeSelectHeader', type: 'none', defaultValue: '-', description: 'Custom panel header.' },
    { name: 'aerisTreeSelectFooter', type: 'none', defaultValue: '-', description: 'Custom panel footer.' },
    { name: 'aerisTreeSelectEmpty', type: 'none', defaultValue: '-', description: 'Custom empty-state content.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus(options?)', type: 'void', defaultValue: '-', description: 'Moves focus to the combobox trigger.' },
    { name: 'openPanel() / closePanel()', type: 'void', defaultValue: '-', description: 'Controls panel visibility.' },
    { name: 'toggle()', type: 'void', defaultValue: '-', description: 'Toggles panel visibility.' },
    { name: 'clear() / reset()', type: 'void', defaultValue: '-', description: 'Clears selection, with reset also clearing filter and panel state.' },
    { name: 'expandAll() / collapseAll()', type: 'void', defaultValue: '-', description: 'Expands or collapses every parent node at any depth.' },
  ];

  protected recordChange(event: AerisTreeSelectChangeEvent): void {
    this.lastChange.set(event.node ? `${event.selected ? 'Selected' : 'Removed'} ${event.node.label}` : 'Selection changed');
  }
}
