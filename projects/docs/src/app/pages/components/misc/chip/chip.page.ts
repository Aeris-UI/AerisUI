import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisChipModule, type AerisChipRemoveEvent } from '@aeris-ui/core/chip';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import {
  LucideCamera,
  LucideCode2,
  LucideDynamicIcon,
  LucidePalette,
  LucideXCircle,
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
  selector: 'app-chip-page',
  imports: [
    AerisButton,
    AerisChipModule,
    AerisTabsModule,
    LucideDynamicIcon,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './chip.page.html',
  styleUrl: './chip.page.scss',
})
export class ChipPage {
  protected readonly icons = {
    Camera: LucideCamera,
    Code2: LucideCode2,
    Palette: LucidePalette,
    XCircle: LucideXCircle,
  };
  protected readonly removableVisible = signal(true);
  protected readonly removalStatus = signal('Photography is selected.');

  protected readonly importCode = `import { AerisChipModule } from '@aeris-ui/core/chip';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'chip-import', label: 'Import' },
    { id: 'chip-basic', label: 'Basic' },
    { id: 'chip-icons', label: 'Icons' },
    { id: 'chip-images', label: 'Images' },
    { id: 'chip-styles', label: 'Sizes and styles' },
    { id: 'chip-removable', label: 'Removable' },
    { id: 'chip-content', label: 'Custom content' },
    { id: 'chip-custom', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'chip-import', label: 'Import' },
    { id: 'chip-api-models', label: 'Models' },
    { id: 'chip-api-inputs', label: 'Inputs' },
    { id: 'chip-api-outputs', label: 'Outputs' },
    { id: 'chip-api-content', label: 'Content' },
    { id: 'chip-api-methods', label: 'Methods' },
  ];

  protected readonly rowCssCode = `.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}`;

  protected readonly removableTsCode = `import { type AerisChipRemoveEvent } from '@aeris-ui/core/chip';

protected readonly removableVisible = signal(true);
protected readonly removalStatus = signal('Photography is selected.');

protected recordRemoval(event: AerisChipRemoveEvent): void {
  this.removalStatus.set(\`Removed \${event.label}.\`);
}

protected restoreChip(): void {
  this.removableVisible.set(true);
  this.removalStatus.set('Photography is selected.');
}`;

  protected readonly removableCssCode = `.chip-removable-demo {
  display: grid;
  justify-items: start;
  gap: 0.875rem;
}

.chip-removable-demo p {
  margin: 0;
  color: var(--aeris-text-2);
}`;

  protected readonly contentCssCode = `.chip-plan {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.chip-plan strong,
.chip-plan small {
  display: block;
}

.chip-plan small {
  color: var(--aeris-text-2);
  font-size: 0.6875rem;
}`;

  protected readonly customCssCode = `.brand-chip {
  --aeris-chip-height: 2.75rem;
  --aeris-chip-padding-inline: 1rem;
  --aeris-chip-gap: 0.625rem;
  --aeris-chip-font-size: 0.875rem;
  --aeris-chip-font-weight: 800;
  --aeris-chip-icon-size: 1.125rem;
  --aeris-chip-remove-size: 1.5rem;
  --aeris-chip-remove-icon-size: 0.875rem;
}`;

  protected readonly interfacesCode = `type AerisChipSize = 'sm' | 'md' | 'lg';
type AerisChipVariant = 'soft' | 'outline';
type AerisChipTone =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger';
type AerisChipShape = 'pill' | 'rounded';

interface AerisChipRemoveEvent {
  readonly originalEvent: Event | null;
  readonly label: string;
}

interface AerisChipRemoveIconContext {
  readonly $implicit: AerisChip;
  readonly disabled: boolean;
}`;

  protected readonly models: readonly ApiRow[] = [
    {
      name: 'visible',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Two-way visibility state updated automatically after removal.',
    },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'label',
      type: 'string',
      defaultValue: "''",
      description: 'Visible chip text and default accessible group name.',
    },
    {
      name: 'imageSrc',
      type: 'string',
      defaultValue: "''",
      description: 'Optional leading image URL.',
    },
    {
      name: 'imageAlt',
      type: 'string',
      defaultValue: "''",
      description: 'Alternative text used when the image is the chip’s only meaningful content.',
    },
    {
      name: 'removable',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Shows the native remove button.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Disables removal while keeping the chip visible.',
    },
    {
      name: 'size',
      type: 'AerisChipSize',
      defaultValue: "'md'",
      description: 'Sets chip height, padding, and typography.',
    },
    {
      name: 'variant',
      type: 'AerisChipVariant',
      defaultValue: "'soft'",
      description: 'Sets a soft filled or outline appearance.',
    },
    {
      name: 'tone',
      type: 'AerisChipTone',
      defaultValue: "'neutral'",
      description: 'Sets the palette-aware visual tone.',
    },
    {
      name: 'shape',
      type: 'AerisChipShape',
      defaultValue: "'pill'",
      description: 'Sets pill or rounded corners.',
    },
    {
      name: 'removeAriaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides the remove button accessible name.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "''",
      description: 'Accessible name for custom projected chip content.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that labels custom projected chip content.',
    },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    {
      name: 'visibleChange',
      type: 'boolean',
      defaultValue: '-',
      description: 'Implicit model output emitted when visibility changes.',
    },
    {
      name: 'removed',
      type: 'AerisChipRemoveEvent',
      defaultValue: '-',
      description: 'Emits after pointer, keyboard, or API removal.',
    },
  ];

  protected readonly content: readonly ApiRow[] = [
    {
      name: 'default content',
      type: 'content projection',
      defaultValue: '-',
      description:
        'Custom chip content rendered alongside image, leading content, and remove action.',
    },
    {
      name: 'aerisChipLeading',
      type: 'attribute projection',
      defaultValue: '-',
      description: 'Marks a consumer-provided leading icon as decorative.',
    },
    {
      name: 'aerisChipRemoveIcon',
      type: 'TemplateRef<AerisChipRemoveIconContext>',
      defaultValue: '-',
      description: 'Replaces the Aeris-owned default remove icon.',
    },
  ];

  protected readonly methods: readonly ApiRow[] = [
    {
      name: 'remove(originalEvent?)',
      type: '(Event | null) => void',
      defaultValue: '-',
      description: 'Removes a visible, removable, enabled chip.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-chip-height',
      purpose: 'Default chip height.',
      fallback: 'control height − 0.5rem',
    },
    {
      name: '--aeris-chip-sm-height',
      purpose: 'Small chip height.',
      fallback: 'control height − 0.875rem',
    },
    {
      name: '--aeris-chip-lg-height',
      purpose: 'Large chip height.',
      fallback: 'control height + 0.125rem',
    },
    { name: '--aeris-chip-padding-block', purpose: 'Vertical padding.', fallback: '0.25rem' },
    { name: '--aeris-chip-padding-inline', purpose: 'Horizontal padding.', fallback: '0.75rem' },
    { name: '--aeris-chip-gap', purpose: 'Internal content gap.', fallback: 'density gap × 0.75' },
    { name: '--aeris-chip-font-size', purpose: 'Default label size.', fallback: '0.8125rem' },
    { name: '--aeris-chip-font-weight', purpose: 'Label weight.', fallback: '650' },
    {
      name: '--aeris-chip-radius',
      purpose: 'Rounded shape radius.',
      fallback: '--aeris-radius-md',
    },
    {
      name: '--aeris-chip-icon-size',
      purpose: 'Leading icon size.',
      fallback: '--aeris-icon-size',
    },
    { name: '--aeris-chip-remove-size', purpose: 'Remove button dimensions.', fallback: '1.25rem' },
    {
      name: '--aeris-chip-remove-icon-size',
      purpose: 'Default remove icon dimensions.',
      fallback: '0.75rem',
    },
  ];

  protected recordRemoval(event: AerisChipRemoveEvent): void {
    this.removalStatus.set(`Removed ${event.label}.`);
  }

  protected restoreChip(): void {
    this.removableVisible.set(true);
    this.removalStatus.set('Photography is selected.');
  }
}
