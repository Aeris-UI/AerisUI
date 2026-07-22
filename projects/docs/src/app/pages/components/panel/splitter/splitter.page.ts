import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisSplitterModule,
  type AerisSplitterResizeEvent,
} from '@aeris-ui/core/splitter';
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
  selector: 'app-splitter-page',
  imports: [
    AerisButton,
    AerisSplitterModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './splitter.page.html',
  styleUrl: './splitter.page.scss',
})
export class SplitterPage {
  protected controlledSizes = signal<readonly number[]>([30, 45, 25]);
  protected lastResize = '30 / 45 / 25';

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'splitter-import', label: 'Import' },
    { id: 'splitter-basic', label: 'Basic' },
    { id: 'splitter-vertical', label: 'Vertical' },
    { id: 'splitter-divider', label: 'Divider' },
    { id: 'splitter-controlled', label: 'Controlled' },
    { id: 'splitter-constraints', label: 'Constraints' },
    { id: 'splitter-disabled', label: 'Disabled handles' },
    { id: 'splitter-nested', label: 'Nested' },
    { id: 'splitter-variants', label: 'Variants' },
    { id: 'splitter-tokens', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'splitter-api-inputs', label: 'Inputs' },
    { id: 'splitter-api-models', label: 'Models' },
    { id: 'splitter-api-outputs', label: 'Outputs' },
    { id: 'splitter-api-content', label: 'Content' },
    { id: 'splitter-api-methods', label: 'Methods' },
  ];

  protected readonly importCode = `import { AerisSplitterModule } from '@aeris-ui/core/splitter';`;

  protected readonly paneCssCode = `.splitter-pane {
  display: grid;
  gap: 0.5rem;
}

.splitter-pane strong {
  color: var(--text);
}

.splitter-pane span {
  color: var(--text-2);
  font-size: 0.875rem;
}`;

  protected readonly dashboardCssCode = `.dashboard-pane {
  display: grid;
  gap: 0.75rem;
}

.dashboard-card {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}

.dashboard-card strong {
  display: block;
  color: var(--text);
}`;

  protected readonly controlledCssCode = `.splitter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: 0.875rem;
}

.splitter-status {
  margin: 0.75rem 0 0;
  color: var(--text-2);
  font-size: 0.8125rem;
}`;

  protected readonly nestedCssCode = `.mail-pane {
  display: grid;
  gap: 0.625rem;
}

.mail-row {
  padding: 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-md);
  background: var(--surface);
}

.mail-row strong {
  display: block;
  color: var(--text);
}

.mail-detail-splitter {
  display: block;
  block-size: 100%;
}`;

  protected readonly variantCssCode = `.splitter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 52rem) {
  .splitter-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly tokenCssCode = `.brand-splitter {
  --aeris-splitter-background: color-mix(in srgb, var(--aeris-primary) 9%, var(--surface));
  --aeris-splitter-border-width: 2px;
  --aeris-splitter-border: color-mix(in srgb, var(--aeris-primary) 70%, var(--border));
  --aeris-splitter-radius: 1.5rem;
  --aeris-splitter-gutter-size: 1rem;
  --aeris-splitter-gutter-hover-background: color-mix(in srgb, var(--aeris-primary) 22%, transparent);
  --aeris-splitter-divider-color: color-mix(in srgb, var(--aeris-primary) 46%, transparent);
  --aeris-splitter-divider-thickness: 2px;
  --aeris-splitter-handle-color: color-mix(in srgb, var(--aeris-primary) 48%, transparent);
  --aeris-splitter-handle-hover-color: var(--aeris-primary-text);
  --aeris-splitter-handle-length: 3rem;
  --aeris-splitter-panel-padding: 1.25rem;
}`;

  protected readonly controlledTsCode = `import { signal } from '@angular/core';
import { type AerisSplitterResizeEvent } from '@aeris-ui/core/splitter';

protected controlledSizes = signal<readonly number[]>([30, 45, 25]);
protected lastResize = '30 / 45 / 25';

protected setBalancedLayout(): void {
  this.controlledSizes.set([33.333, 33.333, 33.334]);
}

protected setFocusLayout(): void {
  this.controlledSizes.set([20, 60, 20]);
}

protected recordResize(event: AerisSplitterResizeEvent): void {
  this.controlledSizes.set(event.sizes);
  this.lastResize = event.sizes.map((size) => Math.round(size)).join(' / ');
}`;

protected readonly interfacesCode = `type AerisSplitterOrientation = 'horizontal' | 'vertical';
type AerisSplitterVariant = 'outlined' | 'filled' | 'plain';
type AerisSplitterSize = 'sm' | 'md' | 'lg';
type AerisSplitterDivider = 'handle' | 'line';

interface AerisSplitterResizeEvent {
  readonly originalEvent: Event | null;
  readonly sizes: readonly number[];
  readonly previousSizes: readonly number[];
  readonly index: number;
  readonly nextIndex: number;
}`;

  protected readonly splitterInputs: readonly ApiRow[] = [
    { name: 'orientation', type: 'AerisSplitterOrientation', defaultValue: "'horizontal'", description: 'Lays panels out left-to-right or top-to-bottom.' },
    { name: 'variant', type: 'AerisSplitterVariant', defaultValue: "'outlined'", description: 'Applies outlined, filled, or plain surface treatment.' },
    { name: 'size', type: 'AerisSplitterSize', defaultValue: "'md'", description: 'Controls panel padding and gutter density.' },
    { name: 'divider', type: 'AerisSplitterDivider', defaultValue: "'handle'", description: 'Displays handle-only separators or full divider lines with handles.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables every resize handle.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Sets the host inline size to 100%.' },
    { name: 'step', type: 'number', defaultValue: '5', description: 'Keyboard resize increment in percentage points.' },
    { name: 'height', type: 'string', defaultValue: "''", description: 'CSS block size for the splitter root.' },
    { name: 'minHeight', type: 'string', defaultValue: "''", description: 'Optional minimum block size for the splitter root.' },
    { name: 'maxHeight', type: 'string', defaultValue: "''", description: 'Optional maximum block size for the splitter root.' },
    { name: 'width', type: 'string', defaultValue: "'100%'", description: 'CSS inline size for the splitter root.' },
    { name: 'maxWidth', type: 'string', defaultValue: "''", description: 'Optional maximum inline size for the splitter root.' },
    { name: 'role', type: "'group' | 'region' | null", defaultValue: "'group'", description: 'Semantic role for the splitter root.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "'Resizable panels'", description: 'Accessible name when no visible label is referenced.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the splitter.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of text that describes the splitter.' },
    { name: 'separatorLabel', type: 'string', defaultValue: "'Resize panels'", description: 'Accessible name for each resize separator.' },
  ];

  protected readonly panelInputs: readonly ApiRow[] = [
    { name: 'size', type: 'number | null', defaultValue: 'null', description: 'Initial panel size in percentage when the splitter sizes model is empty.' },
    { name: 'minSize', type: 'number', defaultValue: '0', description: 'Minimum panel size in percentage. The default allows full collapse.' },
    { name: 'maxSize', type: 'number', defaultValue: '100', description: 'Maximum panel size in percentage.' },
    { name: 'resizable', type: 'boolean', defaultValue: 'true', description: 'Disables adjacent handles when false.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for the rendered panel section.' },
  ];

  protected readonly models: readonly ApiRow[] = [
    { name: 'sizes', type: 'readonly number[]', defaultValue: '[]', description: 'Controlled panel sizes in percentages.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'resizeStart', type: 'AerisSplitterResizeEvent', defaultValue: '-', description: 'Emitted when pointer resizing starts.' },
    { name: 'resized', type: 'AerisSplitterResizeEvent', defaultValue: '-', description: 'Emitted when keyboard, pointer, or method resizing changes sizes.' },
    { name: 'resizeEnd', type: 'AerisSplitterResizeEvent', defaultValue: '-', description: 'Emitted when pointer resizing ends.' },
  ];

  protected readonly content: readonly ApiRow[] = [
    { name: 'aeris-splitter-panel', type: 'component', defaultValue: '-', description: 'Projected panel rendered by the splitter in source order.' },
    { name: 'default panel content', type: 'content projection', defaultValue: '-', description: 'Content rendered inside each resizable panel.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'setSizes', type: '(sizes: readonly number[], originalEvent?: Event | null) => void', defaultValue: '-', description: 'Sets controlled sizes after normalizing them to the available panels.' },
    { name: 'reset', type: '(originalEvent?: Event | null) => void', defaultValue: '-', description: 'Returns to panel input sizes, or equal sizes when none are set.' },
    { name: 'focusHandle', type: '(index: number, options?: FocusOptions) => void', defaultValue: '-', description: 'Moves focus to a resize separator by index.' },
  ];

  protected setBalancedLayout(): void {
    this.controlledSizes.set([33.333, 33.333, 33.334]);
  }

  protected setFocusLayout(): void {
    this.controlledSizes.set([20, 60, 20]);
  }

  protected recordResize(event: AerisSplitterResizeEvent): void {
    this.controlledSizes.set(event.sizes);
    this.lastResize = event.sizes.map((size) => Math.round(size)).join(' / ');
  }
}
