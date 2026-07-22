import { Component } from '@angular/core';
import {
  AerisMeterGroupModule,
  type AerisMeterGroupItem,
  type AerisMeterGroupItemContext,
} from '@aeris-ui/core/meter-group';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideAppWindow,
  LucideDynamicIcon,
  LucideImage,
  LucideMessageCircle,
  LucideSettings,
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

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-meter-group-page',
  imports: [
    AerisMeterGroupModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './meter-group.page.html',
  styleUrl: './meter-group.page.scss',
})
export class MeterGroupPage {
  protected readonly icons = {
    AppWindow: LucideAppWindow,
    Image: LucideImage,
    MessageCircle: LucideMessageCircle,
    Settings: LucideSettings,
  };

  protected readonly basicItems: readonly AerisMeterGroupItem[] = [
    { label: 'Space used', value: 45, tone: 'primary' },
  ];

  protected readonly storageItems: readonly AerisMeterGroupItem[] = [
    { label: 'Applications', value: 14, tone: 'primary' },
    { label: 'Messages', value: 12, tone: 'info' },
    { label: 'Media', value: 8, tone: 'success' },
    { label: 'System', value: 12, tone: 'warning' },
    { label: 'Documents', value: 6, tone: 'danger' },
    { label: 'Cache', value: 11, tone: 'secondary' },
    { label: 'Other', value: 9, tone: 'neutral' },
  ];

  protected readonly colorItems: readonly AerisMeterGroupItem[] = [
    { label: 'Violet', value: 12, color: '#8b5cf6' },
    { label: 'Emerald', value: 14, color: '#10b981' },
    { label: 'Rose', value: 10, color: '#f43f5e' },
    { label: 'Blue', value: 8, color: '#3b82f6' },
    { label: 'Amber', value: 10, color: '#f59e0b' },
  ];

  protected readonly iconItems = this.storageItems.slice(0, 4);
  protected readonly rangeItems: readonly AerisMeterGroupItem[] = [
    { label: 'Projects', value: 32, tone: 'primary' },
    { label: 'Assets', value: 18, tone: 'info' },
    { label: 'Backups', value: 44, tone: 'success' },
    { label: 'Archives', value: 21, tone: 'warning' },
  ];
  protected readonly templateItems: readonly AerisMeterGroupItem[] = [
    { label: 'Projects', value: 25, tone: 'primary' },
    { label: 'Messages', value: 15, tone: 'info' },
    { label: 'Media', value: 20, tone: 'success' },
    { label: 'System', value: 10, tone: 'warning' },
  ];

  protected readonly importCode = `import { AerisMeterGroupModule } from '@aeris-ui/core/meter-group';`;
  protected readonly basicTsCode = `import { type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

protected readonly basicItems: readonly AerisMeterGroupItem[] = [
  { label: 'Space used', value: 45, tone: 'primary' },
];`;
  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'meter-group-import', label: 'Import' },
    { id: 'meter-group-basic', label: 'Basic' },
    { id: 'meter-group-multiple', label: 'Multiple' },
    { id: 'meter-group-colors', label: 'Colors' },
    { id: 'meter-group-icons', label: 'Icons' },
    { id: 'meter-group-labels', label: 'Legend layouts' },
    { id: 'meter-group-vertical', label: 'Vertical' },
    { id: 'meter-group-range', label: 'Range' },
    { id: 'meter-group-options', label: 'Sizes and corners' },
    { id: 'meter-group-templates', label: 'Templates' },
    { id: 'meter-group-tokens', label: 'Tokens' },
  ];
  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'meter-group-import', label: 'Import' },
    { id: 'meter-group-api-inputs', label: 'Inputs' },
    { id: 'meter-group-api-templates', label: 'Templates' },
  ];

  protected readonly stackCssCode = `.meter-stack {
  display: grid;
  gap: 1.25rem;
}`;

  protected readonly dataTsCode = `import { type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

protected readonly storageItems: readonly AerisMeterGroupItem[] = [
  { label: 'Applications', value: 14, tone: 'primary' },
  { label: 'Messages', value: 12, tone: 'info' },
  { label: 'Media', value: 8, tone: 'success' },
  { label: 'System', value: 12, tone: 'warning' },
  { label: 'Documents', value: 6, tone: 'danger' },
  { label: 'Cache', value: 11, tone: 'secondary' },
  { label: 'Other', value: 9, tone: 'neutral' },
];

protected readonly iconItems = this.storageItems.slice(0, 4);`;

  protected readonly colorTsCode = `import { type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

protected readonly colorItems: readonly AerisMeterGroupItem[] = [
  { label: 'Violet', value: 12, color: '#8b5cf6' },
  { label: 'Emerald', value: 14, color: '#10b981' },
  { label: 'Rose', value: 10, color: '#f43f5e' },
  { label: 'Blue', value: 8, color: '#3b82f6' },
  { label: 'Amber', value: 10, color: '#f59e0b' },
];`;

  protected readonly iconCssCode = `.meter-icon-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.meter-icon-label svg {
  width: 1rem;
  height: 1rem;
}`;

  protected readonly rangeTsCode = `import { type AerisMeterGroupItem } from '@aeris-ui/core/meter-group';

protected readonly rangeItems: readonly AerisMeterGroupItem[] = [
  { label: 'Projects', value: 32, tone: 'primary' },
  { label: 'Assets', value: 18, tone: 'info' },
  { label: 'Backups', value: 44, tone: 'success' },
  { label: 'Archives', value: 21, tone: 'warning' },
];`;

  protected readonly templateTsCode = `import {
  type AerisMeterGroupItem,
  type AerisMeterGroupItemContext,
} from '@aeris-ui/core/meter-group';

protected readonly templateItems: readonly AerisMeterGroupItem[] = [
  { label: 'Projects', value: 25, tone: 'primary' },
  { label: 'Messages', value: 15, tone: 'info' },
  { label: 'Media', value: 20, tone: 'success' },
  { label: 'System', value: 10, tone: 'warning' },
];

protected readonly gigabyteFormatter = (
  context: AerisMeterGroupItemContext,
): string => \`\${context.value} GB\`;`;

  protected readonly templateCssCode = `.meter-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.meter-summary strong {
  font-size: 1rem;
}

.meter-summary span,
.meter-footer,
.meter-template-label small {
  color: var(--aeris-text-2);
}

.meter-template-label {
  display: grid;
  gap: 0.125rem;
}

.meter-segment-pattern {
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    135deg,
    transparent 0 4px,
    rgb(255 255 255 / 18%) 4px 7px
  );
}`;

  protected readonly tokenCssCode = `.custom-meter-group {
  --aeris-meter-group-track-size: 1.5rem;
  --aeris-meter-group-track-background: color-mix(
    in srgb,
    var(--aeris-primary) 8%,
    var(--aeris-surface)
  );
  --aeris-meter-group-track-border: color-mix(
    in srgb,
    var(--aeris-primary) 42%,
    var(--aeris-border)
  );
  --aeris-meter-group-legend-gap: 0.875rem 1.5rem;
  --aeris-meter-group-marker-size: 0.875rem;
  --aeris-meter-group-label-font-size: 0.9375rem;
}`;

  protected readonly interfacesCode = `type AerisMeterGroupOrientation = 'horizontal' | 'vertical';
type AerisMeterGroupLegendLayout = 'auto' | 'row' | 'column';
type AerisMeterGroupLegendPosition = 'before' | 'after';
type AerisMeterGroupSize = 'sm' | 'md' | 'lg';
type AerisMeterGroupTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

interface AerisMeterGroupItem {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
  readonly tone?: AerisMeterGroupTone;
}

interface AerisMeterGroupItemContext {
  readonly $implicit: AerisMeterGroupItem;
  readonly item: AerisMeterGroupItem;
  readonly index: number;
  readonly value: number;
  readonly percent: number;
  readonly formattedValue: string;
}

interface AerisMeterGroupSummaryContext {
  readonly $implicit: number;
  readonly total: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
  readonly remaining: number;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'items',
      type: 'readonly AerisMeterGroupItem[]',
      defaultValue: '[]',
      description: 'Ordered scalar contributions rendered as meter segments.',
    },
    {
      name: 'min',
      type: 'number',
      defaultValue: '0',
      description: 'Minimum combined meter value.',
    },
    {
      name: 'max',
      type: 'number',
      defaultValue: '100',
      description: 'Maximum combined meter value and visual capacity.',
    },
    {
      name: 'orientation',
      type: 'AerisMeterGroupOrientation',
      defaultValue: "'horizontal'",
      description: 'Sets a horizontal or vertical meter track.',
    },
    {
      name: 'legendLayout',
      type: 'AerisMeterGroupLegendLayout',
      defaultValue: "'auto'",
      description: 'Sets row, column, or orientation-aware legend layout.',
    },
    {
      name: 'legendPosition',
      type: 'AerisMeterGroupLegendPosition',
      defaultValue: "'after'",
      description: 'Places the legend before or after the meter track.',
    },
    {
      name: 'size',
      type: 'AerisMeterGroupSize',
      defaultValue: "'md'",
      description: 'Sets the meter track thickness.',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows or visually hides the item legend.',
    },
    {
      name: 'showValues',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows formatted values beside visible legend labels.',
    },
    {
      name: 'rounded',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Uses pill corners for the meter track.',
    },
    {
      name: 'valueSuffix',
      type: 'string',
      defaultValue: "'%'",
      description: 'Suffix used by the default item-value formatter.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Meter group'",
      description: 'Accessible name for the meter track.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that labels the meter track.',
    },
    {
      name: 'ariaValueText',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the generated combined measurement summary.',
    },
    {
      name: 'valueFormatter',
      type: '((context: AerisMeterGroupItemContext) => string) | null',
      defaultValue: 'null',
      description: 'Formats visible and accessible item values.',
    },
  ];

  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisMeterGroupLabel',
      type: 'TemplateRef<AerisMeterGroupItemContext>',
      defaultValue: '-',
      description: 'Custom visible content for each legend label.',
    },
    {
      name: 'aerisMeterGroupSegment',
      type: 'TemplateRef<AerisMeterGroupItemContext>',
      defaultValue: '-',
      description: 'Decorative content rendered inside each visual segment.',
    },
    {
      name: 'aerisMeterGroupHeader',
      type: 'TemplateRef<AerisMeterGroupSummaryContext>',
      defaultValue: '-',
      description: 'Content rendered before the meter layout.',
    },
    {
      name: 'aerisMeterGroupFooter',
      type: 'TemplateRef<AerisMeterGroupSummaryContext>',
      defaultValue: '-',
      description: 'Content rendered after the meter layout.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-meter-group-track-size',
      purpose: 'Medium track thickness.',
      fallback: '0.875rem',
    },
    {
      name: '--aeris-meter-group-sm-track-size',
      purpose: 'Small track thickness.',
      fallback: '0.5rem',
    },
    {
      name: '--aeris-meter-group-lg-track-size',
      purpose: 'Large track thickness.',
      fallback: '1.25rem',
    },
    {
      name: '--aeris-meter-group-vertical-size',
      purpose: 'Vertical track height.',
      fallback: '14rem',
    },
    {
      name: '--aeris-meter-group-gap',
      purpose: 'Gap between header, layout, and footer.',
      fallback: '0.875rem',
    },
    {
      name: '--aeris-meter-group-layout-gap',
      purpose: 'Gap between track and legend.',
      fallback: '1rem',
    },
    {
      name: '--aeris-meter-group-radius',
      purpose: 'Non-pill track radius.',
      fallback: '--aeris-radius-control',
    },
    {
      name: '--aeris-meter-group-track-background',
      purpose: 'Unfilled track background.',
      fallback: '--aeris-surface-2',
    },
    {
      name: '--aeris-meter-group-track-border',
      purpose: 'Track border color.',
      fallback: '--aeris-border',
    },
    {
      name: '--aeris-meter-group-track-shadow',
      purpose: 'Track inset shadow.',
      fallback: 'inset subtle shadow',
    },
    {
      name: '--aeris-meter-group-legend-gap',
      purpose: 'Legend row and column gaps.',
      fallback: '0.625rem 1rem',
    },
    {
      name: '--aeris-meter-group-label-gap',
      purpose: 'Gap within a legend item.',
      fallback: '0.4375rem',
    },
    {
      name: '--aeris-meter-group-marker-size',
      purpose: 'Legend marker size.',
      fallback: '0.625rem',
    },
    {
      name: '--aeris-meter-group-marker-radius',
      purpose: 'Legend marker radius.',
      fallback: '50%',
    },
    {
      name: '--aeris-meter-group-label-font-size',
      purpose: 'Legend label size.',
      fallback: '0.8125rem',
    },
    {
      name: '--aeris-meter-group-label-text',
      purpose: 'Legend label color.',
      fallback: '--aeris-text-2',
    },
    {
      name: '--aeris-meter-group-value-text',
      purpose: 'Legend value color.',
      fallback: '--aeris-text',
    },
  ];

  protected readonly gigabyteFormatter = (context: AerisMeterGroupItemContext): string =>
    `${context.value} GB`;
}
