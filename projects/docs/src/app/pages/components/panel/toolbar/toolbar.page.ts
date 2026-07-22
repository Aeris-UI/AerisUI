import { Component } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisToolbarModule } from '@aeris-ui/core/toolbar';

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
  selector: 'app-toolbar-page',
  imports: [
    AerisButton,
    AerisInputText,
    AerisTabsModule,
    AerisToolbarModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    PageTocComponent,
    ProjectedCode,
    FormDemoComponent,
  ],
  templateUrl: './toolbar.page.html',
  styleUrl: './toolbar.page.scss',
})
export class ToolbarPage {
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-basic', label: 'Basic' },
    { id: 'toolbar-sections', label: 'Sections' },
    { id: 'toolbar-groups', label: 'Groups' },
    { id: 'toolbar-wrapping', label: 'Wrapping' },
    { id: 'toolbar-vertical', label: 'Vertical' },
    { id: 'toolbar-variants', label: 'Variants' },
    { id: 'toolbar-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-api-inputs', label: 'Inputs' },
    { id: 'toolbar-api-slots', label: 'Slots' },
    { id: 'toolbar-api-content', label: 'Content' },
  ];

  protected readonly interfaceLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-interfaces-types', label: 'Types' },
  ];

  protected readonly tokenLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-token-table', label: 'Tokens' },
  ];

  protected readonly accessibilityLinks: readonly PageTocLink[] = [
    { id: 'toolbar-import', label: 'Import' },
    { id: 'toolbar-a11y-semantics', label: 'Semantics' },
    { id: 'toolbar-a11y-keyboard', label: 'Keyboard' },
  ];

  protected readonly importCode = `import { AerisToolbarModule } from '@aeris-ui/core/toolbar';`;

  protected readonly basicCssCode = `.toolbar-actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}`;

  protected readonly sectionsCssCode = `.toolbar-title {
  display: grid;
  gap: 0.125rem;
  min-width: 0;
}

.toolbar-title strong {
  color: var(--text);
}

.toolbar-title span,
.toolbar-status {
  color: var(--text-2);
  font-size: 0.8125rem;
}

.toolbar-status {
  white-space: nowrap;
}`;

  protected readonly groupCssCode = `.toolbar-search {
  min-width: 12rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-sm);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-size: 0.875rem;
}

.toolbar-search:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--aeris-focus) 38%, transparent);
  outline-offset: 2px;
}`;

  protected readonly wrappingCssCode = `.toolbar-wide-item {
  min-width: 10rem;
}`;

  protected readonly verticalCssCode = `.vertical-toolbar-demo {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.vertical-preview {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--aeris-radius-lg);
  background: var(--surface);
}

.vertical-preview h4 {
  margin: 0 0 0.375rem;
  color: var(--text);
}

.vertical-preview p {
  margin: 0;
  color: var(--text-2);
}`;

  protected readonly variantCssCode = `.toolbar-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 42rem) {
  .toolbar-grid {
    grid-template-columns: 1fr;
  }
}`;

  protected readonly customCssCode = `.brand-toolbar {
  --aeris-toolbar-background: color-mix(in srgb, var(--aeris-primary) 10%, var(--surface));
  --aeris-toolbar-border-width: 2px;
  --aeris-toolbar-border: color-mix(in srgb, var(--aeris-primary) 72%, var(--border));
  --aeris-toolbar-radius: 1.5rem;
  --aeris-toolbar-gap: 1rem;
  --aeris-toolbar-section-gap: 0.75rem;
  --aeris-toolbar-padding-block: 1rem;
  --aeris-toolbar-padding-inline: 1.125rem;
}`;

  protected readonly interfacesCode = `type AerisToolbarVariant = 'outlined' | 'filled' | 'elevated' | 'plain';
type AerisToolbarSize = 'sm' | 'md' | 'lg';
type AerisToolbarOrientation = 'horizontal' | 'vertical';
type AerisToolbarRole = 'toolbar' | 'group' | null;
type AerisToolbarAlign = 'start' | 'center' | 'end' | 'stretch';`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'id', type: 'string', defaultValue: "''", description: 'Optional ID for the toolbar host.' },
    { name: 'variant', type: 'AerisToolbarVariant', defaultValue: "'outlined'", description: 'Outlined, filled, elevated, or plain surface treatment.' },
    { name: 'size', type: 'AerisToolbarSize', defaultValue: "'md'", description: 'Controls toolbar padding and spacing density.' },
    { name: 'orientation', type: 'AerisToolbarOrientation', defaultValue: "'horizontal'", description: 'Sets horizontal or vertical layout and toolbar orientation semantics.' },
    { name: 'align', type: 'AerisToolbarAlign', defaultValue: "'center'", description: 'Aligns sections across the cross axis.' },
    { name: 'wrap', type: 'boolean', defaultValue: 'true', description: 'Allows horizontal toolbars to wrap when space is limited.' },
    { name: 'fluid', type: 'boolean', defaultValue: 'true', description: 'Makes the toolbar fill the available inline size.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Marks the toolbar disabled and makes projected controls inert.' },
    { name: 'role', type: 'AerisToolbarRole', defaultValue: "'toolbar'", description: 'Semantic role for the host. Use group or null when toolbar semantics are not appropriate.' },
    { name: 'ariaLabel', type: 'string', defaultValue: "''", description: 'Accessible name for the toolbar host.' },
    { name: 'ariaLabelledBy', type: 'string', defaultValue: "''", description: 'ID of visible text that labels the toolbar.' },
    { name: 'ariaDescribedBy', type: 'string', defaultValue: "''", description: 'ID of text that describes the toolbar.' },
  ];

  protected readonly slots: readonly ApiRow[] = [
    { name: 'aerisToolbarStart', type: 'attribute directive', defaultValue: '-', description: 'Start-aligned section for primary navigation or leading actions.' },
    { name: 'aerisToolbarCenter', type: 'attribute directive', defaultValue: '-', description: 'Centered section for status, segmented actions, or title content.' },
    { name: 'aerisToolbarEnd', type: 'attribute directive', defaultValue: '-', description: 'End-aligned section for final or secondary actions.' },
    { name: 'aerisToolbarGroup', type: 'attribute directive', defaultValue: '-', description: 'Inline group for related controls inside a section.' },
    { name: 'aerisToolbarSpacer', type: 'attribute directive', defaultValue: '-', description: 'Flexible spacer for custom projected layouts.' },
  ];

  protected readonly contentRows: readonly ApiRow[] = [
    { name: 'default content', type: 'content projection', defaultValue: '-', description: 'Unslotted content rendered after the named toolbar sections.' },
  ];

  protected readonly tokens: readonly ApiRow[] = [
    { name: '--aeris-toolbar-background', type: 'color', defaultValue: '--aeris-surface', description: 'Toolbar surface color.' },
    { name: '--aeris-toolbar-color', type: 'color', defaultValue: '--aeris-text', description: 'Toolbar text color.' },
    { name: '--aeris-toolbar-border', type: 'color', defaultValue: '--aeris-border', description: 'Toolbar border color.' },
    { name: '--aeris-toolbar-border-width', type: 'length', defaultValue: '1px', description: 'Toolbar border width.' },
    { name: '--aeris-toolbar-radius', type: 'length', defaultValue: '--aeris-radius-lg', description: 'Toolbar corner radius.' },
    { name: '--aeris-toolbar-shadow', type: 'shadow', defaultValue: 'none', description: 'Toolbar shadow.' },
    { name: '--aeris-toolbar-filled-background', type: 'color', defaultValue: 'surface mix', description: 'Filled variant surface.' },
    { name: '--aeris-toolbar-elevated-shadow', type: 'shadow', defaultValue: 'soft elevation', description: 'Elevated variant shadow.' },
    { name: '--aeris-toolbar-padding-block', type: 'length', defaultValue: '0.75rem', description: 'Default block padding.' },
    { name: '--aeris-toolbar-padding-inline', type: 'length', defaultValue: '0.875rem', description: 'Default inline padding.' },
    { name: '--aeris-toolbar-gap', type: 'length', defaultValue: '0.75rem', description: 'Gap between toolbar sections.' },
    { name: '--aeris-toolbar-section-gap', type: 'length', defaultValue: '0.5rem', description: 'Gap between controls inside sections and groups.' },
    { name: '--aeris-toolbar-min-height', type: 'length', defaultValue: '3.25rem', description: 'Minimum content row height.' },
    { name: '--aeris-toolbar-spacer-min-size', type: 'length', defaultValue: '1rem', description: 'Minimum size for flexible spacers.' },
    { name: '--aeris-toolbar-disabled-opacity', type: 'number', defaultValue: '0.62', description: 'Opacity when disabled.' },
  ];
}
