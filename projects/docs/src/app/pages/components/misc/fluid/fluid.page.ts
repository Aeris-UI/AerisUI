import { Component, signal } from '@angular/core';
import { AerisButton } from '@aeris-ui/core/button';
import { AerisFluidModule } from '@aeris-ui/core/fluid';
import { AerisInputText } from '@aeris-ui/core/input-text';
import { AerisTabsModule } from '@aeris-ui/core/tabs';
import { AerisTextarea } from '@aeris-ui/core/textarea';

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
  selector: 'app-fluid-page',
  imports: [
    AerisButton,
    AerisFluidModule,
    AerisInputText,
    AerisTabsModule,
    AerisTextarea,
    CodeBlockComponent,
    ComponentPageHeaderComponent,
    FormDemoComponent,
    PageTocComponent,
    ProjectedCode,
  ],
  templateUrl: './fluid.page.html',
  styleUrl: './fluid.page.scss',
})
export class FluidPage {
  protected readonly fluidEnabled = signal(true);
  protected readonly importCode = `import { AerisFluidModule } from '@aeris-ui/core/fluid';`;

  protected readonly featureLinks: readonly PageTocLink[] = [
    { id: 'fluid-import', label: 'Import' },
    { id: 'fluid-basic', label: 'Basic' },
    { id: 'fluid-comparison', label: 'Comparison' },
    { id: 'fluid-controlled', label: 'Controlled' },
    { id: 'fluid-responsive', label: 'Responsive layout' },
  ];

  protected readonly apiLinks: readonly PageTocLink[] = [
    { id: 'fluid-import', label: 'Import' },
    { id: 'fluid-api-inputs', label: 'Inputs' },
    { id: 'fluid-api-content', label: 'Content' },
  ];

  protected readonly formCssCode = `.fluid-form {
  display: grid;
  gap: 1rem;
}

.fluid-field {
  display: grid;
  gap: 0.375rem;
}

.fluid-field label {
  font-weight: 650;
}`;

  protected readonly comparisonCssCode = `.fluid-comparison {
  display: grid;
  gap: 1rem;
}

.fluid-example {
  min-width: 0;
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--aeris-border);
  border-radius: var(--aeris-radius-lg);
}

.fluid-example h4 {
  margin: 0;
}`;

  protected readonly controlledTsCode = `protected readonly fluidEnabled = signal(true);

protected toggleFluid(): void {
  this.fluidEnabled.update((enabled) => !enabled);
}`;

  protected readonly controlledCssCode = `.fluid-controlled {
  display: grid;
  gap: 1rem;
}

.fluid-controlled__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.fluid-controlled__actions span {
  color: var(--aeris-text-2);
}`;

  protected readonly responsiveCssCode = `.fluid-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}

.fluid-grid label {
  min-width: 0;
  display: grid;
  gap: 0.375rem;
  font-weight: 650;
}

.fluid-grid__action {
  display: flex;
  align-items: end;
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'enabled',
      type: 'boolean',
      defaultValue: 'true',
      description: 'Enables or disables full-width sizing for compatible descendant controls.',
    },
  ];

  protected readonly content: readonly ApiRow[] = [
    {
      name: 'default content',
      type: 'content projection',
      defaultValue: '-',
      description: 'Layout and compatible Aeris controls that receive fluid sizing.',
    },
  ];

  protected readonly tokens: readonly TokenRow[] = [
    {
      name: '--aeris-fluid-inline-size',
      purpose: 'Inline size of the Fluid host and compatible descendants.',
      fallback: '100%',
    },
    {
      name: '--aeris-fluid-min-inline-size',
      purpose: 'Minimum inline size used to prevent overflow in flexible layouts.',
      fallback: '0',
    },
  ];

  protected toggleFluid(): void {
    this.fluidEnabled.update((enabled) => !enabled);
  }
}
