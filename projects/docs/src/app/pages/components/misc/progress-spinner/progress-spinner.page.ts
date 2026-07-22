import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import {
  AerisProgressSpinnerModule,
  type AerisProgressSpinnerValueContext,
} from '@aeris-ui/core/progress-spinner';
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

interface TokenRow {
  readonly name: string;
  readonly purpose: string;
  readonly fallback: string;
}

@Component({
  selector: 'app-progress-spinner-page',
  imports: [
    AerisButton,
    AerisProgressSpinnerModule,
    AerisTabsModule,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './progress-spinner.page.html',
  styleUrl: './progress-spinner.page.scss',
})
export class ProgressSpinnerPage {
  protected readonly progress = signal(35);
  protected readonly importCode = `import { AerisProgressSpinnerModule } from '@aeris-ui/core/progress-spinner';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'progress-spinner-import', label: 'Import' },
    { id: 'progress-spinner-indeterminate', label: 'Indeterminate' },
    { id: 'progress-spinner-determinate', label: 'Determinate' },
    { id: 'progress-spinner-dynamic', label: 'Dynamic' },
    { id: 'progress-spinner-sizes', label: 'Sizes' },
    { id: 'progress-spinner-tones', label: 'Tones' },
    { id: 'progress-spinner-custom', label: 'Customization' },
    { id: 'progress-spinner-template', label: 'Value template' },
    { id: 'progress-spinner-tokens', label: 'Tokens' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'progress-spinner-import', label: 'Import' },
    { id: 'progress-spinner-api-inputs', label: 'Inputs' },
    { id: 'progress-spinner-api-templates', label: 'Templates' },
  ];

  protected readonly rowCssCode = `.spinner-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
}`;

  protected readonly dynamicTsCode = `protected readonly progress = signal(35);

protected decreaseProgress(): void {
  this.progress.update((value) => Math.max(0, value - 10));
}

protected increaseProgress(): void {
  this.progress.update((value) => Math.min(100, value + 10));
}

protected resetProgress(): void {
  this.progress.set(0);
}`;

  protected readonly dynamicCssCode = `.spinner-dynamic {
  display: grid;
  justify-items: start;
  gap: 1rem;
}

.spinner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}`;

  protected readonly customCssCode = `.brand-spinner {
  --aeris-progress-spinner-size: 6rem;
  --aeris-progress-spinner-indicator: var(--aeris-info);
  --aeris-progress-spinner-track: color-mix(
    in srgb,
    var(--aeris-info) 18%,
    transparent
  );
  --aeris-progress-spinner-value-color: var(--aeris-info);
  --aeris-progress-spinner-value-font-size: 0.875rem;
  --aeris-progress-spinner-duration: 800ms;
}`;

  protected readonly templateTsCode = `import { type AerisProgressSpinnerValueContext } from '@aeris-ui/core/progress-spinner';

protected readonly fileFormatter = (
  context: AerisProgressSpinnerValueContext,
): string => \`\${context.value} of \${context.max} files processed\`;`;

  protected readonly templateCssCode = `.spinner-value-template {
  display: grid;
  place-items: center;
  gap: 0.125rem;
  line-height: 1;
}

.spinner-value-template strong {
  font-size: 0.875rem;
}

.spinner-value-template small {
  color: var(--aeris-text-2);
  font-size: 0.5625rem;
  text-transform: uppercase;
}`;

  protected readonly tokenCssCode = `.token-spinner {
  --aeris-progress-spinner-size: 5.5rem;
  --aeris-progress-spinner-indicator: var(--aeris-success);
  --aeris-progress-spinner-track: color-mix(
    in srgb,
    var(--aeris-success) 22%,
    transparent
  );
  --aeris-progress-spinner-value-color: var(--aeris-success);
  --aeris-progress-spinner-value-font-size: 0.875rem;
}`;

  protected readonly interfacesCode = `type AerisProgressSpinnerSize = 'sm' | 'md' | 'lg';
type AerisProgressSpinnerTone =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'contrast';

interface AerisProgressSpinnerValueContext {
  readonly $implicit: number;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly percent: number;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'value',
      type: 'number | null',
      defaultValue: 'null',
      description: 'Numeric progress value; null selects indeterminate mode.',
    },
    { name: 'min', type: 'number', defaultValue: '0', description: 'Minimum determinate value.' },
    { name: 'max', type: 'number', defaultValue: '100', description: 'Maximum determinate value.' },
    {
      name: 'size',
      type: 'AerisProgressSpinnerSize',
      defaultValue: "'md'",
      description: 'Sets small, medium, or large diameter.',
    },
    {
      name: 'tone',
      type: 'AerisProgressSpinnerTone',
      defaultValue: "'primary'",
      description: 'Sets the palette-aware indicator tone.',
    },
    {
      name: 'strokeWidth',
      type: 'number',
      defaultValue: '4',
      description: 'Sets SVG stroke width, clamped from 1 through 12.',
    },
    {
      name: 'showTrack',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows the background progress track.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Shows centered determinate value text except at small size.',
    },
    {
      name: 'rounded',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Uses rounded or square indicator line caps.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      defaultValue: "'Loading'",
      description: 'Accessible name for the progressbar.',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      defaultValue: "''",
      description: 'ID of visible text that labels the progressbar.',
    },
    {
      name: 'ariaValueText',
      type: 'string',
      defaultValue: "''",
      description: 'Overrides generated determinate value text.',
    },
    {
      name: 'valueFormatter',
      type: '((context: AerisProgressSpinnerValueContext) => string) | null',
      defaultValue: 'null',
      description: 'Formats the default visible and accessible value text.',
    },
  ];

  protected readonly templates: readonly ApiRow[] = [
    {
      name: 'aerisProgressSpinnerValue',
      type: 'TemplateRef<AerisProgressSpinnerValueContext>',
      defaultValue: '-',
      description: 'Custom centered content for determinate mode.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-progress-spinner-size',
      purpose: 'Medium or custom spinner diameter.',
      fallback: '3rem',
    },
    {
      name: '--aeris-progress-spinner-sm-size',
      purpose: 'Small spinner diameter.',
      fallback: '1.75rem',
    },
    {
      name: '--aeris-progress-spinner-lg-size',
      purpose: 'Large spinner diameter.',
      fallback: '4.5rem',
    },
    {
      name: '--aeris-progress-spinner-indicator',
      purpose: 'Indicator stroke color.',
      fallback: 'selected tone',
    },
    {
      name: '--aeris-progress-spinner-track',
      purpose: 'Background track color.',
      fallback: '16% selected tone',
    },
    {
      name: '--aeris-progress-spinner-duration',
      purpose: 'Indeterminate animation duration.',
      fallback: '1.1s',
    },
    {
      name: '--aeris-progress-spinner-value-color',
      purpose: 'Centered value color.',
      fallback: '--aeris-text',
    },
    {
      name: '--aeris-progress-spinner-value-font-size',
      purpose: 'Medium centered value size.',
      fallback: '0.6875rem',
    },
    {
      name: '--aeris-progress-spinner-lg-value-font-size',
      purpose: 'Large centered value size.',
      fallback: '0.875rem',
    },
  ];

  protected readonly fileFormatter = (context: AerisProgressSpinnerValueContext): string =>
    `${context.value} of ${context.max} files processed`;

  protected decreaseProgress(): void {
    this.progress.update((value) => Math.max(0, value - 10));
  }

  protected increaseProgress(): void {
    this.progress.update((value) => Math.min(100, value + 10));
  }

  protected resetProgress(): void {
    this.progress.set(0);
  }
}
