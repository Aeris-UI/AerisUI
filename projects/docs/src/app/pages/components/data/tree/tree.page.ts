import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  LucideDynamicIcon,
  LucideFileText,
  LucideFolder,
  LucideImage,
  type LucideIconInput,
} from '@lucide/angular';
import {
  AerisTreeModule,
  type AerisTreeDropEvent,
  type AerisTreeFilterEvent,
  type AerisTreeNode,
  type AerisTreeNodeEvent,
  type AerisTreeSelectionEvent,
} from '@aeris-ui/core/tree';
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

interface FileDetails {
  readonly type: 'folder' | 'typescript' | 'image' | 'document';
  readonly detail: string;
  readonly icon: LucideIconInput;
}

@Component({
  selector: 'app-tree-page',
  imports: [
    AerisButton,
    AerisTreeModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    LucideDynamicIcon,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './tree.page.html',
  styleUrl: './tree.page.scss',
})
export class TreePage {
  protected readonly files = this.createFiles();
  protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
  protected readonly singleSelection = signal<readonly string[]>(['button']);
  protected readonly multipleSelection = signal<readonly string[]>(['button', 'tokens']);
  protected readonly checkboxSelection = signal<readonly string[]>(['assets', 'logo', 'cover']);
  protected readonly filterQuery = signal('');
  protected readonly filterExpanded = signal<readonly string[]>(['workspace']);
  protected readonly eventText = signal('No tree event yet.');
  protected readonly lazyNodes = signal<readonly AerisTreeNode<FileDetails>[]>([
    {
      key: 'remote',
      label: 'Remote workspace',
      leaf: false,
      data: { type: 'folder', detail: 'Load on expansion', icon: LucideFolder },
    },
  ]);
  protected readonly lazyExpanded = signal<readonly string[]>([]);
  protected readonly lazyLoadingKeys = signal<readonly string[]>([]);
  protected readonly controlledExpanded = signal<readonly string[]>(['workspace']);
  protected readonly dragFiles = signal<readonly AerisTreeNode<FileDetails>[]>(this.createFiles());
  protected readonly dragExpanded = signal<readonly string[]>(['workspace', 'source', 'assets']);
  protected readonly dragEventText = signal('Drag a node or use Alt plus an arrow key.');

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'tree-basic', label: 'Basic' },
    { id: 'tree-controlled', label: 'Controlled expansion' },
    { id: 'tree-single-selection', label: 'Single selection' },
    { id: 'tree-multiple-selection', label: 'Multiple selection' },
    { id: 'tree-checkbox-selection', label: 'Checkbox selection' },
    { id: 'tree-filtering', label: 'Filtering' },
    { id: 'tree-lazy', label: 'Lazy loading' },
    { id: 'tree-drag-drop', label: 'Drag and drop' },
    { id: 'tree-template', label: 'Node template' },
    { id: 'tree-states', label: 'States' },
    { id: 'tree-events', label: 'Events' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'tree-api-inputs', label: 'Inputs' },
    { id: 'tree-api-models', label: 'Models' },
    { id: 'tree-api-outputs', label: 'Outputs' },
    { id: 'tree-api-templates', label: 'Templates' },
    { id: 'tree-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisTreeModule } from '@aeris-ui/core/tree';`;

  protected readonly basicTsCode = `interface FileDetails {
  readonly type: 'folder' | 'typescript' | 'image' | 'document';
  readonly detail: string;
}

protected readonly files: readonly AerisTreeNode<FileDetails>[] = [
  {
    key: 'workspace',
    label: 'Aeris workspace',
    data: { type: 'folder', detail: 'Project root' },
    children: [
      {
        key: 'source',
        label: 'Source',
        data: { type: 'folder', detail: 'Application code' },
        children: [
          { key: 'button', label: 'button.ts', leaf: true, data: { type: 'typescript', detail: '4 KB' } },
          { key: 'tokens', label: 'tokens.scss', leaf: true, data: { type: 'document', detail: '8 KB' } },
        ],
      },
      { key: 'readme', label: 'README.md', leaf: true, data: { type: 'document', detail: '12 KB' } },
    ],
  },
];

protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);`;

  protected readonly controlledTsCode = `protected readonly files = this.createFiles();
protected readonly controlledExpanded = signal<readonly string[]>(['workspace']);

protected expandControlled(): void {
  this.controlledExpanded.set(['workspace', 'source', 'assets']);
}

protected collapseControlled(): void {
  this.controlledExpanded.set([]);
}`;

  protected readonly controlledCssCode = `.tree-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}

`;

  protected readonly selectionTsCode = `protected readonly files = this.createFiles();
protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
protected readonly singleSelection = signal<readonly string[]>(['button']);
protected readonly eventText = signal('No tree event yet.');

protected handleSelection(event: AerisTreeSelectionEvent<FileDetails>): void {
  this.eventText.set(
    event.selected
      ? \`Selected \${event.node.label}.\`
      : \`Cleared \${event.node.label}.\`,
  );
}`;

  protected readonly multipleSelectionTsCode = `protected readonly files = this.createFiles();
protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
protected readonly multipleSelection = signal<readonly string[]>(['button', 'tokens']);`;

  protected readonly checkboxSelectionTsCode = `protected readonly files = this.createFiles();
protected readonly checkboxSelection = signal<readonly string[]>(['assets', 'logo', 'cover']);`;

  protected readonly filterTsCode = `protected readonly files = this.createFiles();
protected readonly filterExpanded = signal<readonly string[]>(['workspace']);
protected readonly filterQuery = signal('');

protected handleFilter(event: AerisTreeFilterEvent): void {
  this.eventText.set(event.value ? \`Filtering by “\${event.value}”.\` : 'Filter cleared.');
}`;

  protected readonly lazyTsCode = `protected readonly lazyNodes = signal<readonly AerisTreeNode<FileDetails>[]>([
  {
    key: 'remote',
    label: 'Remote workspace',
    leaf: false,
    data: { type: 'folder', detail: 'Load on expansion' },
  },
]);
protected readonly lazyLoadingKeys = signal<readonly string[]>([]);
protected readonly lazyExpanded = signal<readonly string[]>([]);

protected handleLazyExpand(event: AerisTreeNodeEvent<FileDetails>): void {
  if (event.node.children || event.node.leaf !== false) return;
  this.lazyLoadingKeys.set([event.key]);
  loadRemoteNodes(event.key).then((children) => {
    this.lazyNodes.update((nodes) => nodes.map((node) =>
      node.key === event.key ? { ...node, children } : node,
    ));
    this.lazyLoadingKeys.set([]);
  });
}`;

  protected readonly dragDropTsCode = `protected readonly dragFiles = signal<readonly AerisTreeNode<FileDetails>[]>(
  this.createFiles(),
);
protected readonly dragExpanded = signal<readonly string[]>([
  'workspace',
  'source',
  'assets',
]);
protected readonly dragEventText = signal('Drag a node or use Alt plus an arrow key.');

protected handleDrop(event: AerisTreeDropEvent<FileDetails>): void {
  this.dragEventText.set(
    \`Moved \${event.node.label} \${event.position} \${event.target.label}.\`,
  );
}`;

  protected readonly templateTsCode = `import {
  LucideDynamicIcon,
  LucideFileText,
  LucideFolder,
  LucideImage,
  type LucideIconInput,
} from '@lucide/angular';

interface FileDetails {
  readonly type: 'folder' | 'typescript' | 'image' | 'document';
  readonly detail: string;
  readonly icon: LucideIconInput;
}

protected readonly files = this.createFiles();
protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);`;

  protected readonly templateHtmlCode = `<aeris-tree
  ariaLabel="Project files with details"
  [value]="files"
  [(expandedKeys)]="basicExpanded"
>
  <ng-template aerisTreeNode let-node let-leaf="leaf">
    <span class="file-node">
      <svg [lucideIcon]="$any(node).data.icon"></svg>
      <span>
        <strong>{{ $any(node).label }}</strong>
        <small>{{ $any(node).data.detail }}</small>
      </span>
      @if (leaf) { <span class="file-node__type">{{ $any(node).data.type }}</span> }
    </span>
  </ng-template>
</aeris-tree>`;

  protected readonly templateCssCode = `.file-node {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.file-node > svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: var(--primary-text);
}

.file-node strong,
.file-node small {
  display: block;
}

.file-node small {
  color: var(--text-3);
  font-size: 0.6875rem;
}

.file-node__type {
  margin-left: auto;
  color: var(--text-3);
  font-size: 0.6875rem;
}`;

  protected readonly eventsTsCode = `protected readonly files = this.createFiles();
protected readonly basicExpanded = signal<readonly string[]>(['workspace', 'source']);
protected readonly singleSelection = signal<readonly string[]>(['button']);
protected readonly eventText = signal('No tree event yet.');

protected handleSelection(event: AerisTreeSelectionEvent<FileDetails>): void {
  this.eventText.set(event.selected ? \`Selected \${event.node.label}.\` : \`Cleared \${event.node.label}.\`);
}

protected handleExpand(event: AerisTreeNodeEvent<FileDetails>): void {
  this.eventText.set(\`Expanded \${event.node.label}.\`);
}

protected handleFilter(event: AerisTreeFilterEvent): void {
  this.eventText.set(event.value ? \`Filtering by “\${event.value}”.\` : 'Filter cleared.');
}`;

  protected readonly interfacesCode = `type AerisTreeSelectionMode = 'single' | 'multiple' | 'checkbox';

interface AerisTreeNode<TData = unknown> {
  readonly key: string;
  readonly label: string;
  readonly children?: readonly AerisTreeNode<TData>[];
  readonly data?: TData;
  readonly leaf?: boolean;
  readonly disabled?: boolean;
  readonly selectable?: boolean;
  readonly draggable?: boolean;
  readonly droppable?: boolean;
}

interface AerisTreeNodeEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
}

interface AerisTreeSelectionEvent<TData = unknown> extends AerisTreeNodeEvent<TData> {
  readonly selected: boolean;
  readonly selectedKeys: readonly string[];
}

interface AerisTreeFilterEvent {
  readonly originalEvent: Event;
  readonly value: string;
}

type AerisTreeDropPosition = 'before' | 'inside' | 'after';

interface AerisTreeDropEvent<TData = unknown> {
  readonly originalEvent: Event;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
  readonly target: AerisTreeNode<TData>;
  readonly targetKey: string;
  readonly position: AerisTreeDropPosition;
  readonly value: readonly AerisTreeNode<TData>[];
}

interface AerisTreeNodeContext<TData = unknown> {
  readonly $implicit: AerisTreeNode<TData>;
  readonly node: AerisTreeNode<TData>;
  readonly key: string;
  readonly level: number;
  readonly selected: boolean;
  readonly partial: boolean;
  readonly expanded: boolean;
  readonly leaf: boolean;
  readonly active: boolean;
  readonly loading: boolean;
  readonly dragging: boolean;
  readonly dropPosition: AerisTreeDropPosition | null;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'selectionMode',
      type: "'single' | 'multiple' | 'checkbox' | null",
      defaultValue: 'null',
      description: 'Enables controlled node selection.',
    },
    {
      name: 'filter',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the built-in label filter.',
    },
    {
      name: 'propagateSelection',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Cascades checkbox selection through selectable descendants and derives mixed parent state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables filtering and removes tree nodes from the tab order.',
    },
    {
      name: 'fluid',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Fills the available container width.',
    },
    {
      name: 'loading',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Replaces the tree with its loading state.',
    },
    {
      name: 'loadingKeys',
      type: 'readonly string[]',
      defaultValue: '[]',
      description: 'Branch keys currently loading lazy children.',
    },
    {
      name: 'dragDrop',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Enables pointer dragging and keyboard node reordering.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Tree'",
      description: 'Accessible name for the tree.',
    },
    {
      name: 'filterPlaceholder',
      type: 'string',
      defaultValue: "'Search tree'",
      description: 'Visible filter placeholder.',
    },
    {
      name: 'filterAriaLabel',
      type: 'string',
      defaultValue: "'Search tree'",
      description: 'Accessible name for the filter field.',
    },
    {
      name: 'filterClearAriaLabel',
      type: 'string',
      defaultValue: "'Clear search'",
      description: 'Accessible name for the filter clear button.',
    },
    {
      name: 'emptyMessage',
      type: 'string',
      defaultValue: "'No tree nodes available'",
      description: 'Status text when value is empty.',
    },
    {
      name: 'emptyFilterMessage',
      type: 'string',
      defaultValue: "'No matching nodes'",
      description: 'Status text when filtering has no result.',
    },
    {
      name: 'loadingMessage',
      type: 'string',
      defaultValue: "'Loading tree'",
      description: 'Status text used by the default loading state.',
    },
  ];

  protected readonly models: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'readonly AerisTreeNode<TData>[]',
      defaultValue: '[]',
      description: 'Root nodes. Keys must be unique; drag-drop writes an immutable reordered tree.',
    },
    {
      name: 'selectionKeys',
      type: 'readonly string[]',
      defaultValue: '[]',
      description: 'Selected node keys.',
    },
    {
      name: 'expandedKeys',
      type: 'readonly string[]',
      defaultValue: '[]',
      description: 'Expanded branch keys.',
    },
    {
      name: 'filterValue',
      type: 'string',
      defaultValue: "''",
      description: 'Current label filter value.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'selectionChanged',
      type: 'AerisTreeSelectionEvent<TData>',
      defaultValue: '-',
      description: 'Emitted whenever user selection changes.',
    },
    {
      name: 'nodeSelected',
      type: 'AerisTreeSelectionEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when a node or propagated branch becomes selected.',
    },
    {
      name: 'nodeUnselected',
      type: 'AerisTreeSelectionEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when a node or propagated branch becomes unselected.',
    },
    {
      name: 'nodeExpanded',
      type: 'AerisTreeNodeEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when a user expands a branch, including an unloaded lazy branch.',
    },
    {
      name: 'nodeCollapsed',
      type: 'AerisTreeNodeEvent<TData>',
      defaultValue: '-',
      description: 'Emitted when a user collapses a branch.',
    },
    {
      name: 'filterChanged',
      type: 'AerisTreeFilterEvent',
      defaultValue: '-',
      description: 'Emitted when the user changes or clears the built-in filter.',
    },
    {
      name: 'nodeDropped',
      type: 'AerisTreeDropEvent<TData>',
      defaultValue: '-',
      description: 'Emitted after a pointer or keyboard move updates value.',
    },
  ];

  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisTreeNode',
      type: 'AerisTreeNodeContext<TData>',
      defaultValue: 'Node label',
      description: 'Custom node content rendered inside Aeris tree semantics and interaction.',
    },
    {
      name: 'aerisTreeEmpty',
      type: 'none',
      defaultValue: 'emptyMessage / emptyFilterMessage',
      description: 'Custom empty and no-results content.',
    },
    {
      name: 'aerisTreeLoading',
      type: 'none',
      defaultValue: 'Spinner and loadingMessage',
      description: 'Custom whole-tree loading content.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'focus(key?: string)',
      type: 'void',
      defaultValue: '-',
      description: 'Focuses the requested visible node or the current active node.',
    },
    {
      name: 'expandAll()',
      type: 'void',
      defaultValue: '-',
      description: 'Adds every branch key to expandedKeys.',
    },
    { name: 'collapseAll()', type: 'void', defaultValue: '-', description: 'Clears expandedKeys.' },
  ];

  protected handleSelection(event: AerisTreeSelectionEvent<FileDetails>): void {
    this.eventText.set(
      event.selected ? `Selected ${event.node.label}.` : `Cleared ${event.node.label}.`,
    );
  }

  protected handleExpand(event: AerisTreeNodeEvent<FileDetails>): void {
    this.eventText.set(`Expanded ${event.node.label}.`);
  }

  protected handleFilter(event: AerisTreeFilterEvent): void {
    this.eventText.set(event.value ? `Filtering by “${event.value}”.` : 'Filter cleared.');
  }

  protected expandControlled(): void {
    this.controlledExpanded.set(['workspace', 'source', 'assets']);
  }

  protected collapseControlled(): void {
    this.controlledExpanded.set([]);
  }

  protected handleDrop(event: AerisTreeDropEvent<FileDetails>): void {
    this.dragEventText.set(`Moved ${event.node.label} ${event.position} ${event.target.label}.`);
  }

  protected handleLazyExpand(event: AerisTreeNodeEvent<FileDetails>): void {
    if (
      event.node.children ||
      event.node.leaf !== false ||
      this.lazyLoadingKeys().includes(event.key)
    )
      return;
    this.lazyLoadingKeys.set([event.key]);
    globalThis.setTimeout(() => {
      const children: readonly AerisTreeNode<FileDetails>[] = [
        {
          key: 'remote-components',
          label: 'Components',
          leaf: true,
          data: { type: 'folder', detail: '24 items', icon: LucideFolder },
        },
        {
          key: 'remote-config',
          label: 'workspace.json',
          leaf: true,
          data: { type: 'document', detail: '3 KB', icon: LucideFileText },
        },
      ];
      this.lazyNodes.update((nodes) =>
        nodes.map((node) => (node.key === event.key ? { ...node, children } : node)),
      );
      this.lazyLoadingKeys.set([]);
    }, 650);
  }

  private createFiles(): readonly AerisTreeNode<FileDetails>[] {
    return [
      {
        key: 'workspace',
        label: 'Aeris workspace',
        data: { type: 'folder', detail: 'Project root', icon: LucideFolder },
        children: [
          {
            key: 'source',
            label: 'Source',
            data: { type: 'folder', detail: 'Application code', icon: LucideFolder },
            children: [
              {
                key: 'button',
                label: 'button.ts',
                leaf: true,
                data: { type: 'typescript', detail: '4 KB', icon: LucideFileText },
              },
              {
                key: 'tokens',
                label: 'tokens.scss',
                leaf: true,
                data: { type: 'document', detail: '8 KB', icon: LucideFileText },
              },
            ],
          },
          {
            key: 'assets',
            label: 'Assets',
            data: { type: 'folder', detail: 'Brand media', icon: LucideFolder },
            children: [
              {
                key: 'logo',
                label: 'logo.svg',
                leaf: true,
                data: { type: 'image', detail: '12 KB', icon: LucideImage },
              },
              {
                key: 'cover',
                label: 'cover.webp',
                leaf: true,
                data: { type: 'image', detail: '84 KB', icon: LucideImage },
              },
            ],
          },
          {
            key: 'readme',
            label: 'README.md',
            leaf: true,
            data: { type: 'document', detail: '12 KB', icon: LucideFileText },
          },
        ],
      },
      {
        key: 'archive',
        label: 'Archive',
        disabled: true,
        leaf: true,
        data: { type: 'folder', detail: 'Read only', icon: LucideFolder },
      },
    ];
  }
}
